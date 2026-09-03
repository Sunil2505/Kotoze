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

  const [deleteOpen, setDeleteOpen] = useState(false);

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
    setRefresh((previous) => previous + 1);

    setSelectedVendor(null);

    setFormOpen(false);
    setDeleteOpen(false);
  }

  return (
    <main className="flex h-full min-h-0 flex-col p-6">

      {/* =========================
          PAGE HEADER - FIXED
      ========================== */}
      <div className="shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">
          Vendors
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage all vendors.
        </p>
      </div>

      {/* =========================
          TOOLBAR - FIXED
      ========================== */}
      <div className="mt-6 shrink-0">
        <VendorToolbar
          search={search}
          onSearchChange={setSearch}
          onAddVendor={handleAddVendor}
        />
      </div>

      {/* =========================
          TABLE AREA - SCROLLABLE
      ========================== */}
      <div className="mt-6 min-h-0 flex-1 overflow-hidden">
        <VendorTable
          search={search}
          refresh={refresh}
          onEdit={handleEditVendor}
          onDelete={handleDeleteVendor}
        />
      </div>

      {/* =========================
          ADD / EDIT DIALOG
      ========================== */}
      <VendorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={selectedVendor}
        onSuccess={handleSuccess}
      />

      {/* =========================
          DELETE DIALOG
      ========================== */}
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        vendor={selectedVendor}
        onSuccess={handleSuccess}
      />

    </main>
  );
}