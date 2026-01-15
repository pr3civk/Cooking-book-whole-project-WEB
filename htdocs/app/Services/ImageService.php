<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    protected string $disk = 'public';
    protected string $directory = 'recipes';


    public function upload(UploadedFile $file): string
    {
        $filename = $this->generateFilename($file);
        $path = $file->storeAs($this->directory, $filename, $this->disk);

        return $path;
    }

    public function isExternalUrl(?string $value): bool
    {
        if (!$value) {
            return false;
        }
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }

    public function storeFromUrl(string $url): string
    {
        return $url;
    }

    public function delete(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    public function url(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return url('/api/storage/' . $path);
    }

    protected function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        return Str::uuid() . '.' . $extension;
    }
}
