import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { fetchRecipes } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RecipeCard } from "../components/recipe-card";
import { RecipeFilters } from "../components/recipe-filters";
import { useRecipeFilters } from "../hooks/use-recipe-filters";
import { UtensilsCrossed, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/utils/route";
import { useSession } from "@/features/auth/session";
import { useMemo } from "react";

export function RecipeList() {
  const { filters, searchInput, setCategory, setSortBy, setPage } =
    useRecipeFilters();
  const { isAuthenticated } = useSession();

  const sortByMap: Record<string, string> = {
    createdAt: "created_at",
    views: "views_count",
    likes: "likes_count",
    title: "title",
  };

  const queryParams = useMemo(
    () => ({
      page: filters.page,
      limit: 12,
      category_id:
        filters.categoryId !== "all" ? Number(filters.categoryId) : undefined,
      search: filters.search || undefined,
      sort_by: sortByMap[filters.sortBy] || "created_at",
      sort_order: (filters.sortBy === "title" ? "asc" : "desc") as "asc" | "desc",
    }),
    [filters.page, filters.categoryId, filters.search, filters.sortBy]
  );

  const { data, isLoading } = useQuery({
    ...queries.recipes.list(queryParams),
    queryFn: () => fetchRecipes(queryParams),
    staleTime: 30000,
  });

  const recipes = data?.data.data ?? [];
  const pagination = data?.data.metadata.pagination;
  const total = pagination?.total ?? 0;
  const currentPage = pagination?.current_page ?? 1;
  const totalPages = pagination?.last_page ?? 1;

  return (
    <div className="space-y-12">
      <section className="relative -mx-4 -mt-6 overflow-hidden rounded-b-[2.5rem] bg-card px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAyYy00LjQxOCAwLTgtMy41ODItOC04czMuNTgyLTggOC04IDggMy41ODIgOCA4LTMuNTgyIDgtOCA4eiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] text-primary opacity-60" />

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/60 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Discover delicious recipes
          </div>

          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            What will you{" "}
            <span className="relative">
              <span className="relative z-10 text-primary">
                cook
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/50 -rotate-1" />
            </span>
            {" "}today?
          </h1>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Explore our collection of homemade recipes, from quick weeknight dinners to show-stopping desserts.
          </p>

          {isAuthenticated && (
            <div className="mt-8">
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 font-medium shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                asChild
              >
                <Link to={APP_ROUTES.RECIPES.CREATE}>
                  Share Your Recipe
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              All Recipes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {total} {total === 1 ? "recipe" : "recipes"} to explore
              {pagination && (
                <span className="ml-2">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </p>
          </div>
        </div>

        <RecipeFilters
          searchInput={searchInput}
          categoryId={filters.categoryId}
          sortBy={filters.sortBy}
          onCategoryChange={setCategory}
          onSortChange={setSortBy}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner className="h-10 w-10 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
              No recipes found
            </h3>
            <p className="mt-2 max-w-sm text-center text-muted-foreground">
              {filters.search || filters.categoryId !== "all"
                ? "Try adjusting your filters to find what you're looking for"
                : "Be the first to share a delicious recipe with the community!"}
            </p>
            {isAuthenticated && (
              <Button
                className="mt-6 rounded-full"
                variant="outline"
                asChild
              >
                <Link to={APP_ROUTES.RECIPES.CREATE}>Create a Recipe</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe: typeof recipes[0], index: number) => (
                <div
                  key={recipe.id}
                  className="h-full animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (currentPage > 1) {
                      setPage(currentPage - 1);
                    }
                  }}
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
                        onClick={() => {
                          if (currentPage !== pageNum) {
                            setPage(pageNum);
                          }
                        }}
                        className={`h-10 w-10 rounded-full ${
                          currentPage === pageNum
                            ? "bg-primary hover:bg-primary/90"
                            : ""
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
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage >= totalPages}
                  className="rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
