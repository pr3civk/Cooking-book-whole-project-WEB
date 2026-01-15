<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecipeResource;
use App\Http\Utils\AddsMetadataToResponse;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class AdminRecipeController extends Controller
{
    use AddsMetadataToResponse;
    #[OA\Get(
        path: "/api/admin/recipes",
        tags: ["Admin"],
        summary: "Get all recipes (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "search", in: "query", description: "Search in title", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "user_id", in: "query", description: "Filter by user", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "category_id", in: "query", description: "Filter by category", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "sort_by", in: "query", description: "Sort field", schema: new OA\Schema(type: "string", enum: ["title", "created_at", "views_count", "updated_at"])),
            new OA\Parameter(name: "sort_order", in: "query", description: "Sort order", schema: new OA\Schema(type: "string", enum: ["asc", "desc"])),
            new OA\Parameter(name: "per_page", in: "query", description: "Items per page", schema: new OA\Schema(type: "integer", default: 20)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of all recipes",
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
                                        new OA\Property(property: "user_id", type: "integer", nullable: true),
                                        new OA\Property(property: "category_id", type: "integer", nullable: true),
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
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = Recipe::query()
            ->with(['user', 'category']);

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Add sorting support
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if (in_array($sortBy, ['title', 'created_at', 'views_count', 'updated_at'])) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = min($request->input('per_page', 20), 100);
        $paginator = $query->paginate($perPage);

        $metadata = $this->addMetadataToPaginatedResponse($paginator, $request);
        $metadata['data'] = RecipeResource::collection($paginator)->resolve();

        return response()->json($metadata);
    }

    #[OA\Delete(
        path: "/api/admin/recipes/{id}",
        tags: ["Admin"],
        summary: "Force delete recipe (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Recipe deleted"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function destroy(Recipe $recipe): JsonResponse
    {
        $recipe->delete();

        return response()->json([
            'message' => 'Recipe deleted successfully',
        ]);
    }
}
