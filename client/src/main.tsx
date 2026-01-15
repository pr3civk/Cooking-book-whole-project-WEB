import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { APP_ROUTES } from "./utils/route";
import { AnimatedLayout } from "./features/layout";
import { QueryProvider } from "./features/providers/query-provider";
import { SessionProvider } from "./features/auth/session";
import { ProtectedRoute } from "./features/auth/protected-route";
import { AdminRoute } from "./features/auth/admin-route";
import { MainLayout } from "./features/layout/main-layout";
import { AuthLayout } from "./features/layout/auth-layout";
import { AdminLayout } from "./features/layout/admin-layout";
import { SignIn } from "./features/auth/pages/sign-in";
import { SignUp } from "./features/auth/pages/sign-up";
import { ForgotPassword } from "./features/auth/pages/forgot-password";
import { ResetPassword } from "./features/auth/pages/reset-password";
import { VerifyEmail } from "./features/auth/pages/verify-email";
import { RecipeList } from "./features/recipes/pages/recipe-list";
import { RecipeDetail } from "./features/recipes/pages/recipe-detail";
import { RecipeCreate } from "./features/recipes/pages/recipe-create";
import { RecipeEdit } from "./features/recipes/pages/recipe-edit";
import { LikedRecipes } from "./features/recipes/pages/liked-recipes";
import { Settings } from "./features/settings/pages/settings";
import { AdminComments } from "./features/admin/pages/admin-comments";
import { AdminRecipes } from "./features/admin/pages/admin-recipes";
import { AdminUsers } from "./features/admin/pages/admin-users";
import { AdminUserEdit } from "./features/admin/pages/admin-user-edit";
import { AdminCategories } from "./features/admin/pages/admin-categories";

const router = createBrowserRouter([
  {
    path: APP_ROUTES.SIGN_IN,
    element: (
      <AuthLayout>
        <SignIn />
      </AuthLayout>
    ),
  },
  {
    path: APP_ROUTES.SIGN_UP,
    element: (
      <AuthLayout>
        <SignUp />
      </AuthLayout>
    ),
  },
  {
    path: APP_ROUTES.FORGOT_PASSWORD,
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    path: APP_ROUTES.RESET_PASSWORD,
    element: (
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    ),
  },
  {
    path: APP_ROUTES.VERIFY_EMAIL,
    element: (
      <AuthLayout>
        <VerifyEmail />
      </AuthLayout>
    ),
  },
  {
    path: APP_ROUTES.HOME,
    element: (
      <MainLayout>
        <AnimatedLayout>
          <RecipeList />
        </AnimatedLayout>
      </MainLayout>
    ),
  },
  {
    path: "/recipes/:id",
    element: (
      <MainLayout>
        <AnimatedLayout>
          <RecipeDetail />
        </AnimatedLayout>
      </MainLayout>
    ),
  },
  {
    path: APP_ROUTES.RECIPES.CREATE,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AnimatedLayout>
            <RecipeCreate />
          </AnimatedLayout>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.LIKED_RECIPES,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AnimatedLayout>
            <LikedRecipes />
          </AnimatedLayout>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AnimatedLayout>
            <Settings />
          </AnimatedLayout>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipes/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AnimatedLayout>
            <RecipeEdit />
          </AnimatedLayout>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminComments /> },
      { path: "comments", element: <AdminComments /> },
      { path: "recipes", element: <AdminRecipes /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id/edit", element: <AdminUserEdit /> },
      { path: "categories", element: <AdminCategories /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
    <QueryProvider>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </QueryProvider>
);
