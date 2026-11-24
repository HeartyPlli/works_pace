<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ErrorEntryController;
use App\Http\Controllers\ResolutionController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'officer'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me/preferences', [AuthController::class, 'updatePreferences']);
    Route::get('/accounts/pending', [AuthController::class, 'pendingAccounts']);
    Route::post('/accounts/{id}/approve', [AuthController::class, 'approveAccount'])->whereNumber('id');
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/resolutions/next-number', [ResolutionController::class, 'nextNumber']);
    Route::apiResource('resolutions', ResolutionController::class)->parameters(['resolutions' => 'id']);

    Route::prefix('collections')->controller(CollectionController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show')->whereNumber('id');
        Route::put('/{id}', 'update')->whereNumber('id');
        Route::post('/{id}/students', 'addStudent')->whereNumber('id');
        Route::patch('/{id}/students', 'renameStudent')->whereNumber('id');
        Route::delete('/{id}/students', 'removeStudent')->whereNumber('id');
        Route::patch('/{id}/payment', 'payment')->whereNumber('id');
        Route::post('/{id}/import', 'import')->whereNumber('id');
        Route::get('/{id}/export', 'export')->whereNumber('id');
    });

    Route::prefix('documents')->controller(DocumentController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'save');
        Route::get('/{id}', 'show')->whereNumber('id');
        Route::post('/{id}', 'save')->whereNumber('id');
        Route::get('/{id}/attachment', 'download')->whereNumber('id');
        Route::delete('/{id}', 'destroy')->whereNumber('id');
    });

    Route::apiResource('entries', ErrorEntryController::class)->parameters(['entries' => 'id']);
    Route::post('/entries/{id}/seen', [ErrorEntryController::class, 'seen']);
    Route::post('/entries/{id}/favorite', [ErrorEntryController::class, 'favorite']);
    Route::get('/tags', [TagController::class, 'index']);
});
