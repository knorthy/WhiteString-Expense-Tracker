<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TransactionController extends Controller
{
    public function __construct(
        private readonly TransactionService $service
    ) {}

    /**
     * GET /api/transactions
     * Accepts optional query params: type, category, date_from, date_to
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['type', 'category', 'date_from', 'date_to']);
        $transactions = $this->service->list($filters);

        return response()->json($transactions);
    }

    /**
     * GET /api/transactions/{id}
     */
    public function show(int $id): JsonResponse
    {
        $transaction = $this->service->find($id);

        return response()->json($transaction);
    }

    /**
     * POST /api/transactions
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $transaction = $this->service->create($request->validated());

        return response()->json($transaction, Response::HTTP_CREATED);
    }

    /**
     * PUT /api/transactions/{id}
     */
    public function update(TransactionRequest $request, int $id): JsonResponse
    {
        $transaction = $this->service->update($id, $request->validated());

        return response()->json($transaction);
    }

    /**
     * DELETE /api/transactions/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json(['message' => 'Transaction deleted.'], Response::HTTP_OK);
    }

    /**
     * GET /api/transactions/summary
     */
    public function summary(): JsonResponse
    {
        $data = $this->service->summary();

        return response()->json($data);
    }

    /**
     * GET /api/categories?type=income|expense
     */
    public function categories(Request $request): JsonResponse
    {
        $type = $request->query('type');
        $categories = $this->service->categories($type);

        return response()->json($categories);
    }
}
