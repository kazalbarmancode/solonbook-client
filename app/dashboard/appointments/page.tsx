"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  Scissors,
  Eye,
  Loader2,
  ClipboardList,
  Pencil,
  Trash2,
  X,
  CreditCard,
} from "lucide-react"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"
import {
  getMyAppointmentsApi,
  rescheduleAppointmentApi,
  deleteAppointmentApi,
  type Appointment,
} from "@/lib/api/appointmentsApi"
import { createCheckoutSessionApi } from "@/lib/api/paymentsApi"

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
]

const getTodayDate = () => {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

  return localDate.toISOString().split("T")[0]
}

export default function MyAppointmentsPage() {
  const { data: session, isPending } = authClient.useSession()

  const userId = session?.user?.id

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Edit modal states
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null)

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [saving, setSaving] = useState(false)

  // Delete modal states
  const [deletingAppointment, setDeletingAppointment] =
    useState<Appointment | null>(null)

  const [deleting, setDeleting] = useState(false)
  const [payingAppointmentId, setPayingAppointmentId] = useState<string | null>(
    null
  )

  // Fetch appointments
  useEffect(() => {
    if (isPending || !userId) return

    let isMounted = true

    const fetchAppointments = async () => {
      try {
        setError("")

        const data = await getMyAppointmentsApi(userId)

        if (isMounted) {
          setAppointments(data)
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load appointments"

          setError(message)
          toast.error(message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAppointments()

    return () => {
      isMounted = false
    }
  }, [userId, isPending])

  // Appointment status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  // Payment status style
  const getPaymentStyle = (status: string) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700"
  }

  // Format appointment date
  const formatDate = (date: string) => {
    if (!date) return "N/A"

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Format booking date
  const formatCreatedDate = (date: string) => {
    if (!date) return "N/A"

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Open edit modal
  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setSelectedDate(appointment.appointmentDate)
    setSelectedTime(appointment.timeSlot)
  }

  // Reschedule appointment
  const handleReschedule = async () => {
    if (!editingAppointment || !userId) return

    if (!selectedDate || !selectedTime) {
      toast.error("Please select appointment date and time")
      return
    }

    if (selectedDate < getTodayDate()) {
      toast.error("Appointment date cannot be in the past")
      return
    }

    try {
      setSaving(true)

      const updatedAppointment = await rescheduleAppointmentApi(
        editingAppointment._id,
        userId,
        selectedDate,
        selectedTime
      )

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? { ...appointment, ...updatedAppointment }
            : appointment
        )
      )

      setEditingAppointment(null)

      toast.success("Appointment updated successfully!")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update appointment"
      )
    } finally {
      setSaving(false)
    }
  }
  // Stripe Payment
  const handlePayment = async (appointment: Appointment) => {
    if (!userId) {
      toast.error("Please sign in to continue payment")
      return
    }

    if (
      appointment.status !== "Confirmed" ||
      appointment.paymentStatus === "Paid"
    ) {
      toast.error("This appointment is not eligible for payment")
      return
    }

    try {
      setPayingAppointmentId(appointment._id)

      const result = await createCheckoutSessionApi(appointment._id, userId)

      // Redirect to Stripe Checkout
      window.location.assign(result.url)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment could not be started"
      )

      setPayingAppointmentId(null)
    }
  }

  // Delete appointment
  const handleDelete = async () => {
    if (!deletingAppointment || !userId) return

    try {
      setDeleting(true)

      await deleteAppointmentApi(deletingAppointment._id, userId)

      setAppointments((previous) =>
        previous.filter(
          (appointment) => appointment._id !== deletingAppointment._id
        )
      )

      setDeletingAppointment(null)

      toast.success("Appointment deleted successfully!")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete appointment"
      )
    } finally {
      setDeleting(false)
    }
  }

  // Loading
  if (isPending || (userId && loading)) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#873C52]" />
      </div>
    )
  }

  // Sign In
  if (!userId) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-[#55102A]">Please Sign In</h2>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to view your appointments.
        </p>

        <Link
          href="/sign-In"
          className="mt-5 rounded-lg bg-[#873C52] px-6 py-3 text-sm font-semibold text-white"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-[#873C52]">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#55102A] sm:text-3xl">
          My Appointments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage all your salon appointment requests.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Appointments</p>
            <CalendarDays className="h-5 w-5 text-[#873C52]" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-[#55102A]">
            {appointments.length}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending</p>
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-yellow-600">
            {appointments.filter((a) => a.status === "Pending").length}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Confirmed</p>
            <Scissors className="h-5 w-5 text-green-600" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {appointments.filter((a) => a.status === "Confirmed").length}
          </h2>
        </div>
      </div>

      {/* Appointment List */}
      <div className="rounded-xl border border-[#E8C9CE] bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-[#55102A]">All Appointments</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your recent and previous booking requests.
          </p>
        </div>

        {error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <ClipboardList className="h-12 w-12 text-[#D9AEB7]" />

            <h3 className="mt-4 text-lg font-bold text-[#55102A]">
              No Appointments Yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              You haven&apos;t booked any salon services yet. Explore our
              services and make your first appointment.
            </p>

            <Link
              href="/services"
              className="mt-5 rounded-lg bg-[#873C52] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#55102A]"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                {/* Service Info */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F9EEF0]">
                    {appointment.serviceImage ? (
                      <Image
                        src={appointment.serviceImage}
                        alt={appointment.serviceName}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Scissors className="h-8 w-8 text-[#873C52]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#55102A]">
                      {appointment.serviceName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.serviceCategory}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#873C52]">
                      ৳{appointment.price}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4 sm:min-w-55">
                  <div>
                    <p className="text-xs text-gray-400">Appointment Date</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(appointment.appointmentDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Appointment Time</p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {appointment.timeSlot}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Booking Date</p>

                    <p className="mt-1 text-sm text-gray-600">
                      {formatCreatedDate(appointment.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Duration</p>

                    <p className="mt-1 text-sm text-gray-600">
                      {appointment.duration}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-start">
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

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/appointments/${appointment._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#873C52] px-3 py-2.5 text-sm font-semibold text-[#873C52] transition hover:bg-[#873C52] hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </Link>
                  {appointment.status === "Confirmed" &&
                    appointment.paymentStatus !== "Paid" && (
                      <button
                        onClick={() => handlePayment(appointment)}
                        disabled={payingAppointmentId === appointment._id}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#873C52] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#55102A] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {payingAppointmentId === appointment._id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                          </>
                        )}
                      </button>
                    )}

                  {appointment.status === "Pending" && (
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  )}

                  {appointment.paymentStatus !== "Paid" && (
                    <button
                      onClick={() => setDeletingAppointment(appointment)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#55102A]">
                  Edit Appointment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingAppointment.serviceName}
                </p>
              </div>

              <button
                onClick={() => setEditingAppointment(null)}
                disabled={saving}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Appointment Date
                </label>

                <input
                  type="date"
                  min={getTodayDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#873C52]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Appointment Time
                </label>

                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingAppointment(null)}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Close
                </button>

                <button
                  onClick={handleReschedule}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#873C52] px-4 py-3 text-sm font-semibold text-white hover:bg-[#55102A] disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#55102A]">
              Delete Appointment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to permanently delete your{" "}
              <strong>{deletingAppointment.serviceName}</strong> appointment?
            </p>

            <p className="mt-2 text-xs text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingAppointment(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Appointment
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}

                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
