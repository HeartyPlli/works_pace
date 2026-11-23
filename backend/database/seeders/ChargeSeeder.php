<?php

// ChargeSeeder.php
// Makes 2 sample charges, gives them to students, and adds some payments.
// After this seeder:
//   - all 20 students owe the Membership Fee (PHP 150)
//   - the first 10 students paid it in full
//   - the next 4 students paid only part of it
//   - 5 students got the Absence Penalty (PHP 25), and 2 of them paid it

namespace Database\Seeders;

use App\Models\Charge;
use App\Models\Payment;
use App\Models\Resolution;
use App\Models\Student;
use App\Models\StudentCharge;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChargeSeeder extends Seeder
{
    public function run(): void
    {
        $officer = User::where('email', 'officer@example.com')->first();

        // The resolutions that approved the two charges (see ResolutionSeeder).
        $feeResolution = Resolution::where('series_year', 2026)->where('number', 1)->first();
        $penaltyResolution = Resolution::where('series_year', 2026)->where('number', 2)->first();

        $membershipFee = Charge::create([
            'name' => 'Membership Fee',
            'type' => 'fee',
            'amount' => 150,
            'school_year' => '2026-2027',
            'resolution_id' => $feeResolution->id,
        ]);

        $absencePenalty = Charge::create([
            'name' => 'Absence Penalty',
            'type' => 'penalty',
            'amount' => 25,
            'school_year' => '2026-2027',
            'resolution_id' => $penaltyResolution->id,
        ]);

        $students = Student::orderBy('id')->get();
        $receiptNumber = 1;

        // ---------- Membership Fee for every student ----------
        // $position is 0 for the first student, 1 for the second, and so on.
        foreach ($students as $position => $student) {
            $studentCharge = StudentCharge::create([
                'student_id' => $student->id,
                'charge_id' => $membershipFee->id,
                'amount_due' => 150,
                'date_incurred' => '2026-08-15',
                'remarks' => null,
            ]);

            // The first 10 students paid the full amount.
            if ($position < 10) {
                Payment::create([
                    'student_charge_id' => $studentCharge->id,
                    'amount' => 150,
                    'paid_at' => '2026-08-20',
                    'receipt_no' => 'OR-'.str_pad($receiptNumber, 4, '0', STR_PAD_LEFT),
                    'received_by' => $officer->id,
                ]);
                $receiptNumber = $receiptNumber + 1;
            }

            // The next 4 students paid only PHP 50 (they still owe PHP 100).
            if ($position >= 10 && $position < 14) {
                Payment::create([
                    'student_charge_id' => $studentCharge->id,
                    'amount' => 50,
                    'paid_at' => '2026-08-22',
                    'receipt_no' => 'OR-'.str_pad($receiptNumber, 4, '0', STR_PAD_LEFT),
                    'received_by' => $officer->id,
                ]);
                $receiptNumber = $receiptNumber + 1;
            }

            // Student number 11 paid a second time, to show paying in parts.
            if ($position === 10) {
                Payment::create([
                    'student_charge_id' => $studentCharge->id,
                    'amount' => 50,
                    'paid_at' => '2026-09-01',
                    'receipt_no' => 'OR-'.str_pad($receiptNumber, 4, '0', STR_PAD_LEFT),
                    'received_by' => $officer->id,
                ]);
                $receiptNumber = $receiptNumber + 1;
            }
        }

        // ---------- Absence Penalty for 5 students ----------
        $absentPositions = [2, 6, 11, 14, 17];
        foreach ($absentPositions as $count => $position) {
            $student = $students[$position];

            $studentCharge = StudentCharge::create([
                'student_id' => $student->id,
                'charge_id' => $absencePenalty->id,
                'amount_due' => 25,
                'date_incurred' => '2026-09-05',
                'remarks' => 'Absent on the September 5 general assembly',
            ]);

            // The first 2 of these students paid the penalty.
            if ($count < 2) {
                Payment::create([
                    'student_charge_id' => $studentCharge->id,
                    'amount' => 25,
                    'paid_at' => '2026-09-10',
                    'receipt_no' => 'OR-'.str_pad($receiptNumber, 4, '0', STR_PAD_LEFT),
                    'received_by' => $officer->id,
                ]);
                $receiptNumber = $receiptNumber + 1;
            }
        }
    }
}
