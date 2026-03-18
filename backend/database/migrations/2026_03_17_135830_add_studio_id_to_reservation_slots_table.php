<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservation_slots', function (Blueprint $table) {
            $table->foreignId('studio_id')->nullable()->after('reservation_id')->constrained('studios')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservation_slots', function (Blueprint $table) {
            $table->dropConstrainedForeignId('studio_id');
        });
    }
};
