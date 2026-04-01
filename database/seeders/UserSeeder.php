<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'full_name' => 'Administrador General',
            'email' => 'Admin@gmail.com',
            'email_verified_at' => now(),
            'password' => 'admin1234',
            'state' => 'Aguascalientes', // Campos obligatorios
            'municipality' => 'Aguascalientes',
            'role' => 1, // 1 para Admin
            'remember_token' => 'AdminProXxXx',
        ]);

        // Usuarios aleatorios
        User::factory(10)->create();
    }
}