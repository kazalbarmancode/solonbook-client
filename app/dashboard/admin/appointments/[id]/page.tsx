"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Scissors,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAllAppointmentsApi,
  updateAppointmentStatusApi,
  type Appointment,
} from "@/lib/api/appointmentsApi";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-amber-100 text-amber-700",
};

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function AdminAppointmentDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadAppointmentById = useCallback(async () => {
    if (!id) {
      setAppointment(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      const appointments = await getAllAppointmentsApi();
      const found =
        appointments.find((item) => item._id === id) ?? null;
      setAppointment(found);
      return found;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load appointment details"
      );
      setAppointment(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    const runInitialLoad = async () => {
      setLoading(true);
      try {
        const appointments = await getAllAppointmentsApi();
        const found =
          appointments.find((item) => item._id === id) ?? null;
        if (!ignore) {
          setAppointment(found);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load appointment details"
          );
          setAppointment(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void runInitialLoad();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleStatusUpdate = async (status: Appointment["status"]) => {
    if (!appointment || updating) return;

    try {
      setUpdating(true);

      const updatedAppointment = await updateAppointmentStatusApi(
        appointment._id,
        status
      );

      setAppointment(updatedAppointment);
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update appointment"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#873C52]" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-center">
        <XCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-xl font-bold text-[#55102A]">
          Appointment Not Found
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          This appointment may have been removed.
        </p>

        <Link
          href="/dashboard/admin/appointments"
          className="mt-5 rounded-xl bg-[#873C52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#55102A]"
        >
          Back to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/dashboard/admin/appointments"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#873C52]"
          >
            <ArrowLeft size={17} />
            Back to Appointments
          </Link>

          <h1 className="text-2xl font-bold text-[#55102A] sm:text-3xl">
            Appointment Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage this appointment request.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAppointmentById()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8C9CE] px-4 py-2.5 text-sm font-semibold text-[#873C52] transition hover:bg-[#FFF5F6] disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Status and Payment */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#F0E4E5] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Appointment Status</p>
          <div className="mt-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                statusStyles[appointment.status] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F0E4E5] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Payment Status</p>
          <div className="mt-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                paymentStyles[appointment.paymentStatus] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {appointment.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div className="overflow-hidden rounded-2xl border border-[#F0E4E5] bg-white shadow-sm">
        <div className="border-b border-[#F0E4E5] px-5 py-4 sm:px-6">
          <h2 className="flex items-center gap-2 font-bold text-[#55102A]">
            <Scissors size={19} />
            Service Information
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[180px_1fr] sm:p-6">
          <div className="relative h-44 overflow-hidden rounded-xl bg-[#FFF5F6] sm:h-40">
            {appointment.serviceImage ? (
              <Image
                src={appointment.serviceImage}
                alt={appointment.serviceName || "Service"}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#873C52]">
                <Scissors size={40} />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-[#873C52]">
              {appointment.serviceCategory || "Salon Service"}
            </p>

            <h3 className="mt-2 text-xl font-bold text-[#55102A]">
              {appointment.serviceName}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Service Price</p>
                <p className="mt-1 text-lg font-bold text-[#873C52]">
                  ৳{appointment.price}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {appointment.duration}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Information */}
      <div className="rounded-2xl border border-[#F0E4E5] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-[#55102A]">
          <CalendarDays size={19} />
          Booking Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Appointment Date"
            value={formatDate(appointment.appointmentDate)}
          />

          <InfoItem
            icon={<Clock size={18} />}
            label="Appointment Time"
            value={appointment.timeSlot}
          />

          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Request Date"
            value={formatDate(appointment.createdAt)}
          />

          <InfoItem
            icon={<CreditCard size={18} />}
            label="Payment Status"
            value={appointment.paymentStatus}
          />
        </div>
      </div>

      {/* Customer Information */}
      <div className="rounded-2xl border border-[#F0E4E5] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-[#55102A]">
          <User size={19} />
          Customer Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <InfoItem
            icon={<User size={18} />}
            label="Customer Name"
            value={appointment.customerName || "Unknown Customer"}
          />

          <InfoItem
            icon={<Mail size={18} />}
            label="Customer Email"
            value={appointment.customerEmail || "Email not available"}
          />

          <InfoItem
            icon={<User size={18} />}
            label="Customer ID"
            value={appointment.userId}
          />
        </div>
      </div>

      {/* Admin Actions */}
      <div className="rounded-2xl border border-[#F0E4E5] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-[#55102A]">Manage Appointment</h2>

        <p className="mt-1 text-sm text-gray-500">
          Update the appointment status.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {appointment.status === "Pending" && (
            <>
              <button
                type="button"
                onClick={() => void handleStatusUpdate("Confirmed")}
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                Confirm Appointment
              </button>

              <button
                type="button"
                onClick={() => void handleStatusUpdate("Cancelled")}
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle size={17} />
                Cancel Appointment
              </button>
            </>
          )}

          {appointment.status === "Confirmed" && (
            <>
              <button
                type="button"
                onClick={() => void handleStatusUpdate("Completed")}
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                Mark as Completed
              </button>

              <button
                type="button"
                onClick={() => void handleStatusUpdate("Cancelled")}
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle size={17} />
                Cancel Appointment
              </button>
            </>
          )}

          {updating && (
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin" />
              Updating...
            </span>
          )}

          {(appointment.status === "Completed" ||
            appointment.status === "Cancelled") && (
            <p className="text-sm text-gray-500">
              This appointment is already {appointment.status.toLowerCase()}.
              No further status changes are available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-[#FFF1F3] p-2 text-[#873C52]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-all text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}