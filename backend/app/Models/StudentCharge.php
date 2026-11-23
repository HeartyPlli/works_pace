<?php

// StudentCharge.php
// One charge given to one student. Example: "Maria must pay the Membership Fee of PHP 150".
// Balance = amount_due minus all the payments for it.

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentCharge extends Model
{
    protected $fillable = [
        'student_id',
        'charge_id',
        'amount_due',
        'date_incurred',
        'remarks',
    ];

    protected $casts = [
        'amount_due' => 'float',
    ];

    // The student who must pay.
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    // The charge (fee or penalty).
    public function charge()
    {
        return $this->belongsTo(Charge::class);
    }

    // All the payments made for this charge.
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Adds up all the payments for this charge.
    public function totalPaid()
    {
        return round($this->payments->sum('amount'), 2);
    }

    // What the student still owes for this charge.
    public function balance()
    {
        return round($this->amount_due - $this->totalPaid(), 2);
    }
}
