<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin account
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@admin.com',
            'password' => Hash::make('Administrator'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Test accounts
        User::create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => Hash::make('KontoTest11'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Wojciech Ross',
            'email' => 'wojciech.ross@wr.com',
            'password' => Hash::make('WojRoss123'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Agnieszka Niemieszka',
            'email' => 'agnieszka.niemieszka@an.com',
            'password' => Hash::make('AgnieszkaNiemieszka123'),
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);
    }
}
