<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->String('name', 100);
            $table->text('description');
            $table->unsignedBigInteger('category_id'); // Debes relacionar la categoría en una migración separada
            $table->decimal('price', 10, 2);
            $table->integer('available_stock');
            $table->text('images');
            $table->timestamp('addition_date');
            $table->boolean('available');
            
            // Define las restricciones de clave foránea para las relaciones con category, size y color
            $table->foreign('category_id')->references('id')->on('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
