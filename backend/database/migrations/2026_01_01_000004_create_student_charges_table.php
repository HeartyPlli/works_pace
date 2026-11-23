<?php

// This migration creates the "student_charges" table.
// Each row means: "this student must pay this charge".
// amount_due is copied from the charge, but it can be different (for example a discount).

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_charges', function (Blueprint $table) {
            $table->id();
            // If the student or the charge is deleted, these rows are deleted too (cascade).
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('charge_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount_due', 10, 2);
            $table->date('date_incurred');
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_charges');
    }
};
