
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navber";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <Navbar />

      {children}

      {!isDashboard && <Footer />}
    </>
  );
}