<?php

namespace Database\Seeders;

use App\Models\Studio;
use Illuminate\Database\Seeder;

class StudioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $studios = [
            [
                'name' => "Full Access Studio", 
                'badge' => "Premium",
                'tagline' => "The complete professional experience",
                'description' => "A spacious 150m² soundstage equipped with pre-rigged Profoto lighting and a full Arri cinema camera setup. Ideal for music videos, TV commercials, and large crew productions. Includes dedicated hair/makeup stations and client lounge.",
                'features' => ["Profoto Pro-11 Lighting Rig", "ARRI Alexa Mini Setup", "Soundproofed Control Room", "White & Green Cyc Walls", "Wardrobe & Makeup Room", "Client Lounge"],
                'price_per_hour' => 2000, 
                'color' => "#5e1da8",
                'image' => "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=75",
                    "https://images.unsplash.com/photo-1581092160562-40aa08e12e2c?w=700&q=70",
                ],
                'price' => 2000,
            ],
            [
                'name' => "White Screen Studio", 
                'badge' => "Popular",
                'tagline' => "Infinity white for flawless shots",
                'description' => "A 60m² dedicated cyclorama studio featuring a seamless 6x6 meter infinity curve. This space is optimized for e-commerce, lookbooks, and clean editorial photography. Comes standard with Godox strobes and heavy-duty c-stands.",
                'features' => ["6x6m Seamless White Cyc", "Godox AD600 Pro Strobes ×4", "Heavy Duty C-Stands", "Capture One Tether Station", "Steamer & Garment Racks"],
                'price_per_hour' => 600, 
                'color' => "#f472b6",
                'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75",
                    "https://images.unsplash.com/photo-1526816137703-14f7509b9dc6?w=700&q=70",
                ],
                'price' => 600,
            ],
            [
                'name' => "Girly Space", 
                'badge' => "Trending",
                'tagline' => "Instagrammable at every angle",
                'description' => "A highly stylized 40m² set designed specifically for social media influencers and beauty brands. Features modular pastel wall panels, neon accent lighting, and a fully illuminated vanity mirror. Natural daylight options available.",
                'features' => ["Modular Pastel Walls", "LED Ring Lights ×4", "Lighted Vanity Mirror", "Neon Accent Signage", "Prop Furniture Nook"],
                'price_per_hour' => 400, 
                'color' => "#ff7096",
                'image' => "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=75",
                    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=70",
                ],
                'price' => 400,
            ],
            [
                'name' => "Podcast Space", 
                'badge' => "Creator",
                'tagline' => "Broadcast-grade audio & video",
                'description' => "A turnkey, acoustically treated podcasting environment. Set up for up to 4 hosts with Shure SM7B microphones, a RØDECaster Pro II mixer, and automated 3-camera switching (Sony 4K) for immediate live streaming or easy post-production.",
                'features' => ["Acoustic Treatment", "4-Seat Custom Desk", "Shure SM7B Mics ×4", "RØDECaster Pro II", "Sony 4K PTZ Cameras ×3"],
                'price_per_hour' => 450, 
                'color' => "#6e8eff",
                'image' => "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=75",
                    "https://images.unsplash.com/photo-1478737270197-c47e2e2d7f5d?w=700&q=70",
                ],
                'price' => 450,
            ],
            [
                'name' => "Content Space", 
                'badge' => "Versatile",
                'tagline' => "One booking, five setups",
                'description' => "Our most flexible studio. A 50m² room offering 5 distinct, pre-dressed corners ranging from a moody study to a modern kitchen facade. Perfect for YouTubers shooting bulk content or corporate talking-head interviews.",
                'features' => ["5 Pre-Dressed Corners", "Aputure LED Panels", "iPad Teleprompter", "Motorized Gimbals", "High-Speed Editing PC"],
                'price_per_hour' => 500, 
                'color' => "#a38bff",
                'image' => "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&q=75",
                    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=70",
                ],
                'price' => 500,
            ],
            [
                'name' => "Photography Room", 
                'badge' => "New",
                'tagline' => "Perfect lighting, perfect shots",
                'description' => "An intimate 35m² space dedicated entirely to portrait and still-life photography. Outfitted with ceiling-mounted rails to keep the floor clear, 10+ seamless paper color choices, and a range of large softboxes and umbrellas.",
                'features' => ["Ceiling Mounted Rails", "10+ Paper Backdrops", "Bowens Mount Modifiers", "Tethering Cart", "V-Flats"],
                'price_per_hour' => 400, 
                'color' => "#22c07a",
                'image' => "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=75",
                ],
                'price' => 400,
            ],
        ];

        foreach ($studios as $studioData) {
            Studio::create($studioData);
        }
    }
}