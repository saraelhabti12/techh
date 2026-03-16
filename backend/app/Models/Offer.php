<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'icon',
        'label',
        'title',
        'tagline',
        'description',
        'discount',
        'promo',
        'price',
        'expires',
    ];

    // Assuming offers might not need timestamps if they are more static
    public $timestamps = false;
}