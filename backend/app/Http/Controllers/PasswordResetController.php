<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetCodeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    /**
     * POST /api/forgot-password
     * Generate a 6-digit OTP and email it.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', $request->email)->first();

        // Always return success to prevent email enumeration
        if (!$user) {
            return response()->json(['message' => 'If that email exists, a code has been sent.']);
        }

        // Generate 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store code in DB — replace any existing code for this email
        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $request->email],
            [
                'code'       => $code,
                'expires_at' => now()->addMinutes(15),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Send the email
        Mail::to($request->email)->send(new PasswordResetCodeMail($code));

        return response()->json(['message' => 'If that email exists, a code has been sent.']);
    }

    /**
     * POST /api/verify-reset-code
     * Just checks if the code is valid without consuming it.
     */
    public function verifyResetCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code'  => ['required', 'string', 'size:6'],
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json(['valid' => false, 'message' => 'Invalid code.'], 422);
        }

        if (now()->isAfter($record->expires_at)) {
            return response()->json(['valid' => false, 'message' => 'Code has expired.'], 422);
        }

        return response()->json(['valid' => true]);
    }

    /**
     * POST /api/reset-password
     * Verify OTP code and reset the password.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email'                 => ['required', 'email'],
            'code'                  => ['required', 'string', 'size:6'],
            'password'              => ['required', 'min:8', 'confirmed'],
        ]);

        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid code.'], 422);
        }

        if (now()->isAfter($record->expires_at)) {
            DB::table('password_reset_codes')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Code has expired. Please request a new one.'], 422);
        }

        // Update password
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);

        // Clean up used code
        DB::table('password_reset_codes')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successfully.']);
    }
}
