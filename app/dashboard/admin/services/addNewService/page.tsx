"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Loader2, Scissors, Save, X } from "lucide-react"

import { addServiceApi, type ServicePayload } from "@/lib/api/servicesApi"
import Image from "next/image"
import toast from "react-hot-toast"

const initialForm: ServicePayload = {
  name: "",
  category: "",
  price: 0,
  duration: "",
  description: "",
  image: "",
  isActive: true,
}

export default function AddNewServicesPage() {
  const router = useRouter()

  const [formData, setFormData] = useState(initialForm)
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.")
      e.target.value = ""
      return
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }))

    if (name === "price") {
      setPrice(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.category ||
      !price ||
      Number(price) <= 0 ||
      !formData.duration ||
      !formData.description.trim() ||
      (!imageFile && !formData.image.trim())
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      let uploadedImageUrl = formData.image

      if (imageFile) {
        setUploading(true)

        const uploadFormData = new FormData()
        uploadFormData.append("image", imageFile)

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: uploadFormData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Image upload failed")
        }

        uploadedImageUrl = result.url
        setUploading(false)
      }

      await addServiceApi({
        ...formData,
        image: uploadedImageUrl,
        price: Number(price),
      })

      toast.success("Service added successfully!")

      setFormData(initialForm)
      setPrice("")
      setImageFile(null)
      setImagePreview("")

      router.push("/dashboard/admin/services")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add service"
      )
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }
  return (
    <div className="min-h-full bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin/services"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#873C52] transition hover:text-[#55102A]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#873C52]/10 text-[#873C52]">
              <Scissors size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#292323] sm:text-3xl">
                Add New Service
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new beauty service for your customers.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-2xl border border-[#E8C9CE]/50 bg-white shadow-sm">
            {/* Basic Information */}
            <div className="border-b border-[#E8C9CE]/40 p-5 sm:p-8">
              <h2 className="mb-1 text-lg font-semibold text-[#292323]">
                Basic Information
              </h2>

              <p className="mb-6 text-sm text-gray-500">
                Enter the main details of your salon service.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#292323]">
                    Service Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Hair Styling"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292323]">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
                  >
                    <option value="">Select category</option>
                    <option value="Hair">Hair</option>
                    <option value="Skin">Skin</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Nails">Nails</option>
                    <option value="Spa">Spa</option>
                    <option value="Facial">Facial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292323]">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    min="1"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#873C52]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292323]">
                    Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
                  >
                    <option value="">Select duration</option>
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="60 minutes">60 minutes</option>
                    <option value="90 minutes">90 minutes</option>
                    <option value="120 minutes">120 minutes</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#292323]">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your salon service..."
                    rows={5}
                    required
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#873C52]"
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="border-b border-[#E8C9CE]/40 p-5 sm:p-8">
              <h2 className="mb-1 text-lg font-semibold text-[#292323]">
                Service Image
              </h2>

              <p className="mb-5 text-sm text-gray-500">
                Upload your service image to ImgBB (Maximum 5MB).
              </p>

              <div className="mb-5 flex min-h-48 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#E8C9CE] bg-[#FFFDF9] p-5">
                {imagePreview || formData.image ? (
                  <Image
                    src={imagePreview || formData.image}
                    alt="Service preview"
                    width={600}
                    height={400}
                    unoptimized
                    className="max-h-52 max-w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImagePlus
                      size={36}
                      className="mx-auto mb-3 text-[#873C52]"
                    />
                    <p className="text-sm font-medium text-[#292323]">
                      Image Preview
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Select an image from your device
                    </p>
                  </div>
                )}
              </div>

              <label className="mb-2 block text-sm font-semibold text-[#292323]">
                Choose Service Image *
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />

              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    if (imagePreview) URL.revokeObjectURL(imagePreview)
                    setImageFile(null)
                    setImagePreview("")
                  }}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove Image
                </button>
              )}
            </div>
            {/* Status */}
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-lg font-semibold text-[#292323]">
                Service Status
              </h2>
              <p className="mb-5 text-sm text-gray-500">
                Choose whether customers can see this service.
              </p>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#E8C9CE]/50 bg-[#FFFDF9] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#292323]">
                    Active Service
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Make this service available to customers.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-[#873C52]"
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#E8C9CE]/40 bg-[#FFFDF9] p-5 sm:flex-row sm:px-8">
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <X size={17} />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#873C52] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#55102A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Add Service
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
