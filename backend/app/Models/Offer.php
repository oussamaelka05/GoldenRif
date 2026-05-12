<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'car_id', 'user_id', 'title', 'description',
        'discount_type', 'discount_value', 'valid_from', 'valid_until', 'active',
    ];

    protected $casts = [
        'active'         => 'boolean',
        'discount_value' => 'float',
        'valid_from'     => 'date:Y-m-d',
        'valid_until'    => 'date:Y-m-d',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
