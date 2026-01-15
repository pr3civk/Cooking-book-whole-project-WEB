<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecipeResource;
use App\Models\Like;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class LikeController extends Controller
{
    #[OA\Get(
        path: "/api/user/liked-recipes",
        tags: ["Likes"],
        summary: "Get user's liked recipes",
        description: "Returns paginated list of recipes liked by authenticated user",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "page", in: "query", schema: new OA\Schema(type: "integer", default: 1)),
            new OA\Parameter(name: "per_page", in: "query", schema: new OA\Schema(type: "integer", default: 15))
        ],
        responses: [
            new OA\Response(response: 200, description: "List of liked recipes"),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min($request->integer('per_page', 15), 50);

        $recipes = $request->user()
            ->likedRecipes()
            ->with(['user', 'category'])
            ->withCount(['likes', 'comments'])
            ->latest('likes.created_at')
            ->paginate($perPage);

        return RecipeResource::collection($recipes);
    }

    #[OA\Post(
        path: "/api/user/liked-recipes/{recipeId}",
        tags: ["Liked Recipes"],
        summary: "Add recipe to liked",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 201, description: "Recipe liked"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 404, description: "Recipe not found"),
            new OA\Response(response: 409, description: "Already liked"),
        ]
    )]
    public function store(Request $request, Recipe $recipe): JsonResponse
    {
        $user = $request->user();

        if ($recipe->isLikedBy($user)) {
            return response()->json([
                'message' => 'Already liked',
            ], 409);
        }

        Like::create([
            'user_id' => $user->id,
            'recipe_id' => $recipe->id,
        ]);

        return response()->json([
            'message' => 'Recipe liked',
            'is_liked' => true,
            'likes_count' => $recipe->likes()->count(),
        ], 201);
    }

    #[OA\Get(
        path: "/api/user/liked-recipes/{recipeId}",
        tags: ["Liked Recipes"],
        summary: "Check if recipe is in user's liked",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Like status"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function show(Request $request, Recipe $recipe): JsonResponse
    {
        return response()->json([
            'is_liked' => $recipe->isLikedBy($request->user()),
            'recipe_id' => $recipe->id,
        ]);
    }

    #[OA\Delete(
        path: "/api/user/liked-recipes/{recipeId}",
        tags: ["Liked Recipes"],
        summary: "Remove recipe from liked",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Like removed"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 404, description: "Recipe not found or not liked"),
        ]
    )]
    public function destroy(Request $request, Recipe $recipe): JsonResponse
    {
        $deleted = Like::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipe->id)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'message' => 'Recipe not in liked list',
            ], 404);
        }

        return response()->json([
            'message' => 'Like removed',
            'is_liked' => false,
            'likes_count' => $recipe->likes()->count(),
        ]);
    }

    #[OA\Post(
        path: "/api/recipes/{recipeId}/like",
        tags: ["Likes"],
        summary: "Toggle like on a recipe",
        description: "If user has liked the recipe, removes the like. Otherwise, adds a like.",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Like toggled"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function toggle(Request $request, Recipe $recipe): JsonResponse
    {
        $user = $request->user();
        $existingLike = Like::where('user_id', $user->id)
            ->where('recipe_id', $recipe->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            return response()->json([
                'message' => 'Like removed',
                'is_liked' => false,
                'likes_count' => $recipe->likes()->count(),
            ]);
        }

        Like::create([
            'user_id' => $user->id,
            'recipe_id' => $recipe->id,
        ]);

        return response()->json([
            'message' => 'Recipe liked',
            'is_liked' => true,
            'likes_count' => $recipe->likes()->count(),
        ]);
    }

    #[OA\Get(
        path: "/api/recipes/{recipeId}/likes",
        tags: ["Likes"],
        summary: "Get likes count for a recipe",
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Likes count"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function count(Recipe $recipe): JsonResponse
    {
        return response()->json([
            'likes_count' => $recipe->likes()->count(),
        ]);
    }

    #[OA\Get(
        path: "/api/recipes/{recipeId}/is-liked",
        tags: ["Likes"],
        summary: "Check if current user liked the recipe",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Like status"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function isLiked(Request $request, Recipe $recipe): JsonResponse
    {
        $isLiked = $recipe->isLikedBy($request->user());

        return response()->json([
            'is_liked' => $isLiked,
        ]);
    }
}
