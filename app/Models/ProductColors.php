<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductColors extends Model
{
    use HasFactory;

    public $table = 'product_colors';
    public $timestamps = false;

    protected $fillable = ['product_id', 'color_id'];
}
