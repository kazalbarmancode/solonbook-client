
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  Scissors,
  Eye,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  getMyAppointmentsApi,
  type Appointment,
} from "@/lib/api/appointmentsApi";

export default function CustomerDashboard() {
  const { data: session, isPending } = useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    if (isPending || !userId) return;

    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        const data = await getMyAppointmentsApi(userId);

        if (isMounted) {
          setAppointments(data);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load appointments";

          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [userId, isPending]);

  if (isPending || loading && !!userId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8C9CE] border-t-[#873C52]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#55102A]">
            Please sign in to continue
          </h2>
          <Link
            href="/sign-In"
            className="mt-4 inline-block rounded-xl bg-[#873C52] px-6 py-3 font-semibold text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard statistics
  const totalAppointments = appointments.length;

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Pending" ||
      appointment.status === "Confirmed"
  ).length;

  const completedAppointments = appointments.filter(
  (appointment) => appointment.status === "Completed"
).length;

  const stats = [
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Completed",
      value: completedAppointments,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  const recentAppointments = appointments.slice(0, 3);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700";
      case "Pending":
        return "bg-amber-50 text-amber-700";
      case "Completed":
        return "bg-blue-50 text-blue-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#55102A] to-[#873C52] p-7 text-white sm:p-10">
        <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-4 flex items-center gap-2 text-sm text-[#E8C9CE]">
            Welcome to SalonBook
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Hello, {session.user.name || "Customer"}!
          </h1>

          <p className="mt-3 leading-7 text-white/75">
            Welcome to your personal beauty dashboard.
            Manage your appointments and enjoy your beauty journey with us.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#873C52] transition hover:bg-[#E8C9CE]"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <section>
        <h2 className="mb-5 text-xl font-bold text-[#292323]">
          Dashboard Overview
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#F1E4E5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-[#292323]">
                      {stat.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-4 ${stat.color}`}>
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Appointments */}
      {appointments.length > 0 ? (
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#292323]">
                Recent Appointments
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest appointment requests
              </p>
            </div>

            <Link
              href="/dashboard/appointments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#873C52] hover:text-[#55102A]"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col gap-4 rounded-2xl border border-[#F1E4E5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-bold text-[#292323]">
                    {appointment.serviceName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {appointment.serviceCategory}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      {appointment.appointmentDate}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock size={15} />
                      {appointment.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>

                  <Link
                    href={`/dashboard/appointments/${appointment._id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E8C9CE] px-3 py-2 text-sm font-semibold text-[#873C52] transition hover:bg-[#FFF1F3]"
                  >
                    <Eye size={16} />
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Empty Appointment State */
        <section className="rounded-2xl border border-dashed border-[#E8C9CE] bg-white p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F3] text-[#873C52]">
            <Scissors size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#292323]">
            Ready for Your Next Beauty Experience?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            You havent booked an appointment yet. Explore our professional
            salon services and book your first visit.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#873C52] px-6 py-3 font-semibold text-white transition hover:bg-[#6F3044]"
          >
            Book Your Appointment
            <ArrowRight size={18} />
          </Link>
        </section>
      )}
    </div>
  );
}
