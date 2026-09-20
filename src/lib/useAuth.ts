import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api";

export function useAuth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiFetch<{ userId: string }>("/auth/me"),
    retry: false,
  });

  return {
    isAuthenticated: !!data && !isError,
    isLoading,
  };
}
