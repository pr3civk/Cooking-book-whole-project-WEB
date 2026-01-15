<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class StorageController extends Controller
{
    public function show(string $path): Response
    {
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $file = Storage::disk('public')->get($path);
        $mimeType = \Illuminate\Support\Facades\File::mimeType(Storage::disk('public')->path($path));

        return response($file, 200)
            ->header('Content-Type', $mimeType)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Cache-Control', 'public, max-age=31536000');
    }
}
