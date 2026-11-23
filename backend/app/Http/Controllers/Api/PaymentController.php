<?php

// PaymentController.php
// Records a payment for a student's charge.
// A student can pay in parts, but cannot pay more than the balance.

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\StudentCharge;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // POST /api/payments
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_charge_id' => 'required|exists:student_charges,id',
            'amount' => 'required|numeric|min:0.01',
            'paid_at' => 'required|date',
            'receipt_no' => 'required|string|max:50',
        ]);

        // Load the student charge with its payments, so we can find the balance.
        $studentCharge = StudentCharge::with('payments')->findOrFail($validated['student_charge_id']);
        $balance = $studentCharge->balance();

        // Do not allow paying more than what is still owed.
        if (round($validated['amount'], 2) > $balance) {
            return response()->json([
                'message' => 'The payment is bigger than the balance. The balance is only PHP '.number_format($balance, 2).'.',
            ], 422);
        }

        // Remember which officer received the money.
        $validated['received_by'] = $request->user()->id;

        $payment = Payment::create($validated);

        return response()->json([
            'message' => 'Payment saved.',
            'payment' => $payment,
        ], 201);
    }
}
