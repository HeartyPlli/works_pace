<?php

// StudentController.php
// Add, edit, delete, list, and search students.
// It also builds the ledger: one student's charges, payments, and balance.

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentCharge;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // GET /api/students?search=maria
    public function index(Request $request)
    {
        $query = Student::query();

        // Search by name or by student number.
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('name', 'like', '%'.$search.'%')
                    ->orWhere('student_no', 'like', '%'.$search.'%');
            });
        }

        $students = $query->orderBy('name')->get();

        return response()->json($students);
    }

    // POST /api/students
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_no' => 'required|string|max:50|unique:students,student_no',
            'name' => 'required|string|max:255',
            'program' => 'required|string|max:100',
            'year_level' => 'required|integer|min:1|max:5',
            'section' => 'required|string|max:50',
        ], [], [
            // Nicer field name for error messages: "The student number has already been taken."
            'student_no' => 'student number',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student saved.',
            'student' => $student,
        ], 201);
    }

    // PUT /api/students/{id}
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            // The student number must be unique, but this student may keep their own number.
            'student_no' => 'required|string|max:50|unique:students,student_no,'.$student->id,
            'name' => 'required|string|max:255',
            'program' => 'required|string|max:100',
            'year_level' => 'required|integer|min:1|max:5',
            'section' => 'required|string|max:50',
        ], [], [
            'student_no' => 'student number',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated.',
            'student' => $student,
        ]);
    }

    // DELETE /api/students/{id}
    // The database also deletes this student's charges and payments (cascade).
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json([
            'message' => 'Student deleted.',
        ]);
    }

    // GET /api/students/{id}/ledger
    // Builds a list of the student's charges and payments, and adds up the totals.
    public function ledger($id)
    {
        $student = Student::findOrFail($id);

        // Get the student's charges, with the charge name and the payments.
        $studentCharges = StudentCharge::with(['charge', 'payments.receiver'])
            ->where('student_id', $student->id)
            ->orderBy('date_incurred')
            ->get();

        $charges = [];
        $payments = [];
        $totalDue = 0;
        $totalPaid = 0;

        foreach ($studentCharges as $studentCharge) {
            $charges[] = [
                'id' => $studentCharge->id,
                'charge_name' => $studentCharge->charge->name,
                'type' => $studentCharge->charge->type,
                'date_incurred' => $studentCharge->date_incurred,
                'remarks' => $studentCharge->remarks,
                'amount_due' => $studentCharge->amount_due,
                'total_paid' => $studentCharge->totalPaid(),
                'balance' => $studentCharge->balance(),
            ];

            foreach ($studentCharge->payments as $payment) {
                $payments[] = [
                    'id' => $payment->id,
                    'charge_name' => $studentCharge->charge->name,
                    'amount' => $payment->amount,
                    'paid_at' => $payment->paid_at,
                    'receipt_no' => $payment->receipt_no,
                    'received_by_name' => $payment->receiver ? $payment->receiver->name : null,
                ];
            }

            $totalDue = $totalDue + $studentCharge->amount_due;
            $totalPaid = $totalPaid + $studentCharge->totalPaid();
        }

        return response()->json([
            'student' => $student,
            'charges' => $charges,
            'payments' => $payments,
            'total_due' => round($totalDue, 2),
            'total_paid' => round($totalPaid, 2),
            'balance' => round($totalDue - $totalPaid, 2),
        ]);
    }
}
