export interface Product {
  _id: string;

  sku: string;

  vendorId:
    | string
    | {
        _id: string;
        businessName: string;
        vendorCode: string;
      };

  categoryId:
    | string
    | {
        _id: string;
        name: string;
      };

  brandId:
    | string
    | {
        _id: string;
        name: string;
      };

  name: string;

  slug: string;

  shortDescription?: string;
  description?: string;

  costPrice: number;
  sellingPrice: number;
  comparePrice?: number;

  thumbnail?: string;

  featured: boolean;

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";

  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  vendorId: string;
  categoryId: string;
  brandId: string;

  name: string;

  shortDescription?: string;
  description?: string;

  costPrice: number;
  sellingPrice: number;
  comparePrice?: number;

  thumbnail?: string;

  featured: boolean;

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

const BASE_URL = "/api/products";

async function handleResponse(res: Response) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  const result = await handleResponse(res);

  return result.data;
}

export async function getProduct(
  id: string
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  const result = await handleResponse(res);

  return result.data;
}

export async function createProduct(
  data: ProductFormData
): Promise<Product> {
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

export async function updateProduct(
  id: string,
  data: ProductFormData
): Promise<Product> {
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

export async function deleteProduct(
  id: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse(res);
}