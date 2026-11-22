
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL

export interface AdminUser {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  image?: string;
  role?: string;
  createdAt?: string;
  isBlocked?: boolean;
  banned?: boolean;
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

// Get All Users (Admin Only)
export const getAllUsersApi = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result.data;
};

// Update User Status (Admin Only)
export const updateUserStatusApi = async (
  id: string,
  isBlocked: boolean
): Promise<AdminUser> => {
  const response = await fetch(
    `${API_URL}/admin/users/${id}/status`,
    {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ isBlocked }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user");
  }

  return result.data;
};
