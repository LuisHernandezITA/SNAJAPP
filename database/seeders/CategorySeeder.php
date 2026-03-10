<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = new Category();
        $category->name = "T-Shirts";
        $category->description = "Short-sleeved, casual garment, typically made of cotton or a cotton blend, with a T-shaped body and no collar. It's a popular clothing item known for its comfort, versatility, and wide range of styles, making it a great choice for personal expression and everyday wear";
        $category->save();

        $category = new Category();
        $category->name = "Caps";
        $category->description = "A headwear accessory with a rounded crown and visor, providing sun protection and style.";
        $category->save();

        $category = new Category();
        $category->name = "Pants";
        $category->description = "Lower-body garments covering waist to ankles, available in various styles for fashion and function";
        $category->save();

        $category = new Category();
    }
}
