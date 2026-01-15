import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { useSession } from "@/features/auth/session";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { MessageSquare } from "lucide-react";

type CommentListProps = {
  recipeId: number;
};

export function CommentList({ recipeId }: CommentListProps) {
  const { isAuthenticated } = useSession();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    ...queries.recipes.comments({ recipeId }, { page, limit }),
    enabled: !!recipeId,
  });

  const comments = data?.data?.data ?? [];
  const total = data?.data?.metadata?.pagination?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <Typography variant="titleLg">Comments ({total})</Typography>

      {isAuthenticated && (
        <CommentForm recipeId={recipeId} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      ) : comments.length === 0 ? (
        <Empty>
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
          <EmptyTitle>No comments yet</EmptyTitle>
          <EmptyDescription>
            {isAuthenticated
              ? "Be the first to leave a comment!"
              : "Sign in to leave a comment"}
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Typography variant="standardSm" className="flex items-center px-2">
                Page {page} of {totalPages}
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
