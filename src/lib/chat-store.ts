"use client";

import { sanitizeAndInspectMessage, MessageSecurityCheck } from "./chat-security";
import { createClient } from "@/lib/supabase-client";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: "CUSTOMER" | "VENDOR" | "ADMIN";
  senderName: string;
  text: string;
  rawText?: string;
  hasSensitiveData?: boolean;
  isSuspicious?: boolean;
  suspiciousReasons?: string[];
  createdAt: string;
  timeFormatted: string;
  isComplaint?: boolean;
}

export interface ChatConversation {
  id: string;
  type: "CUSTOMER_VENDOR" | "CUSTOMER_ADMIN_COMPLAINT" | "VENDOR_ADMIN";
  customerName: string;
  customerId: string;
  vendorName: string;
  vendorId?: string;
  product?: {
    id: string;
    name: string;
    sku?: string | null;
    price: number;
    image?: string;
  };
  lastMessageText: string;
  lastMessageTime: string;
  unreadForVendor: number;
  unreadForAdmin: number;
  unreadForCustomer: number;
  isSuspicious?: boolean;
  suspiciousReasons?: string[];
  messages: ChatMessage[];
}

const STORAGE_KEY = "aladdin_chat_conversations_v1";

let chatBroadcast: BroadcastChannel | null = null;
if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
  try {
    chatBroadcast = new BroadcastChannel("aladdin_b2b_chat_sync");
    chatBroadcast.onmessage = (event) => {
      if (event.data?.type === "CHAT_UPDATE") {
        window.dispatchEvent(new Event("aladdin_chat_update"));
      }
    };
  } catch {
    // BroadcastChannel unsupported or blocked
  }
}

export function notifyChatUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aladdin_chat_update"));
    try {
      chatBroadcast?.postMessage({ type: "CHAT_UPDATE", timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
}

/**
 * Format timestamp in local 12-hour time (e.g. "1:48 PM")
 * Handles ISO strings with or without 'Z' timezone suffix
 */
export function formatChatTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "এইমাত্র";
  try {
    let dateStr = typeof dateInput === "string" ? dateInput.trim() : dateInput.toISOString();
    if (typeof dateInput === "string" && !dateStr.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(dateStr)) {
      dateStr += "Z";
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      if (typeof dateInput === "string") return dateInput;
      return "এইমাত্র";
    }

    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "এইমাত্র";
  }
}

/**
 * Format conversation preview timestamp (e.g. "1:48 PM", "Yesterday", "Nov 21")
 */
export function formatConversationTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "এইমাত্র";
  try {
    let dateStr = typeof dateInput === "string" ? dateInput.trim() : dateInput.toISOString();
    if (typeof dateInput === "string" && !dateStr.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(dateStr)) {
      dateStr += "Z";
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      if (typeof dateInput === "string") return dateInput;
      return "এইমাত্র";
    }

    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return "Yesterday";
    }

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "এইমাত্র";
  }
}

export function mapDbConversationToClient(conv: any): ChatConversation {
  const msgs: ChatMessage[] = (conv.messages || conv.chat_messages || []).map((m: any) => ({
    id: m.id,
    conversationId: m.conversationId,
    senderRole: m.senderRole,
    senderName: m.senderName,
    text: m.text,
    rawText: m.rawText || undefined,
    hasSensitiveData: Boolean(m.hasSensitiveData),
    isSuspicious: Boolean(m.isSuspicious),
    suspiciousReasons: m.suspiciousReasons || [],
    createdAt: m.createdAt,
    timeFormatted: formatChatTime(m.createdAt),
    isComplaint: Boolean(m.isComplaint),
  }));

  const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

  return {
    id: conv.id,
    type: conv.type,
    customerId: conv.customerId || "customer",
    customerName: conv.customerName || "Customer",
    vendorId: conv.vendorId || undefined,
    vendorName: conv.vendorName || "Vendor",
    product: conv.productTitle
      ? {
          id: conv.productId || "",
          name: conv.productTitle,
          sku: conv.productSku || undefined,
          price: conv.productPrice ? parseFloat(conv.productPrice) : 0,
          image: conv.productImage || undefined,
        }
      : undefined,
    lastMessageText: lastMsg ? lastMsg.text : "কোনো বার্তা নেই",
    lastMessageTime: lastMsg ? formatConversationTime(lastMsg.createdAt) : "এইমাত্র",
    unreadForVendor: 0,
    unreadForAdmin: conv.hasSuspiciousActivity ? 1 : 0,
    unreadForCustomer: 0,
    isSuspicious: Boolean(conv.hasSuspiciousActivity),
    suspiciousReasons: [],
    messages: msgs,
  };
}

