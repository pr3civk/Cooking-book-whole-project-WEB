<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class ChangePasswordController extends Controller
{
    #[OA\Put(
        path: "/api/password",
        tags: ["Auth"],
        summary: "Change password",
        description: "Change password for the currently authenticated user",
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["current_password", "password", "password_confirmation"],
                properties: [
                    new OA\Property(property: "current_password", type: "string", format: "password", description: "Current password"),
                    new OA\Property(property: "password", type: "string", format: "password", description: "New password"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", description: "Confirm new password"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Password changed successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error or incorrect current password"),
        ]
    )]
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
