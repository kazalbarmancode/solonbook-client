
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

import {
  SiFacebook,
  SiInstagram,
  SiX,
} from "@icons-pack/react-simple-icons";

const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-[#55102A] via-[#4F1125] to-[#55102A] text-white">

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/SalonBook Beauty Logo.png"
                alt="SalonBook Logo"
                width={160}
                height={60}
                priority
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#F2C7D0]">
              Your trusted salon booking platform for beauty and wellness.
              Discover professional salon services and enjoy a relaxing
              beauty experience.
            </p>

            <div className="mt-6 flex gap-3">

              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-3 text-white transition duration-300 hover:bg-[#873C52]"
              >
                <SiFacebook size={18} />
              </Link>

              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-white/10 p-3 text-white transition duration-300 hover:bg-[#873C52]"
              >
                <SiInstagram size={18} />
              </Link>

              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="rounded-full bg-white/10 p-3 text-white transition duration-300 hover:bg-[#873C52]"
              >
                <SiX size={18} />
              </Link>

            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-[#F2C7D0]">

              <li>
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="transition hover:text-white"
                >
                  Browse Services
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-white"
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Contact Info
            </h3>

            <ul className="space-y-5 text-sm text-[#F2C7D0]">

              <li className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-[#F2C7D0]"
                />
                <span>Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone
                  size={19}
                  className="shrink-0 text-[#F2C7D0]"
                />
                <span>+880 1XXXXXXXXX</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail
                  size={19}
                  className="shrink-0 text-[#F2C7D0]"
                />
                <span>hello@salonbook.com</span>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Opening Hours
            </h3>

            <ul className="space-y-4 text-sm text-[#F2C7D0]">

              <li className="flex items-center gap-3">
                <Clock
                  size={18}
                  className="shrink-0 text-[#F2C7D0]"
                />
                Monday - Friday
              </li>

              <li className="pl-7">
                10:00 AM - 09:00 PM
              </li>

              <li className="flex items-center gap-3">
                <Clock
                  size={18}
                  className="shrink-0 text-[#F2C7D0]"
                />
                Saturday - Sunday
              </li>

              <li className="pl-7">
                11:00 AM - 08:00 PM
              </li>

            </ul>

            
          </div>

        </div>
      </div>

      <div className="border-t border-[#E8C9CE]/40 bg-[#4F1125]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center text-sm text-[#F2C7D0] md:flex-row">

          <p>
            © {new Date().getFullYear()} SalonBook. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6">

            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </Link>

          </div>

          <p className="hidden items-center gap-1 sm:flex">
            Beauty · Care · Confidence
            <span className="text-[#F2C7D0]">♥</span>
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;