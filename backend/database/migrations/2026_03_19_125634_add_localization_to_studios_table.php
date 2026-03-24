<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('studios', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('name_fr')->nullable()->after('name_en');
            $table->string('tagline_en')->nullable()->after('tagline');
            $table->string('tagline_fr')->nullable()->after('tagline_en');
            $table->text('description_en')->nullable()->after('description');
            $table->text('description_fr')->nullable()->after('description_en');
            $table->json('features_en')->nullable()->after('features');
            $table->json('features_fr')->nullable()->after('features_en');
            $table->string('badge_en')->nullable()->after('badge');
            $table->string('badge_fr')->nullable()->after('badge_en');
        });

        // Copy existing data to _en fields as a migration step
        // \DB::table('studios')->update([
        //     'name_en' => \DB::raw('name'),
        //     'tagline_en' => \DB::raw('tagline'),
        //     'description_en' => \DB::raw('description'),
        //     'features_en' => \DB::raw('features'),
        //     'badge_en' => \DB::raw('badge'),
        // ]);
    }

    public function down(): void
    {
        Schema::table('studios', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'name_fr', 'tagline_en', 'tagline_fr', 'description_en', 'description_fr', 'features_en', 'features_fr', 'badge_en', 'badge_fr']);
        });
    }
};
