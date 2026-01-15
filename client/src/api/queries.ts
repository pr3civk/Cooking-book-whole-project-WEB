import type {
  GetRecipeByIdParamsDto,
  GetRecipesQueryParamsDto,
  GetRecipeCommentsParamsDto,
  GetRecipeCommentsQueryParamsDto,
  GetRecipeLikesParamsDto,
} from "./schemas/recipe.schema";
import type { GetCategoryByIdParamsDto } from "./schemas/category.schema";
import type {
  GetAdminCommentsQueryParamsDto,
  GetAdminRecipesQueryParamsDto,
  GetAdminUsersQueryParamsDto,
  GetAdminUserByIdParamsDto,
} from "./schemas/admin.schema";
import {
  fetchHealth,
  fetchLogin,
  fetchLogout,
  fetchRegister,
  fetchUser,
  fetchForgotPassword,
  fetchResetPassword,
  fetchChangePassword,
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  incrementRecipeViews,
  fetchRecipeComments,
  addRecipeComment,
  likeRecipe,
  fetchRecipeLikes,
  fetchRecipeIsLiked,
  updateComment,
  deleteComment,
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAdminComments,
  deleteAdminComment,
  fetchAdminRecipes,
  deleteAdminRecipe,
  fetchAdminUsers,
  fetchAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  uploadImage,
  fetchLikedRecipes,
  addLikedRecipe,
  removeLikedRecipe,
} from "./endpoints";

export const queries = {
  health: {
    check: {
      queryKey: ["health"] as const,
      queryFn: () => fetchHealth(),
    },
  },
  auth: {
    user: {
      queryKey: ["me"] as const,
      queryFn: () => fetchUser(),
    },
  },
  recipes: {
    list: (searchParams?: Record<string, unknown>) => ({
      queryKey: [
        "list-recipes",
        searchParams?.page,
        searchParams?.limit,
        searchParams?.category_id,
        searchParams?.search,
        searchParams?.sort_by,
        searchParams?.sort_order,
      ] as const,
      queryFn: () => fetchRecipes(searchParams as GetRecipesQueryParamsDto),
    }),
    detail: (params: GetRecipeByIdParamsDto) => ({
      queryKey: ["detail-recipe", params.id] as const,
      queryFn: () => fetchRecipeById(params),
    }),
    comments: (
      params: GetRecipeCommentsParamsDto,
      searchParams?: GetRecipeCommentsQueryParamsDto
    ) => ({
      queryKey: [
        "list-recipe-comments",
        params.recipeId,
        searchParams?.page,
        searchParams?.limit,
      ] as const,
      queryFn: () => fetchRecipeComments(params, searchParams),
    }),
    likes: (params: GetRecipeLikesParamsDto) => ({
      queryKey: ["list-recipe-likes", params.recipeId] as const,
      queryFn: () => fetchRecipeLikes(params),
    }),
    isLiked: (params: GetRecipeLikesParamsDto) => ({
      queryKey: ["check-recipe-is-liked", params.recipeId] as const,
      queryFn: () => fetchRecipeIsLiked(params),
    }),
  },
  categories: {
    all: {
      queryKey: ["categories"] as const,
      queryFn: async () => {
        const response = await fetchCategories();
        if (response.data?.data && Array.isArray(response.data.data)) {
          response.data.data.sort((a, b) => a.id - b.id);
        }
        return response;
      },
    },
    detail: (params: GetCategoryByIdParamsDto) => ({
      queryKey: ["detail-category", params.id] as const,
      queryFn: () => fetchCategoryById(params),
    }),
  },
  adminComments: {
    list: (searchParams?: GetAdminCommentsQueryParamsDto) => ({
      queryKey: ["list-admin-comments", searchParams] as const,
      queryFn: () => fetchAdminComments(searchParams),
    }),
  },
  adminRecipes: {
    list: (searchParams?: GetAdminRecipesQueryParamsDto) => ({
      queryKey: ["list-admin-recipes", searchParams] as const,
      queryFn: () => fetchAdminRecipes(searchParams),
    }),
  },
  adminUsers: {
    list: (searchParams?: GetAdminUsersQueryParamsDto) => ({
      queryKey: ["list-admin-users", searchParams] as const,
      queryFn: () => fetchAdminUsers(searchParams),
    }),
    detail: (params: GetAdminUserByIdParamsDto) => ({
      queryKey: ["detail-admin-user", params.id] as const,
      queryFn: () => fetchAdminUserById(params),
    }),
  },
  likedRecipes: {
    list: (searchParams?: { page?: number; per_page?: number }) => ({
      queryKey: [
        "list-liked-recipes",
        searchParams?.page,
        searchParams?.per_page,
      ] as const,
      queryFn: () => fetchLikedRecipes(searchParams),
    }),
  },
};

// Export mutation functions for useMutation
export const mutations = {
  // Auth
  login: fetchLogin,
  logout: fetchLogout,
  register: fetchRegister,
  forgotPassword: fetchForgotPassword,
  resetPassword: fetchResetPassword,
  changePassword: fetchChangePassword,

  // Recipes
  createRecipe,
  updateRecipe,
  deleteRecipe,
  incrementRecipeViews,
  addRecipeComment,
  likeRecipe,

  // Comments
  updateComment,
  deleteComment,

  // Categories
  createCategory,
  updateCategory,
  deleteCategory,

  // Admin
  deleteAdminComment,
  deleteAdminRecipe,
  updateAdminUser,
  deleteAdminUser,

  // Upload
  uploadImage,

  // Liked Recipes
  addLikedRecipe,
  removeLikedRecipe,
};
