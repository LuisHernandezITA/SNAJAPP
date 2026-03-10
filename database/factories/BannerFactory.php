<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BannerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'image_url' => fake()->imageUrl(1280, 720, 'fashion'), // Genera una URL de imagen
            'alt_text' => fake()->sentence(3),
            'link_url' => '/products', // Un link interno de ejemplo
            'interval' => 2000
        ];
    }
}