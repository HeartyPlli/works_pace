<?php

// ResolutionSeeder.php
// Makes 5 sample resolutions: 2 from 2025 and 3 from 2026.
// Notice that the numbers start again at 1 in 2026.

namespace Database\Seeders;

use App\Models\Resolution;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResolutionSeeder extends Seeder
{
    public function run(): void
    {
        $officer = User::where('email', 'officer@example.com')->first();

        Resolution::create([
            'number' => 1,
            'series_year' => 2025,
            'title' => 'Adopting the Council Calendar of Activities for School Year 2025-2026',
            'whereas_text' => "WHEREAS, the Student Council must plan its activities before the school year starts;\n\nWHEREAS, the officers discussed the calendar during the meeting on June 10, 2025;",
            'resolved_text' => "RESOLVED, as it is hereby resolved, that the Council adopts the Calendar of Activities for School Year 2025-2026;\n\nRESOLVED FURTHER, that a copy of the calendar be posted on the Council bulletin board.",
            'date_adopted' => '2025-06-12',
            'status' => 'filed',
            'created_by' => $officer->id,
        ]);

        Resolution::create([
            'number' => 2,
            'series_year' => 2025,
            'title' => 'Approving the Budget for the 2025 Intramurals',
            'whereas_text' => "WHEREAS, the Intramurals will be held on October 20 to 24, 2025;\n\nWHEREAS, the committee submitted a budget proposal of PHP 15,000.00;",
            'resolved_text' => 'RESOLVED, as it is hereby resolved, that the Council approves the budget of PHP 15,000.00 for the 2025 Intramurals.',
            'date_adopted' => '2025-09-15',
            'status' => 'filed',
            'created_by' => $officer->id,
        ]);

        Resolution::create([
            'number' => 1,
            'series_year' => 2026,
            'title' => 'Approving the Membership Fee for School Year 2026-2027',
            'whereas_text' => "WHEREAS, the Student Council needs funds to run its programs and activities;\n\nWHEREAS, the officers agreed during the meeting on July 28, 2026 to collect a membership fee from each student;",
            'resolved_text' => "RESOLVED, as it is hereby resolved, that a membership fee of PHP 150.00 be collected from each student for School Year 2026-2027;\n\nRESOLVED FURTHER, that the Council Secretary keeps a record of all payments.",
            'date_adopted' => '2026-07-30',
            'status' => 'adopted',
            'created_by' => $officer->id,
        ]);

        Resolution::create([
            'number' => 2,
            'series_year' => 2026,
            'title' => 'Setting the Penalty for Absence in General Assemblies',
            'whereas_text' => "WHEREAS, many students did not attend the general assemblies last school year;\n\nWHEREAS, attendance helps every student know the plans of the Council;",
            'resolved_text' => 'RESOLVED, as it is hereby resolved, that a penalty of PHP 25.00 be given to each student who is absent from a general assembly without a valid excuse.',
            'date_adopted' => '2026-08-10',
            'status' => 'adopted',
            'created_by' => $officer->id,
        ]);

        Resolution::create([
            'number' => 3,
            'series_year' => 2026,
            'title' => 'Requesting Longer Library Hours During Exam Week',
            'whereas_text' => 'WHEREAS, many students need a quiet place to study during exam week;',
            'resolved_text' => 'RESOLVED, as it is hereby resolved, that the Council asks the school to keep the library open until 8:00 PM during exam week.',
            'date_adopted' => null,
            'status' => 'draft',
            'created_by' => $officer->id,
        ]);
    }
}
