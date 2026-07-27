export interface Brand {
  _id: string;
  name: string;
  slug: string;

  description?: string;

  logo?: string;
  website?: string;

  sortOrder: number;

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";

  createdAt: string;
  updatedAt: string;
}

const BASE_URL = "/api/brands";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function getBrand(
  id: string
): Promise<Brand> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function createBrand(
  data: Partial<Brand>
): Promise<Brand> {
  const res = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateBrand(
  id: string,
  data: Partial<Brand>
): Promise<Brand> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteBrand(
  id: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse(res);
}