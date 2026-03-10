<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MusicFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->words(3, true),
            'artista' => fake()->name(),
            'etiqueta' => fake()->randomElement(['Cyberpunk', 'Industrial', 'Dark Wave', 'Techno']),
            'urlmusic' => 'https://open.spotify.com/track/' . fake()->uuid(),
            'image' => fake()->imageUrl(500, 500, 'music', true), 
        ];
    }
}