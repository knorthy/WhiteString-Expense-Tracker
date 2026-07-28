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
            'name'       => ['required', 'string', 'max:100'],
            'type'       => ['required', 'string', 'max:50'],
            'balance'    => ['required', 'numeric', 'min:0'],
        ];
    }
}
