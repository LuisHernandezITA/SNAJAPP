<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductColors;

class ProductColorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product_colors = new ProductColors();
        $product_colors->product_id = "1";
        $product_colors->color_id = "1";
        $product_colors->save();

        $product_colors = new ProductColors();
        $product_colors->product_id = "1";
        $product_colors->color_id = "2";
        $product_colors->save();

        $product_color = new ProductColors();
    }
}
