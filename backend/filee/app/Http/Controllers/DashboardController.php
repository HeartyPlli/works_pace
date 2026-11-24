<?php

// DashboardController.php
// Gives the numbers and short lists for the Dashboard (home) page.

namespace App\Http\Controllers;

use App\Models\ErrorEntry;
use App\Models\Resolution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController
{
    // GET /api/dashboard
    public function index(Request $request)
    {
        $totals = DB::table('collection_students')->selectRaw(
            'SUM(paid_cents) AS paid, SUM(CASE WHEN due_cents > paid_cents THEN due_cents - paid_cents ELSE 0 END) AS unpaid'
        )->first();

        // The 5 newest resolutions (newest year first, then highest number first).
        $latestResolutions = Resolution::orderBy('series_year', 'desc')
            ->orderBy('number', 'desc')
            ->take(5)
            ->get();

        // The 5 errors you met the most times.
        $topErrors = $request->user()->show_journal ? ErrorEntry::orderBy('seen_count', 'desc')
            ->orderBy('title')
            ->take(5)
            ->get() : [];

        return response()->json([
            'total_collected' => (int) $totals->paid / 100,
            'total_unpaid' => (int) $totals->unpaid / 100,
            'latest_resolutions' => $latestResolutions,
            'top_errors' => $topErrors,
            'top_errors' => $topErrors,
        ]);
    }
}
