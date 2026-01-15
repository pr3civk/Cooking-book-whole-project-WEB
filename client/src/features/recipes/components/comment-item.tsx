import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutations, queries } from "@/api/queries";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { useSession } from "@/features/auth/session";
import type { RecipeCommentDto } from "@/api/schemas/recipe.schema";
import { CommentForm } from "./comment-form";
import { Pencil, Trash2, User } from "lucide-react";

type CommentItemProps = {
  comment: RecipeCommentDto;
};

export function CommentItem({ comment }: CommentItemProps) {
  const { user, isAdmin } = useSession();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const canModify = user?.id === comment.user?.id || isAdmin;

  const deleteComment = async () => {
    if (isAdmin && user?.id !== comment.user?.id) {
      return mutations.deleteAdminComment({ id: comment.id });
    }
    return mutations.deleteComment({ id: comment.id });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key[2] === "list-recipe-comments" &&
              Number(key[3]) === Number(comment.recipe_id)
            );
          },
        }),
        queryClient.invalidateQueries({
          queryKey: queries.recipes.detail({ id: comment.recipe_id }).queryKey,
        }),
      ]);
    },
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isEditing) {
    return (
      <CommentForm
        recipeId={comment.recipe_id}
        commentId={comment.id}
        initialContent={comment.content}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex gap-3 p-4 rounded-lg border">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <User className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography variant="titleSm">
              {comment.user?.name || "Anonymous"}
            </Typography>
            <Typography variant="standardXs" className="text-muted-foreground">
              {formatDate(comment.created_at)}
            </Typography>
          </div>

          {canModify && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                <StateContentSwap
                  isLoading={deleteMutation.isPending}
                  isSuccess={deleteMutation.isSuccess}
                  isError={deleteMutation.isError}
                >
                  <Trash2 className="h-4 w-4" />
                </StateContentSwap>
              </Button>
            </div>
          )}
        </div>

        <Typography variant="standard" className="whitespace-pre-wrap">
          {comment.content}
        </Typography>
      </div>
    </div>
  );
}
