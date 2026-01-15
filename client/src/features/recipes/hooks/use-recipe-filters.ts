import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useSearchInput } from "./use-search-input";

export function useRecipeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useSearchInput({ 
    key: "search",
    searchParams,
    setSearchParams,
  });

  const filters = useMemo(
    () => ({
      search: searchInput.query,
      categoryId: searchParams.get("categoryId") || "all",
      sortBy: searchParams.get("sortBy") || "createdAt",
      page: Number(searchParams.get("page")) || 1,
    }),
    [searchParams, searchInput.query]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value && value !== "all") {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
        if (key !== "page") {
          newParams.delete("page");
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const setCategory = useCallback(
    (value: string) => setFilter("categoryId", value),
    [setFilter]
  );

  const setSortBy = useCallback(
    (value: string) => setFilter("sortBy", value),
    [setFilter]
  );

  const setPage = useCallback(
    (value: number) => setFilter("page", String(value)),
    [setFilter]
  );

  return {
    filters,
    searchInput,
    setCategory,
    setSortBy,
    setPage,
  };
}
