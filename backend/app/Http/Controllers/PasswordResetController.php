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
    //first step
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]); //check if email is present

        $user = User::where('email', $request->email)->first(); //search user with the same email from the table

        if (!$user) {
            return response()->json(['message' => 'If that email exists, a code has been sent.']);
        }

        // generates 6 digit zero padded code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // upserts into password_reset_codes table, replaces existing row for same email
        DB::table('password_reset_codes')->updateOrInsert(
            ['email' => $request->email],
            [
                'code'       => $code,
                'expires_at' => now()->addMinutes(15),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // sends OTP email using PasswordResetCodeMail mailable
        Mail::to($request->email)->send(new PasswordResetCodeMail($code));

        return response()->json(['message' => 'If that email exists, a code has been sent.']);
    }


    // checks the validity of the code after getting it from mailtrap
    public function verifyResetCode(Request $request): JsonResponse
    {
        $request->validate([ // check if theres an email and pass
            'email' => ['required', 'email'],
            'code'  => ['required', 'string', 'size:6'],
        ]);

        //check if the entered code is similar from the table
        $record = DB::table('password_reset_codes')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json(['valid' => false, 'message' => 'Invalid code.'], 422);
        }

        // checks expiry column in password_reset_codes table
        if (now()->isAfter($record->expires_at)) {
            return response()->json(['valid' => false, 'message' => 'Code has expired.'], 422);
        }

        return response()->json(['valid' => true]);
    }

    // where the user enters their new pass and comfirms it
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
            // removes expired OTP row before returning
            DB::table('password_reset_codes')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Code has expired. Please request a new one.'], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // hashes and saves new password into users table
        $user->update(['password' => Hash::make($request->password)]);

        // removes used OTP row from password_reset_codes table
        DB::table('password_reset_codes')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successfully.']);
    }
}
