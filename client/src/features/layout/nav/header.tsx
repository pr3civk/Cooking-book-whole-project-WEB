import { Link } from "react-router-dom";
import { useSession } from "@/features/auth/session";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/utils/route";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, Plus, User, LogOut, Settings, Heart, Shield } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={APP_ROUTES.HOME} className="flex items-center justify-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary shadow-md">
            <ChefHat className="size-5 text-primary-foreground" />
          </div>
          <Typography variant="titleLg" className="font-serif">
            Cooking Book
          </Typography>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground items-center"
                asChild
              >
                <Link to={APP_ROUTES.RECIPES.CREATE}>
                  <Plus className="mr-1.5 size-4" />
                  New Recipe
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-accent"
                  >
                    <User className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to={APP_ROUTES.LIKED_RECIPES}>
                      <Heart className="mr-2 h-4 w-4 text-destructive" />
                      Liked Recipes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to={APP_ROUTES.SETTINGS}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link to={APP_ROUTES.ADMIN.DASHBOARD}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <Link to={APP_ROUTES.SIGN_IN}>Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-primary font-medium shadow-md hover:bg-primary/90"
                asChild
              >
                <Link to={APP_ROUTES.SIGN_UP}>Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
