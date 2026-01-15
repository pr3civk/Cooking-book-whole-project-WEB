<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Http\Utils\AddsMetadataToResponse;
use App\Models\Comment;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class CommentController extends Controller
{
    use AddsMetadataToResponse;
    #[OA\Get(
        path: "/api/recipes/{recipeId}/comments",
        tags: ["Comments"],
        summary: "Get comments for a recipe",
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "sort_by", in: "query", description: "Sort field", schema: new OA\Schema(type: "string", enum: ["created_at", "updated_at"])),
            new OA\Parameter(name: "sort_order", in: "query", description: "Sort order", schema: new OA\Schema(type: "string", enum: ["asc", "desc"])),
            new OA\Parameter(name: "per_page", in: "query", description: "Items per page", schema: new OA\Schema(type: "integer", default: 20)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of comments",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(type: "object", description: "Comment object")
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
            ),
            new OA\Response(response: 404, description: "Recipe not found"),
        ]
    )]
    public function index(Request $request, Recipe $recipe): JsonResponse
    {
        $query = $recipe->comments()->with('user');

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if (in_array($sortBy, ['created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = min($request->input('per_page', 20), 100);
        $paginator = $query->paginate($perPage);

        $metadata = $this->addMetadataToPaginatedResponse($paginator, $request);
        $metadata['data'] = CommentResource::collection($paginator)->resolve();

        return response()->json($metadata);
    }

    #[OA\Post(
        path: "/api/recipes/{recipeId}/comments",
        tags: ["Comments"],
        summary: "Add a comment to a recipe",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "recipeId", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["content"],
                properties: [
                    new OA\Property(property: "content", type: "string", example: "Great recipe!", maxLength: 2000)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Comment created"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 404, description: "Recipe not found"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(StoreCommentRequest $request, Recipe $recipe): JsonResponse
    {
        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'recipe_id' => $recipe->id,
            'content' => $request->validated('content'),
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comment created successfully',
            'data' => new CommentResource($comment),
        ], 201);
    }

    #[OA\Put(
        path: "/api/comments/{id}",
        tags: ["Comments"],
        summary: "Update a comment",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["content"],
                properties: [
                    new OA\Property(property: "content", type: "string", maxLength: 2000)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Comment updated"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - not owner or admin"),
            new OA\Response(response: 404, description: "Comment not found"),
        ]
    )]
    public function update(StoreCommentRequest $request, Comment $comment): JsonResponse
    {
        if ($request->user()->id !== $comment->user_id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden. You can only edit your own comments.',
            ], 403);
        }

        $comment->update([
            'content' => $request->validated('content'),
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comment updated successfully',
            'data' => new CommentResource($comment),
        ]);
    }

    #[OA\Delete(
        path: "/api/comments/{id}",
        tags: ["Comments"],
        summary: "Delete a comment",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Comment deleted"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - not owner or admin"),
            new OA\Response(response: 404, description: "Comment not found"),
        ]
    )]
    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        if ($request->user()->id !== $comment->user_id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden. You can only delete your own comments.',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }
}
