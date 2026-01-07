<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\SignupController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;

Route::prefix('v1')->group(function () {
    Route::get('/ping', function () {
        return response()->json(['ok' => true, 'message' => 'pong', 'ts' => now()->toIso8601String()]);
    });

    Route::post('/auth/signup', SignupController::class);

    Route::post('/auth/login', LoginController::class);
    Route::post('/auth/logout', LogoutController::class);

    Route::middleware('auth:sanctum')->get('/me', MeController::class);
});
