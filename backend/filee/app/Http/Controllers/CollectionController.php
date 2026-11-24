<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CollectionController
{
    public function index()
    {
        return DB::table('collections')->orderByDesc('school_year')->orderByDesc('id')->get();
    }

    public function show(int $id)
    {
        $collection = DB::table('collections')->find($id);
        abort_unless($collection, 404);
        $collection->students = $this->students($id)->orderBy('name')->orderBy('student_id')->get();

        return response()->json($collection);
    }

    public function store(Request $request)
    {
        $data = $this->validateCollection($request);
        $id = DB::table('collections')->insertGetId($data + ['created_at' => now(), 'updated_at' => now()]);

        return $this->show($id);
    }

    public function update(Request $request, int $id)
    {
        $data = $this->validateCollection($request);
        DB::transaction(function () use ($id, $data) {
            $collection = $this->lockCollection($id);
            if ((int) $collection->amount_cents !== $data['amount_cents']) {
                if ($this->students($id)->where('paid_cents', '>', 0)->exists()) {
                    throw ValidationException::withMessages(['amount' => 'The amount cannot change after payments have been recorded.']);
                }

                $this->students($id)->where('due_cents', $collection->amount_cents)
                    ->update(['due_cents' => $data['amount_cents']]);
            }
            DB::table('collections')->where('id', $id)->update($data + ['updated_at' => now()]);
        });

        return $this->show($id);
    }

    public function addStudent(Request $request, int $id)
    {
        $student = $request->validate($this->studentRules());
        $this->saveRoster($id, [$student]);

        return response()->json(['message' => 'Student saved.']);
    }

    public function renameStudent(Request $request, int $id)
    {
        $student = $request->validate($this->studentRules());
        DB::transaction(function () use ($id, $student) {
            $this->lockCollection($id);
            $row = $this->students($id)->where('student_id', $student['student_id']);
            abort_unless($row->exists(), 404);
            $row->update(['name' => $student['name']]);
        });

        return response()->json(['message' => 'Student name updated.']);
    }

    public function removeStudent(Request $request, int $id)
    {
        $data = $request->validate(['student_id' => 'required|string|max:255']);
        DB::transaction(function () use ($id, $data) {
            $this->lockCollection($id);
            $row = $this->students($id)->where('student_id', $data['student_id']);
            $student = $row->first();
            abort_unless($student, 404);
            abort_if($student->paid_cents > 0, 409, 'A student with a payment cannot be removed.');
            $row->delete();
        });

        return response()->noContent();
    }

    public function payment(Request $request, int $id)
    {
        $data = $request->validate([
            'student_id' => 'required|string|max:255',
            'paid' => 'required|boolean',
            'or_number' => 'nullable|required_if:paid,true,1|string|max:500',
        ]);

        DB::transaction(function () use ($id, $data) {
            $this->lockCollection($id);
            $row = $this->students($id)->where('student_id', $data['student_id']);
            $student = $row->first();
            abort_unless($student, 404);
            $paid = (bool) $data['paid'];
            $row->update([
                'paid_cents' => $paid ? max($student->due_cents, $student->paid_cents) : 0,
                'or_number' => $paid ? $data['or_number'] : null,
            ]);
        });

        return response()->json(['message' => 'Payment updated.']);
    }

    public function import(Request $request, int $id)
    {
        $request->validate(['csv' => 'required|file|max:2048']);
        $stream = fopen($request->file('csv')->getRealPath(), 'r');
        $students = [];
        try {
            $header = fgetcsv($stream, 0, ',', '"', '');
            $columns = array_map(fn ($value) => strtolower(trim((string) $value)), $header ?: []);
            if ($columns) {
                $columns[0] = preg_replace('/^\xEF\xBB\xBF/', '', $columns[0]);
            }
            $idColumn = array_search('student_id', $columns, true);
            $nameColumn = array_search('name', $columns, true);
            $recordTypeColumn = array_search('record_type', $columns, true);
            if ($idColumn === false || $nameColumn === false) {
                throw ValidationException::withMessages(['csv' => 'The CSV needs student_id and name column headers.']);
            }

            $line = 1;
            while (($row = fgetcsv($stream, 0, ',', '"', '')) !== false) {
                $line++;
                if (! array_filter($row, fn ($value) => trim((string) $value) !== '')) {
                    continue;
                }
                $student = [
                    'student_id' => trim($row[$idColumn] ?? ''),
                    'name' => trim($row[$nameColumn] ?? ''),
                ];
                if ($recordTypeColumn !== false && $student['student_id'] === '' && ($row[$recordTypeColumn] ?? '') === 'total') {
                    continue;
                }
                if (! mb_check_encoding($student, 'UTF-8') || validator($student, $this->studentRules())->fails()) {
                    throw ValidationException::withMessages(['csv' => "Row {$line} needs a valid student ID and name. Save the file in UTF-8."]);
                }
                $key = mb_strtolower($student['student_id'], 'UTF-8');
                if (isset($students[$key])) {
                    throw ValidationException::withMessages(['csv' => "Duplicate student ID on row {$line}."]);
                }
                $students[$key] = $student;
            }
        } finally {
            fclose($stream);
        }

        if (! $students) {
            throw ValidationException::withMessages(['csv' => 'No student rows were found.']);
        }
        $this->saveRoster($id, array_values($students));

        return response()->json(['message' => count($students).' student rows imported.']);
    }

    public function export(int $id)
    {
        $collection = DB::table('collections')->find($id);
        abort_unless($collection, 404);

        return response()->streamDownload(function () use ($id, $collection) {
            $stream = fopen('php://output', 'w');
            fwrite($stream, "\xEF\xBB\xBF");
            fputcsv($stream, ['student_id', 'name', 'school_year', 'collection', 'amount_due', 'amount_paid', 'balance', 'status', 'or_number', 'record_type'], ',', '"', '');
            $dueTotal = $paidTotal = $balanceTotal = 0;
            foreach ($this->students($id)->orderBy('student_id')->cursor() as $student) {
                $balance = max(0, $student->due_cents - $student->paid_cents);
                $dueTotal += $student->due_cents;
                $paidTotal += $student->paid_cents;
                $balanceTotal += $balance;
                fputcsv($stream, [
                    $this->csvText($student->student_id),
                    $this->csvText($student->name),
                    $this->csvText($collection->school_year),
                    $this->csvText($collection->name),
                    number_format($student->due_cents / 100, 2, '.', ''),
                    number_format($student->paid_cents / 100, 2, '.', ''),
                    number_format($balance / 100, 2, '.', ''),
                    $balance === 0 ? 'Paid' : ($student->paid_cents > 0 ? 'Partial' : 'Unpaid'),
                    $this->csvText($student->or_number ?? ''),
                    'student',
                ], ',', '"', '');
            }
            fputcsv($stream, [
                '', 'Total', $this->csvText($collection->school_year), $this->csvText($collection->name),
                number_format($dueTotal / 100, 2, '.', ''),
                number_format($paidTotal / 100, 2, '.', ''),
                number_format($balanceTotal / 100, 2, '.', ''),
                '', '', 'total',
            ], ',', '"', '');
            fclose($stream);
        }, "collection-{$id}.csv", ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function csvText(string $text): string
    {
        // Prevent a spreadsheet from interpreting user-supplied text as a formula.
        return preg_match('/^(?:\s*[=+\-@]|\p{Cc})/u', $text) ? "'".$text : $text;
    }

    private function validateCollection(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'school_year' => 'required|string|max:30',
            'expected_students' => 'required|integer|min:0|max:100000',
            'amount' => 'required|numeric|decimal:0,2|min:0.01|max:99999999.99',
            'resolution_id' => 'nullable|integer|exists:resolutions,id',
        ]);
        $data['amount_cents'] = (int) round($data['amount'] * 100);
        unset($data['amount']);

        return $data;
    }

    private function studentRules(): array
    {
        return [
            'student_id' => ['required', 'string', 'max:255', 'not_regex:/\p{Cc}/u'],
            'name' => ['required', 'string', 'max:255', 'not_regex:/\p{Cc}/u'],
        ];
    }

    private function students(int $id)
    {
        return DB::table('collection_students')->where('collection_id', $id);
    }

    private function lockCollection(int $id)
    {
        $collection = DB::table('collections')->where('id', $id)->lockForUpdate()->first();
        abort_unless($collection, 404);

        return $collection;
    }

    private function saveRoster(int $id, array $students): void
    {
        DB::transaction(function () use ($id, $students) {
            $collection = $this->lockCollection($id);
            foreach (array_chunk($students, 500) as $chunk) {
                $rows = array_map(fn ($student) => $student + [
                    'collection_id' => $id,
                    'due_cents' => $collection->amount_cents,
                ], $chunk);
                DB::table('collection_students')->upsert($rows, ['collection_id', 'student_id'], ['name']);
            }
        });
    }
}
