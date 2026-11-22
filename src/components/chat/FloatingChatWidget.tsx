"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  Store,
  ShieldAlert,
  ChevronLeft,
  ExternalLink,
  Package,
  Inbox,
  CheckCheck,
  Sparkles,
  AlertTriangle,
  Tag,
  Info,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import {
  ChatConversation,
  ChatMessage,
  getStoredConversations,
  fetchLiveConversations,
  sendChatMessage,
  markConversationAsReadForCustomer,
  formatChatTime,
  formatConversationTime,
  getGuestCustomerId,
  getGuestCustomerName,
  getCustomerUnreadCount,
} from "@/lib/chat-store";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"VENDOR" | "ADMIN">("VENDOR");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [session, setSession] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Check auth session
  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
        }
      } catch (err) {
        console.warn("Floating chat auth check:", err);
      }
    }

    void checkAuth();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load conversations & sync unread count
  useEffect(() => {
    const load = async () => {
      const cached = getStoredConversations();
      setConversations(cached);

      const userName =
        session?.user?.user_metadata?.fullName ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split("@")[0] ||
        getGuestCustomerName();
      const customerId = session?.user?.id || getGuestCustomerId();

      setUnreadCount(getCustomerUnreadCount(customerId, userName));

      try {
        const live = await fetchLiveConversations({
          role: "CUSTOMER",
          userId: customerId,
          customerName: userName,
        });

        if (live && live.length > 0) {
          setConversations(live);
          setUnreadCount(getCustomerUnreadCount(customerId, userName));
        }
      } catch (e) {
        console.warn("Live chat fetch:", e);
      }
    };

    void load();

    const handleUpdate = () => {
      void load();
    };

    window.addEventListener("aladdin_chat_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Guaranteed polling interval every 3 seconds for instant notifications
    const pollInterval = setInterval(() => {
      void load();
    }, 3000);

    // Supabase Realtime channel
    const supabase = createClient();
    const channel = supabase
      .channel("floating_chat_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages" },
        () => {
          void load();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        () => {
          void load();
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("aladdin_chat_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      void supabase.removeChannel(channel);
    };
  }, [session]);

  // Scroll to bottom when viewing messages
  useEffect(() => {
    if (selectedConvId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConvId, conversations]);

  // Active selected conversation
  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  // Filter conversations by Tab (Vendor vs Admin)
  const vendorConvs = conversations.filter(
    (c) => c.type === "CUSTOMER_VENDOR"
  );
  const adminConvs = conversations.filter(
    (c) => c.type === "CUSTOMER_ADMIN_COMPLAINT" || c.type === "VENDOR_ADMIN"
  );
  const displayedConversations =
    activeTab === "VENDOR" ? vendorConvs : adminConvs;

  const handleOpenConversation = (convId: string) => {
    setSelectedConvId(convId);
    markConversationAsReadForCustomer(convId);
    setSecurityWarning(null);

    const userName =
      session?.user?.user_metadata?.fullName ||
      session?.user?.user_metadata?.name ||
      session?.user?.email?.split("@")[0] ||
      getGuestCustomerName();
    const customerId = session?.user?.id || getGuestCustomerId();
    setUnreadCount(getCustomerUnreadCount(customerId, userName));
  };

  const handleBackToList = () => {
    setSelectedConvId(null);
    setSecurityWarning(null);
  };

  const handleQuickChip = (chipText: string) => {
    setInputText(chipText);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedConv) return;

    setSecurityWarning(null);

    const userName =
      session?.user?.user_metadata?.fullName ||
      session?.user?.user_metadata?.name ||
      session?.user?.email?.split("@")[0] ||
      selectedConv.customerName ||
      getGuestCustomerName();

    const customerId =
      session?.user?.id || selectedConv.customerId || getGuestCustomerId();

    const { securityResult } = sendChatMessage({
      conversationId: selectedConv.id,
      senderRole: "CUSTOMER",
      senderName: userName,
      senderId: customerId,
      text,
      productContext: selectedConv.product,
      isComplaint: selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT",
    });

    if (securityResult.hasSensitiveData && securityResult.warningMessage) {
      setSecurityWarning(securityResult.warningMessage);
    }

    setInputText("");
  };

  return (
    <aside aria-label="লাইভ চ্যাট উইজেট" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end pointer-events-none">
      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[360px] sm:w-[410px] h-[550px] max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* HEADER */}
          <div className="bg-[#12233f] text-white p-3 sm:p-3.5 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {selectedConv ? (
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="rounded-lg p-1 text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
                  title="সব মেসেজে ফিরুন"
                >
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-[#12233f] font-bold shrink-0">
                  <MessageSquare size={16} />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {selectedConv
                    ? selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT"
                      ? "Aladdin সাপোর্ট ডেস্ক"
                      : selectedConv.vendorName || "ভেন্ডর স্টোর"
                    : "মেসেজ ও লাইভ চ্যাট"}
                </h3>
                <p className="text-[10px] text-slate-300 truncate">
                  {selectedConv
                    ? selectedConv.product?.name
                      ? `পণ্য: ${selectedConv.product.name}`
                      : "সরাসরি সহায়তা"
                    : "ভেন্ডর ও সাপোর্ট সেন্টারের সাথে সরাসরি বার্তা"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition"
                title="বন্ধ করুন"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* TOP TABS: VENDOR & ADMIN (Visible on list view) */}
          {!selectedConv && (
            <div className="bg-slate-100/90 p-1.5 flex gap-1.5 border-b border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("VENDOR")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "VENDOR"
                    ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Store
                  size={14}
                  className={
                    activeTab === "VENDOR" ? "text-emerald-600" : "text-slate-400"
                  }
                />
                <span>ভেন্ডর চ্যাট ({vendorConvs.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ADMIN")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "ADMIN"
                    ? "bg-white text-red-800 shadow-2xs border border-red-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldAlert
                  size={14}
                  className={
                    activeTab === "ADMIN" ? "text-red-600" : "text-slate-400"
                  }
                />
                <span>অ্যাডমিন সাপোর্ট ({adminConvs.length})</span>
              </button>
            </div>
          )}

          {/* BODY */}
          {selectedConv ? (
            /* CONVERSATION THREAD VIEW WITH IN-PLACE MESSAGING */
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
              {/* Product Info Banner */}
              {selectedConv.product && (
                <div className="border-b border-slate-200/90 bg-amber-50/60 px-3.5 py-2 flex items-center justify-between gap-2.5 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {selectedConv.product.image ? (
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-amber-200/70 bg-white shadow-2xs">
                        <Image
                          src={selectedConv.product.image}
                          alt={selectedConv.product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        <Package size={16} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">
                          <Tag size={10} />
                          পণ্য
                        </span>
                        {selectedConv.product.sku && (
                          <span className="text-[9px] font-mono text-slate-500">
                            [{selectedConv.product.sku}]
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs font-bold text-slate-800 mt-0.5">
                        {selectedConv.product.name}
                      </p>
                      <p className="text-[10px] text-amber-700 font-extrabold">
                        ৳{selectedConv.product.price}
                      </p>
                    </div>
                  </div>

                  {selectedConv.product.id && (
                    <Link
                      href={`/products/${selectedConv.product.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-2 py-1 text-[10px] font-bold text-amber-900 shadow-2xs hover:bg-amber-100/50 transition shrink-0"
                    >
                      <span>পণ্যটি দেখুন</span>
                      <ExternalLink size={11} />
                    </Link>
                  )}
                </div>
              )}

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0">
                {selectedConv.messages.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    কোনো মেসেজ নেই
                  </div>
                ) : (
                  selectedConv.messages.map((m) => {
                    const isCustomer = m.senderRole === "CUSTOMER";
                    const isAdmin = m.senderRole === "ADMIN";

                    if (isAdmin) {
                      return (
                        <div
                          key={m.id}
                          className="rounded-xl border border-red-200 bg-red-50/90 p-2.5 text-xs text-red-900 shadow-2xs"
                        >
                          <p className="font-bold flex items-center gap-1.5 text-red-700 text-[11px]">
                            <ShieldAlert size={14} />
                            {m.senderName}:
                          </p>
                          <p className="mt-1 leading-relaxed text-[11px]">
                            {m.text}
                          </p>
                          <span className="mt-1 block text-[9px] text-red-500">
                            {formatChatTime(m.timeFormatted || m.createdAt)}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          isCustomer ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs leading-relaxed ${
                            isCustomer
                              ? "bg-[#12233f] text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                          }`}
                        >
                          {!isCustomer && (
                            <div className="flex items-center gap-1.5 mb-1 font-bold text-[10px] text-emerald-700">
                              <Store size={12} className="text-emerald-600" />
                              <span>
                                {m.senderName || selectedConv.vendorName || "ভেন্ডর"}
                              </span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap text-[11px] leading-relaxed">
                            {m.text}
                          </p>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400 px-1">
                          <span>
                            {formatChatTime(m.timeFormatted || m.createdAt)}
                          </span>
                          {isCustomer && (
                            <CheckCheck size={11} className="text-sky-500" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Inquiry Chips (for Vendor chat) */}
              {selectedConv.type === "CUSTOMER_VENDOR" && (
                <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200/70 bg-white px-2.5 py-1.5 text-[10px] shrink-0 no-scrollbar">
                  {[
                    "বর্তমানে কত পিস স্টক আছে?",
                    "৫০ পিস নিলে কোনো ছাড় আছে?",
                    "ডেলিভারি কবে পাব?",
                    "আসল স্যাম্পল ছবি দেখতে চাই",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickChip(chip)}
                      className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Security Warning */}
              {securityWarning && (
                <div className="border-t border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                    <span className="truncate">{securityWarning}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecurityWarning(null)}
                    className="text-amber-800 hover:text-amber-950 font-bold ml-2 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Chat Reply Input Form */}
              <form
                onSubmit={handleSend}
                className="border-t border-slate-200 bg-white p-2.5 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="মেসেজ লিখুন..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#12233f] focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12233f] text-white shadow-xs transition hover:bg-[#1b3155] disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          ) : (
            /* CONVERSATION LIST FOR SELECTED TAB */
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-slate-50/40 flex flex-col">
              {/* Product Guide Info Strip when conversations exist */}
              {displayedConversations.length > 0 && activeTab === "VENDOR" && (
                <div className="bg-amber-50/80 border-b border-amber-200/70 px-3.5 py-2 flex items-start gap-2 text-[11px] text-amber-900 shrink-0">
                  <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="min-w-0 flex-1 leading-snug">
                    নতুন কোনো পণ্য নিয়ে কথা বলতে চান? প্রথমে সেই{" "}
                    <span className="font-bold underline text-amber-950">
                      পণ্যের পেজে গিয়ে "চ্যাট করুন"
                    </span>{" "}
                    বাটনে চাপুন।
                  </p>
                </div>
              )}

              {displayedConversations.length === 0 ? (
                /* EMPTY STATE WITH DETAILED 3-STEP GUIDE */
                <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-2.5 shadow-2xs ${
                      activeTab === "VENDOR"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/70"
                        : "bg-red-50 text-red-600 border border-red-200/70"
                    }`}
                  >
                    {activeTab === "VENDOR" ? (
                      <Store size={26} />
                    ) : (
                      <ShieldAlert size={26} />
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-800">
                    {activeTab === "VENDOR"
                      ? "ভেন্ডরের সাথে কোনো কথোপকথন নেই"
                      : "অ্যাডমিন সাপোর্টের কোনো মেসেজ নেই"}
                  </h4>

                  <p className="mt-1 max-w-[260px] text-[11px] text-slate-500 leading-relaxed">
                    {activeTab === "VENDOR"
                      ? "নির্দিষ্ট কোনো পণ্য বা পাইকারি অর্ডার নিয়ে এখনো বিক্রেতার সাথে চ্যাট শুরু করেননি।"
                      : "প্ল্যাটফর্ম সাপোর্ট বা কোনো কমপ্লেইনের হিস্ট্রি পাওয়া যায়নি।"}
                  </p>

                  {/* 3-Step Instruction Box */}
                  <div className="mt-3 w-full max-w-[310px] rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-left shadow-2xs">
                    <p className="font-bold text-amber-950 text-xs flex items-center gap-1.5 mb-2">
                      <Sparkles size={14} className="text-amber-600 shrink-0" />
                      <span>কীভাবে নতুন পণ্যের চ্যাট শুরু করবেন?</span>
                    </p>

                    <ul className="space-y-1.5 text-[11px] text-amber-900 leading-snug">
                      <li className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900 mt-0.5">
                          ১
                        </span>
                        <span>যে পণ্য নিয়ে কথা বলতে চান, প্রথমে সেই <b>পণ্যের পেজে</b> যান।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900 mt-0.5">
                          ২
                        </span>
                        <span>পণ্যের তথ্যের পাশে থাকা <b>"চ্যাট করুন"</b> বাটনটিতে চাপুন।</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900 mt-0.5">
                          ৩
                        </span>
                        <span>ভেন্ডরের কাছে সরাসরি আপনার বার্তা পৌঁছাবে এবং এই উইজেটে হিস্ট্রি থাকবে!</span>
                      </li>
                    </ul>

                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#12233f] py-2 px-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#1b3155]"
                    >
                      <span>পণ্য ব্রাউজ করুন</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* CONVERSATION ITEMS LIST */
                displayedConversations.map((c) => {
                  const hasUnread = (c.unreadForCustomer || 0) > 0;
                  const isComplaint = c.type === "CUSTOMER_ADMIN_COMPLAINT";

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleOpenConversation(c.id)}
                      className="w-full text-left p-3 transition flex gap-3 items-start hover:bg-slate-100/80 bg-white"
                    >
                      {/* Product Thumbnail or Avatar */}
                      <div className="relative shrink-0">
                        {c.product?.image ? (
                          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                            <Image
                              src={c.product.image}
                              alt={c.product.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold shadow-2xs ${
                              isComplaint
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {isComplaint ? (
                              <ShieldAlert size={18} />
                            ) : (
                              <Store size={18} />
                            )}
                          </div>
                        )}
                        {/* Type mini-badge */}
                        <div
                          className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] shadow-xs text-white ${
                            isComplaint ? "bg-red-600" : "bg-emerald-600"
                          }`}
                          title={isComplaint ? "অ্যাডমিন সাপোর্ট" : "ভেন্ডর চ্যাট"}
                        >
                          {isComplaint ? "A" : "V"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {/* Vendor Name & Time */}
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                            {isComplaint ? (
                              <span className="text-red-700">Aladdin সাপোর্ট ডেস্ক</span>
                            ) : (
                              <span className="text-slate-800">
                                {c.vendorName || "ভেন্ডর স্টোর"}
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatConversationTime(c.lastMessageTime)}
                          </span>
                        </div>

                        {/* Product Title Highlight Badge */}
                        {c.product && (
                          <div className="my-1 flex items-center gap-1.5 rounded-md bg-amber-50/80 border border-amber-200/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 truncate">
                            <Package size={11} className="shrink-0 text-amber-600" />
                            <span className="truncate">{c.product.name}</span>
                            <span className="ml-auto font-bold text-amber-700 shrink-0">
                              ৳{c.product.price}
                            </span>
                          </div>
                        )}

                        {/* Last Message Preview */}
                        <p className="truncate text-[11px] text-slate-500 mt-0.5">
                          {c.lastMessageText || "কোনো বার্তা নেই"}
                        </p>
                      </div>

                      {/* Unread indicator dot */}
                      {hasUnread && (
                        <span className="h-2.5 w-2.5 rounded-full bg-red-600 shrink-0 animate-pulse mt-1" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* FOOTER BAR */}
          <div className="border-t border-slate-200 bg-white px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Aladdin লাইভ চ্যাট সাপোর্ট
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              তাৎক্ষণিক সহায়তা
            </span>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-[#12233f] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#1b3155] focus:outline-none focus:ring-4 focus:ring-amber-400/40"
        title="মেসেজ ও লাইভ চ্যাট"
        aria-label="মেসেজ ও লাইভ চ্যাট উইন্ডো খুলুন"
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-200 rotate-90" />
        ) : (
          <>
            <MessageSquare size={26} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-md animate-bounce">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </aside>
  );
}
