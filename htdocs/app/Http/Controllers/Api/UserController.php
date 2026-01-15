<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    #[OA\Get(
        path: "/api/user",
        tags: ["Auth"],
        summary: "Get current authenticated user",
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Current user details",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "integer"),
                        new OA\Property(property: "name", type: "string"),
                        new OA\Property(property: "email", type: "string"),
                        new OA\Property(property: "is_admin", type: "boolean"),
                        new OA\Property(property: "email_verified_at", type: "string", nullable: true),
                        new OA\Property(property: "created_at", type: "string"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin ?? false,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
        ]);
    }
}
