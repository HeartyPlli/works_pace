<?php

// Payment.php
// Money paid by a student for one of their charges.

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'student_charge_id',
        'amount',
        'paid_at',
        'receipt_no',
        'received_by',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    // The student charge that this payment is for.
    public function studentCharge()
    {
        return $this->belongsTo(StudentCharge::class);
    }

    // The officer who received the money.
    public function receiver()
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
