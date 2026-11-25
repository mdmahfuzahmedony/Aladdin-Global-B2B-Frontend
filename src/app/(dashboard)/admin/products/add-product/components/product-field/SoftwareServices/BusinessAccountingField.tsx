"use client";

import React from "react";
import {
  Briefcase,
  KeyRound,
  Laptop,
  Layers,
  Sparkles,
  Server,
  Headphones,
  Globe,
  Plus,
  Trash2,
  FileCheck,
} from "lucide-react";

export interface BusinessAccountingAttributes {
  softwareType?: string;
  licenseType?: string;
  edition?: string;
  deploymentPlatform?: string;
  deliveryMethod?: string;
  databaseSupported?: string;
  userCapacity?: string;
  multiBranchSupport?: string;
  offlineSupport?: string;
  supportDuration?: string;
  demoUrl?: string;
  documentationUrl?: string;
  setupAssistance?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function BusinessAccountingField({
  value = {},
  onChange,
  categoryName = "Small-Medium Business Software & Accounting",
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
    "Aladin Cloud POS & Inventory Management Software (Multi-Branch, Offline Sync)",
    "Standard ERP & Accounting Software (VAT, Tax & Bangladesh NBR Compliant)",
    "Pharmacy & Healthcare Management System (Invoice, Batch, Expiry Alert)",
    "Restaurant & Cafe Management POS (Kitchen Display System, QR Menu, VAT)",
    "Real Estate & Property Management CRM System (Lease, Installment & Dues)",
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
            <Briefcase size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              ব্যবসায়িক ও একাউন্টিং সফটওয়্যার স্পেসিফিকেশন (Business & Accounting Software)
            </h4>
            <p className="text-[11px] text-slate-500">
              ক্যাটেগরি: <span className="font-medium text-blue-600">{categoryName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-blue-800">
          <Sparkles size={14} className="text-blue-600" />
          <span>জনপ্রিয় সফটওয়্যার প্রিসেট (ক্লিক করে অটো-ফিল করুন):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => update("softwareType", p)}
              className="rounded-lg border border-blue-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-blue-900 transition hover:bg-blue-600 hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Software Type */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            সফটওয়্যারের ধরন বা শিরোনাম (Software Type / Title)
          </label>
          <input
            type="text"
            value={value.softwareType || ""}
            onChange={(e) => update("softwareType", e.target.value)}
            placeholder="e.g. Cloud ERP, POS, Accounting Software, Inventory Management"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* License Type */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            লাইসেন্সের ধরন (License Type)
          </label>
          <select
            value={value.licenseType || ""}
            onChange={(e) => update("licenseType", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Lifetime License (এককালীন লাইসেন্স)">Lifetime License (এককালীন লাইসেন্স)</option>
            <option value="Yearly Subscription (বার্ষিক সাবস্ক্রিপশন)">Yearly Subscription (বার্ষিক সাবস্ক্রিপশন)</option>
            <option value="Monthly SaaS (মাসিক ক্লাউড)">Monthly SaaS (মাসিক ক্লাউড)</option>
            <option value="Per User / Per PC License">Per User / Per PC License</option>
            <option value="100% Full Source Code (সোর্স কোড সহ)">100% Full Source Code (সোর্স কোড সহ)</option>
          </select>
        </div>

        {/* Edition / Version */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            এডিশন বা সংস্করণ (Edition / Version)
          </label>
          <select
            value={value.edition || ""}
            onChange={(e) => update("edition", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Standard Edition">Standard Edition</option>
            <option value="Professional (Pro)">Professional (Pro)</option>
            <option value="Enterprise Edition">Enterprise Edition</option>
            <option value="Ultimate / Unlimited">Ultimate / Unlimited</option>
            <option value="Community / Starter">Community / Starter</option>
          </select>
        </div>

        {/* Deployment Platform */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            প্ল্যাটফর্ম বা ওএস (Platform / OS)
          </label>
          <select
            value={value.deploymentPlatform || ""}
            onChange={(e) => update("deploymentPlatform", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Web & Cloud Based (যে কোনো ব্রাউজার)">Web & Cloud Based (যে কোনো ব্রাউজার)</option>
            <option value="Windows Desktop (7/10/11)">Windows Desktop (7/10/11)</option>
            <option value="Cross-Platform (Windows, Mac, Web, Mobile)">Cross-Platform (Windows, Mac, Web, Mobile)</option>
            <option value="Android POS & Mobile App">Android POS & Mobile App</option>
            <option value="Linux / Self-Hosted Server">Linux / Self-Hosted Server</option>
          </select>
        </div>

        {/* Delivery Method */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ডেলিভারির মাধ্যম (Delivery Method)
          </label>
          <select
            value={value.deliveryMethod || ""}
            onChange={(e) => update("deliveryMethod", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Instant Digital License Key & Download">Instant Digital License Key & Download</option>
            <option value="Cloud Account Credentials via Email / SMS">Cloud Account Credentials via Email / SMS</option>
            <option value="Direct Remote Installation by Engineer">Direct Remote Installation by Engineer</option>
            <option value="Pen Drive / CD Box Pack via Courier">Pen Drive / CD Box Pack via Courier</option>
          </select>
        </div>

        {/* User Capacity */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ইউজার ক্যাপাসিটি (User / PC Limit)
          </label>
          <input
            type="text"
            value={value.userCapacity || ""}
            onChange={(e) => update("userCapacity", e.target.value)}
            placeholder="e.g. Single User, 5 Users, Unlimited Users"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Multi-Branch Support */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            মাল্টি-ব্রাঞ্চ সাপোর্ট (Multi-Branch)
          </label>
          <select
            value={value.multiBranchSupport || ""}
            onChange={(e) => update("multiBranchSupport", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Yes - Unlimited Branches Supported">Yes - Unlimited Branches Supported</option>
            <option value="Yes - Up to 5 Branches">Yes - Up to 5 Branches</option>
            <option value="Single Branch / Outlet Only">Single Branch / Outlet Only</option>
          </select>
        </div>

        {/* Offline Support */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ইন্টারনেট ছাড়া চলবে? (Offline Support)
          </label>
          <select
            value={value.offlineSupport || ""}
            onChange={(e) => update("offlineSupport", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="100% Offline Capable (No Internet Needed)">100% Offline Capable (No Internet Needed)</option>
            <option value="Offline POS with Cloud Auto-Sync">Offline POS with Cloud Auto-Sync</option>
            <option value="Cloud Only (Active Internet Required)">Cloud Only (Active Internet Required)</option>
          </select>
        </div>

        {/* Support & Updates */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সাপোর্ট ও আপডেট মেয়াদ (Support Duration)
          </label>
          <select
            value={value.supportDuration || ""}
            onChange={(e) => update("supportDuration", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Lifetime Free Updates & Support">Lifetime Free Updates & Support</option>
            <option value="1 Year Free Technical Support & Updates">1 Year Free Technical Support & Updates</option>
            <option value="6 Months Free Support">6 Months Free Support</option>
            <option value="3 Months Free Support">3 Months Free Support</option>
          </select>
        </div>

        {/* Database Supported */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ডাটাবেস টেকনোলজি (Database)
          </label>
          <input
            type="text"
            value={value.databaseSupported || ""}
            onChange={(e) => update("databaseSupported", e.target.value)}
            placeholder="e.g. MySQL, PostgreSQL, SQLite, MS SQL Server, Cloud MongoDB"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Setup Assistance */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সেটআপ ও ট্রেনিং সহায়তা (Installation & Training)
          </label>
          <select
            value={value.setupAssistance || ""}
            onChange={(e) => update("setupAssistance", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Free Remote Setup & Staff Training Included">Free Remote Setup & Staff Training Included</option>
            <option value="On-Site Installation Available in Dhaka">On-Site Installation Available in Dhaka</option>
            <option value="Self Installation (Video Guide & Manual Provided)">Self Installation (Video Guide & Manual Provided)</option>
          </select>
        </div>

        {/* Demo URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            লাইভ ডেমো লিংক (Live Demo URL)
          </label>
          <input
            type="url"
            value={value.demoUrl || ""}
            onChange={(e) => update("demoUrl", e.target.value)}
            placeholder="https://demo.example.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              প্রয়োজনে আরও নতুন ফিল্ড যোগ করতে পারেন (যেমন: SMS Gateway, Barcode Scanner Compatibility, etc.)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
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
                  placeholder="ফিল্ডের নাম (e.g. Barcode Printer Support)"
                  className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. All Thermal & Laser Printers)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500"
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
