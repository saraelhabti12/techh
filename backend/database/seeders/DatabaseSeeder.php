<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Disable foreign key checks for truncation
        Schema::disableForeignKeyConstraints();

        // Truncate tables in reverse order of dependency
        DB::table('reservations')->truncate();
        DB::table('equipment')->truncate(); // Equipment might be referenced by reservations as JSON, but good practice
        DB::table('team_members')->truncate(); // Team members might be referenced by reservations as JSON
        DB::table('studios')->truncate();
        // If you have a 'users' table and don't want to clear them, comment the line below
        // DB::table('users')->truncate();


        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();


        $this->call([
            AdminSeeder::class,
            StudioSeeder::class,
            EquipmentSeeder::class,
            TeamMemberSeeder::class,
            // ReservationSeeder must be called after Studio, Equipment, and TeamMember seeders
            ReservationSeeder::class,
        ]);
    }
}