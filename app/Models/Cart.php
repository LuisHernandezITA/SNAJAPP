<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'id',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}