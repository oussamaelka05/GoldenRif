<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // List user's saved cars
    public function index(Request $request)
    {
        $cars = $request->user()
            ->favorites()
            ->with(['car.activeOffer', 'car.owner:id,name'])
            ->get()
            ->pluck('car')
            ->filter();

        return response()->json($cars->values());
    }

    // Toggle favorite for a car
    public function toggle(Request $request, Car $car)
    {
        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('car_id', $car->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['saved' => false]);
        }

        Favorite::create(['user_id' => $request->user()->id, 'car_id' => $car->id]);

        return response()->json(['saved' => true]);
    }

    // Return IDs of all favorited cars for the current user
    public function ids(Request $request)
    {
        $ids = $request->user()->favorites()->pluck('car_id');
        return response()->json($ids);
    }
}
