<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Create a transaction and adjust the wallet balance.
     *
     * @param  User  $user
     * @param  array<string, mixed>  $data
     */
    public function create(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            // Check sufficient balance for expense transactions
            if ($data['type'] === 'expense' && !empty($data['wallet_id'])) {
                $wallet = $user->wallets()->findOrFail($data['wallet_id']);
                if ((float) $wallet->balance < (float) $data['amount']) {
                    throw new \Illuminate\Validation\ValidationException(
                        \Illuminate\Support\Facades\Validator::make([], []),
                        response()->json([
                            'message' => 'Insufficient balance. ' . $wallet->name . ' only has ₱' . number_format($wallet->balance, 2) . ' available.',
                            'errors'  => ['amount' => ['Insufficient balance in selected wallet.']],
                        ], 422)
                    );
                }
            }

            $transaction = $user->transactions()->create($data);
            $this->adjustWalletBalance($user, $data['wallet_id'] ?? null, $data['type'], (float) $data['amount'], 'add');

            return $transaction;
        });
    }

    /**
     * Update a transaction and recalculate wallet balance.
     *
     * @param  User  $user
     * @param  int  $id
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, int $id, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $id, $data) {
            $transaction = $user->transactions()->findOrFail($id);

            // Reverse the old effect first so we can re-check balance accurately
            $this->adjustWalletBalance($user, $transaction->wallet_id, $transaction->type, (float) $transaction->amount, 'reverse');

            // Check balance for expense after reversing old effect
            if ($data['type'] === 'expense' && !empty($data['wallet_id'])) {
                $wallet = $user->wallets()->findOrFail($data['wallet_id']);
                $walletAfterReversal = (float) $wallet->fresh()->balance;
                if ($walletAfterReversal < (float) $data['amount']) {
                    // Re-apply the original to keep data consistent
                    $this->adjustWalletBalance($user, $transaction->wallet_id, $transaction->type, (float) $transaction->amount, 'add');
                    throw new \Illuminate\Validation\ValidationException(
                        \Illuminate\Support\Facades\Validator::make([], []),
                        response()->json([
                            'message' => 'Insufficient balance. ' . $wallet->name . ' only has ₱' . number_format($walletAfterReversal, 2) . ' available.',
                            'errors'  => ['amount' => ['Insufficient balance in selected wallet.']],
                        ], 422)
                    );
                }
            }

            $transaction->update($data);
            $this->adjustWalletBalance($user, $data['wallet_id'] ?? null, $data['type'], (float) $data['amount'], 'add');

            return $transaction->fresh();
        });
    }

    /**
     * Delete a transaction and reverse the wallet balance.
     *
     * @param  User  $user
     * @param  int  $id
     */
    public function delete(User $user, int $id): void
    {
        DB::transaction(function () use ($user, $id) {
            $transaction = $user->transactions()->findOrFail($id);

            // Reverse the effect on the wallet
            $this->adjustWalletBalance($user, $transaction->wallet_id, $transaction->type, (float) $transaction->amount, 'reverse');

            $transaction->delete();
        });
    }

    /**
     * Adjust a wallet's balance based on transaction type and action.
     *
     * @param  User  $user
     * @param  int|null  $walletId
     * @param  string  $type  'income' or 'expense'
     * @param  float  $amount
     * @param  string  $action  'add' or 'reverse'
     */
    private function adjustWalletBalance(User $user, ?int $walletId, string $type, float $amount, string $action): void
    {
        if (!$walletId) {
            return;
        }

        $wallet = $user->wallets()->find($walletId);

        if (!$wallet) {
            return;
        }

        // income 'add'     → +amount
        // expense 'add'    → -amount
        // income 'reverse' → -amount
        // expense 'reverse'→ +amount
        $isIncome  = $type === 'income';
        $isAdd     = $action === 'add';
        $delta     = ($isIncome === $isAdd) ? $amount : -$amount;

        $wallet->increment('balance', $delta);
    }
}
