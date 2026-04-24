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
        $category->name = "Líderes Juveniles";
        $category->description = "Programas diseñados para potenciar las habilidades de liderazgo en jóvenes, basados en los valores del humanismo político y el compromiso social.";
        $category->save();

        $category = new Category();
        $category->name = "Capacitación";
        $category->description = "Cursos técnicos y formativos orientados a la profesionalización de competencias integrales y el desarrollo de habilidades para la vida institucional.";
        $category->save();

        $category = new Category();
        $category->name = "Convocatoria";
        $category->description = "Espacios de participación y selección para proyectos especiales, voluntariados internacionales y programas de formación de alto impacto.";
        $category->save();

        $category = new Category();
    }
}
