export interface Role {
  _id: string;
  name: string;
  code: string;
  description?: string;

  isSystem: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface RolesResponse {
  success: boolean;
  message: string;
  data: Role[];
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface CreateRoleInput {
  name: string;
  code: string;
  description?: string;
  isSystem?: boolean;
  isActive?: boolean;
}

export interface UpdateRoleInput {
  name?: string;
  code?: string;
  description?: string;
  isSystem?: boolean;
  isActive?: boolean;
}

export async function getRoles(): Promise<RolesResponse> {
  const response = await fetch("/api/roles", {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to fetch roles."
    );
  }

  return response.json();
}

export async function getRole(
  id: string
): Promise<RoleResponse> {
  const response = await fetch(
    `/api/roles/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to fetch role."
    );
  }

  return response.json();
}

export async function createRole(
  data: CreateRoleInput
): Promise<RoleResponse> {
  const response = await fetch("/api/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to create role."
    );
  }

  return response.json();
}

export async function updateRole(
  id: string,
  data: UpdateRoleInput
): Promise<RoleResponse> {
  const response = await fetch(
    `/api/roles/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to update role."
    );
  }

  return response.json();
}

export async function deleteRole(
  id: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch(
    `/api/roles/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to delete role."
    );
  }

  return response.json();
}