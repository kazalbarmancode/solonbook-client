
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

const contactDetails = [
  {
    icon: MapPin,
    title: "Our Location",
    value: "Babulal,123-Dhaka ,Bangladesh",
    description: "Visit us at our salon",
  },
  {
    icon: Phone,
    title: "Phone Number",
    value: "+880 1614173598",
    description: "We would love to hear from you",
  },
  {
    icon: Mail,
    title: "Email Address",
    value: "kazal9010@gmail.com",
    description: "Send us your questions anytime",
  },
];

const businessHours = [
  { day: "Monday - Friday", time: "09:00 AM - 08:00 PM" },
  { day: "Saturday", time: "10:00 AM - 09:00 PM" },
  { day: "Sunday", time: "10:00 AM - 06:00 PM" },
];

export default function ContactPage() {
  return (
    <main className="overflow-hidden bg-[#FFF8F5]">

      {/* Hero Section */}
      <section className="relative">
        <div className="relative flex min-h-97.5 items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=90"
            alt="Luxury beauty salon"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#35101F]/75" />

          <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#E8C9CE]">
              Get In Touch
            </p>

            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Contact
              <span className="text-[#E8C9CE]"> Us</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Have questions or need assistance? We are here to
              help you. Get in touch with SalonBook and let us
              make your beauty booking experience easier.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#873C52] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#6F2B40]"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#873C52]">
              Contact Information
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#4A1429] sm:text-4xl">
              Wed Love to Hear From You
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Whether you have a question about our services or
              need booking assistance, feel free to contact us.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-[#F0DDE1] bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8E8EC] text-[#873C52] transition-all duration-300 group-hover:bg-[#873C52] group-hover:text-white">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-lg font-bold text-[#4A1429]">
                    {item.title}
                  </h3>

                  <p className="mt-3 wrap-break text-sm font-semibold text-[#873C52]">
                    {item.value}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

     

      {/* Business Hours */}
      <section className="px-4 py-20 md:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#873C52]">
              Visit Us
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#4A1429] sm:text-4xl">
              Our Business Hours
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-8 text-gray-500">
              Plan your visit and choose a suitable time for your
              next beauty and wellness appointment.
            </p>

            <div className="mt-8 rounded-2xl border border-[#F0DDE1] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8E8EC] text-[#873C52]">
                  <Clock size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-[#4A1429]">
                    Opening Hours
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sample schedule — update as needed
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {businessHours.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2E7E9] pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {item.day}
                    </span>

                    <span className="text-sm font-semibold text-[#873C52]">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative h-90 overflow-hidden rounded-3xl sm:h-107.5">
            <Image
              src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=90"
              alt="Beautiful relaxing spa interior"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-[#35101F]/65 to-transparent" />

            <div className="absolute bottom-7 left-7 right-7 text-white">

              <h3 className="font-serif text-2xl font-bold">
                Take Time for Yourself
              </h3>

              <p className="mt-2 text-sm text-white/80">
                Your self-care journey starts with SalonBook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#FAF0F1] px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-linear-to-r from-[#4A1429] via-[#681E35] to-[#873C52] px-6 py-14 text-center shadow-xl sm:px-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#E8C9CE]">
            <CalendarDays size={28} />
          </div>

          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Ready to Book Your Appointment?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">
            Explore our beauty and wellness services and find
            the perfect treatment for yourself.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#4A1429] transition-all hover:bg-[#F8E8EC]"
          >
            Book Your Appointment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}
