
"use client";

import { useEffect, useState } from "react";
import type { ElementType } from "react";

import {
  BadgeCheck,
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

type CardVariant =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "yellow";

type FeatureItem = {
  title: string;
  description: string;
  icon: ElementType;
  variant: CardVariant;
};

const styles: Record<
  CardVariant,
  {
    card: string;
    icon: string;
    circle: string;
  }
> = {
  blue: {
    card: "border-blue-100 bg-blue-50/70",
    icon: "bg-blue-100 text-blue-600",
    circle: "bg-blue-100/50",
  },
  green: {
    card: "border-emerald-100 bg-emerald-50/70",
    icon: "bg-emerald-100 text-emerald-600",
    circle: "bg-emerald-100/50",
  },
  purple: {
    card: "border-violet-100 bg-violet-50/70",
    icon: "bg-violet-100 text-violet-600",
    circle: "bg-violet-100/50",
  },
  orange: {
    card: "border-orange-100 bg-orange-50/70",
    icon: "bg-orange-100 text-orange-600",
    circle: "bg-orange-100/50",
  },
  pink: {
    card: "border-pink-100 bg-pink-50/70",
    icon: "bg-pink-100 text-pink-600",
    circle: "bg-pink-100/50",
  },
  yellow: {
    card: "border-amber-100 bg-amber-50/70",
    icon: "bg-amber-100 text-amber-600",
    circle: "bg-amber-100/50",
  },
};

const featureTranslationKeys = [
  ["emiAvailable", "flexiblePayments"],
  ["genuineProducts", "authenticGuaranteed"],
  ["expressDelivery", "fastSecureDelivery"],
  ["officialWarranty", "manufacturerWarranty"],
  ["bestPrice", "valueForMoney"],
  ["easyReturns", "hassleFreeReturns"],
] as const;

const features: FeatureItem[] = [
  {
    title: "EMI Policy Available",
    description: "Flexible payment options",
    icon: CreditCard,
    variant: "blue",
  },
  {
    title: "100% Genuine Products",
    description: "Authentic products guaranteed",
    icon: ShieldCheck,
    variant: "green",
  },
  {
    title: "Express Delivery",
    description: "Fast and secure delivery",
    icon: Truck,
    variant: "purple",
  },
  {
    title: "Official Warranty",
    description: "Manufacturer warranty support",
    icon: BadgeCheck,
    variant: "orange",
  },
  {
    title: "Best Price Guaranteed",
    description: "Value for your money",
    icon: Headphones,
    variant: "pink",
  },
  {
    title: "Easy Returns",
    description: "Hassle-free return policy",
    icon: RotateCcw,
    variant: "yellow",
  },
];

type TrustFeatureCardProps = {
  feature: FeatureItem;
};

function TrustFeatureCard({ feature }: TrustFeatureCardProps) {
  const Icon = feature.icon;
  const s = styles[feature.variant] ?? styles.blue;

  return (
    <div
      className={`
        relative h-[130px] w-full min-w-0 overflow-hidden
        rounded-2xl border p-2 sm:h-[154px] sm:p-3
        ${s.card}
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
      `}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div
          className={`
            mb-2 flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl sm:h-10 sm:w-10
            ${s.icon}
          `}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        <p
          title={feature.title}
          className="line-clamp-2 w-full break-words text-[12px] font-bold leading-4 text-[#12233F] sm:text-[13px] sm:leading-5"
        >
          {feature.title}
        </p>

        <p
          title={feature.description}
          className="mt-1 line-clamp-2 w-full break-words text-[11px] leading-4 text-slate-600"
        >
          {feature.description}
        </p>
      </div>

      <div
        className={`
          pointer-events-none absolute -bottom-8 -right-8
          h-24 w-24 rounded-full
          ${s.circle}
        `}
      />
    </div>
  );
}

export default function TrustFeatures() {
  const { t } = useLanguage();

  // মোবাইল ও PC-র স্লাইড আলাদাভাবে চলবে
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);

  const mobileVisible = Math.min(2, features.length);
  const desktopVisible = Math.min(5, features.length);

  const mobileMaxIndex = Math.max(
    0,
    features.length - mobileVisible
  );

  const desktopMaxIndex = Math.max(
    0,
    features.length - desktopVisible
  );

  const translatedFeatures = features.map((feature, index) => ({
    ...feature,
    title: t(featureTranslationKeys[index][0]),
    description: t(featureTranslationKeys[index][1]),
  }));

  // মোবাইল: ২টি কার্ড দেখাবে, একটি করে স্লাইড হবে
  useEffect(() => {
    if (mobileMaxIndex === 0) return;

    const interval = window.setInterval(() => {
      setMobileIndex((current) =>
        current >= mobileMaxIndex ? 0 : current + 1
      );
    }, 2500);

    return () => window.clearInterval(interval);
  }, [mobileMaxIndex]);

  // PC/Laptop: ৫টি কার্ড দেখাবে, একটি করে স্লাইড হবে
  useEffect(() => {
    if (desktopMaxIndex === 0) return;

    const interval = window.setInterval(() => {
      setDesktopIndex((current) =>
        current >= desktopMaxIndex ? 0 : current + 1
      );
    }, 2500);

    return () => window.clearInterval(interval);
  }, [desktopMaxIndex]);

  return (
    <section className="overflow-hidden bg-[#f5f6fa] py-6 sm:py-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-4">
        {/* Mobile: একসঙ্গে ২টি কার্ড */}
        <div className="overflow-hidden sm:hidden">
          <div
            className="flex items-stretch transition-transform duration-700 ease-in-out"
            style={{
              width: `${(features.length / mobileVisible) * 100}%`,
              transform: `translateX(-${
                mobileIndex * (100 / features.length)
              }%)`,
            }}
          >
            {translatedFeatures.map((feature, index) => (
              <div
                key={index}
                className="min-w-0 px-1"
                style={{
                  flex: `0 0 ${100 / features.length}%`,
                }}
              >
                <TrustFeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>

        {/* PC/Laptop: একসঙ্গে ৫টি কার্ড */}
        <div className="hidden overflow-hidden sm:block">
          <div
            className="flex items-stretch transition-transform duration-700 ease-in-out"
            style={{
              width: `${(features.length / desktopVisible) * 100}%`,
              transform: `translateX(-${
                desktopIndex * (100 / features.length)
              }%)`,
            }}
          >
            {translatedFeatures.map((feature, index) => (
              <div
                key={index}
                className="min-w-0 px-2"
                style={{
                  flex: `0 0 ${100 / features.length}%`,
                }}
              >
                <TrustFeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
