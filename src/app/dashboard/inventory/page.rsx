"use client";

import { useState } from "react";

import { Inventory } from "@/lib/api/inventory";

import InventoryToolbar from "@/components/dashboard/inventory/InventoryToolbar";
import InventoryTable from "@/components/dashboard/inventory/InventoryTable";
import InventorySettingsDialog from "@/components/dashboard/inventory/InventorySettingsDialog";
import DeleteConfirmationDialog from "@/components/dashboard/inventory/DeleteConfirmationDialog";
// We'll create this next
import StockInDialog from "@/components/dashboard/inventory/StockInDialog";

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const [refresh, setRefresh] = useState(0);

  const [selectedInventory, setSelectedInventory] =
    useState<Inventory | null>(null);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [stockInOpen, setStockInOpen] =
    useState(false);

  function handleStockIn() {
    setStockInOpen(true);
  }

  function handleEditInventory(
    inventory: Inventory
  ) {
    setSelectedInventory(inventory);
    setSettingsOpen(true);
  }

  function handleDeleteInventory(
    inventory: Inventory
  ) {
    setSelectedInventory(inventory);
    setDeleteOpen(true);
  }

  function handleSuccess() {
    setRefresh((prev) => prev + 1);

    setSelectedInventory(null);

    setSettingsOpen(false);
    setDeleteOpen(false);
    setStockInOpen(false);
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Inventory
        </h1>

        <p className="text-muted-foreground">
          Manage inventory and stock settings.
        </p>
      </div>

      <InventoryToolbar
        search={search}
        onSearchChange={setSearch}
        onStockIn={handleStockIn}
      />

      <InventoryTable
        search={search}
        refresh={refresh}
        onEdit={handleEditInventory}
        onDelete={handleDeleteInventory}
      />

      <InventorySettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        inventory={selectedInventory}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        inventory={selectedInventory}
        onSuccess={handleSuccess}
      />

      <StockInDialog
        open={stockInOpen}
        onOpenChange={setStockInOpen}
        onSuccess={handleSuccess}
      />
    </main>
  );
}