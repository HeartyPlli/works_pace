<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type', 24);
            $table->date('document_date');
            $table->longText('body')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('attachment_name')->nullable();
            $table->timestamps();
        });

        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('school_year', 30);
            $table->unsignedInteger('expected_students');
            $table->unsignedBigInteger('amount_cents');
            $table->foreignId('resolution_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('collection_students', function (Blueprint $table) {
            $table->foreignId('collection_id')->constrained()->cascadeOnDelete();
            $table->string('student_id', 255);
            $table->primary(['collection_id', 'student_id']);
            $table->string('name');
            $table->unsignedBigInteger('due_cents');
            $table->unsignedBigInteger('paid_cents')->default(0);
            $table->text('or_number')->nullable();
        });

        // Copy legacy balances and receipt references. Keep the original payment history in place.
        DB::transaction(function () {
            DB::table('charges')->orderBy('id')->chunkById(100, function ($charges) {
                foreach ($charges as $charge) {
                    $assignments = DB::table('student_charges')
                        ->join('students', 'students.id', '=', 'student_charges.student_id')
                        ->where('charge_id', $charge->id)
                        ->select('student_charges.*', 'students.student_no', 'students.name')
                        ->get()
                        ->groupBy('student_no');

                    $collection = DB::table('collections')->insertGetId([
                        'name' => $charge->name,
                        'school_year' => $charge->school_year,
                        'expected_students' => $assignments->count(),
                        'amount_cents' => (int) round($charge->amount * 100),
                        'resolution_id' => $charge->resolution_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    foreach ($assignments as $studentId => $rows) {
                        $payments = DB::table('payments')->whereIn('student_charge_id', $rows->pluck('id'))->get();
                        $receipts = $payments->pluck('receipt_no')->filter()->unique()->implode(', ');
                        DB::table('collection_students')->insert([
                            'collection_id' => $collection,
                            'student_id' => $studentId,
                            'name' => $rows->first()->name,
                            'due_cents' => $rows->sum(fn ($row) => (int) round($row->amount_due * 100)),
                            'paid_cents' => $payments->sum(fn ($row) => (int) round($row->amount * 100)),
                            'or_number' => $receipts === '' ? null : $receipts,
                        ]);
                    }
                }
            });
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_students');
        Schema::dropIfExists('collections');
        Schema::dropIfExists('documents');
    }
};
