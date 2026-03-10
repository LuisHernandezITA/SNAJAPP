<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Products>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'description' => fake()->paragraph($nbSentences = 3),
            'category_id' => Category::all()->random()->id, 
            'price' => fake()->randomFloat(2, 10, 100),
            'available_stock' => fake()->numberBetween(1, 100),
            'images' => 'playeramm.png', // Ruta a la imagen de ejemplo
            'addition_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'available' => fake()->boolean(90), // 90% de disponibilidad
        ];
    }
}