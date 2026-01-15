import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

type RecipeFiltersProps = {
  searchInput: {
    options: {
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
  };
  categoryId: string;
  sortBy: string;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export function RecipeFilters({
  searchInput,
  categoryId,
  sortBy,
  onCategoryChange,
  onSortChange,
}: RecipeFiltersProps) {
  const { data: categoriesData } = useQuery(queries.categories.all);
  const categories = Array.isArray(categoriesData?.data?.data)
    ? categoriesData?.data?.data
    : [];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for recipes..."
            {...searchInput.options}
            className="h-11 rounded-xl border-input bg-muted/50 pl-11 text-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter:</span>
          </div>

          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 w-full rounded-xl border-input bg-muted/50 text-sm transition-colors hover:border-ring focus:border-ring focus:ring-ring sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All Categories
              </SelectItem>
              {categories?.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={String(cat.id)}
                  className="rounded-lg"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-11 w-full rounded-xl border-input bg-muted/50 text-sm transition-colors hover:border-ring focus:border-ring focus:ring-ring sm:w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="createdAt" className="rounded-lg">
                Newest First
              </SelectItem>
              <SelectItem value="views" className="rounded-lg">
                Most Viewed
              </SelectItem>
              <SelectItem value="likes" className="rounded-lg">
                Most Liked
              </SelectItem>
              <SelectItem value="title" className="rounded-lg">
                Title A-Z
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
