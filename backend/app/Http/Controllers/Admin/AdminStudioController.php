<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Studio;
use Illuminate\Http\Request;

class AdminStudioController extends Controller
{
    public function index(Request $request)
    {
        $query = Studio::query();

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%")
                  ->orWhere('name_fr', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'tagline_en' => 'nullable|string|max:255',
            'tagline_fr' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_en' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'price_per_hour' => 'required|numeric',
            'image' => 'required|string',
            'features' => 'nullable|array',
            'features_en' => 'nullable|array',
            'features_fr' => 'nullable|array',
            'badge' => 'nullable|string',
            'badge_en' => 'nullable|string',
            'badge_fr' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $studio = Studio::create($validated);

        return response()->json(['message' => 'Studio created successfully.', 'data' => $studio], 201);
    }

    public function show(Studio $studio)
    {
        return response()->json(['data' => $studio]);
    }

    public function update(Request $request, Studio $studio)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'name_fr' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'tagline_en' => 'nullable|string|max:255',
            'tagline_fr' => 'nullable|string|max:255',
            'description' => 'sometimes|string',
            'description_en' => 'nullable|string',
            'description_fr' => 'nullable|string',
            'price_per_hour' => 'sometimes|numeric',
            'image' => 'sometimes|string',
            'features' => 'nullable|array',
            'features_en' => 'nullable|array',
            'features_fr' => 'nullable|array',
            'badge' => 'nullable|string',
            'badge_en' => 'nullable|string',
            'badge_fr' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $studio->update($validated);

        return response()->json(['message' => 'Studio updated successfully.', 'data' => $studio]);
    }

    public function destroy(Studio $studio)
    {
        $studio->delete();
        return response()->json(['message' => 'Studio deleted successfully.']);
    }
}
