import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutations, queries } from "@/api/queries";
import { setAuthToken } from "@/api/endpoints";
import {
  loginRequestDto,
  type LoginRequestDto,
} from "@/api/schemas/auth.schema";
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
import { CheckCircle } from "lucide-react";

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const from = location.state?.from?.pathname || APP_ROUTES.HOME;
  const justVerified = searchParams.get("verified") === "1";

  const form = useForm<LoginRequestDto>({
    resolver: zodResolver(loginRequestDto),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginRequestDto) => mutations.login(data),
    onSuccess: async (response) => {
      if (response.data.token) {
        setAuthToken(response.data.token);
      }

      // Fetch fresh user data and wait for cache update
      await queryClient.fetchQuery({
        ...queries.auth.user,
        staleTime: 0,
        retry: false,
      });

      navigate(from, { replace: true });
    },
  });

  return (
    <div className="space-y-6">
      {justVerified && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Email verified! You can now sign in.
        </div>
      )}

      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
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
                    placeholder="Enter password"
                    autoComplete="current-password"
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
              {(mutation.error as { response?: { status?: number } })?.response?.status === 403
                ? "Please verify your email before signing in"
                : "Invalid email or password"}
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
              Sign In
            </StateContentSwap>
          </Button>
        </form>
      </Form>

      <div className="space-y-2 text-center text-sm">
        <Link
          to={APP_ROUTES.FORGOT_PASSWORD}
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          Forgot password?
        </Link>
        <div>
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            to={APP_ROUTES.SIGN_UP}
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
