import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortOrder } from "@/api/schemas/admin.schema";

export interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface AdminSortProps<T extends string> {
  options: SortOption<T>[];
  sortBy: T | undefined;
  sortOrder: SortOrder | undefined;
  onSortChange: (sortBy: T | undefined, sortOrder: SortOrder | undefined) => void;
  placeholder?: string;
}

export function AdminSort<T extends string>({
  options,
  sortBy,
  sortOrder,
  onSortChange,
  placeholder = "Sort by...",
}: AdminSortProps<T>) {
  const handleSortByChange = (value: string) => {
    if (value === "__clear__") {
      onSortChange(undefined, undefined);
    } else {
      onSortChange(value as T, sortOrder || "desc");
    }
  };

  const toggleOrder = () => {
    if (!sortBy) return;
    onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
  };

  const OrderIcon = !sortBy ? ArrowUpDown : sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-2">
      <Select value={sortBy || ""} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {sortBy && (
            <SelectItem value="__clear__">Clear sort</SelectItem>
          )}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleOrder}
        disabled={!sortBy}
        aria-label={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
      >
        <OrderIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
