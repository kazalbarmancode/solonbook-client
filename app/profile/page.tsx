
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UserRound,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  phone?: string;
};

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as ProfileUser | undefined;

  const role = user?.role || "customer";
  const isAdmin = role === "admin";

  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentName = name ?? user?.name ?? "";
  const currentEmail = user?.email ?? "";
  const currentImage = image ?? user?.image ?? "";
  const currentPhone = phone ?? user?.phone ?? "";

  if (isPending) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center text-gray-500">
        Please sign in to view your profile.
      </div>
    );
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!currentName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const { error } = await authClient.updateUser({
        name: currentName.trim(),
        image: currentImage,
        phone: currentPhone.trim(),
      });

      if (error) {
        throw new Error(error.message || "Profile update failed");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal account information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-32 bg-linear-to-r from-pink-500 to-rose-400" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-pink-100">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt="Profile"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <UserRound className="h-12 w-12 text-pink-600" />
              )}
            </div>

            <div className="pt-2 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {currentName || "User"}
              </h2>
              <p className="text-sm my-3 text-gray-500">
                {currentEmail}
              </p>

              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700 capitalize">
                {isAdmin && <ShieldCheck size={14} />}
                {isAdmin ? "Administrator" : "Customer"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    required
                    value={currentName}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 outline-none focus:border-pink-500"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={currentEmail}
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pr-4 pl-11 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={currentPhone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>

                <div className="relative">
                  <Camera className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={currentImage}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
