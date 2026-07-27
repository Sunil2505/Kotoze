"use client";

import { useEffect, useState } from "react";

import {
  Brand,
  createBrand,
  updateBrand,
} from "@/lib/api/brand";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

export default function BrandFormDialog({
  open,
  onOpenChange,
  brand,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | "BLOCKED"
  >("ACTIVE");

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setDescription(brand.description ?? "");
      setLogo(brand.logo ?? "");
      setWebsite(brand.website ?? "");
      setSortOrder(brand.sortOrder);
      setStatus(brand.status);
    } else {
      setName("");
      setDescription("");
      setLogo("");
      setWebsite("");
      setSortOrder(0);
      setStatus("ACTIVE");
    }
  }, [brand, open]);

  async function handleSubmit() {
    try {
      setLoading(true);

      const payload = {
        name,
        description,
        logo,
        website,
        sortOrder,
        status,
      };

      if (brand) {
        await updateBrand(brand._id, payload);
      } else {
        await createBrand(payload);
      }

      onSuccess();
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
      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            {brand ? "Edit Brand" : "Add Brand"}
          </DialogTitle>

          <DialogDescription>
            {brand
              ? "Update brand information."
              : "Create a new brand."}
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-4">
            
                  <div>
            <label className="mb-2 block text-sm font-medium">
              Brand Name
            </label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              placeholder="Brand description"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Logo URL
            </label>

            <Input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Website
            </label>

            <Input
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Sort Order
            </label>

            <Input
              type="number"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "ACTIVE"
                    | "INACTIVE"
                    | "BLOCKED"
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="BLOCKED">
                Blocked
              </option>
            </select>
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
            disabled={
              loading || name.trim().length === 0
            }
          >
            {loading
              ? "Saving..."
              : brand
              ? "Update Brand"
              : "Create Brand"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}