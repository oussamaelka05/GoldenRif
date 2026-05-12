<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Drop FK and unique together so MySQL allows it
            $table->dropForeign(['booking_id']);
            $table->dropUnique(['booking_id']);
        });
        // Make nullable via raw SQL
        \DB::statement('ALTER TABLE reviews MODIFY booking_id BIGINT UNSIGNED NULL');
        Schema::table('reviews', function (Blueprint $table) {
            // Re-add FK as nullable
            $table->foreign('booking_id')->references('id')->on('bookings')->cascadeOnDelete();
            // One review per user per car
            $table->unique(['user_id', 'car_id']);
        });
    }

    public function down()
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
            $table->dropUnique(['user_id', 'car_id']);
        });
        \DB::statement('ALTER TABLE reviews MODIFY booking_id BIGINT UNSIGNED NOT NULL');
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreign('booking_id')->references('id')->on('bookings')->cascadeOnDelete();
            $table->unique(['booking_id']);
        });
    }
};
