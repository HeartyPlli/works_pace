<?php

// User.php
// A user is a person who can log in. The "role" is "officer" or "viewer".
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
    ];

    // The password is never sent back in JSON answers.
    protected $hidden = [
        'password',
    ];

    // "hashed" means Laravel scrambles the password before saving it.
    protected $casts = [
        'password' => 'hashed',
    ];

    // Returns true if this user is an officer.
    public function isOfficer()
    {
        return $this->role === 'officer';
    }
}
