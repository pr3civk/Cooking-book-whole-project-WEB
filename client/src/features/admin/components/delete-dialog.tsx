import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StateContentSwap } from "@/components/ui/state-content-swap";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
};

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  isPending,
  isSuccess,
  isError,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            <StateContentSwap
              isLoading={isPending}
              isSuccess={isSuccess}
              isError={isError}
            >
              Delete
            </StateContentSwap>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
