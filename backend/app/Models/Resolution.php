<?php

// Resolution.php
// A resolution of the student council, numbered like "Resolution No. 0004, Series of 2026".

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resolution extends Model
{
    // The columns we are allowed to fill with create() or update().
    protected $fillable = [
        'number',
        'series_year',
        'title',
        'whereas_text',
        'resolved_text',
        'date_adopted',
        'status',
        'created_by',
    ];

    // Make sure numbers come back as numbers, not text.
    protected $casts = [
        'number' => 'integer',
        'series_year' => 'integer',
    ];

    // The user who created this resolution.
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // The charges (fees or penalties) that this resolution approved.
    public function charges()
    {
        return $this->hasMany(Charge::class);
    }
}
