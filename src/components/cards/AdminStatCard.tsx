"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { ElementType } from "react";

type CardVariant =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "yellow";

type AdminStatCardProps = {
  label: string;
  value: string | number;
  icon: ElementType;
  variant?: CardVariant;
  accent?: string;
  subtitle?: string;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
};

const styles = {
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
} satisfies Record<
  CardVariant,
  {
    card: string;
    icon: string;
    circle: string;
  }
>;

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  variant,
  accent,
  subtitle,
  description,
  trend,
}: AdminStatCardProps) {
  const resolvedVariant: CardVariant = variant || (accent === "emerald" ? "green" : accent === "amber" ? "yellow" : accent === "violet" ? "purple" : accent === "rose" ? "pink" : "blue");
  const s = styles[resolvedVariant] ?? styles.blue;
  const desc = subtitle || description;

  return (
    <div
      className={`
        relative
        min-h-[135px]
        sm:h-[154px]
        overflow-hidden
        rounded-2xl
        border
        p-3.5
        sm:p-5
        ${s.card}
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      `}
    >
      {/* Main content */}
      <div className="relative z-10 flex h-full items-start justify-between gap-2">
        {/* Text */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Label */}
          <p className="truncate text-xs font-medium leading-5 text-slate-600 sm:text-[13px]">
            {label}
          </p>

          {/* Value */}
          <p className="mt-1 break-words text-lg font-bold leading-tight tracking-tight text-[#12233F] sm:mt-1.5 sm:text-[24px] xl:text-[28px]">
            {value}
          </p>

          {/* Bottom info */}
          <div className="mt-1.5 min-h-[18px] sm:mt-2 sm:min-h-[20px]">
            {trend ? (
              <div
                className={`
                  flex
                  items-center
                  gap-1
                  text-[11px]
                  font-semibold
                  sm:text-[11.5px]
                  ${trend.positive ? "text-emerald-600" : "text-red-500"}
                `}
              >
                {trend.positive ? (
                  <TrendingUp size={13} strokeWidth={2} />
                ) : (
                  <TrendingDown size={13} strokeWidth={2} />
                )}

                <span className="truncate">{trend.value}</span>
              </div>
            ) : desc ? (
              <p className="line-clamp-1 text-[11px] leading-snug text-slate-500 sm:text-[11.5px] sm:leading-5">
                {desc}
              </p>
            ) : null}
          </div>
        </div>

        {/* Icon */}
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            sm:h-11
            sm:w-11
            ${s.icon}
          `}
        >
          <Icon size={19} strokeWidth={2} />
        </div>
      </div>

      {/* Decorative circle */}
      <div
        className={`
          pointer-events-none
          absolute
          -bottom-8
          -right-8
          h-24
          w-24
          rounded-full
          ${s.circle}
        `}
      />
    </div>
  );
}
