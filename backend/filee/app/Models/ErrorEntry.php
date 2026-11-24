<?php

// ErrorEntry.php
// One entry in the Error Fix Journal: an error you met and how you fixed it.

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErrorEntry extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'error_message',
        'cause',
        'fix',
        'code_snippet',
        'source_url',
        'seen_count',
        'is_favorite',
        'last_seen_at',
    ];

    // is_favorite comes back as true or false. last_seen_at becomes a date object.
    protected $casts = [
        'seen_count' => 'integer',
        'is_favorite' => 'boolean',
        'last_seen_at' => 'datetime',
    ];

    // The user who wrote this entry.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // The tags of this entry. They are linked through the "error_entry_tag" table.
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
