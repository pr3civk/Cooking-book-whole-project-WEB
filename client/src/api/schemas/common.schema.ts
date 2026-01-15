import { z } from "zod";

// Pagination Metadata
export const paginationMetadata = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
  has_more: z.boolean(),
});

// Sortings Metadata
export const sortingsMetadata = z.object({
  sort_by: z.string().nullable().optional(),
  sort_order: z.string().nullable().optional(),
});

// Common API Response Metadata
export const apiResponseMetadata = z.object({
  pagination: paginationMetadata.optional(),
  next_cursor: z.string().nullable().optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
  sortings: sortingsMetadata.optional(),
});

// Paginated Response Helper
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    metadata: apiResponseMetadata.optional(),
  });
}

export type PaginationMetadata = z.infer<typeof paginationMetadata>;
export type SortingsMetadata = z.infer<typeof sortingsMetadata>;
export type ApiResponseMetadata = z.infer<typeof apiResponseMetadata>;
