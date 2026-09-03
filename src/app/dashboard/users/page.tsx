"use client";

import { useState } from "react";

import UserToolbar from "@/components/dashboard/users/UserToolbar";
import UserTable from "@/components/dashboard/users/UserTable";
import UserFormDialog from "@/components/dashboard/users/UserFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/users/DeleteConfirmationDialog";
import UserViewDialog from "@/components/dashboard/users/UserViewDialog";

import { User } from "@/lib/api/user";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const [refresh, setRefresh] =
    useState(0);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

   const [viewOpen, setViewOpen] =
     useState(false);

  function handleAddUser() {
    setSelectedUser(null);
    setFormOpen(true);
  }

  function handleEditUser(user: User) {
    setSelectedUser(user);
    setFormOpen(true);
  }

function handleViewUser(user: User) {
  setSelectedUser(user);
  setViewOpen(true);
}

  function handleDeleteUser(user: User) {
    setSelectedUser(user);
    setDeleteOpen(true);
  }

function handleSuccess() {
  setRefresh(
    (previous) => previous + 1
  );

  setSelectedUser(null);

  setFormOpen(false);
  setDeleteOpen(false);
  setViewOpen(false);
}

  return (
    <main className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Users
        </h1>

        <p className="mt-1 text-base text-slate-500">
          Manage system users and their access roles.
        </p>
      </div>

      {/* Toolbar */}
      <UserToolbar
        search={search}
        onSearchChange={setSearch}
        onAddUser={handleAddUser}
      />

      {/* Table */}
      <UserTable
        search={search}
        refresh={refresh}
        onEdit={handleEditUser}
        onView={handleViewUser}
        onDelete={handleDeleteUser}
      />

{/* Add / Edit User */}
<UserFormDialog
  open={formOpen}
  onOpenChange={setFormOpen}
  user={selectedUser}
  onSuccess={handleSuccess}
/>

{/* View User */}
<UserViewDialog
  open={viewOpen}
  onOpenChange={setViewOpen}
  user={selectedUser}
/>

{/* Delete User */}
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onSuccess={handleSuccess}
      />
    </main>
  );
}