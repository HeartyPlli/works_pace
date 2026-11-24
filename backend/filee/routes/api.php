<?php

// api.php
// The list of all API addresses (routes). Every address here starts with /api.
// Example: Route::get('/students', ...) answers at http://127.0.0.1:8000/api/students
// Each route says which controller method should answer it.

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChargeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ErrorEntryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResolutionController;
use App\Http\Controllers\StudentChargeController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

// ---------- No login needed ----------
Route::post('/login', [AuthController::class, 'login']);

// ---------- You must be logged in for every route below ----------
// "auth:sanctum" checks the token in the Authorization header.
Route::middleware('auth:sanctum')->group(function () {

    // Routes for EVERY logged in user (officer and viewer).
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Note: "next-number" must come BEFORE "{id}",
    // or Laravel would think "next-number" is an id.
    Route::get('/resolutions', [ResolutionController::class, 'index']);
    Route::get('/resolutions/next-number', [ResolutionController::class, 'nextNumber']);
    Route::get('/resolutions/{id}', [ResolutionController::class, 'show']);

    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{id}/ledger', [StudentController::class, 'ledger']);

    Route::get('/charges', [ChargeController::class, 'index']);
    Route::get('/reports/unpaid', [ReportController::class, 'unpaid']);

    Route::get('/entries', [ErrorEntryController::class, 'index']);
    Route::get('/entries/{id}', [ErrorEntryController::class, 'show']);
    Route::get('/tags', [TagController::class, 'index']);

    // Routes that CHANGE data. Only officers can use them.
    // "officer" is our OfficerOnly middleware (see bootstrap/app.php).
    Route::middleware('officer')->group(function () {
        Route::post('/resolutions', [ResolutionController::class, 'store']);
        Route::put('/resolutions/{id}', [ResolutionController::class, 'update']);
        Route::delete('/resolutions/{id}', [ResolutionController::class, 'destroy']);

        Route::post('/students', [StudentController::class, 'store']);
        Route::put('/students/{id}', [StudentController::class, 'update']);
        Route::delete('/students/{id}', [StudentController::class, 'destroy']);

        Route::post('/charges', [ChargeController::class, 'store']);
        Route::post('/student-charges', [StudentChargeController::class, 'store']);
        Route::post('/payments', [PaymentController::class, 'store']);

        Route::post('/entries', [ErrorEntryController::class, 'store']);
        Route::put('/entries/{id}', [ErrorEntryController::class, 'update']);
        Route::delete('/entries/{id}', [ErrorEntryController::class, 'destroy']);
        Route::post('/entries/{id}/seen', [ErrorEntryController::class, 'seen']);
        Route::post('/entries/{id}/favorite', [ErrorEntryController::class, 'favorite']);
    });
});
