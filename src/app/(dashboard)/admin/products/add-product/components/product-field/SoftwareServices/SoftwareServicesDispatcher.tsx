"use client";

import React, { useMemo, useState } from "react";
import {
  Briefcase,
  ShieldCheck,
  Code2,
  Server,
  Video,
} from "lucide-react";
import BusinessAccountingField from "./BusinessAccountingField";
import SecurityAntivirusField from "./SecurityAntivirusField";
import WebProgrammingField from "./WebProgrammingField";
import OperatingSystemsField from "./OperatingSystemsField";
import CreativeMultimediaField from "./CreativeMultimediaField";

export type SoftwareServicesSubcategoryTab =
  | "BUSINESS_ACCOUNTING"
  | "SECURITY_ANTIVIRUS"
  | "WEB_PROGRAMMING"
  | "OPERATING_SYSTEMS"
  | "CREATIVE_MULTIMEDIA";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
  parentNames?: string[];
}

export default function SoftwareServicesDispatcher({
  value = {},
  onChange,
  categoryName = "Software & Services",
  parentNames = [],
}: Props) {
  const combined = `${categoryName} ${parentNames.join(" ")}`.toLowerCase();

  // Automatic subcategory detection from keywords
  const detectedGroup: SoftwareServicesSubcategoryTab = useMemo(() => {
    // 1. Antivirus & Security
    if (
      combined.includes("antivirus") ||
      combined.includes("security") ||
      combined.includes("protection") ||
      combined.includes("firewall") ||
      combined.includes("vpn") ||
      combined.includes("নিরাপত্তা")
    ) {
      return "SECURITY_ANTIVIRUS";
    }

    // 2. Web Development, Programming & Scripts
    if (
      combined.includes("programming") ||
      combined.includes("website") ||
      combined.includes("web development") ||
      combined.includes("framework") ||
      combined.includes("database") ||
      combined.includes("e-commerce development") ||
      combined.includes("mobile app") ||
      combined.includes("ওয়েবসাইট")
    ) {
      return "WEB_PROGRAMMING";
    }

    // 3. Operating Systems & Servers
    if (
      combined.includes("operating system") ||
      combined.includes("server") ||
      combined.includes("networking") ||
      combined.includes("network") ||
      combined.includes("windows") ||
      combined.includes("linux") ||
      combined.includes("অপারেটিং")
    ) {
      return "OPERATING_SYSTEMS";
    }

    // 4. Video, Photo Editing & E-Learning
    if (
      combined.includes("video editing") ||
      combined.includes("photo editing") ||
      combined.includes("graphics") ||
      combined.includes("motion graphics") ||
      combined.includes("e-learning") ||
      combined.includes("course") ||
      combined.includes("education") ||
      combined.includes("লার্নিং") ||
      combined.includes("ভিডিও")
    ) {
      return "CREATIVE_MULTIMEDIA";
    }

    // 5. Default / Business, Accounting & Finance
    return "BUSINESS_ACCOUNTING";
  }, [combined]);

  const [selectedTab, setSelectedTab] =
    useState<SoftwareServicesSubcategoryTab>(detectedGroup);

  const tabs: Array<{
    id: SoftwareServicesSubcategoryTab;
    label: string;
    sublabel: string;
    icon: any;
    color: string;
  }> = [
    {
      id: "BUSINESS_ACCOUNTING",
      label: "১. বিজনেস ও একাউন্টিং (Business & ERP)",
      sublabel: "একাউন্টিং, পিওএস, ইনভেন্টরি, সিআরএম সফটওয়্যার",
      icon: Briefcase,
      color: "blue",
    },
    {
      id: "SECURITY_ANTIVIRUS",
      label: "২. অ্যান্টিভাইরাস ও সিকিউরিটি (Security & AV)",
      sublabel: "ক্যাসপারস্কি, ইসেট, ইন্টারনেট সিকিউরিটি, ভিপিএন",
      icon: ShieldCheck,
      color: "emerald",
    },
    {
      id: "WEB_PROGRAMMING",
      label: "৩. ওয়েব ও প্রোগ্রামিং (Web & Scripts)",
      sublabel: "ইকমার্স ওয়েবসাইট, ওয়েব অ্যাপ, সোর্স কোড, এপিআই",
      icon: Code2,
      color: "violet",
    },
    {
      id: "OPERATING_SYSTEMS",
      label: "৪. ওএস ও সার্ভার (OS & Servers)",
      sublabel: "উইন্ডোজ ১১/১০ প্রো, উইন্ডোজ সার্ভার, লিনাক্স",
      icon: Server,
      color: "sky",
    },
    {
      id: "CREATIVE_MULTIMEDIA",
      label: "৫. ক্রিয়েটিভ ও কোর্স (Creative & LMS)",
      sublabel: "ভিডিও এডিটিং অ্যাসেট, মোশন গ্রাফিক্স, অনলাইন কোর্স",
      icon: Video,
      color: "pink",
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
          if (tab.color === "blue") {
            activeClass = "bg-blue-600 text-white shadow-sm ring-1 ring-blue-500";
          } else if (tab.color === "emerald") {
            activeClass = "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500";
          } else if (tab.color === "violet") {
            activeClass = "bg-violet-600 text-white shadow-sm ring-1 ring-violet-500";
          } else if (tab.color === "sky") {
            activeClass = "bg-sky-600 text-white shadow-sm ring-1 ring-sky-500";
          } else if (tab.color === "pink") {
            activeClass = "bg-pink-600 text-white shadow-sm ring-1 ring-pink-500";
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
              <div className="flex items-center gap-1.5 font-semibold">
                <Icon
                  size={15}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
                <span className="truncate">{tab.label}</span>
              </div>
              <span
                className={`text-[10px] line-clamp-1 ${
                  isActive ? "text-white/85" : "text-slate-400"
                }`}
              >
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Field Component */}
      {selectedTab === "BUSINESS_ACCOUNTING" && (
        <BusinessAccountingField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "SECURITY_ANTIVIRUS" && (
        <SecurityAntivirusField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "WEB_PROGRAMMING" && (
        <WebProgrammingField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "OPERATING_SYSTEMS" && (
        <OperatingSystemsField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {selectedTab === "CREATIVE_MULTIMEDIA" && (
        <CreativeMultimediaField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
