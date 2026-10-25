"use client";
import { toast } from "react-toastify";

import { useState } from "react";
import Link from "next/link";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

import { createClient } from "../../../../lib/supabase-client";

const supabase = createClient();

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ================================
  // EMAIL LOGIN
  // ================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const cleanEmail = email.trim();

      if (!cleanEmail || !cleanEmail.includes("@")) {
        toast.warning("Please enter a valid email address.");
        return;
      }

      // =====================================
      // Supabase Email + Password Login
      // =====================================

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        throw error;
      }

      // Login successful কিনা check
      if (!data.user || !data.session) {
        throw new Error("Login session তৈরি হয়নি।");
      }

      // =====================================
      // Supabase User → Prisma User sync
      // =====================================

      const syncResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/sync-profile`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },

          body: JSON.stringify({
            email: data.user.email ?? null,

            fullName:
              data.user.user_metadata?.full_name ??
              data.user.user_metadata?.name ??
              "Unnamed User",

            role: "CUSTOMER",
          }),
        }
      );

      if (!syncResponse.ok) {
        const syncError = await syncResponse
          .json()
          .catch(() => null);

        console.error(
          "Profile Sync Error:",
          syncError
        );

        throw new Error(
          syncError?.error ||
            "Login হয়েছে কিন্তু profile তৈরি/sync করা যায়নি।"
        );
      }

      // =====================================
      // Dashboard
      // =====================================

      window.location.href = "/";
    } catch (error: any) {
      console.error("Sign In Error:", error);

      toast.error(error?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // GOOGLE LOGIN
  // ================================

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",

          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(
        "Google Auth Error:",
        error
      );

      toast.error(error?.message ||
          "Google sign in failed."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-10">

        {/* Logo Section */}

        <div className="text-center space-y-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 justify-center"
          >
            <div className="bg-[#f99e00] text-black font-black text-2xl w-10 h-10 rounded-xl flex items-center justify-center">
              A
            </div>

            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
              Aladdin
              <span className="text-[#f99e00]">.</span>
            </span>
          </Link>

          <div className="pt-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage your wholesale business
            </p>
          </div>
        </div>

        {/* Form Section */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email Input */}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Mail size={18} />
              </span>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@company.com"
                className="w-full text-xs bg-[#f8fafc] border border-slate-200/80 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#f99e00] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Input */}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#f99e00] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative flex items-center w-full">
              <span className="absolute left-3.5 text-slate-400">
                <Lock size={18} />
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full text-xs bg-[#f8fafc] border border-slate-200/80 rounded-xl pl-10 pr-10 py-3 outline-none focus:border-[#f99e00] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f99e00] hover:bg-[#e08e00] text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>
              {loading
                ? "Signing In..."
                : "Sign In"}
            </span>

            {!loading && (
              <ArrowRight size={16} />
            )}
          </button>
        </form>

        {/* OR Separator */}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>

          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400 font-medium">
              OR
            </span>
          </div>
        </div>

        {/* Google Sign In */}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-3 disabled:opacity-60 shadow-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />

            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.31 7.27 24 12 24z"
            />

            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.19C.43 8.14 0 9.99 0 12s.43 3.86 1.19 5.39l4.08-3.15z"
            />

            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.27 0 3.17 2.69 1.19 6.61l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>

          <span>
            {googleLoading
              ? "Connecting..."
              : "Continue with Google"}
          </span>
        </button>

        {/* Footer */}

        <div className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{" "}

          <Link
            href="/sign-up"
            className="text-[#f99e00] font-bold hover:underline"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}