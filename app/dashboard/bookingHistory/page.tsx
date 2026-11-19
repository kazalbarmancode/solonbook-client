
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Search,
  Eye,
  History,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  getMyAppointmentsApi,
  type Appointment,
} from "@/lib/api/appointmentsApi";

type StatusFilter = "All" | "Completed" | "Cancelled";
type PaymentFilter = "All" | "Paid" | "Unpaid";

export default function BookingHistoryPage() {
  const { data: session, isPending } = useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("All");

  const userId = session?.user?.id;

  useEffect(() => {
    if (isPending || !userId) return;

    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const data = await getMyAppointmentsApi(userId);

        if (isMounted) {
          setAppointments(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load booking history"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [userId, isPending]);

  const historyAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.status === "Completed" ||
        appointment.status === "Cancelled"
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return historyAppointments.filter((appointment) => {
      const matchesSearch =
        appointment.serviceName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.serviceCategory
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        appointment.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [historyAppointments, search, statusFilter, paymentFilter]);

  const completedCount = historyAppointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const cancelledCount = historyAppointments.filter(
    (appointment) => appointment.status === "Cancelled"
  ).length;

  const paidCount = historyAppointments.filter(
    (appointment) => appointment.paymentStatus === "Paid"
  ).length;

  const stats = [
    {
      title: "Total History",
      value: historyAppointments.length,
      icon: History,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Cancelled",
      value: cancelledCount,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Paid",
      value: paidCount,
      icon: CreditCard,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const getStatusStyle = (status: string) => {
    if (status === "Completed") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  const getPaymentStyle = (status: string) => {
    return status === "Paid"
      ? "bg-green-50 text-green-700"
      : "bg-amber-50 text-amber-700";
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCreatedDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isPending || (loading && !!userId)) {
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

  return (
    <div className="min-h-screen space-y-8 bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">
      {/* Page Heading */}
      <div>
        <p className="text-sm font-semibold text-[#873C52]">
          Customer Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#55102A]">
          Booking History
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View your completed and cancelled salon appointments.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#F1E4E5] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-3 text-3xl font-bold text-[#292323]">
                    {stat.value}
                  </h2>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* History List */}
      <section className="overflow-hidden rounded-2xl border border-[#F1E4E5] bg-white shadow-sm">
        <div className="border-b border-[#F1E4E5] p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#292323]">
                Previous Appointments
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {historyAppointments.length} booking(s) in your history
              </p>
            </div>

            {/* Search and Filters */}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative md:col-span-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search service..."
                  className="w-full rounded-xl border border-[#E8C9CE] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="rounded-xl border border-[#E8C9CE] bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value as PaymentFilter)
                }
                className="rounded-xl border border-[#E8C9CE] bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4 p-5 sm:p-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col gap-4 rounded-2xl border border-[#F1E4E5] p-4 transition hover:border-[#E8C9CE] sm:flex-row sm:items-center"
              >
                {/* Service Image */}
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#FFF1F3] sm:w-28">
                  {appointment.serviceImage ? (
                    <Image
                      src={appointment.serviceImage}
                      alt={appointment.serviceName}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#873C52]">
                      <History size={30} />
                    </div>
                  )}
                </div>

                {/* Service Information */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[#292323]">
                    {appointment.serviceName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {appointment.serviceCategory}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      {formatDate(appointment.appointmentDate)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock size={15} />
                      {appointment.timeSlot}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Booked on: {formatCreatedDate(appointment.createdAt)}
                  </p>
                </div>

                {/* Price and Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 sm:min-w-36 sm:flex-col sm:items-end">
                  <p className="text-lg font-bold text-[#55102A]">
                    ৳{appointment.price}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                        appointment.paymentStatus
                      )}`}
                    >
                      {appointment.paymentStatus}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/appointments/${appointment._id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E8C9CE] px-3 py-2 text-sm font-semibold text-[#873C52] transition hover:bg-[#FFF1F3]"
                  >
                    <Eye size={16} />
                    Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F3] text-[#873C52]">
                <History size={30} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#292323]">
                {historyAppointments.length === 0
                  ? "No Booking History Yet"
                  : "No Matching Appointments"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {historyAppointments.length === 0
                  ? "Your completed and cancelled appointments will appear here."
                  : "Try changing your search or filter options."}
              </p>

              {historyAppointments.length === 0 && (
                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#873C52] px-5 py-3 font-semibold text-white transition hover:bg-[#6F3044]"
                >
                  Explore Services
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
