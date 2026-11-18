
"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  Scissors,
  
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const stats = [
  {
    title: "Total Appointments",
    value: "0",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Upcoming Appointments",
    value: "0",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Completed",
    value: "0",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
];



export default function CustomerDashboard() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8C9CE] border-t-[#873C52]" />
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-6">Please sign in to continue.</p>;
  }

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
            Hello, {session?.user.name || "Customer"}!
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

      

      {/* Empty Appointment State */}
      <section className="rounded-2xl border border-dashed border-[#E8C9CE] bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F3] text-[#873C52]">
          <Scissors size={30} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#292323]">
          Ready for Your Next Beauty Experience?
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          You havent booked an appointment yet.
          Explore our professional salon services and book your first visit.
        </p>

        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#873C52] px-6 py-3 font-semibold text-white transition hover:bg-[#6F3044]"
        >
          Book Your Appointment
          <ArrowRight size={18} />
        </Link>
      </section>

    </div>
  );
}
