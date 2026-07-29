<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public auth routes
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password',   [PasswordResetController::class, 'forgotPassword']);
Route::post('/verify-reset-code', [PasswordResetController::class, 'verifyResetCode']);
Route::post('/reset-password',    [PasswordResetController::class, 'resetPassword']);

// Protected routes — require Sanctum token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);

    // Transactions
    Route::get('/transactions/summary', [TransactionController::class, 'summary']);
    Route::get('/categories',           [TransactionController::class, 'categories']);
    Route::apiResource('transactions',  TransactionController::class);

    // Wallets
    Route::apiResource('wallets', WalletController::class);
});
