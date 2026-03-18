<?php

namespace App\Http\Controllers;

use App\Models\Studio;
use App\Models\Reservation;
use App\Models\ReservationSlot;
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

    /**
     * Get all booked time ranges for a specific studio and date.
     */
    private function getBookedRanges($studioId, $date)
    {
        // 1. Check new structured slots
        $slots = ReservationSlot::whereHas('reservation', function($q) {
                $q->where('status', '!=', 'cancelled');
            })
            ->where('studio_id', $studioId)
            ->where('date', $date)
            ->get();

        $bookedSlots = $slots->map(function ($slot) {
            return [
                'start_time' => \Carbon\Carbon::parse($slot->start_time)->format('H:i'),
                'end_time' => \Carbon\Carbon::parse($slot->end_time)->format('H:i'),
            ];
        })->toArray();

        // 2. Check legacy string-based slots
        $legacyReservations = Reservation::where('studio_id', $studioId)
            ->where('date', $date)
            ->where('status', '!=', 'cancelled')
            ->whereDoesntHave('slots') 
            ->get();

        foreach ($legacyReservations as $res) {
            if (str_contains($res->time_slot, ' - ')) {
                $parts = explode(' - ', $res->time_slot);
                $bookedSlots[] = [
                    'start_time' => \Carbon\Carbon::parse($parts[0])->format('H:i'),
                    'end_time' => \Carbon\Carbon::parse($parts[1])->format('H:i'),
                ];
            }
        }

        return $bookedSlots;
    }

    // Availability for a specific studio
    public function availability(Request $request, $id)
    {
        $date = $request->query('date');
        
        if (!$date) {
            return response()->json(['message' => 'Date is required'], 400);
        }

        $bookedSlots = $this->getBookedRanges($id, $date);

        return response()->json([
            'data' => [
                'studio_id' => (int)$id,
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

        // Define a "full day" as 10 hours of booking for simplicity in calendar dot logic
        // or just mark as reserved if ANY slot is booked. 
        // User wants: "Some studios appear as 'reserved' on the homepage calendar"
        // Let's decide: if total duration >= 10 hours -> reserved, else partially_reserved/available

        foreach ($allStudios as $studio) {
            $bookedSlots = $this->getBookedRanges($studio->id, $date);
            
            $totalMinutes = 0;
            foreach ($bookedSlots as $slot) {
                $start = \Carbon\Carbon::parse($slot['start_time']);
                $end = \Carbon\Carbon::parse($slot['end_time']);
                $totalMinutes += $end->diffInMinutes($start);
            }

            $status = "available";
            if ($totalMinutes >= 600) { // 10 hours
                $status = "reserved";
            } elseif ($totalMinutes > 0) {
                $status = "partially_reserved";
            }

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