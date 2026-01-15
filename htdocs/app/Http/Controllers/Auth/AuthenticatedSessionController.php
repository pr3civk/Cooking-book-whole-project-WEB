<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class AuthenticatedSessionController extends Controller
{
    #[OA\Post(
        path: "/api/login",
        tags: ["Auth"],
        summary: "Login user",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "test@test.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "KontoTest11"),
                    new OA\Property(property: "remember", type: "boolean", example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login successful"),
            new OA\Response(response: 422, description: "Invalid credentials"),
        ]
    )]
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = $request->user();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin ?? false,
            ],
            'token' => $token,
        ]);
    }

    #[OA\Post(
        path: "/api/auth/refresh",
        tags: ["Auth"],
        summary: "Refresh token",
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Token refreshed successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        // Delete the current token and create a new one
        $request->user()->currentAccessToken()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin ?? false,
            ],
            'token' => $token,
        ]);
    }

    #[OA\Post(
        path: "/api/logout",
        tags: ["Auth"],
        summary: "Logout user",
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Logout successful"),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }
}
