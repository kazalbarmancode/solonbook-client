
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Heart,
  Loader2,
  Scissors,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getRelatedServices, getServiceDetails, Service } from "@/lib/api/servicesDetailsPageApi";




export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Service Details
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

      {/* Breadcrumb */}
      <section className="border-b border-[#E8C9CE]/50 bg-[#FFF9F7]">
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 transition hover:text-[#873C52]"
            >
              Home
            </Link>

            <span className="text-gray-300">/</span>

            <Link
              href="/services"
              className="text-gray-500 transition hover:text-[#873C52]"
            >
              Services
            </Link>

            <span className="text-gray-300">/</span>

            <span className="font-medium text-[#873C52]">
              Details
            </span>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#873C52] transition hover:text-[#55102A]"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* Service Image */}
          <div className="relative overflow-hidden rounded-3xl bg-[#F8E9EC] shadow-xl">
            <div className="relative aspect-square w-full">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Scissors className="h-16 w-16 text-[#873C52]" />
                </div>
              )}
            </div>

            <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#873C52] shadow-md">
              <span className="flex items-center gap-2">
                <Sparkles size={14} />
                Premium Service
              </span>
            </div>
          </div>

          {/* Service Information */}
          <div className="flex flex-col">

            <span className="w-fit rounded-full bg-[#F8E9EC] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#873C52]">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#292323] sm:text-4xl lg:text-5xl">
              {service.name}
            </h1>

            <p className="mt-5 text-base leading-8 text-gray-600">
              {service.description}
            </p>

            {/* Price & Duration */}
            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Service Price
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#873C52]">
                  ৳{service.price.toLocaleString("en-BD")}
                </h2>
              </div>

              <div className="rounded-2xl border border-[#E8C9CE] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Duration
                </p>

                <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-[#292323]">
                  <Clock size={20} className="text-[#873C52]" />
                  {service.duration}
                </h2>
              </div>

            </div>

            {/* Features */}
            <div className="mt-9">
              <h3 className="text-xl font-bold text-[#292323]">
                Why Choose This Service?
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={20} className="shrink-0 text-[#873C52]" />
                  Professional beauty specialists
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck size={20} className="shrink-0 text-[#873C52]" />
                  Quality products and hygienic care
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Heart size={20} className="shrink-0 text-[#873C52]" />
                  Personalized beauty experience
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Sparkles size={20} className="shrink-0 text-[#873C52]" />
                  Premium salon experience
                </div>

              </div>
            </div>

            {/* Booking Actions */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Button
                onClick={() =>
                  router.push(`/appointments/book/${service._id}`)
                }
                className="h-14 flex-1 rounded-full bg-[#873C52] text-base font-semibold text-white shadow-md transition hover:bg-[#6F3043]"
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                Book Appointment
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

            <p className="mt-5 text-center text-xs text-gray-400">
              Book your favorite service and enjoy your beauty moment.
            </p>

          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[#E8C9CE]/50 bg-[#FFF9F7] py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mb-10 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-[#873C52]">
                You May Also Like
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#292323]">
                Related Services
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Explore more services from the same category.
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {relatedServices.map((item) => (
                <Link
                  href={`/services/${item._id}`}
                  key={item._id}
                  className="group overflow-hidden rounded-2xl border border-[#E8C9CE]/60 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-[#F8E9EC]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Scissors className="h-10 w-10 text-[#873C52]" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#873C52]">
                      {item.category}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-[#292323] transition group-hover:text-[#873C52]">
                      {item.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-[#873C52]">
                        ৳{item.price.toLocaleString("en-BD")}
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

      {/* Bottom CTA */}
      <section className="bg-[#55102A] px-5 py-16 text-center">
        <div className="mx-auto max-w-3xl">

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready for Your Beauty Moment?
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/70">
            Treat yourself to a premium salon experience.
            Book your appointment today.
          </p>

          
        </div>
      </section>

    </main>
  );
}
