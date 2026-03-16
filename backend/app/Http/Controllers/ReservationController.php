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
        return response()->json(['data' => Reservation::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'studio_ids' => 'required|array',
            'dates' => 'required|array',
            'time_slots' => 'required|array',
            'service_type' => 'required|string',
            'equipment' => 'nullable|array',
            'team' => 'nullable|array',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
        ]);

        // Filter time slots to remove broad labels like 'morning', keeping specific slots 'HH:MM - HH:MM'
        $specificSlots = array_filter($validated['time_slots'], function($slot) {
            return str_contains($slot, '-');
        });

        if (empty($specificSlots)) {
             return response()->json([
                'message' => 'Please select specific time slots.'
            ], 422);
        }

        $bookingReference = 'TS-' . time() . '-' . strtoupper(Str::random(4));
        $createdReservations = [];

        try {
            DB::beginTransaction();

            // 1. Calculate base equipment price for this booking
            $equipmentTotal = 0;
            if (!empty($validated['equipment'])) {
                // Assuming $validated['equipment'] is an array of names from the frontend
                $equipmentItems = Equipment::whereIn('name', $validated['equipment'])->get();
                foreach ($equipmentItems as $item) {
                    $equipmentTotal += $item->price_per_unit;
                }
            }

            foreach ($validated['studio_ids'] as $studioId) {
                $studio = Studio::findOrFail($studioId);
                
                foreach ($validated['dates'] as $date) {
                    foreach ($specificSlots as $slot) {
                        
                        // Check availability
                        $exists = Reservation::where('studio_id', $studioId)
                            ->where('date', $date)
                            ->where('time_slot', $slot)
                            ->exists();
                            
                        if ($exists) {
                            DB::rollBack();
                            return response()->json([
                                'message' => "The time slot {$slot} on {$date} for studio '{$studio->name}' is already booked."
                            ], 422);
                        }
                        
                        // Calculate price per specific slot
                        // 1 hour per slot * studio hourly rate + equipment base cost
                        // In reality, equipment cost might be prorated, but let's assume flat rate per slot for simplicity
                        $slotPrice = $studio->price_per_hour + $equipmentTotal;

                        $res = Reservation::create([
                            'user_id' => Auth::id(), // Attach authenticated user's ID
                            'booking_reference' => $bookingReference,
                            'studio_id' => $studioId,
                            'date' => $date,
                            'time_slot' => $slot,
                            'service_type' => $validated['service_type'],
                            'selected_equipment' => $validated['equipment'] ?? [],
                            'selected_team_members' => $validated['team'] ?? [],
                            'customer_name' => $validated['name'],
                            'customer_email' => $validated['email'],
                            'customer_phone' => $validated['phone'],
                            'total_price' => $slotPrice,
                            'status' => 'pending', // Set initial status
                        ]);
                        
                        $createdReservations[] = $res;
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Reservation created successfully',
                'data' => [
                    'id' => $bookingReference,
                    'reservations' => $createdReservations
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
        $reservations = $request->user()->reservations()->with('studio')->get()->map(function ($reservation) {
            return [
                "studio" => $reservation->studio->name,
                "date" => $reservation->date,
                "time_slot" => $reservation->time_slot,
                "status" => $reservation->status,
                "booking_reference" => $reservation->booking_reference,
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