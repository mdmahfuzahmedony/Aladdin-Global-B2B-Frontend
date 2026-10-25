"use client";

import { useState } from "react";
import { KeyRound, Mail, X, RotateCw, CheckCircle2 } from "lucide-react";

interface OtpModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  email?: string;
  phone?: string;
  submitting?: boolean;
  onVerify: (otpCode: string) => void | Promise<void>;
}

export function OtpModal({
  isOpen,
  open,
  onClose,
  email = "",
  phone,
  submitting: externalSubmitting,
  onVerify,
}: OtpModalProps) {
  const [otpCode, setOtpCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const visible = isOpen ?? open ?? false;
  if (!visible) return null;

  /** কোড আবার পাঠানো (Resend OTP API কল করা) */
  async function handleResend() {
    setSending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "কোড পাঠাতে সমস্যা হয়েছে");
      }

      setMessage("নতুন কোড পাঠানো হয়েছে, ইনবক্স চেক করুন");
    } catch (err: any) {
      setError(err.message || "সার্ভারে সমস্যা হয়েছে");
    } finally {
      setSending(false);
    }
  }

  /** ইউজারের দেওয়া কোড আমাদের ব্যাকএন্ডে verify করা */
  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, enteredOtp: otpCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "কোডটি সঠিক না অথবা মেয়াদ শেষ হয়ে গেছে",
        );
      }

      // ওটিপি সঠিক হলে প্যারেন্ট ফাংশনে ওটিপি কোডটি পাস করুন
      await onVerify(otpCode);
    } catch (err: any) {
      setError(err.message || "ভেরিফিকেশন ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">
            ইমেইল ভেরিফাই করুন
          </h3>
          <p className="text-xs text-slate-500">
            নিচের ঠিকানায় ৪ ডিজিটের কোড পাঠানো হয়েছে:
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            {email}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="• • • •"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-xl font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 outline-none focus:border-amber-500"
          />

          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-slate-400">কোড পাননি?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={sending}
              className="text-amber-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <RotateCw
                className={`w-3 h-3 ${sending ? "animate-spin" : ""}`}
              />
              {sending ? "পাঠানো হচ্ছে..." : "আবার পাঠান"}
            </button>
          </div>

          {message && (
            <p className="text-[11px] text-emerald-600 text-center font-medium flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {message}
            </p>
          )}
          {error && (
            <p className="text-[11px] text-rose-500 text-center font-medium">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || otpCode.length !== 4}
              className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Verify & Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
