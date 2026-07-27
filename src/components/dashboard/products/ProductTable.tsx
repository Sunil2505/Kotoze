"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  Product,
  getProducts,
} from "@/lib/api/product";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  search: string;
  refresh?: number;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductTable({
  search,
  refresh,
  onEdit,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [refresh]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter((product) => {
      const vendor =
        typeof product.vendorId === "object"
          ? product.vendorId.businessName
          : "";

      const category =
        typeof product.categoryId === "object"
          ? product.categoryId.name
          : "";

      const brand =
        typeof product.brandId === "object"
          ? product.brandId.name
          : "";

      return (
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.sku
          .toLowerCase()
          .includes(keyword) ||
        vendor
          .toLowerCase()
          .includes(keyword) ||
        category
          .toLowerCase()
          .includes(keyword) ||
        brand
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [products, search]);

  function getStatusBadge(
    status: Product["status"]
  ) {
    switch (status) {
      case "ACTIVE":
        return <Badge>Active</Badge>;

      case "INACTIVE":
        return (
          <Badge variant="secondary">
            Inactive
          </Badge>
        );

      case "BLOCKED":
        return (
          <Badge variant="destructive">
            Blocked
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>

            <TableHead>Product</TableHead>

            <TableHead>Category</TableHead>

            <TableHead>Brand</TableHead>

            <TableHead>Vendor</TableHead>

            <TableHead>Selling Price</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Created</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredProducts.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="py-10 text-center text-muted-foreground"
              >
                No products found.
              </TableCell>
            </TableRow>
          )}

          {filteredProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium">
                {product.sku}
              </TableCell>

              <TableCell>
                <div className="font-medium">
                  {product.name}
                </div>

                {product.shortDescription && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {product.shortDescription}
                  </div>
                )}
              </TableCell>

              <TableCell>
                {typeof product.categoryId ===
                "object"
                  ? product.categoryId.name
                  : "-"}
              </TableCell>

              <TableCell>
                {typeof product.brandId ===
                "object"
                  ? product.brandId.name
                  : "-"}
              </TableCell>

              <TableCell>
                {typeof product.vendorId ===
                "object"
                  ? product.vendorId.businessName
                  : "-"}
              </TableCell>

              <TableCell>
                ₹
                {product.sellingPrice.toLocaleString(
                  "en-IN"
                )}
              </TableCell>

              <TableCell>
                {getStatusBadge(product.status)}
              </TableCell>

              <TableCell>
                {new Date(
                  product.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      onDelete?.(product)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}