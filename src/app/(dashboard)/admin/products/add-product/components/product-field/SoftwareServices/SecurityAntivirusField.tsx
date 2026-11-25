"use client";

import React from "react";
import {
  ShieldCheck,
  KeyRound,
  Laptop,
  Globe,
  Sparkles,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";

export interface SecurityAntivirusAttributes {
  securityProductType?: string;
  brandMaker?: string;
  deviceCoverage?: string;
  validityPeriod?: string;
  activationMethod?: string;
  osCompatibility?: string;
  securityFeatures?: string;
  regionLock?: string;
  cloudBackupStorage?: string;
  vpnBandwidth?: string;
  officialSupport?: string;
  downloadUrl?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function SecurityAntivirusField({
  value = {},
  onChange,
  categoryName = "Antivirus & Security",
}: Props) {
  const update = (key: string, v: any) => {
    onChange({ ...value, [key]: v });
  };

  const customSpecs: Array<{ id: string; label: string; value: string }> =
    Array.isArray(value.customSpecs) ? value.customSpecs : [];

  const handleAddCustomSpec = () => {
    const newSpec = {
      id: `spec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: "",
      value: "",
    };
    onChange({
      ...value,
      customSpecs: [...customSpecs, newSpec],
    });
  };

  const handleUpdateCustomSpec = (
    id: string,
    field: "label" | "value",
    val: string
  ) => {
    const updated = customSpecs.map((s) =>
      s.id === id ? { ...s, [field]: val } : s
    );
    onChange({ ...value, customSpecs: updated });
  };

  const handleRemoveCustomSpec = (id: string) => {
    const filtered = customSpecs.filter((s) => s.id !== id);
    onChange({ ...value, customSpecs: filtered });
  };

  const presets = [
    "Kaspersky Total Security / Plus (1 Device / 1 Year Genuine Global Key)",
    "ESET Internet Security (3 Devices / 1 Year Full Threat Protection)",
    "Bitdefender Total Security Multi-Device (5 Devices / 2 Years)",
    "Norton 360 Deluxe with Secure VPN & Dark Web Monitoring",
    "ExpressVPN / NordVPN Premium Subscription (Annual High-Speed Server)",
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              অ্যান্টিভাইরাস ও সাইবার সিকিউরিটি স্পেসিফিকেশন (Antivirus & Security)
            </h4>
            <p className="text-[11px] text-slate-500">
              ক্যাটেগরি: <span className="font-medium text-emerald-600">{categoryName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <Sparkles size={14} className="text-emerald-600" />
          <span>জনপ্রিয় অ্যান্টিভাইরাস ও সিকিউরিটি প্রিসেট:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => update("securityProductType", p)}
              className="rounded-lg border border-emerald-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-emerald-900 transition hover:bg-emerald-600 hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Security Product Type */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            সিকিউরিটি প্রোডাক্টের ধরন বা নাম (Security Product Name)
          </label>
          <input
            type="text"
            value={value.securityProductType || ""}
            onChange={(e) => update("securityProductType", e.target.value)}
            placeholder="e.g. Internet Security, Total Security, Endpoint Protection, VPN"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ব্র্যান্ড বা ভেন্ডর (Brand / Maker)
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Kaspersky, ESET, Bitdefender, Norton, McAfee"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Device Coverage */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ডিভাইস সংখ্যা (Device Coverage)
          </label>
          <select
            value={value.deviceCoverage || ""}
            onChange={(e) => update("deviceCoverage", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="1 Device (1 PC / Mac)">1 Device (1 PC / Mac)</option>
            <option value="3 Devices (Multi-Device)">3 Devices (Multi-Device)</option>
            <option value="5 Devices (Family Pack)">5 Devices (Family Pack)</option>
            <option value="10 Devices (Small Business)">10 Devices (Small Business)</option>
            <option value="Unlimited / Server License">Unlimited / Server License</option>
          </select>
        </div>

        {/* Validity Period */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            মেয়াদকাল (Validity Period)
          </label>
          <select
            value={value.validityPeriod || ""}
            onChange={(e) => update("validityPeriod", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="1 Year (৩৬৫ দিন)">1 Year (৩৬৫ দিন)</option>
            <option value="2 Years (৭৩০ দিন)">2 Years (৭৩০ দিন)</option>
            <option value="3 Years">3 Years</option>
            <option value="Lifetime Activation">Lifetime Activation</option>
            <option value="Monthly Subscription">Monthly Subscription</option>
          </select>
        </div>

        {/* Activation Method */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            অ্যাক্টিভেশন ও ডেলিভারি মাধ্যম (Activation Method)
          </label>
          <select
            value={value.activationMethod || ""}
            onChange={(e) => update("activationMethod", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Instant Digital License Key (Email / Dashboard)">Instant Digital License Key (Email / Dashboard)</option>
            <option value="Official Online Account Activation">Official Online Account Activation</option>
            <option value="Scratch Card / Retail Box Pack (Courier Delivery)">Scratch Card / Retail Box Pack (Courier Delivery)</option>
          </select>
        </div>

        {/* OS Compatibility */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সাপোর্টেড অপারেটিং সিস্টেম (OS Compatibility)
          </label>
          <input
            type="text"
            value={value.osCompatibility || ""}
            onChange={(e) => update("osCompatibility", e.target.value)}
            placeholder="e.g. Windows 11/10, macOS, Android, iOS"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Region Lock */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            অঞ্চল বা রিজিয়ন লক (Region / Geo-Lock)
          </label>
          <select
            value={value.regionLock || ""}
            onChange={(e) => update("regionLock", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Global Key (Works Worldwide)">Global Key (Works Worldwide)</option>
            <option value="Bangladesh / South Asia Region Key">Bangladesh / South Asia Region Key</option>
            <option value="No VPN Needed for Activation">No VPN Needed for Activation</option>
          </select>
        </div>

        {/* Security Features */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            মূল সিকিউরিটি ফিচারসমূহ (Key Security Features)
          </label>
          <input
            type="text"
            value={value.securityFeatures || ""}
            onChange={(e) => update("securityFeatures", e.target.value)}
            placeholder="e.g. Real-Time Antivirus, Anti-Ransomware, Firewall, Phishing Protection, Safe Banking"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Official Support */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            অফিশিয়াল সাপোর্ট গ্যারান্টি (Official Support)
          </label>
          <input
            type="text"
            value={value.officialSupport || ""}
            onChange={(e) => update("officialSupport", e.target.value)}
            placeholder="e.g. 100% Genuine Official License with Vendor Warranty"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Dynamic Custom Specifications */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Specifications)
            </h5>
            <p className="text-[10px] text-slate-500">
              প্রয়োজনে আরও নতুন ফিল্ড যোগ করতে পারেন
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={13} />
            ফিল্ড যোগ করুন
          </button>
        </div>

        {customSpecs.length > 0 && (
          <div className="space-y-2">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  placeholder="ফিল্ডের নাম (e.g. Password Vault)"
                  className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. Unlimited Password Storage Included)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
