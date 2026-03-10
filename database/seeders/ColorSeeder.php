<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $color = new Color();
        $color->name = "Black";
        $color->save();
        
        $color = new Color();
        $color->name = "White";
        $color->save();

        $color = new Color();
        $color->name = "SaddleBrown";
        $color->save();

        $color = new Color();
        $color->name = "Pink";
        $color->save();

        $color = new Color();
        $color->name = "DarkRed";
        $color->save();

        $color = new Color();
        $color->name = "Gold";
        $color->save();

        $color = new Color();
        $color->name = "GreenYellow";
        $color->save();

        $color = new Color();
        $color->name = "DarkBlue";
        $color->save();

        $color = new Color();
    }
}
