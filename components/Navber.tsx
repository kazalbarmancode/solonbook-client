"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  Menu,
  ArrowRight,
  User,
  LayoutDashboard,
  LogOut,
  Loader2,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

import { authClient } from "@/lib/auth-client"

const Navbar = () => {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  // Get logged-in user's role
  const role = (
    session?.user as { role?: string } | undefined
  )?.role?.toLowerCase()

  const isAdmin = role === "admin"
  const isCustomer = role === "customer"

  // Role based dashboard URL
  const dashboardUrl = isAdmin ? "/dashboard/admin" : "/dashboard"

  const dashboardLabel = isAdmin ? "Admin Dashboard" : "My Dashboard"

  const navLinks = [
    { label: "Home", href: "/" },
    ...(session?.user && !isPending
      ? [{ label: "Dashboard", href: dashboardUrl }]
      : []),
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  const [profileOpen, setProfileOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Sign Out
  const handleSignOut = async () => {
    try {
      setLoading(true)

      const { error } = await authClient.signOut()

      if (error) {
        console.error("Sign out failed:", error.message)
        return
      }

      setProfileOpen(false)

      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setLoading(false)
    }
  }

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

        <div className="hidden items-center justify-end gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#E8C9CE]/50" />
          ) : session?.user ? (
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#E8C9CE] p-1 transition hover:bg-[#FFF5F5]"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Profile"
                    referrerPolicy="no-referrer"
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#873C52] font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="absolute right-0 z-50 mt-3 w-60 rounded-xl border border-[#E8C9CE] bg-white p-3 shadow-xl">
                    {/* USER INFO */}
                    <div className="border-b border-gray-100 px-3 py-2">
                      <p className="font-semibold text-[#292323]">
                        {session.user.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {session.user.email}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#873C52] capitalize">
                        {role || "User"}
                      </p>
                    </div>

                    {/* MY PROFILE */}
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#FFF5F5] hover:text-[#873C52]"
                    >
                      <User size={17} />
                      My Profile
                    </Link>

                    {/* ROLE BASED DASHBOARD */}
                    {(isAdmin || isCustomer) && (
                      <Link
                        href={dashboardUrl}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#FFF5F5] hover:text-[#873C52]"
                      >
                        <LayoutDashboard size={17} />
                        {dashboardLabel}
                      </Link>
                    )}

                    {/* SIGN OUT */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={loading}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <LogOut size={17} />
                      )}
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* SIGN IN */}
              <Link
                href="/sign-In"
                className="rounded-md px-4 py-2 text-sm font-semibold text-[#873C52] hover:bg-[#E8C9CE]/30"
              >
                Sign In
              </Link>

              {/* SIGN UP */}
              <Link
                href="/sign-up"
                className="rounded-full bg-[#873C52] px-6 py-2 text-sm font-semibold text-white hover:bg-[#6F3043]"
              >
                Sign Up
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="flex justify-end md:hidden">
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
              {/* MOBILE LOGO */}
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
                {/* NAV LINKS */}
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

                {/* MOBILE AUTH */}
                <div className="mt-4 flex flex-col gap-3">
                  {isPending ? (
                    <div className="h-10 animate-pulse rounded-lg bg-[#E8C9CE]/50" />
                  ) : session?.user ? (
                    <>
                      {/* MOBILE USER INFO */}
                      <div className="flex items-center gap-3 rounded-xl border border-[#E8C9CE] p-3">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt="User Profile"
                            referrerPolicy="no-referrer"
                            width={44}
                            height={44}
                            unoptimized
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#873C52] font-semibold text-white">
                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#292323]">
                            {session.user.name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {session.user.email}
                          </p>

                          <p className="text-xs font-semibold text-[#873C52] capitalize">
                            {role || "User"}
                          </p>
                        </div>
                      </div>

                      {/* MOBILE PROFILE */}
                      <SheetClose>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 rounded-md px-4 py-2 text-sm text-[#292323] hover:bg-[#FFF5F5]"
                        >
                          <User size={17} />
                          My Profile
                        </Link>
                      </SheetClose>

                      {/* MOBILE DASHBOARD */}
                      {(isAdmin || isCustomer) && (
                        <SheetClose>
                          <Link
                            href={dashboardUrl}
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm text-[#292323] hover:bg-[#FFF5F5]"
                          >
                            <LayoutDashboard size={17} />
                            {dashboardLabel}
                          </Link>
                        </SheetClose>
                      )}

                      {/* MOBILE SIGN OUT */}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={loading}
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <LogOut size={17} />
                        )}
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      {/* MOBILE SIGN IN */}
                      <SheetClose>
                        <Link
                          href="/sign-In"
                          className="block rounded-md border border-[#873C52] px-4 py-2 text-center text-sm font-medium text-[#873C52]"
                        >
                          Sign In
                        </Link>
                      </SheetClose>

                      {/* MOBILE SIGN UP */}
                      <SheetClose>
                        <Link
                          href="/sign-up"
                          className="block rounded-md bg-[#873C52] px-4 py-2 text-center text-sm font-medium text-white"
                        >
                          Sign Up
                        </Link>
                      </SheetClose>
                    </>
                  )}
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
