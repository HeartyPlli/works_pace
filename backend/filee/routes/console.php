<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;

Artisan::command('workspace:add-user', function () {
    $name = trim((string) $this->ask('Name'));
    $email = strtolower(trim((string) $this->ask('Email')));
    $password = $this->secret('Password (at least 12 characters)');
    $confirmation = $this->secret('Confirm password');

    $validator = validator([
        'name' => $name,
        'email' => $email,
        'password' => $password,
        'password_confirmation' => $confirmation,
    ], [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:12|max:72|confirmed',
    ]);

    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }
        return 1;
    }

    User::create(compact('name', 'email', 'password') + ['role' => 'officer']);
    $this->info('Account created. The user can sign in with their own email and password.');

    return 0;
})->purpose('Create a sign-in for a member of this shared workspace');
