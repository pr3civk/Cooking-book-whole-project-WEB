<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class HealthController extends Controller
{
    #[OA\Get(
        path: "/api/health",
        tags: ["Health"],
        summary: "API Health Check",
        description: "Returns API status and version information",
        responses: [
            new OA\Response(
                response: 200,
                description: "API is running",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "ok"),
                        new OA\Property(property: "message", type: "string", example: "Cooking Book API is running"),
                        new OA\Property(property: "version", type: "string", example: "1.0.0")
                    ]
                )
            )
        ]
    )]
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Cooking Book API is running',
            'version' => '1.0.0'
        ]);
    }
}