export function getStoredConversations(): ChatConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realOnly = parsed.filter(
        (c) => c && c.id && !c.id.startsWith("conv_seed_")
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly));
      }
      return realOnly;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredConversations(convs: ChatConversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    notifyChatUpdate();
  } catch (err) {
    console.error("Failed to save chat store:", err);
  }
}

/**
 * Fetch live conversations directly from Supabase PostgreSQL database
 */
export async function fetchLiveConversations(params?: {
  role?: "CUSTOMER" | "VENDOR" | "ADMIN";
  userId?: string;
  customerName?: string;
  storeName?: string;
  filter?: "ALL" | "SUSPICIOUS" | "COMPLAINT" | "VENDOR";
}): Promise<ChatConversation[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("chat_conversations")
      .select("*, chat_messages(*)")
      .order("lastMessageAt", { ascending: false });

    if (params?.role === "VENDOR") {
      if (params.userId || params.storeName) {
        query = query.or(
          `vendorId.eq.${params.userId || ""},vendorName.eq.${params.storeName || ""}`
        );
      }
    } else if (params?.role === "CUSTOMER") {
      const orParts: string[] = [];
      if (params.userId) orParts.push(`customerId.eq.${params.userId}`);
      if (params.customerName) orParts.push(`customerName.ilike.%${params.customerName}%`);
      if (orParts.length > 0) {
        query = query.or(orParts.join(","));
      }
    } else if (params?.role === "ADMIN") {
      if (params.filter === "SUSPICIOUS") {
        query = query.eq("hasSuspiciousActivity", true);
      } else if (params.filter === "COMPLAINT") {
        query = query.eq("type", "CUSTOMER_ADMIN_COMPLAINT");
      }
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map((conv: any) =>
        mapDbConversationToClient({
          ...conv,
          messages: conv.chat_messages || [],
        })
      );
      saveStoredConversations(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Direct Supabase fetch error, using cache:", err);
  }

  return getStoredConversations();
}

/**
 * Send a message with local optimistic instant UI + direct Supabase DB push
 */
export function sendChatMessage({
  conversationId,
  senderRole,
  senderName,
  senderId,
  text,
  productContext,
  isComplaint = false,
}: {
  conversationId?: string;
  senderRole: "CUSTOMER" | "VENDOR" | "ADMIN";
  senderName: string;
  senderId?: string;
  text: string;
  productContext?: ChatConversation["product"] & { vendorName?: string; vendorId?: string };
  isComplaint?: boolean;
}): { conversation: ChatConversation; securityResult: MessageSecurityCheck } {
  const securityResult = sanitizeAndInspectMessage(text);
  const convs = getStoredConversations();

  const now = new Date();
  const timeFormatted = formatChatTime(now);

  let targetConv = convs.find((c) => {
    if (conversationId && c.id === conversationId) return true;
    if (productContext?.id && c.product?.id === productContext.id) {
      if (senderId && c.customerId === senderId) return true;
      if (senderName && c.customerName.toLowerCase() === senderName.toLowerCase()) return true;
    }
    if (productContext?.sku && c.product?.sku === productContext.sku) {
      if (senderId && c.customerId === senderId) return true;
      if (senderName && c.customerName.toLowerCase() === senderName.toLowerCase()) return true;
    }
    return false;
  });

  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId: targetConv?.id || `conv_${Date.now()}`,
    senderRole,
    senderName,
    text: securityResult.filteredText,
    rawText: securityResult.hasSensitiveData ? securityResult.originalText : undefined,
    hasSensitiveData: securityResult.hasSensitiveData,
    isSuspicious: securityResult.isSuspicious,
    suspiciousReasons: securityResult.suspiciousReasons,
    createdAt: now.toISOString(),
    timeFormatted,
    isComplaint,
  };

  if (targetConv) {
    targetConv.messages.push(newMsg);
    targetConv.lastMessageText = newMsg.text;
    targetConv.lastMessageTime = timeFormatted;
    if (securityResult.isSuspicious) {
      targetConv.isSuspicious = true;
      targetConv.suspiciousReasons = [
        ...(targetConv.suspiciousReasons || []),
        ...securityResult.suspiciousReasons,
      ];
    }
    if (senderRole === "CUSTOMER") {
      targetConv.unreadForVendor = (targetConv.unreadForVendor || 0) + 1;
      targetConv.unreadForAdmin = (targetConv.unreadForAdmin || 0) + (isComplaint ? 1 : 0);
    } else if (senderRole === "VENDOR") {
      targetConv.unreadForCustomer = (targetConv.unreadForCustomer || 0) + 1;
    }
  } else {
    const newConvId = `conv_${Date.now()}`;
    newMsg.conversationId = newConvId;

    targetConv = {
      id: newConvId,
      type: isComplaint ? "CUSTOMER_ADMIN_COMPLAINT" : "CUSTOMER_VENDOR",
      customerName: senderName || "ক্রেতা",
      customerId: senderId || `cust_${Date.now()}`,
      vendorName: productContext?.vendorName || "ভেন্ডর",
      vendorId: productContext?.vendorId || undefined,
      product: productContext
        ? {
            id: productContext.id,
            name: productContext.name,
            sku: productContext.sku,
            price: productContext.price,
            image: productContext.image,
          }
        : undefined,
      lastMessageText: newMsg.text,
      lastMessageTime: timeFormatted,
      unreadForVendor: senderRole === "CUSTOMER" ? 1 : 0,
      unreadForAdmin: isComplaint || securityResult.isSuspicious ? 1 : 0,
      unreadForCustomer: 0,
      isSuspicious: securityResult.isSuspicious,
      suspiciousReasons: securityResult.suspiciousReasons,
      messages: [newMsg],
    };

    convs.unshift(targetConv);
  }

  saveStoredConversations(convs);

  // Background direct push to Supabase PostgreSQL
  if (typeof window !== "undefined") {
    (async () => {
      try {
        const supabase = createClient();
        let dbConvId = targetConv?.id;
        const isDbUuid = dbConvId && dbConvId.includes("-") && dbConvId.length > 25;

        if (!isDbUuid) {
          // Check if already in DB
          const { data: existing } = await supabase
            .from("chat_conversations")
            .select("id")
            .eq("customerName", targetConv?.customerName || "Customer")
            .eq("vendorName", targetConv?.vendorName || "Vendor")
            .limit(1)
            .maybeSingle();

          if (existing?.id) {
            dbConvId = existing.id;
            if (targetConv) targetConv.id = existing.id;
          } else {
            const { data: created, error: createErr } = await supabase
              .from("chat_conversations")
              .insert({
                type: targetConv?.type || "CUSTOMER_VENDOR",
                customerId: targetConv?.customerId || null,
                customerName: targetConv?.customerName || "ক্রেতা",
                vendorId: targetConv?.vendorId || null,
                vendorName: targetConv?.vendorName || "ভেন্ডর",
                productId: targetConv?.product?.id || null,
                productTitle: targetConv?.product?.name || null,
                productSku: targetConv?.product?.sku || null,
                productPrice: targetConv?.product?.price ? String(targetConv.product.price) : null,
                productImage: targetConv?.product?.image || null,
                hasSuspiciousActivity: securityResult.isSuspicious,
                lastMessageAt: now.toISOString(),
                updatedAt: now.toISOString(),
              })
              .select("id")
              .single();

            if (!createErr && created?.id) {
              dbConvId = created.id;
              if (targetConv) targetConv.id = created.id;
            }
          }
        } else {
          await supabase
            .from("chat_conversations")
            .update({
              lastMessageAt: now.toISOString(),
              updatedAt: now.toISOString(),
              ...(securityResult.isSuspicious ? { hasSuspiciousActivity: true } : {}),
            })
            .eq("id", dbConvId);
        }

        if (dbConvId) {
          await supabase.from("chat_messages").insert({
            conversationId: dbConvId,
            senderId: senderId || null,
            senderRole,
            senderName,
            text: securityResult.filteredText,
            rawText: securityResult.hasSensitiveData ? securityResult.originalText : null,
            hasSensitiveData: securityResult.hasSensitiveData,
            isSuspicious: securityResult.isSuspicious,
            suspiciousReasons: securityResult.suspiciousReasons,
            isComplaint,
            createdAt: now.toISOString(),
          });

          // If vendor replied, trigger a customer notification in Supabase
          if (senderRole === "VENDOR" && targetConv?.customerId) {
            try {
              await supabase.from("Notification").insert({
                userId: targetConv.customerId,
                type: "CHAT_MESSAGE",
                title: `${senderName || "ভেন্ডর"} থেকে নতুন মেসেজ`,
                message: securityResult.filteredText.slice(0, 100),
                entityId: dbConvId,
                entityType: "CHAT_CONVERSATION",
                isRead: false,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
              });
            } catch (err) {
              // non-blocking
            }
          }
        }
      } catch (e) {
        console.warn("Direct Supabase message insert deferred:", e);
      }
    })();
  }

  return { conversation: targetConv, securityResult };
}

