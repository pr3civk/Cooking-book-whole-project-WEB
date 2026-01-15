<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'min:1', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Comment content is required.',
            'content.max' => 'Comment cannot exceed 2000 characters.',
        ];
    }
}
