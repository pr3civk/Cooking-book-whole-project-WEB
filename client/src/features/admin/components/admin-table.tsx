import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/utils/tailwind";
import type { ReactNode } from "react";

type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (row: T) => string | number;
};

export function AdminTable<T>({
  columns,
  data,
  isLoading,
  emptyIcon,
  emptyTitle = "No data",
  emptyDescription = "No items found",
  keyExtractor,
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Empty className="py-12">
        {emptyIcon}
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="border-t">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={cn("px-4 py-3 text-sm", col.className)}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
