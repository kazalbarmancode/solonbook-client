
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyPaymentApi } from "@/lib/api/paymentsApi";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(!!sessionId);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const verified = useRef(false);

  useEffect(() => {
    if (!sessionId || verified.current) return;

    verified.current = true;

    const verifyPayment = async () => {
      try {
        const result = await verifyPaymentApi(sessionId);

        setSuccess(true);
        setMessage(
          result.message || "Your payment has been verified successfully!"
        );
      } catch (err) {
        console.error("Payment verification error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify payment"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  // Session ID না থাকলে সরাসরি error দেখাবে
  const missingSession = !sessionId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {loading ? (
          <>
            <div className="mb-4 text-5xl">⏳</div>
            <h1 className="text-2xl font-bold text-gray-800">
              Verifying Payment
            </h1>
            <p className="mt-3 text-gray-600">
              Please wait while we verify your payment.
            </p>
          </>
        ) : success ? (
          <>
            <div className="mb-4 text-5xl">✅</div>
            <h1 className="text-2xl font-bold text-green-700">
              Payment Successful!
            </h1>
            <p className="mt-3 text-gray-600">{message}</p>
          </>
        ) : (
          <>
            <div className="mb-4 text-5xl">❌</div>
            <h1 className="text-2xl font-bold text-red-600">
              Payment Verification Failed
            </h1>
            <p className="mt-3 text-sm text-red-500">
              {missingSession
                ? "Payment session ID not found."
                : error}
            </p>
          </>
        )}

        {!loading && (
          <Link
            href="/dashboard/appointments"
            className="mt-6 inline-block rounded-lg bg-[#873C52] px-6 py-3 text-white"
          >
            My Appointments
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
