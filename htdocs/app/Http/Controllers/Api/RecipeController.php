<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Http\Utils\AddsMetadataToResponse;
use App\Models\Recipe;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class RecipeController extends Controller
{
    use AddsMetadataToResponse;
    #[OA\Get(
        path: "/api/recipes",
        tags: ["Recipes"],
        summary: "Get list of recipes",
        description: "Returns paginated list of recipes with optional search, filter, and sort",
        parameters: [
            new OA\Parameter(name: "search", in: "query", description: "Search in title and description", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "category_id", in: "query", description: "Filter by category ID", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "difficulty", in: "query", description: "Filter by difficulty", schema: new OA\Schema(type: "string", enum: ["easy", "medium", "hard"])),
            new OA\Parameter(name: "sort_by", in: "query", description: "Sort field", schema: new OA\Schema(type: "string", enum: ["views_count", "created_at", "title", "likes_count", "comments_count"])),
            new OA\Parameter(name: "sort_order", in: "query", description: "Sort order", schema: new OA\Schema(type: "string", enum: ["asc", "desc"])),
            new OA\Parameter(name: "per_page", in: "query", description: "Items per page", schema: new OA\Schema(type: "integer", default: 15)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of recipes",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(type: "object", description: "Recipe object")
                        ),
                        new OA\Property(
                            property: "metadata",
                            type: "object",
                            properties: [
                                new OA\Property(
                                    property: "pagination",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "current_page", type: "integer"),
                                        new OA\Property(property: "per_page", type: "integer"),
                                        new OA\Property(property: "total", type: "integer"),
                                        new OA\Property(property: "last_page", type: "integer"),
                                        new OA\Property(property: "from", type: "integer", nullable: true),
                                        new OA\Property(property: "to", type: "integer", nullable: true),
                                        new OA\Property(property: "has_more", type: "boolean"),
                                    ]
                                ),
                                new OA\Property(property: "next_cursor", type: "string", nullable: true),
                                new OA\Property(
                                    property: "filters",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "search", type: "string", nullable: true),
                                        new OA\Property(property: "category_id", type: "integer", nullable: true),
                                        new OA\Property(property: "difficulty", type: "string", nullable: true),
                                    ]
                                ),
                                new OA\Property(
                                    property: "sortings",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "sort_by", type: "string", nullable: true),
                                        new OA\Property(property: "sort_order", type: "string", nullable: true),
                                    ]
                                ),
                            ]
                        ),
                    ]
                )
            )
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = Recipe::query()
            ->with(['user', 'category'])
            ->withCount(['likes', 'comments'])
            ->search($request->input('search'))
            ->withCategory($request->input('category_id'))
            ->filterByDifficulty($request->input('difficulty'));

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if (in_array($sortBy, ['views_count', 'created_at', 'title', 'likes_count', 'comments_count'])) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $perPage = min($request->input('per_page', 15), 50);
        $paginator = $query->paginate($perPage);

        $metadata = $this->addMetadataToPaginatedResponse($paginator, $request);
        $metadata['data'] = RecipeResource::collection($paginator)->resolve();

        return response()->json($metadata);
    }

    #[OA\Post(
        path: "/api/recipes",
        tags: ["Recipes"],
        summary: "Create a new recipe",
        description: "Use multipart/form-data to upload image. For ingredients array, use ingredients[0], ingredients[1], etc.",
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["title", "description", "instructions", "cooking_time", "servings", "difficulty"],
                    properties: [
                        new OA\Property(property: "category_id", type: "integer", nullable: true),
                        new OA\Property(property: "title", type: "string", example: "Spaghetti Bolognese"),
                        new OA\Property(property: "description", type: "string", example: "Classic Italian pasta dish"),
                        new OA\Property(property: "ingredients[]", type: "array", items: new OA\Items(type: "string")),
                        new OA\Property(property: "instructions", type: "string", example: "1. Cook pasta..."),
                        new OA\Property(property: "image", type: "string", format: "binary", description: "Recipe image (jpeg,png,jpg,gif,webp, max 5MB)"),
                        new OA\Property(property: "cooking_time", type: "integer", example: 45),
                        new OA\Property(property: "servings", type: "integer", example: 4),
                        new OA\Property(property: "difficulty", type: "string", enum: ["easy", "medium", "hard"]),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Recipe created successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(StoreRecipeRequest $request, ImageService $imageService): JsonResponse
    {
        $data = collect($request->validated())->except(['image', 'image_url'])->toArray();
        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $data['image'] = $imageService->upload($request->file('image'));
        } elseif ($request->filled('image_url')) {
            $data['image'] = $request->input('image_url');
        }

        $recipe = Recipe::create($data);
        $recipe->load(['user', 'category']);

        return response()->json([
            'message' => 'Recipe created successfully',
            'data' => new RecipeResource($recipe),
        ], 201);
    }

    #[OA\Get(
        path: "/api/recipes/{id}",
        tags: ["Recipes"],
        summary: "Get recipe details",
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Recipe details"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]

    public function show(Recipe $recipe): RecipeResource
    {
        $recipe->load(['user', 'category']);

        return new RecipeResource($recipe);
    }

    #[OA\Post(
        path: "/api/recipes/{id}",
        tags: ["Recipes"],
        summary: "Update a recipe",
        description: "Use POST with _method=PUT for multipart/form-data image upload",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "_method", type: "string", example: "PUT"),
                        new OA\Property(property: "category_id", type: "integer", nullable: true),
                        new OA\Property(property: "title", type: "string"),
                        new OA\Property(property: "description", type: "string"),
                        new OA\Property(property: "ingredients[]", type: "array", items: new OA\Items(type: "string")),
                        new OA\Property(property: "instructions", type: "string"),
                        new OA\Property(property: "image", type: "string", format: "binary", description: "Recipe image (optional)"),
                        new OA\Property(property: "cooking_time", type: "integer"),
                        new OA\Property(property: "servings", type: "integer"),
                        new OA\Property(property: "difficulty", type: "string", enum: ["easy", "medium", "hard"]),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Recipe updated successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - not owner or admin"),
            new OA\Response(response: 404, description: "Recipe not found"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function update(UpdateRecipeRequest $request, Recipe $recipe, ImageService $imageService): JsonResponse
    {
        $data = collect($request->validated())->except(['image', 'image_url'])->toArray();

        if ($request->hasFile('image')) {
            // usuwanie starego obrazu kiedy jest external url
            if ($recipe->image && !$imageService->isExternalUrl($recipe->image)) {
                $imageService->delete($recipe->image);
            }
            $data['image'] = $imageService->upload($request->file('image'));
        } elseif ($request->filled('image_url')) {
            if ($recipe->image && !$imageService->isExternalUrl($recipe->image)) {
                $imageService->delete($recipe->image);
            }
            $data['image'] = $request->input('image_url');
        }

        $recipe->update($data);
        $recipe->load(['user', 'category']);

        return response()->json([
            'message' => 'Recipe updated successfully',
            'data' => new RecipeResource($recipe),
        ]);
    }

    #[OA\Delete(
        path: "/api/recipes/{id}",
        tags: ["Recipes"],
        summary: "Delete a recipe",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Recipe deleted successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - not owner or admin"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function destroy(Request $request, Recipe $recipe, ImageService $imageService): JsonResponse
    {
        if ($request->user()->id !== $recipe->user_id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden. You can only delete your own recipes.',
            ], 403);
        }

        if ($recipe->image) {
            $imageService->delete($recipe->image);
        }

        $recipe->delete();

        return response()->json([
            'message' => 'Recipe deleted successfully',
        ]);
    }

    #[OA\Post(
        path: "/api/recipes/{id}/increment-views",
        tags: ["Recipes"],
        summary: "Increment recipe view count",
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "View count incremented"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function incrementViews(Recipe $recipe): JsonResponse
    {
        $recipe->increment('views_count');

        return response()->json([
            'message' => 'View count incremented',
            'views_count' => $recipe->views_count,
        ]);
    }
}
