"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Loader2,
  Scissors,
  Flower2,
  Sparkles,
  Smile,
  Brush,
  Gem,
  HeartHandshake,
  Crown,
} from "lucide-react"

interface Service {
  _id: string
  name: string
  category: string
  isActive: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const categoryDesigns = [
  {
    name: "Hair",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=85",
    icon: Scissors,
  },
  {
    name: "Hair Treatment",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85",
    icon: Flower2,
  },
  {
    name: "Hair Styling",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=85",
    icon: Sparkles,
  },
  {
    name: "Skin Care",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=85",
    icon: Smile,
  },
  {
    name: "Makeup",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=85",
    icon: Brush,
  },
  {
    name: "Nail Care",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=85",
    icon: Gem,
  },
  {
    name: "Spa & Wellness",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85",
    icon: HeartHandshake,
  },
  {
    name: "Beauty Care",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=85",
    icon: Crown,
  },
]

export default function SalonServiceCategories() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/futured-all`)

        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }

        const services: Service[] = await response.json()
        const categoryCounts: Record<string, number> = {}

        services
          .filter((service) => service.isActive)
          .forEach((service) => {
            const name = service.category?.trim()
            if (!name) return

            const existingKey = Object.keys(categoryCounts).find(
              (category) => category.toLowerCase() === name.toLowerCase()
            )

            const finalKey = existingKey || name

            categoryCounts[finalKey] = (categoryCounts[finalKey] || 0) + 1
          })

        setCounts(categoryCounts)
      } catch (error) {
        console.error("Category loading error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center bg-[#FAF2F0] py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#5A1E32]" />
      </div>
    )
  }

  return (
    <section className="bg-[#FAF2F0] px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px w-20 bg-[#D8B4BC] sm:block md:w-32" />
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#4A1525] md:text-4xl">
              Salon Service Categories
            </h2>
            <span className="hidden h-px w-20 bg-[#D8B4BC] sm:block md:w-32" />
          </div>

          <p className="mt-2 text-sm text-[#6E4752] md:text-base">
            Find your favorite service category
          </p>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categoryDesigns.map((category) => {
            const IconComponent = category.icon

            const count =
              counts[category.name] ??
              Object.entries(counts).find(
                ([name]) => name.toLowerCase() === category.name.toLowerCase()
              )?.[1] ??
              0

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group relative flex h-44 flex-col items-center justify-center overflow-hidden rounded-2xl p-3 text-center shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Background Image with Blur */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 13vw"
                  className="scale-110 object-cover blur-[2px] transition-transform duration-700 group-hover:scale-125"
                />

                {/* Dark Burgundy Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-[#4E2A32]/75 via-[#3D1822]/80 to-[#2B0D15]/95 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Service Count Badge */}
                <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
                  {count}
                </span>

                {/* Center Icon & Title */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <IconComponent
                    strokeWidth={1.5}
                    className="mb-3 h-9 w-9 text-white transition-transform duration-300 group-hover:scale-110"
                  />

                  <h3 className="px-1 text-sm leading-snug font-semibold text-white">
                    {category.name}
                  </h3>
                </div>

                {/* Bottom Right Circular Arrow Icon */}
                <span className="absolute right-2.5 bottom-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/60 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#4A1525]">
                  <ArrowRight size={13} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}