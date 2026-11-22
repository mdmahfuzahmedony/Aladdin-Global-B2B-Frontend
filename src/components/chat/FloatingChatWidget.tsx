"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  User,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import {
  ChatConversation,
  ChatMessage,
  getStoredConversations,
  fetchLiveConversations,
  sendChatMessage,
  markConversationAsReadForCustomer,
  markConversationAsReadForVendor,
  markConversationAsReadForAdmin,
  formatChatTime,
  formatConversationTime,
  getGuestCustomerId,
  getGuestCustomerName,
  getCustomerUnreadCount,
  getVendorUnreadCount,
  getAdminUnreadCount,
} from "@/lib/chat-store";

type ActiveRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<ActiveRole>("CUSTOMER");
  const [storeName, setStoreName] = useState<string>("");
  const [vendorProfileId, setVendorProfileId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"PRIMARY" | "SECONDARY">("PRIMARY");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [dismissedMsgId, setDismissedMsgId] = useState<string | null>(null);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [showAdminNoticeBox, setShowAdminNoticeBox] = useState(false);
  const [adminNoticeTarget, setAdminNoticeTarget] = useState<"VENDOR" | "CUSTOMER">("VENDOR");
  const [adminNoticeText, setAdminNoticeText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevUnreadCountRef = useRef<number>(0);

  // Messenger-style subtle pop sound for new incoming unread messages
  const playMessengerPopSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore
    }
  };

  // Detect session and role dynamically (Customer vs Vendor vs Admin)
  useEffect(() => {
    let mounted = true;
    async function checkAuthAndRole() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);

        if (!session?.access_token) {
          setUserRole("CUSTOMER");
          setStoreName("");
          return;
        }

        // 1. Check metadata
        const metaRole = (session.user.user_metadata?.role as string | undefined)?.toUpperCase();
        let detectedRole: ActiveRole = "CUSTOMER";

        if (metaRole === "SUPER_ADMIN" || metaRole === "ADMIN" || metaRole === "MANAGER") {
          detectedRole = "ADMIN";
        } else if (metaRole === "VENDOR" || metaRole === "SELLER") {
          detectedRole = "VENDOR";
        }

        // 2. Also check backend API for strict role verification
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
          const res = await fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const apiRole = ((data?.user?.role || data?.role || "") as string).toUpperCase();
            if (apiRole === "SUPER_ADMIN" || apiRole === "ADMIN" || apiRole === "MANAGER") {
              detectedRole = "ADMIN";
            } else if (apiRole === "VENDOR" || apiRole === "SELLER") {
              detectedRole = "VENDOR";
            }
          }
        } catch {
          // ignore API check error, metadata is sufficient
        }

        // 3. If Vendor, load store name and vendor profile ID
        if (detectedRole === "VENDOR") {
          const metaStore =
            session.user.user_metadata?.storeName ||
            session.user.user_metadata?.store_name ||
            session.user.user_metadata?.shopName ||
            "";
          if (metaStore) setStoreName(metaStore);

          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
            const sRes = await fetch(`${API_URL}/api/vendors/store/settings`, {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (sRes.ok) {
              const sData = await sRes.json();
              const storeData = sData?.data || sData;
              if (storeData?.storeName) setStoreName(storeData.storeName);
              if (storeData?.vendorId || storeData?.id) {
                setVendorProfileId(String(storeData.vendorId || storeData.id));
              }
            }
          } catch {
            // ignore
          }
        }

        if (mounted) {
          setUserRole(detectedRole);
        }
      } catch (err) {
        console.warn("Floating chat auth/role check:", err);
      }
    }

    void checkAuthAndRole();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkAuthAndRole();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load conversations & sync unread count based on detected role
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

      // Update unread count according to active role
      if (userRole === "VENDOR") {
        setUnreadCount(getVendorUnreadCount(vendorProfileId || undefined, storeName, session?.user?.id));
      } else if (userRole === "ADMIN") {
        setUnreadCount(getAdminUnreadCount());
      } else {
        setUnreadCount(getCustomerUnreadCount(customerId, userName));
      }

      try {
        let live: ChatConversation[] = [];
        if (userRole === "VENDOR") {
          live = await fetchLiveConversations({
            role: "VENDOR",
            userId: session?.user?.id,
            vendorId: vendorProfileId || undefined,
            storeName: storeName || undefined,
          });
        } else if (userRole === "ADMIN") {
          live = await fetchLiveConversations({
            role: "ADMIN",
          });
        } else {
          live = await fetchLiveConversations({
            role: "CUSTOMER",
            userId: customerId,
            customerName: userName,
          });
        }

        if (live && live.length > 0) {
          setConversations(live);
        }

        // If the user already has a conversation open and active, auto-mark it as read
        if (isOpen && selectedConvId) {
          if (userRole === "VENDOR") {
            markConversationAsReadForVendor(selectedConvId);
          } else if (userRole === "ADMIN") {
            markConversationAsReadForAdmin(selectedConvId);
          } else {
            markConversationAsReadForCustomer(selectedConvId);
          }
        }

        let currentUnread = 0;
        if (userRole === "VENDOR") {
          currentUnread = getVendorUnreadCount(vendorProfileId || undefined, storeName, session?.user?.id);
        } else if (userRole === "ADMIN") {
          currentUnread = getAdminUnreadCount();
        } else {
          currentUnread = getCustomerUnreadCount(customerId, userName);
        }

        if (currentUnread > prevUnreadCountRef.current) {
          playMessengerPopSound();
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              new Notification("Aladdin নতুন চ্যাট বার্তা", {
                body: "আপনার ইনবক্সে একটি নতুন মেসেজ এসেছে!",
                icon: "/favicon.ico",
              });
            } catch {}
          }
        }
        prevUnreadCountRef.current = currentUnread;
        setUnreadCount(currentUnread);
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
      .channel(`floating_chat_${userRole.toLowerCase()}`)
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
  }, [session, userRole, storeName]);

  // Scroll to bottom when viewing messages
  useEffect(() => {
    if (selectedConvId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConvId, conversations]);

  // Active selected conversation
  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  // Segment conversations based on Role and active Tab
  // CUSTOMER: PRIMARY = Vendor chats, SECONDARY = Admin complaints
  // VENDOR:   PRIMARY = Customer inquiries, SECONDARY = Admin chats
  // ADMIN:    PRIMARY = Customer complaints, SECONDARY = All vendor chats
  const primaryConvs = conversations.filter((c) => {
    if (userRole === "ADMIN") {
      return c.type === "CUSTOMER_ADMIN_COMPLAINT";
    }
    return c.type === "CUSTOMER_VENDOR";
  });

  const secondaryConvs = conversations.filter((c) => {
    if (userRole === "ADMIN") {
      return c.type === "CUSTOMER_VENDOR";
    }
    return c.type === "CUSTOMER_ADMIN_COMPLAINT" || c.type === "VENDOR_ADMIN";
  });

  // Calculate unread counts per tab
  const primaryUnreadCount = useMemo(() => {
    return primaryConvs.reduce((sum, c) => {
      if (userRole === "VENDOR") return sum + (c.unreadForVendor || 0);
      if (userRole === "ADMIN") return sum + (c.unreadForAdmin || 0);
      return sum + (c.unreadForCustomer || 0);
    }, 0);
  }, [primaryConvs, userRole]);

  const secondaryUnreadCount = useMemo(() => {
    return secondaryConvs.reduce((sum, c) => {
      if (userRole === "VENDOR") return sum + (c.unreadForVendor || 0);
      if (userRole === "ADMIN") return sum + (c.unreadForAdmin || 0);
      return sum + (c.unreadForCustomer || 0);
    }, 0);
  }, [secondaryConvs, userRole]);

  // If chat is open on list view and current tab has 0 unread but other has >0, auto switch tab
  useEffect(() => {
    if (isOpen && !selectedConvId) {
      if (activeTab === "PRIMARY" && primaryUnreadCount === 0 && secondaryUnreadCount > 0) {
        setActiveTab("SECONDARY");
      } else if (activeTab === "SECONDARY" && secondaryUnreadCount === 0 && primaryUnreadCount > 0) {
        setActiveTab("PRIMARY");
      }
    }
  }, [isOpen, primaryUnreadCount, secondaryUnreadCount, activeTab, selectedConvId]);

  const displayedConversations =
    activeTab === "PRIMARY" ? primaryConvs : secondaryConvs;

  // Find the most recent conversation with unread messages for the active role (for Messenger-style popup)
  const latestUnreadConv = useMemo(() => {
    return conversations.find((c) => {
      if (userRole === "VENDOR") return (c.unreadForVendor || 0) > 0;
      if (userRole === "ADMIN") return (c.unreadForAdmin || 0) > 0;
      return (c.unreadForCustomer || 0) > 0;
    });
  }, [conversations, userRole]);

  const handleOpenConversation = (convId: string) => {
    setSelectedConvId(convId);
    setSecurityWarning(null);

    const targetConvObj = conversations.find((c) => c.id === convId);
    if (targetConvObj) {
      const targetLastMsg = targetConvObj.messages[targetConvObj.messages.length - 1];
      if (targetLastMsg) {
        setDismissedMsgId(targetLastMsg.id);
      }
      if (userRole === "ADMIN") {
        setActiveTab(targetConvObj.type === "CUSTOMER_VENDOR" ? "SECONDARY" : "PRIMARY");
      } else {
        setActiveTab(targetConvObj.type === "CUSTOMER_VENDOR" ? "PRIMARY" : "SECONDARY");
      }
    }

    // Immediately clear unread status in local state for instant UI update
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            unreadForCustomer: 0,
            unreadForVendor: 0,
            unreadForAdmin: 0,
          };
        }
        return c;
      })
    );

    if (userRole === "VENDOR") {
      markConversationAsReadForVendor(convId);
      const updatedCount = getVendorUnreadCount(vendorProfileId || undefined, storeName, session?.user?.id);
      setUnreadCount(updatedCount);
      prevUnreadCountRef.current = updatedCount;
    } else if (userRole === "ADMIN") {
      markConversationAsReadForAdmin(convId);
      const updatedCount = getAdminUnreadCount();
      setUnreadCount(updatedCount);
      prevUnreadCountRef.current = updatedCount;
    } else {
      markConversationAsReadForCustomer(convId);
      const userName =
        session?.user?.user_metadata?.fullName ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split("@")[0] ||
        getGuestCustomerName();
      const customerId = session?.user?.id || getGuestCustomerId();
      const updatedCount = getCustomerUnreadCount(customerId, userName);
      setUnreadCount(updatedCount);
      prevUnreadCountRef.current = updatedCount;
    }
  };

  const handleBackToList = () => {
    setSelectedConvId(null);
    setSecurityWarning(null);
    setShowAdminNoticeBox(false);
    setAdminNoticeText("");
  };

  const handleQuickChip = (chipText: string) => {
    setInputText(chipText);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedConv) return;

    setSecurityWarning(null);

    let senderRole: "CUSTOMER" | "VENDOR" | "ADMIN" = userRole;
    let senderName = "";

    if (userRole === "VENDOR") {
      senderRole = "VENDOR";
      senderName = storeName || selectedConv.vendorName || "আমার স্টোর";
    } else if (userRole === "ADMIN") {
      senderRole = "ADMIN";
      senderName = "Aladdin সাপোর্ট টিম";
    } else {
      senderRole = "CUSTOMER";
      senderName =
        session?.user?.user_metadata?.fullName ||
        session?.user?.user_metadata?.name ||
        session?.user?.email?.split("@")[0] ||
        selectedConv.customerName ||
        getGuestCustomerName();
    }

    const senderId =
      session?.user?.id ||
      (userRole === "CUSTOMER" ? getGuestCustomerId() : undefined);

    const { securityResult } = sendChatMessage({
      conversationId: selectedConv.id,
      senderRole,
      senderName,
      senderId,
      text,
      productContext: selectedConv.product,
      isComplaint: selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT",
    });

    if (securityResult.hasSensitiveData && securityResult.warningMessage) {
      setSecurityWarning(securityResult.warningMessage);
    }

    setInputText("");
  };

  // Quick Chips customized per Role
  const quickChips =
    userRole === "VENDOR"
      ? [
          "হ্যাঁ, পণ্যটি স্টকে আছে",
          "৫০ পিস নিলে বিশেষ ছাড় দেওয়া যাবে",
          "২-৩ দিনের মধ্যে ডেলিভারি সম্ভব",
          "বিস্তারিত অর্ডার তথ্য পাঠান",
        ]
      : userRole === "ADMIN"
      ? [
          "অভিযোগটি গ্রহণ করা হয়েছে, দ্রুত সমাধান করছি",
          "আপনার অর্ডার আইডি ও বিবরণ প্রদান করুন",
          "ভেন্ডরের বিরুদ্ধে কারণ দর্শানোর নোটিশ দেওয়া হয়েছে",
        ]
      : [
          "বর্তমানে কত পিস স্টক আছে?",
          "৫০ পিস নিলে কোনো ছাড় আছে?",
          "ডেলিভারি কবে পাব?",
          "আসল স্যাম্পল ছবি দেখতে চাই",
        ];

  return (
    <aside
      aria-label="লাইভ চ্যাট উইজেট"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end pointer-events-none"
    >
      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[360px] sm:w-[410px] h-[550px] max-h-[85vh] rounded-2xl bg-white shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* HEADER */}
          <div
            className={`text-white p-3 sm:p-3.5 flex items-center justify-between shrink-0 shadow-xs ${
              userRole === "ADMIN"
                ? "bg-[#1E1233]"
                : userRole === "VENDOR"
                ? "bg-[#0F2A1D]"
                : "bg-[#12233f]"
            }`}
          >
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
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold shrink-0 ${
                    userRole === "ADMIN"
                      ? "bg-red-500 text-white"
                      : userRole === "VENDOR"
                      ? "bg-emerald-400 text-slate-900"
                      : "bg-amber-400 text-[#12233f]"
                  }`}
                >
                  {userRole === "ADMIN" ? (
                    <ShieldAlert size={16} />
                  ) : userRole === "VENDOR" ? (
                    <Store size={16} />
                  ) : (
                    <MessageSquare size={16} />
                  )}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold truncate">
                  {selectedConv
                    ? selectedConv.type === "CUSTOMER_ADMIN_COMPLAINT"
                      ? "Aladdin সাপোর্ট ডেস্ক"
                      : userRole === "VENDOR"
                      ? selectedConv.customerName || "কাস্টমার"
                      : selectedConv.vendorName || "ভেন্ডর স্টোর"
                    : userRole === "ADMIN"
                    ? "🛡️ প্ল্যাটফর্ম অডিট ও সাপোর্ট (Admin)"
                    : userRole === "VENDOR"
                    ? `🏪 ভেন্ডর ইনবক্স (${storeName || "আমার স্টোর"})`
                    : "মেসেজ ও লাইভ চ্যাট"}
                </h3>
                <p className="text-[10px] text-slate-300 truncate">
                  {selectedConv
                    ? selectedConv.product?.name
                      ? `পণ্য: ${selectedConv.product.name}`
                      : "সরাসরি সহায়তা"
                    : userRole === "ADMIN"
                    ? "লাইভ নিরাপত্তা মনিটরিং ও কাস্টমার কমপ্লেইন"
                    : userRole === "VENDOR"
                    ? "কাস্টমারদের পণ্যের প্রশ্ন ও ফিরতি বার্তা"
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

          {/* TOP TABS ACCORDING TO USER ROLE (Visible on list view) */}
          {!selectedConv && (
            <div className="bg-slate-100/90 p-1.5 flex gap-1.5 border-b border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("PRIMARY")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "PRIMARY"
                    ? userRole === "ADMIN"
                      ? "bg-white text-red-800 shadow-2xs border border-red-200/60"
                      : "bg-white text-emerald-800 shadow-2xs border border-emerald-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {userRole === "ADMIN" ? (
                  <ShieldAlert
                    size={14}
                    className={activeTab === "PRIMARY" ? "text-red-600" : "text-slate-400"}
                  />
                ) : userRole === "VENDOR" ? (
                  <User
                    size={14}
                    className={activeTab === "PRIMARY" ? "text-emerald-600" : "text-slate-400"}
                  />
                ) : (
                  <Store
                    size={14}
                    className={activeTab === "PRIMARY" ? "text-emerald-600" : "text-slate-400"}
                  />
                )}
                <span>
                  {userRole === "ADMIN"
                    ? `অভিযোগ ও টিকেট (${primaryConvs.length})`
                    : userRole === "VENDOR"
                    ? `কাস্টমার ইনকোয়ারি (${primaryConvs.length})`
                    : `ভেন্ডর চ্যাট (${primaryConvs.length})`}
                </span>
                {primaryUnreadCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white shadow-2xs animate-pulse">
                    {primaryUnreadCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("SECONDARY")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "SECONDARY"
                    ? "bg-white text-indigo-800 shadow-2xs border border-indigo-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {userRole === "ADMIN" ? (
                  <Store
                    size={14}
                    className={activeTab === "SECONDARY" ? "text-indigo-600" : "text-slate-400"}
                  />
                ) : (
                  <ShieldAlert
                    size={14}
                    className={activeTab === "SECONDARY" ? "text-indigo-600" : "text-slate-400"}
                  />
                )}
                <span>
                  {userRole === "ADMIN"
                    ? `সকল লাইভ চ্যাট (${secondaryConvs.length})`
                    : `অ্যাডমিন সাপোর্ট (${secondaryConvs.length})`}
                </span>
                {secondaryUnreadCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white shadow-2xs animate-pulse">
                    {secondaryUnreadCount}
                  </span>
                )}
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
                    const isMe = m.senderRole === userRole;

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs leading-relaxed ${
                            isMe
                              ? "bg-[#12233f] text-white rounded-br-xs"
                              : m.senderRole === "ADMIN"
                              ? "bg-red-50 text-slate-800 border border-red-200 rounded-bl-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                          }`}
                        >
                          {!isMe && (
                            <div className="flex items-center gap-1.5 mb-1 font-bold text-[10px]">
                              {m.senderRole === "ADMIN" ? (
                                <>
                                  <ShieldAlert size={12} className="text-red-600" />
                                  <span className="text-red-700">{m.senderName} (অ্যাডমিন)</span>
                                </>
                              ) : m.senderRole === "VENDOR" ? (
                                <>
                                  <Store size={12} className="text-emerald-600" />
                                  <span className="text-emerald-700">{m.senderName} (ভেন্ডর)</span>
                                </>
                              ) : (
                                <>
                                  <User size={12} className="text-blue-600" />
                                  <span className="text-blue-700">{m.senderName} (ক্রেতা)</span>
                                </>
                              )}
                            </div>
                          )}
                          <p className="whitespace-pre-wrap text-[11px] leading-relaxed">
                            {m.text}
                          </p>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400 px-1">
                          <span>{formatChatTime(m.timeFormatted || m.createdAt)}</span>
                          {isMe && <CheckCheck size={11} className="text-sky-500" />}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Inquiry / Response Chips (Only for normal participants or direct support) */}
              {!(userRole === "ADMIN" && selectedConv.type === "CUSTOMER_VENDOR") && (
                <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200/70 bg-white px-2.5 py-1.5 text-[10px] shrink-0 no-scrollbar">
                  {quickChips.map((chip) => (
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

              {/* Chat Reply Input Form OR Admin Observer Panel */}
              {userRole === "ADMIN" && selectedConv.type === "CUSTOMER_VENDOR" ? (
                /* READ-ONLY AUDIT BAR FOR ADMIN IN CUSTOMER_VENDOR CHATS */
                <div className="border-t border-purple-200 bg-purple-50/90 p-2.5 flex flex-col gap-1.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-purple-950 font-bold text-[11px]">
                      <ShieldCheck size={14} className="text-purple-600 shrink-0" />
                      <span>লাইভ অডিট মোড: ক্রেতা ↔ বিক্রেতা ডিল</span>
                    </div>
                    <span className="rounded-full bg-purple-200/70 px-2 py-0.5 text-[9px] font-black text-purple-800">
                      কেবল পর্যবেক্ষণ
                    </span>
                  </div>

                  <p className="text-[10px] text-purple-800 leading-snug">
                    মূল চ্যাট ক্রেতা ও বিক্রেতার মাঝে। অ্যাডমিন সরাসরি সাধারণ মেসেজ দিতে পারবেন না। কোনো অনিয়ম দেখলে নিচে থেকে অফিশিয়াল নোটিশ দিন।
                  </p>

                  {!showAdminNoticeBox ? (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminNoticeTarget("VENDOR");
                          setShowAdminNoticeBox(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 py-1.5 px-2 text-[10px] font-bold text-white shadow-2xs hover:bg-red-700 transition"
                      >
                        <AlertTriangle size={12} />
                        <span>ভেন্ডরকে পার্সোনাল নোটিশ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAdminNoticeTarget("CUSTOMER");
                          setShowAdminNoticeBox(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-amber-600 py-1.5 px-2 text-[10px] font-bold text-white shadow-2xs hover:bg-amber-700 transition"
                      >
                        <ShieldAlert size={12} />
                        <span>ক্রেতাকে সতর্কবার্তা</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-2 border border-purple-200 shadow-xs space-y-1.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                          <ShieldAlert size={12} className="text-red-600" />
                          <span>
                            {adminNoticeTarget === "VENDOR"
                              ? `ভেন্ডর (${selectedConv.vendorName})-কে নোটিশ`
                              : `ক্রেতা (${selectedConv.customerName})-কে নোটিশ`}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAdminNoticeBox(false)}
                          className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder={
                          adminNoticeTarget === "VENDOR"
                            ? "উদা: প্ল্যাটফর্মের বাইরে লেনদেন বা নম্বর দেওয়া নিষিদ্ধ..."
                            : "উদা: সুরক্ষার স্বার্থে প্ল্যাটফর্মের বাইরে লেনদেন করবেন না..."
                        }
                        value={adminNoticeText}
                        onChange={(e) => setAdminNoticeText(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] text-slate-800 outline-none focus:border-red-500 bg-slate-50"
                      />

                      <div className="flex items-center justify-between gap-1.5 pt-0.5">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setAdminNoticeText("প্ল্যাটফর্মের বাইরে ব্যক্তিগত যোগাযোগ বা লেনদেন করা পলিসি লঙ্ঘন।")
                            }
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600 hover:bg-slate-200"
                          >
                            পলিসি লঙ্ঘন
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAdminNoticeText("সরাসরি প্ল্যাটফর্মের মাধ্যমে নিরাপদ পেমেন্ট সম্পন্ন করুন।")
                            }
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600 hover:bg-slate-200"
                          >
                            নিরাপদ পেমেন্ট
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={!adminNoticeText.trim()}
                          onClick={() => {
                            if (!adminNoticeText.trim()) return;
                            sendChatMessage({
                              conversationId: selectedConv.id,
                              senderRole: "ADMIN",
                              senderName: "Aladdin কমপ্লায়েন্স টিম",
                              text: `⚠️ [অফিসিয়াল সতর্কবার্তা - ${adminNoticeTarget === "VENDOR" ? selectedConv.vendorName : selectedConv.customerName}]: ${adminNoticeText.trim()}`,
                            });
                            setAdminNoticeText("");
                            setShowAdminNoticeBox(false);
                          }}
                          className="rounded-lg bg-red-600 px-3 py-1 text-[10px] font-bold text-white shadow-2xs hover:bg-red-700 transition disabled:opacity-40"
                        >
                          নোটিশ পাঠান
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Chat Reply Input Form for Normal Participants or Direct Admin Tickets */
                <form
                  onSubmit={handleSend}
                  className="border-t border-slate-200 bg-white p-2.5 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    placeholder={
                      userRole === "VENDOR"
                        ? "কাস্টমারকে উত্তর লিখুন বা কোটেশন জানান..."
                        : userRole === "ADMIN"
                        ? "কাস্টমারের সাপোর্ট টিকেটের উত্তর লিখুন..."
                        : "মেসেজ লিখুন..."
                    }
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
              )}
            </div>
          ) : (
            /* CONVERSATION LIST FOR SELECTED TAB */
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-slate-50/40 flex flex-col">
              {/* Product Guide Info Strip when customer is browsing */}
              {displayedConversations.length > 0 &&
                userRole === "CUSTOMER" &&
                activeTab === "PRIMARY" && (
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
                /* EMPTY STATE ADAPTED TO ROLE */
                <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-2.5 shadow-2xs ${
                      userRole === "ADMIN"
                        ? "bg-red-50 text-red-600 border border-red-200/70"
                        : userRole === "VENDOR"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200/70"
                        : "bg-amber-50 text-amber-600 border border-amber-200/70"
                    }`}
                  >
                    {userRole === "ADMIN" ? (
                      <ShieldCheck size={26} />
                    ) : userRole === "VENDOR" ? (
                      <Store size={26} />
                    ) : (
                      <MessageSquare size={26} />
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-800">
                    {userRole === "VENDOR"
                      ? "কোনো কাস্টমার ইনকোয়ারি নেই"
                      : userRole === "ADMIN"
                      ? "কোনো অমীমাংসিত অভিযোগ নেই"
                      : "ভেন্ডরের সাথে কোনো কথোপকথন নেই"}
                  </h4>

                  <p className="mt-1 max-w-[260px] text-[11px] text-slate-500 leading-relaxed">
                    {userRole === "VENDOR"
                      ? "কাস্টমাররা আপনার পণ্যের পেজ থেকে মেসেজ পাঠালে এখানে দেখতে পাবেন এবং সরাসরি উত্তর দিতে পারবেন।"
                      : userRole === "ADMIN"
                      ? "প্ল্যাটফর্ম সাপোর্ট ও সব কার্যক্রম সুরক্ষিত রয়েছে।"
                      : "নির্দিষ্ট কোনো পণ্য বা পাইকারি অর্ডার নিয়ে এখনো বিক্রেতার সাথে চ্যাট শুরু করেননি।"}
                  </p>

                  {/* 3-Step Instruction Box for Customers */}
                  {userRole === "CUSTOMER" && (
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
                          <span>ভেন্ডরের কাছে সরাসরি আপনার বার্তা পৌঁছাবে এবং এখানে হিস্ট্রি থাকবে!</span>
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
                  )}
                </div>
              ) : (
                /* CONVERSATION ITEMS LIST */
                displayedConversations.map((c) => {
                  const hasUnread =
                    userRole === "VENDOR"
                      ? (c.unreadForVendor || 0) > 0
                      : userRole === "ADMIN"
                      ? (c.unreadForAdmin || 0) > 0
                      : (c.unreadForCustomer || 0) > 0;
                  const isComplaint = c.type === "CUSTOMER_ADMIN_COMPLAINT";

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleOpenConversation(c.id)}
                      className={`w-full text-left p-3 transition flex gap-3 items-start ${
                        hasUnread
                          ? "bg-blue-50/80 border-l-4 border-l-blue-600 hover:bg-blue-100/70"
                          : "bg-white hover:bg-slate-100/80"
                      }`}
                    >
                      {/* Product Thumbnail or Avatar */}
                      <div className="relative shrink-0">
                        {c.product?.image ? (
                          <div
                            className={`relative h-11 w-11 overflow-hidden rounded-xl border bg-slate-50 shadow-2xs ${
                              hasUnread
                                ? "border-blue-400 ring-2 ring-blue-200"
                                : "border-slate-200"
                            }`}
                          >
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
                                : hasUnread
                                ? "bg-blue-100 text-blue-700 border border-blue-300"
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
                        {/* Header Name & Time */}
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs truncate flex items-center gap-1.5">
                            {userRole === "VENDOR" ? (
                              <span
                                className={
                                  hasUnread
                                    ? "text-slate-950 font-extrabold"
                                    : "text-slate-800 font-bold"
                                }
                              >
                                {isComplaint ? "Aladdin Admin Support" : c.customerName}
                              </span>
                            ) : userRole === "ADMIN" ? (
                              <span
                                className={
                                  hasUnread
                                    ? "text-slate-950 font-extrabold"
                                    : "text-slate-800 font-bold"
                                }
                              >
                                {isComplaint ? `কমপ্লেইন: ${c.customerName}` : `${c.customerName} ↔ ${c.vendorName}`}
                              </span>
                            ) : (
                              <span
                                className={
                                  hasUnread
                                    ? "text-slate-950 font-extrabold"
                                    : "text-slate-800 font-semibold"
                                }
                              >
                                {isComplaint ? "Aladdin সাপোর্ট ডেস্ক" : c.vendorName || "ভেন্ডর স্টোর"}
                              </span>
                            )}
                          </h4>
                          <span
                            className={`text-[10px] shrink-0 ${
                              hasUnread
                                ? "text-blue-600 font-extrabold"
                                : "text-slate-400"
                            }`}
                          >
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
                        <p
                          className={`truncate mt-0.5 ${
                            hasUnread
                              ? "text-xs font-bold text-slate-900"
                              : "text-[11px] text-slate-500"
                          }`}
                        >
                          {c.lastMessageText || "কোনো বার্তা নেই"}
                        </p>
                      </div>

                      {/* Messenger style unread badge */}
                      {hasUnread && (
                        <div className="flex flex-col items-end gap-1 shrink-0 mt-1">
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-black text-white shadow-xs animate-pulse">
                            {userRole === "VENDOR"
                              ? c.unreadForVendor || 1
                              : userRole === "ADMIN"
                              ? c.unreadForAdmin || 1
                              : c.unreadForCustomer || 1}
                          </span>
                        </div>
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
              Aladdin লাইভ চ্যাট • {userRole}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              তাৎক্ষণিক সহায়তা
            </span>
          </div>
        </div>
      )}

      {/* MESSENGER STYLE POPUP BUBBLE PREVIEW (Shown when chat is closed and there is an unread message) */}
      {!isOpen && unreadCount > 0 && latestUnreadConv && (() => {
        const latestMsg = latestUnreadConv.messages[latestUnreadConv.messages.length - 1];
        if (latestMsg && dismissedMsgId === latestMsg.id) return false;
        return true;
      })() && (
        <div className="pointer-events-auto mb-3 w-[290px] sm:w-[330px] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setIsOpen(true);
              const latestMsg = latestUnreadConv.messages[latestUnreadConv.messages.length - 1];
              if (latestMsg) setDismissedMsgId(latestMsg.id);
              handleOpenConversation(latestUnreadConv.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsOpen(true);
                const latestMsg = latestUnreadConv.messages[latestUnreadConv.messages.length - 1];
                if (latestMsg) setDismissedMsgId(latestMsg.id);
                handleOpenConversation(latestUnreadConv.id);
              }
            }}
            className="group relative cursor-pointer rounded-2xl bg-white p-3.5 shadow-2xl border border-slate-200/90 hover:border-blue-500 hover:shadow-blue-500/20 transition-all text-left"
          >
            {/* Dismiss 'X' Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const latestMsg = latestUnreadConv.messages[latestUnreadConv.messages.length - 1];
                if (latestMsg) setDismissedMsgId(latestMsg.id);
              }}
              className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10"
              title="নোটিফিকেশন বন্ধ করুন"
            >
              <X size={12} />
            </button>

            <div className="flex items-start gap-3">
              {/* Avatar with Online/Active Dot */}
              <div className="relative shrink-0">
                {latestUnreadConv.product?.image ? (
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-blue-500 bg-slate-50 shadow-xs">
                    <Image
                      src={latestUnreadConv.product.image}
                      alt={latestUnreadConv.product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm shadow-xs border-2 border-white">
                    {userRole === "VENDOR"
                      ? latestUnreadConv.customerName?.charAt(0) || "C"
                      : latestUnreadConv.vendorName?.charAt(0) || "V"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs animate-pulse" />
              </div>

              {/* Message preview details */}
              <div className="min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {userRole === "VENDOR"
                      ? latestUnreadConv.customerName
                      : userRole === "ADMIN"
                      ? `কমপ্লেইন: ${latestUnreadConv.customerName}`
                      : latestUnreadConv.vendorName || "Aladdin ভেন্ডর"}
                  </h4>
                  <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-extrabold text-blue-700">
                    নতুন বার্তা
                  </span>
                </div>

                {/* Product context badge if any */}
                {latestUnreadConv.product && (
                  <div className="my-1 flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60 truncate">
                    <Package size={10} className="shrink-0 text-amber-600" />
                    <span className="truncate">{latestUnreadConv.product.name}</span>
                  </div>
                )}

                {/* Message snippet */}
                <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                  &ldquo;{latestUnreadConv.lastMessageText || "একটি নতুন বার্তা পাঠিয়েছেন"}&rdquo;
                </p>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{formatConversationTime(latestUnreadConv.lastMessageTime)}</span>
                  <span className="font-extrabold text-blue-600 group-hover:underline flex items-center gap-0.5">
                    উত্তর দিন &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Speech bubble tail pointing towards the floating button */}
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-slate-200 bg-white" />
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
            void Notification.requestPermission();
          }
          setIsOpen(!isOpen);
        }}
        className={`pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 ${
          userRole === "ADMIN"
            ? "bg-[#1E1233] hover:bg-[#2C1B4D] focus:ring-purple-400/40"
            : userRole === "VENDOR"
            ? "bg-[#0F2A1D] hover:bg-[#194530] focus:ring-emerald-400/40"
            : "bg-[#12233f] hover:bg-[#1b3155] focus:ring-amber-400/40"
        } ${unreadCount > 0 && !isOpen ? "ring-4 ring-blue-500/40 shadow-blue-500/30" : ""}`}
        title="মেসেজ ও লাইভ চ্যাট"
        aria-label="মেসেজ ও লাইভ চ্যাট উইন্ডো খুলুন"
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-200 rotate-90" />
        ) : (
          <>
            {userRole === "ADMIN" ? (
              <ShieldAlert size={26} />
            ) : userRole === "VENDOR" ? (
              <Store size={26} />
            ) : (
              <MessageSquare size={26} />
            )}
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-md border-2 border-white animate-bounce">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 animate-ping opacity-60" />
              </>
            )}
          </>
        )}
      </button>
    </aside>
  );
}
