
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Search,
  ArrowRight,
  Clock,
  Scissors,
  Loader2,
  SearchX,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

import type { Service } from "@/lib/api/servicesDetailsPageApi";
import { getFeaturedApi } from "@/lib/api/futureApi";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch All Services
  // Retry Function
const fetchServices = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getFeaturedApi();

    setServices(data.filter((service) => service.isActive));
  } catch (err) {
    console.error("Services fetch error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

// Initial API Fetch
useEffect(() => {
  let cancelled = false;

  getFeaturedApi()
    .then((data) => {
      if (!cancelled) {
        setServices(data.filter((service) => service.isActive));
      }
    })
    .catch((err) => {
      if (!cancelled) {
        console.error("Services fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, []);

  // Dynamic Categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(services.map((service) => service.category))
    );

    return ["All", ...uniqueCategories];
  }, [services]);

  // Search and Category Filter
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#FFFDF9]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#55102A]">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#873C52]/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#873C52]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:py-24 lg:px-8">

          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#F2C7D0]">
            Discover Your Beauty
          </div>

          <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Our Premium
            <span className="block text-[#E8C9CE]">
              Beauty Services
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Explore our collection of premium salon services.
            From hair care to skincare, find the perfect treatment
            to make you feel beautiful and confident.
          </p>

          <div className="mt-9 flex items-center justify-center gap-8 text-sm text-white/80">

            <div>
              <p className="text-2xl font-bold text-white">
                {services.length}+
              </p>
              <p className="mt-1 text-xs">Services</p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-2xl font-bold text-white">
                Premium
              </p>
              <p className="mt-1 text-xs">Experience</p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-2xl font-bold text-white">
                100%
              </p>
              <p className="mt-1 text-xs">Care</p>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">

        {/* SECTION HEADING */}
        <div className="mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-[#873C52]">
            Explore Our Collection
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#292323] sm:text-4xl">
            Find Your Perfect Service
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Choose from our carefully selected beauty and wellness
            treatments, designed just for you.
          </p>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="mb-9 rounded-2xl border border-[#E8C9CE]/60 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="h-12 w-full rounded-full border border-[#E8C9CE] bg-[#FFFDF9] pl-12 pr-5 text-sm text-[#292323] outline-none transition placeholder:text-gray-400 focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
              />
            </div>

            {/* Category Label */}
            <div className="flex items-center gap-2 text-sm font-semibold text-[#292323]">
              <SlidersHorizontal size={18} className="text-[#873C52]" />
              Filter by Category
            </div>

          </div>

          {/* Category Buttons */}
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#873C52] text-white shadow-md"
                    : "border border-[#E8C9CE] bg-white text-gray-600 hover:border-[#873C52] hover:text-[#873C52]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>

        {/* RESULT COUNT */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-[#873C52]">
              {filteredServices.length}
            </span>{" "}
            services
          </p>

          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="text-sm font-semibold text-[#873C52] hover:text-[#55102A]"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-75 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#873C52]" />

              <p className="mt-4 text-sm text-gray-500">
                Loading our services...
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-3xl border border-[#E8C9CE] bg-white px-5 text-center">

            <SearchX className="h-12 w-12 text-[#873C52]" />

            <h3 className="mt-5 text-xl font-bold text-[#292323]">
              Unable to Load Services
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchServices}
              className="mt-6 flex items-center gap-2 rounded-full bg-[#873C52] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6F3043]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-3xl border border-[#E8C9CE]/60 bg-white px-5 text-center">

            <div className="rounded-full bg-[#F8E9EC] p-5">
              <Scissors className="h-10 w-10 text-[#873C52]" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#292323]">
              No Services Found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              We couldnt find any services matching your search.
              Try another keyword or category.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 rounded-full bg-[#873C52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6F3043]"
            >
              Show All Services
            </button>

          </div>
        )}

        {/* SERVICES GRID */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-3xl border border-[#E8C9CE]/60 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-[#F8E9EC]">

                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Scissors className="h-12 w-12 text-[#873C52]" />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#873C52] shadow-sm">
                    {service.category}
                  </div>

                  <div className="absolute bottom-4 right-4 rounded-full bg-[#55102A] px-4 py-2 text-sm font-bold text-white shadow-md">
                    ৳{service.price.toLocaleString("en-BD")}
                  </div>

                </div>

                {/* Card Content */}
                <div className="p-6">

                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <Clock size={15} className="text-[#873C52]" />
                    {service.duration}
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-[#292323] transition group-hover:text-[#873C52]">
                    {service.name}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>

                  <div className="my-5 border-t border-[#E8C9CE]/60" />

                  <Link
                    href={`/services/${service._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#873C52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6F3044]"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}

      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#FFF9F7] px-5 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#55102A] px-6 py-14 text-center sm:px-12">

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Your Beauty, Your Moment.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
            Take a moment for yourself. Discover your favorite service
            and experience the care you deserve.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#873C52] transition hover:bg-[#F8E9EC]"
          >
            Back to Home
            <ArrowRight size={17} />
          </Link>

        </div>
      </section>

    </main>
  );
}
