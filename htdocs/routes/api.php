<?php

use App\Http\Controllers\Admin\AdminCommentController;
use App\Http\Controllers\Admin\AdminRecipeController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\StorageController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ChangePasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', HealthController::class);

// Storage public with CORS
Route::get('/storage/{path}', [StorageController::class, 'show'])->where('path', '.*');


// Public routes
// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Recipes
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{recipe}', [RecipeController::class, 'show']);
Route::post('/recipes/{recipe}/increment-views', [RecipeController::class, 'incrementViews']);
Route::get('/recipes/{recipe}/comments', [CommentController::class, 'index']);
Route::get('/recipes/{recipe}/likes', [LikeController::class, 'count']);


// Auth routes guest only
Route::middleware('guest')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);
});

// Auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/refresh', [AuthenticatedSessionController::class, 'refresh']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/password', [ChangePasswordController::class, 'update']);
    Route::post('/upload', [ImageUploadController::class, 'store']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy']);

    // Comments auth required
    Route::post('/recipes/{recipe}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Liked recipes CRUD
    Route::get('/user/liked-recipes', [LikeController::class, 'index']);
    Route::post('/user/liked-recipes/{recipe}', [LikeController::class, 'store']);
    Route::get('/user/liked-recipes/{recipe}', [LikeController::class, 'show']);
    Route::delete('/user/liked-recipes/{recipe}', [LikeController::class, 'destroy']);

    // Likes legacy toggle
    Route::post('/recipes/{recipe}/like', [LikeController::class, 'toggle']);
    Route::get('/recipes/{recipe}/is-liked', [LikeController::class, 'isLiked']);
});


Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Users admin
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{user}', [AdminUserController::class, 'show']);
    Route::put('/users/{user}', [AdminUserController::class, 'update']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

    // Recipes admin
    Route::get('/recipes', [AdminRecipeController::class, 'index']);
    Route::delete('/recipes/{recipe}', [AdminRecipeController::class, 'destroy']);

    // Comments admin
    Route::get('/comments', [AdminCommentController::class, 'index']);
    Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy']);
});
