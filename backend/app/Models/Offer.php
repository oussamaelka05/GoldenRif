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
        'created_at'     => 'datetime',
    ];

    public function scopeActive($query)
    {
        $today = now()->toDateString();
        return $query->where('active', true)
            ->where(fn($q) => $q->whereNull('valid_from')->orWhere('valid_from', '<=', $today))
            ->where(fn($q) => $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today));
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
