<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        Banner::create([
            'image_url' => '/img/ban1.png',
            'alt_text' => 'VER MÄS',
            'link_url' => '/promo1',
            'interval' => 2000
        ]);

        Banner::create([
            'image_url' => '/img/ban2.png',
            'alt_text' => 'COMPRA YA',
            'link_url' => '/promo2',
            'interval' => 1000
        ]);

        Banner::create([
            'image_url' => '/img/ban3.png',
            'alt_text' => 'VER MÄS',
            'link_url' => '/promo3',
            'interval' => 2000
        ]);
    }
}