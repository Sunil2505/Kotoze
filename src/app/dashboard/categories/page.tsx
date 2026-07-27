"use client";

import { useState } from "react";

import { Category } from "@/lib/api/category";

import CategoryToolbar from "@/components/dashboard/categories/CategoryToolbar";
import CategoryTable from "@/components/dashboard/categories/CategoryTable";
import CategoryFormDialog from "@/components/dashboard/categories/CategoryFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/categories/DeleteConfirmationDialog";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  function refreshTable() {
    setRefreshKey((prev) => prev + 1);
  }

  function handleAddCategory() {
    setSelectedCategory(null);
    setFormOpen(true);
  }

  function handleEdit(category: Category) {
    setSelectedCategory(category);
    setFormOpen(true);
  }

  function handleDelete(category: Category) {
    setSelectedCategory(category);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">
      <CategoryToolbar
        search={search}
        onSearchChange={setSearch}
        onAddCategory={handleAddCategory}
      />

      <CategoryTable
        search={search}
        refresh={refreshKey}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
        onSuccess={() => {
          refreshTable();
          setFormOpen(false);
        }}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
        onSuccess={() => {
          refreshTable();
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}