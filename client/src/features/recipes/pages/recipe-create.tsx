import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { RecipeForm } from "../components/recipe-form";
import { APP_ROUTES } from "@/utils/route";
import type { CreateRecipeRequestDto } from "@/api/schemas/recipe.schema";

export function RecipeCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateRecipeRequestDto) => mutations.createRecipe(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["list-recipes"] });
      // API returns { data: { message, data: { id, ... } } } via axios
      const responseData = response.data as { message?: string; data?: { id: number }; id?: number };
      const recipeId = responseData.data?.id ?? responseData.id ?? 0;
      navigate(APP_ROUTES.RECIPES.DETAIL(recipeId));
    },
  });

  const handleSubmit = (data: CreateRecipeRequestDto) => {
    mutation.mutate(data);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Typography variant="h1">Create Recipe</Typography>

      <RecipeForm
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        isSuccess={mutation.isSuccess}
        isError={mutation.isError}
        submitLabel="Create Recipe"
      />
    </div>
  );
}
