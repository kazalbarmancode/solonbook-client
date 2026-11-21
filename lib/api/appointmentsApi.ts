import { authClient } from "../auth-client";
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

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface AppointmentPayload {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
}

export interface Appointment {
  _id: string;
  userId: string;
  serviceId: string;
  serviceName: string;

  serviceCategory: string;
  serviceImage: string;

  price: number;
  duration: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  paymentStatus: "Unpaid" | "Paid";
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
}

export const createAppointmentApi = async (
  data: AppointmentPayload
): Promise<Appointment> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Booking failed");
  }

  return result.data;
};

export const getMyAppointmentsApi = async (
  userId: string
): Promise<Appointment[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/appointments/user/${encodeURIComponent(userId)}`,
    { headers }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch appointments");
  }

  return result.data;
};

export const getSingleAppointmentApi = async (
  id: string
): Promise<Appointment> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/appointments/${id}`,
    { headers }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch appointment details"
    );
  }

  return result.data;
};
export const deleteAppointmentApi = async (
  id: string
): Promise<void> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/appointments/${id}`,
    {
      method: "DELETE",
      headers,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to cancel appointment");
  }
};
 export const rescheduleAppointmentApi = async (
  id: string,
  appointmentDate: string,
  timeSlot: string
): Promise<Appointment> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/appointments/${id}/reschedule`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        appointmentDate,
        timeSlot,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to reschedule appointment");
  }

  return result.data;
};
export const getAllAppointmentsApi = async (): Promise<Appointment[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/admin/appointments`,
    { headers }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch appointments");
  }

  return result.data;
};
export const updateAppointmentStatusApi = async (
  id: string,
  status: Appointment["status"]
): Promise<Appointment> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/admin/appointments/${id}/status`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update appointment");
  }

  return result.data;
};