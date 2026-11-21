"use client"
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  Scissors,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-pink-50 via-white to-rose-50 px-4 py-12">
      <div className="w-full max-w-lg text-center">

        {/* Logo */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-white">
            <Scissors size={24} />
          </div>

          <span className="text-2xl font-bold text-gray-900">
            Salon<span className="text-pink-600">Book</span>
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="relative mb-6">
          <h1 className="text-[130px] font-extrabold leading-none tracking-tight text-pink-100 sm:text-[180px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-white p-5 shadow-lg">
              <Search size={48} className="text-pink-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="mb-3 text-3xl font-bold text-gray-900">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-600">
          The page you are looking for doesnt exist,
          has been moved, or the URL may be incorrect.
          Lets get you back to SalonBook!
        </p>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 font-semibold text-white transition hover:bg-pink-700"
          >
            <Home size={19} />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={19} />
            Go Back
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          © 2026 SalonBook. All rights reserved.
        </p>
      </div>
    </main>
  );
}
