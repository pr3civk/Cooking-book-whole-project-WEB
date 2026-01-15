import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queries, mutations } from "@/api/queries";
import {
  updateAdminUserRequestDto,
  type UpdateAdminUserRequestDto,
} from "@/api/schemas/admin.schema";
import { Typography } from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { APP_ROUTES } from "@/utils/route";

export function AdminUserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    queries.adminUsers.detail({ id: Number(id) })
  );

  const user = data?.data?.data;

  const form = useForm<UpdateAdminUserRequestDto>({
    resolver: zodResolver(updateAdminUserRequestDto),
    values: {
      name: user?.name || "",
      is_admin: user?.is_admin,
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: UpdateAdminUserRequestDto) =>
      mutations.updateAdminUser({ id: Number(id) }, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.adminUsers.detail({ id: Number(id) }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["list-admin-users"],
      });
      navigate(APP_ROUTES.ADMIN.USERS);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.ADMIN.USERS} replace />;
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Typography variant="h1">Edit User</Typography>

      <div className="rounded-lg border p-4">
        <Typography variant="standardSm" className="text-muted-foreground">
          Email
        </Typography>
        <Typography variant="standard">{user.email}</Typography>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="User name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_admin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(val) => field.onChange(val === "true")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="false">User</SelectItem>
                    <SelectItem value="true">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(APP_ROUTES.ADMIN.USERS)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              <StateContentSwap
                isLoading={mutation.isPending}
                isSuccess={mutation.isSuccess}
                isError={mutation.isError}
              >
                Save Changes
              </StateContentSwap>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
