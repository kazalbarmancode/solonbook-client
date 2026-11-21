
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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

// Get JWT Authentication Headers
const getAuthHeaders = async () => {
  const tokenResponse = await authClient.token();
  const token = tokenResponse.data?.token;

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Common API Request
const apiRequest = async (
  url: string,
  options: RequestInit = {},
  requiresAuth = false
) => {
  const headers = requiresAuth
    ? await getAuthHeaders()
    : {
        "Content-Type": "application/json",
        ...options.headers,
      };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// GET - All Services (Public)
export const getAllServicesApi = (): Promise<Service[]> =>
  apiRequest("/futured-all");

// POST - Add Service (Admin Only)
export const addServiceApi = (data: ServicePayload) =>
  apiRequest(
    "/admin/services",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );

// GET - Single Service (Public)
export const getSingleServiceApi = async (
  id: string
): Promise<Service> => {
  return apiRequest(`/futured-all/${id}`);
};

// PATCH - Update Service (Admin Only)
export const updateServiceApi = async (
  id: string,
  data: ServicePayload
) => {
  return apiRequest(
    `/admin/services/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    true
  );
};

// PATCH - Update Service Status (Admin Only)
export const updateServiceStatusApi = (
  id: string,
  isActive: boolean
) =>
  apiRequest(
    `/admin/services/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    },
    true
  );

// DELETE - Delete Service (Admin Only)
export const deleteServiceApi = (id: string) =>
  apiRequest(
    `/admin/services/${id}`,
    {
      method: "DELETE",
    },
    true
  );
