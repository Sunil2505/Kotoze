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

export interface VendorFormData {
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
}

const BASE_URL = "/api/vendors";

async function handleResponse(res: Response) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

export async function getVendors(): Promise<Vendor[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  const result = await handleResponse(res);
  return result.data;
}

export async function getVendor(
  id: string
): Promise<Vendor> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });

  const result = await handleResponse(res);
  return result.data;
}

export async function createVendor(
  data: VendorFormData
): Promise<Vendor> {
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

export async function updateVendor(
  id: string,
  data: VendorFormData
): Promise<Vendor> {
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

export async function deleteVendor(
  id: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse(res);
}