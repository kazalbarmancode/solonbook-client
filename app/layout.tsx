import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "react-hot-toast"
import SiteLayout from "@/components/layout/SiteLayout"
import { SpeedInsights } from "@vercel/speed-insights/next"


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "SalonBook - Beauty & Salon Booking",
  description: "Book your beauty and salon appointments easily.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-screen bg-[#FFFDF9]">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#55102A",
              color: "#FFFDF9",
              borderRadius: "12px",
            },
          }}
        />
        <SiteLayout>{children}</SiteLayout>
                <SpeedInsights />

      </body>
    </html>
  )
}
