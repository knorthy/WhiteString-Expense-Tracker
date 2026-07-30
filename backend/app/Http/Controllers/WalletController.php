<?php

namespace App\Http\Controllers;

use App\Http\Requests\WalletRequest;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WalletController extends Controller
{
    // GET /api/wallets, reads wallets table filtered by logged in user, called from wallets.js getWallets
    public function index(Request $request): JsonResponse
    {
        $wallets = $request->user()
                           ->wallets()
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json($wallets);
    }

    // GET /api/wallets/:id, reads single row from wallets table, called from wallets.js
    public function show(Request $request, int $id): JsonResponse
    {
        $wallet = $request->user()->wallets()->findOrFail($id);

        return response()->json($wallet);
    }

    // POST /api/wallets, inserts row into wallets table, called from wallets.js createWallet
    public function store(WalletRequest $request): JsonResponse
    {
        $wallet = $request->user()->wallets()->create($request->validated());

        return response()->json($wallet, Response::HTTP_CREATED);
    }

    // PUT /api/wallets/:id, updates balance column in wallets table, called from wallets.js updateWalletBalance
    public function update(Request $request, int $id): JsonResponse
    {
        $wallet = $request->user()->wallets()->findOrFail($id);

        $wallet->update($request->validate([
            'balance' => ['required', 'numeric', 'min:0'],
        ]));

        return response()->json($wallet);
    }

    // DELETE /api/wallets/:id, removes row from wallets table, called from wallets.js deleteWallet
    public function destroy(Request $request, int $id): JsonResponse
    {
        $wallet = $request->user()->wallets()->findOrFail($id);
        $wallet->delete();

        return response()->json(['message' => 'Wallet deleted.']);
    }
}
