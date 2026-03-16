<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\Studio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $studios = Studio::all();
        
        if ($studios->isEmpty()) {
            return;
        }

        $timeSlots = [
            "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", 
            "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00"
        ];

        $dates = [
            date('Y-m-d', strtotime('+1 day')),
            date('Y-m-d', strtotime('+2 days')),
            date('Y-m-d', strtotime('+3 days')),
        ];

        // Create some sample reservations
        foreach ($studios->take(3) as $index => $studio) {
            $date = $dates[$index % count($dates)];
            $slot = $timeSlots[$index % count($timeSlots)];
            
            Reservation::create([
                'booking_reference' => 'TS-' . time() . '-' . strtoupper(Str::random(4)),
                'studio_id' => $studio->id,
                'date' => $date,
                'time_slot' => $slot,
                'selected_equipment' => ['Camera', 'Lighting'],
                'selected_team_members' => ['Photographer'],
                'customer_name' => 'Demo User ' . $index,
                'customer_email' => "demo{$index}@example.com",
                'customer_phone' => '+1234567890',
                'service_type' => 'team',
                'total_price' => $studio->price_per_hour + 300 // Estimated base equipment
            ]);
        }
    }
}