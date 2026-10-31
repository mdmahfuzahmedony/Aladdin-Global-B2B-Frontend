"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  CreditCard,
  Truck,
  Percent,
  Shield,
  FileText,
  Bell,
  Lock,
  Mail,
  HardDrive,
  Key,
  Globe,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Trash2,
  Phone,
  MapPin,
} from "lucide-react";

// ============================================================
// API
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ============================================================
// TYPES
// ============================================================

type SettingsFormData = {
  siteName: string;
  logoUrl: string | null;
  contactNumber: string;
  supportEmail: string;
  address: string;
  currency: string;
  timezone: string;
  maintenance: boolean;

  bkashApiKey: string;
  bkashEnabled: boolean;

  nagadApiKey: string;
  nagadEnabled: boolean;

  sslCommerzApiKey: string;
  sslCommerzEnabled: boolean;

  codEnabled: boolean;

  pathaoApiKey: string;

  freeDeliveryThreshold: number;
  hyperlocalRadius: number;
  standardDeliveryFee: number;
  expressDeliveryFee: number;

  commissionRate: number;
  minPayoutLimit: number;

  vatNumber: string;
  vatPercentage: number;

  permissions: {
    admin: boolean;
    vendor: boolean;
    manager: boolean;
  };

  orderNotification: boolean;
  shippingNotification: boolean;
  lowStockNotification: boolean;

  termsAndConditions: string;
  privacyPolicy: string;

  twoFactorAuth: boolean;
  sessionTimeoutMins: number;
  maxLoginAttempts: number;

  smtpSender: string;
  otpValidity: number;

  maxUploadSize: number;
  allowedFileTypes: string;

  googleOAuth: boolean;
  emailConfirmation: boolean;
};

// ============================================================
// INITIAL DATA
// ============================================================

const initialFormData: SettingsFormData = {
  siteName: "Aladdin B2B Wholesale",
  logoUrl: null,
  contactNumber: "+8801700000000",
  supportEmail: "support@aladdin.com.bd",
  address: "Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400",
  currency: "৳",
  timezone: "Asia/Dhaka (GMT+6)",

  maintenance: false,

  bkashApiKey: "",
  bkashEnabled: true,

  nagadApiKey: "",
  nagadEnabled: true,

  sslCommerzApiKey: "",
  sslCommerzEnabled: true,

  codEnabled: true,

  pathaoApiKey: "",

  freeDeliveryThreshold: 50000,
  hyperlocalRadius: 3,
  standardDeliveryFee: 60,
  expressDeliveryFee: 120,

  commissionRate: 5,
  minPayoutLimit: 1000,

  vatNumber: "",
  vatPercentage: 7.5,

  permissions: {
    admin: true,
    vendor: true,
    manager: true,
  },

  orderNotification: true,
  shippingNotification: true,
  lowStockNotification: true,

  termsAndConditions: "",
  privacyPolicy: "",

  twoFactorAuth: false,
  sessionTimeoutMins: 30,
  maxLoginAttempts: 5,

  smtpSender: "",
  otpValidity: 5,

  maxUploadSize: 5,
  allowedFileTypes: "image/png, image/jpeg, application/pdf",

  googleOAuth: true,
  emailConfirmation: true,
};

// ============================================================
// HELPER
// ============================================================

async function getJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text,
    };
  }
}

// ============================================================
// PAGE
// ============================================================

