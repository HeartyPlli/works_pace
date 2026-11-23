<?php

// DatabaseSeeder.php
// A "seeder" puts starting data into the database.
// This main seeder runs the other seeders in the right order.
// Run it with: php artisan db:seed
// Or start fresh (deletes ALL data first): php artisan migrate:fresh --seed

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,        // the two login accounts
            StudentSeeder::class,     // 20 sample students
            ResolutionSeeder::class,  // 5 sample resolutions
            ChargeSeeder::class,      // 2 charges, assigned to students, with some payments
            JournalSeeder::class,     // sample Error Fix Journal entries with tags
        ]);
    }
}
