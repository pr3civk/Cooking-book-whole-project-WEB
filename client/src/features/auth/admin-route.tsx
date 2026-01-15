import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "./session";
import { APP_ROUTES } from "@/utils/route";
import { Spinner } from "@/components/ui/spinner";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useSession();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.SIGN_IN} state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return children;
}
