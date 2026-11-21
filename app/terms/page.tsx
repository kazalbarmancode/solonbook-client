
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-5 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <ShieldCheck className="text-pink-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">
            Terms and Conditions
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: November 22, 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-7">
          <section>
            <h2 className="mb-2 text-xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to SalonBook. By using our platform, you agree to
              follow these terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">2. Account Registration</h2>
            <p>
              Users must provide accurate information when creating an
              account and keep their login credentials secure.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">3. Appointments</h2>
            <p>
              Customers can book available salon services. Appointment
              confirmation depends on salon administration.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">4. Payments</h2>
            <p>
              Payments are processed through our supported payment provider.
              Appointment payment status is updated after successful payment
              verification.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">5. Cancellation</h2>
            <p>
              Customers may cancel appointments according to the cancellation
              rules available on the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">6. User Responsibilities</h2>
            <p>
              Users must not misuse the platform, provide false information,
              or attempt unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">7. Contact</h2>
            <p>
              For questions about these terms, please contact the SalonBook
              support team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
