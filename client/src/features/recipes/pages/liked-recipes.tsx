import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { queries, mutations } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Typography } from "@/components/ui/typography";
import { APP_ROUTES } from "@/utils/route";
import { normalizeImageUrl } from "@/utils/image";
import type { RecipeDto } from "@/api/schemas/recipe.schema";
import {
  Heart,
  HeartOff,
  Clock,
  Users,
  Eye,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function LikedRecipes() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading } = useQuery({
    ...queries.likedRecipes.list({ page, per_page: perPage }),
  });

  const recipes = data?.data?.data ?? [];
  const pagination = data?.data?.metadata?.pagination;
  const total = pagination?.total ?? 0;
  const currentPage = pagination?.current_page ?? 1;
  const totalPages = pagination?.last_page ?? 1;

  const removeMutation = useMutation({
    mutationFn: (recipeId: number) => mutations.removeLikedRecipe(recipeId),
    onSuccess: (_data, recipeId) => {
      // Invalidate liked recipes list
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === "list-liked-recipes";
        },
      });
      // Invalidate isLiked status for this recipe
      queryClient.invalidateQueries({
        queryKey: queries.recipes.isLiked({ recipeId }).queryKey,
      });
      // Invalidate recipe detail
      queryClient.invalidateQueries({
        queryKey: queries.recipes.detail({ id: recipeId }).queryKey,
      });
    },
  });

  const difficultyColors = {
    easy: "bg-accent text-primary",
    medium: "bg-secondary/20 text-secondary",
    hard: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1">Liked Recipes</Typography>
          <Typography variant="standard" className="mt-1 text-muted-foreground">
            {total} {total === 1 ? "recipe" : "recipes"} you've liked
          </Typography>
        </div>
        <Button variant="outline" asChild>
          <Link to={APP_ROUTES.HOME}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-10 w-10 text-primary" />
          <Typography variant="standard" className="mt-4 text-muted-foreground">
            Loading your liked recipes...
          </Typography>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <Typography variant="h3" className="mt-4">
            No liked recipes yet
          </Typography>
          <Typography variant="standard" className="mt-2 max-w-sm text-center text-muted-foreground">
            Start exploring recipes and click the heart icon to save your favorites here!
          </Typography>
          <Button className="mt-6 rounded-full" variant="outline" asChild>
            <Link to={APP_ROUTES.HOME}>Browse Recipes</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe: RecipeDto, index: number) => (
              <div
                key={recipe.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
              >
                <article className="group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:ring-primary/30">
                  <Link to={APP_ROUTES.RECIPES.DETAIL(recipe.id)} className="block">
                    <div className="aspect-4/3 shrink-0 overflow-hidden bg-muted">
                      {normalizeImageUrl(recipe.image || recipe.image_url) ? (
                        <img
                          src={normalizeImageUrl(recipe.image || recipe.image_url)}
                          alt={recipe.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {recipe.difficulty && (
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium capitalize backdrop-blur-sm ${
                        difficultyColors[recipe.difficulty as keyof typeof difficultyColors] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {recipe.difficulty}
                    </span>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <Link to={APP_ROUTES.RECIPES.DETAIL(recipe.id)}>
                      <Typography variant="titleBase" className="mb-2 line-clamp-1 transition-colors group-hover:text-primary">
                        {recipe.title}
                      </Typography>
                    </Link>

                    {recipe.description && (
                      <Typography variant="standardSm" className="mb-4 line-clamp-2 text-muted-foreground">
                        {recipe.description}
                      </Typography>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {recipe.cooking_time && recipe.cooking_time > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {recipe.cooking_time}m
                          </span>
                        )}
                        {recipe.servings && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {recipe.servings}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {recipe.views_count}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeMutation.mutate(recipe.id)}
                        disabled={removeMutation.isPending}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Remove from liked"
                      >
                        {removeMutation.isPending &&
                        removeMutation.variables === recipe.id ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <HeartOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setPage(pageNum)}
                      className={`h-10 w-10 rounded-full ${
                        currentPage === pageNum ? "bg-primary hover:bg-primary/90" : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
