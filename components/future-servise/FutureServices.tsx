
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { featuredSixApi } from "@/lib/api/futureApi";




const FeaturedServices =async () => {
      const services = await featuredSixApi();

  return (
    <section className="bg-[#FFFDF9] px-5 py-16 md:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-5">
            <span className="hidden h-px w-16 bg-[#873C52] sm:block" />

            <h2 className="text-3xl font-bold text-[#873C52] md:text-4xl">
              Featured Salon Services
            </h2>

            <span className="hidden h-px w-16 bg-[#873C52] sm:block" />
          </div>

          <p className="mt-2 text-sm text-[#766B6B] md:text-base">
            Top services chosen by our customers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="group overflow-hidden rounded-2xl border border-[#E8C9CE]/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 16vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <button
                  type="button"
                  aria-label={`Save ${service.name}`}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-[#873C52] shadow transition hover:bg-[#873C52] hover:text-white"
                >
                  <Heart size={17} />
                </button>
              </div>

              <div className="space-y-3 p-4">
                <h3 className="text-base font-bold text-[#292323]">
                  {service.name}
                </h3>

                <span className="inline-block rounded-full bg-[#E8C9CE]/40 px-3 py-1 text-xs font-medium text-[#873C52]">
                  {service.category}
                </span>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-[#873C52]">
                    ৳{service.price}
                  </span>
                  <span className="text-[#BCA8A8]">•</span>
                  <span className="text-xs text-[#766B6B]">
                    {service.duration}
                  </span>
                </div>

                <p className="min-h-10 text-xs leading-5 text-[#766B6B]">
                  {service.description}
                </p>

                <Link
                  href={`/services/${service._id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#873C52] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6F3044]"
                >
                  View Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-[#873C52] px-7 py-3 font-semibold text-[#873C52] transition hover:bg-[#873C52] hover:text-white"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedServices;
