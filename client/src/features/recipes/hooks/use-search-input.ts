import type { SetURLSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { DEFAULT_DEBOUNCE_DELAY } from "@/constants";

/**
 * Custom hook for managing a search input state with debounce and URL query syncing.
 *
 * @param key - The query parameter key to sync with (e.g., "search").
 * @param debounceDelay - Optional debounce delay in milliseconds (default is 200ms).
 * @param searchParams - URLSearchParams from useSearchParams (required to avoid multiple calls).
 * @param setSearchParams - Setter from useSearchParams (required to avoid multiple calls).
 * @returns {
 *   options: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void } - Input props.
 *   debouncedSearch: string - Debounced value that can be used for search effects.
 *   search: string - The current input value.
 *   setSearch: (value: string) => void - Updates input immediately.
 *   query: string - The current URL query parameter value.
 * }
 */

type Props = {
  key?: string;
  debounceDelay?: number;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

export function useSearchInput(props: Props) {
  const { key = "search", debounceDelay = DEFAULT_DEBOUNCE_DELAY, searchParams, setSearchParams } = props;
  
  const query = searchParams.get(key) || "";
  const [search, setSearch] = useState(query);
  const [debouncedSearch] = useDebounce(search, debounceDelay);

  const options = {
    value: search,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
  };

  // Sync debounced value to URL query parameter
  useEffect(() => {
    if (debouncedSearch !== query) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        const trimmed = debouncedSearch.trim();
        if (trimmed) {
          newParams.set(key, trimmed);
        } else {
          newParams.delete(key);
        }
        // Reset page when search changes
        newParams.delete("page");
        return newParams;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, key]);

  // Sync URL query to local state when it changes externally
  useEffect(() => {
    if (query !== search) {
      setSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { options, debouncedSearch, search, setSearch, query };
}
