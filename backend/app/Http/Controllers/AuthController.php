<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::info('Register attempt:', $request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User registered successfully:', ['user_id' => $user->id, 'email' => $user->email]);
        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        Log::info('Login attempt:', $request->all());
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            Log::warning('Login failed: Email not found', ['email' => $request->email]);
            return response()->json([
                'message' => 'You don’t have an account. Please sign up first.',
                'errors' => ['email' => ['You don’t have an account. Please sign up first.']]
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            Log::warning('Login failed: Incorrect password', ['email' => $request->email]);
            return response()->json([
                'message' => 'Incorrect password',
                'errors' => ['password' => ['Incorrect password']]
            ], 401);
        }

        $user->tokens()->delete(); // Revoke all previous tokens for this user
        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User logged in successfully:', ['user_id' => $user->id, 'email' => $user->email]);
        return response()->json([
            'message' => 'Logged in successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
