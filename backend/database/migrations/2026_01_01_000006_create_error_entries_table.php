<?php

// This migration creates the "error_entries" table for the Error Fix Journal.
// Each row is one bug you solved: the error, why it happened, and how you fixed it.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('error_entries', function (Blueprint $table) {
            $table->id();
            // The user who wrote the entry.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('error_message');
            $table->text('cause')->nullable();
            $table->text('fix');
            $table->text('code_snippet')->nullable();
            $table->string('source_url', 500)->nullable();
            // How many times you met this error. It starts at 1.
            $table->unsignedInteger('seen_count')->default(1);
            $table->boolean('is_favorite')->default(false);
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('error_entries');
    }
};
