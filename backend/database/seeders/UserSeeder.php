<?php

// UserSeeder.php
// Makes the two starting accounts. Both have the password "password".
// IMPORTANT: change these passwords before real people use the app (see the README).

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // The officer can add, edit, and delete everything.
        User::create([
            'name' => 'Council Officer',
            'email' => 'officer@example.com',
            'password' => Hash::make('password'),
            'role' => 'officer',
        ]);

        // The viewer can only look at records.
        User::create([
            'name' => 'Council Viewer',
            'email' => 'viewer@example.com',
            'password' => Hash::make('password'),
            'role' => 'viewer',
        ]);
    }
}
