<?php

// ErrorEntryController.php
// Add, edit, delete, list, and search entries of the Error Fix Journal.
// Also: "seen again" (+1 to seen_count) and the favorite on/off switch.

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ErrorEntry;
use App\Models\Tag;
use Illuminate\Http\Request;

class ErrorEntryController extends Controller
{
    // GET /api/entries?search=cors&tag=Laravel&favorite=1
    // All three filters are optional.
    public function index(Request $request)
    {
        $query = ErrorEntry::with('tags');

        // Search in the title and in the error message.
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($innerQuery) use ($search) {
                $innerQuery->where('title', 'like', '%'.$search.'%')
                    ->orWhere('error_message', 'like', '%'.$search.'%');
            });
        }

        // Only entries that have this tag name.
        if ($request->filled('tag')) {
            $tagName = $request->tag;
            $query->whereHas('tags', function ($tagQuery) use ($tagName) {
                $tagQuery->where('name', $tagName);
            });
        }

        // Only favorites.
        if ($request->boolean('favorite')) {
            $query->where('is_favorite', true);
        }

        // The entry you met most recently comes first.
        $entries = $query->orderBy('last_seen_at', 'desc')->get();

        return response()->json($entries);
    }

    // GET /api/entries/{id}
    public function show($id)
    {
        $entry = ErrorEntry::with('tags')->findOrFail($id);

        return response()->json($entry);
    }

    // POST /api/entries
    // "tags" is a list of tag names, like ["Laravel", "CORS"].
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'error_message' => 'required|string',
            'cause' => 'nullable|string',
            'fix' => 'required|string',
            'code_snippet' => 'nullable|string',
            'source_url' => 'nullable|url|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $entry = ErrorEntry::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'error_message' => $validated['error_message'],
            'cause' => $validated['cause'] ?? null,
            'fix' => $validated['fix'],
            'code_snippet' => $validated['code_snippet'] ?? null,
            'source_url' => $validated['source_url'] ?? null,
            'seen_count' => 1,
            'is_favorite' => false,
            'last_seen_at' => now(),
        ]);

        // Find each tag by name, or make it if it does not exist yet.
        // Then connect the tags to this entry.
        $tagIds = [];
        foreach ($request->input('tags', []) as $tagName) {
            $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
            $tagIds[] = $tag->id;
        }
        $entry->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Journal entry saved.',
            'entry' => $entry->load('tags'),
        ], 201);
    }

    // PUT /api/entries/{id}
    public function update(Request $request, $id)
    {
        $entry = ErrorEntry::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'error_message' => 'required|string',
            'cause' => 'nullable|string',
            'fix' => 'required|string',
            'code_snippet' => 'nullable|string',
            'source_url' => 'nullable|url|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $entry->update([
            'title' => $validated['title'],
            'error_message' => $validated['error_message'],
            'cause' => $validated['cause'] ?? null,
            'fix' => $validated['fix'],
            'code_snippet' => $validated['code_snippet'] ?? null,
            'source_url' => $validated['source_url'] ?? null,
        ]);

        // Same as in store(): find or make each tag, then connect them.
        // sync() also removes tags that are no longer in the list.
        $tagIds = [];
        foreach ($request->input('tags', []) as $tagName) {
            $tag = Tag::firstOrCreate(['name' => trim($tagName)]);
            $tagIds[] = $tag->id;
        }
        $entry->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Journal entry updated.',
            'entry' => $entry->load('tags'),
        ]);
    }

    // DELETE /api/entries/{id}
    public function destroy($id)
    {
        $entry = ErrorEntry::findOrFail($id);
        $entry->delete();

        return response()->json([
            'message' => 'Journal entry deleted.',
        ]);
    }

    // POST /api/entries/{id}/seen
    // You met this error again: add 1 to seen_count and save the time.
    public function seen($id)
    {
        $entry = ErrorEntry::findOrFail($id);
        $entry->seen_count = $entry->seen_count + 1;
        $entry->last_seen_at = now();
        $entry->save();

        return response()->json([
            'message' => 'Seen count updated.',
            'entry' => $entry->load('tags'),
        ]);
    }

    // POST /api/entries/{id}/favorite
    // Switch the favorite star: on becomes off, off becomes on.
    public function favorite($id)
    {
        $entry = ErrorEntry::findOrFail($id);
        $entry->is_favorite = ! $entry->is_favorite;
        $entry->save();

        return response()->json([
            'message' => $entry->is_favorite ? 'Added to favorites.' : 'Removed from favorites.',
            'entry' => $entry->load('tags'),
        ]);
    }
}
