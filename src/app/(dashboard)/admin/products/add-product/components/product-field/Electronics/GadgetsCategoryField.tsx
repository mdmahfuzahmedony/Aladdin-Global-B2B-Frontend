"use client";

import { useState } from "react";
import {
  Smartphone,
  Cpu,
  HardDrive,
  Monitor,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Tag,
  Zap,
} from "lucide-react";

export interface GadgetsAttributes {
  deviceType?: string;
  brand?: string;
  modelName?: string;
  ram?: string;
  storage?: string;
  screenSize?: string;
  batteryCapacity?: string;
  operatingSystem?: string;
  connectivity?: string;
  chargingPower?: string;
  colorVariant?: string;
  warranty?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function GadgetsCategoryField({
  value = {},
  onChange,
  categoryName = "Consumer Electronics & Gadgets",
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

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-sky-200/80 bg-gradient-to-r from-sky-50/70 via-white to-blue-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 shadow-xs">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              কনজিউমার গ্যাজেটস ও আইটি স্পেসিফিকেশন (Gadgets & IT Specs)
            </h3>
            <p className="text-xs text-slate-500">
              {categoryName} • মোবাইল, ল্যাপটপ, ট্যাবলেট, স্মার্টওয়াচ, অডিও ও কম্পিউটার এক্সেসরিজ
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-sky-100/80 px-2.5 py-1 text-[11px] font-medium text-sky-700">
          <Sparkles size={12} /> স্মার্ট স্পেসিফিকেশন
        </span>
      </div>

      {/* 1. Core Device Identification */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Tag size={15} className="text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ১. ডিভাইসের প্রাথমিক তথ্য (Device Identification)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="ডিভাইসের ধরণ (Device Type)"
            value={value.deviceType}
            onChange={(v) => update("deviceType", v)}
            options={[
              "Smartphone / স্মার্টফোন",
              "Feature Phone / বাটন ফোন",
              "Laptop / ল্যাপটপ",
              "Tablet / iPad / ট্যাবলেট",
              "Smartwatch / ব্যান্ড",
              "TWS / Earbuds / হেডফোন",
              "Bluetooth Speaker / স্পিকার",
              "Power Bank / পাওয়ার ব্যাংক",
              "Smart TV / টেলিভিশন",
              "Monitor / মনিটর",
              "Desktop PC / ক্যাসিং",
              "Router / নেটওয়ার্কিং",
              "Camera / সিসিটিভি ক্যামেরা",
              "Keyboard / Mouse / এক্সেসরিজ",
              "SSD / HDD / মেমোরি কার্ড",
            ]}
            placeholder="যেমন: Projector, Drone, VR Glass..."
          />

          <SelectWithCustom
            label="ব্র্যান্ড (Brand)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            options={[
              "Apple",
              "Samsung",
              "Xiaomi / Redmi",
              "Realme",
              "Vivo",
              "Oppo",
              "OnePlus",
              "Infinix",
              "Tecno",
              "HP",
              "Dell",
              "Lenovo",
              "Asus",
              "Acer",
              "Sony",
              "JBL",
              "Anker / Soundcore",
              "A4Tech / Bloody",
              "Walton",
              "TP-Link",
              "Havit",
              "Haylou",
              "Joyroom",
              "Remax",
            ]}
            placeholder="ব্র্যান্ডের নাম লিখুন..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              মডেল / সংস্করণ (Model Name / Series)
            </label>
            <input
              type="text"
              value={value.modelName ?? ""}
              onChange={(e) => update("modelName", e.target.value)}
              placeholder="যেমন: Redmi Note 13, Pavilion 15, AirPods Pro 2"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Technical Performance & Memory */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Cpu size={15} className="text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ২. মেমোরি ও প্রসেসিং (Memory, Storage & OS)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <SelectWithCustom
            label="র‍্যাম (RAM)"
            value={value.ram}
            onChange={(v) => update("ram", v)}
            options={[
              "2 GB",
              "3 GB",
              "4 GB",
              "6 GB",
              "8 GB",
              "12 GB",
              "16 GB",
              "24 GB",
              "32 GB",
              "64 GB",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 8GB + 8GB Virtual..."
          />

          <SelectWithCustom
            label="রম / ইন্টারনাল স্টোরেজ (Storage / ROM)"
            value={value.storage}
            onChange={(v) => update("storage", v)}
            options={[
              "32 GB",
              "64 GB",
              "128 GB",
              "256 GB",
              "512 GB",
              "1 TB SSD",
              "2 TB",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 1TB HDD + 256GB SSD..."
          />

          <SelectWithCustom
            label="অপারেটিং সিস্টেম (OS)"
            value={value.operatingSystem}
            onChange={(v) => update("operatingSystem", v)}
            options={[
              "Android 14 / HyperOS",
              "Android 13 / One UI",
              "iOS 17 / 18",
              "iPadOS",
              "Windows 11 Home / Pro",
              "macOS Sequoia / Sonoma",
              "ChromeOS",
              "Linux / Ubuntu",
              "FreeDOS",
              "RTOS / Custom OS",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="কাস্টম ওএস লিখুন..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              কালার ভেরিয়েন্ট (Color / Variant)
            </label>
            <input
              type="text"
              value={value.colorVariant ?? ""}
              onChange={(e) => update("colorVariant", e.target.value)}
              placeholder="যেমন: Midnight Black, Space Gray, Titanium Blue"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Display, Battery & Connectivity */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Monitor size={15} className="text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৩. ডিসপ্লে, পাওয়ার ও কানেক্টিভিটি (Display, Battery & Power)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <SelectWithCustom
            label="ডিসপ্লে ও স্ক্রিন সাইজ (Screen Display)"
            value={value.screenSize}
            onChange={(v) => update("screenSize", v)}
            options={[
              "1.4\" AMOLED (Smartwatch)",
              "1.96\" HD Curved",
              "6.1\" Super Retina OLED",
              "6.67\" FHD+ AMOLED 120Hz",
              "6.78\" 1.5K AMOLED 144Hz",
              "10.9\" Liquid Retina",
              "14.0\" FHD IPS Anti-Glare",
              "15.6\" FHD 144Hz Gaming",
              "16.0\" 3.2K OLED",
              "24\" Full HD IPS (100Hz)",
              "27\" 2K QHD IPS (180Hz)",
              "32\" HD Smart LED TV",
              "43\" 4K Ultra HD Smart TV",
              "55\" 4K HDR Google TV",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 6.55 inch Curved 90Hz..."
          />

          <SelectWithCustom
            label="ব্যাটারি ক্যাপাসিটি (Battery Capacity)"
            value={value.batteryCapacity}
            onChange={(v) => update("batteryCapacity", v)}
            options={[
              "300 mAh (Smartwatch)",
              "500 mAh (Earbuds Case)",
              "4000 mAh",
              "5000 mAh Li-Po",
              "6000 mAh Mega Battery",
              "10000 mAh (Power Bank)",
              "20000 mAh (Power Bank)",
              "3-Cell 45Wh (Laptop)",
              "4-Cell 70Wh (Laptop)",
              "Direct AC Power (কর্ডযুক্ত)",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 5500 mAh 80W..."
          />

          <SelectWithCustom
            label="চার্জিং ও পাওয়ার ইনপুট (Fast Charging)"
            value={value.chargingPower}
            onChange={(v) => update("chargingPower", v)}
            options={[
              "15W Fast Charging",
              "18W Fast Charging",
              "25W Super Fast",
              "33W Turbo Charge",
              "45W SuperVOOC",
              "67W HyperCharge",
              "120W Ultra-Fast",
              "65W Type-C PD (Laptop)",
              "100W PD Fast Charge",
              "15W Wireless Qi Charging",
              "5V / 2A Standard",
              "N/A",
            ]}
            placeholder="যেমন: 80W FlashCharge..."
          />

          <SelectWithCustom
            label="কানেক্টিভিটি (Connectivity)"
            value={value.connectivity}
            onChange={(v) => update("connectivity", v)}
            options={[
              "5G + Wi-Fi 6 + Bluetooth 5.3",
              "4G VoLTE + Dual Band Wi-Fi",
              "Bluetooth 5.3 + Dual Pairing",
              "Bluetooth 5.0 (10m Range)",
              "Wi-Fi Only (802.11ax)",
              "USB Type-C + 3.5mm Jack",
              "Wireless 2.4GHz + Bluetooth",
              "HDMI + DP + USB Hub",
              "Gigabit Ethernet + Wi-Fi",
            ]}
            placeholder="যেমন: Bluetooth 5.4, NFC, GPS..."
          />
        </div>
      </div>

      {/* 4. Warranty & Origin */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck size={15} className="text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৪. ওয়ারেন্টি ও উৎপাদন (Warranty & Origin)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectWithCustom
            label="ওয়ারেন্টি গ্যারান্টি (Warranty Policy)"
            value={value.warranty}
            onChange={(v) => update("warranty", v)}
            options={[
              "Official 1 Year Brand Warranty",
              "Official 2 Years Comprehensive",
              "Official 3 Years Replacement Warranty",
              "1 Year Service Warranty (Parts Excluded)",
              "6 Months Service Warranty",
              "7 Days Replacement Guarantee",
              "Lifetime Limited Warranty (RAM/Storage)",
              "No Warranty (চেক করে নিতে হবে)",
            ]}
            placeholder="কাস্টম ওয়ারেন্টি পলিসি লিখুন..."
          />

          <SelectWithCustom
            label="উৎপাদনকারী দেশ (Country of Origin / Assembled)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            options={[
              "Bangladesh (মেইড ইন বাংলাদেশ)",
              "China",
              "Vietnam",
              "India",
              "Taiwan",
              "Japan",
              "South Korea",
              "USA",
              "Malaysia",
              "Thailand",
            ]}
            placeholder="অন্যান্য দেশ লিখুন..."
          />
        </div>
      </div>

      {/* 5. Custom Specifications Builder */}
      <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              ৫. অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specifications)
            </h4>
            <p className="text-[11px] text-slate-500">
              উপরের তালিকার বাইরে যেকোনো বিশেষ টেকনিক্যাল ফিচার থাকলে এখানে নিজে নাম ও ভ্যালু লিখে যোগ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-sky-700"
          >
            <Plus size={14} />
            <span>নতুন স্পেসিফিকেশন যোগ করুন</span>
          </button>
        </div>

        {customSpecs.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white/70 py-6 text-center text-xs text-slate-500">
            বর্তমানে কোনো অতিরিক্ত কাস্টম স্পেক্স নেই। বিশেষ কোনো তথ্য থাকলে উপরের বাটনে ক্লিক করুন।
          </div>
        ) : (
          <div className="space-y-2.5">
            {customSpecs.map((spec, index) => (
              <div
                key={spec.id}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs"
              >
                <div className="w-6 text-center text-xs font-bold text-slate-400">
                  #{index + 1}
                </div>
                <input
                  type="text"
                  placeholder="ফিচারের নাম (যেমন: Camera Pixels, Refresh Rate, ANC)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="মান / বর্ণনা (যেমন: 50MP OIS, 144Hz, 45dB Active Noise Cancellation)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectWithCustom({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const isCustom = Boolean(value && !options.includes(value));
  const [showCustomInput, setShowCustomInput] = useState(isCustom);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-[11px] font-medium text-sky-600 hover:underline"
        >
          {showCustomInput ? "তালিকা দেখুন" : "+ কাস্টম লিখুন"}
        </button>
      </div>

      {showCustomInput ? (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "কাস্টম মান লিখুন..."}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      ) : (
        <select
          value={value ?? ""}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setShowCustomInput(true);
            } else {
              onChange(e.target.value);
            }
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="">নির্বাচন করুন (Select)</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__custom__">+ অন্য কিছু কাস্টম লিখুন...</option>
        </select>
      )}
    </div>
  );
}
