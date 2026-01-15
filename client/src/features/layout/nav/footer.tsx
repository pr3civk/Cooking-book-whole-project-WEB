import { Link } from "react-router-dom";
import { APP_ROUTES, OUTSIDE_LINKS } from "@/utils/route";
import { ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to={APP_ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ChefHat className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-semibold text-foreground">
              Cooking Book
            </span>
          </Link>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cooking Book. <Link to={OUTSIDE_LINKS.GITHUB} className="text-primary underline">created by @pr3civk</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
