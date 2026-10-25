"use client";

import { useEffect } from "react";
import { Landmark, Smartphone, User, Hash } from "lucide-react";

export type PayoutData = {
  method: "BANK" | "BKASH" | "NAGAD" | "";
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  mobileBankingNumber: string;
};

type Props = {
  data: PayoutData;
  onChange: (data: PayoutData) => void;
};

export function PayoutStep({ data, onChange }: Props) {
  // Default to BANK as requested
  useEffect(() => {
    if (data.method !== "BANK") {
      onChange({
        ...data,
        method: "BANK",
      });
    }
  }, [data, onChange]);

  return (
    <div className="space-y-4">
      {/* Payout Method Selection */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-slate-700">
          How would you like to receive your payment?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Active: Bank Transfer */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                method: "BANK",
              })
            }
            className="flex flex-col items-center gap-1.5 rounded-xl border border-amber-500 bg-amber-50 py-3 text-[11px] font-semibold text-slate-900 shadow-sm transition-all"
          >
            <Landmark className="h-4 w-4 text-amber-600" />
            <span>Bank Transfer</span>
          </button>

          {/* ============================================================
              FUTURE USE: bKash & Nagad Payout Methods
              Uncomment the buttons below when mobile banking is activated
          ============================================================ */}
          {/*
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                method: "BKASH",
              })
            }
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[11px] font-semibold transition-all ${
              data.method === "BKASH"
                ? "border-amber-500 bg-amber-50 text-slate-900 shadow-sm"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>bKash</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                method: "NAGAD",
              })
            }
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[11px] font-semibold transition-all ${
              data.method === "NAGAD"
                ? "border-amber-500 bg-amber-50 text-slate-900 shadow-sm"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Nagad</span>
          </button>
          */}
        </div>
      </div>

      {/* Bank Details */}
      {data.method === "BANK" && (
        <div className="space-y-3 pt-1">
          {/* Bank Name */}
          <div className="relative">
            <Landmark className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Bank Name"
              value={data.bankName ?? ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  bankName: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Account Number */}
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              inputMode="numeric"
              placeholder="Account Number"
              value={data.bankAccountNumber ?? ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  bankAccountNumber: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Account Holder */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Account Holder Name"
              value={data.bankAccountHolder ?? ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  bankAccountHolder: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* ============================================================
          FUTURE USE: Mobile Banking Inputs (bKash & Nagad)
          Uncomment below when mobile banking is activated
      ============================================================ */}
      {/*
      {(data.method === "BKASH" || data.method === "NAGAD") && (
        <div className="relative pt-1">
          <Smartphone className="absolute left-3 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="tel"
            inputMode="numeric"
            placeholder={
              data.method === "BKASH"
                ? "bKash Number"
                : "Nagad Number"
            }
            value={data.mobileBankingNumber ?? ""}
            onChange={(e) =>
              onChange({
                ...data,
                mobileBankingNumber: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
          />
        </div>
      )}
      */}
    </div>
  );
}
