"use client";

import { useEffect, useState } from "react";

import {
  Inventory,
  InventoryFormData,
  updateInventory,
} from "@/lib/api/inventory";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: Inventory | null;
  onSuccess: () => void;
}

export default function InventorySettingsDialog({
  open,
  onOpenChange,
  inventory,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [minimumStock, setMinimumStock] =
    useState(0);

  const [maximumStock, setMaximumStock] =
    useState(0);

  const [reorderLevel, setReorderLevel] =
    useState(0);

  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | "BLOCKED"
  >("ACTIVE");

  useEffect(() => {
    if (inventory) {
      setMinimumStock(
        inventory.minimumStock
      );

      setMaximumStock(
        inventory.maximumStock
      );

      setReorderLevel(
        inventory.reorderLevel
      );

      setStatus(inventory.status);
    } else {
      setMinimumStock(0);
      setMaximumStock(0);
      setReorderLevel(0);
      setStatus("ACTIVE");
    }
  }, [inventory, open]);

  async function handleSubmit() {
    if (!inventory) return;

    try {
      setLoading(true);

      const payload: InventoryFormData = {
        minimumStock,
        maximumStock,
        reorderLevel,
        status,
      };

      await updateInventory(
        inventory._id,
        payload
      );

      onSuccess();

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update inventory."
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Inventory Settings
          </DialogTitle>

          <DialogDescription>
            Update inventory configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product
            </label>

            <Input
              readOnly
              value={
                inventory &&
                typeof inventory.productId === "object"
                  ? inventory.productId.name
                  : ""
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Minimum Stock
            </label>

            <Input
              type="number"
              value={minimumStock}
              onChange={(e) =>
                setMinimumStock(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Maximum Stock
            </label>

            <Input
              type="number"
              value={maximumStock}
              onChange={(e) =>
                setMaximumStock(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Reorder Level
            </label>

            <Input
              type="number"
              value={reorderLevel}
              onChange={(e) =>
                setReorderLevel(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(
                  value as InventoryFormData["status"]
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">
                  Active
                </SelectItem>

                <SelectItem value="INACTIVE">
                  Inactive
                </SelectItem>

                <SelectItem value="BLOCKED">
                  Blocked
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Update Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}