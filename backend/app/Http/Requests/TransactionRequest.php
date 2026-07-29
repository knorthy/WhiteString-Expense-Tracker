<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'        => ['required', 'in:income,expense'],
            'category'    => ['required', 'string', 'min:2', 'max:100'],
            'amount'      => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'description' => ['nullable', 'string', 'max:500'],
            'date'        => ['required', 'date', 'before_or_equal:today'],
            'wallet_id'   => ['nullable', 'integer', 'exists:wallets,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required'        => 'Transaction type is required.',
            'type.in'              => 'Type must be either income or expense.',
            'category.required'    => 'Category is required.',
            'category.min'         => 'Category must be at least 2 characters.',
            'category.max'         => 'Category must be 100 characters or less.',
            'amount.required'      => 'Amount is required.',
            'amount.numeric'       => 'Amount must be a valid number.',
            'amount.min'           => 'Amount must be greater than zero.',
            'amount.max'           => 'Amount is too large.',
            'description.max'      => 'Description must be 500 characters or less.',
            'date.required'        => 'Date is required.',
            'date.date'            => 'Please provide a valid date.',
            'date.before_or_equal' => 'Date cannot be in the future.',
            'wallet_id.exists'     => 'Selected wallet does not exist.',
        ];
    }
}
