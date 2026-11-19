
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AppointmentPayload {
  userId: string;
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
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  const response = await fetch(
    `${API_URL}/appointments/user/${userId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch appointments"
    );
  }

  return result.data;
};
export const getSingleAppointmentApi = async (
  id: string,
  userId: string
): Promise<Appointment> => {
  const response = await fetch(
    `${API_URL}/appointments/${id}?userId=${encodeURIComponent(userId)}`
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
  id: string,
  userId: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete appointment");
  }
};
export const rescheduleAppointmentApi = async (
  id: string,
  userId: string,
  appointmentDate: string,
  timeSlot: string
): Promise<Appointment> => {
  const response = await fetch(
    `${API_URL}/appointments/${id}/reschedule`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
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
// GET ALL APPOINTMENTS FOR ADMIN
export const getAllAppointmentsApi = async (): Promise<Appointment[]> => {
  const response = await fetch(`${API_URL}/admin/appointments`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch appointments");
  }

  return result.data;
};

// UPDATE APPOINTMENT STATUS
export const updateAppointmentStatusApi = async (
  id: string,
  status: Appointment["status"]
): Promise<Appointment> => {
  const response = await fetch(
    `${API_URL}/admin/appointments/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update appointment");
  }

  return result.data;
};