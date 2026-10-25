"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Store,
  User,
  MapPin,
  ShieldCheck,
  CreditCard,
  Settings,
  Clock3,
} from "lucide-react";
import { createClient } from "../../../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type OpeningHour = {
  id?: string;
  dayOfWeek: number;
  enabled: boolean;
  open: string;
  close: string;
};

type VendorForm = {
  storeName: string;
  businessCategory: string;
  status: string;
  commissionRate: string;

  owner: {
    fullName: string;
    email: string;
    phone: string;
    status: string;
  };

  location: {
    division: string;
    district: string;
    upazila: string;
    area: string;
    fullAddress: string;
  };

  verification: {
    nidNumber: string;
    nidDocumentUrl: string;
    tradeLicenseNumber: string;
    tradeLicenseDocUrl: string;
    taxIdentificationNumber: string;
    tinDocUrl: string;
  };

  payout: {
    payoutMethod: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
    mobileBankingNumber: string;
  };

  settings: {
    description: string;
    phone: string;
    email: string;
    logoUrl: string;
    bannerUrl: string;

    delivery: {
      deliveryAvailable: boolean;
      cityDeliveryCharge: string;
      outsideDeliveryCharge: string;
      freeDeliveryThreshold: string;
      deliveryTime: string;
    };

    orders: {
      acceptOrders: boolean;
      autoConfirm: boolean;
      minimumOrder: string;
    };

    payment: {
      cashOnDelivery: boolean;
      onlinePayment: boolean;
    };

    status: {
      storeActive: boolean;
      vacationMode: boolean;
      vacationStart: string;
      vacationEnd: string;
    };

    visibility: {
      showPhone: boolean;
      showEmail: boolean;
      showAddress: boolean;
    };
  };

  openingHours: OpeningHour[];
};

const defaultOpeningHours: OpeningHour[] = [
  {
    dayOfWeek: 0,
    enabled: true,
    open: "09:00",
    close: "18:00",
  },
  {
    dayOfWeek: 1,
    enabled: true,
    open: "09:00",
    close: "18:00",
  },
  {
    dayOfWeek: 2,
    enabled: true,
    open: "09:00",
    close: "18:00",
  },
  {
    dayOfWeek: 3,
    enabled: true,
    open: "09:00",
    close: "18:00",
  },
  {
    dayOfWeek: 4,
    enabled: true,
    open: "09:00",
    close: "18:00",
  },
  {
    dayOfWeek: 5,
    enabled: true,
    open: "09:00",
    close: "18:00",
  },
  {
    dayOfWeek: 6,
    enabled: false,
    open: "09:00",
    close: "18:00",
  },
];

const emptyForm: VendorForm = {
  storeName: "",
  businessCategory: "",
  status: "PENDING",
  commissionRate: "0",

  owner: {
    fullName: "",
    email: "",
    phone: "",
    status: "ACTIVE",
  },

  location: {
    division: "",
    district: "",
    upazila: "",
    area: "",
    fullAddress: "",
  },

  verification: {
    nidNumber: "",
    nidDocumentUrl: "",
    tradeLicenseNumber: "",
    tradeLicenseDocUrl: "",
    taxIdentificationNumber: "",
    tinDocUrl: "",
  },

  payout: {
    payoutMethod: "BANK",
    bankName: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
    mobileBankingNumber: "",
  },

  settings: {
    description: "",
    phone: "",
    email: "",
    logoUrl: "",
    bannerUrl: "",

    delivery: {
      deliveryAvailable: true,
      cityDeliveryCharge: "0",
      outsideDeliveryCharge: "0",
      freeDeliveryThreshold: "0",
      deliveryTime: "",
    },

    orders: {
      acceptOrders: true,
      autoConfirm: false,
      minimumOrder: "0",
    },

    payment: {
      cashOnDelivery: true,
      onlinePayment: false,
    },

    status: {
      storeActive: true,
      vacationMode: false,
      vacationStart: "",
      vacationEnd: "",
    },

    visibility: {
      showPhone: true,
      showEmail: true,
      showAddress: true,
    },
  },

  openingHours: defaultOpeningHours,
};

const dayNames = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

