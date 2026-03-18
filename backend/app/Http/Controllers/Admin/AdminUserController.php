<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        return response()->json($query->paginate(15));
    }

    public function show(User $user)
    {
        return response()->json([
            'data' => $user->load(['reservations.studio', 'reservations.slots'])
        ]);
    }

    public function toggleAdmin(User $user)
    {
        $user->update(['is_admin' => !$user->is_admin]);
        return response()->json(['message' => "Admin status updated for {$user->name}.", 'is_admin' => $user->is_admin]);
    }

    public function toggleBan(User $user)
    {
        $user->update(['is_banned' => !$user->is_banned]);
        return response()->json(['message' => "Ban status updated for {$user->name}.", 'is_banned' => $user->is_banned]);
    }
}
