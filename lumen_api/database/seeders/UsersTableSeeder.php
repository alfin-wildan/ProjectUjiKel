<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'staff15',
            'email' => 'staff15@gmail.com',
            'password' => Hash::make('staff15'),
            'role' => 'Staff',
        ]);
        // User::create([
        //     'username' => 'Staff',
        //     'email' => 'staff@gmail.com',
        //     'password' => Hash::make('staff'),
        //     'role' => 'staff',
        // ]);
    }
}
