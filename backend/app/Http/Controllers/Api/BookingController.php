<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\Booking;
use App\Models\Car;
use App\Models\Offer;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Customer: create a booking
    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id'     => 'required|exists:cars,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after:start_date',
            'offer_id'   => 'nullable|exists:offers,id',
        ]);

        $car = Car::findOrFail($data['car_id']);

        if (!$car->available) {
            return response()->json(['message' => 'This car is not available for rental.'], 422);
        }

        // Block owner from booking their own car
        if ($car->user_id === $request->user()->id) {
            return response()->json(['message' => 'You cannot book your own car.'], 422);
        }

        // Check for date overlap with existing non-cancelled bookings
        $overlap = Booking::where('car_id', $car->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($data) {
                $q->whereBetween('start_date', [$data['start_date'], $data['end_date']])
                  ->orWhereBetween('end_date', [$data['start_date'], $data['end_date']])
                  ->orWhere(function ($q2) use ($data) {
                      $q2->where('start_date', '<=', $data['start_date'])
                         ->where('end_date', '>=', $data['end_date']);
                  });
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'Car is already booked for these dates.'], 422);
        }

        $days      = Carbon::parse($data['start_date'])->diffInDays(Carbon::parse($data['end_date']));
        $priceDay  = $car->price_per_day;
        $today     = now()->toDateString();

        if (!empty($data['offer_id'])) {
            $offer = Offer::find($data['offer_id']);
            if (
                $offer &&
                $offer->car_id === $car->id &&
                $offer->active &&
                (!$offer->valid_from  || $offer->valid_from->toDateString()  <= $today) &&
                (!$offer->valid_until || $offer->valid_until->toDateString() >= $today)
            ) {
                if ($offer->discount_type === 'percentage') {
                    $priceDay = $priceDay * (1 - $offer->discount_value / 100);
                } else {
                    $priceDay = max(0, $priceDay - $offer->discount_value);
                }
            }
        }
        unset($data['offer_id']);

        $data['user_id']     = $request->user()->id;
        $data['total_price'] = round($priceDay * $days, 2);
        $data['status']      = 'pending';

        if ($days < 1) {
            return response()->json(['message' => 'Booking must be at least 1 day.'], 422);
        }

        $booking = Booking::create($data);

        // Notify the car owner
        AppNotification::create([
            'user_id' => $car->user_id,
            'title'   => 'New Booking Request',
            'body'    => "{$request->user()->name} requested to book your {$car->brand} {$car->model}.",
            'data'    => [
                'type'       => 'new_booking',
                'booking_id' => $booking->id,
                'car_id'     => $car->id,
                'car_brand'  => $car->brand,
                'car_model'  => $car->model,
                'renter_name'=> $request->user()->name,
            ],
        ]);

        return response()->json(
            $booking->load(['car:id,brand,model,image_url', 'user:id,name']),
            201
        );
    }

    // Customer: their own bookings
    public function myBookings(Request $request)
    {
        return response()->json(
            $request->user()
                ->bookings()
                ->with(['car:id,user_id,brand,model,image_url,price_per_day,location,whatsapp', 'car.owner:id,name'])
                ->latest()
                ->get()
        );
    }

    // Owner: bookings for their cars
    public function ownerBookings(Request $request)
    {
        $carIds = $request->user()->cars()->pluck('id');

        return response()->json(
            Booking::whereIn('car_id', $carIds)
                ->with(['car:id,brand,model', 'user:id,name,email,whatsapp'])
                ->latest()
                ->get()
        );
    }

    // Owner: update booking status (confirm / cancel)
    public function updateStatus(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'status' => 'required|in:confirmed,cancelled',
        ]);

        if ($booking->car->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $booking->update($data);

        // Notify the renter
        $statusLabel = $data['status'] === 'confirmed' ? 'confirmed ✓' : 'declined';
        $notifType   = $data['status'] === 'confirmed' ? 'booking_confirmed' : 'booking_declined';
        AppNotification::create([
            'user_id' => $booking->user_id,
            'title'   => 'Booking ' . ucfirst($data['status']),
            'body'    => "Your booking for {$booking->car->brand} {$booking->car->model} has been {$statusLabel}.",
            'data'    => [
                'type'      => $notifType,
                'booking_id'=> $booking->id,
                'car_id'    => $booking->car_id,
                'car_brand' => $booking->car->brand,
                'car_model' => $booking->car->model,
            ],
        ]);

        return response()->json(
            $booking->load(['car:id,brand,model', 'user:id,name,email,whatsapp'])
        );
    }

    // Owner: earnings summary
    public function earnings(Request $request)
    {
        $carIds = $request->user()->cars()->pluck('id');

        $base = Booking::whereIn('car_id', $carIds)->where('status', 'confirmed');

        return response()->json([
            'total'      => round((clone $base)->sum('total_price'), 2),
            'this_month' => round(
                (clone $base)
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('total_price'),
                2
            ),
            'count'    => (clone $base)->count(),
            'bookings' => (clone $base)
                ->with(['car:id,brand,model', 'user:id,name'])
                ->latest()
                ->get(),
        ]);
    }

    // Customer: cancel their own pending booking
    public function cancelBooking(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be cancelled.'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(
            $booking->load(['car:id,user_id,brand,model,image_url,price_per_day,location,whatsapp', 'car.owner:id,name'])
        );
    }

    // Customer: dashboard stats
    public function customerStats(Request $request)
    {
        $bookings = $request->user()->bookings()->with('car:id,location')->get();
        $today    = now()->toDateString();

        return response()->json([
            'total'    => $bookings->count(),
            'upcoming' => $bookings->where('status', 'confirmed')
                                   ->where('end_date', '>=', $today)
                                   ->count(),
            'pending'  => $bookings->where('status', 'pending')->count(),
            'cities'   => $bookings->pluck('car.location')->filter()->unique()->count(),
        ]);
    }

    // Owner: dashboard stats (single request for all counters)
    public function stats(Request $request)
    {
        $carIds = $request->user()->cars()->pluck('id');

        return response()->json([
            'cars'            => $request->user()->cars()->count(),
            'active_bookings' => Booking::whereIn('car_id', $carIds)
                ->whereIn('status', ['pending', 'confirmed'])
                ->count(),
            'total_earnings'  => round(
                Booking::whereIn('car_id', $carIds)
                    ->where('status', 'confirmed')
                    ->sum('total_price'),
                2
            ),
        ]);
    }
}
