<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(), // Usamos full_name
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => 'password123', 
            'phone_number' => fake()->numerify('##########'),
            'dob' => fake()->date(),
            'address' => fake()->address(),
            'state' => fake()->state(),
            'municipality' => fake()->city(),
            'section' => fake()->numerify('####'),
            'voter_key' => strtoupper(fake()->bothify('??????######?###')),
            'curp' => strtoupper(fake()->bothify('????######??????##')),
            'ocr_id' => fake()->numerify('#############'),
            'role' => 0, // Por defecto juvenil
            'remember_token' => Str::random(10),
        ];
    }
}