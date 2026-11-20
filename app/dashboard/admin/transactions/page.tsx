"use client"

import { useEffect, useState } from "react"
import {
  CreditCard,
  DollarSign,
  Receipt,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react"
import toast from "react-hot-toast"
import { getAdminTransactionsApi, Transaction } from "@/lib/api/paymentsApi"

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  const fetchTransactions = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true)
      }

      setError("")

      const result = await getAdminTransactionsApi()

      setTransactions(result.data || [])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load transactions"

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    const loadTransactions = async () => {
      try {
        const result = await getAdminTransactionsApi()

        if (!ignore) {
          setTransactions(result.data || [])
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error ? err.message : "Failed to load transactions"

          setError(message)
          toast.error(message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      ignore = true
    }
  }, [])

  // Search transactions
  const filteredTransactions = transactions.filter((item) => {
    const searchValue = search.toLowerCase()

    return (
      item.customerName?.toLowerCase().includes(searchValue) ||
      item.customerEmail?.toLowerCase().includes(searchValue) ||
      item.appointmentId?.toLowerCase().includes(searchValue) ||
      item.stripeSessionId?.toLowerCase().includes(searchValue) ||
      item.paymentStatus?.toLowerCase().includes(searchValue)
    )
  })

  // Statistics
  const totalTransactions = transactions.length

  const successfulPayments = transactions.filter(
    (item) => item.paymentStatus === "Paid"
  ).length

  const totalRevenue = transactions.reduce((total, item) => {
    if (item.paymentStatus === "Paid") {
      return total + Number(item.amount || 0)
    }
    return total
  }, 0)

  const currency = transactions[0]?.currency?.toUpperCase() || "USD"

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#873C52]">Admin Dashboard</p>

          <h1 className="mt-2 text-3xl font-bold text-[#55102A]">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor and manage all customer payments.
          </p>
        </div>

        <button
          onClick={() => fetchTransactions(true)}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#873C52] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6f2d40] disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Transactions */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {totalTransactions}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Receipt size={25} />
            </div>
          </div>
        </div>

        {/* Successful Payments */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Successful Payments</p>

              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {successfulPayments}
              </h2>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <CreditCard size={25} />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Revenue ({currency})
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-800">
                {currency === "USD" ? "$" : ""}
                {totalRevenue.toFixed(2)}
                {currency !== "USD" ? ` ${currency}` : ""}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <DollarSign size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View all customer payment records.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pr-4 pl-10 text-sm transition outline-none focus:border-[#873C52]"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#873C52]" />

            <p className="mt-3 text-sm text-gray-500">
              Loading transactions...
            </p>
          </div>
        ) : error ? (
          <div className="py-14 text-center">
            <p className="text-red-500">{error}</p>

            <button
              onClick={() => fetchTransactions(true)}
              className="mt-4 rounded-lg bg-[#873C52] px-5 py-2 text-sm text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt size={42} className="mx-auto text-gray-300" />

            <h3 className="mt-4 font-semibold text-gray-700">
              No Transactions Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try searching with another keyword."
                : "No payment transactions are available yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Appointment ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((item) => (
                  <tr key={item._id} className="transition hover:bg-gray-50">
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {item.customerName || "Unknown Customer"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.customerEmail || item.userId}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4 text-gray-700">
                      {item.serviceName || "—"}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {item.currency?.toUpperCase()}{" "}
                      {Number(item.amount || 0).toFixed(2)}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-gray-600">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>

                    {/* Appointment ID */}
                    <td className="px-5 py-4 text-xs text-gray-500">
                      <span title={item.appointmentId}>
                        {item.appointmentId?.slice(0, 12)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && !error && filteredTransactions.length > 0 && (
          <div className="border-t px-5 py-4 text-sm text-gray-500">
            Showing {filteredTransactions.length} of {totalTransactions}{" "}
            transactions
          </div>
        )}
      </div>
    </div>
  )
}
