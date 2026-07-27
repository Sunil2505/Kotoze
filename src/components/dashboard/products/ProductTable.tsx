"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import DataTable from "@/components/dashboard/common/DataTable";
import StatusBadge from "@/components/dashboard/common/StatusBadge";
import Loading from "@/components/dashboard/common/Loading";

import ProductToolbar from "./ProductToolbar";
import ProductFormDialog from "./ProductFormDialog";

interface Product {
  _id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  status: string;
  categoryId?: {
    _id?: string;
    name: string;
  };
  brandId?: {
    _id?: string;
    name: string;
  };
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch("/api/products");
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddProduct() {
    setSelectedProduct(null);
    setOpen(true);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setOpen(true);
  }

  if (loading) return <Loading />;

  const columns = [
    {
      key: "name",
      title: "Product",
    },
    {
      key: "sku",
      title: "SKU",
    },
    {
      key: "category",
      title: "Category",
      render: (row: Product) => row.categoryId?.name ?? "-",
    },
    {
      key: "brand",
      title: "Brand",
      render: (row: Product) => row.brandId?.name ?? "-",
    },
    {
      key: "price",
      title: "Price",
      render: (row: Product) => `₹${row.sellingPrice}`,
    },
    {
      key: "status",
      title: "Status",
      render: (row: Product) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row: Product) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditProduct(row)}
            className="rounded p-2 hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            className="rounded p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        onAddProduct={handleAddProduct}
      />

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredProducts}
          emptyMessage="No products found."
        />
      </div>

      <ProductFormDialog
        open={open}
        onOpenChange={setOpen}
        product={selectedProduct as any}
        onSuccess={fetchProducts}
      />
    </>
  );
}