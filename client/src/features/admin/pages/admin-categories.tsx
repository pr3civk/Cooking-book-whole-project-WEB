import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queries, mutations } from "@/api/queries";
import {
  createCategoryRequestDto,
  type CreateCategoryRequestDto,
  type CategoryDto,
} from "@/api/schemas/category.schema";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { AdminTable } from "../components/admin-table";
import { DeleteDialog } from "../components/delete-dialog";
import { FolderTree, Plus, Pencil, Trash2 } from "lucide-react";

export function AdminCategories() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery(queries.categories.all);
  const categories = Array.isArray(data?.data?.data) ? data?.data?.data : [];

  const form = useForm<CreateCategoryRequestDto>({
    resolver: zodResolver(createCategoryRequestDto),
    defaultValues: { name: "", description: "" },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryRequestDto) => mutations.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreating(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateCategoryRequestDto) =>
      mutations.updateCategory({ id: editingCategory!.id }, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mutations.deleteCategory({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteId(null);
    },
  });

  const handleOpenCreate = () => {
    form.reset({ name: "", description: "" });
    setIsCreating(true);
  };

  const handleOpenEdit = (category: CategoryDto) => {
    form.reset({ name: category.name, description: category.description || "" });
    setEditingCategory(category);
  };

  const handleSubmit = (data: CreateCategoryRequestDto) => {
    if (editingCategory) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const mutation = editingCategory ? updateMutation : createMutation;

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof CategoryDto,
      className: "w-16",
    },
    {
      header: "Name",
      accessor: (row: CategoryDto) => (
        <span className="font-medium">{row.name}</span>
      ),
      className: "w-40",
    },
    {
      header: "Description",
      accessor: (row: CategoryDto) => (
        <span className="line-clamp-1 text-muted-foreground">
          {row.description || "-"}
        </span>
      ),
    },
    {
      header: "",
      accessor: (row: CategoryDto) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteId(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1">Categories</Typography>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={categories ?? []}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyIcon={<FolderTree className="h-10 w-10 text-muted-foreground" />}
        emptyTitle="No categories"
        emptyDescription="Create your first category to organize recipes"
      />

      <Dialog
        open={isCreating || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setEditingCategory(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  <StateContentSwap
                    isLoading={mutation.isPending}
                    isSuccess={mutation.isSuccess}
                    isError={mutation.isError}
                  >
                    {editingCategory ? "Update" : "Create"}
                  </StateContentSwap>
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? Recipes in this category will become uncategorized."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isPending={deleteMutation.isPending}
        isSuccess={deleteMutation.isSuccess}
        isError={deleteMutation.isError}
      />
    </div>
  );
}
