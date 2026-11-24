<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('OFFICER_PASSWORD');
        if (app()->environment('production') && mb_strlen((string) $password) < 12) {
            throw new \RuntimeException('Set OFFICER_PASSWORD to at least 12 characters before seeding a live website.');
        }

        $owner = new User([
            'name' => 'Council Officer',
            'email' => 'officer@example.com',
            'password' => $password ?: 'password',
            'role' => 'officer',
        ]);
        $owner->can_manage_accounts = true;
        $owner->save();
    }
}
