<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    public $table = 'shopping_cart';

    protected $fillable = [
    'user_id',
    'product_id',
    'quantity', // Ahora sí la usamos
];

    // Si en la imagen ves que created_at y updated_at están en NULL, 
    // es mejor dejar esto en false para evitar errores de formato:
    public $timestamps = false;

    use HasFactory;
}
