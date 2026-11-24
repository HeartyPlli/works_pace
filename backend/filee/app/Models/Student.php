<?php

// Student.php
// A student who can be given charges (fees or penalties).

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_no',
        'name',
        'program',
        'year_level',
        'section',
    ];

    protected $casts = [
        'year_level' => 'integer',
    ];

    // All the charges given to this student.
    public function studentCharges()
    {
        return $this->hasMany(StudentCharge::class);
    }
}
