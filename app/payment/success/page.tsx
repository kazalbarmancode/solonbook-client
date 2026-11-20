
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
        let paymentConfirmed = false;

        // Wait up to 10 times for webhook database update
        for (let attempt = 0; attempt < 10; attempt++) {
          const result = await verifyPaymentApi(sessionId);

          if (result.paymentStatus === "Paid") {
            paymentConfirmed = true;
            setSuccess(true);
            setMessage("Your payment has been verified successfully!");
            break;
          }

          // Wait 2 seconds before checking again
          if (attempt < 9) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        if (!paymentConfirmed) {
          setError(
            "Payment received, but confirmation is still processing. Please check My Appointments again shortly."
          );
        }
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
              Please wait while we confirm your payment.
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
              Payment Confirmation Pending
            </h1>
            <p className="mt-3 text-sm text-gray-600">
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
