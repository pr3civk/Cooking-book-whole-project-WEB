import { z } from "zod";

// Sorting enums
export const commentSortBy = z.enum(["created_at", "updated_at"]);
export const recipeSortBy = z.enum(["title", "created_at", "views_count", "updated_at"]);
export const userSortBy = z.enum(["name", "email", "created_at", "recipes_count", "comments_count"]);
export const sortOrder = z.enum(["asc", "desc"]);

// Admin Comments
export const getAdminCommentsQueryParamsDto = z.object({
  page: z.coerce.number().positive().optional(),
  per_page: z.coerce.number().positive().optional(),
  user_id: z.coerce.number().optional(),
  recipe_id: z.coerce.number().optional(),
  sort_by: commentSortBy.optional(),
  sort_order: sortOrder.optional(),
});

export const adminCommentDto = z.object({
  id: z.number(),
  content: z.string(),
  recipe_id: z.number(),
  recipe_title: z.string().optional().nullable(),
  user_id: z.number(),
  user_name: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const deleteAdminCommentParamsDto = z.object({
  id: z.coerce.number(),
});

export const deleteAdminCommentResponseDto = z.object({
  message: z.string(),
});

// Admin Recipes
export const getAdminRecipesQueryParamsDto = z.object({
  page: z.coerce.number().positive().optional(),
  per_page: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  user_id: z.coerce.number().optional(),
  category_id: z.coerce.number().optional(),
  sort_by: recipeSortBy.optional(),
  sort_order: sortOrder.optional(),
});

export const deleteAdminRecipeParamsDto = z.object({
  id: z.coerce.number(),
});

export const deleteAdminRecipeResponseDto = z.object({
  message: z.string(),
});

// Admin Users
export const getAdminUsersQueryParamsDto = z.object({
  page: z.coerce.number().positive().optional(),
  per_page: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  is_admin: z.coerce.boolean().optional(),
  sort_by: userSortBy.optional(),
  sort_order: sortOrder.optional(),
});

export const adminUserDto = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  is_admin: z.boolean().default(false),
  recipes_count: z.number().optional(),
  comments_count: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const getAdminUserByIdParamsDto = z.object({
  id: z.coerce.number(),
});

export const updateAdminUserRequestDto = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  is_admin: z.boolean().optional(),
});

export const updateAdminUserResponseDto = adminUserDto;

export const deleteAdminUserParamsDto = z.object({
  id: z.coerce.number(),
});

export const deleteAdminUserResponseDto = z.object({
  message: z.string(),
});

// Paginated response wrapper
export const paginationMeta = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
  has_more: z.boolean(),
});

export const paginatedResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: paginationMeta,
  });

export type CommentSortBy = z.infer<typeof commentSortBy>;
export type RecipeSortBy = z.infer<typeof recipeSortBy>;
export type UserSortBy = z.infer<typeof userSortBy>;
export type SortOrder = z.infer<typeof sortOrder>;
export type GetAdminCommentsQueryParamsDto = z.infer<typeof getAdminCommentsQueryParamsDto>;
export type AdminCommentDto = z.infer<typeof adminCommentDto>;
export type DeleteAdminCommentParamsDto = z.infer<typeof deleteAdminCommentParamsDto>;
export type DeleteAdminCommentResponseDto = z.infer<typeof deleteAdminCommentResponseDto>;
export type GetAdminRecipesQueryParamsDto = z.infer<typeof getAdminRecipesQueryParamsDto>;
export type DeleteAdminRecipeParamsDto = z.infer<typeof deleteAdminRecipeParamsDto>;
export type DeleteAdminRecipeResponseDto = z.infer<typeof deleteAdminRecipeResponseDto>;
export type GetAdminUsersQueryParamsDto = z.infer<typeof getAdminUsersQueryParamsDto>;
export type AdminUserDto = z.infer<typeof adminUserDto>;
export type GetAdminUserByIdParamsDto = z.infer<typeof getAdminUserByIdParamsDto>;
export type UpdateAdminUserRequestDto = z.infer<typeof updateAdminUserRequestDto>;
export type UpdateAdminUserResponseDto = z.infer<typeof updateAdminUserResponseDto>;
export type DeleteAdminUserParamsDto = z.infer<typeof deleteAdminUserParamsDto>;
export type DeleteAdminUserResponseDto = z.infer<typeof deleteAdminUserResponseDto>;
export type PaginationMeta = z.infer<typeof paginationMeta>;
