import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_ROUTES } from "../utils/route";
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
  UserResponseDto,
} from "./schemas/auth.schema";
import {
  type RecipeDto,
  type RecipeListResponseDto,
  type RecipeCommentsResponseDto,
  type CreateRecipeRequestDto,
  type UpdateRecipeRequestDto,
  type GetRecipesQueryParamsDto,
  type GetRecipeByIdParamsDto,
  type GetRecipeCommentsParamsDto,
  type GetRecipeCommentsQueryParamsDto,
  type AddCommentRequestDto,
  type AddCommentResponseDto,
  type LikeRecipeParamsDto,
  type LikeRecipeResponseDto,
  type GetRecipeLikesParamsDto,
  type GetRecipeLikesResponseDto,
  type IncrementRecipeViewsParamsDto,
  type IncrementRecipeViewsResponseDto,
  updateRecipeApiDto,
} from "./schemas/recipe.schema";
import type {
  UpdateCommentRequestDto,
  UpdateCommentResponseDto,
  DeleteCommentParamsDto,
  DeleteCommentResponseDto,
} from "./schemas/comment.schema";
import type {
  CategoryDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  GetCategoryByIdParamsDto,
  DeleteCategoryParamsDto,
  DeleteCategoryResponseDto,
  CategoriesListResponseDto,
} from "./schemas/category.schema";
import type {
  GetAdminCommentsQueryParamsDto,
  AdminCommentDto,
  DeleteAdminCommentParamsDto,
  DeleteAdminCommentResponseDto,
  GetAdminRecipesQueryParamsDto,
  DeleteAdminRecipeParamsDto,
  DeleteAdminRecipeResponseDto,
  GetAdminUsersQueryParamsDto,
  AdminUserDto,
  GetAdminUserByIdParamsDto,
  UpdateAdminUserRequestDto,
  UpdateAdminUserResponseDto,
  DeleteAdminUserParamsDto,
  DeleteAdminUserResponseDto,
  PaginationMeta,
} from "./schemas/admin.schema";
import type { HealthResponseDto } from "./schemas/health.schema";

const TOKEN_KEY = "auth_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url === API_ROUTES.AUTH.USER) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/api/auth/refresh");
        processQueue();
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAuthToken();
        if (!window.location.pathname.startsWith("/sign-")) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Health
export function fetchHealth(): Promise<{ data: HealthResponseDto }> {
  return apiClient.get(API_ROUTES.HEALTH);
}

// Auth
export function fetchLogin(
  data: LoginRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: LoginResponseDto }> {
  return apiClient.post(API_ROUTES.AUTH.LOGIN, data, config);
}

export function fetchLogout(
  config?: AxiosRequestConfig
): Promise<{ data: { message: string } }> {
  return apiClient.post(API_ROUTES.AUTH.LOGOUT, undefined, config);
}

export function fetchRegister(
  data: RegisterRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: RegisterResponseDto }> {
  return apiClient.post(API_ROUTES.AUTH.REGISTER, data, config);
}

export function fetchUser(
  config?: AxiosRequestConfig
): Promise<{ data: UserResponseDto }> {
  return apiClient.get(API_ROUTES.AUTH.USER, config);
}

export function fetchForgotPassword(
  data: ForgotPasswordRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: ForgotPasswordResponseDto }> {
  return apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, data, config);
}

export function fetchResetPassword(
  data: ResetPasswordRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: ResetPasswordResponseDto }> {
  return apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, data, config);
}

export function fetchChangePassword(
  data: ChangePasswordRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: ChangePasswordResponseDto }> {
  return apiClient.put(API_ROUTES.AUTH.CHANGE_PASSWORD, data, config);
}

// Recipes
export function fetchRecipes(
  params?: GetRecipesQueryParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: RecipeListResponseDto }> {
  return apiClient.get(API_ROUTES.RECIPES.LIST, { ...config, params });
}

export function fetchRecipeById(
  params: GetRecipeByIdParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { data: RecipeDto } }> {
  return apiClient.get(API_ROUTES.RECIPES.DETAIL(params.id), config);
}

export function createRecipe(
  data: CreateRecipeRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: RecipeDto }> {
  const apiData = {
    title: data.title,
    description: data.description,
    ingredients: data.ingredients,
    instructions: data.instructions.join("\n"),
    cooking_time: data.cookTime,
    servings: data.servings,
    difficulty: data.difficulty,
    image_url: data.imageUrl,
    category_id: data.categoryId,
  };
  return apiClient.post(API_ROUTES.RECIPES.CREATE, apiData, config);
}

export function updateRecipe(
  params: GetRecipeByIdParamsDto,
  data: UpdateRecipeRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: RecipeDto }> {
  const apiData = updateRecipeApiDto.parse(data);
  return apiClient.put(API_ROUTES.RECIPES.UPDATE(params.id), apiData, config);
}

export function deleteRecipe(
  params: GetRecipeByIdParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { message: string } }> {
  return apiClient.delete(API_ROUTES.RECIPES.DELETE(params.id), config);
}

export function incrementRecipeViews(
  params: IncrementRecipeViewsParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: IncrementRecipeViewsResponseDto }> {
  return apiClient.post(API_ROUTES.RECIPES.INCREMENT_VIEWS(params.id), undefined, config);
}

export function fetchRecipeComments(
  params: GetRecipeCommentsParamsDto,
  queryParams?: GetRecipeCommentsQueryParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: RecipeCommentsResponseDto }> {
  return apiClient.get(API_ROUTES.RECIPES.COMMENTS(params.recipeId), {
    ...config,
    params: queryParams,
  });
}

