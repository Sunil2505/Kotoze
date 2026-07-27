"use client";

import { useState } from "react";

import {
  Vendor,
  deleteVendor,
} from "@/lib/api/vendor";

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
  vendor: Vendor | null;
  onSuccess: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  vendor,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!vendor) return;

    try {
      setLoading(true);

      await deleteVendor(vendor._id);

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
            Delete Vendor
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>
              {vendor?.businessName}
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