<?php

// web.php
// Routes for normal web pages. This app uses React for the pages,
// so here we only have one route: a message that says the API is running.
// Open http://127.0.0.1:8000 in your browser to see it.

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'The Workspace API is running. Open the React app to use it.',
    ]);
});
