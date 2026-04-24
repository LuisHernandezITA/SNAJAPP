<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Music;

class MusicSeeder extends Seeder
{
    public function run(): void
    {
        // Ejemplo manual para tu frontend
        Music::create([
            'nombre'   => 'Estatutos Generales del PAN',
            'artista'  => 'Snuffmex x Towena',
            'etiqueta' => 'NEW RELEASE',
            'urlmusic' => 'https://soundcloud.com/snuffmex/trustissues',
            'image'    => 'https://i.postimg.cc/k5RgR8vk/Towena-Route.jpg'
        ]);

        // Opcional: Generar 10 registros aleatorios usando el Factory
        // Music::factory(10)->create();
    }
}