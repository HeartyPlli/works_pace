<?php

// StudentChargeController.php
// Gives (assigns) one charge to one student or to many students at once.

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Charge;
use App\Models\StudentCharge;
use Illuminate\Http\Request;

class StudentChargeController extends Controller
{
    // POST /api/student-charges
    // Example body: { "charge_id": 1, "student_ids": [1, 2, 3], "date_incurred": "2026-08-15" }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'charge_id' => 'required|exists:charges,id',
            // student_ids must be a list with at least one student.
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'exists:students,id',
            'amount_due' => 'nullable|numeric|min:0',
            'date_incurred' => 'required|date',
            'remarks' => 'nullable|string|max:255',
        ]);

        $charge = Charge::findOrFail($validated['charge_id']);

        // If no amount was sent, use the normal amount of the charge.
        $amountDue = $charge->amount;
        if ($request->filled('amount_due')) {
            $amountDue = $validated['amount_due'];
        }

        // Make one student charge for each student in the list.
        $count = 0;
        foreach ($validated['student_ids'] as $studentId) {
            StudentCharge::create([
                'student_id' => $studentId,
                'charge_id' => $charge->id,
                'amount_due' => $amountDue,
                'date_incurred' => $validated['date_incurred'],
                'remarks' => $validated['remarks'] ?? null,
            ]);
            $count = $count + 1;
        }

        return response()->json([
            'message' => $charge->name.' was assigned to '.$count.' student(s).',
        ], 201);
    }
}
