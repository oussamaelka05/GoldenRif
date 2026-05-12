<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarsTable extends Migration
{
    public function up()
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('brand');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->enum('category', ['sedan', 'suv', 'sports', 'luxury', 'van', 'convertible'])->default('sedan');
            $table->decimal('price_per_day', 8, 2);
            $table->unsignedTinyInteger('seats')->default(5);
            $table->enum('transmission', ['automatic', 'manual'])->default('automatic');
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid'])->default('petrol');
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->boolean('available')->default(true);
            $table->timestamps();
            $table->index(['user_id', 'available']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cars');
    }
}
