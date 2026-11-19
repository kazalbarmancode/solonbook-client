
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  RefreshCw,
  ClipboardList,
  Scissors,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllAppointmentsApi,
  updateAppointmentStatusApi,
  type Appointment,
} from "@/lib/api/appointmentsApi";

type StatusFilter =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllAppointmentsApi();
      setAppointments(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  let ignore = false;

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const data = await getAllAppointmentsApi();

      if (!ignore) {
        setAppointments(data);
      }
    } catch (error) {
      if (!ignore) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load appointments"
        );
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadAppointments();

  return () => {
    ignore = true;
  };
}, []);

  const handleStatusUpdate = async (
    id: string,
    status: Appointment["status"]
  ) => {
    try {
      setUpdatingId(id);

      const updatedAppointment = await updateAppointmentStatusApi(
        id,
        status
      );

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, ...updatedAppointment }
            : appointment
        )
      );

      toast.success(`Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update appointment"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.serviceName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.userId
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.serviceCategory
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending",
      value: appointments.filter((a) => a.status === "Pending").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Confirmed",
      value: appointments.filter((a) => a.status === "Confirmed").length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Completed",
      value: appointments.filter((a) => a.status === "Completed").length,
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Cancelled",
      value: appointments.filter((a) => a.status === "Cancelled").length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700";
      case "Confirmed":
        return "bg-green-50 text-green-700";
      case "Completed":
        return "bg-blue-50 text-blue-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8C9CE] border-t-[#873C52]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#873C52]">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#55102A]">
            Manage Appointments
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and manage all customer appointment requests.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8C9CE] bg-white px-4 py-3 text-sm font-semibold text-[#873C52] transition hover:bg-[#FFF1F3]"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Appointment List */}
      <section className="overflow-hidden rounded-2xl border border-[#F1E4E5] bg-white shadow-sm">
        <div className="border-b border-[#F1E4E5] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-[#292323]">
            All Appointments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer bookings and update their status.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by service or customer ID..."
                className="w-full rounded-xl border border-[#E8C9CE] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#873C52]"
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
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col gap-4 rounded-2xl border border-[#F1E4E5] p-4 transition hover:border-[#E8C9CE] lg:flex-row lg:items-center"
              >
                {/* Image */}
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#FFF1F3] sm:w-28">
                  {appointment.serviceImage ? (
                    <Image
                      src={appointment.serviceImage}
                      alt={appointment.serviceName}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#873C52]">
                      <Scissors size={30} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[#292323]">
                    {appointment.serviceName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {appointment.serviceCategory}
                  </p>

                  <p className="mt-2 break-all text-xs text-gray-400">
                    Customer ID: {appointment.userId}
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

                    <span className="flex items-center gap-1.5">
                      <CreditCard size={15} />
                      {appointment.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col gap-3 lg:min-w-48 lg:items-end">
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

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/admin/appointments/${appointment._id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8C9CE] px-3 py-2 text-xs font-semibold text-[#873C52] hover:bg-[#FFF1F3]"
                    >
                      <Eye size={15} />
                      Details
                    </Link>

                    {appointment.status === "Pending" && (
                      <>
                        <button
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              "Confirmed"
                            )
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          Confirm
                        </button>

                        <button
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              "Cancelled"
                            )
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === "Confirmed" && (
                      <>
                        <button
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              "Completed"
                            )
                          }
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          Complete
                        </button>

                        <button
                          disabled={updatingId === appointment._id}
                          onClick={() =>
                            handleStatusUpdate(
                              appointment._id,
                              "Cancelled"
                            )
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>

                  {updatingId === appointment._id && (
                    <p className="text-xs text-gray-400">
                      Updating appointment...
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F3] text-[#873C52]">
                <CalendarDays size={30} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#292323]">
                No Appointments Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                No appointments match your search or selected filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
