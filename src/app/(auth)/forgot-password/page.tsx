"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth-helpers";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch {
      setError("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-amber-500 text-slate-950 font-black text-2xl px-3 py-1 rounded-xl">
              A
            </div>
            <span className="font-extrabold text-2xl text-slate-900">
              Aladdin<span className="text-amber-500">.</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 pt-2">
            পাসওয়ার্ড ভুলে গেছেন?
          </h2>
          <p className="text-xs text-slate-500">
            ইমেইল দিন, রিসেট লিঙ্ক পাঠিয়ে দেব
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-3 py-4">
            <div className="text-sm text-slate-700">
              <strong>{email}</strong>-এ একটা রিসেট লিঙ্ক পাঠানো হয়েছে। ইনবক্স চেক করুন।
            </div>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sign In-এ ফিরে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {submitting ? "পাঠানো হচ্ছে..." : "রিসেট লিঙ্ক পাঠান"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sign In-এ ফিরে যান
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
