<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // POST /api/register, inserts row into users table, creates token in personal_access_tokens, called from auth.js register
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken; //for sanctum

        // logs the register action into user_activity_logs table
        UserActivityLog::create([
            'user_id'    => $user->id,
            'action'     => 'register',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], Response::HTTP_CREATED);
    }

    // POST /api/login, reads users table to verify credentials, creates token, called from auth.js login
    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        // logs the login action into user_activity_logs table
        UserActivityLog::create([
            'user_id'    => $user->id,
            'action'     => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    // POST /api/logout, deletes current token from personal_access_tokens, called from auth.js logout
    public function logout(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $request->user()->currentAccessToken()->delete();

        // logs the logout action into user_activity_logs table
        UserActivityLog::create([
            'user_id'    => $userId,
            'action'     => 'logout',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'Logged out.']);
    }

    // GET /api/user, reads current user row from users table, called from auth.js getMe
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
