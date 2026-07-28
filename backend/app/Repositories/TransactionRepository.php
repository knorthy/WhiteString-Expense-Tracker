<?php

namespace App\Repositories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TransactionRepository
{
    /**
     * Return all transactions, optionally filtered.
     *
     * @param  array{type?: string, category?: string, date_from?: string, date_to?: string}  $filters
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Transaction::query()->orderBy('date', 'desc');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['category'])) {
            $query->byCategory($filters['category']);
        }

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->byDateRange($filters['date_from'], $filters['date_to']);
        }

        return $query->get();
    }

    /**
     * Find a single transaction by primary key.
     */
    public function findById(int $id): Transaction
    {
        return Transaction::findOrFail($id);
    }

    /**
     * Persist a new transaction.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    /**
     * Update an existing transaction.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);

        return $transaction->fresh();
    }

    /**
     * Delete a transaction.
     */
    public function delete(Transaction $transaction): void
    {
        $transaction->delete();
    }

    /**
     * Return aggregate totals grouped by type and category.
     *
     * @return array{
     *   total_income: float,
     *   total_expenses: float,
     *   net_revenue: float,
     *   income_by_category: array<string, float>,
     *   expense_by_category: array<string, float>
     * }
     */
    public function getSummary(): array
    {
        $totals = Transaction::select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        $totalIncome   = (float) ($totals['income']  ?? 0);
        $totalExpenses = (float) ($totals['expense'] ?? 0);

        $byCategory = Transaction::select('type', 'category', DB::raw('SUM(amount) as total'))
            ->groupBy('type', 'category')
            ->get();

        $incomeByCategory  = [];
        $expenseByCategory = [];

        foreach ($byCategory as $row) {
            if ($row->type === 'income') {
                $incomeByCategory[$row->category] = (float) $row->total;
            } else {
                $expenseByCategory[$row->category] = (float) $row->total;
            }
        }

        return [
            'total_income'          => $totalIncome,
            'total_expenses'        => $totalExpenses,
            'net_revenue'           => $totalIncome - $totalExpenses,
            'income_by_category'    => $incomeByCategory,
            'expense_by_category'   => $expenseByCategory,
        ];
    }

    /**
     * Return all distinct categories for a given type (or all types).
     *
     * @return array<string>
     */
    public function getCategories(?string $type = null): array
    {
        $query = Transaction::select('category')->distinct();

        if ($type !== null) {
            $query->where('type', $type);
        }

        return $query->orderBy('category')->pluck('category')->toArray();
    }
}
