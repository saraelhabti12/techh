<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $lang = $request->header('Accept-Language', 'en');
        if (str_contains($lang, 'fr')) {
            $lang = 'fr';
        } else {
            $lang = 'en';
        }

        $offers_en = [
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

        $offers_fr = [
            [
                'id' => 1, 'icon' => "🎟️", 'label' => "Le Plus Populaire",
                'title' => "Pass Mensuel Créateur",
                'tagline' => "Créativité illimitée, un prix fixe",
                'description' => "Réservez n'importe quelle combinaison de sessions Content Space & Podcast Space tout au long du mois sans frais par session. Limite de 20 heures/mois.",
                'discount' => 30, 'promo' => "CREATOR30", 'price' => 4900,
                'expires' => "2026-04-30",
            ],
            [
                'id' => 2, 'icon' => "📅", 'label' => "Offre Week-end",
                'title' => "Pack Week-end",
                'tagline' => "Tournez plus, payez moins le week-end",
                'description' => "Réservez n'importe quel studio samedi + dimanche dans la même réservation et recevez automatiquement 20% de réduction sur le total.",
                'discount' => 20, 'promo' => "WKND20", 'price' => 3500,
                'expires' => "2026-12-31",
            ],
            [
                'id' => 3, 'icon' => "✨", 'label' => "Première Fois",
                'title' => "Offre Premier Shooting",
                'tagline' => "Bienvenue chez TechStudio",
                'description' => "Nouveau chez TechStudio ? Votre première réservation d'une journée dans n'importe quel studio bénéficie de 15% de réduction — sans conditions.",
                'discount' => 15, 'promo' => "FIRST15", 'price' => 3500,
                'expires' => "2026-12-31",
            ],
        ];

        $offers = ($lang === 'fr') ? $offers_fr : $offers_en;

        return response()->json(['data' => $offers]);
    }
}