/**
 * Send Admin Official Warning with Supabase DB sync
 */
export async function sendAdminWarningAction({
  conversationId,
  warningText,
}: {
  conversationId: string;
  warningText: string;
}) {
  const convs = getStoredConversations();
  const conv = convs.find((c) => c.id === conversationId);

  const now = new Date();
  const timeFormatted = formatChatTime(now);

  const warnMsg: ChatMessage = {
    id: `warn_${Date.now()}`,
    conversationId,
    senderRole: "ADMIN",
    senderName: "Aladdin Security Team",
    text: `⚠️ [অফিসিয়াল সতর্কবার্তা]: ${warningText}`,
    createdAt: now.toISOString(),
    timeFormatted,
  };

  if (conv) {
    conv.messages.push(warnMsg);
    conv.lastMessageText = warnMsg.text;
    conv.lastMessageTime = timeFormatted;
    conv.isSuspicious = true;
    saveStoredConversations(convs);
  }

  try {
    const supabase = createClient();
    await supabase.from("chat_messages").insert({
      conversationId,
      senderRole: "ADMIN",
      senderName: "Aladdin Security Team",
      text: `⚠️ [অফিসিয়াল সতর্কবার্তা]: ${warningText}`,
      createdAt: now.toISOString(),
    });
    await supabase
      .from("chat_conversations")
      .update({
        hasSuspiciousActivity: true,
        lastMessageAt: now.toISOString(),
        updatedAt: now.toISOString(),
      })
      .eq("id", conversationId);
  } catch (e) {
    console.warn("Admin warning DB sync deferred:", e);
  }
}

