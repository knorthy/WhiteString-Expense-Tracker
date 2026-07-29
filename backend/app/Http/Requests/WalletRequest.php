<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WalletRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'wallet_key' => ['required', 'string', 'max:50'],
            'name'       => ['required', 'string', 'min:2', 'max:100'],
            'type'       => ['required', 'string', 'max:50'],
            'balance'    => ['required', 'numeric', 'min:0', 'max:99999999.99'],
        ];
    }

    public function messages(): array
    {
        return [
            'wallet_key.required' => 'Please select a wallet or bank.',
            'name.required'       => 'Wallet name is required.',
            'name.min'            => 'Wallet name must be at least 2 characters.',
            'balance.required'    => 'Balance is required.',
            'balance.numeric'     => 'Balance must be a valid number.',
            'balance.min'         => 'Balance cannot be negative.',
            'balance.max'         => 'Balance amount is too large.',
        ];
    }
}
