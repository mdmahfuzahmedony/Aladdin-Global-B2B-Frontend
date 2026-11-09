
"use client";

import { useState } from "react";
import {
  KeyRound,
  Mail,
  X,
  RotateCw,
  CheckCircle2,
} from "lucide-react";

interface OtpModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  email?: string;
  phone?: string;
  submitting?: boolean;
  onVerify: (otpCode: string) => void | Promise<void>;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://aladdin-global-b2-b-backend-3c9f.vercel.app";

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

  const isSubmitting = submitting || externalSubmitting || false;

  if (!visible) return null;

  // Resend OTP
  async function handleResend() {
    if (!email) {
      setError("ইমেইল ঠিকানা পাওয়া যায়নি");
      return;
    }

    setSending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "কোড পাঠাতে সমস্যা হয়েছে"
        );
      }

      setMessage("নতুন কোড পাঠানো হয়েছে, ইনবক্স চেক করুন");
      setOtpCode("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "সার্ভারে সমস্যা হয়েছে"
      );
    } finally {
      setSending(false);
    }
  }

  // Verify OTP
  async function handleSubmit() {
    if (!email) {
      setError("ইমেইল ঠিকানা পাওয়া যায়নি");
      return;
    }

    if (otpCode.length !== 4) {
      setError("৪ ডিজিটের OTP কোড লিখুন");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          enteredOtp: otpCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "কোডটি সঠিক নয় অথবা মেয়াদ শেষ হয়ে গেছে"
        );
      }

      // OTP সঠিক হলে Parent component-এ পাঠানো হবে
      await onVerify(otpCode);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ভেরিফিকেশন ব্যর্থ হয়েছে"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
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

        {/* OTP Input */}
        <div className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            placeholder="• • • •"
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            className="w-full text-center text-xl font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 outline-none focus:border-amber-500"
          />

          {/* Resend OTP */}
          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-slate-400">
              কোড পাননি?
            </span>

            <button
              type="button"
              onClick={handleResend}
              disabled={sending || isSubmitting}
              className="text-amber-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <RotateCw
                className={`w-3 h-3 ${
                  sending ? "animate-spin" : ""
                }`}
              />

              {sending ? "পাঠানো হচ্ছে..." : "আবার পাঠান"}
            </button>
          </div>

          {/* Success Message */}
          {message && (
            <p className="text-[11px] text-emerald-600 text-center font-medium flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {message}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-[11px] text-rose-500 text-center font-medium">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || sending || otpCode.length !== 4}
              className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify & Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
