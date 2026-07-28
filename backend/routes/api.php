<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

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
