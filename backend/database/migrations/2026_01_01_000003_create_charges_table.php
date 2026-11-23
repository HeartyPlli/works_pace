<?php

// This migration creates the "charges" table.
// A charge is a fee (example: Membership Fee) or a penalty (example: Absence Penalty).
// It can be linked to the resolution that approved it.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('charges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['fee', 'penalty']);
            // decimal(10, 2) means up to 10 digits, with 2 digits after the dot (example: 150.00)
            $table->decimal('amount', 10, 2);
            $table->string('school_year');
            // If the resolution is deleted, this link becomes empty (null).
            $table->foreignId('resolution_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('charges');
    }
};
