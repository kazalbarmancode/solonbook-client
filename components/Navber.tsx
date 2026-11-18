"use client"

import Link from "next/link"
import { Menu, ArrowRight } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
]

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8C9CE]/50 bg-[#FFFDF9]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/SalonBook Beauty Logo.png"
            alt="SalonBook Logo"
            width={160}
            height={60}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* MIDDLE: NAV LINKS */}
        <div className="hidden items-center justify-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#292323] transition hover:text-[#873C52]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT: AUTH BUTTONS */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-md px-4 py-2 text-sm font-semibold text-[#873C52] hover:bg-[#E8C9CE]/30"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-full bg-[#873C52] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6F3043]"
          >
            Sign Up
            <ArrowRight className="ml-2 inline h-4 w-4" />
          </Link>
        </div>

        {/* MOBILE MENU */}

        <div className="col-span-2 flex justify-end md:hidden">
          <Sheet>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E8C9CE] text-[#873C52]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-75 border-[#E8C9CE] bg-[#FFFDF9]"
            >
              <SheetHeader>
                <Image
                  src="/images/SalonBook Beauty Logo.png"
                  alt="SalonBook Logo"
                  width={160}
                  height={60}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-5 px-4">
                {navLinks.map((link) => (
                  <SheetClose key={link.href}>
                    <Link
                      href={link.href}
                      className="block border-b border-[#E8C9CE]/50 pb-3 text-left text-base font-medium text-[#292323] hover:text-[#873C52]"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <div className="mt-4 flex flex-col gap-3">
                  <SheetClose>
                    <Link
                      href="/sign-in"
                      className="block rounded-md border border-[#873C52] px-4 py-2 text-center text-sm font-medium text-[#873C52]"
                    >
                      Sign In
                    </Link>
                  </SheetClose>

                  <SheetClose>
                    <Link
                      href="/sign-up"
                      className="block rounded-md bg-[#873C52] px-4 py-2 text-center text-sm font-medium text-white"
                    >
                      Sign Up
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
