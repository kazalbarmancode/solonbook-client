
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Email Sign In
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setErrorMsg("")

    if (!email.trim() || !password) {
      setErrorMsg("Please enter your email and password.")
      return
    }

    try {
      setLoading(true)

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/",
      })

      if (error) {
        setErrorMsg(error.message || "Invalid email or password.")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg("")

    try {
      setGoogleLoading(true)

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch {
      setErrorMsg("Google sign in failed. Please try again.")
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
              Welcome
              <span className="block text-[#E8C9CE]">
                Back!
              </span>
            </h1>

            <p className="mt-6 leading-8 text-white/75">
              Your beauty journey continues here. Sign in to
              explore professional beauty services and manage
              your salon appointments with ease.
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
            <div className="mt-8 mb-8 lg:mt-0">
              <p className="mb-3 text-sm font-semibold tracking-[3px] text-[#873C52] uppercase">
                Welcome Back
              </p>

              <h2 className="text-3xl font-bold text-[#292323]">
                Sign In
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your account details to continue your beauty journey.
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between gap-3">

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-[#873C52]"
                  />
                  Remember Me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#873C52] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="h-12 w-full rounded-xl bg-[#873C52] font-semibold text-white transition hover:bg-[#6F3044] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8C9CE]" />

              <span className="text-xs text-gray-400">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-[#E8C9CE]" />
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              disabled={loading || googleLoading}
              onClick={handleGoogleSignIn}
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

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Dont have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#873C52] hover:underline"
              >
                Create Account
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-400">
              By signing in, you agree to our Terms & Conditions.
            </p>

          </div>
        </div>
      </div>
    </main>
  )
}
