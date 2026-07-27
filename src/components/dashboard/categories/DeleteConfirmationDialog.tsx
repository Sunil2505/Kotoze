"use client";

import { useState } from "react";

import {
  Category,
  deleteCategory,
} from "@/lib/api/category";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: DeleteConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!category) return;

    try {
      setLoading(true);

      await deleteCategory(category._id);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Delete Category
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete
            <span className="font-semibold">
              {" "}
              {category?.name}
            </span>
            ?
          </DialogDescription>

        </DialogHeader>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          This action cannot be undone.
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
              : "Delete Category"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}