
"use client"

import { useSession } from "@/lib/auth-client"
import { UserRound, Mail, Phone } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session, isPending } = useSession()

  if (isPending) return <p className="p-8">Loading profile...</p>

  if (!session?.user) return <p className="p-8">Please sign in.</p>

  const user = session.user as typeof session.user & {
    phone?: string
  }

  return (
    <div className="space-y-6 p-5 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold text-[#55102A]">My Profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          View your account information.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-[#F1E4E5] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4 border-b border-[#F1E4E5] pb-6">
          {user.image ? (
            <Image
              src={user.image}
              alt="Profile"
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F3] text-[#873C52]">
              <UserRound size={30} />
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-[#292323]">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500">Your Account</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="mb-2 text-sm text-gray-500">Full Name</p>
            <div className="flex items-center gap-3 rounded-xl bg-[#FFFDF9] p-4">
              <UserRound size={19} className="text-[#873C52]" />
              <span>{user.name}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">Email Address</p>
            <div className="flex items-center gap-3 rounded-xl bg-[#FFFDF9] p-4">
              <Mail size={19} className="text-[#873C52]" />
              <span>{user.email}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">Phone Number</p>
            <div className="flex items-center gap-3 rounded-xl bg-[#FFFDF9] p-4">
              <Phone size={19} className="text-[#873C52]" />
              <span>{user.phone || "Not provided"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
