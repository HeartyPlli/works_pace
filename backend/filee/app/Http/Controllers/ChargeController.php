<?php

// ChargeController.php
// List and add charges (fees and penalties).

namespace App\Http\Controllers;

use App\Models\Charge;
use Illuminate\Http\Request;

class ChargeController extends Controller
{
    // GET /api/charges
    // Lists all charges, with the resolution that approved each one,
    // and how many times each charge was given to students.
    public function index()
    {
        $charges = Charge::with('resolution')
            ->withCount('studentCharges')
            ->orderBy('name')
            ->get();

        return response()->json($charges);
    }

    // POST /api/charges
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:fee,penalty',
            'amount' => 'required|numeric|min:0',
            'school_year' => 'required|string|max:20',
            // Optional. If given, it must be the id of a real resolution.
            'resolution_id' => 'nullable|exists:resolutions,id',
        ]);

        $charge = Charge::create($validated);

        return response()->json([
            'message' => 'Charge saved.',
            'charge' => $charge,
        ], 201);
    }
}
