<?php

namespace App\Http\Controllers;

use App\Http\Requests\WalletRequest;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WalletController extends Controller
{
    /**
     * GET /api/wallets
     */
    public function index(Request $request): JsonResponse
    {
        $wallets = $request->user()
                           ->wallets()
                           ->orderBy('created_at', 'desc')
                           ->get();

        return response()->json($wallets);
    }

    /**
     * GET /api/wallets/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $wallet = $request->user()->wallets()->findOrFail($id);

        return response()->json($wallet);
    }

    /**
     * POST /api/wallets
     */
    public function store(WalletRequest $request): JsonResponse
    {
        $wallet = $request->user()->wallets()->create($request->validated());

        return response()->json($wallet, Response::HTTP_CREATED);
    }

    /**
     * PUT/PATCH /api/wallets/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $wallet = $request->user()->wallets()->findOrFail($id);

        $wallet->update($request->validate([
            'balance' => ['required', 'numeric', 'min:0'],
        ]));

        return response()->json($wallet);
    }

    /**
     * DELETE /api/wallets/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $wallet = $request->user()->wallets()->findOrFail($id);
        $wallet->delete();

        return response()->json(['message' => 'Wallet deleted.']);
    }
}
