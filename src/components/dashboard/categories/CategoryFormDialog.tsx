"use client";

import { useEffect, useState } from "react";

import {
  Category,
  CategoryFormData,
  createCategory,
  updateCategory,
} from "@/lib/api/category";

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

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

const initialForm: CategoryFormData = {
  name: "",
  description: "",
  parentId: "",
  sortOrder: 0,
  status: "ACTIVE",
};

export default function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryFormDialogProps) {
  const [form, setForm] =
    useState<CategoryFormData>(initialForm);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description ?? "",
        parentId: category.parentId ?? "",
        sortOrder: category.sortOrder,
        status: category.status,
      });
    } else {
      setForm(initialForm);
    }
  }, [category, open]);

  function handleChange(
    field: keyof CategoryFormData,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      if (category) {
        await updateCategory(category._id, form);
      } else {
        await createCategory(form);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {category
              ? "Edit Category"
              : "Add Category"}
          </DialogTitle>

          <DialogDescription>
            Fill the category details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category Name
            </label>

            <Input
              value={form.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              rows={4}
              value={form.description}
              placeholder="Enter description"
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Sort Order
              </label>

              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  handleChange(
                    "sortOrder",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  handleChange(
                    "status",
                    e.target.value as CategoryFormData["status"]
                  )
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3"
              >
                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="INACTIVE">
                  INACTIVE
                </option>

                <option value="BLOCKED">
                  BLOCKED
                </option>
              </select>
            </div>
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
              ? category
                ? "Updating..."
                : "Saving..."
              : category
              ? "Update Category"
              : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}