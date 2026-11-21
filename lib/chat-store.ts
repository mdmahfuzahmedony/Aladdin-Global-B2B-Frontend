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
    timeFormatted: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    lastMessageTime: lastMsg ? lastMsg.timeFormatted : "এইমাত্র",
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
    window.dispatchEvent(new Event("aladdin_chat_update"));
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
      if (params.userId) query = query.eq("customerId", params.userId);
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
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let targetConv = convs.find(
    (c) =>
      c.id === conversationId ||
      (productContext?.sku && c.product?.sku === productContext.sku && c.customerName === senderName)
  );

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
  const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
