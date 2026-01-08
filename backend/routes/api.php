<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\SignupController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/signup', SignupController::class);

    Route::middleware('web')->group(function () {
        Route::post('/auth/login', LoginController::class);
        Route::post('/auth/logout', LogoutController::class);

        Route::middleware('auth')->get('/me', MeController::class);
    });
});