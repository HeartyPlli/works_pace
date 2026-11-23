<?php

// Charge.php
// A charge is a fee or a penalty, like "Membership Fee" or "Absence Penalty".

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Charge extends Model
{
    protected $fillable = [
        'name',
        'type',
        'amount',
        'school_year',
        'resolution_id',
    ];

    // Send the amount as a number (150.5), not as text ("150.50").
    protected $casts = [
        'amount' => 'float',
    ];

    // The resolution that approved this charge (can be empty).
    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }

    // Every time this charge was given to a student.
    public function studentCharges()
    {
        return $this->hasMany(StudentCharge::class);
    }
}
