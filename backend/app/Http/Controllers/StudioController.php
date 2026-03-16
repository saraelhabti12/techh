<?php

namespace App\Http\Controllers;

use App\Models\Studio;
use App\Models\Reservation;
use Illuminate\Http\Request;

class StudioController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Studio::all()]);
    }

    public function show($id)
    {
        $studio = Studio::findOrFail($id);
        return response()->json(['data' => $studio]);
    }

    // Availability for a specific studio
    public function availability(Request $request, $id)
    {
        $date = $request->query('date');
        
        if (!$date) {
            return response()->json(['message' => 'Date is required'], 400);
        }

        $reservations = Reservation::where('studio_id', $id)
            ->where('date', $date)
            ->get();

        $bookedSlots = $reservations->pluck('time_slot')->toArray();

        return response()->json([
            'data' => [
                'studio_id' => $id,
                'date' => $date,
                'booked_slots' => $bookedSlots
            ]
        ]);
    }

    // Availability for all studios by date
    public function availabilityByDate(Request $request)
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json(['message' => 'Date is required'], 400);
        }

        $allStudios = Studio::all();
        $availabilityData = [];

        foreach ($allStudios as $studio) {
            $reservations = Reservation::where('studio_id', $studio->id)
                ->where('date', $date)
                ->get();

            $bookedSlots = $reservations->pluck('time_slot')->toArray();
            
            $status = count($bookedSlots) > 0 ? "reserved" : "available";

            $availabilityData[] = [
                'studio_id' => $studio->id,
                'date' => $date,
                'status' => $status,
                'price' => $studio->price_per_hour,
                'booked_slots' => $bookedSlots,
            ];
        }

        return response()->json(['data' => $availabilityData]);
    }
}