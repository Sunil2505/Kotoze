"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Product,
  ProductFormData,
  createProduct,
  updateProduct,
} from "@/lib/api/product";

import {
  Vendor,
  getVendors,
} from "@/lib/api/vendor";

import {
  Brand,
  getBrands,
} from "@/lib/api/brand";

import {
  Category,
  getCategories,
} from "@/lib/api/category";

import { Combobox } from "@/components/ui/combobox";
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
  product: Product | null;
  onSuccess: () => void;
}

const defaultForm: ProductFormData = {
  vendorId: "",
  categoryId: "",
  brandId: "",

  name: "",

  shortDescription: "",
  description: "",

  costPrice: 0,
  sellingPrice: 0,
  comparePrice: 0,

  thumbnail: "",

  featured: false,

  status: "ACTIVE",
};

export default function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: Props) {

  const [loading, setLoading] = useState(false);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] =
    useState<ProductFormData>(defaultForm);

  const updateField = <
    K extends keyof ProductFormData
  >(
    key: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function loadMasters() {
    try {
      const [
        vendorData,
        brandData,
        categoryData,
      ] = await Promise.all([
        getVendors(),
        getBrands(),
        getCategories(),
      ]);

      setVendors(vendorData);
      setBrands(brandData);
      setCategories(categoryData);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!open) return;

    loadMasters();
  }, [open]);

  useEffect(() => {

    if (!open) return;

    if (!product) {
      setForm(defaultForm);
      return;
    }

    setForm({
      vendorId:
        typeof product.vendorId === "string"
          ? product.vendorId
          : product.vendorId._id,

      categoryId:
        typeof product.categoryId === "string"
          ? product.categoryId
          : product.categoryId._id,

      brandId:
        typeof product.brandId === "string"
          ? product.brandId
          : product.brandId._id,

      name: product.name,

      shortDescription:
        product.shortDescription ?? "",

      description:
        product.description ?? "",

      costPrice:
        product.costPrice,

      sellingPrice:
        product.sellingPrice,

      comparePrice:
        product.comparePrice ?? 0,

      thumbnail:
        product.thumbnail ?? "",

      featured:
        product.featured,

      status:
        product.status,
    });

  }, [product, open]);

  async function handleImageUpload(file: File) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/upload/product",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    updateField("thumbnail", result.url);
  }

  async function handleSubmit() {

    try {

      setLoading(true);

      if (product) {
        await updateProduct(
          product._id,
          form
        );
      } else {
        await createProduct(form);
      }

      onSuccess();

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save product."
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
      <DialogContent className="w-[90vw] max-w-[1050px] h-[94vh] overflow-hidden p-0">

        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>
            {product
              ? "Edit Product"
              : "Add Product"}
          </DialogTitle>

          <DialogDescription>
            {product
              ? "Update product information."
              : "Create a new product."}
          </DialogDescription>
        </DialogHeader>

          <div className="flex flex-1 min-h-0">

            {/* LEFT */}

            <div className="flex-1 overflow-hidden p-4">

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">

              {/* Product Name */}

              <div className="col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <Input
                  value={form.name}
                  placeholder="Enter product name"
                  onChange={(e) =>
                    updateField(
                      "name",
                      e.target.value
                    )
                  }
                />

              </div>

                {/* Vendor */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Vendor
                  </label>

                  <Combobox
                    value={form.vendorId}
                    className="w-[200px]"
                    contentClassName="w-[200px]"
                    onChange={(value) =>
                      updateField("vendorId", value)
                    }
                    options={vendors.map((vendor) => ({
                      value: vendor._id,
                      label: vendor.businessName,
                    }))}
                    placeholder="Select Vendor"
                    searchPlaceholder="Search vendor..."
                    emptyText="No vendors found."
                  />
                </div>


                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <Combobox
                    className="w-[200px]"
                    contentClassName="w-[200px]"
                    value={form.categoryId}
                    onChange={(value) =>
                      updateField(
                        "categoryId",
                        value
                      )
                    }
                    placeholder="Select Category"
                    searchPlaceholder="Search category..."
                    emptyText="No categories found."
                    options={categories.map((category) => ({
                      value: category._id,
                      label: category.name,
                    }))}
                  />
                </div>


<div className="col-span-2 grid grid-cols-[200px_130px_130px_130px] gap-4">

  {/* Brand */}
  <div>
    <label className="mb-2 block text-sm font-medium">
      Brand
    </label>

    <Combobox
      value={form.brandId}
      className="w-[200px]"
      contentClassName="w-[200px]"
      onChange={(value) =>
        updateField("brandId", value)
      }
      placeholder="Select Brand"
      searchPlaceholder="Search brand..."
      emptyText="No brands found."
      options={brands.map((brand) => ({
        value: brand._id,
        label: brand.name,
      }))}
    />
  </div>

  {/* Cost Price */}
  <div className="w-[130px]">
    <label className="mb-2 block text-sm font-medium">
      Cost Price
    </label>

    <Input
      type="number"
      value={form.costPrice}
      onChange={(e) =>
        updateField(
          "costPrice",
          Number(e.target.value)
        )
      }
    />
  </div>

  {/* Selling Price */}
  <div className="w-[130px]">
    <label className="mb-2 block text-sm font-medium">
      Selling Price
    </label>

    <Input
      type="number"
      value={form.sellingPrice}
      onChange={(e) =>
        updateField(
          "sellingPrice",
          Number(e.target.value)
        )
      }
    />
  </div>

  {/* Compare Price */}
  <div className="w-[130px]">
    <label className="mb-2 block text-sm font-medium">
      Compare Price
    </label>

    <Input
      type="number"
      value={form.comparePrice}
      onChange={(e) =>
        updateField(
          "comparePrice",
          Number(e.target.value)
        )
      }
    />
  </div>

</div>


                {/* Short Description */}

                <div className="col-span-2 w-full max-w-[580px]">
                  <label className="mb-2 block text-sm font-medium">
                    Short Description
                  </label>

                  <Input
                    value={form.shortDescription}
                    placeholder="Short description"
                    onChange={(e) =>
                      updateField(
                        "shortDescription",
                        e.target.value
                      )
                    }
                  />
                </div>

              {/* Description */}

              <div className="col-span-2 w-full max-w-[580px]">

                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  placeholder="Enter product description"
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />

              </div>

              {/* Status + Featured */}

              <div className="flex items-end gap-6">

                {/* Status */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Status
                  </label>

                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      updateField(
                        "status",
                        value as ProductFormData["status"]
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

                {/* Featured Product */}

                <div className="flex items-center gap-3 pb-2">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField(
                        "featured",
                        e.target.checked
                      )
                    }
                  />

                  <label
                    htmlFor="featured"
                    className="text-sm font-medium"
                  >
                    Featured Product
                  </label>
                </div>

              </div>
            </div>

          </div>


{/* RIGHT SIDEBAR */}

<div className="w-[360px] border-l bg-slate-50 flex flex-col">

  <div className="flex-1 p-6">

    <h3 className="mb-4 text-lg font-semibold">
      Product Image
    </h3>

    <Input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={async (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        try {

          await handleImageUpload(file);

        } catch (error) {

          alert(
            error instanceof Error
              ? error.message
              : "Upload failed."
          );

        }

      }}
    />

    {form.thumbnail ? (

      <div className="relative mt-6 h-72 w-full overflow-hidden rounded-xl border bg-white">

        <Image
          src={form.thumbnail}
          alt={form.name || "Product"}
          fill
          className="object-contain"
        />

      </div>

    ) : (

      <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed bg-white text-slate-400">

        No Image Selected

      </div>

    )}

  </div>

  {/* ACTION BUTTONS */}

  <div className="flex justify-end gap-2 border-t bg-white px-4 py-2">

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
        loading ||
        !form.name.trim() ||
        !form.vendorId ||
        !form.categoryId ||
        !form.brandId ||
        form.sellingPrice <= 0 ||
        form.costPrice < 0
      }
    >
      {loading
        ? "Saving..."
        : product
        ? "Update Product"
        : "Create Product"}
    </Button>

  </div>

</div>
        </div>

      </DialogContent>

    </Dialog>
  );
}