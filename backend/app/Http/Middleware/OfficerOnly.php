<?php

// OfficerOnly.php
// A "middleware" is code that runs BEFORE the controller.
// This one checks the role of the logged in user.
// Officers may go on. Everyone else gets a 403 (Forbidden) answer.
// It is used in routes/api.php for every route that changes data.

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OfficerOnly
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user === null || $user->role !== 'officer') {
            return response()->json([
                'message' => 'Only officers can do this. Your account can only view records.',
            ], 403);
        }

        // The user is an officer, so we let the request continue to the controller.
        return $next($request);
    }
}
