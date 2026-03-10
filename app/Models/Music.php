<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Music extends Model
{
    use HasFactory;

    // Laravel por defecto busca la tabla 'music', pero si quieres ser explícito:
    protected $table = 'music';

    protected $fillable = [
        'nombre',
        'artista',
        'etiqueta',
        'urlmusic',
        'image'
    ];
}