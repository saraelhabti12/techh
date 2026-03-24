<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Reservation - TechStudio</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #1a202c;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .content {
            padding: 30px;
        }
        .content h2 {
            font-size: 20px;
            color: #2d3748;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .detail-row {
            display: flex;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        .detail-label {
            width: 150px;
            font-weight: bold;
            color: #718096;
        }
        .detail-value {
            flex: 1;
            color: #2d3748;
        }
        .price-box {
            margin-top: 30px;
            padding: 20px;
            background-color: #f7fafc;
            border-radius: 6px;
            text-align: right;
        }
        .price-label {
            font-size: 16px;
            color: #718096;
        }
        .price-value {
            font-size: 24px;
            font-weight: bold;
            color: #38a169;
            display: block;
        }
        .footer {
            background-color: #edf2f7;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #a0aec0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>TechStudio</h1>
        </div>
        <div class="content">
            <h2>New Reservation Details</h2>
            
            <div class="detail-row">
                <div class="detail-label">Booking Reference:</div>
                <div class="detail-value"><strong>{{ $reservations->first()->booking_reference }}</strong></div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Customer Name:</div>
                <div class="detail-value">{{ $reservations->first()->customer_name }}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label">Customer Email:</div>
                <div class="detail-value">{{ $reservations->first()->customer_email }}</div>
            </div>
            
            <div class="detail-row">
                <div class="detail-label">Customer Phone:</div>
                <div class="detail-value">{{ $reservations->first()->customer_phone ?? 'N/A' }}</div>
            </div>

            <h3 style="margin-top: 30px; color: #2d3748; border-bottom: 1px solid #edf2f7; padding-bottom: 5px;">Reserved Slots</h3>
            
            @foreach($reservations as $reservation)
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #edf2f7; border-radius: 5px;">
                    <div class="detail-row">
                        <div class="detail-label">Studio:</div>
                        <div class="detail-value">{{ $reservation->studio->name }}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div class="detail-value">{{ \Carbon\Carbon::parse($reservation->date)->format('F d, Y') }}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div class="detail-value">{{ $reservation->time_slot }}</div>
                    </div>
                </div>
            @endforeach

            <div class="price-box">
                <span class="price-label">Total Amount Paid</span>
                <span class="price-value">{{ number_format($reservations->sum('total_price'), 2) }} MAD</span>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} TechStudio. All rights reserved.<br>
            This is an automated notification.
        </div>
    </div>
</body>
</html>