/**
 * Find existing conversation for product & customer
 */
export function findConversationForProduct(params: {
  productId?: string;
  productSku?: string | null;
  productName?: string;
  customerId?: string;
  customerName?: string;
  isComplaint?: boolean;
}): ChatConversation | undefined {
  const convs = getStoredConversations();
  return convs.find((c) => {
    if (params.isComplaint && c.type !== "CUSTOMER_ADMIN_COMPLAINT") return false;
    if (!params.isComplaint && c.type !== "CUSTOMER_VENDOR") return false;

    const matchesProduct =
      (params.productId && c.product?.id === params.productId) ||
      (params.productSku && c.product?.sku === params.productSku) ||
      (params.productName &&
        c.product?.name &&
        c.product.name.trim().toLowerCase() === params.productName.trim().toLowerCase());

    if (!matchesProduct) return false;

    if (params.customerId && c.customerId === params.customerId) return true;
    if (params.customerName && c.customerName.toLowerCase() === params.customerName.toLowerCase()) return true;

    // Matches product
    return true;
  });
}

/**
 * Mark conversation as read for customer
 */
export function markConversationAsReadForCustomer(conversationId: string) {
  const convs = getStoredConversations();
  const target = convs.find((c) => c.id === conversationId);
  if (target && target.unreadForCustomer > 0) {
    target.unreadForCustomer = 0;
    saveStoredConversations(convs);
  }
}

/**
 * Calculate total unread messages for customer
 */
export function getCustomerUnreadCount(userId?: string, customerName?: string): number {
  const convs = getStoredConversations();
  return convs.reduce((sum, c) => {
    const isMine =
      !userId && !customerName
        ? true
        : (userId && c.customerId === userId) ||
          (customerName && c.customerName.toLowerCase() === customerName.toLowerCase());

    if (isMine) {
      return sum + (c.unreadForCustomer || 0);
    }
    return sum;
  }, 0);
}

