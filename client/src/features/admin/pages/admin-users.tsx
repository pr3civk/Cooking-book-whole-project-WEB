import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminTable } from "../components/admin-table";
import { AdminPagination } from "../components/admin-pagination";
import { DeleteDialog } from "../components/delete-dialog";
import { AdminSort, type SortOption } from "../components/admin-sort";
import { APP_ROUTES } from "@/utils/route";
import type { AdminUserDto, UserSortBy, SortOrder } from "@/api/schemas/admin.schema";
import { Users, Trash2, Pencil, Search } from "lucide-react";

const SORT_OPTIONS: SortOption<UserSortBy>[] = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "created_at", label: "Joined date" },
  { value: "recipes_count", label: "Recipes count" },
  { value: "comments_count", label: "Comments count" },
];

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sort_by") as UserSortBy) || undefined;
  const sortOrder = (searchParams.get("sort_order") as SortOrder) || undefined;
  const isAdminFilter = searchParams.get("is_admin");
  const per_page = 20;

  const { data, isLoading } = useQuery(
    queries.adminUsers.list({
      page,
      per_page,
      search: search || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      is_admin: isAdminFilter === "true" ? true : isAdminFilter === "false" ? false : undefined,
    })
  );

  const users = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.last_page ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mutations.deleteAdminUser({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-admin-users"],
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

  const handleSortChange = (newSortBy: UserSortBy | undefined, newSortOrder: SortOrder | undefined) => {
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

  const handleRoleFilterChange = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value && value !== "all") {
        params.set("is_admin", value);
      } else {
        params.delete("is_admin");
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
      accessor: "id" as keyof AdminUserDto,
      className: "w-16",
    },
    {
      header: "Email",
      accessor: (row: AdminUserDto) => (
        <span className="font-medium">{row.email}</span>
      ),
    },
    {
      header: "Name",
      accessor: (row: AdminUserDto) => row.name || "-",
      className: "w-32",
    },
    {
      header: "Role",
      accessor: (row: AdminUserDto) => (
        <Badge variant={row.is_admin ? "default" : "secondary"}>
          {row.is_admin ? "admin" : "user"}
        </Badge>
      ),
      className: "w-24",
    },
    {
      header: "Joined",
      accessor: (row: AdminUserDto) => formatDate(row.created_at),
      className: "w-28",
    },
    {
      header: "",
      accessor: (row: AdminUserDto) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to={APP_ROUTES.ADMIN.USER_EDIT(row.id)}>
              <Pencil className="h-4 w-4" />
            </Link>
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
        <Typography variant="h1">Users</Typography>
        <AdminSort
          options={SORT_OPTIONS}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={isAdminFilter || "all"} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="true">Admins only</SelectItem>
            <SelectItem value="false">Users only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyIcon={<Users className="h-10 w-10 text-muted-foreground" />}
        emptyTitle="No users"
        emptyDescription={search ? "No users match your search" : "No users registered yet"}
      />

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? All their recipes and comments will also be deleted."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isPending={deleteMutation.isPending}
        isSuccess={deleteMutation.isSuccess}
        isError={deleteMutation.isError}
      />
    </div>
  );
}
