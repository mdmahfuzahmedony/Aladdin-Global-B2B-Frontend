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
const ADMIN_READ_KEY = "aladdin_chat_admin_reads";
const CUSTOMER_READ_KEY = "aladdin_chat_customer_reads";
const VENDOR_READ_KEY = "aladdin_chat_vendor_reads";

export function getAdminReadMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ADMIN_READ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setAdminRead(convId: string, timestamp = Date.now()) {
  if (typeof window === "undefined") return;
  try {
    const map = getAdminReadMap();
    map[convId] = timestamp;
    localStorage.setItem(ADMIN_READ_KEY, JSON.stringify(map));
  } catch {}
}

export function getCustomerReadMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CUSTOMER_READ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setCustomerRead(convId: string, timestamp = Date.now()) {
  if (typeof window === "undefined") return;
  try {
    const map = getCustomerReadMap();
    map[convId] = timestamp;
    localStorage.setItem(CUSTOMER_READ_KEY, JSON.stringify(map));
  } catch {}
}

export function getVendorReadMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VENDOR_READ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setVendorRead(convId: string, timestamp = Date.now()) {
  if (typeof window === "undefined") return;
  try {
    const map = getVendorReadMap();
    map[convId] = timestamp;
    localStorage.setItem(VENDOR_READ_KEY, JSON.stringify(map));
  } catch {}
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getGuestCustomerId(): string {
  if (typeof window === "undefined") return "guest_user";
  let guestId = localStorage.getItem("aladdin_guest_customer_id");
  if (!guestId) {
    guestId = `guest_${generateUUID().substring(0, 8)}`;
    localStorage.setItem("aladdin_guest_customer_id", guestId);
  }
  return guestId;
}

export function getGuestCustomerName(): string {
  if (typeof window === "undefined") return "ক্রেতা (Customer)";
  let guestName = localStorage.getItem("aladdin_guest_customer_name");
  if (!guestName) {
    guestName = "ক্রেতা (Customer)";
    localStorage.setItem("aladdin_guest_customer_name", guestName);
  }
  return guestName;
}

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
  const lastMsgTime = lastMsg ? new Date(lastMsg.createdAt).getTime() : 0;

  const adminReads = getAdminReadMap();
  const lastAdminReadAt = adminReads[conv.id] || 0;

  const customerReads = getCustomerReadMap();
  const lastCustomerReadAt = customerReads[conv.id] || 0;

  const vendorReads = getVendorReadMap();
  const lastVendorReadAt = vendorReads[conv.id] || 0;

  let unreadForAdmin = 0;
  let unreadForCustomer = 0;
  let unreadForVendor = 0;

  if (lastMsg) {
    if (lastMsg.senderRole === "CUSTOMER") {
      if (lastMsgTime > lastVendorReadAt) {
        unreadForVendor = 1;
      }
      if (lastMsgTime > lastAdminReadAt && (conv.type === "CUSTOMER_ADMIN_COMPLAINT" || conv.hasSuspiciousActivity)) {
        unreadForAdmin = 1;
      }
    } else if (lastMsg.senderRole === "VENDOR") {
      if (lastMsgTime > lastCustomerReadAt) {
        unreadForCustomer = 1;
      }
      if (lastMsgTime > lastAdminReadAt && (conv.type === "CUSTOMER_ADMIN_COMPLAINT" || conv.hasSuspiciousActivity)) {
        unreadForAdmin = 1;
      }
    } else if (lastMsg.senderRole === "ADMIN") {
      if (lastMsgTime > lastCustomerReadAt) {
        unreadForCustomer = 1;
      }
      if (lastMsgTime > lastVendorReadAt && conv.type !== "CUSTOMER_ADMIN_COMPLAINT") {
        unreadForVendor = 1;
      }
    }
  } else if (conv.hasSuspiciousActivity && !lastAdminReadAt) {
    unreadForAdmin = 1;
  }

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
    unreadForVendor,
    unreadForAdmin,
    unreadForCustomer,
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

export function mergeConversations(
  localConvs: ChatConversation[],
  dbConvs: ChatConversation[]
): ChatConversation[] {
  const map = new Map<string, ChatConversation>();
  const adminReads = getAdminReadMap();
  const customerReads = getCustomerReadMap();
  const vendorReads = getVendorReadMap();

  for (const c of dbConvs) {
    map.set(c.id, { ...c });
  }

  for (const loc of localConvs) {
    if (map.has(loc.id)) {
      const existing = map.get(loc.id)!;
      const msgMap = new Map<string, ChatMessage>();
      for (const m of existing.messages) {
        msgMap.set(m.id, m);
      }
      for (const m of loc.messages) {
        if (!msgMap.has(m.id)) {
          msgMap.set(m.id, m);
        }
      }
      const combinedMsgs = Array.from(msgMap.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      existing.messages = combinedMsgs;
      const last = combinedMsgs[combinedMsgs.length - 1];
      if (last) {
        existing.lastMessageText = last.text;
        existing.lastMessageTime = formatConversationTime(last.createdAt);
      }

      const lastMsgTime = last ? new Date(last.createdAt).getTime() : 0;
      const adminReadAt = adminReads[existing.id] || 0;
      const customerReadAt = customerReads[existing.id] || 0;
      const vendorReadAt = vendorReads[existing.id] || 0;

      // Preserve Admin read state
      if (last?.senderRole === "ADMIN" || adminReadAt >= lastMsgTime) {
        existing.unreadForAdmin = 0;
      }

      // Preserve Customer read state
      if (last?.senderRole === "CUSTOMER" || customerReadAt >= lastMsgTime) {
        existing.unreadForCustomer = 0;
      }

      // Preserve Vendor read state
      if (last?.senderRole === "VENDOR" || vendorReadAt >= lastMsgTime) {
        existing.unreadForVendor = 0;
      }
    } else {
      map.set(loc.id, loc);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const tA = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].createdAt).getTime() : 0;
    const tB = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].createdAt).getTime() : 0;
    return tB - tA;
  });
}

