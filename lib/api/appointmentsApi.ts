
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
  price: number;
  duration: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid";
  createdAt: string;
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