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

const BASE_URL = "/api/products";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      error.message || "Something went wrong"
    );
  }

  return res.json();
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function getProduct(
  id: string
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function createProduct(
  data: Partial<Product>
): Promise<Product> {
  const res = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteProduct(
  id: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse(res);
}