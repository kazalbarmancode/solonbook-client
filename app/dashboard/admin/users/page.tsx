"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Mail,
  CalendarDays,
  Ban,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import toast from "react-hot-toast"


import Image from "next/image"
import { AdminUser, getAllUsersApi, updateUserStatusApi } from "@/lib/api/usersApi"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Load all users
  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      try {
        setLoading(true)

        const data = await getAllUsersApi()

        if (!ignore) {
          setUsers(data)
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load users"
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [])

  // User statistics
  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => !user.isBlocked && user.role?.toLowerCase() !== "admin"
  ).length

  const blockedUsers = users.filter((user) => user.isBlocked).length

  const adminUsers = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length

  // Search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.name || ""
      const email = user.email || ""
      const id = user._id || ""

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase())

      const role = (user.role || "customer").toLowerCase()

      const matchesRole = roleFilter === "all" || role === roleFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked" && user.isBlocked) ||
        (statusFilter === "active" && !user.isBlocked)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  // Block / Unblock user
  const handleStatusUpdate = async (user: AdminUser) => {
    if (user.role?.toLowerCase() === "admin") {
      toast.error("Admin account cannot be blocked")
      return
    }

    const nextStatus = !user.isBlocked

    try {
const userId = user._id ?? user.id;

if (!userId) {
  toast.error("User ID not found");
  return;
}

setSelectedUser(userId);

const updatedUser = await updateUserStatusApi(userId, nextStatus);

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id
            ? { ...item, ...updatedUser, isBlocked: nextStatus }
            : item
        )
      )

      toast.success(
        nextStatus ? "User blocked successfully" : "User unblocked successfully"
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return "N/A"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return "N/A"

    return parsedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen space-y-7 bg-[#FFFDF9] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#873C52] uppercase">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#55102A] sm:text-3xl">
            Users Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage all registered customers and admin accounts.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#E8C9CE] px-4 py-3 text-sm font-semibold text-[#873C52] transition hover:bg-[#FDF1F3]"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Active Customers"
          value={activeUsers}
          icon={<UserCheck size={22} />}
        />

        <StatCard
          title="Blocked Users"
          value={blockedUsers}
          icon={<UserX size={22} />}
        />

        <StatCard
          title="Admin Accounts"
          value={adminUsers}
          icon={<ShieldCheck size={22} />}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#F0E4E6] bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm transition outline-none focus:border-[#873C52] focus:ring-2 focus:ring-[#873C52]/10"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#873C52]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F0E4E6] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#55102A]">
              All Registered Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredUsers.length} of {totalUsers} users
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-75 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-[#873C52]"
              />
              <p className="mt-3 text-sm text-gray-500">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-75 flex-col items-center justify-center px-4 text-center">
            <Users size={45} className="text-[#E8C9CE]" />

            <h3 className="mt-4 text-lg font-bold text-[#55102A]">
              No users found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212 text-left">
              <thead className="bg-[#FFF8F8]">
                <tr className="text-xs tracking-wider text-gray-500 uppercase">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Joined Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role?.toLowerCase() === "admin"

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-[#FFFAFA]"
                    >
                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User"}
                              width={44}
                              height={44}
                              unoptimized
                              referrerPolicy="no-referrer"
                              className="h-11 w-11 rounded-full border border-[#E8C9CE] object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8E8EC] font-bold text-[#873C52]">
                              {(user.name || user.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-[#55102A]">
                              {user.name || "Unnamed User"}
                            </p>

                            <p className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail size={12} />
                              {user.email}
                            </p>

                            <p className="mt-1 max-w-55 truncate text-[10px] text-gray-400">
                              ID: {user._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isAdmin
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {isAdmin && <ShieldCheck size={13} />}
                          {isAdmin ? "Admin" : "Customer"}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays size={15} className="text-[#873C52]" />
                          {formatDate(user.createdAt)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            user.isBlocked
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? (
                            <Ban size={13} />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}

                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        {isAdmin ? (
                          <span className="text-xs font-semibold text-gray-400">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(user)}
                            disabled={updatingId === user._id}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            {updatingId === user._id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <UserCheck size={14} />
                            ) : (
                              <Ban size={14} />
                            )}

                            {updatingId === user._id
                              ? "Updating..."
                              : user.isBlocked
                                ? "Unblock"
                                : "Block"}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Statistics Card
function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#F0E4E6] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#55102A]">{value}</h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8E8EC] text-[#873C52]">
          {icon}
        </div>
      </div>
    </div>
  )
}
