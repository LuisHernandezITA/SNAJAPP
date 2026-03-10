<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Size;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $size = new Size();
        $size->name = "S";
        $size->save();
        
        $size = new Size();
        $size->name = "M";
        $size->save();

        $size = new Size();
        $size->name = "L";
        $size->save();

        $size = new Size();
        $size->name = "XL";
        $size->save();

        $size = new Size();
    }
}
