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
        $products->name = "Snuff T-Logo";
        $products->description = "T-Shirt Snuff Classic Box Logo";
        $products->category_id = "1";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "https://i.postimg.cc/5tYK7yjC/snu1.jpg";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
        $products->name = "Snuff Cap";
        $products->description = "SMX-Cap Classic Logo";
        $products->category_id = "2";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "https://i.postimg.cc/gjrrf1st/cap.png";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
        $products->name = "ODIO T-Shirt Snuff";
        $products->description = "T-Shirt made with HATE-ODIO ";
        $products->category_id = "1";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "https://i.postimg.cc/7LFsp4TQ/snu2.jpg";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
        $products->name = "M.I.A T-Shirt Ocean";
        $products->description = "M.I.A Designed | Ocean Collection";
        $products->category_id = "1";
        $products->price = "100";
        $products->available_stock = "100";
        $products->images = "https://i.postimg.cc/pTKGvSfV/snu4.jpg";
        $products->addition_date = '2023-10-12';
        $products->available = True;
        $products->save();

        $products = new Products();
        $products->name = "Polo Snuff Shirt";
        $products->description = "Casual Snuff Polo Intervention";
        $products->category_id = 1; // Shirts
        $products->price = 45;
        $products->available_stock = 50;
        $products->images = "https://i.postimg.cc/DwYYPLfh/snu3.jpg";
        $products->addition_date = '2023-10-15';
        $products->available = true;
        $products->save();

        $products = new Products();
        $products->name = "BLS T-Shirt";
        $products->description = "Balas Collection";
        $products->category_id = 1; // Shirts
        $products->price = 120;
        $products->available_stock = 30;
        $products->images = "https://i.postimg.cc/SNk5Sm1B/snu5.jpg";
        $products->addition_date = '2023-10-14';
        $products->available = true;
        $products->save();

        $products = new Products();
        $products->name = "Cargo FARGO Snuff Pants";
        $products->description = "Fargo Collection";
        $products->category_id = 3; // Caps
        $products->price = 80;
        $products->available_stock = 75;
        $products->images = "https://i.postimg.cc/yxXbmGxp/snu6.jpg";
        $products->addition_date = '2023-10-13';
        $products->available = true;
        $products->save();

        $products = new Products();
        $products->name = "NY Snuff Cap";
        $products->description = "Niu York Cap Mexican Outlet";
        $products->category_id = 2; // Shirts
        $products->price = 60;
        $products->available_stock = 40;
        $products->images = "https://i.postimg.cc/6pQmZYXz/snu8.jpg";
        $products->addition_date = '2023-10-12';
        $products->available = true;
        $products->save();

        $products = new Products();
        $products->name = "Shagg Pants MX";
        $products->description = "Comfortable pants Shagg Collection";
        $products->category_id = 3; // Pants
        $products->price = 55;
        $products->available_stock = 60;
        $products->images = "https://i.postimg.cc/v8Wkw4h7/snu7.jpg";
        $products->addition_date = '2023-10-11';
        $products->available = true;
        $products->save();

        $products = new Products();
        $products->name = "KING D T-Shirt";
        $products->description = "King DDD T-Shirt Fall Collection";
        $products->category_id = 1; // Caps
        $products->price = 25;
        $products->available_stock = 90;
        $products->images = "https://i.postimg.cc/ydR5dxHH/snu9.jpg";
        $products->addition_date = '2023-10-10';
        $products->available = true;
        $products->save();

        $products = new Products();
    }

}
