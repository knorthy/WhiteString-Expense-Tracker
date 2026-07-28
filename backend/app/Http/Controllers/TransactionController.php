<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function __construct(
        private readonly TransactionService $service
    ) {}

    /**
     * GET /api/transactions
     */
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->transactions()->orderBy('date', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('date', [$request->date_from, $request->date_to]);
        }

        return response()->json($query->get());
    }

    /**
     * GET /api/transactions/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        return response()->json($transaction);
    }

    /**
     * POST /api/transactions
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $transaction = $this->service->create($request->user(), $request->validated());
        return response()->json($transaction, Response::HTTP_CREATED);
    }

    /**
     * PUT /api/transactions/{id}
     */
    public function update(TransactionRequest $request, int $id): JsonResponse
    {
        $transaction = $this->service->update($request->user(), $id, $request->validated());
        return response()->json($transaction);
    }

    /**
     * DELETE /api/transactions/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($request->user(), $id);
        return response()->json(['message' => 'Transaction deleted.']);
    }

    /**
     * GET /api/transactions/summary
     */
    public function summary(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totals = Transaction::where('user_id', $userId)
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        $totalIncome   = (float) ($totals['income']  ?? 0);
        $totalExpenses = (float) ($totals['expense'] ?? 0);

        $byCategory = Transaction::where('user_id', $userId)
            ->select('type', 'category', DB::raw('SUM(amount) as total'))
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

        return response()->json([
            'total_income'         => $totalIncome,
            'total_expenses'       => $totalExpenses,
            'net_revenue'          => $totalIncome - $totalExpenses,
            'income_by_category'   => $incomeByCategory,
            'expense_by_category'  => $expenseByCategory,
        ]);
    }

    /**
     * GET /api/categories
     */
    public function categories(Request $request): JsonResponse
    {
        $type  = $request->query('type');
        $query = Transaction::where('user_id', $request->user()->id)
            ->select('category')
            ->distinct();

        if ($type) {
            $query->where('type', $type);
        }

        return response()->json($query->orderBy('category')->pluck('category'));
    }
}
