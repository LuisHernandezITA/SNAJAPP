<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ShoppingCart;

class ShoppingCartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shoppingcart = new ShoppingCart();
        $shoppingcart->user_id = "1";
        $shoppingcart->product_id = "1";
        $shoppingcart->save();

        $shoppingcart = new ShoppingCart();
    }
}
