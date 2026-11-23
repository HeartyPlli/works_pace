<?php

// User.php
// A user is a person who can log in. The "role" is "officer" or "viewer".
// HasApiTokens (from Laravel Sanctum) lets a user get a login token.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // The columns we are allowed to fill with create() or update().
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    // These columns are never sent back in JSON answers.
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // "hashed" means Laravel scrambles the password before saving it.
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Returns true if this user is an officer.
    public function isOfficer()
    {
        return $this->role === 'officer';
    }
}
