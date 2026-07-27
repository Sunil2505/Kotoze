export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  image?: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/api/categories";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });

  const result: ApiResponse<Category[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch categories.");
  }

  return result.data;
}

export async function getCategory(
  id: string
): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch category.");
  }

  return result.data;
}

export async function createCategory(
  data: Partial<Category>
): Promise<Category> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create category.");
  }

  return result.data;
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update category.");
  }

  return result.data;
}

export async function deleteCategory(
  id: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const result: ApiResponse<null> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete category.");
  }
}