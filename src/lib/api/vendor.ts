export interface Vendor {
  _id: string;

  vendorCode: string;

  businessName: string;
  legalName?: string;

  contactPerson: string;

  email?: string;
  mobile: string;

  gstNumber?: string;
  panNumber?: string;

  status: "ACTIVE" | "INACTIVE" | "BLOCKED";

  approvalStatus:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

  createdAt: string;
  updatedAt: string;
}

const BASE_URL = "/api/vendors";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json();

    throw new Error(
      error.message || "Something went wrong"
    );
  }

  return res.json();
}

export async function getVendors(): Promise<Vendor[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function getVendor(
  id: string
): Promise<Vendor> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function createVendor(
  data: Partial<Vendor>
): Promise<Vendor> {
  const res = await fetch(BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateVendor(
  id: string,
  data: Partial<Vendor>
): Promise<Vendor> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteVendor(
  id: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse(res);
}