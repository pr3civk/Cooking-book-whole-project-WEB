import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mutations, queries } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { useSession } from "@/features/auth/session";
import { Heart } from "lucide-react";
import { cn } from "@/utils/tailwind";

type LikeButtonProps = {
  recipeId: number;
  likesCount?: number;
};

export function LikeButton({ recipeId, likesCount = 0 }: LikeButtonProps) {
  const { isAuthenticated } = useSession();
  const queryClient = useQueryClient();

  const { data: likedData } = useQuery({
    ...queries.recipes.isLiked({ recipeId }),
    enabled: isAuthenticated && !!recipeId,
  });

  const isLiked = likedData?.data?.is_liked ?? false;

  const mutation = useMutation({
    mutationFn: () => mutations.likeRecipe({ recipeId }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queries.recipes.isLiked({ recipeId }).queryKey,
      });

      const previousData = queryClient.getQueryData<{ data: { is_liked: boolean } }>(
        queries.recipes.isLiked({ recipeId }).queryKey
      );

      const isLikedQueryKey = queries.recipes.isLiked({ recipeId }).queryKey;
      queryClient.setQueryData<{ data: { is_liked: boolean } }>(
        isLikedQueryKey,
        (old) => {
          const currentIsLiked = old?.data?.is_liked ?? false;
          return {
            data: { is_liked: !currentIsLiked },
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          queries.recipes.isLiked({ recipeId }).queryKey,
          context.previousData
        );
      }
    },
    onSuccess: (response) => {
      const isLikedQueryKey = queries.recipes.isLiked({ recipeId }).queryKey;
      queryClient.setQueryData(isLikedQueryKey, {
        data: { is_liked: response.data.is_liked },
      });
      queryClient.invalidateQueries({
        queryKey: queries.recipes.detail({ id: recipeId }).queryKey,
      });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === "list-liked-recipes";
        },
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Heart className="mr-1 h-4 w-4" />
        {likesCount}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={cn(
        isLiked && "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
      )}
    >
      <StateContentSwap
        classNames={{
          content: "flex items-center justify-center",
        }}
        isLoading={mutation.isPending}
        isSuccess={false}
        isError={mutation.isError}
      >
        <Heart
          className={cn(
            "mr-1 size-4",
            isLiked && "fill-red-500 text-red-500"
          )}
        />
        {likesCount}
      </StateContentSwap>
    </Button>
  );
}
