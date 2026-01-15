<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreImageRequest;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class ImageUploadController extends Controller
{
    #[OA\Post(
        path: "/api/upload",
        tags: ["Upload"],
        summary: "Upload an image",
        description: "Upload image file and get URL back. Use returned URL in image_url field when creating recipes.",
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["image"],
                    properties: [
                        new OA\Property(property: "image", type: "string", format: "binary", description: "Image file (jpeg,png,jpg,gif,webp, max 5MB)"),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Image uploaded successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "url", type: "string", example: "http://localhost/storage/recipes/abc123.jpg"),
                        new OA\Property(property: "path", type: "string", example: "recipes/abc123.jpg"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(StoreImageRequest $request, ImageService $imageService): JsonResponse
    {
        $path = $imageService->upload($request->file('image'));
        $url = $imageService->url($path);

        return response()->json([
            'url' => $url,
            'path' => $path,
        ], 201);
    }
}
