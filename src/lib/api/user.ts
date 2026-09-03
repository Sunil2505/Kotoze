export interface User {
  _id: string;

  roleId: {
    _id: string;
    name?: string;
    code: string;
  };

  vendorId?: {
    _id: string;
    businessName?: string;
  } | null;

  username: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  mobile: string;

  avatar?: string;

  isEmailVerified: boolean;
  isMobileVerified: boolean;

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";

  lastLoginAt?: string | null;

  isDeleted: boolean;
  deletedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface CreateUserInput {
  roleId: string;
  vendorId?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

export interface UpdateUserInput {
  roleId?: string;
  vendorId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

export async function getUsers(): Promise<UsersResponse> {
  const response = await fetch("/api/users", {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to fetch users."
    );
  }

  return response.json();
}

export async function getUser(
  id: string
): Promise<UserResponse> {
  const response = await fetch(
    `/api/users/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to fetch user."
    );
  }

  return response.json();
}

export async function createUser(
  data: CreateUserInput
): Promise<UserResponse> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to create user."
    );
  }

  return response.json();
}

export async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<UserResponse> {
  const response = await fetch(
    `/api/users/${id}`,
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
      error?.message ?? "Failed to update user."
    );
  }

  return response.json();
}

export async function deleteUser(
  id: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch(
    `/api/users/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message ?? "Failed to delete user."
    );
  }

  return response.json();
}