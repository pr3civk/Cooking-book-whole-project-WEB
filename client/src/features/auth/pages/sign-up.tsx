import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { APP_ROUTES } from "@/utils/route";
import { Mail } from "lucide-react";

const SignUpSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof SignUpSchema>;

export function SignUp() {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: SignUpFormData) =>
      mutations.register({
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        name: data.name || undefined,
      }),
  });

  // Show verification message on success
  if (mutation.isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{form.getValues("email")}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click the link in your email to verify your account.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl">
          <Link to={APP_ROUTES.SIGN_IN}>Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Create account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign up to get started</p>
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
                <FormLabel className="text-foreground">Name (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    autoComplete="name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    autoComplete="email"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
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
              {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Registration failed. Email may already be in use."}
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
              Create Account
            </StateContentSwap>
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link
          to={APP_ROUTES.SIGN_IN}
          className="font-medium text-primary hover:text-primary/80"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
