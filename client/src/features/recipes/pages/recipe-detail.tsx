import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { useSession } from "@/features/auth/session";
import { LikeButton } from "../components/like-button";
import { CommentList } from "../components/comment-list";
import { APP_ROUTES } from "@/utils/route";
import { normalizeImageUrl } from "@/utils/image";
import { Clock, Users, Eye, Pencil, Trash2, User } from "lucide-react";

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useSession();

  const recipeId = Number(id ?? -1);
  const isValidId = recipeId !== undefined && !isNaN(recipeId);

  const { data, isLoading } = useQuery({
    ...queries.recipes.detail({ id: recipeId! }),
    enabled: isValidId,
  });


  const recipe = data?.data.data ?? null;

  const incrementViewsMutation = useMutation({
    mutationFn: () => mutations.incrementRecipeViews({ id: recipeId }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queries.recipes.detail({ id: recipeId }).queryKey }),
        queryClient.invalidateQueries({ queryKey: ["list-recipes"] }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => mutations.deleteRecipe({ id: recipeId ?? -1 }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queries.recipes.detail({ id: recipeId }).queryKey }),
        queryClient.invalidateQueries({ queryKey: ["list-recipes"] }),
      ]);
      navigate(APP_ROUTES.HOME);
    },
  });

  useEffect(() => {
    if (isValidId && recipeId) {
      incrementViewsMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidId, recipeId]);

  if (!isValidId) {
    return (
      <div className="text-center py-12">
        <Typography variant="h2">Invalid recipe ID</Typography>
        <Button asChild className="mt-4">
          <Link to={APP_ROUTES.HOME}>Back to Recipes</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!recipe || !recipe.id) {
    return (
      <div className="text-center py-12">
        <Typography variant="h2">Recipe not found</Typography>
        <Button asChild className="mt-4">
          <Link to={APP_ROUTES.HOME}>Back to Recipes</Link>
        </Button>
      </div>
    );
  }

  const canModify = user?.id === recipe.user?.id || isAdmin;
  const totalTime = recipe.cooking_time || 0;

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={APP_ROUTES.HOME}>Recipes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{recipe.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {normalizeImageUrl(recipe.image || recipe.image_url) && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <img
            src={normalizeImageUrl(recipe.image || recipe.image_url)}
            alt={recipe.title}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Hide image on error
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Typography variant="h1">{recipe.title}</Typography>
          {canModify && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={APP_ROUTES.RECIPES.EDIT(recipe.id)}>
                  <Pencil className="mr-1 size-4" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                <StateContentSwap
                classNames={{
                  content: "flex items-center justify-center",
                }}
                  isLoading={deleteMutation.isPending}
                  isSuccess={deleteMutation.isSuccess}
                  isError={deleteMutation.isError}
                >
                  <Trash2 className="mr-1 size-4" />
                  Delete
                </StateContentSwap>
              </Button>
            </div>
          )}
        </div>

        {recipe.description && (
          <Typography variant="standard" className="text-muted-foreground">
            {recipe.description}
          </Typography>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {recipe.difficulty && (
            <Badge variant="secondary" className="capitalize">
              {recipe.difficulty}
            </Badge>
          )}

          {recipe.user && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="size-4" />
              {recipe.user.name}
            </span>
          )}

          {totalTime > 0 && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              {totalTime} min
            </span>
          )}

          {recipe.servings && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="size-4" />
              {recipe.servings} servings
            </span>
          )}

          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="size-4" />
            {recipe.views_count} views
          </span>

          <LikeButton recipeId={recipe.id} likesCount={recipe.likes_count} />
        </div>
      </div>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          <Typography variant="titleLg">Ingredients</Typography>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ingredient: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <Typography variant="standard">{ingredient}</Typography>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Typography variant="titleLg">Instructions</Typography>
          <ol className="space-y-4">
            {(() => {
              const instructions: string[] = Array.isArray(recipe.instructions)
                ? recipe.instructions
                : typeof recipe.instructions === "string"
                ? recipe.instructions.split("\n").filter((line: string) => line.trim())
                : [];
              
              return instructions.map((instruction: string, i: number) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {i + 1}
                  </span>
                  <Typography variant="standard" className="pt-0.5">
                    {instruction}
                  </Typography>
                </li>
              ));
            })()}
          </ol>
        </div>
      </div>

      <Separator />

      {recipe.id && <CommentList recipeId={recipe.id} />}
    </div>
  );
}
