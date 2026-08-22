export interface AuthRole {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile: string;
  roleId: AuthRole;
  vendorId?: string | null;
}

export interface AuthMeResponse {
  success: boolean;
  user: AuthUser;
}

export async function getCurrentUser(): Promise<AuthMeResponse> {
  const response = await fetch("/api/auth/me", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Authentication required.");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}