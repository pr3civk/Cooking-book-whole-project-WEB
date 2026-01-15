import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/features/auth/session";
import { mutations } from "@/api/queries";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { User, Calendar, Lock, Check } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function Settings() {
  const { user } = useSession();
  const [passwordChanged, setPasswordChanged] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      mutations.changePassword({
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      }),
    onSuccess: () => {
      form.reset();
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 3000);
    },
  });

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Typography variant="h1">Settings</Typography>

      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <Typography variant="titleLg">Profile</Typography>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Typography variant="standardSm" className="text-muted-foreground">
                Name
              </Typography>
              <Typography variant="standard" className="font-medium">
                {user?.name || "Not set"}
              </Typography>
            </div>
            <div>
              <Typography variant="standardSm" className="text-muted-foreground">
                Email
              </Typography>
              <Typography variant="standard" className="font-medium">
                {user?.email}
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Stats Section */}
      <section className="space-y-4">
        <Typography variant="titleLg">Activity</Typography>
        <div className="grid gap-4">
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Typography variant="standardSm" className="text-muted-foreground">
                Member since
              </Typography>
              <Typography variant="standard" className="font-medium">
                {formatDate(user?.created_at)}
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Security Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <Typography variant="titleLg">Security</Typography>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <Typography variant="titleBase" className="mb-4">
            Change Password
          </Typography>

          {passwordChanged && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
              <Check className="h-4 w-4" />
              Password changed successfully!
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter current password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mutation.isError && (
                <p className="text-sm text-destructive">
                  Failed to change password. Please check your current password.
                </p>
              )}

              <Button type="submit" disabled={mutation.isPending}>
                <StateContentSwap
                  isLoading={mutation.isPending}
                  isSuccess={mutation.isSuccess}
                  isError={mutation.isError}
                >
                  Update Password
                </StateContentSwap>
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
