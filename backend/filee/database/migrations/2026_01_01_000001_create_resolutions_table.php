<?php

// This migration creates the "resolutions" table.
// A resolution is numbered like "Resolution No. 0004, Series of 2026".
// The number starts again at 1 every series year, so the pair
// (series_year, number) must be unique.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resolutions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('number');
            $table->unsignedSmallInteger('series_year');
            $table->string('title');
            $table->text('whereas_text')->nullable();
            $table->text('resolved_text')->nullable();
            $table->date('date_adopted')->nullable();
            $table->enum('status', ['draft', 'adopted', 'filed'])->default('draft');
            // The user who created it. If that user is deleted, this becomes empty (null).
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Two resolutions cannot have the same number in the same year.
            $table->unique(['series_year', 'number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resolutions');
    }
};
