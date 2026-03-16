<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // For now, we'll return mock data similar to the frontend's OFFERS
        // In a real application, you would fetch these from the database
        $offers = [
            [
                'id' => 1, 'icon' => "🎟️", 'label' => "Most Popular",
                'title' => "Creator Monthly Pass",
                'tagline' => "Unlimited creativity, one flat price",
                'description' => "Book any combination of Content Space & Podcast Space sessions throughout the month with zero per-session fees. Limit 20 hours/month.",
                'discount' => 30, 'promo' => "CREATOR30", 'price' => 4900,
                'expires' => "2026-04-30",
            ],
            [
                'id' => 2, 'icon' => "📅", 'label' => "Weekend Deal",
                'title' => "Weekend Bundle",
                'tagline' => "Shoot more, pay less on weekends",
                'description' => "Reserve any studio Saturday + Sunday in the same booking and receive 20% off the combined total automatically.",
                'discount' => 20, 'promo' => "WKND20", 'price' => 3500,
                'expires' => "2026-12-31",
            ],
            [
                'id' => 3, 'icon' => "✨", 'label' => "First Time",
                'title' => "First Shoot Deal",
                'tagline' => "Welcome to TechStudio",
                'description' => "New to TechStudio? Your first single-day booking in any studio comes with 15% off — no conditions.",
                'discount' => 15, 'promo' => "FIRST15", 'price' => 3500,
                'expires' => "2026-12-31",
            ],
        ];

        return response()->json(['data' => $offers]);
    }
}