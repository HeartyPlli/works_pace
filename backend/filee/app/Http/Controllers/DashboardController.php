<?php

// DashboardController.php
// Gives the numbers and short lists for the Dashboard (home) page.

namespace App\Http\Controllers;

use App\Models\ErrorEntry;
use App\Models\Payment;
use App\Models\Resolution;
use App\Models\StudentCharge;

class DashboardController extends Controller
{
    // GET /api/dashboard
    public function index()
    {
        // All money received so far.
        $totalCollected = (float) Payment::sum('amount');

        // All money that students must pay, minus what they already paid.
        $totalDue = (float) StudentCharge::sum('amount_due');
        $totalUnpaid = $totalDue - $totalCollected;

        // The 5 newest resolutions (newest year first, then highest number first).
        $latestResolutions = Resolution::orderBy('series_year', 'desc')
            ->orderBy('number', 'desc')
            ->take(5)
            ->get();

        // The 5 errors you met the most times.
        $topErrors = ErrorEntry::orderBy('seen_count', 'desc')
            ->orderBy('title')
            ->take(5)
            ->get();

        return response()->json([
            'total_collected' => round($totalCollected, 2),
            'total_unpaid' => round($totalUnpaid, 2),
            'latest_resolutions' => $latestResolutions,
            'top_errors' => $topErrors,
        ]);
    }
}
