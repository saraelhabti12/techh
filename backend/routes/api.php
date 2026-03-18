<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudioController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminStudioController;
use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminDashboardController;

// Public routes
Route::get('/studios', [StudioController::class, 'index']);
Route::get('/studios/{id}', [StudioController::class, 'show']);
Route::get('/studios/{id}/availability', [StudioController::class, 'availability']);
Route::get('/studios/availability', [StudioController::class, 'availabilityByDate']);
Route::get('/offers', [OfferController::class, 'index']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (User)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::post('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard & Stats
    Route::get('/stats', [AdminDashboardController::class, 'stats']);
    Route::get('/studios/{studio}/calendar', [AdminDashboardController::class, 'studioCalendar']);

    // Studios CRUD
    Route::apiResource('studios', AdminStudioController::class);

    // Reservations management
    Route::get('/reservations', [AdminReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [AdminReservationController::class, 'show']);
    Route::patch('/reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus']);
    Route::delete('/reservations/{reservation}', [AdminReservationController::class, 'destroy']);

    // Users management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{user}', [AdminUserController::class, 'show']);
    Route::post('/users/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin']);
    Route::post('/users/{user}/toggle-ban', [AdminUserController::class, 'toggleBan']);
});

// Backward compatibility or other purposes
Route::get('/reservations', [ReservationController::class, 'index']);
