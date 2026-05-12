<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Car;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    // Public: all currently active offers
    public function index()
    {
        $today = now()->toDateString();

        return response()->json(
            Offer::where('active', true)
                ->where(function ($q) use ($today) {
                    $q->whereNull('valid_from')->orWhere('valid_from', '<=', $today);
                })
                ->where(function ($q) use ($today) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
                })
                ->with('car:id,brand,model,image_url,price_per_day,category,location')
                ->latest()
                ->get()
        );
    }

    // Owner: their own offers
    public function myOffers(Request $request)
    {
        return response()->json(
            $request->user()->offers()->with('car:id,brand,model,image_url')->latest()->get()
        );
    }

    // Owner: create offer (car must belong to them)
    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id'         => 'required|exists:cars,id',
            'title'          => 'required|string|max:150',
            'description'    => 'nullable|string|max:500',
            'discount_type'  => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:1|max:99',
            'valid_from'     => 'nullable|date',
            'valid_until'    => 'nullable|date|after_or_equal:valid_from',
        ]);

        $car = Car::findOrFail($data['car_id']);

        if ($car->user_id !== $request->user()->id) {
            return response()->json(['message' => 'This car does not belong to you.'], 403);
        }

        $data['user_id'] = $request->user()->id;

        return response()->json(Offer::create($data), 201);
    }

    // Owner: toggle active / update
    public function update(Request $request, Offer $offer)
    {
        if ($offer->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'title'          => 'sometimes|string|max:150',
            'description'    => 'nullable|string|max:500',
            'discount_type'  => 'sometimes|in:percentage,fixed',
            'discount_value' => 'sometimes|numeric|min:1|max:99',
            'valid_from'     => 'nullable|date',
            'valid_until'    => 'nullable|date',
            'active'         => 'sometimes|boolean',
        ]);

        $offer->update($data);

        return response()->json($offer->load('car:id,brand,model,image_url'));
    }

    // Owner: delete offer
    public function destroy(Request $request, Offer $offer)
    {
        if ($offer->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $offer->delete();

        return response()->json(['message' => 'Offer deleted']);
    }
}
