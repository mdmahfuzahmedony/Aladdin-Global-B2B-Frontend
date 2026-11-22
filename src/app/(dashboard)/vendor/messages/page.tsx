"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  ShieldAlert,
  Send,
  User,
  Store,
  CheckCheck,
  Search,
  Sparkles,
  Tag,
  Info,
  AlertTriangle,
} from "lucide-react";
import {
  getStoredConversations,
  fetchLiveConversations,
  sendChatMessage,
  markConversationAsReadForVendor,
  formatChatTime,
  formatConversationTime,
  ChatConversation,
  ChatMessage,
} from "@/lib/chat-store";
import { createClient } from "@/lib/supabase-client";
import { toast } from "react-toastify";

export default function VendorMessagesPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ALL" | "CUSTOMER" | "ADMIN">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [vendorId, setVendorId] = useState("");

  useEffect(() => {
    async function loadVendorProfile() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
        const res = await fetch(`${API_URL}/api/vendors/store/settings`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const payload = await res.json();
          const d = payload?.data || payload;
          if (d?.storeName) setStoreName(d.storeName);
          if (d?.vendorId || d?.id) setVendorId(String(d.vendorId || d.id));
        }
      } catch {}
    }
    void loadVendorProfile();
  }, []);

  useEffect(() => {
    const load = async () => {
      const cached = getStoredConversations();
      setConversations(cached);
      setSelectedConvId((prev) => {
        if (prev && cached.some((c) => c.id === prev)) return prev;
        return cached.length > 0 ? cached[0].id : prev;
      });

      try {
        const live = await fetchLiveConversations({
          role: "VENDOR",
          vendorId: vendorId || undefined,
          storeName: storeName || undefined,
        });
        if (live && live.length > 0) {
          setConversations(live);
          setSelectedConvId((prev) => {
            if (prev && live.some((c) => c.id === prev)) return prev;
            return live[0].id;
          });
        }
      } catch (e) {
        console.warn("Live conversations fetch:", e);
      }
    };

    void load();

    const handleUpdate = () => {
      const data = getStoredConversations();
      setConversations(data);
    };

    window.addEventListener("aladdin_chat_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Guaranteed polling interval every 3 seconds for instant customer inquiries
    const pollInterval = setInterval(() => {
      void load();
    }, 3000);

    // Realtime Supabase Database listener
    const supabase = createClient();
    const channel = supabase
      .channel("vendor_realtime_chat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        () => {
          void load();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages" },
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
  }, []);

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === "CUSTOMER" && c.type !== "CUSTOMER_VENDOR") return false;
    if (activeTab === "ADMIN" && c.type !== "CUSTOMER_ADMIN_COMPLAINT" && c.type !== "VENDOR_ADMIN") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.customerName.toLowerCase().includes(q) ||
        c.vendorName.toLowerCase().includes(q) ||
        c.lastMessageText.toLowerCase().includes(q) ||
        c.product?.name.toLowerCase().includes(q) ||
        c.product?.sku?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) || filteredConversations[0] || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedConv) return;

    setSecurityWarning(null);

    const { securityResult } = sendChatMessage({
      conversationId: selectedConv.id,
      senderRole: "VENDOR",
      senderName: storeName || selectedConv.vendorName || "আমার স্টোর",
      senderId: vendorId || undefined,
      text,
    });

    if (securityResult.hasSensitiveData && securityResult.warningMessage) {
      setSecurityWarning(securityResult.warningMessage);
      toast.warning("ব্যক্তিগত ফোন নম্বর ফিল্টার করা হয়েছে!");
    } else {
      toast.success("বার্তা সফলভাবে পাঠানো হয়েছে!");
    }

    setInputText("");
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#12233f]">
            মেসেজ ইনবক্স ও অ্যাডমিন সাপোর্ট (Vendor Inbox)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            কাস্টমারদের পণ্যের ইনকোয়ারি ও পাইকারি দরদাম এবং প্ল্যাটফর্ম অ্যাডমিনের সাথে সরাসরি যোগাযোগ।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            লাইভ চ্যাট সক্রিয়
          </span>
        </div>
      </div>

      {/* Main Inbox Container */}
      <div className="flex flex-col lg:flex-row h-[680px] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Left Side: Conversation List */}
        <div className="w-full lg:w-80 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Tabs */}
          <div className="p-3 border-b border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("ALL")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  activeTab === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                সব বার্তা
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("CUSTOMER")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  activeTab === "CUSTOMER"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                কাস্টমার
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ADMIN")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  activeTab === "ADMIN"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                অ্যাডমিন
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="নাম বা বার্তা খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#12233f]"
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <MessageSquare size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-600">কোনো ইনকোয়ারি নেই</p>
                <p className="text-[11px] text-slate-400">
                  কাস্টমাররা আপনার প্রোডাক্ট পেজ থেকে মেসেজ পাঠালে এখানে দেখতে পাবেন।
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = selectedConv && selectedConv.id === c.id;
                const isAdmin = c.type === "CUSTOMER_ADMIN_COMPLAINT" || c.type === "VENDOR_ADMIN";

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedConvId(c.id);
                      markConversationAsReadForVendor(c.id);
                      setSecurityWarning(null);
                    }}
                    className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                      isSelected ? "bg-amber-50/80 border-l-4 border-amber-500" : "hover:bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-2xs ${
                        isAdmin
                          ? "bg-red-100 text-red-600 border border-red-200"
                          : "bg-blue-100 text-blue-600 border border-blue-200"
                      }`}
                    >
                      {isAdmin ? <ShieldAlert size={18} /> : <User size={18} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {isAdmin ? "Aladdin Admin Support" : c.customerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{formatConversationTime(c.lastMessageTime)}</span>
                      </div>

                      {c.product ? (
                        <div className="mt-1 flex items-center gap-1.5 overflow-hidden">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-800 truncate">
                            <Tag size={10} className="shrink-0 text-amber-600" />
                            <span className="truncate">{c.product.name}</span>
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {c.vendorName}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-700 truncate mt-1 font-medium">
                        {c.lastMessageText}
                      </p>
                    </div>

                    {c.unreadForVendor ? (
                      <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                        {c.unreadForVendor}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Chat Window Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50/80">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base shadow-xs ${
                    selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT" || selectedConv.type === "VENDOR_ADMIN"
                      ? "bg-red-100 text-red-600 border border-red-200"
                      : "bg-blue-100 text-blue-600 border border-blue-200"
                  }`}
                >
                  {selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT" || selectedConv.type === "VENDOR_ADMIN" ? (
                    <ShieldAlert size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {selectedConv.customerName}
                    </h3>
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT"
                      ? "Aladdin B2B অফিশিয়াল অ্যাডমিন হেল্প ডেস্ক"
                      : "ভেরিফায়েড ক্রেতা (Verified Buyer)"}
                  </p>
                </div>
              </div>

              {selectedConv.product && (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs max-w-[220px] sm:max-w-xs">
                  {selectedConv.product.image && (
                    <img
                      src={selectedConv.product.image}
                      alt={selectedConv.product.name}
                      className="h-8 w-8 rounded-md object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="text-right min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {selectedConv.product.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {selectedConv.product.sku} • ৳{selectedConv.product.price?.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/40">
              {selectedConv.messages.map((m: ChatMessage) => {
                const isMe = m.senderRole === "VENDOR";

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                        isMe
                          ? "bg-[#12233f] text-white rounded-br-xs"
                          : m.isComplaint
                          ? "bg-red-50 text-slate-800 border border-red-200 rounded-bl-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 px-1">
                      <span>{formatChatTime(m.timeFormatted || m.createdAt)}</span>
                      {isMe && <CheckCheck size={12} className="text-sky-500" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security Alert Banner */}
            {securityWarning && (
              <div className="flex items-center justify-between border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                  <span>{securityWarning}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSecurityWarning(null)}
                  className="text-amber-800 font-bold hover:text-amber-950"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-slate-200 p-3.5 bg-white space-y-2 shrink-0"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="কাস্টমারকে উত্তর লিখুন বা কোটেশন জানান..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#12233f] focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12233f] text-white shadow-xs transition hover:bg-[#1b3155] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Info size={12} />
                  কাস্টমারের সাথে ভদ্র ও পেশাদার আচরণ বজায় রাখুন। সাইটের বাইরে ব্যক্তিগত লেনদেন নিষিদ্ধ।
                </span>
                <span>Aladdin B2B Secure Messaging</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs mb-3">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-700">কোনো কনভারসেশন সক্রিয় নেই</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              কাস্টমার প্রোডাক্ট সংক্রান্ত কোনো অনুসন্ধান বা কোটেশন রিকোয়েস্ট পাঠালে এখানে সরাসরি রিপ্লাই দিতে পারবেন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
