"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import {
  Eye,
  Pencil,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";

import { getProducts, Product } from "@/lib/api/product";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductTableProps {
  search: string;
  refresh: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

function getStockBadge(stock: number) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Out of Stock
      </Badge>
    );
  }

  if (stock <= 10) {
    return (
      <Badge className="gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <AlertTriangle className="h-3 w-3" />
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
      <CheckCircle2 className="h-3 w-3" />
      In Stock
    </Badge>
  );
} // 👈 ഈ } വളരെ പ്രധാനമാണ്

export default function ProductTable({
  search,
  refresh,
  onEdit,
  onDelete,
  onView,
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error(err);

      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [refresh]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return products;
    }

    const keyword = search.toLowerCase();

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku?.toLowerCase().includes(keyword) ||
          typeof product.brandId === "object" &&
          product.brandId.name
            .toLowerCase()
            .includes(keyword)

          ||

          typeof product.categoryId === "object" &&
          product.categoryId.name
            .toLowerCase()
            .includes(keyword)
      );
    });
  }, [products, search]);
    if (loading) {
    return (
      <div className="rounded-xl border bg-white">
        <div className="flex h-72 items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-10 w-10 animate-pulse text-gray-400" />

            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white">
        <div className="flex h-72 items-center justify-center">
          <div className="text-center">
            <XCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h3 className="text-lg font-semibold">
              Failed to Load Products
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              className="mt-4"
              onClick={loadProducts}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="rounded-xl border bg-white">
        <div className="flex h-72 items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />

            <h3 className="text-lg font-semibold">
              No Products Found
            </h3>

            <p className="mt-2 text-muted-foreground">
              No products match your search.
            </p>
          </div>
        </div>
      </div>
    );
  }

return (
  <div className="rounded-xl border bg-white shadow-sm">
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
          <TableHead className="w-[300px]">
            Product
          </TableHead>

          <TableHead className="w-[75px]">
            SKU
          </TableHead>

          <TableHead className="w-[80px]">
            Category
          </TableHead>

          <TableHead className="w-[140px]">
            Brand
          </TableHead>

          <TableHead className="w-[40px] text-right">
            Price
          </TableHead>

          <TableHead className="w-[90px] text-center">
            Stock
          </TableHead>

          <TableHead className="w-[120px] text-center">
            Status
          </TableHead>

          <TableHead className="w-[70px] text-right">
            Actions
          </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredProducts.map((product) => {
            const stock =
              5000

            const price = product.sellingPrice;

            return (
              <TableRow key={product._id}>


                
                                {/* Product */}
                <TableCell>
                  <div className="flex items-start gap-3">

                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-base font-semibold leading-6 text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600 whitespace-normal break-words">
                        {product.shortDescription ??
                          product.description ??
                          "No description"}
                      </p>

                    </div>

                  </div>
                </TableCell>

                {/* SKU */}
                <TableCell>
                  <span className="font-mono text-sm">
                    {product.sku || "-"}
                  </span>
                </TableCell>

                {/* Category */}
                  <TableCell>
                    {typeof product.categoryId === "object"
                      ? product.categoryId.name
                      : "-"}
                  </TableCell>

                {/* Brand */}
                <TableCell>
                  {typeof product.brandId === "object"
                    ? product.brandId.name
                    : "-"}
                </TableCell>

                {/* Price */}
            <TableCell className="align-middle">
              <div className="space-y-1">
                <p className="font-semibold">
                  ₹{Number(price).toLocaleString("en-IN")}
                </p>

                {product.comparePrice &&
                  product.comparePrice > price && (
                    <p className="text-xs text-muted-foreground line-through">
                      ₹{Number(product.comparePrice).toLocaleString("en-IN")}
                    </p>
                  )}
              </div>
            </TableCell>

                {/* Stock */}
              <TableCell className="align-middle text-center">
                <div className="flex flex-col items-center justify-center gap-1">
                  {stock > 0 && (
                    <span className="font-medium">
                      {stock}
                    </span>
                  )}

                  {getStockBadge(stock)}
                </div>
              </TableCell>

                                {/* Status */}
                <TableCell className="align-middle">
                  <div className="flex h-full items-center justify-center">
                    {product.status === "ACTIVE" ? (
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {product.status}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="align-middle">
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(product)}>
                          <Eye className="h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}