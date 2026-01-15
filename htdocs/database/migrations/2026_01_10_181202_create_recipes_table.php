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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->json('ingredients');
            $table->text('instructions');
            $table->string('image_path')->nullable();
            $table->unsignedInteger('cooking_time')->comment('in minutes');
            $table->unsignedInteger('servings');
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('category_id');
            $table->index('difficulty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
