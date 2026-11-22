"use client";

import {
  Radio,
  Sparkles,
  ShieldCheck,
  BatteryCharging,
  Plus,
  Trash2,
  Tag,
  Zap,
  Gauge,
  Wifi,
} from "lucide-react";

export interface RcElectronicAttributes {
  rcItemType?: string;
  brand?: string;
  modelSeries?: string;
  remoteFrequency?: string;
  controlRangeMeters?: string;
  batteryCapacityType?: string;
  chargeTimeRunTime?: string;
  driveMechanism?: string;
  maxSpeedKmh?: string;
  stuntSpecialFeatures?: string;
  remoteBatteryType?: string;
  recommendedAge?: string;
  bodyMaterial?: string;
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

export default function RcElectronicField({
  value = {},
  onChange,
  categoryName = "Remote Control & Electronic Toys",
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

  const rcPresets = [
    "৪-হুইল ড্রাইভ হাই-স্পিড আরসি মনস্টার কার (4WD RC Monster Car)",
    "৩৬০° স্টান্ট ফ্লিপিং আরসি কার (360 Degree Stunt Rolling Car)",
    "ওয়াইফাই এফপিভি ক্যামেরা ড্রোন (WiFi FPV Camera Drone)",
    "রিমোট কন্ট্রোল রিচার্জেবল হেলিকপ্টার (RC Gyro Helicopter)",
    "স্মার্ট ভয়েস কন্ট্রোলড এআই রোবট (Smart AI Dancing Robot)",
    "হাই-স্পিড আরসি স্পিডবোট ও ওয়াটারক্রাফট (High-Speed RC Boat)",
    "ইলেকট্রিক স্মোক অ্যান্ড সাউন্ড ট্রেন সেট (Smoke & Sound Train)",
    "কিডস রিচার্জেবল ওয়াকি টকি পেয়ার (Long Range Walkie Talkies)",
    "গ্র্যাভিটি সেন্সিং স্টিয়ারিং আরসি কার (Gravity Sensor Wheel RC Car)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/70 via-white to-rose-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700 shadow-xs">
            <Radio size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              রিমোট কন্ট্রোল ও ইলেকট্রনিক খেলনা স্পেসিফিকেশন (RC & Electronic Specs)
            </h3>
            <p className="text-xs text-slate-500">
              আরসি কার, ড্রোন, হেলিকপ্টার, রোবট ও ইলেকট্রনিক খেলনার টেকনিক্যাল বিবরণ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-red-100/90 px-3 py-1 text-xs font-semibold text-red-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-red-600" />
            <span>আরসি খেলনার ধরন (RC Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="rc-type-presets"
            value={value.rcItemType || ""}
            onChange={(e) => update("rcItemType", e.target.value)}
            placeholder="উদাহরণ: 4WD High-Speed Off-Road Stunt RC Monster Car"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
          <datalist id="rc-type-presets">
            {rcPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-red-600" />
            <span>ব্র্যান্ড / মডেল (Brand / Model)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Syma, WLtoys, JJRC, Rastar, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Remote Frequency & Control Range */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Wifi size={14} className="text-red-600" />
            <span>রিমোট ফ্রিকোয়েন্সি ও রেঞ্জ (Range & Frequency)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.controlRangeMeters || ""}
            onChange={(e) => update("controlRangeMeters", e.target.value)}
            placeholder="e.g. 2.4 GHz Wireless / Up to 50 Meters Range"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Battery Capacity & Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <BatteryCharging size={14} className="text-red-600" />
            <span>গাড়ির ব্যাটারি ও ক্ষমতা (Car Battery & Capacity)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.batteryCapacityType || ""}
            onChange={(e) => update("batteryCapacityType", e.target.value)}
            placeholder="e.g. 1200mAh 3.7V Li-ion USB Rechargeable"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Charging & Play Time */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Zap size={14} className="text-red-600" />
            <span>চার্জিং ও খেলার সময় (Charge & Play Time)</span>
          </label>
          <input
            type="text"
            value={value.chargeTimeRunTime || ""}
            onChange={(e) => update("chargeTimeRunTime", e.target.value)}
            placeholder="e.g. Charge: 90 Min | Playtime: 25-30 Min"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Drive Mechanism */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-red-600" />
            <span>ড্রাইভ মেকানিজম (Drive System)</span>
          </label>
          <select
            value={value.driveMechanism || ""}
            onChange={(e) => update("driveMechanism", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          >
            <option value="">ড্রাইভ টাইপ নির্বাচন করুন</option>
            <option value="4WD (4-Wheel Drive All-Terrain)">৪-হুইল ড্রাইভ (4WD All-Terrain)</option>
            <option value="2WD (Rear Wheel High Speed)">২-হুইল ড্রাইভ রিয়ার হুইল (2WD High Speed)</option>
            <option value="6WD / 8WD Military Amphibious">৬WD / ৮WD অফরোড ও অ্যাম্ফিবিয়াস</option>
            <option value="Caterpillar Tank Tracks">ট্যাংক ট্র্যাক ড্রাইভ (Tank Tracks)</option>
            <option value="Quadcopter Drone (4-Motor)">৪-মোটর কোয়াডকপ্টার ড্রোন</option>
          </select>
        </div>

        {/* Stunt & Special Features */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-red-600" />
            <span>স্টান্ট ও বিশেষ ফিচার (Stunt & Features)</span>
          </label>
          <input
            type="text"
            value={value.stuntSpecialFeatures || ""}
            onChange={(e) => update("stuntSpecialFeatures", e.target.value)}
            placeholder="e.g. 360° Spin, Double-Sided Flip, LED Headlight, Drift"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Remote Controller Battery */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Radio size={14} className="text-red-600" />
            <span>রিমোটের ব্যাটারি (Remote Battery)</span>
          </label>
          <input
            type="text"
            value={value.remoteBatteryType || ""}
            onChange={(e) => update("remoteBatteryType", e.target.value)}
            placeholder="e.g. 2 x 1.5V AA Batteries (Not Included)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-red-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age)</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="3+ Years (সহজ কন্ট্রোল ছোট বাচ্চাদের জন্য)">৩+ বছর (সহজ কন্ট্রোল)</option>
            <option value="6+ Years (মিডিয়াম স্পিড আরসি কার)">৬+ বছর (মিডিয়াম স্পিড আরসি কার)</option>
            <option value="8+ Years (হাই-স্পিড মনস্টার ট্রাক)">৮+ বছর (হাই-স্পিড মনস্টার ট্রাক)</option>
            <option value="14+ Years (প্রফেশনাল ড্রোন ও আরসি হবি)">১৪+ বছর (প্রফেশনাল ড্রোন ও আরসি হবি)</option>
          </select>
        </div>

        {/* Body Material */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-red-600" />
            <span>বডি ও টায়ার মেটেরিয়াল (Body & Tires Material)</span>
          </label>
          <input
            type="text"
            value={value.bodyMaterial || ""}
            onChange={(e) => update("bodyMaterial", e.target.value)}
            placeholder="e.g. Crash-Resistant ABS Shell + Anti-Skid Rubber Tires"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Warranty */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-red-600" />
            <span>ওয়ারেন্টি ও গ্যারান্টি (Warranty)</span>
          </label>
          <input
            type="text"
            value={value.warranty || ""}
            onChange={(e) => update("warranty", e.target.value)}
            placeholder="e.g. 7 Days Replacement / 6 Months Service Warranty"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-red-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. China, Hong Kong, Germany"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-2 focus:ring-red-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-red-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700"
          >
            <Plus size={14} />
            <span>নতুন স্পেক যোগ করুন</span>
          </button>
        </div>

        {customSpecs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            কোনো অতিরিক্ত স্পেসিফিকেশন নেই। প্রয়োজনে উপরের বাটনে ক্লিক করে যোগ করতে পারেন।
          </p>
        ) : (
          <div className="space-y-2">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  placeholder="স্পেকের নাম (e.g. ক্যামেরা রেজোলিউশন)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-1 focus:ring-red-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. 1080P HD 120° Wide Angle)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-red-500 focus:outline-hidden focus:ring-1 focus:ring-red-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
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
