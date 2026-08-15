"use client";

import { useState } from "react";

import { Product } from "@/lib/api/product";

import ProductToolbar from "@/components/dashboard/products/ProductToolbar";
import ProductTable from "@/components/dashboard/products/ProductTable";
import ProductFormDialog from "@/components/dashboard/products/ProductFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/products/DeleteConfirmationDialog";
import ProductViewDialog from "@/components/dashboard/products/ProductViewDialog";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const [refresh, setRefresh] = useState(0);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);
  
  const [viewOpen, setViewOpen] =
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

function handleViewProduct(product: Product) {
  setSelectedProduct(product);
  setViewOpen(true);
}

  function handleSuccess() {
    setRefresh((prev) => prev + 1);

    setSelectedProduct(null);

    setFormOpen(false);
    setDeleteOpen(false);
  }

  return (
    <div className="space-y-6 w-full">
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
        onView={handleViewProduct}
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

      <ProductViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        product={selectedProduct}
      /> 
      
    </div>
  );
}