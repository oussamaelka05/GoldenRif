<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Public: reviews for a car
    public function index(int $carId)
    {
        $reviews = Review::where('car_id', $carId)
            ->with('user:id,name')
            ->latest('created_at')
            ->get();

        return response()->json([
            'reviews'    => $reviews,
            'avg_rating' => $reviews->isNotEmpty() ? round($reviews->avg('rating'), 1) : null,
            'total'      => $reviews->count(),
        ]);
    }

    // Any logged-in user can review a car (one review per user per car)
    public function store(Request $request, int $carId)
    {
        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'car_id' => $carId],
            [
                'rating'  => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]
        );

        return response()->json($review->load('user:id,name'), 201);
    }

    // Customer: delete own review
    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted']);
    }
}
