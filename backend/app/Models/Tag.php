<?php

// Tag.php
// A tag is a short label for journal entries, like "Laravel" or "CORS".

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [
        'name',
    ];

    // The journal entries that have this tag.
    public function errorEntries()
    {
        return $this->belongsToMany(ErrorEntry::class);
    }
}
