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

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/api/categories";

/**
 * Get All Categories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(BASE_URL, {
    cache: "no-store",
  });

  const result: ApiResponse<Category[]> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch categories."
    );
  }

  return result.data;
}

/**
 * Get Single Category
 */
export async function getCategory(
  id: string
): Promise<Category> {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      cache: "no-store",
    }
  );

  const result: ApiResponse<Category> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch category."
    );
  }

  return result.data;
}

/**
 * Create Category
 */
export async function createCategory(
  data: CategoryFormData
): Promise<Category> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Category> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to create category."
    );
  }

  return result.data;
}

/**
 * Update Category
 */
export async function updateCategory(
  id: string,
  data: CategoryFormData
): Promise<Category> {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result: ApiResponse<Category> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to update category."
    );
  }

  return result.data;
}

/**
 * Delete Category
 */
export async function deleteCategory(
  id: string
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  const result: ApiResponse<null> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to delete category."
    );
  }
}