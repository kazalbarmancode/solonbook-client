
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import DashboardSideBar from "../components/DashbordSideBer";

type UserRole = "customer" | "admin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  // Get role from logged-in user
  const rawRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const role = rawRole?.toLowerCase() as UserRole | undefined;

  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  useEffect(() => {
    if (isPending) return;

    // If user is not logged in
    if (!session?.user) {
      router.replace("/sign-In");
      return;
    }

    // Admin access
    if (role === "admin") {
      if (!isAdminRoute) {
        router.replace("/dashboard/admin");
      }
      return;
    }

    // Customer access
    if (role === "customer") {
      if (isAdminRoute) {
        router.replace("/dashboard/costomers");
      }
      return;
    }

    // Unknown role
    router.replace("/sign-In");

  }, [session, isPending, role, isAdminRoute, router]);

  const isAllowed =
    !isPending &&
    !!session?.user &&
    (
      (role === "admin" && isAdminRoute) ||
      (role === "customer" && !isAdminRoute)
    );

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8C9CE] border-t-[#873C52]" />

          <p className="mt-4 text-sm font-medium text-[#873C52]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-[#FFFDF9]">

        {/* Role Based Sidebar */}
        <DashboardSideBar role={role!} />

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">

          {/* Mobile Header */}
          <div className="flex items-center border-b border-[#E8C9CE]/40 bg-white px-4 py-3 md:hidden">
            <SidebarTrigger className="text-[#55102A]" />

            <span className="ml-3 text-sm font-semibold text-[#55102A]">
              {role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}
            </span>
          </div>

          <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 md:p-8">
            {children}
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
}
