<?php

// ResolutionController.php
// Add, edit, delete, list, and search resolutions.
// New resolutions get the next number for their series year automatically.

namespace App\Http\Controllers;

use App\Models\Resolution;
use Illuminate\Http\Request;

class ResolutionController extends Controller
{
    // GET /api/resolutions?search=fee&year=2026&status=adopted
    // Lists resolutions. All three filters are optional.
    public function index(Request $request)
    {
        $query = Resolution::query();

        // Search in the title and in the text.
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('title', 'like', '%'.$search.'%')
                    ->orWhere('whereas_text', 'like', '%'.$search.'%')
                    ->orWhere('resolved_text', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('year')) {
            $query->where('series_year', $request->year);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $resolutions = $query->orderBy('series_year', 'desc')
            ->orderBy('number', 'desc')
            ->get();

        return response()->json($resolutions);
    }

    // GET /api/resolutions/next-number?year=2026
    // Tells React which number the next resolution of that year will get.
    public function nextNumber(Request $request)
    {
        $request->validate([
            'year' => 'required|integer|min:2000|max:2100',
        ]);

        return response()->json([
            'series_year' => (int) $request->year,
            'number' => $this->getNextNumber($request->year),
        ]);
    }

    // GET /api/resolutions/{id}
    public function show($id)
    {
        $resolution = Resolution::findOrFail($id);

        return response()->json($resolution);
    }

    // POST /api/resolutions
    public function store(Request $request)
    {
        $validated = $request->validate([
            'series_year' => 'required|integer|min:2000|max:2100',
            'title' => 'required|string|max:255',
            'whereas_text' => 'nullable|string',
            'resolved_text' => 'nullable|string',
            'date_adopted' => 'nullable|date',
            'status' => 'required|in:draft,adopted,filed',
        ]);

        // The number is NOT typed by the user. We make it here.
        $validated['number'] = $this->getNextNumber($validated['series_year']);
        $validated['created_by'] = $request->user()->id;

        $resolution = Resolution::create($validated);

        return response()->json([
            'message' => 'Resolution saved.',
            'resolution' => $resolution,
        ], 201);
    }

    // PUT /api/resolutions/{id}
    public function update(Request $request, $id)
    {
        $resolution = Resolution::findOrFail($id);

        $validated = $request->validate([
            'series_year' => 'required|integer|min:2000|max:2100',
            'title' => 'required|string|max:255',
            'whereas_text' => 'nullable|string',
            'resolved_text' => 'nullable|string',
            'date_adopted' => 'nullable|date',
            'status' => 'required|in:draft,adopted,filed',
        ]);

        // If the series year changed, the resolution needs a new number in that year.
        if ((int) $validated['series_year'] !== $resolution->series_year) {
            $validated['number'] = $this->getNextNumber($validated['series_year']);
        }

        $resolution->update($validated);

        return response()->json([
            'message' => 'Resolution updated.',
            'resolution' => $resolution,
        ]);
    }

    // DELETE /api/resolutions/{id}
    public function destroy($id)
    {
        $resolution = Resolution::findOrFail($id);
        $resolution->delete();

        return response()->json([
            'message' => 'Resolution deleted.',
        ]);
    }

    // Helper: find the highest number used in a year, and add 1.
    // If the year has no resolutions yet, the first number is 1.
    private function getNextNumber($year)
    {
        $highestNumber = Resolution::where('series_year', $year)->max('number');

        if ($highestNumber === null) {
            return 1;
        }

        return $highestNumber + 1;
    }
}
