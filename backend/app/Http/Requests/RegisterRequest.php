<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:100', 'regex:/^[\pL\s\'\-\.]+$/u'],
            'email'    => ['required', 'email:rfc,dns', 'unique:users,email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:100', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'    => 'Full name is required.',
            'name.min'         => 'Name must be at least 2 characters.',
            'name.max'         => 'Name must be 100 characters or less.',
            'name.regex'       => 'Name can only contain letters, spaces, hyphens, and apostrophes.',
            'email.required'   => 'Email address is required.',
            'email.email'      => 'Please enter a valid email address.',
            'email.unique'     => 'An account with this email already exists.',
            'email.max'        => 'Email address is too long.',
            'password.required'=> 'Password is required.',
            'password.min'     => 'Password must be at least 8 characters.',
            'password.max'     => 'Password must be 100 characters or less.',
            'password.confirmed'=> 'Passwords do not match.',
        ];
    }
}
