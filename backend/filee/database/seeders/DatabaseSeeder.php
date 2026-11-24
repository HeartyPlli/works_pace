<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('role', 'officer')->exists()) {
            $this->command->info('The workspace already has a sign-in. Seeding skipped.');
            return;
        }

        $this->call(UserSeeder::class);

        if (env('SEED_SAMPLE_DATA', true) !== false) {
            $this->call([ResolutionSeeder::class, JournalSeeder::class]);
        }
    }
}
