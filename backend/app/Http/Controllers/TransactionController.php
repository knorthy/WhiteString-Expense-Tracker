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
    // TransactionService injected here to handle balance adjustments on create, update, delete
    public function __construct(
        private readonly TransactionService $service
    ) {}

    // GET /api/transactions, reads transactions table filtered by user, type, category, date range, called from transactions.js getTransactions
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

    // GET /api/transactions/:id, reads single row from transactions table, called from transactions.js getTransaction
    public function show(Request $request, int $id): JsonResponse
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        return response()->json($transaction);
    }

    // POST /api/transactions, inserts row into transactions table and updates wallet balance, delegates to TransactionService, called from transactions.js createTransaction
    public function store(TransactionRequest $request): JsonResponse
    {
        $transaction = $this->service->create($request->user(), $request->validated()); //insert rows and adjust the wallet balance
        return response()->json($transaction, Response::HTTP_CREATED);
    }

    // PUT /api/transactions/:id, updates row in transactions table and recalculates wallet balance, delegates to TransactionService, called from transactions.js updateTransaction
    public function update(TransactionRequest $request, int $id): JsonResponse
    {
        $transaction = $this->service->update($request->user(), $id, $request->validated());
        return response()->json($transaction);
    }

    // DELETE /api/transactions/:id, removes row from transactions table and reverses wallet balance, delegates to TransactionService, called from transactions.js deleteTransaction
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($request->user(), $id);
        return response()->json(['message' => 'Transaction deleted.']);
    }

    // GET /api/transactions/summary, reads transactions table and returns totals grouped by type and category, called from transactions.js getSummary
    public function summary(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totals = Transaction::where('user_id', $userId)
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->pluck('total', 'type'); // query group by type

        $totalIncome   = (float) ($totals['income']  ?? 0);
        $totalExpenses = (float) ($totals['expense'] ?? 0); //extract income/expense total

        $byCategory = Transaction::where('user_id', $userId)
            ->select('type', 'category', DB::raw('SUM(amount) as total'))
            ->groupBy('type', 'category')
            ->get(); //sum query but grouped by both type and category

        $incomeByCategory  = [];
        $expenseByCategory = [];

        foreach ($byCategory as $row) { // split result forn income/expense
            if ($row->type === 'income') {
                $incomeByCategory[$row->category] = (float) $row->total;
            } else {
                $expenseByCategory[$row->category] = (float) $row->total;
            }
        }

        return response()->json([ //reutrns calculated values
            'total_income'         => $totalIncome,
            'total_expenses'       => $totalExpenses,
            'net_revenue'          => $totalIncome - $totalExpenses,
            'income_by_category'   => $incomeByCategory,
            'expense_by_category'  => $expenseByCategory,
        ]);
    }

    // GET /api/categories, reads distinct category values from transactions table, called from transactions.js getCategories
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
