"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

import {
  getServiceDetails,
  getRelatedServices,
  Service,
} from "@/lib/api/servicesDetailsPageApi";

import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Loader2,
  Scissors,
  CheckCircle2,
} from "lucide-react";

export default function ServiceDetailsPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const role = (
    session?.user as { role?: string } | undefined
  )?.role?.toLowerCase();

  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getServiceDetails(id);

        if (!data.isActive) {
          throw new Error("This service is currently unavailable.");
        }

        if (!isMounted) return;

        setService(data);

        const related = await getRelatedServices(
          data.category,
          data._id
        );

        if (isMounted) {
          setRelatedServices(related);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Booking Handler
  const handleBooking = () => {
    if (isPending) return;

    if (!session?.user) {
      toast.error("Please login to book an appointment.");
      router.push("/sign-In");
      return;
    }

    if (role !== "customer") {
      toast.error("Only customers can book appointments.");
      return;
    }

    if (!service) return;

    router.push(`/appointments/book/${service._id}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FFFDF9]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#873C52]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !service) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFFDF9] px-5 text-center">
        <div className="mb-5 rounded-full bg-[#F8E9EC] p-5">
          <Scissors className="h-10 w-10 text-[#873C52]" />
        </div>

        <h2 className="text-2xl font-bold text-[#292323]">
          Service Not Found
        </h2>

        <p className="mt-3 max-w-md text-sm text-gray-500">
          {error || "The service you are looking for is unavailable."}
        </p>

        <Button
          onClick={() => router.push("/services")}
          className="mt-6 rounded-full bg-[#873C52] px-7 hover:bg-[#6F3043]"
        >
          Browse Services
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9]">

      {/* Hero Section */}
      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="transition hover:text-[#873C52]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/services"
              className="transition hover:text-[#873C52]"
            >
              Services
            </Link>

            <span>/</span>

            <span className="font-medium text-[#873C52]">
              {service.name}
            </span>
          </div>

          {/* Back Button */}
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#873C52] transition hover:text-[#55102A]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Service Image */}
            <div className="relative overflow-hidden rounded-3xl border border-[#E8C9CE]/50 bg-white shadow-lg">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#873C52] shadow-sm">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Service Information */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#F8E9EC] px-4 py-2 text-xs font-semibold text-[#873C52]">
                Premium Salon Service
              </div>

              <h1 className="text-3xl font-bold leading-tight text-[#55102A] sm:text-4xl lg:text-5xl">
                {service.name}
              </h1>

              <p className="mt-6 text-base leading-8 text-gray-600">
                {service.description}
              </p>

              {/* Price and Duration */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E8C9CE]/60 bg-white p-5">
                  <p className="text-sm text-gray-500">
                    Service Price
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#873C52]">
                    ৳{service.price}
                  </h3>
                </div>

                <div className="rounded-2xl border border-[#E8C9CE]/60 bg-white p-5">
                  <p className="text-sm text-gray-500">
                    Service Duration
                  </p>

                  <h3 className="mt-2 flex items-center gap-2 text-xl font-bold text-[#55102A]">
                    <Clock size={20} />
                    {service.duration}
                  </h3>
                </div>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3">
                <h3 className="font-bold text-[#55102A]">
                  Why Choose This Service?
                </h3>

                {[
                  "Professional salon experts",
                  "Premium quality products",
                  "Comfortable salon experience",
                  "Personalized beauty care",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#873C52]"
                    />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={handleBooking}
                  disabled={isPending}
                  className="h-14 flex-1 rounded-full bg-[#873C52] text-base font-semibold text-white shadow-md transition hover:bg-[#6F3043] disabled:opacity-60"
                >
                  <CalendarDays className="mr-2 h-5 w-5" />

                  {isPending ? "Checking..." : "Book Appointment"}

                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/services")}
                  className="h-14 rounded-full border-[#873C52] px-8 text-[#873C52] hover:bg-[#F8E9EC]"
                >
                  Explore More
                </Button>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Booking requests are subject to admin confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[#E8C9CE]/40 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#873C52]">
                You May Also Like
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#55102A]">
                Related Services
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Explore more services from the same category.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <Link
                  key={item._id}
                  href={`/services/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-[#E8C9CE]/50 bg-[#FFFDF9] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#873C52]">
                      {item.category}
                    </span>

                    <h3 className="mt-2 text-xl font-bold text-[#55102A] transition group-hover:text-[#873C52]">
                      {item.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-[#873C52]">
                        ৳{item.price}
                      </span>

                      <span className="flex items-center gap-1 text-sm font-semibold text-[#873C52]">
                        View Details
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

    </main>
  );
}