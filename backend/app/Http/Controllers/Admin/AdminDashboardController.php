<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationSlot;
use App\Models\Studio;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalBookings = Reservation::where('status', '!=', 'cancelled')->count();
        $totalRevenue = Reservation::where('status', 'confirmed')->orWhere('status', 'completed')->sum('total_price');
        $totalUsers = User::count();
        $totalStudios = Studio::count();

        // Revenue per studio
        $revenuePerStudio = Studio::with(['reservations' => function($q) {
            $q->whereIn('status', ['confirmed', 'completed']);
        }])->get()->map(function($studio) {
            return [
                'name' => $studio->name,
                'revenue' => $studio->reservations->sum('total_price')
            ];
        });

        // Monthly revenue (last 6 months)
        $monthlyRevenue = Reservation::whereIn('status', ['confirmed', 'completed'])
            ->select(
                DB::raw('sum(total_price) as revenue'),
                DB::raw("DATE_FORMAT(created_at, '%M %Y') as month"),
                DB::raw('max(created_at) as date')
            )
            ->groupBy('month')
            ->orderBy('date', 'desc')
            ->take(6)
            ->get();

        // Upcoming bookings
        $upcoming = Reservation::with(['studio', 'user', 'slots'])
            ->where('status', 'confirmed')
            ->where('date', '>=', Carbon::today()->toDateString())
            ->orderBy('date', 'asc')
            ->take(5)
            ->get();

        return response()->json([
            'data' => [
                'total_bookings' => $totalBookings,
                'total_revenue' => $totalRevenue,
                'total_users' => $totalUsers,
                'total_studios' => $totalStudios,
                'revenue_per_studio' => $revenuePerStudio,
                'monthly_revenue' => $monthlyRevenue,
                'upcoming_bookings' => $upcoming
            ]
        ]);
    }

    public function studioCalendar(Request $request, Studio $studio)
    {
        $start = $request->query('start', Carbon::now()->startOfMonth()->toDateString());
        $end = $request->query('end', Carbon::now()->endOfMonth()->toDateString());

        $slots = ReservationSlot::where('studio_id', $studio->id)
            ->whereBetween('date', [$start, $end])
            ->whereHas('reservation', function($q) {
                $q->where('status', '!=', 'cancelled');
            })
            ->with('reservation.user')
            ->get();

        return response()->json([
            'data' => $slots->map(function($slot) {
                return [
                    'id' => $slot->id,
                    'title' => $slot->reservation->user->name . " (" . $slot->reservation->service_type . ")",
                    'start' => $slot->date . 'T' . $slot->start_time,
                    'end' => $slot->date . 'T' . $slot->end_time,
                    'status' => $slot->reservation->status,
                    'reference' => $slot->reservation->booking_reference
                ];
            })
        ]);
    }
}
