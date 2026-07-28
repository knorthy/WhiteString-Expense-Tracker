<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes here are prefixed with /api automatically.
| No auth middleware — single-user tool as per spec.
*/

// Summary must be declared before the {id} route to avoid being caught by it
Route::get('/transactions/summary',  [TransactionController::class, 'summary']);
Route::get('/categories',            [TransactionController::class, 'categories']);

Route::apiResource('transactions', TransactionController::class);
