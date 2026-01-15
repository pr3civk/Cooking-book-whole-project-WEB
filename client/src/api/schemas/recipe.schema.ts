import { z } from "zod";

// Recipe User
export const recipeUserDto = z.object({
  id: z.number(),
  name: z.string(),
});

// Recipe Category
export const recipeCategoryDto = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Recipe Base (API response format)
export const recipeDto = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  ingredients: z.array(z.string()),
  instructions: z.string().or(z.array(z.string())), // API returns string, but we may parse it
  image: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  cooking_time: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  views_count: z.number().default(0),
  likes_count: z.number().default(0),
  comments_count: z.number().default(0),
  user: recipeUserDto.optional(),
  category: recipeCategoryDto.optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Recipe Pagination Metadata
export const recipePaginationMetadataDto = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
  from: z.number(),
  to: z.number(),
  has_more: z.boolean(),
});

// Recipe List Response Metadata
export const recipeListMetadataDto = z.object({
  pagination: recipePaginationMetadataDto,
  next_cursor: z.string().optional(),
  filters: z.array(z.unknown()),
  sortings: z.object({
    sort_by: z.string().nullable(),
    sort_order: z.string().nullable(),
  }),
});

// Recipe List Response
export const recipeListResponseDto = z.object({
  data: z.array(recipeDto),
  metadata: recipeListMetadataDto,
});

// Recipe Comment User
export const recipeCommentUserDto = z.object({
  id: z.number(),
  name: z.string(),
});

// Recipe Comments
export const recipeCommentDto = z.object({
  id: z.number(),
  content: z.string(),
  recipe_id: z.number(),
  user: recipeCommentUserDto,
  created_at: z.string(),
  updated_at: z.string(),
});

// Recipe Comments Response
export const recipeCommentsResponseDto = z.object({
  data: z.array(recipeCommentDto),
  metadata: recipeListMetadataDto,
});

// Create Recipe
export const createRecipeRequestDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.array(z.string()).min(1),
  instructions: z.array(z.string()).min(1),
  prepTime: z.number().positive().optional(),
  cookTime: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().optional(),
});

// Update Recipe
export const updateRecipeRequestDto = createRecipeRequestDto.partial();

// Transform to API format (snake_case, instructions as string)
export const updateRecipeApiDto = updateRecipeRequestDto.transform((data) => {
  const apiData: Record<string, unknown> = {};
  if (data.title !== undefined) apiData.title = data.title;
  if (data.description !== undefined) apiData.description = data.description;
  if (data.ingredients !== undefined) apiData.ingredients = data.ingredients;
  if (data.instructions !== undefined) apiData.instructions = data.instructions.join("\n");
  if (data.cookTime !== undefined) apiData.cooking_time = data.cookTime;
  if (data.servings !== undefined) apiData.servings = data.servings;
  if (data.difficulty !== undefined) apiData.difficulty = data.difficulty;
  if (data.imageUrl !== undefined) apiData.image_url = data.imageUrl;
  if (data.categoryId !== undefined) apiData.category_id = data.categoryId;
  return apiData;
});

// Transform CreateRecipeRequestDto to API format
export const createRecipeApiDto = createRecipeRequestDto.transform((data) => ({
  title: data.title,
  description: data.description,
  ingredients: data.ingredients,
  instructions: data.instructions.join("\n"),
  cooking_time: data.cookTime,
  servings: data.servings,
  difficulty: data.difficulty,
  image_url: data.imageUrl,
  category_id: data.categoryId,
}));

// List Recipes Query Params
export const getRecipesQueryParamsDto = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
  categoryId: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "views", "likes", "title"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  cursor: z.string().optional(),
});

// Recipe Detail Params
export const getRecipeByIdParamsDto = z.object({
  id: z.coerce.number(),
});

export const getRecipeCommentsParamsDto = z.object({
  recipeId: z.coerce.number(),
});

export const getRecipeCommentsQueryParamsDto = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
});

export const addCommentRequestDto = z.object({
  content: z.string().min(1),
});

export const addCommentResponseDto = recipeCommentDto;

// Like Recipe
export const likeRecipeParamsDto = z.object({
  recipeId: z.coerce.number(),
});

export const likeRecipeResponseDto = z.object({
  is_liked: z.boolean(),
  likes_count: z.number(),
});

// Get Recipe Likes
export const getRecipeLikesParamsDto = z.object({
  recipeId: z.coerce.number(),
});

export const getRecipeLikesResponseDto = z.object({
  likes: z.number(),
  isLiked: z.boolean(),
});

// Increment Views
export const incrementRecipeViewsParamsDto = z.object({
  id: z.coerce.number(),
});

export const incrementRecipeViewsResponseDto = z.object({
  views: z.number(),
});

export type RecipeUserDto = z.infer<typeof recipeUserDto>;
export type RecipeCategoryDto = z.infer<typeof recipeCategoryDto>;
export type RecipeDto = z.infer<typeof recipeDto>;
export type RecipePaginationMetadataDto = z.infer<typeof recipePaginationMetadataDto>;
export type RecipeListMetadataDto = z.infer<typeof recipeListMetadataDto>;
export type RecipeListResponseDto = z.infer<typeof recipeListResponseDto>;
export type RecipeCommentsResponseDto = z.infer<typeof recipeCommentsResponseDto>;
export type CreateRecipeRequestDto = z.infer<typeof createRecipeRequestDto>;
export type UpdateRecipeRequestDto = z.infer<typeof updateRecipeRequestDto>;
export type GetRecipesQueryParamsDto = z.infer<typeof getRecipesQueryParamsDto>;
export type GetRecipeByIdParamsDto = z.infer<typeof getRecipeByIdParamsDto>;
export type RecipeCommentUserDto = z.infer<typeof recipeCommentUserDto>;
export type RecipeCommentDto = z.infer<typeof recipeCommentDto>;
export type GetRecipeCommentsParamsDto = z.infer<typeof getRecipeCommentsParamsDto>;
export type GetRecipeCommentsQueryParamsDto = z.infer<typeof getRecipeCommentsQueryParamsDto>;
export type AddCommentRequestDto = z.infer<typeof addCommentRequestDto>;
export type AddCommentResponseDto = z.infer<typeof addCommentResponseDto>;
export type LikeRecipeParamsDto = z.infer<typeof likeRecipeParamsDto>;
export type LikeRecipeResponseDto = z.infer<typeof likeRecipeResponseDto>;
export type GetRecipeLikesParamsDto = z.infer<typeof getRecipeLikesParamsDto>;
export type GetRecipeLikesResponseDto = z.infer<typeof getRecipeLikesResponseDto>;
export type IncrementRecipeViewsParamsDto = z.infer<typeof incrementRecipeViewsParamsDto>;
export type IncrementRecipeViewsResponseDto = z.infer<typeof incrementRecipeViewsResponseDto>;
