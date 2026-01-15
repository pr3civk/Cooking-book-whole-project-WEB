<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Utils\AddsMetadataToResponse;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

class CategoryController extends Controller
{
    use AddsMetadataToResponse;
    #[OA\Get(
        path: "/api/categories",
        tags: ["Categories"],
        summary: "Get list of categories",
        parameters: [
            new OA\Parameter(name: "sort_by", in: "query", description: "Sort field", schema: new OA\Schema(type: "string", enum: ["name", "created_at", "recipes_count"])),
            new OA\Parameter(name: "sort_order", in: "query", description: "Sort order", schema: new OA\Schema(type: "string", enum: ["asc", "desc"])),
            new OA\Parameter(name: "per_page", in: "query", description: "Items per page", schema: new OA\Schema(type: "integer", default: 20)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of categories",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(type: "object", description: "Category object")
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
                                    type: "object"
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
        $query = Category::query()->withCount('recipes');

        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');

        if (in_array($sortBy, ['name', 'created_at', 'recipes_count'])) {
            $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
        }

        $perPage = min($request->input('per_page', 20), 100);
        $paginator = $query->paginate($perPage);

        $metadata = $this->addMetadataToPaginatedResponse($paginator, $request);
        $metadata['data'] = CategoryResource::collection($paginator)->resolve();

        return response()->json($metadata);
    }

    #[OA\Get(
        path: "/api/categories/{id}",
        tags: ["Categories"],
        summary: "Get category details with recipes",
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Category with recipes"),
            new OA\Response(response: 404, description: "Category not found"),
        ]
    )]
    public function show(Category $category): CategoryResource
    {
        $category->load(['recipes' => function ($query) {
            $query->with(['user', 'category'])->latest()->limit(20);
        }]);
        $category->loadCount('recipes');

        return new CategoryResource($category);
    }

    #[OA\Post(
        path: "/api/categories",
        tags: ["Categories"],
        summary: "Create a new category (Admin only)",
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Obiady"),
                    new OA\Property(property: "slug", type: "string", example: "obiady", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Category created"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category),
        ], 201);
    }

    #[OA\Put(
        path: "/api/categories/{id}",
        tags: ["Categories"],
        summary: "Update a category (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "slug", type: "string", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Category updated"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
            new OA\Response(response: 404, description: "Category not found"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'unique:categories,name,' . $category->id],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug,' . $category->id],
        ]);

        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category),
        ]);
    }

    #[OA\Delete(
        path: "/api/categories/{id}",
        tags: ["Categories"],
        summary: "Delete a category (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Category deleted"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
            new OA\Response(response: 404, description: "Category not found"),
        ]
    )]
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
