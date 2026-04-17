<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Reservation Received - TechStudio</title>
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
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            background-color: #1a202c;
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .status-badge {
            display: inline-block;
            background-color: #ecc94b;
            color: #744210;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            text-transform: uppercase;
        }
        .content {
            padding: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 800;
            color: #2d3748;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            font-size: 15px;
        }
        .detail-label {
            width: 160px;
            font-weight: 600;
            color: #718096;
        }
        .detail-value {
            flex: 1;
            color: #2d3748;
        }
        .highlight {
            color: #e53e3e;
            font-weight: bold;
        }
        .slot-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
        }
        .price-box {
            margin-top: 40px;
            padding: 25px;
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            border-radius: 10px;
            color: #ffffff;
            text-align: center;
        }
        .price-label {
            font-size: 14px;
            opacity: 0.8;
            display: block;
            margin-bottom: 5px;
        }
        .price-value {
            font-size: 32px;
            font-weight: 800;
            color: #48bb78;
        }
        .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #a0aec0;
            border-top: 1px solid #edf2f7;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>TechStudio</h1>
            <div class="status-badge">Status: Pending Approval</div>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; margin-top: 0;">Hello Admin,</p>
            <p>A new reservation has been received. Here are the details:</p>

            <div class="section-title">Customer Information</div>
            <div class="detail-row">
                <div class="detail-label">Name:</div>
                <div class="detail-value">{{ $reservations->first()->customer_name }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">{{ $reservations->first()->customer_email }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">{{ $reservations->first()->customer_phone ?? 'N/A' }}</div>
            </div>

            <div class="section-title">Booking Overview</div>
            <div class="detail-row">
                <div class="detail-label">Reference:</div>
                <div class="detail-value"><strong class="highlight">{{ $reservations->first()->booking_reference }}</strong></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Category:</div>
                <div class="detail-value">{{ $extraData['category_name'] ?? 'General' }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Studio:</div>
                <div class="detail-value">{{ $reservations->first()->studio->name }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Booking Type:</div>
                <div class="detail-value">{{ ($extraData['category_name'] ?? '') === 'Booking' ? 'Standard Booking (Flow A)' : 'Service Package (Flow B)' }}</div>
            </div>

            @if(!empty($extraData['project_name']))
                <div class="detail-row">
                    <div class="detail-label">Project Name:</div>
                    <div class="detail-value">{{ $extraData['project_name'] }}</div>
                </div>
            @endif

            @if(!empty($extraData['project_description']))
                <div class="detail-row">
                    <div class="detail-label">Description:</div>
                    <div class="detail-value">{{ $extraData['project_description'] }}</div>
                </div>
            @endif

            @if(($extraData['category_name'] ?? '') !== 'Booking')
                <div class="section-title">Options & Extras</div>
                <div class="detail-row">
                    <div class="detail-label">Package:</div>
                    <div class="detail-value"><strong>{{ ucfirst($extraData['package_type'] ?? 'Standard') }}</strong></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">{{ ucfirst($extraData['location_type'] ?? 'In Studio') }}</div>
                </div>

                @if(!empty($extraData['theme_description']))
                    <div class="detail-row">
                        <div class="detail-label">Theme Description:</div>
                        <div class="detail-value">{{ $extraData['theme_description'] }}</div>
                    </div>
                @endif

                @if(!empty($extraData['selected_offers']))
                    <div class="detail-row">
                        <div class="detail-label">Selected Offers:</div>
                        <div class="detail-value">
                            <ul style="margin: 0; padding-left: 20px;">
                                @foreach($extraData['selected_offers'] as $offer)
                                    <li>{{ $offer['label'] }} ({{ $offer['price'] }} DH)</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                @endif
            @else
                <div class="section-title">Selected Services</div>
                @if(!empty($reservations->first()->selected_equipment))
                    <div class="detail-row">
                        <div class="detail-label">Equipment:</div>
                        <div class="detail-value">{{ implode(', ', $reservations->first()->selected_equipment) }}</div>
                    </div>
                @endif
                @if(!empty($reservations->first()->selected_team_members))
                    <div class="detail-row">
                        <div class="detail-label">Team Members:</div>
                        <div class="detail-value">{{ implode(', ', $reservations->first()->selected_team_members) }}</div>
                    </div>
                @endif
            @endif

            <div class="section-title">Schedule</div>
            <div class="detail-row">
                <div class="detail-label">Billing Mode:</div>
                <div class="detail-value">Per {{ ucfirst($extraData['booking_mode'] ?? 'hour') }}</div>
            </div>
            
            @foreach($reservations as $reservation)
                <div class="slot-card">
                    <div style="font-weight: bold; color: #2d3748; margin-bottom: 5px;">
                        {{ \Carbon\Carbon::parse($reservation->date)->format('l, F d, Y') }}
                    </div>
                    <div style="color: #718096; font-size: 14px;">
                        Time Slot: {{ $reservation->time_slot }}
                    </div>
                </div>
            @endforeach

            <div class="price-box">
                <span class="price-label">TOTAL RESERVATION PRICE</span>
                <span class="price-value">{{ number_format($reservations->sum('total_price'), 2) }} DH</span>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #718096; font-style: italic;">
                * This reservation was created on {{ date('M d, Y \a\t H:i') }}. Please review it in the admin dashboard.
            </p>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} <strong>TechStudio</strong>. All rights reserved.<br>
            <div style="margin-top: 10px; font-size: 11px;">
                You are receiving this because you are an administrator of TechStudio.
            </div>
        </div>
    </div>
</body>
</html>
