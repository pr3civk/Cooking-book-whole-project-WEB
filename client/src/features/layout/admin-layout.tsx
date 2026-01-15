import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/tailwind";
import { APP_ROUTES } from "@/utils/route";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  MessageSquare,
  UtensilsCrossed,
  Users,
  FolderTree,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: APP_ROUTES.ADMIN.COMMENTS, label: "Comments", icon: MessageSquare },
  { href: APP_ROUTES.ADMIN.RECIPES, label: "Recipes", icon: UtensilsCrossed },
  { href: APP_ROUTES.ADMIN.USERS, label: "Users", icon: Users },
  { href: APP_ROUTES.ADMIN.CATEGORIES, label: "Categories", icon: FolderTree },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <ChefHat className="h-6 w-6" />
          <Typography variant="titleSm">Admin Panel</Typography>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to={APP_ROUTES.HOME}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Site
            </Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
