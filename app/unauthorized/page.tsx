"use client"
import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  LockKeyhole,
} from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-white to-pink-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl sm:p-12">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>

        {/* Status */}
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
          Error 403
        </p>

        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Access Denied!
        </h1>

        <p className="mb-6 text-base leading-7 text-gray-600">
          Sorry! You dont have permission to access this page.
          This area is restricted to authorized administrators only.
        </p>

        {/* Warning */}
        <div className="mb-8 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-left">
          <LockKeyhole className="h-6 w-6 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">
            Your account does not have the required permissions
            to view this content.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            <Home size={19} />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
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
