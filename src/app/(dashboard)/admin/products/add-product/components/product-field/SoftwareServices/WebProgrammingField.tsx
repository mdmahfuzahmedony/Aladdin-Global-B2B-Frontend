"use client";

import React from "react";
import {
  Code2,
  Globe,
  Layers,
  Sparkles,
  Server,
  GitBranch,
  Terminal,
  FileCode,
  Plus,
  Trash2,
} from "lucide-react";

export interface WebProgrammingAttributes {
  solutionType?: string;
  techStack?: string;
  sourceCodeIncluded?: string;
  frontendFramework?: string;
  backendTechnology?: string;
  databaseUsed?: string;
  responsiveDesign?: string;
  demoUrl?: string;
  adminPanelUrl?: string;
  documentationUrl?: string;
  freeBugFixSupport?: string;
  installationSupport?: string;
  hostingRequirements?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function WebProgrammingField({
  value = {},
  onChange,
  categoryName = "Programming & Website",
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
    "Full-Stack Multi-Vendor E-Commerce Platform (Next.js, Node.js, PostgreSQL)",
    "Courier & Parcel Delivery Tracking System with Rider App (Flutter + Laravel)",
    "Hospital & Diagnostic Appointment Booking Portal (React & Python FastAPI)",
    "School / College Management ERP with Online Exam & Result System",
    "B2B Wholesale Portal Script with Invoice, Payment Gateway & Inventory",
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-500/20">
            <Code2 size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              ওয়েব ও সফটওয়্যার প্রোগ্রামিং স্পেসিফিকেশন (Programming & Website)
            </h4>
            <p className="text-[11px] text-slate-500">
              ক্যাটেগরি: <span className="font-medium text-violet-600">{categoryName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-violet-800">
          <Sparkles size={14} className="text-violet-600" />
          <span>জনপ্রিয় স্ক্রিপ্ট ও ডেভেলপমেন্ট প্রিসেট:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => update("solutionType", p)}
              className="rounded-lg border border-violet-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-900 transition hover:bg-violet-600 hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Solution Type */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            সলিউশনের ধরন বা নাম (Solution / Project Name)
          </label>
          <input
            type="text"
            value={value.solutionType || ""}
            onChange={(e) => update("solutionType", e.target.value)}
            placeholder="e.g. Multi-Vendor E-Commerce System, POS Web App, Mobile App Source Code"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Source Code Included */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সোর্স কোড দেওয়া হবে? (Source Code)
          </label>
          <select
            value={value.sourceCodeIncluded || ""}
            onChange={(e) => update("sourceCodeIncluded", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="100% Full Open Source Code (Unencrypted)">100% Full Open Source Code (Unencrypted)</option>
            <option value="Regular Single Domain License">Regular Single Domain License</option>
            <option value="Extended Developer License">Extended Developer License</option>
            <option value="Hosted SaaS Access Only (No Source Code)">Hosted SaaS Access Only (No Source Code)</option>
          </select>
        </div>

        {/* Tech Stack */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            ব্যবহৃত টেকনোলজি ও ফ্রেমওয়ার্ক (Tech Stack)
          </label>
          <input
            type="text"
            value={value.techStack || ""}
            onChange={(e) => update("techStack", e.target.value)}
            placeholder="e.g. Next.js, React, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Database Used */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ডাটাবেস (Database Engine)
          </label>
          <input
            type="text"
            value={value.databaseUsed || ""}
            onChange={(e) => update("databaseUsed", e.target.value)}
            placeholder="e.g. PostgreSQL, MySQL, MongoDB, Redis"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Responsive Design */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            মোবাইল ও রেসপনসিভনেস (Mobile Responsiveness)
          </label>
          <select
            value={value.responsiveDesign || ""}
            onChange={(e) => update("responsiveDesign", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="100% Mobile & Tablet Responsive">100% Mobile & Tablet Responsive</option>
            <option value="PWA (Progressive Web App) Supported">PWA (Progressive Web App) Supported</option>
            <option value="Desktop Focused / Dashboard">Desktop Focused / Dashboard</option>
          </select>
        </div>

        {/* Free Bug Fix & Support */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            বাগ ফিক্স ও ফ্রি সাপোর্ট (Free Support Duration)
          </label>
          <select
            value={value.freeBugFixSupport || ""}
            onChange={(e) => update("freeBugFixSupport", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="6 Months Free Bug Fix & Updates">6 Months Free Bug Fix & Updates</option>
            <option value="1 Year Free Developer Support">1 Year Free Developer Support</option>
            <option value="3 Months Free Support">3 Months Free Support</option>
            <option value="Lifetime Updates Included">Lifetime Updates Included</option>
          </select>
        </div>

        {/* Installation & Deployment */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সার্ভার ইনস্টলেশন সহায়তা (Server Setup)
          </label>
          <select
            value={value.installationSupport || ""}
            onChange={(e) => update("installationSupport", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Free 1-Time Server Deployment to cPanel / VPS / Vercel">Free 1-Time Server Deployment to cPanel / VPS / Vercel</option>
            <option value="Detailed Step-by-Step Installation Documentation Provided">Detailed Step-by-Step Installation Documentation Provided</option>
            <option value="Paid Dedicated Setup Available">Paid Dedicated Setup Available</option>
          </select>
        </div>

        {/* Live Demo URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            লাইভ ডেমো ইউআরএল (Live Preview URL)
          </label>
          <input
            type="url"
            value={value.demoUrl || ""}
            onChange={(e) => update("demoUrl", e.target.value)}
            placeholder="https://preview.example.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Documentation URL */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ডকুমেন্টেশন লিংক (Docs URL)
          </label>
          <input
            type="url"
            value={value.documentationUrl || ""}
            onChange={(e) => update("documentationUrl", e.target.value)}
            placeholder="https://docs.example.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
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
              প্রয়োজনে আরও নতুন ফিল্ড যোগ করতে পারেন (যেমন: Payment Gateway Integration, SMS Gateway, etc.)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
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
                  placeholder="ফিল্ডের নাম (e.g. Payment Gateway)"
                  className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-violet-500"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. bKash, Nagad, Rocket, SSLCommerz, Stripe)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-violet-500"
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
