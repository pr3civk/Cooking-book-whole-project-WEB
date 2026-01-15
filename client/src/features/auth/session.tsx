import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import { clearAuthToken } from "@/api/endpoints";
import type { UserResponseDto } from "@/api/schemas/auth.schema";

interface SessionContextValue {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    ...queries.auth.user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const user = data?.data ?? null;
  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin ?? false;

  async function logout() {
    clearAuthToken();
    await queryClient.setQueryData(queries.auth.user.queryKey, null);
    try {
      await mutations.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      queryClient.clear();
    }
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
