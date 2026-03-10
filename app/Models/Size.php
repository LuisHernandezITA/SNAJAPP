<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    public $table = 'size';
    public $timestamps = false;

    protected $fillable = ['name'];

}