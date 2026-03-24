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
        // Clear existing studios to avoid duplicates
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Studio::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $studios = [
            [
                'name' => "Full Access Studio", 
                'name_en' => "Full Access Studio", 
                'name_fr' => "Studio Accès Complet",
                'badge' => "Premium",
                'badge_en' => "Premium",
                'badge_fr' => "Haut de Gamme",
                'tagline' => "The complete professional experience",
                'tagline_en' => "The complete professional experience",
                'tagline_fr' => "L'expérience professionnelle complète",
                'description' => " Our Full Access Studio offers a complete professional environment designed for high-quality photo and video production. The space is fully equipped with advanced lighting systems, backdrops, and professional cameras to meet the needs of creators, photographers, and production teams.

Ideal for:
- Professional photoshoots
- Video production
- Commercial projects",
                'description_en' => "Our Full Access Studio offers a complete professional environment designed for high-quality photo and video production. The space is fully equipped with advanced lighting systems, backdrops, and professional cameras to meet the needs of creators, photographers, and production teams.

Ideal for:
- Professional photoshoots
- Video production
- Commercial projects ",
                'description_fr' =>  " Notre Full Access Studio offre un environnement professionnel complet, conçu pour la production photo et vidéo de haute qualité. Cet espace est entièrement équipé avec des systèmes d’éclairage avancés, des fonds variés et du matériel adapté aux besoins des créateurs, photographes et équipes de production.

Idéal pour :
- Séances photo professionnelles
- Production vidéo
- Projets commerciaux
",
                'features_en' => ["Profoto Pro-11 Lighting Rig", "ARRI Alexa Mini Setup", "Soundproofed Control Room", "White & Green Cyc Walls", "Wardrobe & Makeup Room", "Client Lounge"],
                'features_fr' => ["Système d'éclairage Profoto Pro-11", "Kit ARRI Alexa Mini", "Régie insonorisée", "Cyclos Blanc et Vert", "Vestiaire et Maquillage", "Salon Client"],
                'price_per_hour' => 2000, 
                'color' => "#5e1da8",
                'image' => "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=75",
                'gallery' => [
                    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=75",
                    "https://images.unsplash.com/photo-1581092160562-40aa08e12e2c?w=700&q=70",
                ],
                'price' => 1000,
            ],
            [
                'name' => "White Screen Studio", 
                'name_en' => "White Screen Studio", 
                'name_fr' => "Studio Fond Blanc",
                'badge' => "Popular",
                'badge_en' => "Popular",
                'badge_fr' => "Populaire",
                'tagline' => "Infinity white for flawless shots",
                'tagline_en' => "Infinity white for flawless shots",
                'tagline_fr' => "Blanc infini pour des clichés impeccables",
                'description' => "This studio is designed for presentations, tutorials, and digital content creation. It features a high-quality screen setup, perfect for displaying visuals, slides, or background content during filming.

Ideal for:
- Educational videos
- Presentations
- YouTube content ",
                'description_en' => " This studio is designed for presentations, tutorials, and digital content creation. It features a high-quality screen setup, perfect for displaying visuals, slides, or background content during filming.

Ideal for:
- Educational videos
- Presentations
- YouTube content",
                'description_fr' => "Ce studio est spécialement conçu pour les présentations, tutoriels et créations de contenu digital. Il dispose d’un écran de haute qualité, idéal pour afficher des visuels, des slides ou des arrière-plans pendant l’enregistrement.

Idéal pour :
- Vidéos éducatives
- Présentations
- Contenu YouTube ",
                'features_en' => ["6x6m Seamless White Cyc", "Godox AD600 Pro Strobes ×4", "Heavy Duty C-Stands", "Capture One Tether Station", "Steamer & Garment Racks"],
                'features_fr' => ["Cyclo Blanc 6x6m sans couture", "4 Flashs Godox AD600 Pro", "Pieds C-Stands robustes", "Station Capture One connectée", "Défroisseur et Portants"],
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
                'name_en' => "Girly Space", 
                'name_fr' => "Espace Girly",
                'badge' => "Trending",
                'badge_en' => "Trending",
                'badge_fr' => "Tendance",
                'tagline' => "Instagrammable at every angle",
                'tagline_en' => "Instagrammable at every angle",
                'tagline_fr' => "Instagrammable sous tous les angles",
                'description' => "Our Girly Space is a vibrant and aesthetic studio designed for girls, young creators, and small celebrations. The space combines soft colors, stylish decor, and a playful atmosphere, making it perfect for both content creation and special moments.

Ideal for:
- Beauty & lifestyle content
- Social media photos & videos
- Kids photoshoots
- Birthday celebrations
- Small private events ",
                'description_en' => "Our Girly Space is a vibrant and aesthetic studio designed for girls, young creators, and small celebrations. The space combines soft colors, stylish decor, and a playful atmosphere, making it perfect for both content creation and special moments.

Ideal for:
- Beauty & lifestyle content
- Social media photos & videos
- Kids photoshoots
- Birthday celebrations
- Small private events ",
                'description_fr' => "
Notre Girly Space est un studio dynamique et esthétique, conçu spécialement pour les filles, les jeunes créateurs et les petites célébrations. L’espace combine des couleurs douces, une décoration élégante et une ambiance ludique, ce qui le rend idéal à la fois pour la création de contenu et pour des moments spéciaux.

Idéal pour :
- Contenu beauté et lifestyle
- Photos et vidéos pour les réseaux sociaux
- Shooting enfants
- Fêtes d’anniversaire
- Petits événements privés ",
                'features_en' => ["Modular Pastel Walls", "LED Ring Lights ×4", "Lighted Vanity Mirror", "Neon Accent Signage", "Prop Furniture Nook"],
                'features_fr' => ["Murs Pastel Modulaires", "4 Anneaux LED", "Miroir Maquillage Lumineux", "Enseignes Néon", "Coin Meubles et Accessoires"],
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
                'name_en' => "Podcast Space", 
                'name_fr' => "Espace Podcast",
                'badge' => "Creator",
                'badge_en' => "Creator",
                'badge_fr' => "Créateur",
                'tagline' => "Broadcast-grade audio & video",
                'tagline_en' => "Broadcast-grade audio & video",
                'tagline_fr' => "Audio et Vidéo de qualité diffusion",
                'description' => " 
A sound-optimized studio tailored for podcast recording and audio production. Equipped with professional microphones and audio systems to ensure clear and high-quality sound.

Ideal for:
- Podcast recording
- Interviews
- Voice content ",
                'description_en' => "
A sound-optimized studio tailored for podcast recording and audio production. Equipped with professional microphones and audio systems to ensure clear and high-quality sound.

                Ideal for:
               - Podcast recording
               - Interviews
               - Voice content",
                'description_fr' => " Un studio optimisé pour l’enregistrement audio et les podcasts. Il est équipé de matériel professionnel pour garantir une qualité sonore claire et nette.

Idéal pour :
- Enregistrement de podcasts
- Interviews
- Contenu audio",
                'features_en' => ["Acoustic Treatment", "4-Seat Custom Desk", "Shure SM7B Mics ×4", "RØDECaster Pro II", "Sony 4K PTZ Cameras ×3"],
                'features_fr' => ["Traitement Acoustique", "Bureau 4 places sur mesure", "4 Micros Shure SM7B", "RØDECaster Pro II", "3 Caméras PTZ Sony 4K"],
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
                'name_en' => "Content Space", 
                'name_fr' => "Espace Contenu",
                'badge' => "Versatile",
                'badge_en' => "Versatile",
                'badge_fr' => "Polyvalent",
                'tagline' => "One booking, five setups",
                'tagline_en' => "One booking, five setups",
                'tagline_fr' => "Une réservation, cinq décors",
                'description' => " A flexible and modern space designed for content creators who need a versatile setup. Whether you're filming short videos, reels, or social media content, this studio adapts to your needs.

Ideal for:
- TikTok / Reels
- Vlogging
- Creative content
",
                'description_en' => "A flexible and modern space designed for content creators who need a versatile setup. Whether you're filming short videos, reels, or social media content, this studio adapts to your needs.

Ideal for:
- TikTok / Reels
- Vlogging
- Creative content
 ",
                'description_fr' => " Un espace moderne et flexible, conçu pour les créateurs de contenu qui ont besoin d’un setup adaptable. Parfait pour filmer des vidéos courtes, reels ou contenu pour réseaux sociaux.

Idéal pour :
- TikTok / Reels
- Vlogs
- Contenu créatif",
                'features_en' => ["5 Pre-Dressed Corners", "Aputure LED Panels", "iPad Teleprompter", "Motorized Gimbals", "High-Speed Editing PC"],
                'features_fr' => ["5 Coins pré-décorés", "Panneaux LED Aputure", "Téléprompteur iPad", "Gimbals Motorisés", "PC de montage haute performance"],
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
                'name_en' => "Photography Room", 
                'name_fr' => "Salle Photographie",
                'badge' => "New",
                'badge_en' => "New",
                'badge_fr' => "Nouveau",
                'tagline' => "Perfect lighting, perfect shots",
                'tagline_en' => "Perfect lighting, perfect shots",
                'tagline_fr' => "Éclairage parfait, clichés parfaits",
                'description' => "An intimate 35m² space dedicated entirely to portrait and still-life photography. Outfitted with ceiling-mounted rails to keep the floor clear, 10+ seamless paper color choices, and a range of large softboxes and umbrellas.",
                'description_en' => "An intimate 35m² space dedicated entirely to portrait and still-life photography. Outfitted with ceiling-mounted rails to keep the floor clear, 10+ seamless paper color choices, and a range of large softboxes and umbrellas.",
                'description_fr' => "Un espace intimiste de 35m² dédié à la photographie de portrait et de nature morte. Équipé de rails au plafond pour libérer le sol, 10+ choix de couleurs de papier et une gamme de softboxes.",
                'features_en' => ["Ceiling Mounted Rails", "10+ Paper Backdrops", "Bowens Mount Modifiers", "Tethering Cart", "V-Flats"],
                'features_fr' => ["Rails montés au plafond", "10+ fonds en papier", "Modificateurs monture Bowens", "Chariot de prise de vue connectée", "V-Flats"],
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
