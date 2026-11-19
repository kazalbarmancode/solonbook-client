
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Scissors,
  CreditCard,
  ClipboardList,
  Loader2,
  MessageSquare,
} from "lucide-react";

import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import {
  getSingleAppointmentApi,
  type Appointment,
} from "@/lib/api/appointmentsApi";

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const appointmentId = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = session?.user?.id;

  useEffect(() => {
    if (isPending || !userId || !appointmentId) return;

    let isMounted = true;

    const fetchAppointment = async () => {
      try {
        setError("");

        const data = await getSingleAppointmentApi(
          appointmentId,
          userId
        );

        if (isMounted) {
          setAppointment(data);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load appointment details";

          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointment();

    return () => {
      isMounted = false;
    };
  }, [appointmentId, userId, isPending]);

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCreatedDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPaymentStyle = (status: string) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
  };

  // Session loading
  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#873C52]" />
      </div>
    );
  }

  // Sign In required
  if (!userId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-[#55102A]">
          Please Sign In
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to view your appointment details.
        </p>

        <Link
          href="/sign-In"
          className="mt-5 rounded-lg bg-[#873C52] px-6 py-3 text-sm font-semibold text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Data loading
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#873C52]" />
      </div>
    );
  }

  // Error or not found
  if (error || !appointment) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <ClipboardList className="h-12 w-12 text-[#D9AEB7]" />

        <h2 className="mt-4 text-xl font-bold text-[#55102A]">
          Appointment Not Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error || "We couldn't find this appointment."}
        </p>

        <Link
          href="/dashboard/appointments"
          className="mt-5 rounded-lg bg-[#873C52] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Back Button */}
      <Link
        href="/dashboard/appointments"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#873C52] transition hover:text-[#55102A]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Appointments
      </Link>

      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-[#873C52]">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#55102A] sm:text-3xl">
          Appointment Details
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your complete appointment information.
        </p>
      </div>

      {/* Service Card */}
      <div className="overflow-hidden rounded-xl border border-[#E8C9CE] bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* Service Image */}
          <div className="relative min-h-[220px] bg-[#F9EEF0]">
            {appointment.serviceImage ? (
              <Image
                src={appointment.serviceImage}
                alt={appointment.serviceName}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center">
                <Scissors className="h-16 w-16 text-[#873C52]" />
              </div>
            )}
          </div>

          {/* Service Information */}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-sm font-semibold text-[#873C52]">
              {appointment.serviceCategory}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#55102A]">
              {appointment.serviceName}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Professional salon service
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs text-gray-400">Service Price</p>
                <p className="mt-1 text-2xl font-bold text-[#873C52]">
                  ৳{appointment.price}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="mt-1 font-semibold text-[#55102A]">
                  {appointment.duration}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Appointment Status</p>

          <span
            className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Payment Status</p>

          <span
            className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getPaymentStyle(
              appointment.paymentStatus
            )}`}
          >
            {appointment.paymentStatus}
          </span>
        </div>
      </div>

      {/* Appointment Information */}
      <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[#55102A]">
          Appointment Information
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-1 h-5 w-5 text-[#873C52]" />

            <div>
              <p className="text-xs text-gray-400">Appointment Date</p>
              <p className="mt-1 font-semibold text-gray-700">
                {formatDate(appointment.appointmentDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-[#873C52]" />

            <div>
              <p className="text-xs text-gray-400">Appointment Time</p>
              <p className="mt-1 font-semibold text-gray-700">
                {appointment.timeSlot}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClipboardList className="mt-1 h-5 w-5 text-[#873C52]" />

            <div>
              <p className="text-xs text-gray-400">Booking Request Date</p>
              <p className="mt-1 font-semibold text-gray-700">
                {formatCreatedDate(appointment.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 text-[#873C52]" />

            <div>
              <p className="text-xs text-gray-400">Total Price</p>
              <p className="mt-1 font-semibold text-gray-700">
                ৳{appointment.price}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Message */}
      <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#873C52]" />

          <h2 className="text-lg font-bold text-[#55102A]">
            Your Message
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-600">
          {appointment.message?.trim() || "No additional message provided."}
        </p>
      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-end">
        <Link
          href="/dashboard/appointments"
          className="inline-flex items-center gap-2 rounded-lg bg-[#873C52] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#55102A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Appointments
        </Link>
      </div>
    </div>
  );
}
