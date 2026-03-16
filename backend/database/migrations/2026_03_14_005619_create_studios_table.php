<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('studios', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('badge')->nullable();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->decimal('price_per_hour', 10, 2);
            $table->string('color')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->decimal('price', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('studios');
    }
};