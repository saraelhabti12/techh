<?php

namespace App\Http\Controllers;

use App\Models\Studio;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorites.
     */
    public function index()
    {
        $favorites = auth()->user()->favoriteStudios;
        return response()->json([
            'status' => 'success',
            'data' => $favorites
        ]);
    }

    /**
     * Add a studio to favorites.
     */
    public function store(Request $request)
    {
        $request->validate([
            'studio_id' => 'required|exists:studios,id'
        ]);

        auth()->user()->favoriteStudios()->syncWithoutDetaching([$request->studio_id]);

        return response()->json([
            'status' => 'success',
            'message' => 'Studio added to favorites'
        ]);
    }

    /**
     * Remove a studio from favorites.
     */
    public function destroy($studio_id)
    {
        auth()->user()->favoriteStudios()->detach($studio_id);

        return response()->json([
            'status' => 'success',
            'message' => 'Studio removed from favorites'
        ]);
    }
}
