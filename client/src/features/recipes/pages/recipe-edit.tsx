import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/features/auth/session";
import { RecipeForm } from "../components/recipe-form";
import { APP_ROUTES } from "@/utils/route";
import type { CreateRecipeRequestDto } from "@/api/schemas/recipe.schema";

export function RecipeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, isLoading: sessionLoading } = useSession();

  const { data, isLoading } = useQuery(
    queries.recipes.detail({ id: Number(id) })
  );

  // Handle both { data: RecipeDto } and { data: { data: RecipeDto } } API responses
  const rawData = data?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipe = (rawData as any)?.id ? rawData : (rawData as any)?.data;

  const mutation = useMutation({
    mutationFn: (formData: CreateRecipeRequestDto) =>
      mutations.updateRecipe({ id: Number(id) }, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.recipes.detail({ id: Number(id) }).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: ["list-recipes"] });
      navigate(APP_ROUTES.RECIPES.DETAIL(Number(id)));
    },
  });

  if (isLoading || sessionLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!recipe) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const canEdit = user?.id === recipe.user?.id || isAdmin;

  if (!canEdit) {
    return <Navigate to={APP_ROUTES.RECIPES.DETAIL(Number(id))} replace />;
  }

  const handleSubmit = (data: CreateRecipeRequestDto) => {
    mutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Typography variant="h1">Edit Recipe</Typography>

      <RecipeForm
        defaultValues={{
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: Array.isArray(recipe.instructions)
            ? recipe.instructions
            : typeof recipe.instructions === "string"
              ? recipe.instructions.split("\n").filter((s: string) => s.trim())
              : [],
          cookTime: recipe.cooking_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          imageUrl: recipe.image || recipe.image_url || undefined,
          categoryId: recipe.category?.id,
        }}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        isSuccess={mutation.isSuccess}
        isError={mutation.isError}
        submitLabel="Update Recipe"
      />
    </div>
  );
}
