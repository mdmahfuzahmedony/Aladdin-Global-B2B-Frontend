"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";

import {
  Store,
  Image as ImageIcon,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Truck,
  ShoppingCart,
  CreditCard,
  Power,
  Save,
  RotateCcw,
  Upload,
  CheckCircle2,
  Lock,
  AlertCircle,
  FileEdit,
  HardDrive,
  RefreshCw,
  FileText,
  ExternalLink,
  Loader2,
  XCircle,
  WifiOff,
} from "lucide-react";
import RequestStoreChangeModal from "./components/RequestStoreChangeModal";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";

const STORE_SETTINGS_URL = `${API_BASE_URL}/api/vendors/store/settings`;
const STORE_IMAGE_UPLOAD_URL = `${API_BASE_URL}/api/uploads/store-image`;

// ─── Types ────────────────────────────────────────────────────────────────────
type BackupRecord = {
  id: string;
  backupNumber: number;
  status:
    | "PENDING"
    | "SNAPSHOT_TAKEN"
    | "PDF_GENERATING"
    | "UPLOADING"
    | "VERIFYING"
    | "SUCCESS"
    | "FAILED";
  errorMessage?: string | null;
  retryCount: number;
  customerCount: number;
  productCount: number;
  customerPdfUrl?: string | null;
  productPdfUrl?: string | null;
  backupFolderName?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
};

type Day = {
  dayOfWeek: number;
  label: string;
  enabled: boolean;
  open: string;
  close: string;
};

type MediaType = "logo" | "banner";

