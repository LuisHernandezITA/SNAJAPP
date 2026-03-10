<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Products;
use App\Models\ProductSizes;
use App\Models\ProductColors;
use App\Models\Category;
use App\Models\Size;
use App\Models\Banner;
use App\Models\Music;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        Artisan::call('passport:install', ['--force' => true]);

        $this->call(UserSeeder::Class);
        $this->call(CategorySeeder::Class);
        $this->call(SizeSeeder::Class);
        $this->call(ColorSeeder::Class);
        $this->call(ProductsSeeder::Class);
        $this->call(ProductSizesSeeder::Class);
        $this->call(ProductColorsSeeder::Class);
        $this->call(ShoppingCartSeeder::Class);
        $this->call(BannerSeeder::class);
        $this->call(MusicSeeder::class);
        User::factory(8)->create();
    }
}
