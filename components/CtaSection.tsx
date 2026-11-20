"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface CtaSectionProps {
  bookingHref?: string
  bgImage?: string
}

export default function CtaSection({
  bookingHref = "/services",
  bgImage = "/images/cta.jpg",
}: CtaSectionProps) {
  return (
    <section className="bg-[#FAF2F0] px-4 pt-6 pb-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-[#4A1224] shadow-lg">
          {/* Background Image */}
          <Image
            src={bgImage}
            alt="Ready for Your Beauty Transformation"
            fill
            sizes="100vw"
            className="object-cover object-right"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-r from-[#451021]/95 via-[#58172C]/75 to-transparent lg:via-[#58172C]/30" />

          <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-10 md:py-11 lg:max-w-2xl lg:px-12">
            {/* Top Pill Badge */}
            <div>
              <span className="inline-block rounded-full bg-[#F5E1E5] px-3.5 py-1 text-xs font-semibold text-[#4A1224]">
                Book Now
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-3 font-serif text-2xl leading-tight font-bold text-white sm:text-3xl md:text-4xl">
              Ready for Your Beauty Transformation?
            </h2>

            {/* Subtitle */}
            <p className="mt-2.5 text-sm text-rose-100/90 md:text-base">
              Book your appointment today and step into a more beautiful you.
            </p>

            {/* Action Button */}
            <div className="mt-6">
              <Link
                href={bookingHref}
                className="group inline-flex items-center gap-2 rounded-full bg-[#3A0C1B] px-6 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-white/25 transition-all duration-300 hover:bg-[#260610] hover:ring-white/50"
              >
                <span>Book Your Appointment</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}