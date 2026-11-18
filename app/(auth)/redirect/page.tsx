
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthRedirectPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  console.log(session)

  const role = (
    session?.user as { role?: string } | undefined
  )?.role?.toLowerCase();
console.log(role)
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-In");
      return;
    }

    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "customer") {
      router.replace("/dashboard");
    }
  }, [session, isPending, role, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8C9CE] border-t-[#873C52]" />

        <p className="mt-4 text-sm text-[#873C52]">
          {isPending
            ? "Checking your account..."
            : !session?.user
              ? "Redirecting to sign in..."
              : role
                ? "Redirecting to your dashboard..."
                : "Your account role could not be found."}
        </p>
      </div>
    </div>
  );
}
