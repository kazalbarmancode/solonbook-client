
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Profile Image Preview
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Image size must be less than 2MB.")
      return
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }

    setErrorMsg("")
    setProfileImage(file)
    setPreviewImage(URL.createObjectURL(file))
  }

  // Remove Profile Image
  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }

    setProfileImage(null)
    setPreviewImage("")
  }

  // Signup Handler
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setErrorMsg("")

    if (name.trim().length < 2) {
      setErrorMsg("Please enter your full name.")
      return
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      return
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMsg("Password must contain an uppercase letter.")
      return
    }

    if (!/[a-z]/.test(password)) {
      setErrorMsg("Password must contain a lowercase letter.")
      return
    }

    try {
      setLoading(true)

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      })

      if (error) {
        setErrorMsg(error.message || "Unable to create account.")
        return
      }

      router.push("/sign-In")
      router.refresh()
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Google Signup
  const handleGoogleSignUp = async () => {
    setErrorMsg("")

    try {
      setGoogleLoading(true)

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch {
      setErrorMsg("Google sign up failed. Please try again.")
      setGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDF9] px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:min-h-187 lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#55102A] via-[#6F203D] to-[#873C52] p-12 text-white lg:flex">

          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <Image
            src="/images/SalonBook Beauty Logo.png"
            alt="SalonBook Logo"
            width={160}
            height={60}
            priority
            className="h-auto w-40 object-contain"
          />

          <div className="relative z-10 max-w-md">
            <h1 className="text-5xl leading-tight font-bold">
              Your Beauty,
              <span className="block text-[#E8C9CE]">
                Your Moment.
              </span>
            </h1>

            <p className="mt-6 leading-8 text-white/75">
              Join SalonBook and discover professional beauty
              services. Book your favorite treatments and enjoy
              a relaxing salon experience.
            </p>
          </div>

          <p className="relative z-10 text-sm text-white/60">
            Beauty · Care · Confidence
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">

            {/* Logo */}
            <Image
              src="/images/SalonBook Beauty Logo.png"
              alt="SalonBook Logo"
              width={160}
              height={60}
              priority
              className="h-auto w-40 object-contain"
            />

            {/* Heading */}
            <div className="mt-8 mb-7 lg:mt-0">
              <p className="mb-3 text-sm font-semibold tracking-[3px] text-[#873C52] uppercase">
                Get Started
              </p>

              <h2 className="text-3xl font-bold text-[#292323]">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your account and start your beauty journey.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative">

                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#E8C9CE] bg-[#FFF5F5]">

                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Profile preview"
                        width={80}
                        height={80}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus
                        size={28}
                        className="text-[#873C52]"
                      />
                    )}
                  </div>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white"
                      aria-label="Remove profile image"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <label className="mt-2 cursor-pointer text-sm font-medium text-[#873C52] hover:underline">
                  {profileImage
                    ? "Change Photo"
                    : "Upload Profile Photo (Optional)"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292323]">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#873C52]"
                  />

                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="h-12 rounded-xl border-[#E8C9CE] bg-[#FFFDF9] pl-11 text-[#292323]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292323]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#873C52]"
                  />

                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 rounded-xl border-[#E8C9CE] bg-[#FFFDF9] pl-11 text-[#292323]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292323]">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#873C52]"
                  />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="h-12 rounded-xl border-[#E8C9CE] bg-[#FFFDF9] pr-12 pl-11 text-[#292323]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  At least 6 characters, one uppercase and one lowercase letter.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              {/* Signup Button */}
              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="h-12 w-full rounded-xl bg-[#873C52] font-semibold text-white transition hover:bg-[#6F3044] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8C9CE]" />

              <span className="text-xs text-gray-400">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-[#E8C9CE]" />
            </div>

            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              disabled={loading || googleLoading}
              onClick={handleGoogleSignUp}
              className="h-12 w-full rounded-xl border-[#E8C9CE] text-[#292323] hover:bg-[#FFF5F5]"
            >
              {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="mr-2 h-5 w-5">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.9 46.98 31.77 46.98 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              )}

              Continue with Google
            </Button>

            {/* Sign In Link */}
            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-In"
                className="font-semibold text-[#873C52] hover:underline"
              >
                Sign In
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-400">
              By creating an account, you agree to our Terms & Conditions.
            </p>

          </div>
        </div>
      </div>
    </main>
  )
}
