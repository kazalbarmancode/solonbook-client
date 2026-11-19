
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Loader2,
  Save,
  ImageIcon,
  Scissors,
} from "lucide-react";

import {
  getSingleServiceApi,
  updateServiceApi,
  type ServicePayload,
} from "@/lib/api/servicesApi";

const initialFormData: ServicePayload = {
  name: "",
  category: "",
  price: 0,
  duration: "",
  description: "",
  image: "",
  isActive: true,
};

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [formData, setFormData] =
    useState<ServicePayload>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load existing service data
  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const service = await getSingleServiceApi(id);

        setFormData({
          name: service.name || "",
          category: service.category || "",
          price: Number(service.price) || 0,
          duration: service.duration || "",
          description: service.description || "",
          image: service.image || "",
          isActive: service.isActive ?? true,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load service";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Submit updated service
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.duration.trim() ||
      !formData.description.trim() ||
      !formData.image.trim() ||
      formData.price <= 0
    ) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    try {
      setSubmitting(true);

      await updateServiceApi(id, formData);

      toast.success("Service updated successfully!");

      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update service";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#873C52]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading service information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Scissors className="mb-4 h-12 w-12 text-[#873C52]" />

        <h2 className="text-xl font-bold text-[#55102A]">
          Unable to Load Service
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error}
        </p>

        <Link
          href="/dashboard/admin/services"
          className="mt-6 rounded-xl bg-[#873C52] px-6 py-3 text-sm font-semibold text-white hover:bg-[#55102A]"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/admin/services"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#873C52]"
          >
            <ArrowLeft size={17} />
            Back to Services
          </Link>

          <h1 className="text-2xl font-bold text-[#55102A] sm:text-3xl">
            Edit Service
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your salon service information.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#E8C9CE] bg-white px-4 py-3">
          <Scissors className="h-5 w-5 text-[#873C52]" />
          <span className="text-sm font-semibold text-[#55102A]">
            SalonBook Admin
          </span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[#E8C9CE]/60 bg-white shadow-sm"
      >
        <div className="border-b border-[#E8C9CE]/50 bg-[#FFFDF9] px-6 py-5">
          <h2 className="text-lg font-bold text-[#55102A]">
            Service Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Edit the details below and save your changes.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">

          {/* Service Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Service Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter service name"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Category *
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            >
              <option value="">Select category</option>
              <option value="Hair">Hair</option>
              <option value="Skin">Skin</option>
              <option value="Nails">Nails</option>
              <option value="Makeup">Makeup</option>
              <option value="Spa">Spa</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Price (৳) *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Duration *
            </label>

            <input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Example: 45 minutes"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Service Image URL *
            </label>

            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            />

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#E8C9CE]/60 bg-[#FFFDF9] p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <ImageIcon size={17} />
                  Image Preview
                </div>

                <img
                  src={formData.image}
                  alt="Service preview"
                  className="h-48 w-full rounded-lg object-cover sm:w-72"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Write service description..."
              required
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3 rounded-xl border border-[#E8C9CE]/60 bg-[#FFFDF9] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#55102A]">
                  Service Status
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Control whether customers can see this service.
                </p>
              </div>

              <select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "true",
                  }))
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-[#873C52]"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#E8C9CE]/50 bg-[#FFFDF9] px-6 py-5 sm:flex-row sm:justify-end">

          <Link
            href="/dashboard/admin/services"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#873C52] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#55102A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Service
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
