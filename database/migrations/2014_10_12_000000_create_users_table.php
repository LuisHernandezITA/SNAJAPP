<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name'); // Cambiado de 'name' a 'full_name'
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number', 20)->nullable();
            
            // Datos extraídos por OCR
            $table->date('dob')->nullable();
            $table->text('address')->nullable();
            $table->string('state', 100); // Not Null según tu tabla
            $table->string('municipality', 100); // Not Null según tu tabla
            $table->string('section', 10)->nullable();
            $table->string('voter_key', 20)->nullable()->unique();
            $table->string('curp', 18)->nullable()->unique();
            $table->string('ocr_id', 50)->nullable();
            
            // Rol como TinyInt(1)
            $table->tinyInteger('role')->default(0); // 1: admin, 2: formador, 0: juvenil, etc.
            
            // Imágenes
            $table->string('id_card_front', 255)->nullable();
            $table->string('id_card_back', 255)->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};