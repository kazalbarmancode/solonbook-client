
import Image from "next/image";
import { ArrowRight, CalendarDays} from "lucide-react";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <main>
      <section className="relative flex min-h-[calc(100svh-64px)] w-full items-center overflow-hidden">

        <Image
          src="/images/Hero banner.jpg"
          alt="Luxury beauty salon"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#FFF5F0] via-[#FFF5F0]/90 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:px-10">

          <div className="max-w-xl space-y-7">

            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8C9CE]/50 px-4 py-2 text-sm font-medium text-[#873C52]">
              Beauty & Self-Care Experience
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#292323] md:text-7xl">
              Your Beauty,
              <span className="block text-[#873C52]">
                Your Moment.
              </span>
            </h1>

            <p className="max-w-lg text-base leading-8 text-[#766B6B] md:text-lg">
              Discover your beauty with professional salon services.
              Book your favorite treatments easily and enjoy a relaxing
              beauty experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-[#873C52] px-6 py-3.5 font-semibold text-white transition hover:bg-[#6F3044]"
              >
                Book Appointment
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-[#873C52] px-6 py-3.5 font-semibold text-[#873C52] transition hover:bg-[#E8C9CE]/30"
              >
                Explore Services
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-4 text-sm text-[#766B6B]">
              <CalendarDays size={19} className="text-[#873C52]" />
              Easy online appointment booking
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default HeroBanner;
