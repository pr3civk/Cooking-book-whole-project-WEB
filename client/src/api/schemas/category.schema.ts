import { z } from "zod";
import { createPaginatedResponseSchema } from "./common.schema";

// Category
export const categoryDto = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.url().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

// Categories List Response (with metadata)
export const categoriesListResponseDto = createPaginatedResponseSchema(categoryDto);

// Create Category
export const createCategoryRequestDto = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.url().optional(),
});

// Update Category
export const updateCategoryRequestDto = createCategoryRequestDto.partial();

// Category Params
export const getCategoryByIdParamsDto = z.object({
  id: z.coerce.number(),
});

export const deleteCategoryParamsDto = z.object({
  id: z.coerce.number(),
});

export const deleteCategoryResponseDto = z.object({
  message: z.string(),
});

export type CategoryDto = z.infer<typeof categoryDto>;
export type CreateCategoryRequestDto = z.infer<typeof createCategoryRequestDto>;
export type UpdateCategoryRequestDto = z.infer<typeof updateCategoryRequestDto>;
export type GetCategoryByIdParamsDto = z.infer<typeof getCategoryByIdParamsDto>;
export type DeleteCategoryParamsDto = z.infer<typeof deleteCategoryParamsDto>;
export type DeleteCategoryResponseDto = z.infer<typeof deleteCategoryResponseDto>;
export type CategoriesListResponseDto = z.infer<typeof categoriesListResponseDto>;
