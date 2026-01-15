import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/utils/route";
import type { RecipeDto } from "@/api/schemas/recipe.schema";
import { Clock, Eye, Heart, Users, UtensilsCrossed } from "lucide-react";
import { normalizeImageUrl } from "@/utils/image";

type RecipeCardProps = {
  recipe: RecipeDto;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const difficultyColors = {
    easy: "bg-accent text-primary",
    medium: "bg-secondary/20 text-secondary",
    hard: "bg-destructive/20 text-destructive",
  };

  return (
    <Link to={APP_ROUTES.RECIPES.DETAIL(recipe.id)} className="group block h-full">
      <article className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:ring-primary/30">
        <div className="aspect-4/3 shrink-0 overflow-hidden bg-muted">
          {normalizeImageUrl(recipe.image || recipe.image_url) ? (
            <img
              src={normalizeImageUrl(recipe.image || recipe.image_url)}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>

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
          <h3 className="mb-2 line-clamp-1 font-serif text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="mb-4 line-clamp-2 shrink-0 text-sm leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
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
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {recipe.views_count}
              </span>
              <span className="flex items-center gap-1 text-destructive">
                <Heart className="h-3.5 w-3.5 fill-current" />
                {recipe.likes_count}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
