<?php

namespace Database\Seeders;

use App\Models\Studio;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudioSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Studio::truncate();
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [
            ['name' => 'Content', 'icon' => '📸', 'color' => '#a38bff'],
            ['name' => 'Podcast', 'icon' => '🎙️', 'color' => '#6e8eff'],
            ['name' => 'Shooting', 'icon' => '📹', 'color' => '#5e1da8'],
            ['name' => 'Girly Space', 'icon' => '✨', 'color' => '#ff7096'],
            ['name' => 'Birthday', 'icon' => '🎉', 'color' => '#f472b6'],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[$cat['name']] = Category::create($cat);
        }

        $studios = [
            // CONTENT
            [
                'category_id' => $createdCategories['Content']->id,
                'name' => "Content Space", 
                'name_en' => "Content Space", 
                'name_fr' => "Espace Contenu",
                'badge' => "Versatile",
                'tagline' => "One booking, five setups",
                'description' => "A flexible and modern space designed for content creators who need a versatile setup.",
                'features_en' => ["5 Pre-Dressed Corners", "Aputure LED Panels", "iPad Teleprompter"],
                'features_fr' => ["5 Coins pré-décorés", "Panneaux LED Aputure", "Téléprompteur iPad"],
                'price_per_hour' => 500, 
                'color' => "#a38bff",
                'image' => "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&q=75",
                'price' => 500,
            ],
            [
                'category_id' => $createdCategories['Content']->id,
                'name' => "Video Production Studio", 
                'name_en' => "Video Production Studio", 
                'name_fr' => "Studio de Production Vidéo",
                'badge' => "Professional",
                'tagline' => "High-end video gear included",
                'description' => "Fully equipped for professional video production and editing.",
                'features_en' => ["4K Cameras", "Pro Lighting", "Soundproofing"],
                'features_fr' => ["Caméras 4K", "Éclairage Pro", "Insonorisation"],
                'price_per_hour' => 800, 
                'color' => "#a38bff",
                'image' => "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=75",
                'price' => 800,
            ],
            [
                'category_id' => $createdCategories['Content']->id,
                'name' => "Streaming Setup Studio", 
                'name_en' => "Streaming Setup Studio", 
                'name_fr' => "Studio de Streaming",
                'badge' => "Live",
                'tagline' => "Go live with zero lag",
                'description' => "Perfect for streamers who want a professional look for their broadcasts.",
                'features_en' => ["Fiber Internet", "GoXLR", "Dual PC Setup"],
                'features_fr' => ["Internet Fibre", "GoXLR", "Setup Double PC"],
                'price_per_hour' => 450, 
                'color' => "#a38bff",
                'image' => "https://images.unsplash.com/photo-1598550874175-4d0fe40ff08a?w=800&q=75",
                'price' => 450,
            ],

            // PODCAST
            [
                'category_id' => $createdCategories['Podcast']->id,
                'name' => "Podcast Space", 
                'name_en' => "Podcast Space", 
                'name_fr' => "Espace Podcast",
                'badge' => "Creator",
                'tagline' => "Broadcast-grade audio & video",
                'description' => "A sound-optimized studio tailored for podcast recording and audio production.",
                'features_en' => ["Acoustic Treatment", "Shure SM7B Mics", "RØDECaster Pro II"],
                'features_fr' => ["Traitement Acoustique", "Micros Shure SM7B", "RØDECaster Pro II"],
                'price_per_hour' => 450, 
                'color' => "#6e8eff",
                'image' => "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=75",
                'price' => 450,
            ],
            [
                'category_id' => $createdCategories['Podcast']->id,
                'name' => "Solo Podcast Room", 
                'name_en' => "Solo Podcast Room", 
                'name_fr' => "Salle Podcast Solo",
                'badge' => "Cozy",
                'tagline' => "Perfect for single host recordings",
                'description' => "Intimate space designed for high-quality solo vocal performance.",
                'features_en' => ["Vocal Booth", "Preamp", "Monitoring"],
                'features_fr' => ["Cabine Vocale", "Préampli", "Monitoring"],
                'price_per_hour' => 300, 
                'color' => "#6e8eff",
                'image' => "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=75",
                'price' => 300,
            ],
            [
                'category_id' => $createdCategories['Podcast']->id,
                'name' => "Interview Setup Studio", 
                'name_en' => "Interview Setup Studio", 
                'name_fr' => "Studio d'Interview",
                'badge' => "Pro Audio",
                'tagline' => "Professional talk-show environment",
                'description' => "Spacious room designed for multi-person interviews and talk shows.",
                'features_en' => ["4 Mics", "Video Recording", "Comfortable Seating"],
                'features_fr' => ["4 Micros", "Enregistrement Vidéo", "Sièges Confortables"],
                'price_per_hour' => 600, 
                'color' => "#6e8eff",
                'image' => "https://images.unsplash.com/photo-1478737270197-c47e2e2d7f5d?w=800&q=75",
                'price' => 600,
            ],

            // SHOOTING
            [
                'category_id' => $createdCategories['Shooting']->id,
                'name' => "Full Access Studio", 
                'name_en' => "Full Access Studio", 
                'name_fr' => "Studio Accès Complet",
                'badge' => "Premium",
                'tagline' => "The complete professional experience",
                'description' => "Our Full Access Studio offers a complete professional environment designed for high-quality photo and video production.",
                'features_en' => ["Profoto Lighting", "ARRI Alexa Mini Setup", "White & Green Cyc Walls"],
                'features_fr' => ["Éclairage Profoto", "Kit ARRI Alexa Mini", "Cyclos Blanc et Vert"],
                'price_per_hour' => 2000, 
                'color' => "#5e1da8",
                'image' => "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=75",
                'price' => 1000,
            ],
            [
                'category_id' => $createdCategories['Shooting']->id,
                'name' => "White Screen Studio", 
                'name_en' => "White Screen Studio", 
                'name_fr' => "Studio Fond Blanc",
                'badge' => "Popular",
                'tagline' => "Infinity white for flawless shots",
                'description' => "This studio is designed for presentations, tutorials, and digital content creation.",
                'features_en' => ["6x6m Seamless White Cyc", "Godox AD600 Pro Strobes", "Capture One Station"],
                'features_fr' => ["Cyclo Blanc 6x6m sans couture", "Flashs Godox AD600 Pro", "Station Capture One"],
                'price_per_hour' => 600, 
                'color' => "#5e1da8",
                'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75",
                'price' => 600,
            ],
            [
                'category_id' => $createdCategories['Shooting']->id,
                'name' => "Product Photography Studio", 
                'name_en' => "Product Photography Studio", 
                'name_fr' => "Studio Photo Produit",
                'badge' => "Detail",
                'tagline' => "Macro-ready environment",
                'description' => "Dedicated to high-end product and commercial photography.",
                'features_en' => ["Macro Lenses", "Product Tables", "Custom Backgrounds"],
                'features_fr' => ["Objectifs Macro", "Tables de Produit", "Fonds Personnalisés"],
                'price_per_hour' => 500, 
                'color' => "#5e1da8",
                'image' => "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=75",
                'price' => 500,
            ],

            // GIRLY SPACE
            [
                'category_id' => $createdCategories['Girly Space']->id,
                'name' => "Girly Space", 
                'name_en' => "Girly Space", 
                'name_fr' => "Espace Girly",
                'badge' => "Trending",
                'tagline' => "Instagrammable at every angle",
                'description' => "Our Girly Space is a vibrant and aesthetic studio designed for girls, young creators, and small celebrations.",
                'features_en' => ["Modular Pastel Walls", "LED Ring Lights", "Lighted Vanity Mirror"],
                'features_fr' => ["Murs Pastel Modulaires", "Anneaux LED", "Miroir Maquillage Lumineux"],
                'price_per_hour' => 400, 
                'color' => "#ff7096",
                'image' => "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=75",
                'price' => 400,
            ],
            [
                'category_id' => $createdCategories['Girly Space']->id,
                'name' => "Beauty Studio", 
                'name_en' => "Beauty Studio", 
                'name_fr' => "Studio de Beauté",
                'badge' => "Glow",
                'tagline' => "Where glam meets professional production",
                'description' => "Designed for makeup tutorials, beauty reviews, and glamorous photoshoots.",
                'features_en' => ["Professional Vanity", "Ring Lights", "Glam Decor"],
                'features_fr' => ["Coiffeuse Professionnelle", "Anneaux Lumineux", "Déco Glam"],
                'price_per_hour' => 450, 
                'color' => "#ff7096",
                'image' => "https://images.unsplash.com/photo-1596462502278-27bfad450216?w=800&q=75",
                'price' => 450,
            ],
            [
                'category_id' => $createdCategories['Girly Space']->id,
                'name' => "Influencer Room", 
                'name_en' => "Influencer Room", 
                'name_fr' => "Chambre Influenceuse",
                'badge' => "Social",
                'tagline' => "Ready-to-use lifestyle sets",
                'description' => "Perfect for lifestyle bloggers and influencers who need a stylish home-like setting.",
                'features_en' => ["Boho Decor", "Natural Light", "Multiple Backdrops"],
                'features_fr' => ["Déco Boho", "Lumière Naturelle", "Plusieurs Fonds"],
                'price_per_hour' => 350, 
                'color' => "#ff7096",
                'image' => "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=75",
                'price' => 350,
            ],

            // BIRTHDAY
            [
                'category_id' => $createdCategories['Birthday']->id,
                'name' => "Birthday Room", 
                'name_en' => "Event Room", 
                'name_fr' => "Salle d'Événement",
                'badge' => "Party",
                'tagline' => "Celebrate your special day",
                'description' => "Large open space perfect for birthday parties and small events.",
                'features_en' => ["Sound System", "Tables & Chairs", "Mood Lighting"],
                'features_fr' => ["Système Sonore", "Tables et Chaises", "Éclairage d'Ambiance"],
                'price_per_hour' => 1000, 
                'color' => "#f472b6",
                'image' => "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800&q=75",
                'price' => 1000,
            ],
            [
                'category_id' => $createdCategories['Birthday']->id,
                'name' => "Party Studio", 
                'name_en' => "Party Studio", 
                'name_fr' => "Studio de Fête",
                'badge' => "Fun",
                'tagline' => "Everything you need for a great party",
                'description' => "Fully equipped party room with decorations and entertainment systems.",
                'features_en' => ["Karaoke", "Disco Ball", "Photo Booth"],
                'features_fr' => ["Karaoké", "Boule à Facettes", "Photo Booth"],
                'price_per_hour' => 1200, 
                'color' => "#f472b6",
                'image' => "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=75",
                'price' => 1200,
            ],
        ];

        foreach ($studios as $studioData) {
            Studio::create($studioData);
        }
    }
}