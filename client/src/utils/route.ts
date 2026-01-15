export type AppRoute = typeof APP_ROUTES;

export const APP_ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    LIKED_RECIPES: "/liked-recipes",
    SETTINGS: "/settings",
    RECIPES: {
        DETAIL: (id: number | string) => `/recipes/${id}`,
        CREATE: "/recipes/create",
        EDIT: (id: number | string) => `/recipes/${id}/edit`,
    },
    ADMIN: {
        DASHBOARD: "/admin",
        COMMENTS: "/admin/comments",
        RECIPES: "/admin/recipes",
        USERS: "/admin/users",
        USER_EDIT: (id: number | string) => `/admin/users/${id}/edit`,
        CATEGORIES: "/admin/categories",
    },
} as const;

export const API_ROUTES = {
    // Health
    HEALTH: "/api/health",

    // Upload
    UPLOAD: "/api/upload",

    // Auth
    AUTH: {
        LOGIN: "/api/login",
        LOGOUT: "/api/logout",
        REGISTER: "/api/register",
        USER: "/api/user",
        FORGOT_PASSWORD: "/api/forgot-password",
        RESET_PASSWORD: "/api/reset-password",
        CHANGE_PASSWORD: "/api/password",
    },

    // User - Liked Recipes
    USER: {
        LIKED_RECIPES: {
            LIST: "/api/user/liked-recipes",
            ADD: (recipeId: number | string) => `/api/user/liked-recipes/${recipeId}`,
            CHECK: (recipeId: number | string) => `/api/user/liked-recipes/${recipeId}`,
            REMOVE: (recipeId: number | string) => `/api/user/liked-recipes/${recipeId}`,
        },
    },

    // Recipes
    RECIPES: {
        LIST: "/api/recipes",
        CREATE: "/api/recipes",
        DETAIL: (id: number | string) => `/api/recipes/${id}`,
        UPDATE: (id: number | string) => `/api/recipes/${id}`,
        DELETE: (id: number | string) => `/api/recipes/${id}`,
        INCREMENT_VIEWS: (id: number | string) => `/api/recipes/${id}/increment-views`,
        COMMENTS: (recipeId: number | string) => `/api/recipes/${recipeId}/comments`,
        ADD_COMMENT: (recipeId: number | string) => `/api/recipes/${recipeId}/comments`,
        LIKE: (recipeId: number | string) => `/api/recipes/${recipeId}/like`,
        LIKES: (recipeId: number | string) => `/api/recipes/${recipeId}/likes`,
        IS_LIKED: (recipeId: number | string) => `/api/recipes/${recipeId}/is-liked`,
    },

    // Comments
    COMMENTS: {
        UPDATE: (id: number | string) => `/api/comments/${id}`,
        DELETE: (id: number | string) => `/api/comments/${id}`,
    },

    // Categories
    CATEGORIES: {
        LIST: "/api/categories",
        CREATE: "/api/categories",
        DETAIL: (id: number | string) => `/api/categories/${id}`,
        UPDATE: (id: number | string) => `/api/categories/${id}`,
        DELETE: (id: number | string) => `/api/categories/${id}`,
    },

    // Admin
    ADMIN: {
        COMMENTS: {
            LIST: "/api/admin/comments",
            DELETE: (id: number | string) => `/api/admin/comments/${id}`,
        },
        RECIPES: {
            LIST: "/api/admin/recipes",
            DELETE: (id: number | string) => `/api/admin/recipes/${id}`,
        },
        USERS: {
            LIST: "/api/admin/users",
            DETAIL: (id: number | string) => `/api/admin/users/${id}`,
            UPDATE: (id: number | string) => `/api/admin/users/${id}`,
            DELETE: (id: number | string) => `/api/admin/users/${id}`,
        },
    },
} as const;


export const OUTSIDE_LINKS = {
    GITHUB: "https://github.com/pr3civk",
} as const;