/**
 * Fetch live conversations directly from Supabase PostgreSQL database
 */
export async function fetchLiveConversations(params?: {
  role?: "CUSTOMER" | "VENDOR" | "ADMIN";
  userId?: string;
  vendorId?: string;
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
      const orParts: string[] = [];
      if (params.vendorId) {
        orParts.push(`vendorId.eq.${params.vendorId}`);
      }
      if (params.userId) {
        orParts.push(`vendorId.eq.${params.userId}`);
      }
      if (params.storeName && params.storeName.trim() && params.storeName !== "আমার স্টোর") {
        const safeStore = params.storeName.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
        if (safeStore) {
          orParts.push(`vendorName.ilike."%${safeStore}%"`);
        }
      }
      if (orParts.length > 0) {
        query = query.or(orParts.join(","));
      }
    } else if (params?.role === "CUSTOMER") {
      const orParts: string[] = [];
      if (params.userId) {
        orParts.push(`customerId.eq.${params.userId}`);
      }
      const guestId = getGuestCustomerId();
      if (guestId && guestId !== params.userId) {
        orParts.push(`customerId.eq.${guestId}`);
      }
      if (params.customerName && !params.customerName.includes("(") && params.customerName.trim().length > 1) {
        const safeName = params.customerName.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
        if (safeName) {
          orParts.push(`customerName.ilike."%${safeName}%"`);
        }
      }
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
    if (!error && Array.isArray(data)) {
      const mapped = data.map((conv: any) =>
        mapDbConversationToClient({
          ...conv,
          messages: (conv.chat_messages || []).sort(
            (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        })
      );
      const merged = mergeConversations(getStoredConversations(), mapped);
      saveStoredConversations(merged);
      return merged;
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
    // If conversationId is provided AND matches, check if productContext also aligns
    if (conversationId && c.id === conversationId) {
      if (!productContext?.id || !c.product?.id || c.product.id === productContext.id) {
        return true;
      }
    }
    // Match by product id & customer
    if (productContext?.id && c.product?.id === productContext.id) {
      if (senderId && c.customerId === senderId) return true;
      if (senderName && c.customerName.toLowerCase() === senderName.toLowerCase()) return true;
      if (!senderId && !senderName) return true;
    }
    // Match by product sku & customer
    if (productContext?.sku && c.product?.sku === productContext.sku) {
      if (senderId && c.customerId === senderId) return true;
      if (senderName && c.customerName.toLowerCase() === senderName.toLowerCase()) return true;
      if (!senderId && !senderName) return true;
    }
    // Match by product name & customer
    if (
      productContext?.name &&
      c.product?.name &&
      c.product.name.trim().toLowerCase() === productContext.name.trim().toLowerCase()
    ) {
      if (senderId && c.customerId === senderId) return true;
      if (senderName && c.customerName.toLowerCase() === senderName.toLowerCase()) return true;
      if (!senderId && !senderName) return true;
    }
    return false;
  });

  const newMsgId = generateUUID();

  if (targetConv) {
    const newMsg: ChatMessage = {
      id: newMsgId,
      conversationId: targetConv.id,
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
      targetConv.unreadForCustomer = 0;
      setCustomerRead(targetConv.id, now.getTime());
    } else if (senderRole === "VENDOR") {
      targetConv.unreadForCustomer = (targetConv.unreadForCustomer || 0) + 1;
      targetConv.unreadForAdmin = (targetConv.unreadForAdmin || 0) + (isComplaint ? 1 : 0);
      targetConv.unreadForVendor = 0;
      setVendorRead(targetConv.id, now.getTime());
    } else if (senderRole === "ADMIN") {
      targetConv.unreadForCustomer = (targetConv.unreadForCustomer || 0) + 1;
      targetConv.unreadForVendor = (targetConv.unreadForVendor || 0) + 1;
      targetConv.unreadForAdmin = 0;
      setAdminRead(targetConv.id, now.getTime());
    }
  } else {
    // Generate valid standard UUID for new conversation immediately
    const newConvId =
      conversationId && conversationId.includes("-") && conversationId.length > 25
        ? conversationId
        : generateUUID();

    const newMsg: ChatMessage = {
      id: newMsgId,
      conversationId: newConvId,
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

    targetConv = {
      id: newConvId,
      type: isComplaint ? "CUSTOMER_ADMIN_COMPLAINT" : "CUSTOMER_VENDOR",
      customerName: senderName || "ক্রেতা",
      customerId: senderId || getGuestCustomerId(),
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
      unreadForCustomer: senderRole === "VENDOR" || senderRole === "ADMIN" ? 1 : 0,
      isSuspicious: securityResult.isSuspicious,
      suspiciousReasons: securityResult.suspiciousReasons,
      messages: [newMsg],
    };

    if (senderRole === "CUSTOMER") setCustomerRead(newConvId, now.getTime());
    if (senderRole === "VENDOR") setVendorRead(newConvId, now.getTime());
    if (senderRole === "ADMIN") setAdminRead(newConvId, now.getTime());

    convs.unshift(targetConv);
  }

  saveStoredConversations(convs);

  // Background direct push to Supabase PostgreSQL with matching UUIDs
  if (typeof window !== "undefined") {
    (async () => {
      try {
        const supabase = createClient();
        const convId = targetConv!.id;

        // 1. Check if conversation row already exists in Supabase
        const { data: existing } = await supabase
          .from("chat_conversations")
          .select("id")
          .eq("id", convId)
          .maybeSingle();

        if (!existing?.id) {
          await supabase.from("chat_conversations").insert({
            id: convId,
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
            hasSuspiciousActivity: Boolean(securityResult.isSuspicious),
            lastMessageAt: now.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          });
        } else {
          await supabase
            .from("chat_conversations")
            .update({
              lastMessageAt: now.toISOString(),
              updatedAt: now.toISOString(),
              ...(securityResult.isSuspicious ? { hasSuspiciousActivity: true } : {}),
            })
            .eq("id", convId);
        }

        // 2. Insert chat message
        await supabase.from("chat_messages").insert({
          id: newMsgId,
          conversationId: convId,
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

        // 3. If vendor replied, trigger a customer notification in Supabase
        if (senderRole === "VENDOR" && targetConv?.customerId) {
          try {
            await supabase.from("Notification").insert({
              userId: targetConv.customerId,
              type: "CHAT_MESSAGE",
              title: `${senderName || "ভেন্ডর"} থেকে নতুন মেসেজ`,
              message: securityResult.filteredText.slice(0, 100),
              entityId: convId,
              entityType: "CHAT_CONVERSATION",
              isRead: false,
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
            });
          } catch (err) {
            // non-blocking
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

  const warnMsgId = generateUUID();
  const warnMsg: ChatMessage = {
    id: warnMsgId,
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
      id: warnMsgId,
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
  const guestId = getGuestCustomerId();

  return convs.find((c) => {
    if (params.isComplaint && c.type !== "CUSTOMER_ADMIN_COMPLAINT") return false;
    if (!params.isComplaint && c.type !== "CUSTOMER_VENDOR") return false;

    // Check product matching (by ID, SKU, or Name)
    const matchesProduct =
      (params.productId && c.product?.id === params.productId) ||
      (params.productSku && c.product?.sku && c.product.sku === params.productSku) ||
      (params.productName &&
        c.product?.name &&
        (c.product.name.trim().toLowerCase() === params.productName.trim().toLowerCase() ||
          c.product.name.trim().toLowerCase().includes(params.productName.trim().toLowerCase()) ||
          params.productName.trim().toLowerCase().includes(c.product.name.trim().toLowerCase())));

    if (!matchesProduct) return false;

    // Customer matching:
    // 1. Direct match by customerId
    if (params.customerId && c.customerId && c.customerId === params.customerId) {
      return true;
    }
    // 2. Match with guest ID on this browser
    if (guestId && c.customerId && c.customerId === guestId) {
      return true;
    }
    // 3. Match by customer name (exact or substring)
    if (params.customerName && c.customerName) {
      const pName = params.customerName.trim().toLowerCase();
      const cName = c.customerName.trim().toLowerCase();
      if (pName === cName || pName.includes(cName) || cName.includes(pName)) {
        return true;
      }
    }
    // 4. If no customer info specified
    if (!params.customerId && !params.customerName) {
      return true;
    }

    // 5. Fallback: If this browser has a conversation for this exact product and it's customer-vendor, return it
    if (c.type === "CUSTOMER_VENDOR" && !params.isComplaint) {
      return true;
    }

    return false;
  });
}

/**
 * Mark conversation as read for customer
 */
export function markConversationAsReadForCustomer(conversationId: string) {
  setCustomerRead(conversationId, Date.now());
  const convs = getStoredConversations();
  const target = convs.find((c) => c.id === conversationId);
  if (target) {
    target.unreadForCustomer = 0;
    saveStoredConversations(convs);
  }
}

/**
 * Calculate total unread messages for customer
 */
export function getCustomerUnreadCount(userId?: string, customerName?: string): number {
  const convs = getStoredConversations();
  const customerReads = getCustomerReadMap();
  return convs.reduce((sum, c) => {
    const isMine =
      !userId && !customerName
        ? true
        : (userId && c.customerId === userId) ||
          (customerName && c.customerName.toLowerCase() === customerName.toLowerCase());

    if (isMine) {
      const lastMsg = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
      const lastMsgTime = lastMsg ? new Date(lastMsg.createdAt).getTime() : 0;
      const readAt = customerReads[c.id] || 0;
      if (readAt >= lastMsgTime || (lastMsg && lastMsg.senderRole === "CUSTOMER")) {
        return sum;
      }
      return sum + (c.unreadForCustomer || 0);
    }
    return sum;
  }, 0);
}

/**
 * Calculate total unread messages for vendor
 */
export function getVendorUnreadCount(
  vendorId?: string,
  storeName?: string,
  userId?: string
): number {
  const convs = getStoredConversations();
  const vendorReads = getVendorReadMap();
  const cleanStore = (storeName || "").trim().toLowerCase();

  return convs.reduce((sum, c) => {
    if (c.type !== "CUSTOMER_VENDOR") return sum;

    let isMine = false;
    if (!vendorId && !storeName && !userId) {
      isMine = true;
    } else {
      if (vendorId && c.vendorId && c.vendorId === vendorId) isMine = true;
      if (userId && c.vendorId && c.vendorId === userId) isMine = true;
      if (cleanStore && cleanStore !== "আমার স্টোর" && c.vendorName) {
        const cStore = c.vendorName.trim().toLowerCase();
        if (cStore === cleanStore || cStore.includes(cleanStore) || cleanStore.includes(cStore)) {
          isMine = true;
        }
      }
    }

    if (isMine) {
      const lastMsg = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
      const lastMsgTime = lastMsg ? new Date(lastMsg.createdAt).getTime() : 0;
      const readAt = vendorReads[c.id] || 0;
      if (readAt >= lastMsgTime || (lastMsg && lastMsg.senderRole === "VENDOR")) {
        return sum;
      }
      return sum + (c.unreadForVendor || 0);
    }
    return sum;
  }, 0);
}

/**
 * Mark conversation as read for vendor
 */
export function markConversationAsReadForVendor(conversationId: string) {
  setVendorRead(conversationId, Date.now());
  const convs = getStoredConversations();
  const target = convs.find((c) => c.id === conversationId);
  if (target) {
    target.unreadForVendor = 0;
    saveStoredConversations(convs);
  }
}

/**
 * Calculate total unread complaints for admin
 */
export function getAdminUnreadCount(): number {
  const convs = getStoredConversations();
  const adminReads = getAdminReadMap();
  return convs.reduce((sum, c) => {
    const lastMsg = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
    const lastMsgTime = lastMsg ? new Date(lastMsg.createdAt).getTime() : 0;
    const readAt = adminReads[c.id] || 0;
    if (readAt >= lastMsgTime || (lastMsg && lastMsg.senderRole === "ADMIN")) {
      return sum;
    }
    return sum + (c.unreadForAdmin || 0);
  }, 0);
}

/**
 * Mark conversation as read for admin
 */
export function markConversationAsReadForAdmin(conversationId: string) {
  setAdminRead(conversationId, Date.now());
  const convs = getStoredConversations();
  const target = convs.find((c) => c.id === conversationId);
  if (target) {
    target.unreadForAdmin = 0;
    saveStoredConversations(convs);
  }
  // Sync to database in background
  if (typeof window !== "undefined") {
    try {
      const supabase = createClient();
      void supabase
        .from("chat_messages")
        .update({ isRead: true })
        .eq("conversationId", conversationId);
    } catch {}
  }
}
