<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Http\Utils\AddsMetadataToResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class AdminUserController extends Controller
{
    use AddsMetadataToResponse;
    #[OA\Get(
        path: "/api/admin/users",
        tags: ["Admin"],
        summary: "Get list of users (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "search", in: "query", description: "Search by name or email", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "is_admin", in: "query", description: "Filter by admin status", schema: new OA\Schema(type: "boolean")),
            new OA\Parameter(name: "sort_by", in: "query", description: "Sort field", schema: new OA\Schema(type: "string", enum: ["name", "email", "created_at", "recipes_count", "comments_count"])),
            new OA\Parameter(name: "sort_order", in: "query", description: "Sort order", schema: new OA\Schema(type: "string", enum: ["asc", "desc"])),
            new OA\Parameter(name: "per_page", in: "query", description: "Items per page", schema: new OA\Schema(type: "integer", default: 20)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of users",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(type: "object", description: "User object")
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
                                        new OA\Property(property: "is_admin", type: "boolean", nullable: true),
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
        $query = User::query()
            ->withCount(['recipes', 'comments', 'likes']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_admin')) {
            $query->where('is_admin', $request->boolean('is_admin'));
        }

        // Add sorting support
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if (in_array($sortBy, ['name', 'email', 'created_at', 'recipes_count', 'comments_count'])) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = min($request->input('per_page', 20), 100);
        $paginator = $query->paginate($perPage);

        $metadata = $this->addMetadataToPaginatedResponse($paginator, $request);
        $metadata['data'] = UserResource::collection($paginator)->resolve();

        return response()->json($metadata);
    }

    #[OA\Get(
        path: "/api/admin/users/{id}",
        tags: ["Admin"],
        summary: "Get user details (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "User details"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "User not found"),
        ]
    )]
    public function show(User $user): UserResource
    {
        $user->loadCount(['recipes', 'comments', 'likes']);

        return new UserResource($user);
    }

    #[OA\Put(
        path: "/api/admin/users/{id}",
        tags: ["Admin"],
        summary: "Update user (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "email", type: "string", format: "email"),
                    new OA\Property(property: "is_admin", type: "boolean"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "User updated"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "User not found"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'is_admin' => ['sometimes', 'boolean'],
        ]);

        $user->update($validated);
        $user->loadCount(['recipes', 'comments', 'likes']);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => new UserResource($user),
        ]);
    }

    #[OA\Delete(
        path: "/api/admin/users/{id}",
        tags: ["Admin"],
        summary: "Delete user (Admin only)",
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "User deleted"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "User not found"),
        ]
    )]
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'Cannot delete yourself.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
