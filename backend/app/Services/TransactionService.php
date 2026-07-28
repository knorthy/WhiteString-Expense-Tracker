<?php

namespace App\Services;

use App\Models\Transaction;
use App\Repositories\TransactionRepository;
use Illuminate\Database\Eloquent\Collection;

class TransactionService
{
    public function __construct(
        private readonly TransactionRepository $repository
    ) {}

    /**
     * @param  array{type?: string, category?: string, date_from?: string, date_to?: string}  $filters
     */
    public function list(array $filters = []): Collection
    {
        return $this->repository->getAll($filters);
    }

    public function find(int $id): Transaction
    {
        return $this->repository->findById($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Transaction
    {
        return $this->repository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data): Transaction
    {
        $transaction = $this->repository->findById($id);

        return $this->repository->update($transaction, $data);
    }

    public function delete(int $id): void
    {
        $transaction = $this->repository->findById($id);
        $this->repository->delete($transaction);
    }

    /**
     * @return array{
     *   total_income: float,
     *   total_expenses: float,
     *   net_revenue: float,
     *   income_by_category: array<string, float>,
     *   expense_by_category: array<string, float>
     * }
     */
    public function summary(): array
    {
        return $this->repository->getSummary();
    }

    /**
     * @return array<string>
     */
    public function categories(?string $type = null): array
    {
        return $this->repository->getCategories($type);
    }
}
