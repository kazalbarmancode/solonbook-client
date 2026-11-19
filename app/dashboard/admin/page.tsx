"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Scissors,
  Users,
  CalendarDays,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react"
import toast from "react-hot-toast"

import { getAllServicesApi, type Service } from "@/lib/api/servicesApi"

import { getAllUsersApi, type AdminUser } from "@/lib/api/usersApi"

import {
  getAllAppointmentsApi,
  type Appointment,
} from "@/lib/api/appointmentsApi"

export default function AdminDashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const [serviceData, userData, appointmentData] = await Promise.all([
        getAllServicesApi(),
        getAllUsersApi(),
        getAllAppointmentsApi(),
      ])

      setServices(serviceData)
      setUsers(userData)
      setAppointments(appointmentData)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard data"

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      try {
        const [serviceData, userData, appointmentData] = await Promise.all([
          getAllServicesApi(),
          getAllUsersApi(),
          getAllAppointmentsApi(),
        ])

        if (!isMounted) return

        setServices(serviceData)
        setUsers(userData)
        setAppointments(appointmentData)
      } catch (err) {
        if (!isMounted) return

        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data"

        setError(message)
        toast.error(message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const totalAppointments = appointments.length

    const pending = appointments.filter(
      (item) => item.status === "Pending"
    ).length

    const confirmed = appointments.filter(
      (item) => item.status === "Confirmed"
    ).length

    const completed = appointments.filter(
      (item) => item.status === "Completed"
    ).length

    const cancelled = appointments.filter(
      (item) => item.status === "Cancelled"
    ).length

    const totalCustomers = users.filter(
      (user) => (user.role || "customer").toLowerCase() === "customer"
    ).length

    const totalRevenue = appointments
      .filter((item) => item.paymentStatus === "Paid")
      .reduce((total, item) => total + Number(item.price || 0), 0)

    return {
      totalAppointments,
      pending,
      confirmed,
      completed,
      cancelled,
      totalCustomers,
      totalServices: services.length,
      totalRevenue,
    }
  }, [services, users, appointments])

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  }, [appointments])

  const statCards = [
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: Scissors,
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString("en-BD")}`,
      icon: Wallet,
      color: "bg-green-50 text-green-600",
    },
  ]

  const appointmentStats = [
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600 bg-red-50",
    },
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700"
      case "Confirmed":
        return "bg-blue-50 text-blue-700"
      case "Completed":
        return "bg-green-50 text-green-700"
      case "Cancelled":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-[#873C52]" size={38} />
          <p className="mt-3 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-700">Failed to load dashboard</p>

        <p className="mt-2 text-sm text-red-600">{error}</p>

        <button
          onClick={fetchDashboardData}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#55102A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#873C52]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#873C52]">Admin Dashboard</p>

          <h1 className="mt-2 text-3xl font-bold text-[#55102A]">
            Welcome, Admin!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your salon, services, customers and appointments.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8C9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#55102A] transition hover:bg-[#FFF5F6]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#55102A]">
                {item.value}
              </h2>
            </div>
          )
        })}
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-[#55102A]">
          Appointment Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {appointmentStats.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 shadow-sm"
              >
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>

                  <h3 className="mt-1 text-2xl font-bold text-[#55102A]">
                    {item.value}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E8C9CE]/50 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8C9CE]/40 p-5">
          <div>
            <h2 className="text-xl font-bold text-[#55102A]">
              Recent Appointments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest appointment requests from customers.
            </p>
          </div>

          <Link
            href="/dashboard/admin/appointments"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#873C52] hover:text-[#55102A]"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays size={40} className="mx-auto text-[#E8C9CE]" />

            <p className="mt-3 font-semibold text-[#55102A]">
              No appointments yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Customer appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-162 text-left">
              <thead className="bg-[#FFF9FA] text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date & Time</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8C9CE]/30">
                {recentAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-[#FFFDF9]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#55102A]">
                        {appointment.serviceName}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {appointment.duration}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {appointment.customerName || "Customer"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {appointment.customerEmail || "Email unavailable"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {appointment.appointmentDate}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {appointment.timeSlot}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#55102A]">
                      ৳{Number(appointment.price || 0).toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/admin/appointments/${appointment._id}`}
                        className="text-sm font-semibold text-[#873C52] hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-[#55102A]">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/admin/services"
            className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 transition hover:border-[#873C52] hover:shadow-md"
          >
            <Scissors className="text-[#873C52]" size={25} />

            <h3 className="mt-3 font-bold text-[#55102A]">Manage Services</h3>

            <p className="mt-1 text-sm text-gray-500">
              Add, edit and manage salon services.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/appointments"
            className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 transition hover:border-[#873C52] hover:shadow-md"
          >
            <CalendarDays className="text-[#873C52]" size={25} />

            <h3 className="mt-3 font-bold text-[#55102A]">
              Manage Appointments
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Review and update customer bookings.
            </p>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 transition hover:border-[#873C52] hover:shadow-md"
          >
            <Users className="text-[#873C52]" size={25} />

            <h3 className="mt-3 font-bold text-[#55102A]">Manage Customers</h3>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered customers.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
