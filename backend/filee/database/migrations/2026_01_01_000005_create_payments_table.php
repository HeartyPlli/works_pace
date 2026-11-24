<?php

// This migration creates the "payments" table.
// A payment is money paid for ONE student charge. A student can pay in parts,
// so one student charge can have many payments.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_charge_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->date('paid_at');
            $table->string('receipt_no');
            // The officer who received the money.
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
