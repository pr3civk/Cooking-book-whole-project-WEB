<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Image file is required.',
            'image.image' => 'File must be an image.',
            'image.mimes' => 'Image must be jpeg, png, jpg, gif, or webp.',
            'image.max' => 'Image must not exceed 5MB.',
        ];
    }
}
