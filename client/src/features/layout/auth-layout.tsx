import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES, OUTSIDE_LINKS } from "@/utils/route";
import { ChefHat } from "lucide-react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAyYy00LjQxOCAwLTgtMy41ODItOC04czMuNTgyLTggOC04IDggMy41ODIgOCA4LTMuNTgyIDgtOCA4eiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] text-primary opacity-60" />

      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to={APP_ROUTES.HOME}
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <ChefHat className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-serif text-3xl font-bold text-foreground">
            Cooking Book
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Cooking Book. <Link to={OUTSIDE_LINKS.GITHUB} className="text-primary underline">created by @pr3civk</Link>
        </p>
      </div>
    </div>
  );
}
