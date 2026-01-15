<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    protected string $disk = 'public';
    protected string $directory = 'recipes';

    /**
     * Upload image file and return path.
     */
    public function upload(UploadedFile $file): string
    {
        $filename = $this->generateFilename($file);
        $path = $file->storeAs($this->directory, $filename, $this->disk);

        return $path;
    }

    /**
     * Check if string is external URL.
     */
    public function isExternalUrl(?string $value): bool
    {
        if (!$value) {
            return false;
        }
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Store image from URL or return URL if external.
     */
    public function storeFromUrl(string $url): string
    {
        // Just store the URL directly - no download
        return $url;
    }

    /**
     * Delete image by path.
     */
    public function delete(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    /**
     * Get full URL for image path.
     */
    public function url(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // Route through API for CORS support
        return url('/api/storage/' . $path);
    }

    /**
     * Generate unique filename.
     */
    protected function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        return Str::uuid() . '.' . $extension;
    }
}
