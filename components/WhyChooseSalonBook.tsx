"use client"

import { Trophy, CalendarCheck, Gem, ShieldCheck } from "lucide-react"

const features = [
  {
    id: 1,
    title: "Expert Professionals",
    description: "Skilled beauty professionals",
    icon: Trophy,
  },
  {
    id: 2,
    title: "Easy Booking",
    description: "Simple online appointment",
    icon: CalendarCheck,
  },
  {
    id: 3,
    title: "Quality Care",
    description: "Premium salon services",
    icon: Gem,
  },
  {
    id: 4,
    title: "Trusted Experience",
    description: "Your satisfaction is our priority",
    icon: ShieldCheck,
  },
]

export default function WhyChooseSalonBook() {
  return (
    <section className="bg-[#FAF2F0] px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px w-20 bg-[#D8B4BC] sm:block md:w-32" />
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#4A1525] md:text-4xl">
              Why Choose SalonBook?
            </h2>
            <span className="hidden h-px w-20 bg-[#D8B4BC] sm:block md:w-32" />
          </div>

          <p className="mt-2 text-sm text-[#6E4752] md:text-base">
            Experience the best salon service with us
          </p>
        </div>

        {/* 4 Columns Grid with Vertical Dividers */}
        <div className="grid grid-cols-1 divide-y divide-[#E5C6CD] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {features.map((item) => {
            const IconComponent = item.icon

            return (
              <div
                key={item.id}
                className="group flex flex-col items-center px-6 py-6 text-center transition-all duration-300"
              >
                {/* Soft Blush Circular Badge */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2DADF] text-[#5A1E32] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#5A1E32] group-hover:text-white">
                  <IconComponent size={28} strokeWidth={1.8} />
                </div>

                {/* Feature Title */}
                <h3 className="text-base font-bold text-[#2D141C] md:text-lg">
                  {item.title}
                </h3>

                {/* Feature Description */}
                <p className="mt-1 text-xs text-[#6E4752] md:text-sm">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}