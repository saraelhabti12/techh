<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'techweb.ma@gmail.com'],
            [
                'name' => 'Admin TechStudio',
                'password' => Hash::make('Admin123!'),
                'is_admin' => true,
            ]
        );
    }
}
