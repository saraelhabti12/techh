<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Studio;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Reservation::with('slots')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'studio_ids' => 'nullable|array', // Optional list of pre-selected studios
            'slots' => 'required|array|min:1',
            'slots.*.studio_id' => 'required|integer',
            'slots.*.date' => 'required|date',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
            'service_type' => 'required|string',
            'equipment' => 'nullable|array',
            'team' => 'nullable|array',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
        ]);

        $bookingReference = 'TS-' . time() . '-' . strtoupper(Str::random(4));
        
        try {
            DB::beginTransaction();

            // Calculate base equipment price
            $equipmentTotal = 0;
            if (!empty($validated['equipment'])) {
                $equipmentItems = Equipment::whereIn('name', $validated['equipment'])->get();
                foreach ($equipmentItems as $item) {
                    $equipmentTotal += $item->price_per_unit;
                }
            }

            $totalPrice = $equipmentTotal;
            $processedSlots = [];

            // Conflict Detection & Price Calculation
            foreach ($validated['slots'] as $slotData) {
                $studioId = $slotData['studio_id'];
                $studio = Studio::findOrFail($studioId);

                // Overlap condition: (startA < endB) AND (endA > startB)
                $exists = \App\Models\ReservationSlot::whereHas('reservation', function($q) use ($studioId) {
                        $q->where('status', '!=', 'cancelled');
                    })
                    ->where('studio_id', $studioId)
                    ->where('date', $slotData['date'])
                    ->where(function ($query) use ($slotData) {
                        $query->where(function ($q) use ($slotData) {
                            $q->where('start_time', '<', $slotData['end_time'])
                              ->where('end_time', '>', $slotData['start_time']);
                        });
                    })
                    ->exists();

                if ($exists) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Studio '{$studio->name}' is already booked for the slot {$slotData['start_time']} - {$slotData['end_time']} on {$slotData['date']}."
                    ], 422);
                }

                // Calculate duration
                $start = \Carbon\Carbon::parse($slotData['start_time']);
                $end = \Carbon\Carbon::parse($slotData['end_time']);
                $durationHours = $end->diffInMinutes($start) / 60;
                
                $totalPrice += ($durationHours * $studio->price_per_hour);
                $processedSlots[] = $slotData;
            }

            $firstSlot = $processedSlots[0];

            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'booking_reference' => $bookingReference,
                'studio_id' => $firstSlot['studio_id'], // Primary studio for legacy compatibility
                'date' => $firstSlot['date'],
                'time_slot' => $firstSlot['start_time'] . ' - ' . $firstSlot['end_time'],
                'service_type' => $validated['service_type'],
                'selected_equipment' => $validated['equipment'] ?? [],
                'selected_team_members' => $validated['team'] ?? [],
                'customer_name' => $validated['name'],
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            foreach ($processedSlots as $slot) {
                $reservation->slots()->create([
                    'studio_id' => $slot['studio_id'],
                    'date' => $slot['date'],
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Reservation created successfully',
                'data' => [
                    'id' => $bookingReference,
                    'reservation' => $reservation->load('slots.studio')
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create reservation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function myReservations(Request $request)
    {
        $reservations = $request->user()->reservations()->with(['studio', 'slots'])->get()->map(function ($reservation) {
            
            // Format slots for display if necessary, but returning the raw slots is good too
            $slotsData = $reservation->slots->map(function($slot) {
                return [
                    'date' => $slot->date,
                    'start_time' => \Carbon\Carbon::parse($slot->start_time)->format('H:i'),
                    'end_time' => \Carbon\Carbon::parse($slot->end_time)->format('H:i')
                ];
            });

            return [
                "studio" => $reservation->studio->name,
                "date" => $reservation->date,
                "time_slot" => $reservation->time_slot,
                "status" => $reservation->status,
                "booking_reference" => $reservation->booking_reference,
                "slots" => $slotsData,
                "total_price" => $reservation->total_price,
            ];
        });

        return response()->json(['data' => $reservations]);
    }

    public function cancel(Request $request, $id)
    {
        $reservation = $request->user()->reservations()->where('booking_reference', $id)->first();

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found or not authorized.'], 404);
        }

        if ($reservation->status !== 'pending') {
            return response()->json(['message' => 'Only pending reservations can be cancelled.'], 400);
        }

        $reservation->status = 'cancelled';
        $reservation->save();

        return response()->json(['message' => 'Reservation cancelled successfully.', 'data' => $reservation]);
    }
}
