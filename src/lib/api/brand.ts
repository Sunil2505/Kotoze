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

export interface BrandFormData {
  name: string;

  description?: string;

  logo?: string;
  website?: string;

  sortOrder: number;

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

const BASE_URL = "/api/brands";

async function handleResponse(res: Response) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  const result = await handleResponse(res);
  return result.data;
}

export async function getBrand(
  id: string
): Promise<Brand> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  const result = await handleResponse(res);
  return result.data;
}

export async function createBrand(
  data: BrandFormData
): Promise<Brand> {
  const res = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await handleResponse(res);
  return result.data;
}

export async function updateBrand(
  id: string,
  data: BrandFormData
): Promise<Brand> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await handleResponse(res);
  return result.data;
}

export async function deleteBrand(
  id: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse(res);
}