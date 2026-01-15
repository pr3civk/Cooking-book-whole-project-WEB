<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Http\Utils\AddsMetadataToResponse;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class AdminCommentController extends Controller
{
    use AddsMetadataToResponse;
    #[OA\Get(
        path: "/api/admin/comments",
        tags: ["Admin"],
        summary: "Get all comments (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "user_id", in: "query", description: "Filter by user", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "recipe_id", in: "query", description: "Filter by recipe", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "sort_by", in: "query", description: "Sort field", schema: new OA\Schema(type: "string", enum: ["created_at", "updated_at"])),
            new OA\Parameter(name: "sort_order", in: "query", description: "Sort order", schema: new OA\Schema(type: "string", enum: ["asc", "desc"])),
            new OA\Parameter(name: "per_page", in: "query", description: "Items per page", schema: new OA\Schema(type: "integer", default: 20)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of all comments",
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
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "user_id", type: "integer", nullable: true),
                                        new OA\Property(property: "recipe_id", type: "integer", nullable: true),
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
        $query = Comment::query()
            ->with(['user', 'recipe']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->has('recipe_id')) {
            $query->where('recipe_id', $request->input('recipe_id'));
        }

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

    #[OA\Delete(
        path: "/api/admin/comments/{id}",
        tags: ["Admin"],
        summary: "Force delete comment (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Comment deleted"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Comment not found"),
        ]
    )]
    public function destroy(Comment $comment): JsonResponse
    {
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }
}