export default function StoreSettingsPage() {
  const [supabase] = useState(() => createClient());

  const [storeName, setStoreName] = useState("Mizan Store");
  const [description, setDescription] = useState(
    "Quality products at affordable prices.",
  );
  const [phone, setPhone] = useState("01700000000");
  const [email, setEmail] = useState("store@example.com");

  const [division, setDivision] = useState("Khulna");
  const [district, setDistrict] = useState("Jashore");
  const [upazila, setUpazila] = useState("Jashore Sadar");
  const [area, setArea] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const [businessCategory, setBusinessCategory] = useState("Retail");
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");

  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [cityDeliveryCharge, setCityDeliveryCharge] = useState("60");
  const [outsideDeliveryCharge, setOutsideDeliveryCharge] = useState("120");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("2000");
  const [deliveryTime, setDeliveryTime] = useState("2-5 business days");

  const [acceptOrders, setAcceptOrders] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [minimumOrder, setMinimumOrder] = useState("200");

  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [onlinePayment, setOnlinePayment] = useState(true);

  const [storeActive, setStoreActive] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");

  // ─── Google Drive Backup State ────────────────────────────────────────────
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveEmail, setDriveEmail] = useState<string | null>(null);
  const [driveLoading, setDriveLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([]);
  const [backupHistoryLoading, setBackupHistoryLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const [showPhone, setShowPhone] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showAddress, setShowAddress] = useState(true);

  // Supabase public URLs after successful uploads.
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Local previews are only for display.
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Store Change Request state
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [pendingChangeRequest, setPendingChangeRequest] = useState<any | null>(
    null,
  );

  const loadChangeRequests = async () => {
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/api/vendors/store/change-request`,
        {
          method: "GET",
          headers: { ...authHeaders },
          cache: "no-store",
        },
      );
      const res = await response.json();
      if (res?.success) {
        setPendingChangeRequest(res.pendingRequest || null);
      }
    } catch {
      // Ignore
    }
  };

  const [days, setDays] = useState<Day[]>([
    {
      dayOfWeek: 6,
      label: "Saturday",
      enabled: true,
      open: "09:00",
      close: "18:00",
    },
    {
      dayOfWeek: 0,
      label: "Sunday",
      enabled: true,
      open: "09:00",
      close: "18:00",
    },
    {
      dayOfWeek: 1,
      label: "Monday",
      enabled: true,
      open: "09:00",
      close: "18:00",
    },
    {
      dayOfWeek: 2,
      label: "Tuesday",
      enabled: true,
      open: "09:00",
      close: "18:00",
    },
    {
      dayOfWeek: 3,
      label: "Wednesday",
      enabled: true,
      open: "09:00",
      close: "18:00",
    },
    {
      dayOfWeek: 4,
      label: "Thursday",
      enabled: true,
      open: "09:00",
      close: "18:00",
    },
    {
      dayOfWeek: 5,
      label: "Friday",
      enabled: false,
      open: "09:00",
      close: "18:00",
    },
  ]);

  // Get the current Supabase access token for protected API requests.
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (!session?.access_token) {
      throw new Error("Your session has expired. Please login again.");
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  };

  // ─── Google Drive functions ───────────────────────────────────────────────

  const loadDriveStatus = async () => {
    try {
      setDriveLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/vendor/google-drive/status`,
        {
          headers: authHeaders,
          cache: "no-store",
        },
      );
      const data = await res.json();
      if (data.success) {
        setDriveConnected(data.data?.connected ?? false);
        setDriveEmail(data.data?.email ?? null);
      }
    } catch {
      // ignore
    } finally {
      setDriveLoading(false);
    }
  };

  const loadBackupHistory = async () => {
    try {
      setBackupHistoryLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/vendor/backups`, {
        headers: authHeaders,
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) setBackupHistory(data.data ?? []);
    } catch {
      // ignore
    } finally {
      setBackupHistoryLoading(false);
    }
  };

  const connectGoogleDrive = async () => {
    try {
      setDriveLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/vendor/google-drive/auth-url`,
        {
          headers: authHeaders,
        },
      );
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch {
      alert("Failed to get Google auth URL. Please try again.");
    } finally {
      setDriveLoading(false);
    }
  };

  const disconnectGoogleDrive = async () => {
    if (
      !confirm(
        "Disconnect Google Drive? You won't be able to go offline until reconnected.",
      )
    )
      return;
    try {
      setDriveLoading(true);
      const authHeaders = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/api/vendor/google-drive/disconnect`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setDriveConnected(false);
      setDriveEmail(null);
    } catch {
      alert("Failed to disconnect. Please try again.");
    } finally {
      setDriveLoading(false);
    }
  };

  const retryBackupItem = async (backupId: string) => {
    try {
      const authHeaders = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/api/vendor/backups/${backupId}/retry`, {
        method: "POST",
        headers: authHeaders,
      });
      setTimeout(loadBackupHistory, 2000);
    } catch {
      alert("Retry failed.");
    }
  };

  // ─── Store Toggle — Backup first, then offline ────────────────────────────

  const handleStoreToggle = async (newActive: boolean) => {
    // Turning ON — simple
    if (newActive) {
      try {
        setToggleLoading(true);
        const authHeaders = await getAuthHeaders();
        const res = await fetch(
          `${API_BASE_URL}/api/vendor/settings/store-toggle`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...authHeaders },
            body: JSON.stringify({ active: true }),
          },
        );
        const data = await res.json();
        if (data.success) {
          setStoreActive(true);
        } else {
          alert(data.error || "Failed to turn store on.");
        }
      } catch {
        alert("Network error.");
      } finally {
        setToggleLoading(false);
      }
      return;
    }

    // Turning OFF — backup first
    if (!driveConnected) {
      alert(
        "⚠️ Please connect your Google Drive first.\nBackup is required before going offline.",
      );
      return;
    }

    if (
      !confirm(
        "Turn store offline?\n\nThis will:\n1. Take a full data snapshot\n2. Generate Customer & Product PDFs\n3. Upload to your Google Drive\n4. Then set store to Offline\n\nThis may take 1-2 minutes.",
      )
    )
      return;

    try {
      setToggleLoading(true);
      const authHeaders = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/vendor/settings/store-toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify({ active: false }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setStoreActive(false);
        alert("✅ Backup complete! Store is now offline.");
        loadBackupHistory();
      } else {
        alert(`❌ ${data.error || "Backup failed. Store remains online."}`);
      }
    } catch {
      alert("❌ Network error. Store remains online.");
    } finally {
      setToggleLoading(false);
    }
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load Drive status on mount
  useEffect(() => {
    loadDriveStatus();
    loadBackupHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load existing settings from the database.
  useEffect(() => {
    let active = true;

    const loadStoreSettings = async () => {
      try {
        const authHeaders = await getAuthHeaders();

        const response = await fetch(STORE_SETTINGS_URL, {
          method: "GET",
          headers: {
            ...authHeaders,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load store settings.");
        }

        const data = result.data;
        if (!data || !active) return;

        setStoreName(data.storeName ?? "");
        setDescription(data.description ?? "");
        setPhone(data.phone ?? "");
        setEmail(data.email ?? "");

        setDivision(data.location?.division ?? "");
        setDistrict(data.location?.district ?? "");
        setUpazila(data.location?.upazila ?? "");
        setArea(data.location?.area ?? "");
        setFullAddress(data.location?.fullAddress ?? "");

        setBusinessCategory(data.business?.businessCategory ?? "");
        setTradeLicenseNumber(data.business?.tradeLicenseNumber ?? "");
        setNidNumber(data.business?.nidNumber ?? "");
        setTaxIdentificationNumber(
          data.business?.taxIdentificationNumber ?? "",
        );

        setDeliveryAvailable(data.delivery?.deliveryAvailable ?? true);
        setCityDeliveryCharge(String(data.delivery?.cityDeliveryCharge ?? "0"));
        setOutsideDeliveryCharge(
          String(data.delivery?.outsideDeliveryCharge ?? "0"),
        );
        setFreeDeliveryThreshold(
          String(data.delivery?.freeDeliveryThreshold ?? "0"),
        );
        setDeliveryTime(data.delivery?.deliveryTime ?? "");

        setAcceptOrders(data.orders?.acceptOrders ?? true);
        setAutoConfirm(data.orders?.autoConfirm ?? false);
        setMinimumOrder(String(data.orders?.minimumOrder ?? "0"));

        setCashOnDelivery(data.payment?.cashOnDelivery ?? true);
        setOnlinePayment(data.payment?.onlinePayment ?? false);

        setStoreActive(data.status?.storeActive ?? true);
        setVacationMode(data.status?.vacationMode ?? false);
        setVacationStart(
          data.status?.vacationStart
            ? String(data.status.vacationStart).slice(0, 10)
            : "",
        );
        setVacationEnd(
          data.status?.vacationEnd
            ? String(data.status.vacationEnd).slice(0, 10)
            : "",
        );

        setShowPhone(data.visibility?.showPhone ?? true);
        setShowEmail(data.visibility?.showEmail ?? true);
        setShowAddress(data.visibility?.showAddress ?? true);

        setLogoUrl(data.logoUrl ?? null);
        setBannerUrl(data.bannerUrl ?? null);
        setLogoPreview(data.logoUrl ?? null);
        setBannerPreview(data.bannerUrl ?? null);

        if (Array.isArray(data.openingHours)) {
          setDays((currentDays) =>
            currentDays.map((day) => {
              const savedDay = data.openingHours.find(
                (item: {
                  dayOfWeek: number;
                  enabled: boolean;
                  open?: string | null;
                  close?: string | null;
                }) => item.dayOfWeek === day.dayOfWeek,
              );

              if (!savedDay) return day;

              return {
                ...day,
                enabled: savedDay.enabled,
                open: savedDay.open?.slice(0, 5) ?? "09:00",
                close: savedDay.close?.slice(0, 5) ?? "18:00",
              };
            }),
          );
        }
      } catch (error) {
        if (!active) return;

        console.error("Load store settings error:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Could not load store settings.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStoreSettings();
    void loadChangeRequests();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const updateDay = (
    dayOfWeek: number,
    field: "enabled" | "open" | "close",
    value: boolean | string,
  ) => {
    setDays((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day,
      ),
    );
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    type: MediaType,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PNG, JPG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be 5MB or less.");
      return;
    }

    const localPreview = URL.createObjectURL(file);

    if (type === "logo") {
      setLogoPreview(localPreview);
      setLogoUploading(true);
    } else {
      setBannerPreview(localPreview);
      setBannerUploading(true);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const authHeaders = await getAuthHeaders();

      const response = await fetch(STORE_IMAGE_UPLOAD_URL, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.message || "Image upload failed.");
      }

      // Save the public Supabase URL, not the temporary blob preview.
      if (type === "logo") {
        setLogoUrl(result.data.url);
        setLogoPreview(result.data.url);
      } else {
        setBannerUrl(result.data.url);
        setBannerPreview(result.data.url);
      }

      URL.revokeObjectURL(localPreview);
      alert(`${type === "logo" ? "Logo" : "Banner"} uploaded successfully.`);
    } catch (error) {
      console.error("Store image upload error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not upload image. Please try again.",
      );

      URL.revokeObjectURL(localPreview);

      if (type === "logo") {
        setLogoPreview(logoUrl);
      } else {
        setBannerPreview(bannerUrl);
      }
    } finally {
      if (type === "logo") {
        setLogoUploading(false);
      } else {
        setBannerUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (logoUploading || bannerUploading) {
      alert("Please wait until image uploads are complete.");
      return;
    }

    const storeSettings = {
      storeName,
      description,
      phone,
      email,
      location: {
        division,
        district,
        upazila,
        area,
        fullAddress,
      },
      business: {
        businessCategory,
        tradeLicenseNumber,
        nidNumber,
        taxIdentificationNumber,
      },
      openingHours: days.map(({ dayOfWeek, enabled, open, close }) => ({
        dayOfWeek,
        enabled,
        open: enabled ? open : null,
        close: enabled ? close : null,
      })),
      delivery: {
        deliveryAvailable,
        cityDeliveryCharge,
        outsideDeliveryCharge,
        freeDeliveryThreshold,
        deliveryTime,
      },
      orders: {
        acceptOrders,
        autoConfirm,
        minimumOrder,
      },
      payment: {
        cashOnDelivery,
        onlinePayment,
      },
      status: {
        storeActive,
        vacationMode,
        vacationStart: vacationMode ? vacationStart || null : null,
        vacationEnd: vacationMode ? vacationEnd || null : null,
      },
      visibility: {
        showPhone,
        showEmail,
        showAddress,
      },
      logoUrl,
      bannerUrl,
    };

    try {
      setSaving(true);

      const authHeaders = await getAuthHeaders();

      const response = await fetch(STORE_SETTINGS_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(storeSettings),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save store settings.");
      }

      alert("Store settings saved successfully.");
    } catch (error) {
      console.error("Save store settings error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Could not save settings. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#12233F]">
                Store Settings
              </h1>
              <p className="mt-0.5 text-[12px] leading-5 text-slate-500">
                Manage your store information, delivery, orders and business
                settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || logoUploading || bannerUploading || loading}
              className="flex h-9 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1b3156] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[12px] text-blue-700">
            Loading store settings...
          </div>
        )}

        <div className="space-y-5">
          {/* STORE INFORMATION + STATUS */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* STORE INFORMATION */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <SectionHeader
                  icon={<Store size={18} />}
                  title="Store Information"
                  description="দোকানের মূল পরিচিতি তথ্য যা ক্রেতারা দেখতে পাবেন।"
                />

                <button
                  type="button"
                  onClick={() => setIsChangeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-[#12233f] bg-white px-3.5 py-2 text-xs font-bold text-[#12233f] shadow-2xs transition hover:bg-[#12233f] hover:text-white active:scale-95"
                >
                  <FileEdit size={13} className="text-amber-500" />
                  <span>তথ্য পরিবর্তনের আবেদন</span>
                </button>
              </div>

              {/* PENDING CHANGE REQUEST BANNER */}
              {pendingChangeRequest && (
                <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Clock3 size={16} className="text-amber-600 shrink-0" />
                    <span>
                      আপনার একটি তথ্য পরিবর্তনের অনুরোধ অ্যাডমিন পর্যালোচনায়
                      রয়েছে
                    </span>
                  </div>
                  <p className="text-[11.5px] text-amber-800 leading-relaxed">
                    আপনার আবেদনের পরিপ্রেক্ষিতে অ্যাডমিন পর্যালোচনা করছেন।
                    অ্যাডমিন অনুমোদন দিলে আপনার তথ্য স্বয়ংক্রিয়ভাবে আপডেট হয়ে
                    যাবে।
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] pt-1.5 border-t border-amber-200/80">
                    {pendingChangeRequest.storeName && (
                      <span className="rounded-md bg-white px-2 py-0.5 border border-amber-200 text-slate-800">
                        নতুন স্টোর নাম: <b>{pendingChangeRequest.storeName}</b>
                      </span>
                    )}
                    {pendingChangeRequest.ownerName && (
                      <span className="rounded-md bg-white px-2 py-0.5 border border-amber-200 text-slate-800">
                        নতুন মালিক: <b>{pendingChangeRequest.ownerName}</b>
                      </span>
                    )}
                    {pendingChangeRequest.phone && (
                      <span className="rounded-md bg-white px-2 py-0.5 border border-amber-200 text-slate-800">
                        নতুন ফোন: <b>{pendingChangeRequest.phone}</b>
                      </span>
                    )}
                    {pendingChangeRequest.businessCategory && (
                      <span className="rounded-md bg-white px-2 py-0.5 border border-amber-200 text-slate-800">
                        নতুন ক্যাটাগরি:{" "}
                        <b>{pendingChangeRequest.businessCategory}</b>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InputField
                  label="Store Name"
                  value={storeName}
                  readOnly
                  badge={
                    <span
                      onClick={() => setIsChangeModalOpen(true)}
                      className="cursor-pointer text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold hover:bg-amber-100"
                    >
                      <Lock size={9} /> পরিবর্তন করতে আবেদন করুন
                    </span>
                  }
                  onLockedClick={() => setIsChangeModalOpen(true)}
                  placeholder="Enter store name"
                />

                <InputField
                  label="Store Phone"
                  value={phone}
                  readOnly
                  badge={
                    <span
                      onClick={() => setIsChangeModalOpen(true)}
                      className="cursor-pointer text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold hover:bg-amber-100"
                    >
                      <Lock size={9} /> পরিবর্তন করতে আবেদন করুন
                    </span>
                  }
                  onLockedClick={() => setIsChangeModalOpen(true)}
                  placeholder="Enter phone number"
                />

                <InputField
                  label="Store Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter store email"
                  type="email"
                />

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
                    Store Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe your store..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/10"
                  />
                </div>
              </div>

              {/* MEDIA */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3.5 flex items-center gap-2">
                  <ImageIcon size={17} className="text-slate-500" />
                  <h3 className="text-[13px] font-bold text-[#12233F]">
                    Store Media
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <MediaUpload
                    title="Store Logo"
                    description="Recommended: square image"
                    preview={logoPreview}
                    onChange={(e) => handleImageChange(e, "logo")}
                    type="logo"
                    uploading={logoUploading}
                  />

                  <MediaUpload
                    title="Store Banner"
                    description="Recommended: wide banner image"
                    preview={bannerPreview}
                    onChange={(e) => handleImageChange(e, "banner")}
                    type="banner"
                    uploading={bannerUploading}
                  />
                </div>
              </div>
            </section>

            {/* STORE STATUS */}
            {/* ─── Google Drive Backup Section ─────────────────────────── */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeader
                icon={<HardDrive size={18} />}
                title="Google Drive Backup"
                description="Connect your Google Drive. Backup is auto-created when you turn the store offline."
              />

              {/* Connection Status */}
              <div className="mt-5">
                {driveLoading ? (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4">
                    <Loader2
                      size={16}
                      className="animate-spin text-slate-400"
                    />
                    <span className="text-sm text-slate-500">
                      Checking Drive status...
                    </span>
                  </div>
                ) : driveConnected ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-emerald-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Google Drive Connected
                        </p>
                        <p className="text-xs text-emerald-700">{driveEmail}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={disconnectGoogleDrive}
                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-amber-50 p-4">
                    <div className="flex items-center gap-3">
                      <WifiOff size={20} className="shrink-0 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">
                          Not Connected
                        </p>
                        <p className="text-xs text-amber-700">
                          Connect to enable automatic backups when going
                          offline.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={connectGoogleDrive}
                      className="flex items-center gap-1.5 rounded-lg bg-[#12233F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a3460]"
                    >
                      <HardDrive size={13} />
                      Connect Drive
                    </button>
                  </div>
                )}
              </div>

              {/* Toggle loading indicator */}
              {toggleLoading && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                  <Loader2 size={18} className="animate-spin text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Backup in progress...
                    </p>
                    <p className="text-xs text-blue-600">
                      Creating PDF snapshots and uploading to your Drive. Please
                      wait.
                    </p>
                  </div>
                </div>
              )}

              {/* Backup History */}
              {backupHistory.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[13px] font-bold text-[#12233F]">
                      Backup History
                    </h3>
                    <button
                      type="button"
                      onClick={loadBackupHistory}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#12233F]"
                    >
                      <RefreshCw size={12} />
                      Refresh
                    </button>
                  </div>

                  {backupHistoryLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2
                        size={18}
                        className="animate-spin text-slate-400"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {backupHistory.slice(0, 5).map((backup) => (
                        <div
                          key={backup.id}
                          className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#12233F]">
                                Backup #
                                {String(backup.backupNumber).padStart(3, "0")}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  backup.status === "SUCCESS"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : backup.status === "FAILED"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {backup.status === "SUCCESS" ? (
                                  <CheckCircle2 size={9} />
                                ) : backup.status === "FAILED" ? (
                                  <XCircle size={9} />
                                ) : (
                                  <Loader2 size={9} className="animate-spin" />
                                )}
                                {backup.status}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {backup.customerCount} customers ·{" "}
                              {backup.productCount} products
                              {backup.completedAt &&
                                ` · ${new Date(backup.completedAt).toLocaleString("en-BD")}`}
                            </p>
                            {backup.errorMessage && (
                              <p className="mt-1 text-[10px] text-red-500">
                                {backup.errorMessage}
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {backup.status === "SUCCESS" && (
                              <>
                                {backup.customerPdfUrl && (
                                  <a
                                    href={backup.customerPdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                                  >
                                    <FileText size={11} />
                                    Customers
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                                {backup.productPdfUrl && (
                                  <a
                                    href={backup.productPdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                                  >
                                    <FileText size={11} />
                                    Products
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                              </>
                            )}
                            {backup.status === "FAILED" && (
                              <button
                                type="button"
                                onClick={() => retryBackupItem(backup.id)}
                                className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-600"
                              >
                                <RefreshCw size={11} />
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ─── Store Status ─────────────────────────────────────────── */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeader
                icon={<Power size={18} />}
                title="Store Status"
                description="Control whether customers can place orders."
              />

              <div className="mt-5 space-y-3">
                <ToggleRow
                  title="Store Active"
                  description="Customers can view and order from your store."
                  enabled={storeActive}
                  onChange={handleStoreToggle}
                />

                <ToggleRow
                  title="Vacation Mode"
                  description="Temporarily pause normal store operations."
                  enabled={vacationMode}
                  onChange={setVacationMode}
                />
              </div>

              {vacationMode && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InputField
                    label="Start Date"
                    type="date"
                    value={vacationStart}
                    onChange={setVacationStart}
                  />
                  <InputField
                    label="End Date"
                    type="date"
                    value={vacationEnd}
                    onChange={setVacationEnd}
                  />
                </div>
              )}

              <div className="mt-5 rounded-xl bg-emerald-50 p-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-emerald-800">
                      Store status
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                      {storeActive && !vacationMode
                        ? "Your store is currently accepting customers."
                        : "Your store is currently not accepting normal orders."}
                    </p>
                  </div>
                </div>
              </div>

              {/* VISIBILITY */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                <h3 className="mb-3.5 text-[13px] font-bold text-[#12233F]">
                  Customer Visibility
                </h3>

                <div className="space-y-3">
                  <ToggleRow
                    title="Show Phone"
                    description="Display your store phone to customers."
                    enabled={showPhone}
                    onChange={setShowPhone}
                  />
                  <ToggleRow
                    title="Show Email"
                    description="Display your store email to customers."
                    enabled={showEmail}
                    onChange={setShowEmail}
                  />
                  <ToggleRow
                    title="Show Address"
                    description="Display your store address publicly."
                    enabled={showAddress}
                    onChange={setShowAddress}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ADDRESS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeader
              icon={<MapPin size={18} />}
              title="Store Address"
              description="Set the physical location of your store."
            />

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InputField
                label="Division"
                value={division}
                onChange={setDivision}
                placeholder="Division"
              />
              <InputField
                label="District"
                value={district}
                onChange={setDistrict}
                placeholder="District"
              />
              <InputField
                label="Upazila"
                value={upazila}
                onChange={setUpazila}
                placeholder="Upazila"
              />
              <InputField
                label="Area"
                value={area}
                onChange={setArea}
                placeholder="Area"
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Full Address"
                value={fullAddress}
                onChange={setFullAddress}
                placeholder="House, road, market, landmark..."
              />
            </div>
          </section>

          {/* BUSINESS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <SectionHeader
                icon={<BriefcaseBusiness size={18} />}
                title="Business Information"
                description="Business and registration information for your store."
              />

              <button
                type="button"
                onClick={() => setIsChangeModalOpen(true)}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              >
                <Lock size={12} className="text-amber-500" />
                <span>পরিবর্তন করতে আবেদন করুন</span>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InputField
                label="Business Type"
                value={businessCategory}
                readOnly
                badge={
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <Lock size={9} /> নিবন্ধিত
                  </span>
                }
                onLockedClick={() => setIsChangeModalOpen(true)}
                placeholder="Retail / Wholesale"
              />
              <InputField
                label="Trade License Number"
                value={tradeLicenseNumber}
                readOnly
                badge={
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <Lock size={9} /> নিবন্ধিত
                  </span>
                }
                onLockedClick={() => setIsChangeModalOpen(true)}
                placeholder="Optional"
              />
              <InputField
                label="NID Number"
                value={nidNumber}
                readOnly
                badge={
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <Lock size={9} /> যাচাইকৃত
                  </span>
                }
                onLockedClick={() => setIsChangeModalOpen(true)}
                placeholder="Optional"
              />
              <InputField
                label="Tax / VAT Number"
                value={taxIdentificationNumber}
                readOnly
                badge={
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <Lock size={9} /> নিবন্ধিত
                  </span>
                }
                onLockedClick={() => setIsChangeModalOpen(true)}
                placeholder="Optional"
              />
            </div>
          </section>

          {/* OPENING HOURS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeader
              icon={<Clock3 size={18} />}
              title="Opening Hours"
              description="Set the days and hours when your store operates."
            />

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[1.3fr_100px_1fr_1fr] bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500 md:grid">
                <span>Day</span>
                <span>Status</span>
                <span>Opening</span>
                <span>Closing</span>
              </div>

              <div className="divide-y divide-slate-100">
                {days.map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className="grid grid-cols-1 gap-3 px-3.5 py-3.5 sm:px-4 md:grid-cols-[1.3fr_100px_1fr_1fr] md:items-center"
                  >
                    <p className="text-[13px] font-semibold leading-5 text-slate-700">
                      {day.label}
                    </p>

                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateDay(day.dayOfWeek, "enabled", !day.enabled)
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          day.enabled ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                        aria-label={`Toggle ${day.label}`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            day.enabled ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500 md:hidden">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        value={day.open}
                        disabled={!day.enabled}
                        onChange={(e) =>
                          updateDay(day.dayOfWeek, "open", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 px-2.5 text-[12px] text-slate-700 outline-none focus:border-[#D6A419] disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-slate-500 md:hidden">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        value={day.close}
                        disabled={!day.enabled}
                        onChange={(e) =>
                          updateDay(day.dayOfWeek, "close", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 px-2.5 text-[12px] text-slate-700 outline-none focus:border-[#D6A419] disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DELIVERY + ORDERS */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* DELIVERY */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeader
                icon={<Truck size={18} />}
                title="Delivery Settings"
                description="Configure your store delivery options."
              />

              <div className="mt-5 space-y-4">
                <ToggleRow
                  title="Delivery Available"
                  description="Allow customers to request delivery."
                  enabled={deliveryAvailable}
                  onChange={setDeliveryAvailable}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InputField
                    label="Inside City Charge"
                    value={cityDeliveryCharge}
                    onChange={setCityDeliveryCharge}
                    placeholder="60"
                    type="number"
                    prefix="৳"
                  />
                  <InputField
                    label="Outside City Charge"
                    value={outsideDeliveryCharge}
                    onChange={setOutsideDeliveryCharge}
                    placeholder="120"
                    type="number"
                    prefix="৳"
                  />
                  <InputField
                    label="Free Delivery Above"
                    value={freeDeliveryThreshold}
                    onChange={setFreeDeliveryThreshold}
                    placeholder="2000"
                    type="number"
                    prefix="৳"
                  />
                  <InputField
                    label="Estimated Delivery"
                    value={deliveryTime}
                    onChange={setDeliveryTime}
                    placeholder="2-5 business days"
                  />
                </div>
              </div>
            </section>

            {/* ORDERS */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <SectionHeader
                icon={<ShoppingCart size={18} />}
                title="Order Settings"
                description="Control how incoming orders are handled."
              />

              <div className="mt-5 space-y-4">
                <ToggleRow
                  title="Accept Orders"
                  description="Allow customers to place new orders."
                  enabled={acceptOrders}
                  onChange={setAcceptOrders}
                />
                <ToggleRow
                  title="Auto Confirm Orders"
                  description="Automatically confirm newly placed orders."
                  enabled={autoConfirm}
                  onChange={setAutoConfirm}
                />
                <InputField
                  label="Minimum Order Amount"
                  value={minimumOrder}
                  onChange={setMinimumOrder}
                  placeholder="200"
                  type="number"
                  prefix="৳"
                />
              </div>
            </section>
          </div>

          {/* PAYMENT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeader
              icon={<CreditCard size={18} />}
              title="Payment Settings"
              description="Choose which payment methods your store accepts."
            />

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <ToggleRow
                title="Cash on Delivery"
                description="Allow customers to pay when receiving the order."
                enabled={cashOnDelivery}
                onChange={setCashOnDelivery}
              />
              <ToggleRow
                title="Online Payment"
                description="Allow customers to pay through online payment methods."
                enabled={onlinePayment}
                onChange={setOnlinePayment}
              />
            </div>
          </section>

          {/* BOTTOM SAVE BAR */}
          <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#12233F]">
                Store settings
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                Make sure all information is correct before saving.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RotateCcw size={15} />
                Discard
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || logoUploading || bannerUploading || loading}
                className="flex h-9 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1b3156] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          <ConfirmModal
            isOpen={isResetModalOpen}
            onClose={() => setIsResetModalOpen(false)}
            onConfirm={() => window.location.reload()}
            title="পরিবর্তন বাতিল করতে চান?"
            description="আপনি কি নিশ্চিতভাবে আপনার সকল পরিবর্তন বাতিল করতে চান? পেজটি রিলোড হবে।"
            confirmText="হ্যাঁ, বাতিল করুন"
            cancelText="ফিরে যান"
            variant="warning"
          />

          <RequestStoreChangeModal
            isOpen={isChangeModalOpen}
            onClose={() => setIsChangeModalOpen(false)}
            currentData={{
              storeName,
              phone,
              businessCategory,
              tradeLicenseNumber,
              nidNumber,
              taxIdentificationNumber,
            }}
            onSuccess={() => {
              setRefreshTrigger((prev) => prev + 1);
              void loadChangeRequests();
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#12233F]">
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-[14px] font-bold leading-5 text-[#12233F]">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  readOnly = false,
  badge,
  onLockedClick,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  readOnly?: boolean;
  badge?: ReactNode;
  onLockedClick?: () => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-1.5">
        <label className="block text-[12px] font-semibold leading-5 text-slate-700">
          {label}
        </label>
        {badge}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onClick={readOnly && onLockedClick ? onLockedClick : undefined}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border text-[13px] outline-none transition placeholder:text-slate-400 ${
            readOnly
              ? "border-slate-200 bg-slate-50/80 text-slate-600 cursor-pointer hover:bg-slate-100"
              : "border-slate-200 bg-white text-slate-700 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/10"
          } ${prefix ? "pl-8 pr-3.5" : "px-3.5"}`}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold leading-5 text-slate-700">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-[18px] text-slate-500">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function MediaUpload({
  title,
  description,
  preview,
  onChange,
  type,
  uploading,
}: {
  title: string;
  description: string;
  preview: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type: "logo" | "banner";
  uploading: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2">
        <p className="text-[12px] font-semibold leading-5 text-slate-700">
          {title}
        </p>
        <p className="text-[11px] leading-4 text-slate-400">{description}</p>
      </div>

      <label
        className={`group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#D6A419] ${
          uploading ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt={title}
            className={`h-full w-full object-cover ${
              type === "logo" ? "object-contain p-4" : ""
            }`}
          />
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Upload size={17} />
            </div>
            <p className="text-[12px] font-semibold text-slate-600">
              Click to upload
            </p>
            <p className="mt-1 text-[10px] text-slate-400">PNG, JPG or WEBP</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[12px] font-semibold text-slate-700">
            Uploading...
          </div>
        )}

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
