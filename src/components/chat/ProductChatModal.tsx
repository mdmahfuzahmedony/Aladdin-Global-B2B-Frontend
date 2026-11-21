"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Send,
  MessageSquare,
  ShieldAlert,
  Store,
  Lock,
  ArrowRight,
  CheckCheck,
  Sparkles,
  Paperclip,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import {
  sendChatMessage,
  getStoredConversations,
  ChatConversation,
} from "@/lib/chat-store";

export type ChatProductContext = {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  image?: string;
  vendorName?: string;
  vendorId?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product: ChatProductContext;
  initialMode?: "VENDOR" | "ADMIN";
};

type MessageItem = {
  id: string;
  sender: "USER" | "OTHER";
  text: string;
  time: string;
  isComplaint?: boolean;
};

export default function ProductChatModal({
  isOpen,
  onClose,
  product,
  initialMode = "VENDOR",
}: Props) {
  const [mode, setMode] = useState<"VENDOR" | "ADMIN">(initialMode);
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  // Sync mode if initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Check auth status
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(session);
        }
      } catch (err) {
        console.error("Auth check failed in ChatModal:", err);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    if (isOpen) {
      void checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Load starter greeting based on mode
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "VENDOR") {
      setMessages([
        {
          id: "m_welcome_vendor",
          sender: "OTHER",
          text: `হ্যালো! "${product.name}" সম্পর্কে আপনার কী জানার আছে? পাইকারি অর্ডার বা স্পেসিফিকেশন নিয়ে প্রশ্ন করতে পারেন।`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } else {
      setMessages([
        {
          id: "m_welcome_admin",
          sender: "OTHER",
          text: `আসসালামু আলাইকুম। Aladdin B2B সাপোর্ট ও কমপ্লেইন ডেস্ক। প্রোডাক্ট কোড [${product.sku || product.id}] ও ভেন্ডর "${product.vendorName || "বিক্রেতা"}" সম্পর্কিত আপনার অভিযোগ বা সমস্যাটি বিস্তারিত লিখুন।`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isComplaint: true,
        },
      ]);
    }
  }, [isOpen, mode, product]);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || isSending) return;

    setSecurityWarning(null);

    const userName =
      session?.user?.user_metadata?.fullName ||
      session?.user?.user_metadata?.name ||
      session?.user?.email?.split("@")[0] ||
      "ক্রেতা";

    // Perform security inspection & persistence into shared store
    const { conversation, securityResult } = sendChatMessage({
      senderRole: "CUSTOMER",
      senderName: userName,
      text,
      productContext: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.image,
        vendorName: product.vendorName,
        vendorId: product.vendorId,
      },
      isComplaint: mode === "ADMIN",
    });

    if (securityResult.hasSensitiveData && securityResult.warningMessage) {
      setSecurityWarning(securityResult.warningMessage);
    }

    const newMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      sender: "USER",
      text: securityResult.filteredText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isComplaint: mode === "ADMIN",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsSending(false);
  };

  const handleQuickChip = (chipText: string) => {
    setInputMessage(chipText);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity p-0 sm:p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Chat Modal Box */}
      <div className="relative z-10 flex flex-col w-full max-w-lg h-[85vh] sm:h-[620px] max-h-[92vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#12233f] px-4 py-3 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-xs ${
                mode === "ADMIN"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
              }`}
            >
              {mode === "ADMIN" ? <ShieldAlert size={18} /> : <Store size={18} />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold truncate">
                  {mode === "ADMIN"
                    ? "Aladdin B2B সাপোর্ট ও কমপ্লেইন"
                    : product.vendorName || "ভেন্ডর সাপোর্ট"}
                </h3>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {mode === "ADMIN"
                  ? "এডমিনের কাছে সরাসরি অভিযোগ"
                  : "বিক্রেতার সাথে সরাসরি চ্যাট ও দরদাম"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mode Switcher Pill */}
            <button
              type="button"
              onClick={() => setMode(mode === "VENDOR" ? "ADMIN" : "VENDOR")}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition border ${
                mode === "VENDOR"
                  ? "bg-red-950/40 text-red-300 border-red-700/60 hover:bg-red-900/50"
                  : "bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-900/50"
              }`}
            >
              {mode === "VENDOR" ? "এডমিনে অভিযোগ?" : "ভেন্ডর চ্যাট"}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="চ্যাট বন্ধ করুন"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Auth Gate Check: If not logged in */}
        {!authLoading && !session ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-4 shadow-xs">
              <Lock size={28} />
            </div>

            <h4 className="text-base font-bold text-slate-800">
              মেসেজ পাঠাতে সাইন ইন প্রয়োজন
            </h4>

            <p className="mt-1.5 max-w-xs text-xs text-slate-500 leading-relaxed">
              বিক্রেতার সাথে সরাসরি কথা বলতে কিংবা অ্যাডমিনের কাছে অভিযোগ জানাতে অনুগ্রহ করে আপনার অ্যাকাউন্টে সাইন ইন করুন।
            </p>

            {/* Product Snapshot Info */}
            <div className="mt-4 flex items-center gap-3 w-full max-w-sm rounded-xl border border-slate-200 bg-white p-2.5 text-left shadow-2xs">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover border border-slate-100 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {product.name}
                </p>
                <p className="text-[11px] font-bold text-amber-700">
                  ৳{product.price.toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Link
                href="/sign-in"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1b3155]"
              >
                <span>সাইন ইন করুন</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/sign-up"
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-100"
              >
                নতুন অ্যাকাউন্ট
              </Link>
            </div>
          </div>
        ) : (
          /* Logged In View */
          <>
            {/* Pinned Product Reference Context Card */}
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-3.5 py-2">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-11 w-11 rounded-lg border border-slate-200 bg-white object-cover shrink-0"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-500">
                  পণ্য
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-semibold text-slate-800 truncate" title={product.name}>
                  {product.name}
                </h5>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-bold text-amber-700">
                    ৳{product.price.toLocaleString("en-BD")}
                  </span>
                  {product.sku && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-slate-600 bg-slate-200/70 px-1.5 py-0.2 rounded text-[10px]">
                        কোড: {product.sku}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {mode === "ADMIN" && (
                <span className="shrink-0 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                  অভিযোগ রেফারেন্স
                </span>
              )}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "USER" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      m.sender === "USER"
                        ? "bg-[#12233f] text-white rounded-br-xs"
                        : m.isComplaint
                        ? "bg-red-50 text-slate-800 border border-red-200 rounded-bl-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 px-1">
                    <span>{m.time}</span>
                    {m.sender === "USER" && <CheckCheck size={12} className="text-sky-500" />}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
                  <span>টাইপ করা হচ্ছে...</span>
                </div>
              )}
            </div>

            {/* Quick Inquiry Chips (for Vendor mode) */}
            {mode === "VENDOR" && (
              <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 bg-white px-3 py-2 text-[11px] shrink-0 no-scrollbar">
                {[
                  "বর্তমানে কত পিস স্টক আছে?",
                  "৫০ পিস নিলে কোনো ডিসকাউন্ট পাওয়া যাবে?",
                  "ডেলিভারি পেতে কত দিন সময় লাগবে?",
                  "পণ্যের আসল স্যাম্পল ছবি দেখতে চাই",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Security Warning Alert Banner */}
            {securityWarning && (
              <div className="flex items-start gap-2 border-t border-amber-200 bg-amber-50 px-3.5 py-2 text-[11px] font-semibold text-amber-900 animate-in fade-in">
                <span className="shrink-0 text-base leading-none">⚠️</span>
                <span className="flex-1">{securityWarning}</span>
                <button
                  type="button"
                  onClick={() => setSecurityWarning(null)}
                  className="text-amber-700 hover:text-amber-900 font-bold px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-slate-200 bg-white p-3 space-y-2 shrink-0"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    mode === "ADMIN"
                      ? "অভিযোগ বা সমস্যার বিবরণ লিখুন..."
                      : "আপনার বার্তা বা দরদাম লিখুন..."
                  }
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#12233f] focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#12233f] text-white shadow-xs transition hover:bg-[#1b3155] disabled:cursor-not-allowed disabled:opacity-40"
                  title="পাঠান"
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Security disclaimer */}
              <p className="flex items-center justify-center gap-1 text-[10px] text-slate-400 text-center">
                <Info size={11} className="shrink-0" />
                <span>
                  {mode === "ADMIN"
                    ? "আপনার অভিযোগটি প্রোডাক্ট কোড সহ সরাসরি প্ল্যাটফর্ম অ্যাডমিন পর্যালোচনায় যাবে।"
                    : "নিরাপদ কেনাকাটার স্বার্থে সাইটের বাইরে ব্যক্তিগত লেনদেন এড়িয়ে চলুন।"}
                </span>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
