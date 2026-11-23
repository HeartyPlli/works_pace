<?php

// UserSeeder.php
// Makes the two starting accounts: one officer and one viewer.
//
// The passwords come from two settings (in .env, or in your hosting's variables):
//   OFFICER_PASSWORD and VIEWER_PASSWORD
// On your own computer you can leave them out. Then both passwords are "password".
// On a live website (APP_ENV=production) they MUST be set, or this seeder stops with an error.

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $officerPassword = env('OFFICER_PASSWORD');
        $viewerPassword = env('VIEWER_PASSWORD');

        // A live website must never get the easy password "password".
        $passwordsMissing = empty($officerPassword) || empty($viewerPassword);
        if (app()->environment('production') && $passwordsMissing) {
            throw new \RuntimeException('Set OFFICER_PASSWORD and VIEWER_PASSWORD before seeding a live website.');
        }

        // On your own computer, use "password" when nothing is set.
        if (empty($officerPassword)) {
            $officerPassword = 'password';
        }
        if (empty($viewerPassword)) {
            $viewerPassword = 'password';
        }

        // The officer can add, edit, and delete everything.
        User::create([
            'name' => 'Council Officer',
            'email' => 'officer@example.com',
            'password' => Hash::make($officerPassword),
            'role' => 'officer',
        ]);

        // The viewer can only look at records.
        User::create([
            'name' => 'Council Viewer',
            'email' => 'viewer@example.com',
            'password' => Hash::make($viewerPassword),
            'role' => 'viewer',
        ]);
    }
}