export default function EditVendorPage() {
  const params = useParams();
  const router = useRouter();

  const vendorId = params?.vendorId as string;

  const [form, setForm] = useState<VendorForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!vendorId) return;

    fetchVendor();
  }, [vendorId]);

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token;
  };

  const fetchVendor = async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("আপনি লগইন করা নেই।");
      }

      const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Vendor তথ্য লোড করা যায়নি",
        );
      }

      const data = result.data;

      setForm({
        storeName: data.vendor?.storeName ?? "",
        businessCategory: data.vendor?.businessCategory ?? "",
        status: data.vendor?.status ?? "PENDING",
        commissionRate: data.vendor?.commissionRate?.toString() ?? "0",

        owner: {
          fullName: data.owner?.fullName ?? "",
          email: data.owner?.email ?? "",
          phone: data.owner?.phone ?? "",
          status: data.owner?.status ?? "ACTIVE",
        },

        location: {
          division: data.location?.division ?? "",
          district: data.location?.district ?? "",
          upazila: data.location?.upazila ?? "",
          area: data.location?.area ?? "",
          fullAddress: data.location?.fullAddress ?? "",
        },

        verification: {
          nidNumber: data.verification?.nidNumber ?? "",
          nidDocumentUrl: data.verification?.nidDocumentUrl ?? "",
          tradeLicenseNumber: data.verification?.tradeLicenseNumber ?? "",
          tradeLicenseDocUrl: data.verification?.tradeLicenseDocUrl ?? "",
          taxIdentificationNumber:
            data.verification?.taxIdentificationNumber ?? "",
          tinDocUrl: data.verification?.tinDocUrl ?? "",
        },

        payout: {
          payoutMethod: data.payout?.payoutMethod ?? "BANK",
          bankName: data.payout?.bankName ?? "",
          bankAccountNumber: data.payout?.bankAccountNumber ?? "",
          bankAccountHolder: data.payout?.bankAccountHolder ?? "",
          mobileBankingNumber: data.payout?.mobileBankingNumber ?? "",
        },

        settings: {
          description: data.settings?.description ?? "",
          phone: data.settings?.phone ?? "",
          email: data.settings?.email ?? "",
          logoUrl: data.settings?.logoUrl ?? "",
          bannerUrl: data.settings?.bannerUrl ?? "",

          delivery: {
            deliveryAvailable: data.settings?.deliveryAvailable ?? true,

            cityDeliveryCharge:
              data.settings?.cityDeliveryCharge?.toString() ?? "0",

            outsideDeliveryCharge:
              data.settings?.outsideDeliveryCharge?.toString() ?? "0",

            freeDeliveryThreshold:
              data.settings?.freeDeliveryThreshold?.toString() ?? "0",

            deliveryTime: data.settings?.deliveryTime ?? "",
          },

          orders: {
            acceptOrders: data.settings?.acceptOrders ?? true,

            autoConfirm: data.settings?.autoConfirm ?? false,

            minimumOrder: data.settings?.minimumOrder?.toString() ?? "0",
          },

          payment: {
            cashOnDelivery: data.settings?.cashOnDelivery ?? true,

            onlinePayment: data.settings?.onlinePayment ?? false,
          },

          status: {
            storeActive: data.settings?.storeActive ?? true,

            vacationMode: data.settings?.vacationMode ?? false,

            vacationStart: data.settings?.vacationStart
              ? String(data.settings.vacationStart).slice(0, 10)
              : "",

            vacationEnd: data.settings?.vacationEnd
              ? String(data.settings.vacationEnd).slice(0, 10)
              : "",
          },

          visibility: {
            showPhone: data.settings?.showPhone ?? true,

            showEmail: data.settings?.showEmail ?? true,

            showAddress: data.settings?.showAddress ?? true,
          },
        },

        openingHours:
          Array.isArray(data.openingHours) && data.openingHours.length > 0
            ? data.openingHours.map((hour: OpeningHour) => ({
                id: hour.id,
                dayOfWeek: Number(hour.dayOfWeek),
                enabled: Boolean(hour.enabled),
                open: hour.open ?? "",
                close: hour.close ?? "",
              }))
            : defaultOpeningHours,
      });
    } catch (err: any) {
      console.error("Fetch Vendor Error:", err);

      setError(err?.message || "Vendor তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof VendorForm, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateOwner = (field: keyof VendorForm["owner"], value: string) => {
    setForm((prev) => ({
      ...prev,
      owner: {
        ...prev.owner,
        [field]: value,
      },
    }));
  };

  const updateLocation = (
    field: keyof VendorForm["location"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const updateVerification = (
    field: keyof VendorForm["verification"],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      verification: {
        ...prev.verification,
        [field]: value,
      },
    }));
  };

  const updatePayout = (field: keyof VendorForm["payout"], value: string) => {
    setForm((prev) => ({
      ...prev,
      payout: {
        ...prev.payout,
        [field]: value,
      },
    }));
  };

  const updateSettings = (
    field: keyof Omit<
      VendorForm["settings"],
      "delivery" | "orders" | "payment" | "status" | "visibility"
    >,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const updateDelivery = (
    field: keyof VendorForm["settings"]["delivery"],
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        delivery: {
          ...prev.settings.delivery,
          [field]: value,
        },
      },
    }));
  };

  const updateOrders = (
    field: keyof VendorForm["settings"]["orders"],
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        orders: {
          ...prev.settings.orders,
          [field]: value,
        },
      },
    }));
  };

  const updatePayment = (
    field: keyof VendorForm["settings"]["payment"],
    value: boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        payment: {
          ...prev.settings.payment,
          [field]: value,
        },
      },
    }));
  };

  const updateStatus = (
    field: keyof VendorForm["settings"]["status"],
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        status: {
          ...prev.settings.status,
          [field]: value,
        },
      },
    }));
  };

  const updateVisibility = (
    field: keyof VendorForm["settings"]["visibility"],
    value: boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        visibility: {
          ...prev.settings.visibility,
          [field]: value,
        },
      },
    }));
  };

  const updateOpeningHour = (
    index: number,
    field: keyof OpeningHour,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      openingHours: prev.openingHours.map((hour, i) =>
        i === index
          ? {
              ...hour,
              [field]: value,
            }
          : hour,
      ),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("আপনি লগইন করা নেই।");
      }

      if (!form.storeName.trim()) {
        throw new Error("Store Name আবশ্যক।");
      }

      if (!form.owner.fullName.trim()) {
        throw new Error("Owner Name আবশ্যক।");
      }

      if (!form.verification.nidNumber.trim()) {
        throw new Error("NID Number আবশ্যক।");
      }

      if (!form.verification.nidDocumentUrl.trim()) {
        throw new Error("NID Document URL আবশ্যক।");
      }

      const payload = {
        storeName: form.storeName,
        businessCategory: form.businessCategory,
        status: form.status,
        commissionRate: Number(form.commissionRate) || 0,

        owner: {
          fullName: form.owner.fullName,
          email: form.owner.email,
          phone: form.owner.phone,
          status: form.owner.status,
        },

        location: {
          division: form.location.division,
          district: form.location.district,
          upazila: form.location.upazila,
          area: form.location.area,
          fullAddress: form.location.fullAddress,
        },

        verification: {
          nidNumber: form.verification.nidNumber,

          nidDocumentUrl: form.verification.nidDocumentUrl,

          tradeLicenseNumber: form.verification.tradeLicenseNumber,

          tradeLicenseDocUrl: form.verification.tradeLicenseDocUrl,

          taxIdentificationNumber: form.verification.taxIdentificationNumber,

          tinDocUrl: form.verification.tinDocUrl,
        },

        payout: {
          payoutMethod: form.payout.payoutMethod || "BANK",

          bankName: form.payout.bankName,

          bankAccountNumber: form.payout.bankAccountNumber,

          bankAccountHolder: form.payout.bankAccountHolder,

          mobileBankingNumber: form.payout.mobileBankingNumber,
        },

        settings: {
          description: form.settings.description,

          phone: form.settings.phone,

          email: form.settings.email,

          logoUrl: form.settings.logoUrl,

          bannerUrl: form.settings.bannerUrl,

          orders: {
            acceptOrders: form.settings.orders.acceptOrders,

            autoConfirm: form.settings.orders.autoConfirm,

            minimumOrder: Number(form.settings.orders.minimumOrder) || 0,
          },

          delivery: {
            deliveryAvailable: form.settings.delivery.deliveryAvailable,

            cityDeliveryCharge:
              Number(form.settings.delivery.cityDeliveryCharge) || 0,

            outsideDeliveryCharge:
              Number(form.settings.delivery.outsideDeliveryCharge) || 0,

            freeDeliveryThreshold:
              Number(form.settings.delivery.freeDeliveryThreshold) || 0,

            deliveryTime: form.settings.delivery.deliveryTime,
          },

          payment: {
            cashOnDelivery: form.settings.payment.cashOnDelivery,

            onlinePayment: form.settings.payment.onlinePayment,
          },

          status: {
            storeActive: form.settings.status.storeActive,

            vacationMode: form.settings.status.vacationMode,

            vacationStart: form.settings.status.vacationStart || null,

            vacationEnd: form.settings.status.vacationEnd || null,
          },

          visibility: {
            showPhone: form.settings.visibility.showPhone,

            showEmail: form.settings.visibility.showEmail,

            showAddress: form.settings.visibility.showAddress,
          },
        },

        openingHours: form.openingHours.map((hour) => ({
          dayOfWeek: Number(hour.dayOfWeek),
          enabled: Boolean(hour.enabled),
          open: hour.open,
          close: hour.close,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Vendor update করা যায়নি",
        );
      }

      setSuccess(result?.message || "Vendor successfully updated");

      await fetchVendor();
    } catch (err: any) {
      console.error("Update Vendor Error:", err);

      setError(err?.message || "Vendor update করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vendor তথ্য লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-[#12233F] p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/admin/vendors")}
              className="mb-3 flex items-center gap-2 text-sm text-slate-300 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Vendors
            </button>

            <h1 className="text-2xl font-bold">Edit Vendor</h1>

            <p className="mt-1 text-sm text-slate-300">
              Vendor profile, location, payout এবং store settings পরিবর্তন করুন
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#D6A419] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* BASIC VENDOR INFORMATION */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<Store className="text-[#D6A419]" />}
              title="Vendor Information"
              description="Basic vendor/store information"
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Store Name"
                value={form.storeName}
                onChange={(value) => updateField("storeName", value)}
              />

              <Input
                label="Business Category"
                value={form.businessCategory}
                onChange={(value) => updateField("businessCategory", value)}
              />

              <Input
                label="Commission Rate"
                type="number"
                value={form.commissionRate}
                onChange={(value) => updateField("commissionRate", value)}
              />

              <Select
                label="Vendor Status"
                value={form.status}
                onChange={(value) => updateField("status", value)}
                options={[
                  {
                    label: "Pending",
                    value: "PENDING",
                  },
                  {
                    label: "Approved",
                    value: "APPROVED",
                  },
                  {
                    label: "Rejected",
                    value: "REJECTED",
                  },
                  {
                    label: "Suspended",
                    value: "SUSPENDED",
                  },
                ]}
              />
            </div>
          </section>

          {/* OWNER */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<User className="text-[#D6A419]" />}
              title="Owner Information"
              description="Vendor account owner"
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Full Name"
                value={form.owner.fullName}
                onChange={(value) => updateOwner("fullName", value)}
              />

              <Input
                label="Email"
                type="email"
                value={form.owner.email}
                onChange={(value) => updateOwner("email", value)}
              />

              <Input
                label="Phone"
                value={form.owner.phone}
                onChange={(value) => updateOwner("phone", value)}
              />

              <Select
                label="User Status"
                value={form.owner.status}
                onChange={(value) => updateOwner("status", value)}
                options={[
                  {
                    label: "Active",
                    value: "ACTIVE",
                  },
                  {
                    label: "Suspended",
                    value: "SUSPENDED",
                  },
                  {
                    label: "Banned",
                    value: "BANNED",
                  },
                  {
                    label: "Pending",
                    value: "PENDING",
                  },
                ]}
              />
            </div>
          </section>

          {/* LOCATION */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<MapPin className="text-[#D6A419]" />}
              title="Location"
              description="Vendor business location"
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Division"
                value={form.location.division}
                onChange={(value) => updateLocation("division", value)}
              />

              <Input
                label="District"
                value={form.location.district}
                onChange={(value) => updateLocation("district", value)}
              />

              <Input
                label="Upazila"
                value={form.location.upazila}
                onChange={(value) => updateLocation("upazila", value)}
              />

              <Input
                label="Area"
                value={form.location.area}
                onChange={(value) => updateLocation("area", value)}
              />

              <div className="md:col-span-2 lg:col-span-4">
                <TextArea
                  label="Full Address"
                  value={form.location.fullAddress}
                  onChange={(value) => updateLocation("fullAddress", value)}
                />
              </div>
            </div>
          </section>

          {/* VERIFICATION */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<ShieldCheck className="text-[#D6A419]" />}
              title="Verification"
              description="Vendor verification documents"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="NID Number"
                value={form.verification.nidNumber}
                onChange={(value) => updateVerification("nidNumber", value)}
              />

              <Input
                label="NID Document URL"
                value={form.verification.nidDocumentUrl}
                onChange={(value) =>
                  updateVerification("nidDocumentUrl", value)
                }
              />

              <Input
                label="Trade License Number"
                value={form.verification.tradeLicenseNumber}
                onChange={(value) =>
                  updateVerification("tradeLicenseNumber", value)
                }
              />

              <Input
                label="Trade License Document URL"
                value={form.verification.tradeLicenseDocUrl}
                onChange={(value) =>
                  updateVerification("tradeLicenseDocUrl", value)
                }
              />

              <Input
                label="TIN Number"
                value={form.verification.taxIdentificationNumber}
                onChange={(value) =>
                  updateVerification("taxIdentificationNumber", value)
                }
              />

              <Input
                label="TIN Document URL"
                value={form.verification.tinDocUrl}
                onChange={(value) => updateVerification("tinDocUrl", value)}
              />
            </div>
          </section>

          {/* PAYOUT */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<CreditCard className="text-[#D6A419]" />}
              title="Payout"
              description="Vendor payment information"
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Select
                label="Payout Method"
                value={form.payout.payoutMethod}
                onChange={(value) => updatePayout("payoutMethod", value)}
                options={[
                  {
                    label: "Bank",
                    value: "BANK",
                  },
                  {
                    label: "bKash",
                    value: "BKASH",
                  },
                  {
                    label: "Nagad",
                    value: "NAGAD",
                  },
                ]}
              />

              <Input
                label="Bank Name"
                value={form.payout.bankName}
                onChange={(value) => updatePayout("bankName", value)}
              />

              <Input
                label="Bank Account Number"
                value={form.payout.bankAccountNumber}
                onChange={(value) => updatePayout("bankAccountNumber", value)}
              />

              <Input
                label="Account Holder"
                value={form.payout.bankAccountHolder}
                onChange={(value) => updatePayout("bankAccountHolder", value)}
              />

              <Input
                label="Mobile Banking Number"
                value={form.payout.mobileBankingNumber}
                onChange={(value) => updatePayout("mobileBankingNumber", value)}
              />
            </div>
          </section>

          {/* STORE SETTINGS */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<Settings className="text-[#D6A419]" />}
              title="Store Settings"
              description="Store configuration"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextArea
                label="Description"
                value={form.settings.description}
                onChange={(value) => updateSettings("description", value)}
              />

              <div className="grid gap-5">
                <Input
                  label="Store Phone"
                  value={form.settings.phone}
                  onChange={(value) => updateSettings("phone", value)}
                />

                <Input
                  label="Store Email"
                  type="email"
                  value={form.settings.email}
                  onChange={(value) => updateSettings("email", value)}
                />
              </div>

              <Input
                label="Logo URL"
                value={form.settings.logoUrl}
                onChange={(value) => updateSettings("logoUrl", value)}
              />

              <Input
                label="Banner URL"
                value={form.settings.bannerUrl}
                onChange={(value) => updateSettings("bannerUrl", value)}
              />
            </div>
          </section>

          {/* DELIVERY */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-[#12233F]">
              Delivery Settings
            </h2>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Toggle
                label="Delivery Available"
                checked={form.settings.delivery.deliveryAvailable}
                onChange={(value) => updateDelivery("deliveryAvailable", value)}
              />

              <Input
                label="City Delivery Charge"
                type="number"
                value={form.settings.delivery.cityDeliveryCharge}
                onChange={(value) =>
                  updateDelivery("cityDeliveryCharge", value)
                }
              />

              <Input
                label="Outside City Charge"
                type="number"
                value={form.settings.delivery.outsideDeliveryCharge}
                onChange={(value) =>
                  updateDelivery("outsideDeliveryCharge", value)
                }
              />

              <Input
                label="Free Delivery Threshold"
                type="number"
                value={form.settings.delivery.freeDeliveryThreshold}
                onChange={(value) =>
                  updateDelivery("freeDeliveryThreshold", value)
                }
              />

              <Input
                label="Delivery Time"
                value={form.settings.delivery.deliveryTime}
                onChange={(value) => updateDelivery("deliveryTime", value)}
              />
            </div>
          </section>

          {/* ORDERS & PAYMENT */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-[#12233F]">
              Orders & Payment
            </h2>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Toggle
                label="Accept Orders"
                checked={form.settings.orders.acceptOrders}
                onChange={(value) => updateOrders("acceptOrders", value)}
              />

              <Toggle
                label="Auto Confirm"
                checked={form.settings.orders.autoConfirm}
                onChange={(value) => updateOrders("autoConfirm", value)}
              />

              <Input
                label="Minimum Order"
                type="number"
                value={form.settings.orders.minimumOrder}
                onChange={(value) => updateOrders("minimumOrder", value)}
              />

              <Toggle
                label="Cash On Delivery"
                checked={form.settings.payment.cashOnDelivery}
                onChange={(value) => updatePayment("cashOnDelivery", value)}
              />

              <Toggle
                label="Online Payment"
                checked={form.settings.payment.onlinePayment}
                onChange={(value) => updatePayment("onlinePayment", value)}
              />
            </div>
          </section>

          {/* STORE STATUS */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-[#12233F]">
              Store Status & Visibility
            </h2>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Toggle
                label="Store Active"
                checked={form.settings.status.storeActive}
                onChange={(value) => updateStatus("storeActive", value)}
              />

              <Toggle
                label="Vacation Mode"
                checked={form.settings.status.vacationMode}
                onChange={(value) => updateStatus("vacationMode", value)}
              />

              <Input
                label="Vacation Start"
                type="date"
                value={form.settings.status.vacationStart}
                onChange={(value) => updateStatus("vacationStart", value)}
              />

              <Input
                label="Vacation End"
                type="date"
                value={form.settings.status.vacationEnd}
                onChange={(value) => updateStatus("vacationEnd", value)}
              />

              <Toggle
                label="Show Phone"
                checked={form.settings.visibility.showPhone}
                onChange={(value) => updateVisibility("showPhone", value)}
              />

              <Toggle
                label="Show Email"
                checked={form.settings.visibility.showEmail}
                onChange={(value) => updateVisibility("showEmail", value)}
              />

              <Toggle
                label="Show Address"
                checked={form.settings.visibility.showAddress}
                onChange={(value) => updateVisibility("showAddress", value)}
              />
            </div>
          </section>

          {/* OPENING HOURS */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <SectionTitle
              icon={<Clock3 className="text-[#D6A419]" />}
              title="Opening Hours"
              description="Store weekly opening schedule"
            />

            <div className="space-y-3">
              {form.openingHours.map((hour, index) => (
                <div
                  key={hour.dayOfWeek}
                  className="grid items-center gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-4"
                >
                  <div className="font-medium text-slate-700">
                    {dayNames[hour.dayOfWeek] ?? `Day ${hour.dayOfWeek}`}
                  </div>

                  <Toggle
                    label="Enabled"
                    checked={hour.enabled}
                    onChange={(value) =>
                      updateOpeningHour(index, "enabled", value)
                    }
                  />

                  <Input
                    label="Open"
                    type="time"
                    value={hour.open}
                    disabled={!hour.enabled}
                    onChange={(value) =>
                      updateOpeningHour(index, "open", value)
                    }
                  />

                  <Input
                    label="Close"
                    type="time"
                    value={hour.close}
                    disabled={!hour.enabled}
                    onChange={(value) =>
                      updateOpeningHour(index, "close", value)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* BOTTOM SAVE */}
          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() => router.push("/admin/vendors")}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-[#12233F] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SMALL FORM COMPONENTS
===================================================== */

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon}

      <div>
        <h2 className="text-lg font-bold text-[#12233F]">{title}</h2>

        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419] disabled:bg-slate-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-[#D6A419]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
