import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { mutations } from "@/api/queries";
import {
  forgotPasswordRequestDto,
  type ForgotPasswordRequestDto,
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
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { APP_ROUTES } from "@/utils/route";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordRequestDto>({
    resolver: zodResolver(forgotPasswordRequestDto),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordRequestDto) => mutations.forgotPassword(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a password reset link to {form.getValues("email")}
          </p>
        </div>
        <Button
          variant="ghost"
          asChild
          className="mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Link to={APP_ROUTES.SIGN_IN}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Forgot password?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email to reset your password
        </p>
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

          {mutation.isError && (
            <p className="text-sm text-destructive">
              Something went wrong. Please try again.
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
              Send Reset Link
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
