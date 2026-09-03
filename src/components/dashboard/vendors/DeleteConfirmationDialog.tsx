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
          : "Failed to delete vendor."
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
      <DialogContent className="w-[440px] max-w-[calc(100vw-2rem)] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle>
            Delete Vendor
          </DialogTitle>

          <DialogDescription className="leading-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {vendor?.businessName}
            </span>
            ?
            <br />
            This vendor will be marked as deleted
            and will no longer appear in the
            application.
          </DialogDescription>
        </DialogHeader>

        {/* Footer */}
          <DialogFooter className="relative -top-2 mt-0 flex-row items-center justify-end gap-2 border-t px-5 pb-2 pt-1.5">
          <Button
            variant="outline"
            className="-translate-y-1"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            className="-translate-y-1"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete Vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}