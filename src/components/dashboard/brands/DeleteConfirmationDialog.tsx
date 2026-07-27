"use client";

import { useState } from "react";

import {
  Brand,
  deleteBrand,
} from "@/lib/api/brand";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  onSuccess: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  brand,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!brand) return;

    try {
      setLoading(true);

      await deleteBrand(brand._id);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete brand."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Delete Brand
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {brand?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          This brand will be marked as deleted and will no longer appear in the application.
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading
              ? "Deleting..."
              : "Delete Brand"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}