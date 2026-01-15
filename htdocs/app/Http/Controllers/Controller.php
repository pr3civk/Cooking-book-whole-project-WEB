<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Cooking Book API",
    description: "REST API for Cooking Book application - manage recipes, comments, likes and categories",
    contact: new OA\Contact(email: "admin@cookingbook.com")
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local Development Server"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "apiKey",
    in: "header",
    name: "Authorization",
    description: "Enter token in format: Bearer {token}"
)]
#[OA\Tag(name: "Health", description: "Health check endpoints")]
#[OA\Tag(name: "Auth", description: "Authentication endpoints")]
#[OA\Tag(name: "Recipes", description: "Recipe management endpoints")]
#[OA\Tag(name: "Comments", description: "Comment management endpoints")]
#[OA\Tag(name: "Likes", description: "Like management endpoints")]
#[OA\Tag(name: "Categories", description: "Category management endpoints")]
#[OA\Tag(name: "Admin", description: "Admin panel endpoints")]
abstract class Controller
{
    //
}
