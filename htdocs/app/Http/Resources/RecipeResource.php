<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'ingredients' => $this->ingredients,
            'instructions' => $this->instructions,
            'image' => $this->getImageUrl(),
            'cooking_time' => $this->cooking_time,
            'servings' => $this->servings,
            'difficulty' => $this->difficulty,
            'views_count' => $this->views_count,
            'likes_count' => $this->likes_count,
            'comments_count' => $this->comments_count,
            'is_liked' => $this->when(
                $request->user(),
                fn() => $this->isLikedBy($request->user())
            ),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'category' => $this->when($this->category, [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    protected function getImageUrl(): ?string
    {
        if (!$this->image) {
            return null;
        }

        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            if (str_contains($this->image, '/storage/')) {
                $path = preg_replace('#^.*/storage/#', '', $this->image);
                return url('/api/storage/' . $path);
            }
            return $this->image;
        }

        return url('/api/storage/' . $this->image);
    }
}
