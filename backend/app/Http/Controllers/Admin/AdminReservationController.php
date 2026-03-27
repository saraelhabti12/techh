<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['studio', 'user', 'slots.studio']);

        if ($request->has('date') && !empty($request->query('date'))) {
            $query->where('date', $request->query('date'));
        }

        if ($request->has('studio_id') && !empty($request->query('studio_id'))) {
            $query->where('studio_id', $request->query('studio_id'));
        }

        if ($request->has('user_id') && !empty($request->query('user_id'))) {
            $query->where('user_id', $request->query('user_id'));
        }

        if ($request->has('status') && !empty($request->query('status'))) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('search') && !empty($request->query('search'))) {
            $search = $request->query('search');
            $query->where(function($q) use ($search) {
                $q->where('booking_reference', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function updateStatus(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $oldStatus = $reservation->status;
        $reservation->update(['status' => $validated['status']]);

        // Notify user if status changed
        if ($oldStatus !== $validated['status'] && $reservation->user_id) {
            $message = "Your reservation (Ref: {$reservation->booking_reference}) has been " . $validated['status'] . ".";
            \App\Models\Notification::create([
                'user_id' => $reservation->user_id,
                'type' => 'reservation_status',
                'message' => $message,
            ]);
        }

        return response()->json(['message' => "Reservation status updated to {$validated['status']}.", 'data' => $reservation->load(['studio', 'user', 'slots.studio'])]);
    }

    public function show($id)
    {
        $reservation = Reservation::with(['studio', 'user', 'slots.studio'])->findOrFail($id);
        
        // Calculate total hours
        $totalMinutes = 0;
        foreach ($reservation->slots as $slot) {
            $start = Carbon::parse($slot->start_time);
            $end = Carbon::parse($slot->end_time);
            $totalMinutes += $end->diffInMinutes($start);
        }
        $totalHours = $totalMinutes / 60;

        return response()->json([
            'data' => [
                'id' => $reservation->id,
                'booking_reference' => $reservation->booking_reference,
                'studio' => [
                    'id' => $reservation->studio->id,
                    'name' => $reservation->studio->name,
                ],
                'user' => [
                    'name' => $reservation->user ? $reservation->user->name : $reservation->customer_name,
                    'phone' => $reservation->user ? ($reservation->user->phone ?? $reservation->customer_phone) : $reservation->customer_phone,
                    'email' => $reservation->user ? $reservation->user->email : $reservation->customer_email,
                ],
                'date' => $reservation->date,
                'slots' => $reservation->slots->map(function($slot) {
                    $start = Carbon::parse($slot->start_time);
                    $session = 'Evening';
                    if ($start->hour < 12) $session = 'Morning';
                    elseif ($start->hour < 18) $session = 'Afternoon';

                    return [
                        'date' => $slot->date,
                        'time' => Carbon::parse($slot->start_time)->format('H:i') . ' - ' . Carbon::parse($slot->end_time)->format('H:i'),
                        'session' => $session
                    ];
                }),
                'total_hours' => $totalHours,
                'total_price' => $reservation->total_price,
                'status' => $reservation->status,
                'service_type' => $reservation->service_type,
                'equipment' => $reservation->selected_equipment,
                'team' => $reservation->selected_team_members,
                'created_at' => $reservation->created_at->toDateTimeString(),
            ]
        ]);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['message' => 'Reservation deleted successfully.']);
    }
}
