"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  Send,
  Store,
  User,
  ShieldAlert,
  Search,
  CheckCheck,
  AlertTriangle,
  Package,
  ExternalLink,
  Clock,
  Sparkles,
  Inbox,
  ArrowLeft,
} from "lucide-react";
import {
  getStoredConversations,
  fetchLiveConversations,
  sendChatMessage,
  markConversationAsReadForCustomer,
  ChatConversation,
  ChatMessage,
} from "@/lib/chat-store";
import { createClient } from "@/lib/supabase-client";
import { toast } from "react-toastify";

export default function CustomerMessagesPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "VENDOR" | "ADMIN">("ALL");
  const [inputText, setInputText] = useState("");
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth
  useEffect(() => {
    let mounted = true;
    async function checkUser() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }
    void checkUser();
    return () => {
      mounted = false;
    };
  }, []);

  // Load conversations
  useEffect(() => {
    const load = async () => {
      const cached = getStoredConversations();
      // Only keep customer-relevant conversations
      setConversations(cached);
      if (!selectedConvId && cached.length > 0) {
        setSelectedConvId(cached[0].id);
        markConversationAsReadForCustomer(cached[0].id);
      }
      setLoading(false);

      try {
        const live = await fetchLiveConversations({
          role: "CUSTOMER",
          userId: session?.user?.id,
        });
        if (live && live.length > 0) {
          setConversations(live);
          if (!selectedConvId) {
            setSelectedConvId(live[0].id);
            markConversationAsReadForCustomer(live[0].id);
          }
        }
      } catch (err) {
        console.warn("Live fetch conversations:", err);
      }
    };

    void load();

    const handleUpdate = () => {
      const data = getStoredConversations();
      setConversations(data);
    };

    window.addEventListener("aladdin_chat_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Realtime Supabase listener
    const supabase = createClient();
    const channel = supabase
      .channel("customer_messages_realtime")
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
      window.removeEventListener("aladdin_chat_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      void supabase.removeChannel(channel);
    };
  }, [session, selectedConvId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConvId, conversations]);

  const handleSelectConversation = (convId: string) => {
    setSelectedConvId(convId);
    markConversationAsReadForCustomer(convId);
  };

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === "VENDOR" && c.type !== "CUSTOMER_VENDOR") return false;
    if (activeTab === "ADMIN" && c.type !== "CUSTOMER_ADMIN_COMPLAINT") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.vendorName.toLowerCase().includes(q) ||
        c.lastMessageText.toLowerCase().includes(q) ||
        (c.product?.name && c.product.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) ||
    filteredConversations[0] ||
    conversations[0];

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
      "ক্রেতা";

    const { securityResult } = sendChatMessage({
      conversationId: selectedConv.id,
      senderRole: "CUSTOMER",
      senderName: userName,
      senderId: session?.user?.id,
      text,
      productContext: selectedConv.product,
      isComplaint: selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT",
    });

    if (securityResult.hasSensitiveData && securityResult.warningMessage) {
      setSecurityWarning(securityResult.warningMessage);
      toast.warning("ব্যক্তিগত ফোন নম্বর ফিল্টার করা হয়েছে!");
    }

    setInputText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb / Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-amber-600">হোম</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">মেসেজ ও ইনকোয়ারি ইনবক্স</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#12233f]">
              মেসেজ ইনবক্স (Customer Inquiries & Messages)
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              ভেন্ডরদের সাথে সরাসরি পণ্য সম্পর্কিত প্রশ্নোত্তর, পাইকারি দরদাম এবং সাপোর্ট ডেস্ক।
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <ArrowLeft size={14} />
            মার্কেটপ্লেসে ফিরুন
          </Link>
        </div>

        {/* Main Messenger Box */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[750px]">
            {/* LEFT COLUMN: CONVERSATION LIST (4 cols) */}
            <div className="border-r border-slate-200 md:col-span-4 flex flex-col bg-slate-50/50">
              {/* Search & Tabs */}
              <div className="border-b border-slate-200 bg-white p-3 space-y-2.5">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ভেন্ডর বা পণ্যের নাম দিয়ে খুঁজুন..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 transition focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1 text-[11px] font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setActiveTab("ALL")}
                    className={`flex-1 rounded-md py-1 transition ${
                      activeTab === "ALL"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "hover:text-slate-900"
                    }`}
                  >
                    সব ({conversations.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("VENDOR")}
                    className={`flex-1 rounded-md py-1 transition ${
                      activeTab === "VENDOR"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "hover:text-slate-900"
                    }`}
                  >
                    ভেন্ডর চ্যাট
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("ADMIN")}
                    className={`flex-1 rounded-md py-1 transition ${
                      activeTab === "ADMIN"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "hover:text-slate-900"
                    }`}
                  >
                    সাপোর্ট ডেস্ক
                  </button>
                </div>
              </div>

              {/* Conversations Scrollable List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Inbox size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-medium">কোনো মেসেজ পাওয়া যায়নি</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      পণ্য পেজের "চ্যাট করুন" বাটন চেপে ভেন্ডরকে প্রশ্ন করতে পারেন।
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((c) => {
                    const isSelected = selectedConv?.id === c.id;
                    const hasUnread = (c.unreadForCustomer || 0) > 0;
                    const isComplaint = c.type === "CUSTOMER_ADMIN_COMPLAINT";

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectConversation(c.id)}
                        className={`w-full text-left p-3.5 transition flex gap-3 items-start ${
                          isSelected
                            ? "bg-amber-50/60 border-l-4 border-amber-500"
                            : "hover:bg-slate-100/70"
                        }`}
                      >
                        {/* Avatar / Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold shadow-2xs ${
                            isComplaint
                              ? "bg-red-50 text-red-600 border border-red-200/80"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          }`}
                        >
                          {isComplaint ? (
                            <ShieldAlert size={18} />
                          ) : (
                            <Store size={18} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {isComplaint
                                ? "Aladdin সাপোর্ট ডেস্ক"
                                : c.vendorName || "ভেন্ডর স্টোর"}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {c.lastMessageTime}
                            </span>
                          </div>

                          {/* Product snippet */}
                          {c.product && (
                            <p className="mt-0.5 text-[11px] font-medium text-amber-700 truncate">
                              📦 {c.product.name}
                            </p>
                          )}

                          {/* Last message text */}
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                            {c.lastMessageText || "বার্তা দেখতে ক্লিক করুন"}
                          </p>
                        </div>

                        {/* Unread badge */}
                        {hasUnread && (
                          <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE CHAT THREAD (8 cols) */}
            <div className="md:col-span-8 flex flex-col bg-white">
              {selectedConv ? (
                <>
                  {/* Chat Header with Product Banner */}
                  <div className="border-b border-slate-200 bg-slate-50/70 p-3.5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12233f] text-white shadow-2xs">
                          {selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT" ? (
                            <ShieldAlert size={18} />
                          ) : (
                            <Store size={18} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">
                              {selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT"
                                ? "Aladdin B2B অফিসিয়াল সাপোর্ট ও কমপ্লেইন"
                                : selectedConv.vendorName || "ভেন্ডর সাপোর্ট"}
                            </h3>
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT"
                              ? "অ্যাডমিন তদন্ত ও মধ্যস্থতা চ্যানেল"
                              : "ভেন্ডরের সাথে সরাসরি পাইকারি ইনকোয়ারি"}
                          </p>
                        </div>
                      </div>

                      {/* Product Preview Quick Button */}
                      {selectedConv.product && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2 shadow-2xs max-w-xs">
                          {selectedConv.product.image ? (
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-slate-100">
                              <Image
                                src={selectedConv.product.image}
                                alt={selectedConv.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                              <Package size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold text-slate-800">
                              {selectedConv.product.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              ৳{selectedConv.product.price}
                            </p>
                          </div>
                          {selectedConv.product.id && (
                            <Link
                              href={`/products/${selectedConv.product.id}`}
                              target="_blank"
                              className="text-slate-400 hover:text-amber-600 shrink-0"
                              title="পণ্যটি নতুন ট্যাবে দেখুন"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30">
                    {/* Welcome greeting */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-center text-xs text-blue-800">
                      🔒 আপনার কথোপকথন প্ল্যাটফর্মের সুরক্ষা নীতি দ্বারা সুরক্ষিত। যেকোনো তথ্য বা ফিরতি বার্তা এখানে প্রদর্শিত হবে।
                    </div>

                    {selectedConv.messages.map((m) => {
                      const isCustomer = m.senderRole === "CUSTOMER";
                      const isAdmin = m.senderRole === "ADMIN";

                      if (isAdmin) {
                        return (
                          <div
                            key={m.id}
                            className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-900 shadow-2xs"
                          >
                            <p className="font-bold flex items-center gap-1.5 text-red-700">
                              <ShieldAlert size={15} />
                              {m.senderName}:
                            </p>
                            <p className="mt-1">{m.text}</p>
                            <span className="mt-1 block text-[10px] text-red-500">
                              {m.timeFormatted}
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
                            className={`flex items-start gap-2 max-w-[85%] sm:max-w-[70%] ${
                              isCustomer ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {/* Avatar */}
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                isCustomer
                                  ? "bg-[#12233f] text-white"
                                  : "bg-emerald-600 text-white"
                              }`}
                            >
                              {isCustomer ? <User size={14} /> : <Store size={14} />}
                            </div>

                            {/* Bubble */}
                            <div
                              className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs ${
                                isCustomer
                                  ? "bg-[#12233f] text-white rounded-tr-xs"
                                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <span
                                  className={`text-[10px] font-bold ${
                                    isCustomer ? "text-amber-300" : "text-emerald-700"
                                  }`}
                                >
                                  {m.senderName}
                                </span>
                                <span
                                  className={`text-[9px] ${
                                    isCustomer ? "text-slate-300" : "text-slate-400"
                                  }`}
                                >
                                  {m.timeFormatted}
                                </span>
                              </div>
                              <p className="leading-relaxed whitespace-pre-wrap">
                                {m.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Security Alert if any */}
                  {securityWarning && (
                    <div className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900">
                      <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                      <span>{securityWarning}</span>
                    </div>
                  )}

                  {/* Reply Input Bar */}
                  <form
                    onSubmit={handleSend}
                    className="border-t border-slate-200 bg-white p-3 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`"${selectedConv.vendorName}"-কে আপনার ফিরতি মেসেজ লিখুন...`}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-amber-400 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-2xs transition hover:bg-amber-600 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <span>পাঠান</span>
                      <Send size={13} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <MessageSquare size={48} className="mb-3 opacity-40" />
                  <h3 className="text-sm font-bold text-slate-700">
                    কোনো কথোপকথন নির্বাচিত নেই
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    বাম পাশের তালিকা থেকে যেকোনো একটি কথোপকথন নির্বাচন করুন ভেন্ডরের বার্তা দেখতে ও উত্তর দিতে।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
