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
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('size_id');

            // Define las restricciones de clave foránea para relacionar la tabla "product_sizes" con las tablas "products" y "sizes"
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('size_id')->references('id')->on('size');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_sizes');
    }
};

