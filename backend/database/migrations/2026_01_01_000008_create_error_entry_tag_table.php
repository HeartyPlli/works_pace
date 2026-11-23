<?php

// This migration creates the "error_entry_tag" table.
// It connects entries and tags. One entry can have many tags,
// and one tag can be on many entries. This kind of table is called a "pivot table".

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('error_entry_tag', function (Blueprint $table) {
            $table->foreignId('error_entry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();

            // The same tag cannot be added twice to the same entry.
            $table->primary(['error_entry_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('error_entry_tag');
    }
};
