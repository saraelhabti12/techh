<!DOCTYPE html>
<html>
<head>
    <title>New Reservation - TechStudio</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9fafb; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 20px; }
        .header h2 { color: #ec4899; margin: 0; font-size: 24px; }
        h3 { color: #111827; font-size: 16px; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f3f4f6; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 12px 0; text-align: left; }
        th { color: #6b7280; font-weight: 600; width: 40%; font-size: 14px; }
        td { color: #111827; font-weight: 500; font-size: 14px; }
        .slot { background: #fdf2f8; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #fce7f3; }
        .slot strong { color: #db2777; display: inline-block; width: 60px; }
        .total-box { margin-top: 30px; padding-top: 15px; border-top: 2px dashed #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .total-label { font-size: 18px; font-weight: 700; color: #374151; }
        .total-amount { font-size: 24px; font-weight: 800; color: #ec4899; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Booking Received</h2>
            <p style="margin: 5px 0 0; color: #6b7280;">A customer has placed a new reservation.</p>
        </div>
        
        @php
            $firstReservation = is_array($reservations) || $reservations instanceof \Illuminate\Support\Collection ? (isset($reservations[0]) ? $reservations[0] : $reservations->first()) : $reservations;
            $allReservations = is_array($reservations) || $reservations instanceof \Illuminate\Support\Collection ? $reservations : [$reservations];
        @endphp

        <h3>Customer Details</h3>
        <table>
            <tr>
                <th>Full Name</th>
                <td>{{ $firstReservation->customer_name ?? $firstReservation->user->name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Email Address</th>
                <td>{{ $firstReservation->customer_email ?? $firstReservation->user->email ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Phone Number</th>
                <td>{{ $firstReservation->customer_phone ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Booking Reference</th>
                <td>{{ $firstReservation->booking_reference ?? 'N/A' }}</td>
            </tr>
        </table>

        <h3>Reservation Details</h3>
        @foreach($allReservations as $res)
        <div class="slot">
            <div style="margin-bottom: 5px;"><strong>Studio:</strong> {{ $res->studio->name ?? 'Unknown Studio' }}</div>
            <div style="margin-bottom: 5px;"><strong>Date:</strong> {{ $res->date }}</div>
            <div><strong>Time:</strong> {{ $res->time_slot ?? 'N/A' }}</div>
        </div>
        @endforeach

        <div class="total-box">
            <span class="total-label">Total Price</span>
            <span class="total-amount">{{ $firstReservation->total_price ?? 0 }} MAD</span>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} TechStudio. All rights reserved.
        </div>
    </div>
</body>
</html>
