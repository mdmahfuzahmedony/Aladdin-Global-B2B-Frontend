"use client";

import { useState } from "react";
import { KeyRound, Mail, Phone, X, RotateCw, CheckCircle2 } from "lucide-react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  phone?: string;
  onVerify: (code: string, selectedChannel: "email" | "phone") => void;
}

export function OtpModal({
  isOpen,
  onClose,
  email,
  phone,
  onVerify,
}: OtpModalProps) {
  // ইউজার কোনটা সিলেক্ট করল (ডিফল্ট: ইমেইল থাকলে ইমেইল, না হয় ফোন)
  const [selectedChannel, setSelectedChannel] = useState<"email" | "phone">(
    email ? "email" : "phone"
  );
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  // ১. কোড পাঠানোর ফাংশন
  function handleSendOtp() {
    setSending(true);
    setMessage("");

    // এখানে আপনার ব্যাকএন্ড এপিআই কল হবে (Twilio / Greenweb / Resend)
    setTimeout(() => {
      setSending(false);
      setOtpSent(true);
      setMessage(
        `${selectedChannel === "email" ? "ইমেইলে" : "ফোনে"} ভেরিফিকেশন কোড পাঠানো হয়েছে!`
      );
    }, 1000);
  }

  // ২. সাবমিট ফাংশন
  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      onVerify(otpCode, selectedChannel);
      setSubmitting(false);
    }, 1000);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
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
            OTP ভেরিফিকেশন
          </h3>
          <p className="text-xs text-slate-500">
            কোথায় ভেরিফিকেশন কোড পেতে চান সিলেক্ট করুন:
          </p>
        </div>

        {/* মাধ্যম সিলেক্ট করার অপশন */}
        <div className="space-y-2">
          {email && (
            <label
              onClick={() => setSelectedChannel("email")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedChannel === "email"
                  ? "border-amber-500 bg-amber-50/50 text-slate-900"
                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>{email}</span>
              </div>
              <input
                type="radio"
                name="otpChannel"
                checked={selectedChannel === "email"}
                onChange={() => setSelectedChannel("email")}
                className="accent-amber-500"
              />
            </label>
          )}

          {phone && (
            <label
              onClick={() => setSelectedChannel("phone")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedChannel === "phone"
                  ? "border-amber-500 bg-amber-50/50 text-slate-900"
                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>{phone}</span>
              </div>
              <input
                type="radio"
                name="otpChannel"
                checked={selectedChannel === "phone"}
                onChange={() => setSelectedChannel("phone")}
                className="accent-amber-500"
              />
            </label>
          )}
        </div>

        {/* কোড পাঠানোর বাটন (যদি কোড না পাঠানো হয়ে থাকে) */}
        {!otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sending}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {sending ? "কোড পাঠানো হচ্ছে..." : "কোড পাঠান"}
          </button>
        ) : (
          /* কোড ইনপুট করার ঘর (কোড পাঠানোর পর দেখাবে) */
          <div className="space-y-3">
            <input
              type="text"
              maxLength={6}
              placeholder="• • • • • •"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full text-center text-xl font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />

            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="text-slate-400">কোড পাননি?</span>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sending}
                className="text-amber-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RotateCw
                  className={`w-3 h-3 ${sending ? "animate-spin" : ""}`}
                />
                {sending ? "পাঠানো হচ্ছে..." : "পুনরায় পাঠান"}
              </button>
            </div>

            {message && (
              <p className="text-[11px] text-emerald-600 text-center font-medium flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {message}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || otpCode.length < 4}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "যাচাই হচ্ছে..." : "যাচাই ও জমা"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}