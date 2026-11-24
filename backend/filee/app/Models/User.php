<?php

// User.php
// An active workspace member has the officer role.
// HasApiTokens (from Laravel Sanctum) lets a user get a login token.

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    // The columns we are allowed to fill with create() or update().
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'show_journal',
    ];

    // The password is never sent back in JSON answers.
    protected $hidden = [
        'password',
    ];

    // "hashed" means Laravel scrambles the password before saving it.
    protected $casts = [
        'password' => 'hashed',
        'show_journal' => 'boolean',
        'signup_pending' => 'boolean',
        'can_manage_accounts' => 'boolean',
    ];

    // Returns true if this user is an officer.
    public function isOfficer()
    {
        return $this->role === 'officer';
    }
}
