"use client";

import { useState } from "react";

import {
  Product,
  deleteProduct,
} from "@/lib/api/product";

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
  product: Product | null;
  onSuccess: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!product) return;

    try {
      setLoading(true);

      await deleteProduct(product._id);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
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
            Delete Product
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {product?.name}
            </span>
            ?
            <br />
            This product will be marked as deleted and will no longer appear in the application.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
              : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}