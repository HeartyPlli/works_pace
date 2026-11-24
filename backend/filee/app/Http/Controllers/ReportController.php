<?php

// ReportController.php
// Builds the "unpaid" report: every student who still owes money.

namespace App\Http\Controllers;

use App\Models\Student;

class ReportController
{
    // GET /api/reports/unpaid
    public function unpaid()
    {
        // Get every student with their charges and the payments of those charges.
        $students = Student::with('studentCharges.payments')->orderBy('name')->get();

        $rows = [];
        $totalOwed = 0;

        foreach ($students as $student) {
            // Add up this student's charges and payments.
            $totalDue = 0;
            $totalPaid = 0;
            foreach ($student->studentCharges as $studentCharge) {
                $totalDue = $totalDue + $studentCharge->amount_due;
                $totalPaid = $totalPaid + $studentCharge->totalPaid();
            }

            $balance = round($totalDue - $totalPaid, 2);

            // Only students who still owe money go in the report.
            if ($balance > 0) {
                $rows[] = [
                    'id' => $student->id,
                    'student_no' => $student->student_no,
                    'name' => $student->name,
                    'program' => $student->program,
                    'year_level' => $student->year_level,
                    'section' => $student->section,
                    'total_due' => round($totalDue, 2),
                    'total_paid' => round($totalPaid, 2),
                    'balance' => $balance,
                ];
                $totalOwed = $totalOwed + $balance;
            }
        }

        return response()->json([
            'students' => $rows,
            'total_owed' => round($totalOwed, 2),
        ]);
    }
}
