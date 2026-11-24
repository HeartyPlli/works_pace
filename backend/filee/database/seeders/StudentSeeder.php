<?php

// StudentSeeder.php
// Makes 20 sample students so the app has something to show.

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Each line is: name, program, year level, section
        $students = [
            ['Maria Santos', 'BSIT', 1, 'A'],
            ['Jose Reyes', 'BSIT', 1, 'B'],
            ['Ana Garcia', 'BSCS', 2, 'A'],
            ['Mark Villanueva', 'BSCS', 2, 'B'],
            ['Kristine Mendoza', 'BSIS', 3, 'A'],
            ['Paolo Ramos', 'BSIT', 3, 'A'],
            ['Angelica Torres', 'BSIT', 4, 'A'],
            ['Carlo Bautista', 'BSCS', 4, 'B'],
            ['Jasmine Aquino', 'BSIS', 1, 'A'],
            ['Miguel Fernandez', 'BSIT', 2, 'A'],
            ['Patricia Castillo', 'BSCS', 1, 'A'],
            ['Rafael Navarro', 'BSIS', 2, 'B'],
            ['Bea Morales', 'BSIT', 3, 'B'],
            ['Daniel Flores', 'BSCS', 3, 'A'],
            ['Camille Rivera', 'BSIS', 4, 'A'],
            ['Joshua Gonzales', 'BSIT', 4, 'B'],
            ['Nicole Castro', 'BSCS', 1, 'B'],
            ['Adrian Lim', 'BSIT', 2, 'B'],
            ['Sophia Delos Santos', 'BSIS', 3, 'B'],
            ['Kevin Pascual', 'BSCS', 4, 'A'],
        ];

        // Give each student a number like 2026-0001, 2026-0002, and so on.
        $counter = 1;
        foreach ($students as $student) {
            Student::create([
                'student_no' => '2026-'.str_pad($counter, 4, '0', STR_PAD_LEFT),
                'name' => $student[0],
                'program' => $student[1],
                'year_level' => $student[2],
                'section' => $student[3],
            ]);
            $counter = $counter + 1;
        }
    }
}
