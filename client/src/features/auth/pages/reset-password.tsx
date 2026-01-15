import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { mutations } from "@/api/queries";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { APP_ROUTES } from "@/utils/route";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const ResetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof ResetSchema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const form = useForm<ResetFormData>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetFormData) =>
      mutations.resetPassword({
        token: token!,
        email: email!,
        password: data.password,
        password_confirmation: data.confirmPassword,
      }),
    onSuccess: () => {
      navigate(APP_ROUTES.SIGN_IN);
    },
  });

  if (!token || !email) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/20">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Invalid Link
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Button
          asChild
          className="h-11 rounded-xl bg-primary font-medium shadow-md hover:bg-primary/90"
        >
          <Link to={APP_ROUTES.FORGOT_PASSWORD}>Request New Link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Reset password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your new password</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="h-11 rounded-xl border-input bg-muted/50 transition-colors focus:border-ring focus:bg-background focus:ring-ring"
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
                <FormLabel className="text-foreground">Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    className="h-11 rounded-xl border-input bg-muted/50 transition-colors focus:border-ring focus:bg-background focus:ring-ring"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.isError && (
            <p className="text-sm text-destructive">
              Failed to reset password. Link may have expired.
            </p>
          )}

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-primary font-medium shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
            disabled={mutation.isPending}
          >
            <StateContentSwap
              isLoading={mutation.isPending}
              isSuccess={mutation.isSuccess}
              isError={mutation.isError}
            >
              Reset Password
            </StateContentSwap>
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Link to={APP_ROUTES.SIGN_IN}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