export default function Page() {
  const [activeTab, setActiveTab] = useState("general");

  const [savedMessage, setSavedMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      setErrorMessage("");

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("category", "GENERAL");
      uploadData.append("altText", "Site Logo");

      const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Logo upload failed");
      }

      const uploadedUrl = result.data?.url;
      if (uploadedUrl) {
        handleChange("logoUrl", uploadedUrl);

        // Immediate background sync to database
        try {
          await fetch(`${API_BASE_URL}/api/settings/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ logoUrl: uploadedUrl }),
          });

          const cached = localStorage.getItem("aladin_site_settings");
          const parsed = cached ? JSON.parse(cached) : {};
          const updated = { ...parsed, logoUrl: uploadedUrl };
          localStorage.setItem("aladin_site_settings", JSON.stringify(updated));
          window.dispatchEvent(
            new CustomEvent("aladin:settings_updated", { detail: updated }),
          );
          setSavedMessage(true);
          setTimeout(() => setSavedMessage(false), 3000);
        } catch (syncErr) {
          console.warn("Auto-sync logo error:", syncErr);
        }
      }
    } catch (err: unknown) {
      console.error("Logo upload error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Logo upload failed",
      );
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleRemoveLogo = async () => {
    handleChange("logoUrl", null);
    try {
      await fetch(`${API_BASE_URL}/api/settings/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ logoUrl: "" }),
      });
      const cached = localStorage.getItem("aladin_site_settings");
      const parsed = cached ? JSON.parse(cached) : {};
      const updated = { ...parsed, logoUrl: null };
      localStorage.setItem("aladin_site_settings", JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("aladin:settings_updated", { detail: updated }),
      );
    } catch {
      // Ignore
    }
  };

  // ==========================================================
  // GET SETTINGS
  // ==========================================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(`${API_BASE_URL}/api/settings`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const result = await getJsonResponse(response);

        console.log("GET /api/settings:", response.status, result);

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              result.error ||
              `Settings load failed (${response.status})`,
          );
        }

        if (result.data && typeof result.data === "object") {
          const data = result.data;

          setFormData((prev) => ({
            ...prev,

            siteName: data.siteName ?? prev.siteName,
            logoUrl: data.logoUrl !== undefined ? data.logoUrl : prev.logoUrl,
            contactNumber: data.contactNumber ?? prev.contactNumber,
            supportEmail: data.supportEmail ?? prev.supportEmail,
            address: data.address ?? prev.address,
            currency: data.currency ?? prev.currency,

            timezone:
              data.timezone === "Asia/Dhaka"
                ? "Asia/Dhaka (GMT+6)"
                : (data.timezone ?? prev.timezone),

            // Maintenance
            maintenance: data.maintenance ?? prev.maintenance,

            // Payment
            bkashEnabled: data.bkashEnabled ?? prev.bkashEnabled,
            nagadEnabled: data.nagadEnabled ?? prev.nagadEnabled,
            sslCommerzEnabled: data.sslCommerzEnabled ?? prev.sslCommerzEnabled,
            codEnabled: data.codEnabled ?? prev.codEnabled,

            // Shipping
            hyperlocalRadius: Number(
              data.hyperlocalRadius ?? prev.hyperlocalRadius,
            ),
            standardDeliveryFee: Number(
              data.standardDeliveryFee ?? prev.standardDeliveryFee,
            ),
            expressDeliveryFee: Number(
              data.expressDeliveryFee ?? prev.expressDeliveryFee,
            ),

            // Commission
            commissionRate: Number(data.commissionRate ?? prev.commissionRate),
            minPayoutLimit: Number(data.minPayoutLimit ?? prev.minPayoutLimit),

            // Tax
            vatNumber: data.vatNumber ?? prev.vatNumber,
            vatPercentage: Number(data.vatPercentage ?? prev.vatPercentage),

            // Security
            twoFactorAuth: data.twoFactorAuth ?? prev.twoFactorAuth,
            sessionTimeoutMins: Number(
              data.sessionTimeoutMins ?? prev.sessionTimeoutMins,
            ),
            maxLoginAttempts: Number(
              data.maxLoginAttempts ?? prev.maxLoginAttempts,
            ),

            // Permissions
            permissions: {
              ...prev.permissions,
              ...(data.permissions || {}),
            },
          }));
        }
      } catch (error) {
        console.error("Fetch settings error:", error);

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load settings.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================================================
  // NORMAL FIELD CHANGE
  // ==========================================================

  const handleChange = <K extends keyof SettingsFormData>(
    field: K,
    value: SettingsFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSavedMessage(false);
  };

  // ==========================================================
  // PERMISSION CHANGE
  // ==========================================================

  const handlePermissionChange = (
    field: keyof SettingsFormData["permissions"],
    value: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: value,
      },
    }));

    setSavedMessage(false);
  };

  // ==========================================================
  // SAVE SETTINGS
  // ==========================================================

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setSavedMessage(false);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/api/settings/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timezone:
            formData.timezone === "Asia/Dhaka (GMT+6)"
              ? "Asia/Dhaka"
              : formData.timezone,
        }),
      });

      const result = await getJsonResponse(response);

      console.log("POST /api/settings/update:", response.status, result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            `Settings save failed (${response.status})`,
        );
      }

      if (result.data && typeof result.data === "object") {
        const data = result.data;

        setFormData((prev) => ({
          ...prev,

          siteName: data.siteName ?? prev.siteName,
          logoUrl: data.logoUrl !== undefined ? data.logoUrl : prev.logoUrl,
          contactNumber: data.contactNumber ?? prev.contactNumber,
          supportEmail: data.supportEmail ?? prev.supportEmail,
          address: data.address ?? prev.address,
          currency: data.currency ?? prev.currency,

          timezone:
            data.timezone === "Asia/Dhaka"
              ? "Asia/Dhaka (GMT+6)"
              : (data.timezone ?? prev.timezone),

          maintenance: data.maintenance ?? prev.maintenance,

          bkashEnabled: data.bkashEnabled ?? prev.bkashEnabled,

          nagadEnabled: data.nagadEnabled ?? prev.nagadEnabled,

          sslCommerzEnabled: data.sslCommerzEnabled ?? prev.sslCommerzEnabled,

          codEnabled: data.codEnabled ?? prev.codEnabled,

          hyperlocalRadius: Number(
            data.hyperlocalRadius ?? prev.hyperlocalRadius,
          ),

          standardDeliveryFee: Number(
            data.standardDeliveryFee ?? prev.standardDeliveryFee,
          ),

          expressDeliveryFee: Number(
            data.expressDeliveryFee ?? prev.expressDeliveryFee,
          ),

          commissionRate: Number(data.commissionRate ?? prev.commissionRate),

          minPayoutLimit: Number(data.minPayoutLimit ?? prev.minPayoutLimit),

          vatNumber: data.vatNumber ?? prev.vatNumber,

          vatPercentage: Number(data.vatPercentage ?? prev.vatPercentage),

          twoFactorAuth: data.twoFactorAuth ?? prev.twoFactorAuth,

          sessionTimeoutMins: Number(
            data.sessionTimeoutMins ?? prev.sessionTimeoutMins,
          ),

          maxLoginAttempts: Number(
            data.maxLoginAttempts ?? prev.maxLoginAttempts,
          ),

          permissions: {
            ...prev.permissions,
            ...(data.permissions || {}),
          },
        }));
      }

      // Sync with global SiteSettingsContext across all tabs & components
      const syncData = {
        siteName: result.data?.siteName || formData.siteName,
        logoUrl:
          result.data?.logoUrl !== undefined
            ? result.data.logoUrl
            : formData.logoUrl,
        contactNumber: result.data?.contactNumber || formData.contactNumber,
        supportEmail: result.data?.supportEmail || formData.supportEmail,
        address: result.data?.address || formData.address,
        currency: result.data?.currency || formData.currency,
        timezone: result.data?.timezone || formData.timezone,
        maintenance: Boolean(result.data?.maintenance ?? formData.maintenance),
      };

      try {
        localStorage.setItem("aladin_site_settings", JSON.stringify(syncData));
        window.dispatchEvent(
          new CustomEvent("aladin:settings_updated", { detail: syncData }),
        );
      } catch {
        // Ignore
      }

      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Save settings error:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================================
  // TABS
  // ==========================================================

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: Globe,
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: Truck,
    },
    {
      id: "commission",
      label: "Commission",
      icon: Percent,
    },
    {
      id: "rbac",
      label: "Roles & Permissions",
      icon: Shield,
    },
    {
      id: "tax",
      label: "Tax & VAT",
      icon: FileText,
    },
    {
      id: "notification",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "legal",
      label: "Legal Pages",
      icon: FileText,
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
    },
    {
      id: "otp",
      label: "OTP & Email",
      icon: Mail,
    },
    {
      id: "storage",
      label: "Storage",
      icon: HardDrive,
    },
    {
      id: "auth",
      label: "Authentication",
      icon: Key,
    },
  ];

  // ==========================================================
  // SHARED INPUT CLASS
  // ==========================================================

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none transition focus:border-[#f59e0b] focus:bg-white focus:ring-2 focus:ring-[#f59e0b]/10";

  const sectionTitleClass =
    "text-lg font-bold text-[#12233F] border-b border-slate-100 pb-3";

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 text-slate-900 sm:p-5 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#12233F] sm:text-2xl">
                Platform Settings Dashboard
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Manage all configuration settings for the Aladdin B2B wholesale
                platform from one place.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            {savedMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={16} />
                <span>Settings successfully updated!</span>
              </div>
            )}

            {errorMessage && (
              <div className="max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 xl:gap-6">
          {/* ====================================================
              SIDEBAR / TABS
          ==================================================== */}

          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm lg:col-span-1 lg:p-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all lg:w-full ${
                      isActive
                        ? "bg-[#f59e0b] font-bold text-slate-950 shadow-md shadow-[#f59e0b]/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-slate-950" : "text-[#f59e0b]"}
                    />

                    <span className="whitespace-nowrap lg:truncate">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ====================================================
              FORM
          ==================================================== */}

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6 lg:col-span-3">
            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                    <Settings
                      size={21}
                      className="animate-spin text-[#f59e0b]"
                    />
                  </div>

                  <p className="text-sm font-bold text-slate-600">
                    Loading settings...
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Please wait while your settings are loaded.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {/* ==================================================
                    GENERAL
                ================================================== */}

                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className={sectionTitleClass}>General Settings</h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure the core identity, branding, and contact
                        details of your platform.
                      </p>
                    </div>

                    {/* SITE LOGO UPLOAD & PREVIEW */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                      <label className="mb-2 block text-xs font-bold text-slate-800">
                        Platform / Site Logo (সাইট লোগো)
                      </label>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Preview Box */}
                        <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-2 shadow-inner">
                          {formData.logoUrl ? (
                            <img
                              src={formData.logoUrl}
                              alt="Site Logo Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="mx-auto h-6 w-6 text-slate-400" />
                              <span className="mt-1 block text-[10px] text-slate-400">
                                Default Logo
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Upload & Action Controls */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#12233f] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#1b3155]">
                              <Upload size={14} />
                              <span>
                                {isUploadingLogo
                                  ? "Uploading..."
                                  : "Upload New Logo"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={isUploadingLogo}
                                className="hidden"
                              />
                            </label>

                            {formData.logoUrl && (
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2 size={13} />
                                <span>Remove Logo</span>
                              </button>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.logoUrl || ""}
                              onChange={(e) =>
                                handleChange(
                                  "logoUrl",
                                  e.target.value.trim()
                                    ? e.target.value.trim()
                                    : null,
                                )
                              }
                              placeholder="Or paste direct image URL (https://...)"
                              className={inputClass}
                            />
                            {formData.logoUrl && (
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await fetch(
                                      `${API_BASE_URL}/api/settings/update`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          logoUrl: formData.logoUrl,
                                        }),
                                      },
                                    );
                                    const cached = localStorage.getItem(
                                      "aladin_site_settings",
                                    );
                                    const parsed = cached
                                      ? JSON.parse(cached)
                                      : {};
                                    const updated = {
                                      ...parsed,
                                      logoUrl: formData.logoUrl,
                                    };
                                    localStorage.setItem(
                                      "aladin_site_settings",
                                      JSON.stringify(updated),
                                    );
                                    window.dispatchEvent(
                                      new CustomEvent(
                                        "aladin:settings_updated",
                                        { detail: updated },
                                      ),
                                    );
                                    setSavedMessage(true);
                                    setTimeout(
                                      () => setSavedMessage(false),
                                      3000,
                                    );
                                  } catch (err) {
                                    console.error("Save logo error:", err);
                                  }
                                }}
                                className="shrink-0 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                              >
                                Apply Logo
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Recommended size: 240x60px PNG or SVG with
                            transparent background.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SITE NAME */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Site Name / Platform Title (প্ল্যাটফর্ম নাম)
                      </label>

                      <input
                        type="text"
                        value={formData.siteName}
                        onChange={(e) =>
                          handleChange("siteName", e.target.value)
                        }
                        placeholder="e.g. Aladin Global B2B"
                        className={inputClass}
                      />
                    </div>

                    {/* CONTACT PHONE & SUPPORT EMAIL */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
                          <Phone size={13} className="text-[#f59e0b]" />
                          <span>Contact Phone Number (হেল্পলাইন ফোন)</span>
                        </label>

                        <input
                          type="text"
                          value={formData.contactNumber}
                          onChange={(e) =>
                            handleChange("contactNumber", e.target.value)
                          }
                          placeholder="+8801700000000 or 01322-130929"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
                          <Mail size={13} className="text-[#f59e0b]" />
                          <span>Support Email Address (সাপোর্ট ইমেইল)</span>
                        </label>

                        <input
                          type="email"
                          value={formData.supportEmail}
                          onChange={(e) =>
                            handleChange("supportEmail", e.target.value)
                          }
                          placeholder="support@aladdin.com.bd"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
                        <MapPin size={13} className="text-[#f59e0b]" />
                        <span>
                          Office / Store Address (অফিস বা স্টোর ঠিকানা)
                        </span>
                      </label>

                      <textarea
                        rows={2}
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        placeholder="Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400"
                        className={inputClass}
                      />
                    </div>

                    {/* CURRENCY & TIMEZONE */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Default Currency (কারেন্সি)
                        </label>

                        <input
                          type="text"
                          value={formData.currency}
                          onChange={(e) =>
                            handleChange("currency", e.target.value)
                          }
                          placeholder="৳ or BDT"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Timezone
                        </label>

                        <select
                          value={formData.timezone}
                          onChange={(e) =>
                            handleChange("timezone", e.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="Asia/Dhaka (GMT+6)">
                            Asia/Dhaka (GMT+6)
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* MAINTENANCE MODE */}
                    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="block text-xs font-bold text-slate-800">
                          Maintenance Mode (মেইনটেনেন্স মোড)
                        </span>

                        <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                          Temporarily disable public access to the platform for
                          site maintenance.
                        </span>
                      </div>

                      <input
                        type="checkbox"
                        checked={formData.maintenance}
                        onChange={(e) =>
                          handleChange("maintenance", e.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                      />
                    </div>
                  </div>
                )}

                {/* ==================================================
                    PAYMENT
                ================================================== */}

                {activeTab === "payment" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Payment Gateway Settings
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure payment gateways and checkout payment methods.
                      </p>
                    </div>

                    {[
                      {
                        label: "bKash API",
                        keyField: "bkashApiKey" as const,
                        enabledField: "bkashEnabled" as const,
                      },
                      {
                        label: "Nagad API",
                        keyField: "nagadApiKey" as const,
                        enabledField: "nagadEnabled" as const,
                      },
                      {
                        label: "SSLCommerz / Visa",
                        keyField: "sslCommerzApiKey" as const,
                        enabledField: "sslCommerzEnabled" as const,
                      },
                    ].map((gateway) => (
                      <div
                        key={gateway.keyField}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            {gateway.label}
                          </span>

                          <div className="flex w-full items-center gap-3 sm:w-auto">
                            <input
                              type="password"
                              placeholder="API Key / Secret"
                              value={formData[gateway.keyField]}
                              onChange={(e) =>
                                handleChange(gateway.keyField, e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] outline-none focus:border-[#f59e0b] sm:w-56"
                            />

                            <input
                              type="checkbox"
                              checked={formData[gateway.enabledField]}
                              onChange={(e) =>
                                handleChange(
                                  gateway.enabledField,
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 shrink-0 cursor-pointer accent-[#f59e0b]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="text-xs font-bold text-slate-800">
                        Cash On Delivery (COD)
                      </span>

                      <input
                        type="checkbox"
                        checked={formData.codEnabled}
                        onChange={(e) =>
                          handleChange("codEnabled", e.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                      />
                    </div>
                  </div>
                )}

                {/* ==================================================
                    SHIPPING
                ================================================== */}

                {activeTab === "shipping" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Shipping & Delivery Settings
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure courier integration, delivery charges and
                        delivery thresholds.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Pathao / Steadfast API Key
                        </label>

                        <input
                          type="password"
                          placeholder="Enter courier API key"
                          value={formData.pathaoApiKey}
                          onChange={(e) =>
                            handleChange("pathaoApiKey", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Free Delivery Threshold
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={formData.freeDeliveryThreshold}
                          onChange={(e) =>
                            handleChange(
                              "freeDeliveryThreshold",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Standard Delivery Fee
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={formData.standardDeliveryFee}
                          onChange={(e) =>
                            handleChange(
                              "standardDeliveryFee",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Express Delivery Fee
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={formData.expressDeliveryFee}
                          onChange={(e) =>
                            handleChange(
                              "expressDeliveryFee",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Hyperlocal Radius Limit
                      </label>

                      <input
                        type="text"
                        value={`${formData.hyperlocalRadius} km (For Fresh/Perishable Goods)`}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs text-slate-500"
                      />
                    </div>
                  </div>
                )}

                {/* ==================================================
                    COMMISSION
                ================================================== */}

                {activeTab === "commission" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>Commission Settings</h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure default platform commission and vendor payout
                        limits.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Default Platform Commission (%)
                        </label>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.commissionRate}
                          onChange={(e) =>
                            handleChange(
                              "commissionRate",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Minimum Payout Limit
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={formData.minPayoutLimit}
                          onChange={(e) =>
                            handleChange(
                              "minPayoutLimit",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    RBAC
                ================================================== */}

                {activeTab === "rbac" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Role & Permission Management
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage access permissions for Admin, Vendor and Manager
                        roles.
                      </p>
                    </div>

                    {[
                      {
                        label: "Admin (Full Access)",
                        field: "admin" as const,
                      },
                      {
                        label: "Vendor (Category & Product Access)",
                        field: "vendor" as const,
                      },
                      {
                        label: "Manager (Limited Operations)",
                        field: "manager" as const,
                      },
                    ].map((role) => (
                      <div
                        key={role.field}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {role.label}
                        </span>

                        <input
                          type="checkbox"
                          checked={formData.permissions[role.field]}
                          onChange={(e) =>
                            handlePermissionChange(role.field, e.target.checked)
                          }
                          className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ==================================================
                    TAX
                ================================================== */}

                {activeTab === "tax" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>Tax & VAT Settings</h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage platform VAT registration and applicable VAT
                        percentage.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Company VAT Registration Number
                        </label>

                        <input
                          type="text"
                          value={formData.vatNumber}
                          onChange={(e) =>
                            handleChange("vatNumber", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          VAT Percentage
                        </label>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.vatPercentage}
                          onChange={(e) =>
                            handleChange(
                              "vatPercentage",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    NOTIFICATION
                ================================================== */}

                {activeTab === "notification" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Notification Settings
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Control important order, shipping and inventory
                        notifications.
                      </p>
                    </div>

                    {[
                      {
                        label: "Order Confirmation SMS/Email",
                        field: "orderNotification" as const,
                      },
                      {
                        label: "Shipping Status Update",
                        field: "shippingNotification" as const,
                      },
                      {
                        label: "Vendor Low Stock Alert",
                        field: "lowStockNotification" as const,
                      },
                    ].map((item) => (
                      <div
                        key={item.field}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <span className="text-xs font-semibold text-slate-800">
                          {item.label}
                        </span>

                        <input
                          type="checkbox"
                          checked={formData[item.field]}
                          onChange={(e) =>
                            handleChange(item.field, e.target.checked)
                          }
                          className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* ==================================================
                    LEGAL
                ================================================== */}

                {activeTab === "legal" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Legal & Policy Editor
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage the legal documents displayed on the platform.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Terms & Conditions
                      </label>

                      <textarea
                        rows={7}
                        value={formData.termsAndConditions}
                        onChange={(e) =>
                          handleChange("termsAndConditions", e.target.value)
                        }
                        className={`${inputClass} resize-y`}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Privacy Policy
                      </label>

                      <textarea
                        rows={7}
                        value={formData.privacyPolicy}
                        onChange={(e) =>
                          handleChange("privacyPolicy", e.target.value)
                        }
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>
                )}

                {/* ==================================================
                    SECURITY
                ================================================== */}

                {activeTab === "security" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>Security Settings</h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure authentication security and account session
                        limits.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="block text-xs font-bold text-slate-800">
                          Two-Factor Authentication
                        </span>

                        <span className="mt-1 block text-[11px] text-slate-500">
                          Add an extra security layer to admin login.
                        </span>
                      </div>

                      <input
                        type="checkbox"
                        checked={formData.twoFactorAuth}
                        onChange={(e) =>
                          handleChange("twoFactorAuth", e.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Session Timeout (Minutes)
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={formData.sessionTimeoutMins}
                          onChange={(e) =>
                            handleChange(
                              "sessionTimeoutMins",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Max Login Attempts
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={formData.maxLoginAttempts}
                          onChange={(e) =>
                            handleChange(
                              "maxLoginAttempts",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    OTP
                ================================================== */}

                {activeTab === "otp" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        OTP & SMTP Email Settings
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure email sender and OTP validity settings.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          SMTP Sender Email
                        </label>

                        <input
                          type="email"
                          value={formData.smtpSender}
                          onChange={(e) =>
                            handleChange("smtpSender", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          OTP Validity Time (Minutes)
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={formData.otpValidity}
                          onChange={(e) =>
                            handleChange("otpValidity", Number(e.target.value))
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    STORAGE
                ================================================== */}

                {activeTab === "storage" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Supabase Storage / Media Settings
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Configure upload size limits and allowed media file
                        types.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Max Upload File Size (MB)
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={formData.maxUploadSize}
                          onChange={(e) =>
                            handleChange(
                              "maxUploadSize",
                              Number(e.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                          Allowed File Types
                        </label>

                        <input
                          type="text"
                          value={formData.allowedFileTypes}
                          onChange={(e) =>
                            handleChange("allowedFileTypes", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    AUTHENTICATION
                ================================================== */}

                {activeTab === "auth" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className={sectionTitleClass}>
                        Authentication Settings
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage available login and account verification methods.
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="text-xs font-bold text-slate-800">
                        Google OAuth Login
                      </span>

                      <input
                        type="checkbox"
                        checked={formData.googleOAuth}
                        onChange={(e) =>
                          handleChange("googleOAuth", e.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="text-xs font-bold text-slate-800">
                        Email Confirmation Required
                      </span>

                      <input
                        type="checkbox"
                        checked={formData.emailConfirmation}
                        onChange={(e) =>
                          handleChange("emailConfirmation", e.target.checked)
                        }
                        className="h-4 w-4 cursor-pointer accent-[#f59e0b]"
                      />
                    </div>
                  </div>
                )}

                {/* ==================================================
                    SAVE
                ================================================== */}

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                  {savedMessage && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 sm:mr-auto">
                      <CheckCircle2 size={15} />
                      Changes saved successfully.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving || isLoading}
                    className="w-full rounded-xl bg-[#f59e0b] px-6 py-3 text-xs font-extrabold text-slate-950 shadow-md shadow-[#f59e0b]/20 transition hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
