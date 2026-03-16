<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudioController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\AuthController; // Import AuthController

// Public routes
Route::get('/studios', [StudioController::class, 'index']);
Route::get('/studios/{id}', [StudioController::class, 'show']);
Route::get('/studios/{id}/availability', [StudioController::class, 'availability']);
Route::get('/studios/availability', [StudioController::class, 'availabilityByDate']);
Route::get('/offers', [OfferController::class, 'index']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/reservations', [ReservationController::class, 'store']); // Create reservation
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']); // User's reservation history
    Route::post('/reservations/{id}/cancel', [ReservationController::class, 'cancel']); // Cancel reservation
});

// Existing /reservations GET route (if it should remain public for admin/other purposes, otherwise move to protected)
// Based on instructions, existing booking flow should work, so this might not need protection if it's for non-logged-in users to view all reservations.
// However, the task explicitly says "Protect reservation endpoints using Sanctum: POST /api/reservations" and "GET /api/my-reservations"
// I will assume /reservations GET route needs to be public for now if it's used for public view. If it's only for admin, it should be protected.
Route::get('/reservations', [ReservationController::class, 'index']);
