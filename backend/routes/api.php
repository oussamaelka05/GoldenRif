<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public routes
Route::get('/cars',                        [CarController::class, 'index']);
Route::get('/cars/{car}',                  [CarController::class, 'show']);
Route::get('/cars/{car}/unavailable',      [CarController::class, 'unavailableDates']);
Route::get('/cars/{car}/reviews',          [ReviewController::class, 'index']);
Route::get('/offers',                      [OfferController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::get('/me',       [AuthController::class, 'me']);
    Route::put('/profile',  [ProfileController::class, 'update']);

    // Owner: car management
    Route::get('/my-cars',                    [CarController::class, 'myCars']);
    Route::post('/cars',                      [CarController::class, 'store']);
    Route::post('/cars/{car}/update',         [CarController::class, 'update']); // multipart file upload
    Route::put('/cars/{car}',                 [CarController::class, 'update']); // JSON-only (toggle available)
    Route::delete('/cars/{car}',              [CarController::class, 'destroy']);

    // Bookings
    Route::post('/bookings',                  [BookingController::class, 'store']);
    Route::get('/my-bookings',                [BookingController::class, 'myBookings']);
    Route::put('/bookings/{booking}/cancel',  [BookingController::class, 'cancelBooking']);
    Route::get('/owner/bookings',             [BookingController::class, 'ownerBookings']);
    Route::put('/bookings/{booking}/status',  [BookingController::class, 'updateStatus']);
    Route::get('/customer/stats',             [BookingController::class, 'customerStats']);
    Route::get('/owner/earnings',             [BookingController::class, 'earnings']);
    Route::get('/owner/stats',                [BookingController::class, 'stats']);

    // Reviews
    Route::post('/cars/{car}/reviews',         [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}',         [ReviewController::class, 'destroy']);

    // Favorites
    Route::get('/favorites',                   [FavoriteController::class, 'index']);
    Route::get('/favorites/ids',               [FavoriteController::class, 'ids']);
    Route::post('/favorites/{car}',            [FavoriteController::class, 'toggle']);

    // Notifications
    Route::get('/notifications',               [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',  [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all',      [NotificationController::class, 'markAllRead']);

    // Owner: offer management
    Route::get('/my-offers',              [OfferController::class, 'myOffers']);
    Route::post('/offers',                [OfferController::class, 'store']);
    Route::put('/offers/{offer}',         [OfferController::class, 'update']);
    Route::delete('/offers/{offer}',      [OfferController::class, 'destroy']);
});
