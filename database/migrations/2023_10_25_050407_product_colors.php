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
        Schema::create('product_colors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('color_id');

            // Define las restricciones de clave foránea para relacionar la tabla "product_colors" con las tablas "products" y "colors"
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('color_id')->references('id')->on('color');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_colors');
    }
};