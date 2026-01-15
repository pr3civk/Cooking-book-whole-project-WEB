import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutations, queries } from "@/api/queries";
import {
  addCommentRequestDto,
  type AddCommentRequestDto,
} from "@/api/schemas/recipe.schema";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";

type CommentFormProps = {
  recipeId: number;
  commentId?: number;
  initialContent?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function CommentForm({
  recipeId,
  commentId,
  initialContent = "",
  onCancel,
  onSuccess,
}: CommentFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!commentId;

  const form = useForm<AddCommentRequestDto>({
    resolver: zodResolver(addCommentRequestDto),
    defaultValues: { content: initialContent },
  });

  const invalidateComments = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["list-recipe-comments", recipeId],
    });
    await queryClient.invalidateQueries({
      queryKey: queries.recipes.detail({ id: recipeId }).queryKey,
    });
  };

  const addMutation = useMutation({
    mutationFn: (data: AddCommentRequestDto) => {
      if (!recipeId || isNaN(recipeId)) {
        throw new Error("Invalid recipe ID");
      }
      return mutations.addRecipeComment({ recipeId }, data);
    },
    onSuccess: async () => {
      await invalidateComments();
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AddCommentRequestDto) =>
      mutations.updateComment({ id: commentId! }, data),
    onSuccess: async () => {
      await invalidateComments();
      onSuccess?.();
    },
  });

  const mutation = isEditing ? updateMutation : addMutation;

  async function handleSubmit(data: AddCommentRequestDto) {
    if (isEditing) {
      await updateMutation.mutateAsync(data);
    } else {
      await addMutation.mutateAsync(data);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={isEditing ? "Edit comment..." : "Add a comment..."}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">
            {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              "Failed to save comment. Please try again."}
          </p>
        )}

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={mutation.isPending || !recipeId || isNaN(recipeId)}>
            <StateContentSwap
              isLoading={mutation.isPending}
              isSuccess={mutation.isSuccess}
              isError={mutation.isError}
            >
              {isEditing ? "Update" : "Post Comment"}
            </StateContentSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
