<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $wallet_id
 * @property string $type  'income' or 'expense'
 * @property string $category
 * @property float $amount
 * @property string|null $description
 * @property Carbon $date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */

// maps to transactions table, used by TransactionController, TransactionService, TransactionRepository
class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'wallet_id',
        'type',
        'category',
        'amount',
        'description',
        'date',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'date'   => 'date',
        ];
    }

    // reads users table, used when accessing transaction owner
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // reads wallets table, used when accessing the wallet linked to a transaction
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    // scope: filters transactions table by type income, used in TransactionRepository
    public function scopeIncome(Builder $query): Builder
    {
        return $query->where('type', 'income');
    }

    // scope: filters transactions table by type expense, used in TransactionRepository
    public function scopeExpense(Builder $query): Builder
    {
        return $query->where('type', 'expense');
    }

    // scope: filters transactions table by category column, used in TransactionRepository
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    // scope: filters transactions table by date range, used in TransactionRepository and TransactionController
    public function scopeByDateRange(Builder $query, string $from, string $to): Builder
    {
        return $query->whereBetween('date', [$from, $to]);
    }
}
