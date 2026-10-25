"use client";

import React, { useEffect, useState } from "react";

import {
  LifeBuoy,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";

import { toast } from "react-toastify";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const DEFAULT_SUPPORT_DATA = {
  supportEmail: "support@aladdin.com.bd",
  hotline: "+8801700000000",
  whatsappNumber: "+8801700000000",
  ticketPriorityDefault: "Medium",
  disputeWindowDays: 3,
  autoReplyMessage:
    "Thank you for contacting Aladdin B2B Support. Our agent will connect soon.",
  enableLiveChat: true,
  faqSectionEnabled: true,
};

type SupportData = typeof DEFAULT_SUPPORT_DATA;

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [supportData, setSupportData] =
    useState<SupportData>(DEFAULT_SUPPORT_DATA);

  // =========================================
  // SAFE RESPONSE PARSER
  // =========================================

  const parseResponse = async (response: Response) => {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server থেকে সঠিক response পাওয়া যায়নি।");
    }
  };

  const checkResponse = (response: Response, result: any) => {
    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message ||
          result?.error ||
          `Request failed (${response.status}).`,
      );
    }

    return result;
  };

  // =========================================
  // LOAD SUPPORT SETTINGS
  // =========================================

  useEffect(() => {
    let cancelled = false;

    const fetchSupportSettings = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/api/support`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const result = await parseResponse(response);
        checkResponse(response, result);

        if (result.data && !cancelled) {
          setSupportData({
            supportEmail:
              result.data.supportEmail ??
              DEFAULT_SUPPORT_DATA.supportEmail,

            hotline:
              result.data.hotline ??
              DEFAULT_SUPPORT_DATA.hotline,

            whatsappNumber:
              result.data.whatsappNumber ??
              DEFAULT_SUPPORT_DATA.whatsappNumber,

            ticketPriorityDefault:
              result.data.ticketPriorityDefault ??
              DEFAULT_SUPPORT_DATA.ticketPriorityDefault,

            disputeWindowDays:
              result.data.disputeWindowDays ??
              DEFAULT_SUPPORT_DATA.disputeWindowDays,

            autoReplyMessage:
              result.data.autoReplyMessage ??
              DEFAULT_SUPPORT_DATA.autoReplyMessage,

            enableLiveChat:
              result.data.enableLiveChat ??
              DEFAULT_SUPPORT_DATA.enableLiveChat,

            faqSectionEnabled:
              result.data.faqSectionEnabled ??
              DEFAULT_SUPPORT_DATA.faqSectionEnabled,
          });
        }
      } catch (error: unknown) {
        

        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load support settings.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchSupportSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (
    field: keyof SupportData,
    value: string | number | boolean,
  ) => {
    setSupportData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================
  // SAVE SUPPORT SETTINGS
  // =========================================

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/api/support/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supportData),
      });

      const result = await parseResponse(response);
      checkResponse(response, result);

      if (result.data) {
        setSupportData({
          supportEmail:
            result.data.supportEmail ??
            supportData.supportEmail,

          hotline:
            result.data.hotline ??
            supportData.hotline,

          whatsappNumber:
            result.data.whatsappNumber ??
            supportData.whatsappNumber,

          ticketPriorityDefault:
            result.data.ticketPriorityDefault ??
            supportData.ticketPriorityDefault,

          disputeWindowDays:
            result.data.disputeWindowDays ??
            supportData.disputeWindowDays,

          autoReplyMessage:
            result.data.autoReplyMessage ??
            supportData.autoReplyMessage,

          enableLiveChat:
            result.data.enableLiveChat ??
            supportData.enableLiveChat,

          faqSectionEnabled:
            result.data.faqSectionEnabled ??
            supportData.faqSectionEnabled,
        });
      }

      toast.success(
        result.message || "Support settings saved successfully!",
      );
    } catch (error: unknown) {
      

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save support settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <LifeBuoy size={22} className="text-[#f59e0b]" />
            </div>

            <p className="text-sm font-bold text-slate-500">
              Loading Support Settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-5 md:space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-[#12233F] sm:text-2xl">
              Support &amp; Help Desk Settings
            </h1>

            <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
              Customer এবং vendor support system-এর প্রয়োজনীয় configuration এখান
              থেকে manage করুন।
            </p>
          </div>
        </div>

        {/* SUPPORT SETTINGS CARD */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleSave} className="space-y-6 p-4 sm:p-5 md:p-6">
            {/* TITLE */}

            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <MessageSquare size={19} className="text-[#f59e0b]" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#12233F] sm:text-lg">
                    Support System Configuration
                  </h2>

                  <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                    Support contact এবং help desk-এর প্রয়োজনীয় settings
                    configure করুন।
                  </p>
                </div>
              </div>
            </div>

            {/* CONTACT SETTINGS */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* SUPPORT EMAIL */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Support Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f59e0b]"
                  />

                  <input
                    type="email"
                    value={supportData.supportEmail}
                    onChange={(e) =>
                      handleChange("supportEmail", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-amber-100"
                    placeholder="support@aladdin.com.bd"
                  />
                </div>
              </div>

              {/* HOTLINE */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Hotline
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f59e0b]"
                  />

                  <input
                    type="text"
                    value={supportData.hotline}
                    onChange={(e) =>
                      handleChange("hotline", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-amber-100"
                    placeholder="+8801700000000"
                  />
                </div>
              </div>

              {/* WHATSAPP */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  WhatsApp
                </label>

                <div className="relative">
                  <MessageCircle
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f59e0b]"
                  />

                  <input
                    type="text"
                    value={supportData.whatsappNumber}
                    onChange={(e) =>
                      handleChange("whatsappNumber", e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-amber-100"
                    placeholder="+8801700000000"
                  />
                </div>
              </div>

              {/* DEFAULT TICKET PRIORITY */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Default Ticket Priority
                </label>

                <select
                  value={supportData.ticketPriorityDefault}
                  onChange={(e) =>
                    handleChange("ticketPriorityDefault", e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-amber-100"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* DISPUTE WINDOW */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Dispute Window (Days)
                </label>

                <input
                  type="number"
                  min={0}
                  max={30}
                  value={supportData.disputeWindowDays}
                  onChange={(e) =>
                    handleChange("disputeWindowDays", Number(e.target.value))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs text-slate-900 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-amber-100"
                />

                <p className="mt-1.5 text-[10px] leading-4 text-slate-500">
                  Customer/vendor কতদিনের মধ্যে order বা delivery dispute করতে
                  পারবে।
                </p>
              </div>

              {/* AUTO REPLY */}

              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Live Chat Auto-Reply Message
                </label>

                <textarea
                  rows={4}
                  value={supportData.autoReplyMessage}
                  onChange={(e) =>
                    handleChange("autoReplyMessage", e.target.value)
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-900 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-amber-100"
                  placeholder="Enter auto-reply message..."
                />
              </div>
            </div>

            {/* FEATURE SETTINGS */}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* LIVE CHAT */}

              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-200 hover:bg-amber-50/30">
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-slate-950">
                    Enable Live Chat
                  </span>

                  <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                    Website-এ live chat option চালু থাকবে।
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={supportData.enableLiveChat}
                  onChange={(e) =>
                    handleChange("enableLiveChat", e.target.checked)
                  }
                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#f59e0b]"
                />
              </div>

              {/* FAQ */}

              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-amber-200 hover:bg-amber-50/30">
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-slate-950">
                    FAQ &amp; Knowledge Base
                  </span>

                  <span className="mt-1 block text-[11px] leading-4 text-slate-500">
                    Public website-এ FAQ এবং knowledge base দেখাবে।
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={supportData.faqSectionEnabled}
                  onChange={(e) =>
                    handleChange("faqSectionEnabled", e.target.checked)
                  }
                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#f59e0b]"
                />
              </div>
            </div>

            {/* SAVE */}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-4 text-slate-400">
                Changes will be applied to your support system after saving.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#f59e0b] px-6 py-3 text-xs font-extrabold text-slate-950 shadow-md transition-all hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving..." : "Save Support Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
