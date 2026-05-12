<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    // Public: list all available cars (excludes cars with an active confirmed booking today)
    public function index(Request $request)
    {
        $today = now()->toDateString();
        $start = $request->filled('start') ? $request->start : null;
        $end   = $request->filled('end')   ? $request->end   : null;

        $query = Car::with(['owner:id,name', 'activeOffer', 'images'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('available', true)
            ->whereDoesntHave('bookings', function ($q) use ($today, $start, $end) {
                $q->where('status', 'confirmed');
                if ($start && $end) {
                    // Exclude cars whose bookings overlap the requested date range
                    $q->where(function ($q2) use ($start, $end) {
                        $q2->whereBetween('start_date', [$start, $end])
                           ->orWhereBetween('end_date', [$start, $end])
                           ->orWhere(function ($q3) use ($start, $end) {
                               $q3->where('start_date', '<=', $start)
                                  ->where('end_date', '>=', $end);
                           });
                    });
                } else {
                    // No dates: just exclude cars actively rented today
                    $q->where('start_date', '<=', $today)
                      ->where('end_date', '>=', $today);
                }
            });

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('brand', 'like', '%' . $request->search . '%')
                  ->orWhere('model', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->filled('price_min')) {
            $query->where('price_per_day', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price_per_day', '<=', $request->price_max);
        }
        if ($request->filled('seats')) {
            $query->where('seats', '>=', $request->seats);
        }
        if ($request->filled('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }
        if ($request->filled('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        $sort = $request->get('sort', 'newest');
        match ($sort) {
            'price_asc'  => $query->orderBy('price_per_day', 'asc'),
            'price_desc' => $query->orderBy('price_per_day', 'desc'),
            'rating'     => $query->orderByDesc('reviews_avg_rating'),
            'popular'    => $query->orderByDesc('reviews_count'),
            default      => $query->latest(),
        };

        return response()->json($query->get());
    }

    // Public: single car — includes active-booking status so the detail page can show correct state
    public function show(Car $car)
    {
        $today = now()->toDateString();

        $activeBooking = $car->bookings()
            ->where('status', 'confirmed')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->first();

        $car->load(['owner:id,name,email', 'activeOffer', 'images']);
        $car->loadAvg('reviews', 'rating');
        $car->loadCount('reviews');

        $similar = Car::with(['activeOffer', 'images'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('category', $car->category)
            ->where('id', '!=', $car->id)
            ->where('available', true)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        $data                   = $car->toArray();
        $data['is_booked_now']  = $activeBooking !== null;
        $data['available_from'] = $activeBooking
            ? \Carbon\Carbon::parse($activeBooking->end_date)->addDay()->toDateString()
            : null;
        $data['similar_cars']   = $similar;

        return response()->json($data);
    }

    // Public: booked date ranges for a car (for availability feedback)
    public function unavailableDates(Car $car)
    {
        $ranges = $car->bookings()
            ->where('status', '!=', 'cancelled')
            ->select('start_date', 'end_date')
            ->get();

        return response()->json($ranges);
    }

    // Owner: list own cars
    public function myCars(Request $request)
    {
        return response()->json(
            $request->user()->cars()->with('images')->latest()->get()
        );
    }

    // Owner: create car (multipart/form-data)
    public function store(Request $request)
    {
        $data = $request->validate([
            'brand'         => 'required|string|max:100',
            'model'         => 'required|string|max:100',
            'year'          => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'category'      => 'required|in:sedan,suv,sports,luxury,van,convertible',
            'price_per_day' => 'required|numeric|min:1',
            'seats'         => 'required|integer|min:1|max:20',
            'transmission'  => 'required|in:automatic,manual',
            'fuel_type'     => 'required|in:petrol,diesel,electric,hybrid',
            'image'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'images'          => 'nullable|array|max:5',
            'images.*'        => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'description'     => 'nullable|string|max:1000',
            'location'        => 'nullable|string|max:255',
            'whatsapp'        => 'nullable|string|max:20',
        ]);

        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('cars', 'public');
        }
        unset($data['image']);

        $car = $request->user()->cars()->create($data);

        // Save extra images to car_images table
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('cars', 'public');
                $car->images()->create(['image_url' => $path, 'sort_order' => $i]);
            }
        }

        return response()->json($car->load('images'), 201);
    }

    // Owner: update car — called via POST /cars/{car}/update (supports file upload)
    // Also handles PUT /cars/{car} for JSON-only updates (e.g. toggle available)
    public function update(Request $request, Car $car)
    {
        if ($car->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'brand'               => 'sometimes|string|max:100',
            'model'               => 'sometimes|string|max:100',
            'year'                => 'sometimes|integer|min:1990|max:' . (date('Y') + 1),
            'category'            => 'sometimes|in:sedan,suv,sports,luxury,van,convertible',
            'price_per_day'       => 'sometimes|numeric|min:1',
            'seats'               => 'sometimes|integer|min:1|max:20',
            'transmission'        => 'sometimes|in:automatic,manual',
            'fuel_type'           => 'sometimes|in:petrol,diesel,electric,hybrid',
            'image'               => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'images'              => 'nullable|array|max:5',
            'images.*'            => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'deleted_image_ids'   => 'nullable|array',
            'deleted_image_ids.*' => 'integer',
            'description'         => 'nullable|string|max:1000',
            'location'            => 'nullable|string|max:255',
            'whatsapp'            => 'nullable|string|max:20',
            'available'           => 'sometimes|boolean',
        ]);

        // Delete individual images marked for removal
        if (!empty($data['deleted_image_ids'])) {
            $car->images()->whereIn('id', $data['deleted_image_ids'])->get()
                ->each(function ($img) {
                    $raw = $img->getRawOriginal('image_url');
                    if ($raw && !str_starts_with($raw, 'http')) {
                        Storage::disk('public')->delete($raw);
                    }
                    $img->delete();
                });
        }
        unset($data['deleted_image_ids']);

        // Replace single cover image if a new one was uploaded
        if ($request->hasFile('image')) {
            $raw = $car->getRawOriginal('image_url');
            if ($raw && !str_starts_with($raw, 'http')) {
                Storage::disk('public')->delete($raw);
            }
            $data['image_url'] = $request->file('image')->store('cars', 'public');
        }
        unset($data['image']);

        // Append any new images to car_images table
        if ($request->hasFile('images')) {
            $sortStart = ($car->images()->max('sort_order') ?? -1) + 1;
            foreach ($request->file('images') as $i => $file) {
                $path = $file->store('cars', 'public');
                $car->images()->create(['image_url' => $path, 'sort_order' => $sortStart + $i]);
            }
        }
        unset($data['images']);

        $car->update($data);

        return response()->json($car->fresh()->load('images'));
    }

    // Owner: delete car
    public function destroy(Request $request, Car $car)
    {
        if ($car->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $raw = $car->getRawOriginal('image_url');
        if ($raw && !str_starts_with($raw, 'http')) {
            Storage::disk('public')->delete($raw);
        }

        $car->delete();

        return response()->json(['message' => 'Car deleted']);
    }
}
