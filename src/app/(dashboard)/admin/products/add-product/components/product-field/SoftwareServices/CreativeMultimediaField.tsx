"use client";

import React from "react";
import {
  Video,
  Film,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  FileCheck,
  Plus,
  Trash2,
} from "lucide-react";

export interface CreativeMultimediaAttributes {
  creativeProductType?: string;
  softwareCompatibility?: string;
  resolutionQuality?: string;
  includedAssetsFiles?: string;
  accessDuration?: string;
  deliveryMethod?: string;
  languageInstruction?: string;
  certificateProvided?: string;
  systemRequirements?: string;
  licenseUsage?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function CreativeMultimediaField({
  value = {},
  onChange,
  categoryName = "Video Editing, Photo Editing & E-Learning",
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
    "Professional Video Editing Master Bundle (Transitions, LUTs, Title Templates)",
    "Premiere Pro & After Effects Motion Graphics Pack (4K Cinematic Transitions)",
    "Adobe Photoshop & Lightroom Presets Studio Pack (500+ RAW Color Grading)",
    "Complete Full-Stack Web Development Video Masterclass (Bangla + Projects)",
    "AI-Powered Content Creation & Video Automation Toolkit (Prompts & Workflows)",
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 ring-1 ring-pink-500/20">
            <Video size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              ভিডিও, ক্রিয়েটিভ এডিটিং ও ই-লার্নিং স্পেসিফিকেশন (Creative & E-Learning)
            </h4>
            <p className="text-[11px] text-slate-500">
              ক্যাটেগরি: <span className="font-medium text-pink-600">{categoryName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-pink-800">
          <Sparkles size={14} className="text-pink-600" />
          <span>জনপ্রিয় ক্রিয়েটিভ টুলস ও কোর্স প্রিসেট:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => update("creativeProductType", p)}
              className="rounded-lg border border-pink-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-pink-900 transition hover:bg-pink-600 hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Creative Product Type */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">
            টুল বা কোর্সের ধরন বা শিরোনাম (Product / Course Name)
          </label>
          <input
            type="text"
            value={value.creativeProductType || ""}
            onChange={(e) => update("creativeProductType", e.target.value)}
            placeholder="e.g. Video Editing Asset Pack, Motion Graphics Template, Online Video Masterclass"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </div>

        {/* License Usage */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ব্যবহারের লাইসেন্স (License / Usage Rights)
          </label>
          <select
            value={value.licenseUsage || ""}
            onChange={(e) => update("licenseUsage", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Commercial & Personal Use Allowed (Royalty-Free)">Commercial & Personal Use Allowed (Royalty-Free)</option>
            <option value="Single User / Personal Study License">Single User / Personal Study License</option>
            <option value="Agency & Client Work Permitted">Agency & Client Work Permitted</option>
          </select>
        </div>

        {/* Software Compatibility */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সাপোর্টেড সফটওয়্যার (Compatible Software)
          </label>
          <input
            type="text"
            value={value.softwareCompatibility || ""}
            onChange={(e) => update("softwareCompatibility", e.target.value)}
            placeholder="e.g. Adobe Premiere Pro, After Effects, DaVinci Resolve, Photoshop, CapCut"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          />
        </div>

        {/* Resolution / Quality */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            রেজোলিউশন / কোয়ালিটি (Resolution / Video Quality)
          </label>
          <select
            value={value.resolutionQuality || ""}
            onChange={(e) => update("resolutionQuality", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="4K Ultra HD & 1080p Full HD">4K Ultra HD & 1080p Full HD</option>
            <option value="8K / 4K Cinematic Quality">8K / 4K Cinematic Quality</option>
            <option value="1080p Full HD Video Lessons">1080p Full HD Video Lessons</option>
            <option value="Vector / High-Resolution RAW Assets">Vector / High-Resolution RAW Assets</option>
          </select>
        </div>

        {/* Delivery Method */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            ডেলিভারি মাধ্যম (Delivery Method)
          </label>
          <select
            value={value.deliveryMethod || ""}
            onChange={(e) => update("deliveryMethod", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Instant Google Drive / High-Speed Cloud Download Link">Instant Google Drive / High-Speed Cloud Download Link</option>
            <option value="Online LMS Student Dashboard Access">Online LMS Student Dashboard Access</option>
            <option value="USB Pen Drive via Courier Delivery">USB Pen Drive via Courier Delivery</option>
          </select>
        </div>

        {/* Access Duration */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            অ্যাক্সেসের মেয়াদকাল (Access Duration)
          </label>
          <select
            value={value.accessDuration || ""}
            onChange={(e) => update("accessDuration", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Lifetime Access & Unlimited Downloads">Lifetime Access & Unlimited Downloads</option>
            <option value="1 Year Active Membership">1 Year Active Membership</option>
            <option value="6 Months Course Access">6 Months Course Access</option>
          </select>
        </div>

        {/* Language of Instruction */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            কোর্সের ভাষা (Language of Instruction)
          </label>
          <select
            value={value.languageInstruction || ""}
            onChange={(e) => update("languageInstruction", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="বাংলা (Bangla Audio & Guidelines)">বাংলা (Bangla Audio & Guidelines)</option>
            <option value="English (With Subtitles)">English (With Subtitles)</option>
            <option value="Bangla & English Bilingual">Bangla & English Bilingual</option>
          </select>
        </div>

        {/* Certificate */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            সার্টিফিকেট দেওয়া হবে কি? (Certificate)
          </label>
          <select
            value={value.certificateProvided || ""}
            onChange={(e) => update("certificateProvided", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          >
            <option value="">সিলেক্ট করুন...</option>
            <option value="Yes - Verified Digital Certificate upon Completion">Yes - Verified Digital Certificate upon Completion</option>
            <option value="No - Self-Paced Practice Asset Pack">No - Self-Paced Practice Asset Pack</option>
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
              প্রয়োজনে আরও নতুন ফিল্ড যোগ করতে পারেন (যেমন: Total File Size, Sound Effects Included, etc.)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700 transition hover:bg-pink-100"
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
                  placeholder="ফিল্ডের নাম (e.g. Total Download Size)"
                  className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-pink-500"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. 15.5 GB Zip Archive)"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-pink-500"
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
