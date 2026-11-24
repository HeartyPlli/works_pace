<?php

// TagController.php
// Lists the tags of the Error Fix Journal (used for the tag filter).

namespace App\Http\Controllers;

use App\Models\Tag;

class TagController extends Controller
{
    // GET /api/tags
    // Each tag also has "error_entries_count": how many entries use it.
    public function index()
    {
        $tags = Tag::withCount('errorEntries')->orderBy('name')->get();

        return response()->json($tags);
    }
}
