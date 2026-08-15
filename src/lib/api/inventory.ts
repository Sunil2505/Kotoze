export interface Inventory {
  _id: string;

  productId:
    | string
    | {
        _id: string;
        name: string;
        sku: string;
      };

  availableStock: number;
  reservedStock: number;

  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;

  status:
    | "ACTIVE"
    | "INACTIVE"
    | "BLOCKED";

  createdAt: string;
  updatedAt: string;
}

export interface InventoryFormData {
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;

  status:
    | "ACTIVE"
    | "INACTIVE"
    | "BLOCKED";
}

export interface StockInData {
  productId: string;

  quantity: number;

  transactionType: string;

  referenceType: string;

  referenceId?: string;

  referenceNumber?: string;

  remarks?: string;

  createdBy?: string;
}

const BASE_URL = "/api/inventory";

async function handleResponse(
  res: Response
) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

export async function getInventories(): Promise<Inventory[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  const result = await handleResponse(res);

return result.data;
}

export async function getInventory(
  id: string
): Promise<Inventory> {
  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      cache: "no-store",
    }
  );

  const result = await handleResponse(res);

return result.data;
}

export async function updateInventory(
  id: string,
  data: InventoryFormData
): Promise<Inventory> {
  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await handleResponse(res);

return result.data;
}

export async function deleteInventory(
  id: string
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  await handleResponse(res);
}

export async function stockIn(
  data: StockInData
): Promise<Inventory> {
  const res = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify(data),
  });

 const result = await handleResponse(res);

return result.data;
}