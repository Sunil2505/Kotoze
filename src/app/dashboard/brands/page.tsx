"use client";

import { useState } from "react";

import { Brand } from "@/lib/api/brand";

import BrandToolbar from "@/components/dashboard/brands/BrandToolbar";
import BrandTable from "@/components/dashboard/brands/BrandTable";
import BrandFormDialog from "@/components/dashboard/brands/BrandFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/brands/DeleteConfirmationDialog";

export default function BrandsPage() {
  const [search, setSearch] = useState("");

  const [refresh, setRefresh] = useState(0);

  const [selectedBrand, setSelectedBrand] =
    useState<Brand | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  function handleAddBrand() {
    setSelectedBrand(null);
    setFormOpen(true);
  }

  function handleEditBrand(brand: Brand) {
    setSelectedBrand(brand);
    setFormOpen(true);
  }

  function handleDeleteBrand(brand: Brand) {
    setSelectedBrand(brand);
    setDeleteOpen(true);
  }

  function handleSuccess() {
    setRefresh((prev) => prev + 1);

    setFormOpen(false);
    setDeleteOpen(false);

    setSelectedBrand(null);
  }

  return (
    <main className="space-y-6 p-6">

      <div>
        <h1 className="text-3xl font-bold">
          Brands
        </h1>

        <p className="text-muted-foreground">
          Manage all product brands.
        </p>
      </div>

      <BrandToolbar
        search={search}
        onSearchChange={setSearch}
        onAddBrand={handleAddBrand}
      />

      <BrandTable
        search={search}
        refresh={refresh}
        onEdit={handleEditBrand}
        onDelete={handleDeleteBrand}
      />

      <BrandFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        brand={selectedBrand}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        brand={selectedBrand}
        onSuccess={handleSuccess}
      />

    </main>
  );
}