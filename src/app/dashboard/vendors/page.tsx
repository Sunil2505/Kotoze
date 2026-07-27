"use client";

import { useState } from "react";

import { Vendor } from "@/lib/api/vendor";

import VendorToolbar from "@/components/dashboard/vendors/VendorToolbar";
import VendorTable from "@/components/dashboard/vendors/VendorTable";
import VendorFormDialog from "@/components/dashboard/vendors/VendorFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/vendors/DeleteConfirmationDialog";

export default function VendorsPage() {
  const [search, setSearch] = useState("");

  const [refresh, setRefresh] = useState(0);

  const [selectedVendor, setSelectedVendor] =
    useState<Vendor | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  function handleAddVendor() {
    setSelectedVendor(null);
    setFormOpen(true);
  }

  function handleEditVendor(vendor: Vendor) {
    setSelectedVendor(vendor);
    setFormOpen(true);
  }

  function handleDeleteVendor(vendor: Vendor) {
    setSelectedVendor(vendor);
    setDeleteOpen(true);
  }

  function handleSuccess() {
    setRefresh((prev) => prev + 1);

    setFormOpen(false);
    setDeleteOpen(false);

    setSelectedVendor(null);
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Vendors
        </h1>

        <p className="text-muted-foreground">
          Manage all vendors.
        </p>
      </div>

      <VendorToolbar
        search={search}
        onSearchChange={setSearch}
        onAddVendor={handleAddVendor}
      />

      <VendorTable
        search={search}
        refresh={refresh}
        onEdit={handleEditVendor}
        onDelete={handleDeleteVendor}
      />

      <VendorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={selectedVendor}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        vendor={selectedVendor}
        onSuccess={handleSuccess}
      />
    </main>
  );
}