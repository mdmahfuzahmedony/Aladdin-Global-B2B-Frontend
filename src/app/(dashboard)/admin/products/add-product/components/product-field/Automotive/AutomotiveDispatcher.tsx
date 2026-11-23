"use client";

import { useMemo, useState } from "react";
import TiresWheelsField from "./TiresWheelsField";
import OilsFluidsField from "./OilsFluidsField";
import CarBikeCareField from "./CarBikeCareField";
import PartsAccessoriesField from "./PartsAccessoriesField";
import ToolsEquipmentField from "./ToolsEquipmentField";
import {
  CircleDot,
  Droplets,
  Sparkles,
  Wrench,
  Hammer,
} from "lucide-react";

export type AutomotiveSubcategoryTab =
  | "TIRES_WHEELS"
  | "OILS_FLUIDS"
  | "CARE_CLEANING"
  | "PARTS_ACCESSORIES"
  | "TOOLS_EQUIPMENT";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function AutomotiveDispatcher({
  value = {},
  onChange,
  categoryName = "Automotive — Cars & Motorcycles",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // 1. Automatic subcategory detection from category keywords
  const detectedGroup: AutomotiveSubcategoryTab = useMemo(() => {
    // Tires & Wheels
    if (
      catLower.includes("tire") ||
      catLower.includes("tyre") ||
      catLower.includes("wheel") ||
      catLower.includes("rim") ||
      catLower.includes("টায়ার") ||
      catLower.includes("হুইল") ||
      catLower.includes("চাকা")
    ) {
      return "TIRES_WHEELS";
    }

    // Oils & Fluids
    if (
      catLower.includes("oil") ||
      catLower.includes("fluid") ||
      catLower.includes("lubricant") ||
      catLower.includes("coolant") ||
      catLower.includes("brake fluid") ||
      catLower.includes("transmission") ||
      catLower.includes("অয়েল") ||
      catLower.includes("লুব্রিক্যান্ট")
    ) {
      return "OILS_FLUIDS";
    }

    // Car & Bike Care
    if (
      catLower.includes("care") ||
      catLower.includes("clean") ||
      catLower.includes("shampoo") ||
      catLower.includes("wax") ||
      catLower.includes("polish") ||
      catLower.includes("wash") ||
      catLower.includes("vacuum") ||
      catLower.includes("microfiber") ||
      catLower.includes("scratch") ||
      catLower.includes("কেয়ার") ||
      catLower.includes("ওয়াশ") ||
      catLower.includes("পরিষ্কার")
    ) {
      return "CARE_CLEANING";
    }

    // Parts, Lighting, Interior/Exterior, Motorcycle Gear
    if (
      catLower.includes("part") ||
      catLower.includes("accessory") ||
      catLower.includes("accessories") ||
      catLower.includes("interior") ||
      catLower.includes("exterior") ||
      catLower.includes("light") ||
      catLower.includes("lamp") ||
      catLower.includes("electronic") ||
      catLower.includes("safety") ||
      catLower.includes("riding gear") ||
      catLower.includes("helmet") ||
      catLower.includes("dash cam") ||
      catLower.includes("gps") ||
      catLower.includes("পার্টস") ||
      catLower.includes("এক্সেসরিজ")
    ) {
      return "PARTS_ACCESSORIES";
    }

    // Tools & Equipment / Vehicles
    if (
      catLower.includes("tool") ||
      catLower.includes("equipment") ||
      catLower.includes("jack") ||
      catLower.includes("diagnostic") ||
      catLower.includes("charger") ||
      catLower.includes("inflator") ||
      catLower.includes("vehicle") ||
      catLower.includes("car") ||
      catLower.includes("motorcycle") ||
      catLower.includes("scooter") ||
      catLower.includes("bicycle") ||
      catLower.includes("টুলস")
    ) {
      return "TOOLS_EQUIPMENT";
    }

    // Existing attribute inference
    if (value.tireWheelType || value.tireSize || value.rimDiameter) {
      return "TIRES_WHEELS";
    }
    if (value.oilFluidType || value.viscosityGrade || value.oilBaseFormulation) {
      return "OILS_FLUIDS";
    }
    if (value.careProductType || value.formulationPhLevel) {
      return "CARE_CLEANING";
    }
    if (value.partAccessoryType || value.vehicleMakeModel) {
      return "PARTS_ACCESSORIES";
    }
    if (value.toolEquipmentType || value.powerSourceInput) {
      return "TOOLS_EQUIPMENT";
    }

    // Default to Tires & Wheels
    return "TIRES_WHEELS";
  }, [catLower, value]);

  // Tab State
  const [selectedTab, setSelectedTab] = useState<AutomotiveSubcategoryTab>(detectedGroup);

  const tabs: Array<{
    id: AutomotiveSubcategoryTab;
    label: string;
    sublabel: string;
    icon: any;
    color: string;
  }> = [
    {
      id: "TIRES_WHEELS",
      label: "১. টায়ার ও হুইল (Tires & Wheels)",
      sublabel: "কার ও বাইক টায়ার, অ্যালয় রিম, টিপিএমএস সেন্সর",
      icon: CircleDot,
      color: "orange",
    },
    {
      id: "OILS_FLUIDS",
      label: "২. ইঞ্জিন অয়েল ও ফ্লুইডস (Oils & Fluids)",
      sublabel: "সিন্থেটিক ইঞ্জিন অয়েল, ব্রেক ফ্লুইড, কুল্যান্ট",
      icon: Droplets,
      color: "amber",
    },
    {
      id: "CARE_CLEANING",
      label: "৩. কার ও বাইক কেয়ার (Car & Bike Care)",
      sublabel: "কার শ্যাম্পু, পলিশ, সিরামিক কোটিং ও ক্লিনিং",
      icon: Sparkles,
      color: "emerald",
    },
    {
      id: "PARTS_ACCESSORIES",
      label: "৪. পার্টস ও এক্সেসরিজ (Parts & Accessories)",
      sublabel: "হেডলাইট, ড্যাশ ক্যাম, সিট কভার, রাইডিং গিয়ার",
      icon: Wrench,
      color: "sky",
    },
    {
      id: "TOOLS_EQUIPMENT",
      label: "৫. টুলস ও ডায়াগনস্টিক (Tools & Equipment)",
      sublabel: "OBD2 স্ক্যানার, এয়ার পাম্প, হাইড্রোলিক জ্যাক, টুলকিট",
      icon: Hammer,
      color: "violet",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;

          let activeClass = "";
          if (tab.color === "orange") {
            activeClass = "bg-orange-600 text-white shadow-sm ring-1 ring-orange-500";
          } else if (tab.color === "amber") {
            activeClass = "bg-amber-600 text-white shadow-sm ring-1 ring-amber-500";
          } else if (tab.color === "emerald") {
            activeClass = "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500";
          } else if (tab.color === "sky") {
            activeClass = "bg-sky-600 text-white shadow-sm ring-1 ring-sky-500";
          } else if (tab.color === "violet") {
            activeClass = "bg-violet-600 text-white shadow-sm ring-1 ring-violet-500";
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={`flex flex-col items-start gap-1 rounded-lg p-2.5 text-left text-xs transition ${
                isActive
                  ? activeClass
                  : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Icon size={15} />
                <span>{tab.label}</span>
              </div>
              <span
                className={`text-[10px] leading-tight line-clamp-1 ${
                  isActive ? "text-white/85" : "text-slate-400"
                }`}
              >
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render selected component */}
      {selectedTab === "TIRES_WHEELS" && (
        <TiresWheelsField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "OILS_FLUIDS" && (
        <OilsFluidsField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "CARE_CLEANING" && (
        <CarBikeCareField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "PARTS_ACCESSORIES" && (
        <PartsAccessoriesField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "TOOLS_EQUIPMENT" && (
        <ToolsEquipmentField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
