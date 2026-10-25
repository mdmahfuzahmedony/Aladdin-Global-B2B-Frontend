"use client";


import type { LucideIcon } from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
};

export default function TrustFeatureCard({
  feature,
}: {
  feature: FeatureItem;
}) {
  const Icon = feature.icon;

  return (
    <div className="group flex h-full min-w-0 flex-col items-center justify-start rounded-xl border border-slate-200/80 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md sm:rounded-2xl sm:p-4">
      {/* ICON BOX */}
      <div
        className={`mb-2.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 sm:mb-3 sm:h-12 sm:w-12 sm:rounded-2xl ${feature.bgColor} ${feature.iconColor}`}
      >
        <Icon size={20} className="sm:hidden" />
        <Icon size={22} className="hidden sm:block" />
      </div>

      {/* TEXT CONTENT */}
      <div className="min-w-0">
        <h3 className="break-words text-xs font-bold text-[#12233F] transition group-hover:text-blue-600">
          {feature.title}
        </h3>

        <p className="mt-1 break-words text-[10px] leading-snug text-slate-500 sm:text-[11px]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
