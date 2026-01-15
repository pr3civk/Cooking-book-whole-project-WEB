<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*' => ['required', 'string'],
            'instructions' => ['required', 'string'],
            'image' => ['nullable'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'cooking_time' => ['required', 'integer', 'min:1'],
            'servings' => ['required', 'integer', 'min:1'],
            'difficulty' => ['required', 'in:easy,medium,hard'],
        ];
    }

    public function messages(): array
    {
        return [
            'ingredients.required' => 'At least one ingredient is required.',
            'ingredients.*.required' => 'Ingredient cannot be empty.',
            'difficulty.in' => 'Difficulty must be easy, medium, or hard.',
        ];
    }
}
