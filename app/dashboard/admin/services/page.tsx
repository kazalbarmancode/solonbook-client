"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Scissors,
  CheckCircle2,
  PauseCircle,
  Layers,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import toast from "react-hot-toast"

import {
  updateServiceStatusApi,
  deleteServiceApi,
  type Service,
  getAllServicesApi,
} from "@/lib/api/servicesApi"
import Image from "next/image"

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const itemsPerPage = 8

  const fetchServices = async () => {
    try {
      setLoading(true)

      const data = await getAllServicesApi()
      setServices(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    const loadServices = async () => {
      try {
        const data = await getAllServicesApi()

        if (!ignore) {
          setServices(data)
        }
      } catch (error) {
        console.error(error)

        if (!ignore) {
          toast.error("Failed to load services")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadServices()

    return () => {
      ignore = true
    }
  }, [])

  const totalServices = services.length
  const activeServices = services.filter((s) => s.isActive !== false).length
  const inactiveServices = services.filter((s) => s.isActive === false).length
  const totalCategories = new Set(
    services.map((s) => s.category).filter(Boolean)
  ).size

  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category).filter(Boolean))],
    [services]
  )

  const filteredServices = useMemo(() => {
    let result = [...services]

    if (search.trim()) {
      result = result.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase().trim())
      )
    }

    if (category !== "All") {
      result = result.filter((service) => service.category === category)
    }

    if (status === "Active") {
      result = result.filter((service) => service.isActive !== false)
    } else if (status === "Inactive") {
      result = result.filter((service) => service.isActive === false)
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
    }

    return result
  }, [services, search, category, status, sort])

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)

  const currentServices = filteredServices.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const handleStatusChange = async (service: Service) => {
    try {
      setActionId(service._id)

      await updateServiceStatusApi(service._id, service.isActive === false)

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? { ...item, isActive: service.isActive === false }
            : item
        )
      )

      toast.success(
        service.isActive === false
          ? "Service activated successfully"
          : "Service deactivated successfully"
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Status update failed"
      )
    } finally {
      setActionId(null)
    }
  }

  // Delete service
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setActionId(deleteId)

      await deleteServiceApi(deleteId)

      setServices((prev) => prev.filter((service) => service._id !== deleteId))

      toast.success("Service deleted successfully")
      setDeleteId(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      )
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="min-h-full bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
        <h1 className="text-2xl font-bold text-[#292323] sm:text-3xl">
              Manage Services
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your salon services, pricing and availability.
            </p>
          </div>

          <Link
            href="/dashboard/admin/services/addNewService"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#873C52] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#55102A]"
          >
            <Plus size={19} />
            Add New Service
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#873C52]/10 text-[#873C52]">
                <Scissors size={22} />
              </div>
              <span className="text-xs font-medium text-gray-400">Total</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[#292323]">
              {loading ? "—" : totalServices}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Total Services</p>
          </div>

          <div className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={22} />
              </div>
              <span className="text-xs font-medium text-gray-400">
                Available
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[#292323]">
              {loading ? "—" : activeServices}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Active Services</p>
          </div>

          <div className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <PauseCircle size={22} />
              </div>
              <span className="text-xs font-medium text-gray-400">
                Unavailable
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[#292323]">
              {loading ? "—" : inactiveServices}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Inactive Services</p>
          </div>

          <div className="rounded-2xl border border-[#E8C9CE]/50 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Layers size={22} />
              </div>
              <span className="text-xs font-medium text-gray-400">Groups</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[#292323]">
              {loading ? "—" : totalCategories}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Categories</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E8C9CE]/50 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#E8C9CE]/40 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#292323]">All Services</h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredServices.length} services found
              </p>
            </div>

            <button
              onClick={fetchServices}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8C9CE] px-4 py-2 text-sm font-medium text-[#873C52] transition hover:bg-[#FFFDF9] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid gap-3 border-b border-[#E8C9CE]/40 p-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search service name..."
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm transition outline-none focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setPage(1)
                }}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pr-3 pl-9 text-sm outline-none focus:border-[#873C52]"
              >
                <option value="All">All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#873C52]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#873C52] sm:col-span-2 lg:col-span-4"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#873C52]" />
              <p className="text-sm text-gray-500">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#873C52]/10 text-[#873C52]">
                <Scissors size={30} />
              </div>
              <h3 className="text-lg font-bold text-[#292323]">
                No Services Found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                No services match your search or filter. Try changing your
                filters or add a new service.
              </p>
              <Link
                href="/dashboard/admin/services/add"
                className="mt-5 rounded-xl bg-[#873C52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#55102A]"
              >
                Add New Service
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-212 text-left">
                  <thead className="bg-[#FFFDF9]">
                    <tr className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      <th className="px-6 py-4">Service</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4">Duration</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E8C9CE]/30">
                    {currentServices.map((service) => (
                      <tr
                        key={service._id}
                        className="transition hover:bg-[#FFFDF9]/80"
                      >
                        {/* Service */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={service.image}
                              alt={service.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-xl border border-[#E8C9CE]/50 bg-gray-50 object-cover"
                            />
                            <div>
                              <p className="font-semibold text-[#292323]">
                                {service.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                ID: {service._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#873C52]/10 px-3 py-1.5 text-xs font-medium text-[#873C52]">
                            {service.category}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#292323]">
                          ৳{service.price.toLocaleString("en-BD")}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {service.duration}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              service.isActive !== false
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                service.isActive !== false
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            {service.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/services/${service._id}`}
                              title="View service"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#873C52] hover:bg-[#873C52]/5 hover:text-[#873C52]"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              href={`/dashboard/admin/services/edit/${service._id}`}
                            >
                              <Pencil size={16} />
                            </Link>

                            <button
                              type="button"
                              title={
                                service.isActive !== false
                                  ? "Deactivate service"
                                  : "Activate service"
                              }
                              disabled={actionId === service._id}
                              onClick={() => handleStatusChange(service)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50"
                            >
                              {actionId === service._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <PauseCircle size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              title="Delete service"
                              onClick={() => setDeleteId(service._id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E8C9CE]/40 px-5 py-4 sm:flex-row sm:px-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-[#292323]">
                    {(page - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#292323]">
                    {Math.min(page * itemsPerPage, filteredServices.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#292323]">
                    {filteredServices.length}
                  </span>{" "}
                  services
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-[#FFFDF9] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="min-w-20 text-center text-sm font-semibold text-[#873C52]">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-[#FFFDF9] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={23} />
              </div>

              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={actionId === deleteId}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#292323]">
              Delete Service?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={actionId === deleteId}
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionId === deleteId}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionId === deleteId ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
