import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { AdminTable } from "../components/admin-table";
import { AdminPagination } from "../components/admin-pagination";
import { DeleteDialog } from "../components/delete-dialog";
import { AdminSort, type SortOption } from "../components/admin-sort";
import type { AdminCommentDto, CommentSortBy, SortOrder } from "@/api/schemas/admin.schema";
import { MessageSquare, Trash2 } from "lucide-react";

const SORT_OPTIONS: SortOption<CommentSortBy>[] = [
  { value: "created_at", label: "Created date" },
  { value: "updated_at", label: "Updated date" },
];

export function AdminComments() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const sortBy = (searchParams.get("sort_by") as CommentSortBy) || undefined;
  const sortOrder = (searchParams.get("sort_order") as SortOrder) || undefined;
  const per_page = 20;

  const { data, isLoading } = useQuery(
    queries.adminComments.list({ page, per_page, sort_by: sortBy, sort_order: sortOrder })
  );

  const comments = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.last_page ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mutations.deleteAdminComment({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-admin-comments"],
      });
      setDeleteId(null);
    },
  });

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(p));
      return params;
    });
  };

  const handleSortChange = (newSortBy: CommentSortBy | undefined, newSortOrder: SortOrder | undefined) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (newSortBy) {
        params.set("sort_by", newSortBy);
        params.set("sort_order", newSortOrder || "desc");
      } else {
        params.delete("sort_by");
        params.delete("sort_order");
      }
      params.delete("page");
      return params;
    });
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof AdminCommentDto,
      className: "w-16",
    },
    {
      header: "Content",
      accessor: (row: AdminCommentDto) => (
        <span className="line-clamp-2">{row.content}</span>
      ),
    },
    {
      header: "Recipe",
      accessor: (row: AdminCommentDto) => row.recipe_title || `#${row.recipe_id}`,
      className: "w-40",
    },
    {
      header: "Author",
      accessor: (row: AdminCommentDto) => row.user_name || `User #${row.user_id}`,
      className: "w-32",
    },
    {
      header: "Date",
      accessor: (row: AdminCommentDto) => formatDate(row.created_at),
      className: "w-28",
    },
    {
      header: "",
      accessor: (row: AdminCommentDto) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setDeleteId(row.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
      className: "w-12",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1">Comments</Typography>
        <AdminSort
          options={SORT_OPTIONS}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <AdminTable
        columns={columns}
        data={comments}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyIcon={<MessageSquare className="h-10 w-10 text-muted-foreground" />}
        emptyTitle="No comments"
        emptyDescription="No comments have been posted yet"
      />

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Comment"
        description="Are you sure you want to delete this comment?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isPending={deleteMutation.isPending}
        isSuccess={deleteMutation.isSuccess}
        isError={deleteMutation.isError}
      />
    </div>
  );
}
