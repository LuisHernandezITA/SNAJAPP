<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('music', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('artista');
            $table->string('etiqueta')->nullable(); // Ej: Rock, Techno, New Arrival
            $table->string('urlmusic'); // El link a Spotify, YouTube o archivo local
            $table->string('image'); // Ruta de la carátula
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('music');
    }
};