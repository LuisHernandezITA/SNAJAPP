<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Color;
use App\Models\Products;
use App\Models\ProductColors;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product_Colors>
 */
class ProductColorsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Products::all()->random()->id, 
            'color_id' => Color::all()->random()->id, 
        ];
    }
}
