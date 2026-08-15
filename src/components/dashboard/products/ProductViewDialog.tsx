"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Product } from "@/lib/api/product";

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

function getName(
  value:
    | string
    | {
        _id: string;
        name?: string;
        businessName?: string;
        vendorCode?: string;
      }
) {
  if (typeof value === "string") {
    return value;
  }

  return value.name || value.businessName || value._id;
}

function getVendorName(product: Product) {
  if (typeof product.vendorId === "string") {
    return product.vendorId;
  }

  return product.vendorId.businessName;
}

function getCategoryName(product: Product) {
  if (typeof product.categoryId === "string") {
    return product.categoryId;
  }

  return product.categoryId.name;
}

function getBrandName(product: Product) {
  if (typeof product.brandId === "string") {
    return product.brandId;
  }

  return product.brandId.name;
}

export default function ProductViewDialog({
  open,
  onOpenChange,
  product,
}: ProductViewDialogProps) {
  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
  className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto p-6 mx-auto my-6"
>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>

          <DialogDescription>
            View complete information about this product.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Product Image */}
            <div className="md:col-span-1">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No Image
                  </span>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-5 md:col-span-2">

              <div>
                <p className="text-sm text-muted-foreground">
                  Product Name
                </p>

                <h2 className="text-xl font-semibold">
                  {product.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-muted-foreground">
                    SKU
                  </p>

                  <p className="font-medium">
                    {product.sku}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Status
                  </p>

                  <p className="font-medium">
                    {product.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Vendor
                  </p>

                  <p className="font-medium">
                    {getVendorName(product)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Category
                  </p>

                  <p className="font-medium">
                    {getCategoryName(product)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Brand
                  </p>

                  <p className="font-medium">
                    {getBrandName(product)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Featured
                  </p>

                  <p className="font-medium">
                    {product.featured ? "Yes" : "No"}
                  </p>
                </div>

              </div>

              {/* Pricing */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold">
                  Pricing
                </h3>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Cost Price
                    </p>

                    <p className="font-semibold">
                      ₹{product.costPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Selling Price
                    </p>

                    <p className="font-semibold">
                      ₹{product.sellingPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Compare Price
                    </p>

                    <p className="font-semibold">
                      {product.comparePrice
                        ? `₹${product.comparePrice.toLocaleString("en-IN")}`
                        : "—"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Description */}
              {product.shortDescription && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Short Description
                  </p>

                  <p className="mt-1">
                    {product.shortDescription}
                  </p>
                </div>
              )}

              {product.description && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Description
                  </p>

                  <p className="mt-1 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}