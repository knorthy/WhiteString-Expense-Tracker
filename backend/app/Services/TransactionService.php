<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    // called by TransactionController store, inserts row into transactions table and adds or subtracts from wallet balance
    public function create(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            // reads wallets table to check if expense amount exceeds current balance
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

            // adjusts balance column in wallets table after inserting transaction
            $this->adjustWalletBalance($user, $data['wallet_id'] ?? null, $data['type'], (float) $data['amount'], 'add');

            return $transaction;
        });
    }

    // called by TransactionController update, updates row in transactions table and recalculates wallet balance
    public function update(User $user, int $id, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $id, $data) {
            $transaction = $user->transactions()->findOrFail($id);

            // reverses old transaction effect on wallet before applying new one
            $this->adjustWalletBalance($user, $transaction->wallet_id, $transaction->type, (float) $transaction->amount, 'reverse');

            // re-checks balance after reversal before committing new expense amount
            if ($data['type'] === 'expense' && !empty($data['wallet_id'])) {
                $wallet = $user->wallets()->findOrFail($data['wallet_id']);
                $walletAfterReversal = (float) $wallet->fresh()->balance;
                if ($walletAfterReversal < (float) $data['amount']) {
                    // re-applies old amount to keep wallets table consistent on failure
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

            // applies new transaction effect on wallet balance
            $this->adjustWalletBalance($user, $data['wallet_id'] ?? null, $data['type'], (float) $data['amount'], 'add');

            return $transaction->fresh();
        });
    }

    // called by TransactionController destroy, removes row from transactions table and reverses wallet balance
    public function delete(User $user, int $id): void
    {
        DB::transaction(function () use ($user, $id) {
            $transaction = $user->transactions()->findOrFail($id);

            // reverses the transaction effect on wallets table before deleting
            $this->adjustWalletBalance($user, $transaction->wallet_id, $transaction->type, (float) $transaction->amount, 'reverse');

            $transaction->delete();
        });
    }

    // updates balance column in wallets table, used by create, update, delete above
    // income add = +amount, expense add = -amount, income reverse = -amount, expense reverse = +amount
    private function adjustWalletBalance(User $user, ?int $walletId, string $type, float $amount, string $action): void
    {
        if (!$walletId) {
            return;
        }

        $wallet = $user->wallets()->find($walletId);

        if (!$wallet) {
            return;
        }

        $isIncome  = $type === 'income';
        $isAdd     = $action === 'add';
        $delta     = ($isIncome === $isAdd) ? $amount : -$amount;

        $wallet->increment('balance', $delta);
    }
}
