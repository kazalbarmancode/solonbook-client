
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export const getAllUsersApi = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_URL}/admin/users`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result.data;
};

export const updateUserStatusApi = async (
  id: string,
  isBlocked: boolean
): Promise<AdminUser> => {
  const response = await fetch(
    `${API_URL}/admin/users/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBlocked }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user");
  }

  return result.data;
};
