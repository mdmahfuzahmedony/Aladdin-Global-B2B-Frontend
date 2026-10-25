"use client";

import React, { useState } from "react";
import Link from "next/link";

import { OtpModal } from "@/app/(auth)/become-seller/components/OtpModal";
import { createClient } from "../../../../lib/supabase-client";

const supabase = createClient();

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  // ============================
  // Normal Signup
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSubmitting(true);

    try {
      // Clean input
      const fullName = formData.fullName.trim();
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      // Basic validation
      if (!fullName) {
        throw new Error("Please enter your full name.");
      }

      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      console.log("SIGNUP EMAIL:", email);
      console.log("SIGNUP NAME:", fullName);

      // ============================
      // Supabase Signup
      // ============================
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "CUSTOMER",
          },
        },
      });

      if (error) {
        console.error("SUPABASE SIGNUP ERROR:", error);

        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Signup could not be completed.");
      }

      console.log("SUPABASE USER CREATED:", data.user);

      // ============================
      // OTP Modal
      // ============================
      setShowOtpModal(true);
    } catch (error: any) {
      console.error("SIGNUP ERROR:", error);

      setErrorMsg(error?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================
  // Google Signup
  // ============================
  const handleGoogleSignup = async () => {
    try {
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error("GOOGLE SIGNUP ERROR:", error);

        setErrorMsg(error.message);
      }
    } catch (error: any) {
      console.error("GOOGLE SIGNUP ERROR:", error);

      setErrorMsg(error?.message || "Google signup failed.");
    }
  };

  // ============================
  // OTP Verified
  // ============================
  const handleOtpVerified = () => {
    setShowOtpModal(false);

    window.location.href = "/set-location";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-7 my-8">
        {/* ============================
            Header
        ============================ */}
        <div className="text-center space-y-2 mb-6">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-amber-500 text-slate-950 font-black text-2xl px-3 py-1 rounded-xl">
              A
            </div>

            <span className="font-extrabold text-2xl text-slate-900">
              Aladdin
              <span className="text-amber-500">.</span>
            </span>
          </Link>

          <h2 className="text-xl font-bold text-slate-900 pt-2">
            Create Account
          </h2>

          <p className="text-xs text-slate-500">
            Join thousands of buyers across Bangladesh
          </p>

          {/* ============================
              Seller Option Only
          ============================ */}
          <div className="mt-5">
            <div className="p-3.5 bg-amber-50 border border-amber-200/70 rounded-xl flex items-center justify-between gap-3 hover:border-amber-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2.5 text-left min-w-0">
                <div className="shrink-0 bg-amber-500 text-slate-950 p-2 rounded-lg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 9l1-5h16l1 5" />
                    <path d="M5 9v11h14V9" />
                    <path d="M3 9c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3" />
                    <path d="M9 20v-5h6v5" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Want to sell products?
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Register as a Seller
                  </p>
                </div>
              </div>

              <Link
                href="/become-seller"
                className="shrink-0 text-[11px] font-bold text-amber-700 bg-white border border-amber-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-500 hover:text-white transition-all shadow-sm"
              >
                Apply →
              </Link>
            </div>
          </div>
        </div>

        {/* ============================
            Error
        ============================ */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* ============================
            Signup Form
        ============================ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>

            <div className="relative">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>

              <input
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>

              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>

            <div className="relative flex items-center w-full">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 018 0v3" />
              </svg>

              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                    <path d="M9.9 4.2A10.8 10.8 0 0112 4c7 0 10 8 10 8a17 17 0 01-3.1 4.5" />
                    <path d="M6.1 6.1C3.6 8.2 2 12 2 12s3 8 10 8c1 0 1.9-.1 2.8-.4" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors mt-4 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account..." : "Create Account"}

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        {/* ============================
            OR
        ============================ */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-[11px] text-slate-400">OR</span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* ============================
            Google
        ============================ */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />

            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />

            <path
              fill="#4CAF50"
              d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 26.9 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5C9.5 39.6 16.2 44 24 44z"
            />

            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-11.3 5.7l6.6 5.4C41.6 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>

        {/* ============================
            Sign In
        ============================ */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-amber-600 font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* ============================
          OTP
      ============================ */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={formData.email.trim().toLowerCase()}
        onVerify={handleOtpVerified}
      />
    </div>
  );
}
