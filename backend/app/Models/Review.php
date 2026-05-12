<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['car_id', 'user_id', 'booking_id', 'rating', 'comment'];

    protected $casts = [
        'rating'     => 'integer',
        'created_at' => 'datetime',
    ];

    public function car()    { return $this->belongsTo(Car::class); }
    public function user()   { return $this->belongsTo(User::class); }
    public function booking(){ return $this->belongsTo(Booking::class); }
}
