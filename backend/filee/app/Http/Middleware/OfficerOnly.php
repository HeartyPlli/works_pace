<?php

// OfficerOnly.php
// A "middleware" is code that runs BEFORE the controller.
// This one checks the role of the logged in user.
// Only active workspace members can access protected records.

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
                'message' => 'This account no longer has access to Workspace.',
            ], 401);
        }

        // The user is an officer, so we let the request continue to the controller.
        return $next($request);
    }
}
