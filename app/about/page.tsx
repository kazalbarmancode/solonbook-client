

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Flower2,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Online Booking",
    description:
      "Discover services and book your preferred appointment with just a few clicks.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Experience",
    description:
      "Enjoy a convenient booking experience with clear service details and appointment information.",
  },
  {
    icon: Sparkles,
    title: "Beauty & Wellness",
    description:
      "Explore a variety of beauty, hair, skincare, and wellness services in one place.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "We focus on making every step of your beauty booking journey simple and comfortable.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore Services",
    description:
      "Browse different beauty and wellness categories to find the service you need.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Choose Your Time",
    description:
      "Select your preferred service and find a suitable appointment time.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Enjoy Your Experience",
    description:
      "Complete your booking and get ready for your beauty and wellness experience.",
    icon: Heart,
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#FFF8F5]">

      {/* Hero Section */}
      <section className="relative">
        <div className="relative flex min-h-105 items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1800&q=90"
            alt="Luxury beauty and wellness salon"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#35101F]/70" />

          <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#E8C9CE]">
              Get to Know Us
            </p>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Beauty Begins With
              <span className="block text-[#E8C9CE]">
                Self-Care
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Welcome to SalonBook — your convenient destination
              for discovering beauty and wellness services and
              booking appointments with ease.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#873C52] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6F2B40]"
            >
              Explore Our Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-20 md:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative h-95 overflow-hidden rounded-[28px] sm:h-117">
              <Image
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1000&q=90"
                alt="Beauty salon interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-white p-5 shadow-xl sm:-right-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8E8EC] text-[#873C52]">
                  <Flower2 size={25} />
                </div>
                <div>
                  <p className="font-bold text-[#4A1429]">
                    Beauty & Wellness
                  </p>
                  <p className="text-xs text-gray-500">
                    Your self-care journey
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#873C52]">
              Our Story
            </p>

            <h2 className="font-serif text-3xl font-bold leading-tight text-[#4A1429] sm:text-4xl">
              Making Beauty Appointments
              <span className="text-[#873C52]">
                {" "}Simple & Convenient
              </span>
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              We believe that taking care of yourself should be
              simple, enjoyable, and accessible. That is why
              SalonBook brings beauty and wellness services
              together in one convenient platform.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From hair care and styling to skincare, makeup,
              nail care, and spa treatments, our goal is to help
              you discover the services you love and make
              appointments without unnecessary hassle.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Discover different beauty service categories",
                "Find service details in one place",
                "Book appointments conveniently online",
                "Manage your booking experience easily",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-[#873C52]"
                  />
                  <span className="text-sm text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="mt-9 inline-flex items-center gap-2 font-semibold text-[#873C52] transition hover:gap-3"
            >
              Discover Services
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[#4A1429] px-4 py-20 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#E8C9CE]">
            <Heart size={32} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#E8C9CE]">
            Our Mission
          </p>

          <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Making Self-Care a Beautiful Part of Everyday Life
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">
            Our mission is to make beauty and wellness booking
            easier for everyone. We want to create a convenient
            space where discovering services and managing
            appointments feels effortless.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-20 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#873C52]">
              Why SalonBook
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#4A1429] sm:text-4xl">
              A Better Way to Book Beauty Services
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500">
              Everything you need for a smoother and more
              convenient beauty booking experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-[#F0DDE1] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8E8EC] text-[#873C52] transition-all duration-300 group-hover:bg-[#873C52] group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-lg font-bold text-[#4A1429]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#FAF0F1] px-4 py-20 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#873C52]">
              Simple Process
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#4A1429] sm:text-4xl">
              How SalonBook Works
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Your next beauty appointment is just a few simple steps away.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8E8EC] text-[#873C52]">
                    <Icon size={28} />
                  </div>

                  <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#B77B8A]">
                    STEP {step.number}
                  </p>

                  <h3 className="text-xl font-bold text-[#4A1429]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#FFF8F5] px-4 py-20 md:px-8 lg:px-16">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-r from-[#4A1429] via-[#681E35] to-[#873C52] px-6 py-14 text-center shadow-xl sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#E8C9CE]">
              <Star size={27} />
            </div>

            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your Beauty Journey?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Discover your favorite services and book your
              next appointment with SalonBook.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#4A1429] transition-all duration-300 hover:bg-[#F8E8EC] hover:shadow-lg"
            >
              Book Your Appointment
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
