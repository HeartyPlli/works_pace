<?php

// AuthController.php
// Handles logging in, logging out, and "who am I?".
// When you log in, you get a token. React saves the token and sends it
// with every request, so Laravel knows who you are.

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    // POST /api/login
    // Checks the email and password. If they are correct, it gives back a token.
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find the user with this email.
        $user = User::where('email', $request->email)->first();

        // No user found, or the password does not match.
        if ($user === null || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Wrong email or password.',
            ], 422);
        }

        // Make a new token for this user.
        $token = $user->createToken('workspace-login')->plainTextToken;

        return response()->json([
            'message' => 'Logged in.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    // POST /api/logout
    // Deletes the token that was used for this request, so it cannot be used again.
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out.',
        ]);
    }

    // GET /api/me
    // Gives back the logged in user.
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
