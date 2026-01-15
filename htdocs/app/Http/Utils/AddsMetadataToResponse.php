<?php

namespace App\Http\Utils;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

trait AddsMetadataToResponse
{
    protected function addMetadataToPaginatedResponse(
        LengthAwarePaginator $paginator,
        Request $request,
        array $additionalMetadata = []
    ): array {
        $filters = $this->extractFilters($request);
        $sortings = $this->extractSortings($request);
        $nextCursor = $this->generateNextCursor($paginator, $request);

        return [
            'data' => $paginator->items(),
            'metadata' => array_merge([
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'last_page' => $paginator->lastPage(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                    'has_more' => $paginator->hasMorePages(),
                ],
                'next_cursor' => $nextCursor,
                'filters' => $filters,
                'sortings' => $sortings,
            ], $additionalMetadata),
        ];
    }

    protected function addMetadataToCollectionResponse(
        Collection $collection,
        Request $request,
        array $additionalMetadata = []
    ): array {
        $filters = $this->extractFilters($request);
        $sortings = $this->extractSortings($request);

        return [
            'data' => $collection->toArray(),
            'metadata' => array_merge([
                'total' => $collection->count(),
                'filters' => $filters,
                'sortings' => $sortings,
            ], $additionalMetadata),
        ];
    }

    protected function extractFilters(Request $request): array
    {
        $filterKeys = [
            'search',
            'category_id',
            'difficulty',
            'user_id',
            'recipe_id',
            'is_admin',
        ];

        $filters = [];
        foreach ($filterKeys as $key) {
            if ($request->has($key)) {
                $filters[$key] = $request->input($key);
            }
        }

        return $filters;
    }

    protected function extractSortings(Request $request): array
    {
        return [
            'sort_by' => $request->input('sort_by'),
            'sort_order' => $request->input('sort_order'),
        ];
    }

    protected function generateNextCursor(LengthAwarePaginator $paginator, Request $request): ?string
    {
        if (!$paginator->hasMorePages()) {
            return null;
        }

        $items = $paginator->items();
        if (empty($items)) {
            return null;
        }

        $lastItem = end($items);
        $lastId = is_object($lastItem) && isset($lastItem->id) ? $lastItem->id : null;

        if (!$lastId) {
            return null;
        }

        // stworzenie cursora z ostatniego itemu
        $cursorData = [
            'last_id' => $lastId,
            'page' => $paginator->currentPage() + 1,
            'filters' => $this->extractFilters($request),
            'sortings' => $this->extractSortings($request),
        ];

        return base64_encode(json_encode($cursorData));
    }
}
