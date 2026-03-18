<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservationSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'studio_id',
        'date',
        'start_time',
        'end_time',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function studio()
    {
        return $this->belongsTo(Studio::class);
    }
}
