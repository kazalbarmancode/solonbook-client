
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Last updated: November 22, 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-7">
          <section>
            <h2 className="mb-2 text-xl font-semibold">1. Information We Collect</h2>
            <p>
              SalonBook may collect your name, email address, phone number,
              profile image, appointment details, and payment-related
              information necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">2. How We Use Information</h2>
            <p>
              We use your information to manage your account, process
              appointments, communicate booking updates, and improve our
              platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">3. Payment Security</h2>
            <p>
              Payments are processed through Stripe. We do not store your
              complete payment card details on SalonBook servers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">4. Data Protection</h2>
            <p>
              We take reasonable steps to protect your personal information
              against unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">5. Information Sharing</h2>
            <p>
              We do not sell your personal information. Necessary information
              may be shared with service providers to operate the platform
              and process payments.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">6. Your Choices</h2>
            <p>
              You can update your profile information through your account.
              You may contact the SalonBook support team with privacy-related
              questions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact
              the SalonBook support team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
