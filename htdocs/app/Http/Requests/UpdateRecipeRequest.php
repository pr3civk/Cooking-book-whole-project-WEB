<?php

namespace App\Http\Requests;

use App\Models\Recipe;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $recipe = $this->route('recipe');

        if ($recipe instanceof Recipe) {
            return $this->user()->id === $recipe->user_id || $this->user()->isAdmin();
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'ingredients' => ['sometimes', 'array', 'min:1'],
            'ingredients.*' => ['required', 'string'],
            'instructions' => ['sometimes', 'string'],
            'image' => ['nullable'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'cooking_time' => ['sometimes', 'integer', 'min:1'],
            'servings' => ['sometimes', 'integer', 'min:1'],
            'difficulty' => ['sometimes', 'in:easy,medium,hard'],
        ];
    }

    public function messages(): array
    {
        return [
            'ingredients.*.required' => 'Ingredient cannot be empty.',
            'difficulty.in' => 'Difficulty must be easy, medium, or hard.',
        ];
    }
}
