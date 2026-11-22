"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  User,
  Store,
  Search,
  CheckCheck,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  Tag,
  Info,
  Clock,
  ShieldCheck,
  Ban,
} from "lucide-react";
import {
  getStoredConversations,
  saveStoredConversations,
  fetchLiveConversations,
  ChatConversation,
  ChatMessage,
  sendChatMessage,
  markConversationAsReadForAdmin,
} from "@/lib/chat-store";
import { createClient } from "@/lib/supabase-client";
import { toast } from "react-toastify";

export default function AdminMessagesAuditPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [filterType, setFilterType] = useState<"ALL" | "SUSPICIOUS" | "COMPLAINT" | "VENDOR">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminReplyText, setAdminReplyText] = useState("");
  const [revealRawText, setRevealRawText] = useState(false);

  // Load conversations and subscribe to live updates
  useEffect(() => {
    const load = async () => {
      const cached = getStoredConversations();
      setConversations(cached);
      if (!selectedConvId && cached.length > 0) {
        setSelectedConvId(cached[0].id);
      }

      try {
        const live = await fetchLiveConversations({
          role: "ADMIN",
          filter: filterType === "SUSPICIOUS" ? "SUSPICIOUS" : filterType === "COMPLAINT" ? "COMPLAINT" : undefined,
        });
        if (live && live.length > 0) {
          setConversations(live);
          if (!selectedConvId) {
            setSelectedConvId(live[0].id);
          }
        }
      } catch (e) {
        console.warn("Live admin audit fetch:", e);
      }
    };

    void load();

    const handleUpdate = () => {
      const data = getStoredConversations();
      setConversations(data);
      if (!selectedConvId && data.length > 0) {
        setSelectedConvId(data[0].id);
      }
    };

    window.addEventListener("aladdin_chat_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Realtime Supabase Database listener
    const supabase = createClient();
    const channel = supabase
      .channel("admin_realtime_chat")
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
      window.removeEventListener("aladdin_chat_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      void supabase.removeChannel(channel);
    };
  }, [selectedConvId, filterType]);

  // Derived stats
  const totalCount = conversations.length;
  const suspiciousCount = conversations.filter((c) => c.isSuspicious).length;
  const complaintCount = conversations.filter((c) => c.type === "CUSTOMER_ADMIN_COMPLAINT").length;

  const filteredConversations = conversations.filter((c) => {
    if (filterType === "SUSPICIOUS" && !c.isSuspicious) return false;
    if (filterType === "COMPLAINT" && c.type !== "CUSTOMER_ADMIN_COMPLAINT") return false;
    if (filterType === "VENDOR" && c.type !== "CUSTOMER_VENDOR") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCustomer = c.customerName.toLowerCase().includes(q);
      const matchVendor = c.vendorName.toLowerCase().includes(q);
      const matchProduct = c.product?.name.toLowerCase().includes(q) || c.product?.sku?.toLowerCase().includes(q);
      const matchMsg = c.lastMessageText.toLowerCase().includes(q);
      return matchCustomer || matchVendor || matchProduct || matchMsg;
    }

    return true;
  });

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) || filteredConversations[0] || conversations[0];

  const handleSendAdminIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedConv) return;

    sendChatMessage({
      conversationId: selectedConv.id,
      senderRole: "ADMIN",
      senderName: "Aladdin Official Admin",
      text: adminReplyText.trim(),
    });

    setAdminReplyText("");
    toast.success("অ্যাডমিন বার্তা সফলভাবে পাঠানো হয়েছে!");
  };

  const handleIssueWarning = () => {
    if (!selectedConv) return;
    const warningText = `[অফিসিয়াল সতর্কতা]: প্রিয় ${selectedConv.vendorName}, প্ল্যাটফর্মের বাইরে কাস্টমারকে ব্যক্তিগত যোগাযোগের তথ্য দেওয়া বা লেনদেন করা কঠোরভাবে নিষিদ্ধ। ভবিষ্যতে এমন হলে আপনার স্টোর স্থায়ীভাবে বন্ধ করা হবে।`;

    sendChatMessage({
      conversationId: selectedConv.id,
      senderRole: "ADMIN",
      senderName: "Aladdin Compliance Team",
      text: warningText,
    });

    toast.warning("ভেন্ডরকে অফিশিয়াল সতর্কতা পাঠানো হয়েছে!");
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#12233f]">
              লাইভ চ্যাট অডিট ও লেনদেন নজরদারি (Live Chat Monitoring & Audit)
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Admin Control
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            কাস্টমার ও ভেন্ডরের মধ্যে কী কথা হচ্ছে তা রিয়েল-টাইমে পর্যবেক্ষণ করুন এবং প্ল্যাটফর্মের বাইরে ডিল ঠেকান।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            অটো-ফিল্টারিং চালু
          </span>
        </div>
      </div>

      {/* 2. Top Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">মোট সক্রিয় কনভারসেশন</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{totalCount}</p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700">🚨 সন্দেহজনক ডিল চেষ্টা (Flagged)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-red-700">{suspiciousCount}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">⚠️ কাস্টমার অভিযোগ (Tickets)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <ShieldAlert size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-800">{complaintCount}</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">সুরক্ষিত লেনদেন ফিল্টার</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-emerald-800">
            মোবাইল ও লিঙ্ক অটোমেটিক মাস্কড
          </p>
        </div>
      </div>

      {/* 3. Main Split View: Left List, Right Transcript */}
      <div className="flex flex-col lg:flex-row h-[720px] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Left Side: Conversation Selector & Filters */}
        <div className="w-full lg:w-96 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/60">
          {/* Filter Pills */}
          <div className="p-3 border-b border-slate-200 space-y-2.5">
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-200/60 p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFilterType("ALL")}
                className={`rounded-lg py-1.5 transition text-center ${
                  filterType === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                সকল চ্যাট ({totalCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterType("SUSPICIOUS")}
                className={`rounded-lg py-1.5 transition text-center ${
                  filterType === "SUSPICIOUS"
                    ? "bg-red-600 text-white shadow-2xs"
                    : "text-red-700 hover:bg-red-50"
                }`}
              >
                🚨 সন্দেহজনক ({suspiciousCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterType("COMPLAINT")}
                className={`rounded-lg py-1.5 transition text-center ${
                  filterType === "COMPLAINT"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "text-amber-800 hover:bg-amber-50"
                }`}
              >
                ⚠️ অভিযোগ ({complaintCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterType("VENDOR")}
                className={`rounded-lg py-1.5 transition text-center ${
                  filterType === "VENDOR"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ভেন্ডর ডিল
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="নাম, ফোন বা প্রোডাক্ট কোড খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#12233f]"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-600">কোনো চ্যাট পাওয়া যায়নি</p>
                <p className="text-[11px] text-slate-400">
                  কাস্টমার ও ভেন্ডরের মধ্যে নতুন কোনো মেসেজ আসলে এখানে লাইভ অডিট করা যাবে।
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = selectedConv && selectedConv.id === c.id;
                const isComplaint = c.type === "CUSTOMER_ADMIN_COMPLAINT";

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedConvId(c.id);
                      markConversationAsReadForAdmin(c.id);
                      setRevealRawText(false);
                    }}
                    className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                      isSelected
                        ? "bg-blue-50/80 border-l-4 border-[#12233f]"
                        : "hover:bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-2xs ${
                        c.isSuspicious
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : isComplaint
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {c.isSuspicious ? (
                        <AlertTriangle size={18} />
                      ) : isComplaint ? (
                        <ShieldAlert size={18} />
                      ) : (
                        <Store size={18} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {c.customerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{c.lastMessageTime}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                        <span className="font-semibold text-slate-700">{c.vendorName}</span>
                        {c.product?.sku && (
                          <span className="font-mono bg-slate-200/80 text-slate-600 px-1 rounded text-[10px]">
                            {c.product.sku}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-700 truncate mt-1">
                        {c.lastMessageText}
                      </p>

                      {/* Flag Tags */}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.isSuspicious && (
                          <span className="rounded-md bg-red-100 px-1.5 py-0.2 text-[9.5px] font-bold text-red-700 border border-red-200">
                            🚨 ফ্ল্যাগ করা (নম্বর/লিঙ্ক)
                          </span>
                        )}
                        {isComplaint && (
                          <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[9.5px] font-bold text-amber-800 border border-amber-200">
                            ⚠️ অভিযোগ টিকিট
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Audit Transcript & Action Console */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Transcript Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5 bg-slate-50/90">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {selectedConv.customerName} ↔ {selectedConv.vendorName}
                    </h3>
                    {selectedConv.isSuspicious && (
                      <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                        সন্দেহজনক
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    কনভারসেশন আইডি: <code className="font-mono">{selectedConv.id}</code>
                  </p>
                </div>
              </div>

              {/* Product Info Link */}
              {selectedConv.product && (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs shrink-0">
                  {selectedConv.product.image && (
                    <img
                      src={selectedConv.product.image}
                      alt={selectedConv.product.name}
                      className="h-8 w-8 rounded-md object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="text-left max-w-[200px]">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {selectedConv.product.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      কোড: {selectedConv.product.sku || "N/A"} • ৳{selectedConv.product.price.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Suspicious Reasons Box for Admin */}
            {selectedConv.isSuspicious && (
              <div className="flex items-center justify-between border-b border-red-200 bg-red-50/90 px-4 py-2 text-xs text-red-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-red-600 shrink-0" />
                  <span>
                    <strong>ফ্ল্যাগ হওয়ার কারণ:</strong>{" "}
                    {selectedConv.suspiciousReasons?.join(", ") || "ব্যক্তিগত কন্টাক্ট শেয়ারের চেষ্টা"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRevealRawText(!revealRawText)}
                    className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-red-700 border border-red-200 shadow-2xs hover:bg-red-50"
                  >
                    {revealRawText ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{revealRawText ? "মাস্কড টেক্সট দেখুন" : "আসল নম্বর উন্মোচন করুন"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleIssueWarning}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-red-700"
                  >
                    <Ban size={13} />
                    <span>ভেন্ডরকে ওয়ার্নিং দিন</span>
                  </button>
                </div>
              </div>
            )}

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
              {selectedConv.messages.map((m: ChatMessage) => {
                const isCustomer = m.senderRole === "CUSTOMER";
                const isVendor = m.senderRole === "VENDOR";
                const isAdmin = m.senderRole === "ADMIN";

                const displayText = revealRawText && m.rawText ? m.rawText : m.text;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      isAdmin
                        ? "items-center"
                        : isCustomer
                        ? "items-start"
                        : "items-end"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                      {isAdmin
                        ? "🛡️ অ্যাডমিন হস্তক্ষেপ"
                        : isCustomer
                        ? `👤 ক্রেতা: ${m.senderName}`
                        : `🏪 বিক্রেতা: ${m.senderName}`}
                    </span>

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                        isAdmin
                          ? "bg-red-600 text-white text-center font-medium rounded-xl border border-red-700"
                          : isCustomer
                          ? m.hasSensitiveData
                            ? "bg-red-50 text-red-950 border border-red-200 rounded-bl-xs"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                          : "bg-[#12233f] text-white rounded-br-xs"
                      }`}
                    >
                      {displayText}

                      {m.hasSensitiveData && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-red-600 border-t border-red-200/60 pt-1">
                          <AlertTriangle size={11} />
                          <span>সিস্টেম দ্বারা ফিল্টারকৃত (বাইরে লেনদেন প্রতিরোধ)</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 px-1">
                      <span>{m.timeFormatted}</span>
                      <CheckCheck size={12} className="text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Intervention Reply Bar */}
            <form
              onSubmit={handleSendAdminIntervention}
              className="border-t border-slate-200 p-3.5 bg-white space-y-2 shrink-0"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="এই চ্যাটে অফিসিয়াল অ্যাডমিন নির্দেশনা বা বার্তা লিখুন..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#12233f] focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!adminReplyText.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
                >
                  <Send size={14} />
                  <span>অ্যাডমিন হিসেবে পাঠান</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                🔒 আপনার পাঠানো বার্তাটি ক্রেতা ও বিক্রেতা উভয়ের চ্যাট স্ক্রিনে অফিশিয়াল নোটিশ হিসেবে প্রদর্শিত হবে।
              </p>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs mb-3">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-700">কোনো কনভারসেশন সক্রিয় নেই</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              প্ল্যাটফর্মে হওয়া সব চ্যাট, ফোন নম্বর শেয়ারিং চেষ্টা বা অফ-প্ল্যাটফর্ম ডিল এখানে লাইভ অডিট করা যাবে।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
