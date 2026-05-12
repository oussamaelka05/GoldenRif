<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'car_id'];

    protected $casts = ['created_at' => 'datetime'];

    public function car()  { return $this->belongsTo(Car::class); }
    public function user() { return $this->belongsTo(User::class); }
}
