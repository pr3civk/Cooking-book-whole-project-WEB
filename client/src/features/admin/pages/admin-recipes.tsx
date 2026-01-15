import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminTable } from "../components/admin-table";
import { AdminPagination } from "../components/admin-pagination";
import { DeleteDialog } from "../components/delete-dialog";
import { AdminSort, type SortOption } from "../components/admin-sort";
import type { RecipeDto } from "@/api/schemas/recipe.schema";
import type { RecipeSortBy, SortOrder } from "@/api/schemas/admin.schema";
import { UtensilsCrossed, Trash2, Search } from "lucide-react";

const SORT_OPTIONS: SortOption<RecipeSortBy>[] = [
  { value: "title", label: "Title" },
  { value: "created_at", label: "Created date" },
  { value: "updated_at", label: "Updated date" },
  { value: "views_count", label: "Views" },
];

export function AdminRecipes() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort_by") as RecipeSortBy) || undefined;
  const sortOrder = (searchParams.get("sort_order") as SortOrder) || undefined;
  const per_page = 20;

  const { data, isLoading } = useQuery(
    queries.adminRecipes.list({ page, per_page, search: search || undefined, sort_by: sortBy, sort_order: sortOrder })
  );

  const recipes = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.last_page ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mutations.deleteAdminRecipe({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-admin-recipes"],
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

  const setSearch = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      return params;
    });
  };

  const handleSortChange = (newSortBy: RecipeSortBy | undefined, newSortOrder: SortOrder | undefined) => {
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
      accessor: "id" as keyof RecipeDto,
      className: "w-16",
    },
    {
      header: "Title",
      accessor: (row: RecipeDto) => (
        <span className="font-medium">{row.title}</span>
      ),
    },
    {
      header: "Views",
      accessor: "views_count" as keyof RecipeDto,
      className: "w-20",
    },
    {
      header: "Likes",
      accessor: "likes_count" as keyof RecipeDto,
      className: "w-20",
    },
    {
      header: "Created",
      accessor: (row: RecipeDto) => formatDate(row.created_at),
      className: "w-28",
    },
    {
      header: "",
      accessor: (row: RecipeDto) => (
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
        <Typography variant="h1">Recipes</Typography>
        <AdminSort
          options={SORT_OPTIONS}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <AdminTable
        columns={columns}
        data={recipes}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyIcon={<UtensilsCrossed className="h-10 w-10 text-muted-foreground" />}
        emptyTitle="No recipes"
        emptyDescription={search ? "No recipes match your search" : "No recipes have been created yet"}
      />

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe? All comments will also be deleted."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isPending={deleteMutation.isPending}
        isSuccess={deleteMutation.isSuccess}
        isError={deleteMutation.isError}
      />
    </div>
  );
}
