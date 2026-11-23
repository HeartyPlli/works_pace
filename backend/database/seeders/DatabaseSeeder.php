<?php

// DatabaseSeeder.php
// A "seeder" puts starting data into the database.
// This main seeder runs the other seeders in the right order.
// Run it with: php artisan db:seed
// Or start fresh (deletes ALL data first): php artisan migrate:fresh --seed
//
// It is safe to run more than once: if the accounts already exist, it does nothing.
// (A live website runs it on every deploy, see docs/10-deploy-to-railway.md.)

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Already seeded before? Then stop, so nothing is added twice.
        if (User::count() > 0) {
            $this->command->info('The database already has accounts, so seeding is skipped.');
            return;
        }

        // Always make the two login accounts.
        $this->call(UserSeeder::class);

        // The sample data: fake students, resolutions, charges, payments, and journal entries.
        // Set SEED_SAMPLE_DATA=false to start with an empty app (for real use).
        if (env('SEED_SAMPLE_DATA', true) === false) {
            $this->command->info('SEED_SAMPLE_DATA is false, so no sample data was added.');
            return;
        }

        $this->call([
            StudentSeeder::class,     // 20 sample students
            ResolutionSeeder::class,  // 5 sample resolutions
            ChargeSeeder::class,      // 2 charges, assigned to students, with some payments
            JournalSeeder::class,     // sample Error Fix Journal entries with tags
        ]);
    }
}
