"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

import { getServiceDetails, Service } from "@/lib/api/servicesDetailsPageApi"

import { createAppointmentApi } from "@/lib/api/appointmentsApi"

import { Button } from "@/components/ui/button"

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Scissors,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react"

const timeSlots = [
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

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()

  const id = params.id as string

  // Authentication
  const { data: session, isPending } = authClient.useSession()

  const role = (
    session?.user as { role?: string } | undefined
  )?.role?.toLowerCase()

  // States
  const [service, setService] = useState<Service | null>(null)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [appointmentDate, setAppointmentDate] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [message, setMessage] = useState("")

  // Today's date
  const getTodayDate = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  // Authentication Check
  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      toast.error("Please login to book an appointment.")
      router.replace("/sign-In")
      return
    }

    if (role !== "customer") {
      toast.error("Only customers can book appointments.")

      if (role === "admin") {
        router.replace("/dashboard/admin")
      } else {
        router.replace("/sign-In")
      }
    }
  }, [session, isPending, role, router])

  // Fetch Service
  useEffect(() => {
    if (!id) return

    let isMounted = true

    const fetchService = async () => {
      try {
        setLoading(true)

        const data = await getServiceDetails(id)

        if (!data || !data.isActive) {
          throw new Error("This service is currently unavailable.")
        }

        if (isMounted) {
          setService(data)
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load service."
          )

          setService(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchService()

    return () => {
      isMounted = false
    }
  }, [id])

  // Submit Booking

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (submitting) return

    if (!session?.user || role !== "customer") {
      toast.error("Only customers can book appointments.")
      return
    }

    if (!service) {
      toast.error("Service information not found.")
      return
    }

    if (!appointmentDate) {
      toast.error("Please select appointment date.")
      return
    }

    if (appointmentDate < getTodayDate()) {
      toast.error("Please select a valid appointment date.")
      return
    }

    if (!timeSlot) {
      toast.error("Please select a time slot.")
      return
    }

    if (message.trim().length > 500) {
      toast.error("Message cannot exceed 500 characters.")
      return
    }

    try {
      setSubmitting(true)

      await createAppointmentApi({
        userId: session.user.id,
        serviceId: service._id,
        appointmentDate,
        timeSlot,
        message: message.trim(),
      })

      toast.success("Appointment request submitted successfully!")

      router.push("/dashboard/appointments")
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Booking failed. Please try again."

      if (errorMessage.toLowerCase().includes("blocked")) {
        toast.error(
          "Your account has been blocked. You cannot book appointments.",
          { duration: 1500 }
        )

        setTimeout(() => {
          router.replace("/")
        }, 1500)

        return
      }

      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading
  if (loading || isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FFFDF9]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#873C52]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading booking information...
          </p>
        </div>
      </div>
    )
  }

  // Role Check
  if (!session?.user || role !== "customer") {
    return null
  }

  // Service Error
  if (!service) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFFDF9] px-4 text-center">
        <Scissors className="mb-4 h-12 w-12 text-[#873C52]" />

        <h2 className="text-2xl font-bold text-[#55102A]">Service Not Found</h2>

        <p className="mt-3 text-sm text-gray-500">
          This service is unavailable or may have been removed.
        </p>

        <Button
          onClick={() => router.push("/services")}
          className="mt-6 rounded-full bg-[#873C52] hover:bg-[#55102A]"
        >
          Browse Services
        </Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href={`/services/${service._id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#873C52] hover:text-[#55102A]"
        >
          <ArrowLeft size={17} />
          Back to Service
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-widest text-[#873C52] uppercase">
            SalonBook Appointment
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#55102A] sm:text-4xl">
            Book Your Appointment
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Choose your preferred appointment date and time. Complete the form
            below to submit your booking request.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Service Information */}
          <div className="overflow-hidden rounded-2xl border border-[#E8C9CE]/60 bg-white shadow-sm lg:col-span-2">
            <div className="relative h-64 w-full">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#F8E9EC]">
                  <Scissors className="h-16 w-16 text-[#873C52]" />
                </div>
              )}
            </div>

            <div className="p-6">
              <span className="rounded-full bg-[#F8E9EC] px-3 py-1.5 text-xs font-semibold text-[#873C52]">
                {service.category}
              </span>

              <h2 className="mt-4 text-2xl font-bold text-[#55102A]">
                {service.name}
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {service.description}
              </p>

              <div className="mt-6 space-y-4 border-t border-[#E8C9CE]/50 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Service Price</span>

                  <span className="text-xl font-bold text-[#873C52]">
                    ৳{service.price}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={17} />
                    Duration
                  </span>

                  <span className="font-semibold text-[#55102A]">
                    {service.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 size={17} />
                    Service Status
                  </span>

                  <span className="font-semibold text-green-600">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="rounded-2xl border border-[#E8C9CE]/60 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="text-xl font-bold text-[#55102A]">
              Appointment Information
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Select your desired date and available time slot.
            </p>

            <form onSubmit={handleBooking} className="mt-8 space-y-7">
              {/* Date */}
              <div>
                <label
                  htmlFor="appointmentDate"
                  className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#55102A]"
                >
                  <CalendarDays size={18} className="text-[#873C52]" />
                  Appointment Date
                </label>

                <input
                  id="appointmentDate"
                  type="date"
                  min={getTodayDate()}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#E8C9CE] bg-[#FFFDF9] px-4 py-3.5 text-sm text-[#55102A] transition outline-none focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#55102A]">
                  <Clock size={18} className="text-[#873C52]" />
                  Select Time Slot
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      disabled={submitting}
                      onClick={() => setTimeSlot(slot)}
                      className={`rounded-xl border px-3 py-3.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        timeSlot === slot
                          ? "border-[#873C52] bg-[#873C52] text-white shadow-md"
                          : "border-[#E8C9CE] bg-[#FFFDF9] text-[#55102A] hover:border-[#873C52] hover:bg-[#F8E9EC]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {!timeSlot && (
                  <p className="mt-2 text-xs text-gray-400">
                    Please choose one time slot.
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-3 block text-sm font-semibold text-[#55102A]"
                >
                  Additional Message
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="message"
                  rows={4}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write any special requests..."
                  className="w-full resize-none rounded-xl border border-[#E8C9CE] bg-[#FFFDF9] px-4 py-3 text-sm text-[#55102A] transition outline-none placeholder:text-gray-400 focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
                />

                <p className="mt-2 text-right text-xs text-gray-400">
                  {message.length}/500 characters
                </p>
              </div>

              {/* Booking Notice */}
              <div className="flex gap-3 rounded-xl border border-[#E8C9CE]/60 bg-[#F8E9EC]/60 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#873C52]" />

                <p className="text-sm leading-6 text-[#873C52]">
                  Your appointment request will initially have Pending status.
                  Once the admin confirms it, you can pay for your appointment
                  from My Appointments.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || !timeSlot || !appointmentDate}
                className="h-14 w-full rounded-full bg-[#873C52] text-base font-semibold text-white shadow-md transition hover:bg-[#6F3043] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    Confirm Appointment Request
                    <CalendarDays className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                No payment is required until your appointment is confirmed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
