"use client";

import { useEffect, useState } from "react";

import {
  Product,
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

  const [vendorId, setVendorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const [name, setName] = useState("");

  const [shortDescription, setShortDescription] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [costPrice, setCostPrice] = useState(0);

  const [sellingPrice, setSellingPrice] =
    useState(0);

  const [comparePrice, setComparePrice] =
    useState(0);

  const [thumbnail, setThumbnail] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | "BLOCKED"
  >("ACTIVE");

  useEffect(() => {
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

    if (open) {
      loadMasters();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setVendorId(
        typeof product.vendorId === "string"
          ? product.vendorId
          : product.vendorId._id
      );

      setCategoryId(
        typeof product.categoryId === "string"
          ? product.categoryId
          : product.categoryId._id
      );

      setBrandId(
        typeof product.brandId === "string"
          ? product.brandId
          : product.brandId._id
      );

      setName(product.name);

      setShortDescription(
        product.shortDescription ?? ""
      );

      setDescription(
        product.description ?? ""
      );

      setCostPrice(product.costPrice);

      setSellingPrice(product.sellingPrice);

      setComparePrice(
        product.comparePrice ?? 0
      );

      setThumbnail(
        product.thumbnail ?? ""
      );

      setFeatured(product.featured);

      setStatus(product.status);
    } else {
      setVendorId("");
      setCategoryId("");
      setBrandId("");
      setName("");
      setShortDescription("");
      setDescription("");
      setCostPrice(0);
      setSellingPrice(0);
      setComparePrice(0);
      setThumbnail("");
      setFeatured(false);
      setStatus("ACTIVE");
    }
  }, [product, open]);

  async function handleSubmit() {
    try {
      setLoading(true);

      const payload = {
        vendorId,
        categoryId,
        brandId,
        name,
        shortDescription,
        description,
        costPrice,
        sellingPrice,
        comparePrice,
        thumbnail,
        featured,
        status,
      };

      if (product) {
        await updateProduct(
          product._id,
          payload
        );
      } else {
        await createProduct(payload);
      }

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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Vendor
            </label>

            <Select
              value={vendorId}
              onValueChange={(value) => setVendorId(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>

              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem
                    key={vendor._id}
                    value={vendor._id}
                  >
                    {vendor.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand
            </label>

            <Select
              value={brandId}
              onValueChange={(value) => setBrandId(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>

              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem
                    key={brand._id}
                    value={brand._id}
                  >
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Cost Price
            </label>

            <Input
              type="number"
              value={costPrice}
              onChange={(e) =>
                setCostPrice(Number(e.target.value))
              }
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Selling Price
            </label>

            <Input
              type="number"
              value={sellingPrice}
              onChange={(e) =>
                setSellingPrice(Number(e.target.value))
              }
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Compare Price
            </label>

            <Input
              type="number"
              value={comparePrice}
              onChange={(e) =>
                setComparePrice(Number(e.target.value))
              }
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Thumbnail URL
            </label>

            <Input
              value={thumbnail}
              onChange={(e) =>
                setThumbnail(e.target.value)
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Short Description
            </label>

            <Input
              value={shortDescription}
              onChange={(e) =>
                setShortDescription(
                  e.target.value
                )
              }
              placeholder="Short description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Enter product description"
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
                  value as
                    | "ACTIVE"
                    | "INACTIVE"
                    | "BLOCKED"
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

          <div className="flex items-center gap-3 pt-8">
            <input
              id="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) =>
                setFeatured(e.target.checked)
              }
            />

            <label htmlFor="featured">
              Featured Product
            </label>
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
              loading ||
              !name.trim() ||
              !vendorId ||
              !categoryId ||
              !brandId
            }
          >
            {loading
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}