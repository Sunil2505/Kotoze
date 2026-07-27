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
          : "Something went wrong"
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
            <strong>
              {brand?.name}
            </strong>
            ?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}