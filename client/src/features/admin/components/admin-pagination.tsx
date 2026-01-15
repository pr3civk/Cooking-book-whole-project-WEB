import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages < 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <Typography variant="standardSm" className="text-muted-foreground">
        Page {page} of {totalPages}
      </Typography>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
