<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'brand', 'model', 'year', 'category',
        'price_per_day', 'seats', 'transmission', 'fuel_type',
        'image_url', 'description', 'location', 'whatsapp', 'available',
    ];

    protected $casts = [
        'available' => 'boolean',
        'price_per_day' => 'float',
        'year' => 'integer',
        'seats' => 'integer',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function bookings()
    {
        return $this->hasMany(\App\Models\Booking::class);
    }

    public function offers()
    {
        return $this->hasMany(\App\Models\Offer::class);
    }

    // Single active offer for eager loading (used in index/show)
    public function activeOffer()
    {
        $today = now()->toDateString();
        return $this->hasOne(\App\Models\Offer::class)
            ->where('active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_from')->orWhere('valid_from', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
            });
    }

    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }

    public function favorites()
    {
        return $this->hasMany(\App\Models\Favorite::class);
    }

    public function images()
    {
        return $this->hasMany(\App\Models\CarImage::class)->orderBy('sort_order');
    }

    // Return full URL whether the value is a stored file path or an external URL
    public function getImageUrlAttribute($value)
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return Storage::disk('public')->url($value);
    }
}
