"use client";

import { useState } from "react";

import { Product } from "@/lib/api/product";

import ProductToolbar from "@/components/dashboard/products/ProductToolbar";
import ProductTable from "@/components/dashboard/products/ProductTable";
import ProductFormDialog from "@/components/dashboard/products/ProductFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/products/DeleteConfirmationDialog";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const [refresh, setRefresh] = useState(0);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  function handleAddProduct() {
    setSelectedProduct(null);
    setFormOpen(true);
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setFormOpen(true);
  }

  function handleDeleteProduct(product: Product) {
    setSelectedProduct(product);
    setDeleteOpen(true);
  }

  function handleSuccess() {
    setRefresh((prev) => prev + 1);

    setSelectedProduct(null);

    setFormOpen(false);
    setDeleteOpen(false);
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <p className="text-muted-foreground">
          Manage all products.
        </p>
      </div>

      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        onAddProduct={handleAddProduct}
      />

      <ProductTable
        search={search}
        refresh={refresh}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </main>
  );
}