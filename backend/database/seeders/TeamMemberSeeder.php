<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teamRoles = ['Photographer', 'Videographer', 'Lighting Technician', 'Sound Engineer', 'Editor'];

        foreach ($teamRoles as $role) {
            TeamMember::create([
                'name' => 'Expert ' . $role,
                'role' => $role,
                'email' => strtolower(str_replace(' ', '.', $role)) . '@techstudio.test',
                'phone' => '+212 600 000 000',
            ]);
        }
    }
}