<?php

// AuthController.php
// Handles logging in, logging out, and "who am I?".
// When you log in, you get a token. React saves the token and sends it
// with every request, so Laravel knows who you are.

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController
{
    public function register(Request $request)
    {
        $email = $request->input('email');
        if (is_string($email)) {
            $request->merge(['email' => strtolower(trim($email))]);
        }
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255', 'ends_with:@gmail.com'],
            'password' => ['bail', 'required', 'string', 'min:12', 'max:72', function ($attribute, $value, $fail) {
                if (strlen($value) > 72 || str_contains($value, "\0")) {
                    $fail('The password must be at most 72 bytes and cannot contain a null character.');
                }
            }],
            'show_journal' => 'required|boolean',
        ], ['email.ends_with' => 'Enter a Gmail address ending in @gmail.com.']);

        $user = User::unguarded(fn () => User::query()->createOrFirst(
            ['email' => $data['email']],
            [
                'name' => strstr($data['email'], '@', true),
                'password' => $data['password'],
                'role' => 'viewer',
                'show_journal' => $data['show_journal'],
                'signup_pending' => true,
            ],
        ));

        if (! $user->wasRecentlyCreated) {
            throw ValidationException::withMessages(['email' => 'An account already uses this email.']);
        }

        return response()->json(['message' => 'Account request sent. You can sign in after the owner approves it.'], 201);
    }

    // POST /api/login
    // Checks the email and password. If they are correct, it gives back a token.
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|max:72',
        ]);

        // Find the user with this email.
        $user = User::where('email', strtolower($request->email))->first();

        // No user found, or the password does not match.
        if ($user === null || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Wrong email or password.',
            ], 422);
        }

        if ($user->signup_pending) {
            return response()->json(['message' => 'Your account is waiting for the owner to approve it.'], 403);
        }

        if (! $user->isOfficer()) {
            return response()->json(['message' => 'Wrong email or password.'], 422);
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

    public function updatePreferences(Request $request)
    {
        $data = $request->validate(['show_journal' => 'required|boolean']);
        $request->user()->update($data);

        return $this->me($request);
    }

    public function pendingAccounts(Request $request)
    {
        abort_unless($request->user()->can_manage_accounts, 403);

        return User::where('signup_pending', true)->orderBy('id')->get(['id', 'email']);
    }

    public function approveAccount(Request $request, int $id)
    {
        abort_unless($request->user()->can_manage_accounts, 403);
        $updated = User::whereKey($id)->where('signup_pending', true)
            ->update(['role' => 'officer', 'signup_pending' => false]);

        abort_unless($updated, 404, 'This account request is no longer pending.');

        return response()->noContent();
    }
}