export function addRecipeComment(
  params: GetRecipeCommentsParamsDto,
  data: AddCommentRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: AddCommentResponseDto }> {
  return apiClient.post(API_ROUTES.RECIPES.ADD_COMMENT(params.recipeId), data, config);
}

export function likeRecipe(
  params: LikeRecipeParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: LikeRecipeResponseDto }> {
  return apiClient.post(API_ROUTES.RECIPES.LIKE(params.recipeId), undefined, config);
}

export function fetchRecipeLikes(
  params: GetRecipeLikesParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: GetRecipeLikesResponseDto }> {
  return apiClient.get(API_ROUTES.RECIPES.LIKES(params.recipeId), config);
}

export function fetchRecipeIsLiked(
  params: GetRecipeLikesParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { is_liked: boolean } }> {
  return apiClient.get(API_ROUTES.USER.LIKED_RECIPES.CHECK(params.recipeId), config);
}

// Comments
export function updateComment(
  params: DeleteCommentParamsDto,
  data: UpdateCommentRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: UpdateCommentResponseDto }> {
  return apiClient.put(API_ROUTES.COMMENTS.UPDATE(params.id), data, config);
}

export function deleteComment(
  params: DeleteCommentParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: DeleteCommentResponseDto }> {
  return apiClient.delete(API_ROUTES.COMMENTS.DELETE(params.id), config);
}

// Categories
export function fetchCategories(
  config?: AxiosRequestConfig
): Promise<{ data: CategoriesListResponseDto }> {
  return apiClient.get(API_ROUTES.CATEGORIES.LIST, config);
}

export function fetchCategoryById(
  params: GetCategoryByIdParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: CategoryDto }> {
  return apiClient.get(API_ROUTES.CATEGORIES.DETAIL(params.id), config);
}

export function createCategory(
  data: CreateCategoryRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: CategoryDto }> {
  return apiClient.post(API_ROUTES.CATEGORIES.CREATE, data, config);
}

export function updateCategory(
  params: GetCategoryByIdParamsDto,
  data: UpdateCategoryRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: CategoryDto }> {
  return apiClient.put(API_ROUTES.CATEGORIES.UPDATE(params.id), data, config);
}

export function deleteCategory(
  params: DeleteCategoryParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: DeleteCategoryResponseDto }> {
  return apiClient.delete(API_ROUTES.CATEGORIES.DELETE(params.id), config);
}

// Admin - Comments
export function fetchAdminComments(
  params?: GetAdminCommentsQueryParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { data: AdminCommentDto[]; pagination: PaginationMeta } }> {
  return apiClient.get(API_ROUTES.ADMIN.COMMENTS.LIST, { ...config, params });
}

export function deleteAdminComment(
  params: DeleteAdminCommentParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: DeleteAdminCommentResponseDto }> {
  return apiClient.delete(API_ROUTES.ADMIN.COMMENTS.DELETE(params.id), config);
}

// Admin - Recipes
export function fetchAdminRecipes(
  params?: GetAdminRecipesQueryParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { data: RecipeDto[]; pagination: PaginationMeta } }> {
  return apiClient.get(API_ROUTES.ADMIN.RECIPES.LIST, { ...config, params });
}

export function deleteAdminRecipe(
  params: DeleteAdminRecipeParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: DeleteAdminRecipeResponseDto }> {
  return apiClient.delete(API_ROUTES.ADMIN.RECIPES.DELETE(params.id), config);
}

// Admin - Users
export function fetchAdminUsers(
  params?: GetAdminUsersQueryParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { data: AdminUserDto[]; pagination: PaginationMeta } }> {
  return apiClient.get(API_ROUTES.ADMIN.USERS.LIST, { ...config, params });
}

export function fetchAdminUserById(
  params: GetAdminUserByIdParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: { data: AdminUserDto } }> {
  return apiClient.get(API_ROUTES.ADMIN.USERS.DETAIL(params.id), config);
}

export function updateAdminUser(
  params: GetAdminUserByIdParamsDto,
  data: UpdateAdminUserRequestDto,
  config?: AxiosRequestConfig
): Promise<{ data: UpdateAdminUserResponseDto }> {
  return apiClient.put(API_ROUTES.ADMIN.USERS.UPDATE(params.id), data, config);
}

export function deleteAdminUser(
  params: DeleteAdminUserParamsDto,
  config?: AxiosRequestConfig
): Promise<{ data: DeleteAdminUserResponseDto }> {
  return apiClient.delete(API_ROUTES.ADMIN.USERS.DELETE(params.id), config);
}

export function uploadImage(
  file: File,
  config?: AxiosRequestConfig
): Promise<{ data: { url: string } }> {
  const formData = new FormData();
  formData.append("image", file);
  return apiClient.post(API_ROUTES.UPLOAD, formData, {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": undefined, 
    },
  });
}

// User - Liked Recipes
export function fetchLikedRecipes(
  params?: { page?: number; per_page?: number },
  config?: AxiosRequestConfig
): Promise<{ data: RecipeListResponseDto }> {
  return apiClient.get(API_ROUTES.USER.LIKED_RECIPES.LIST, { ...config, params });
}

export function addLikedRecipe(
  recipeId: number,
  config?: AxiosRequestConfig
): Promise<{ data: { message: string; is_liked: boolean; likes_count: number } }> {
  return apiClient.post(API_ROUTES.USER.LIKED_RECIPES.ADD(recipeId), undefined, config);
}

export function removeLikedRecipe(
  recipeId: number,
  config?: AxiosRequestConfig
): Promise<{ data: { message: string; is_liked: boolean; likes_count: number } }> {
  return apiClient.delete(API_ROUTES.USER.LIKED_RECIPES.REMOVE(recipeId), config);
}
