
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ServicePayload {
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  isActive: boolean;
}

const apiRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// GET
export const getAllServicesApi = (): Promise<Service[]> =>
  apiRequest("/futured-all");

// POST
export const addServiceApi = (data: ServicePayload) =>
  apiRequest("/admin/services", {
    method: "POST",
    body: JSON.stringify(data),
  });

// PUT
export const updateServiceApi = (
  id: string,
  data: ServicePayload
) =>
  apiRequest(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// PATCH
export const updateServiceStatusApi = (
  id: string,
  isActive: boolean
) =>
  apiRequest(`/admin/services/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

// DELETE
export const deleteServiceApi = (id: string) =>
  apiRequest(`/admin/services/${id}`, {
    method: "DELETE",
  });
