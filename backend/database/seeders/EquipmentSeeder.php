<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipmentList = [
            ['name' => 'Camera', 'type' => 'Video', 'quantity' => 5, 'price_per_unit' => 200.00],
            ['name' => 'Lighting', 'type' => 'Lighting', 'quantity' => 10, 'price_per_unit' => 100.00],
            ['name' => 'Microphone', 'type' => 'Audio', 'quantity' => 8, 'price_per_unit' => 50.00],
            ['name' => 'Tripod', 'type' => 'Accessory', 'quantity' => 15, 'price_per_unit' => 20.00],
            ['name' => 'Green Screen', 'type' => 'Backdrop', 'quantity' => 2, 'price_per_unit' => 150.00],
        ];

        foreach ($equipmentList as $eq) {
            Equipment::create($eq);
        }
    }
}