<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Products;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = new Products();
        $products->name = "Lideres Juveniles 1 (MARZO 2026)";
        $products->description = "Curso de Lideres Juveniles";
        $products->category_id = "1";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "img/ban2.png";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
        $products->name = "Lideres Juveniles 2 (MARZO 2026)";
        $products->description = "Curso de Lideres Juveniles 2";
        $products->category_id = "2";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "img/ban1.png";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
        $products->name = "Lideres Juveniles 3 (MARZO 2026)";
        $products->description = "Curso de Lideres Juveniles 3";
        $products->category_id = "1";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "img/ban3.png";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
    }

}
