"use client";

import React from "react";
import {
  Laptop,
  Server,
  KeyRound,
  Cpu,
  HardDrive,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";

export interface OperatingSystemsAttributes {
  osName?: string;
  edition?: string;
  licenseType?: string;
  architecture?: string;
  bitVersion?: string;
  minRamRequirement?: string;
  minStorageRequirement?: string;
  minProcessorRequirement?: string;
  activationMethod?: string;
  officialUpdatesSupported?: string;
  languageSupported?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function OperatingSystemsField({
  value = {},
  onChange,
  categoryName = "Operating Systems & Servers",
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
    "Microsoft Windows 11 Pro 64-bit Genuine Lifetime Retail License Key",
    "Microsoft Windows 10 Pro Genuine Digital License (Lifetime Binding)",
    "Windows Server 2022 Standard Edition (16 Core Genuine License)",
    "Red Hat Enterprise Linux (RHEL) Server Subscription",
    "Ubuntu Server & Cloud Optimized Enterprise Stack Setup",
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-500/20">
            <Server size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              অপারেটিং সিস্টেম ও সার্ভার স্পেসিফিকেশন (Operating Systems & Servers)
            </h4>
            <p className="text-[11px] text-slate-500">
              ক্যাটেগরি: <span className="font-medium text-sky-600">{categoryName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-sky-800">
          <Sparkles size={14} className="text-sky-600" />
          <span>জনপ্রিয় অপারেটিং সিস্টেম প্রিসেট:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => update("osName", p)}
              className="rounded-lg border border-sky-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-sky-900 transition hover:bg-sky-600 hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* OS Name */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            অপারেটিং সিস্টেমের নাম (OS / Server Name)
          </label>
          <input
            type="text"
            value={value.osName || ""}
            onChange={(e) => update("osName", e.target.value)}
            placeholder="e.g. Windows 11 Pro, Windows Server 2022, Red Hat Enterprise Linux"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Edition */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            এডিশন (Edition)
          </label>
          <select
            value={value.edition || ""}
            onChange={(e) => update("edition", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Professional (Pro)">Professional (Pro)</option>
            <option value="Home / Single Language">Home / Single Language</option>
            <option value="Enterprise Edition">Enterprise Edition</option>
            <option value="Server Standard (16 Core)">Server Standard (16 Core)</option>
            <option value="Server Datacenter (Unlimited VMs)">Server Datacenter (Unlimited VMs)</option>
            <option value="Workstation Edition">Workstation Edition</option>
          </select>
        </div>

        {/* License Type */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            লাইসেন্সের ধরন (License Type)
          </label>
          <select
            value={value.licenseType || ""}
            onChange={(e) => update("licenseType", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Genuine Retail License (Transferable)">Genuine Retail License (Transferable)</option>
            <option value="OEM Lifetime License (Motherboard Binding)">OEM Lifetime License (Motherboard Binding)</option>
            <option value="Volume Licensing (MAK / KMS)">Volume Licensing (MAK / KMS)</option>
            <option value="Official Subscription License">Official Subscription License</option>
          </select>
        </div>

        {/* Bit Architecture */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            আর্কিটেকচার (Architecture / Bits)
          </label>
          <select
            value={value.bitVersion || ""}
            onChange={(e) => update("bitVersion", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="64-Bit (x64) Optimized">64-Bit (x64) Optimized</option>
            <option value="32-Bit / 64-Bit Compatible">32-Bit / 64-Bit Compatible</option>
            <option value="ARM64 Supported">ARM64 Supported</option>
          </select>
        </div>

        {/* Activation Method */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            অ্যাক্টিভেশন মাধ্যম (Activation Method)
          </label>
          <select
            value={value.activationMethod || ""}
            onChange={(e) => update("activationMethod", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Instant Digital License Key (25-Digit Alpha-Numeric)">Instant Digital License Key (25-Digit Alpha-Numeric)</option>
            <option value="Microsoft Account Digital Entitlement">Microsoft Account Digital Entitlement</option>
            <option value="Retail Box with Bootable USB / DVD via Courier">Retail Box with Bootable USB / DVD via Courier</option>
          </select>
        </div>

        {/* Minimum RAM */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ন্যূনতম র‍্যাম রিকোয়ারমেন্ট (Min RAM)
          </label>
          <input
            type="text"
            value={value.minRamRequirement || ""}
            onChange={(e) => update("minRamRequirement", e.target.value)}
            placeholder="e.g. 4 GB for Windows 11, 2 GB for Windows 10, 8 GB for Server"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Minimum Storage */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ন্যূনতম স্টোরেজ (Min Storage Space)
          </label>
          <input
            type="text"
            value={value.minStorageRequirement || ""}
            onChange={(e) => update("minStorageRequirement", e.target.value)}
            placeholder="e.g. 64 GB SSD / HDD"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Official Updates */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            অফিশিয়াল আপডেট গ্যারান্টি (Vendor Updates)
          </label>
          <select
            value={value.officialUpdatesSupported || ""}
            onChange={(e) => update("officialUpdatesSupported", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="100% Genuine Official Microsoft Updates Supported">100% Genuine Official Microsoft Updates Supported</option>
            <option value="Lifetime Security & Feature Updates">Lifetime Security & Feature Updates</option>
          </select>
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
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
                  placeholder="ফিল্ডের নাম (e.g. TPM Requirement)"
                  className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. TPM 2.0 & Secure Boot Enabled)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500"
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
