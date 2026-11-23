"use client";

import {
  CircleDot,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Gauge,
  Layers,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export interface TiresWheelsAttributes {
  tireWheelType?: string;
  brandMaker?: string;
  tireSize?: string;
  rimDiameter?: string;
  vehicleCompatibility?: string;
  seasonTerrain?: string;
  speedRatingLoadIndex?: string;
  materialFinish?: string;
  boltPatternPCD?: string;
  warrantyPeriod?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function TiresWheelsField({
  value = {},
  onChange,
  categoryName = "Tires & Wheels",
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

  const tirePresets = [
    "Car Radial Tubeless Tire 205/55 R16 (All-Season)",
    "Sedan High-Performance Tire 195/65 R15 (Comfort)",
    "SUV & 4x4 All-Terrain Radial Tire 265/65 R17",
    "Motorcycle Tubeless Rear Tire 140/70-17 (Radial)",
    "Sportbike Front Tire 110/70-17 (High Grip)",
    "Forged Aluminum Alloy Rim 17x7.5J PCD 5x114.3",
    "Sport Alloy Wheel Rim 15 Inch PCD 4x100 Glossy Black",
    "Digital Tire Pressure Monitoring System (TPMS 4 Sensors)",
    "Tubeless Tire Emergency Puncture Repair Kit with Plugs",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-xs">
            <CircleDot size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              টায়ার ও হুইল স্পেসিফিকেশন (Tires & Wheels Specs)
            </h3>
            <p className="text-xs text-slate-300">
              কার ও বাইক টায়ার, অ্যালয় রিম, টিপিএমএস সেন্সর ও রিপেয়ার কিটের তথ্য
            </p>
          </div>
        </div>
        <span className="rounded-full bg-orange-500/20 border border-orange-400/40 px-3 py-1 text-xs font-semibold text-orange-300">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-orange-600" />
            <span>আইটেম টাইপ ও মডেল (Tire / Wheel Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="tire-presets"
            value={value.tireWheelType || ""}
            onChange={(e) => update("tireWheelType", e.target.value)}
            placeholder="উদাহরণ: Car Radial Tubeless Tire 205/55 R16"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
          <datalist id="tire-presets">
            {tirePresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-orange-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Maker)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Michelin, Bridgestone, CEAT, MRF, Yokohama, Pirelli"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Tire Size / Dimension */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-orange-600" />
            <span>টায়ারের সাইজ (Tire Size / Dimensions)</span>
          </label>
          <input
            type="text"
            value={value.tireSize || ""}
            onChange={(e) => update("tireSize", e.target.value)}
            placeholder="e.g. 205/55 R16, 140/70-17, 195/65 R15"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Rim Diameter */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <CircleDot size={14} className="text-orange-600" />
            <span>রিমের সাইজ / ডায়ামিটার (Rim Diameter)</span>
          </label>
          <select
            value={value.rimDiameter || ""}
            onChange={(e) => update("rimDiameter", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          >
            <option value="">সিলেক্ট করুন (Select Diameter)</option>
            <option value="12 Inch (Scooter / Kei)">12 Inch (Scooter / Mini)</option>
            <option value="14 Inch (Compact / Sedan)">14 Inch (Compact / Sedan)</option>
            <option value="15 Inch (Sedan / Hatchback)">15 Inch (Sedan / Hatchback)</option>
            <option value="16 Inch (Sedan / Crossover)">16 Inch (Sedan / Crossover)</option>
            <option value="17 Inch (Sedan / Bike / SUV)">17 Inch (Sedan / Bike / SUV)</option>
            <option value="18 Inch (SUV / Performance)">18 Inch (SUV / Performance)</option>
            <option value="19-20+ Inch (Luxury / Offroad)">19-20+ Inch (Luxury / Offroad)</option>
            <option value="N/A (Accessories / Repair Kits)">N/A (Accessories / Tools)</option>
          </select>
        </div>

        {/* Vehicle Compatibility */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-orange-600" />
            <span>যানবাহন টাইপ (Vehicle Compatibility)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.vehicleCompatibility || ""}
            onChange={(e) => update("vehicleCompatibility", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          >
            <option value="">সিলেক্ট করুন (Select Vehicle Type)</option>
            <option value="Sedan & Hatchback Cars">Sedan & Hatchback Cars (প্রাইভেট কার)</option>
            <option value="SUV & Crossovers">SUV & Crossovers (এসইউভি)</option>
            <option value="Motorcycles & Scooters">Motorcycles & Scooters (বাইক ও স্কুটার)</option>
            <option value="Commercial Trucks & Pickups">Commercial Trucks & Pickups (পিকআপ ও ট্রাক)</option>
            <option value="Universal Fit (All Vehicles)">Universal Fit (সার্বজনীন)</option>
          </select>
        </div>

        {/* Season & Terrain */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <CheckCircle2 size={14} className="text-orange-600" />
            <span>সিজন ও ভূপ্রকৃতি (Season & Terrain)</span>
          </label>
          <select
            value={value.seasonTerrain || ""}
            onChange={(e) => update("seasonTerrain", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          >
            <option value="">সিলেক্ট করুন (Select Terrain)</option>
            <option value="All-Season Radial (সব মৌসুমের জন্য)">All-Season Radial (সব মৌসুমের জন্য)</option>
            <option value="Highway Terrain (HT - হাইওয়ে)">Highway Terrain (HT - হাইওয়ে ড্রাইভিং)</option>
            <option value="All-Terrain (AT - হাইওয়ে ও অফরোড)">All-Terrain (AT - হাইওয়ে ও অফরোড)</option>
            <option value="Mud-Terrain (MT - হেভি অফরোড)">Mud-Terrain (MT - হেভি অফরোড)</option>
            <option value="City Commuter (নরমাল সিটি রাইডিং)">City Commuter (নরমাল সিটি রাইডিং)</option>
            <option value="Racing / Track Grip">Racing / Track Grip (স্পোর্টস গ্রিপ)</option>
          </select>
        </div>

        {/* Speed Rating & Load Index */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-orange-600" />
            <span>স্পিড রেটিং ও লোড ইনডেক্স (Speed & Load Index)</span>
          </label>
          <input
            type="text"
            value={value.speedRatingLoadIndex || ""}
            onChange={(e) => update("speedRatingLoadIndex", e.target.value)}
            placeholder="e.g. 91V (240 km/h, 615 kg), 58W, 88H"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Material & Finish */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Wrench size={14} className="text-orange-600" />
            <span>ম্যাটেরিয়াল ও ফিনিশ (Material & Finish)</span>
          </label>
          <input
            type="text"
            value={value.materialFinish || ""}
            onChange={(e) => update("materialFinish", e.target.value)}
            placeholder="e.g. Silica-infused Rubber, Forged Aluminum Alloy, Matte Black"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Bolt Pattern / PCD */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <CircleDot size={14} className="text-orange-600" />
            <span>বোল্ট প্যাটার্ন / পিসিডি (PCD / Bolt Pattern)</span>
          </label>
          <input
            type="text"
            value={value.boltPatternPCD || ""}
            onChange={(e) => update("boltPatternPCD", e.target.value)}
            placeholder="e.g. 4x100, 5x114.3, 5x100, N/A for Tires"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Warranty Period */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-orange-600" />
            <span>ওয়ারেন্টি ও গ্যারান্টি (Warranty Period)</span>
          </label>
          <input
            type="text"
            value={value.warrantyPeriod || ""}
            onChange={(e) => update("warrantyPeriod", e.target.value)}
            placeholder="e.g. 3 Years Official Brand Warranty / 50,000 KM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-orange-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Japan, Thailand, India, Germany, Indonesia"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specifications Section */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Add Custom Specifications)
            </h4>
            <p className="text-[11px] text-slate-500">
              যেকোনো বিশেষ প্যারামিটার বা তথ্য যোগ করতে পারেন (যেমন: Tread Depth, Tubeless/Tube-type)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-orange-700"
          >
            <Plus size={14} />
            <span>নতুন ফিল্ড যোগ করুন</span>
          </button>
        </div>

        {customSpecs.length > 0 ? (
          <div className="space-y-2">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="লেবেল (যেমন: Tread Depth)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: 8.5 mm)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                  title="Remove spec"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[11px] text-slate-400 py-2">
            এখনও কোনো কাস্টম স্পেসিফিকেশন যুক্ত করা হয়নি।
          </p>
        )}
      </div>
    </div>
  );
}
