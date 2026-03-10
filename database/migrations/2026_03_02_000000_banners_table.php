<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('image_url'); // Dirección de la imagen
            $table->string('alt_text')->nullable(); // Texto alternativo
            $table->string('link_url')->nullable(); // Link para el botón de info
            $table->integer('interval')->default(2000); // Duración en milisegundos
            $table->timestamps(); // Siempre es bueno tenerlo para saber cuándo se creó
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};