<?php

// app.php
// This file starts the Laravel application.
// It says where the route files are, adds our "officer" middleware,
// and makes sure API errors are sent back as JSON.

use App\Http\Middleware\OfficerOnly;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Give our middleware a short name, so routes can use middleware('officer').
        $middleware->alias([
            'officer' => OfficerOnly::class,
        ]);

        // Laravel normally sends logged out visitors to a "login" page.
        // Our login page is in React, not in Laravel, so we turn that off.
        // A request without a token then simply gets: 401 {"message": "Unauthenticated."}
        $middleware->redirectGuestsTo(function () {
            return null;
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // For every /api address, send errors as JSON (not as an HTML page).
        $exceptions->shouldRenderJsonWhen(function (Request $request) {
            return $request->is('api/*');
        });

        // When a record is not found (for example /api/students/999),
        // send a short and clear message.
        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Not found. This record or address does not exist.'], 404);
            }
        });
    })->create();
