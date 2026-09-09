"use client";

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
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          কীভাবে টাকা পেতে চান?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["BANK", "BKASH", "NAGAD"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ ...data, method: m })}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[11px] font-semibold transition-all ${
                data.method === m
                  ? "border-amber-500 bg-amber-50 text-slate-900 shadow-sm"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {m === "BANK" ? (
                <Landmark className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
              {m === "BANK" ? "Bank" : m === "BKASH" ? "bKash" : "Nagad"}
            </button>
          ))}
        </div>
      </div>

      {data.method === "BANK" && (
        <div className="space-y-3 pt-1">
          <div className="relative">
            <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Bank Name"
              value={data.bankName}
              onChange={(e) => onChange({ ...data, bankName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>
          <div className="relative">
            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Account Number"
              value={data.bankAccountNumber}
              onChange={(e) =>
                onChange({ ...data, bankAccountNumber: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Account Holder Name"
              value={data.bankAccountHolder}
              onChange={(e) =>
                onChange({ ...data, bankAccountHolder: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      {(data.method === "BKASH" || data.method === "NAGAD") && (
        <div className="relative pt-1">
          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 mt-0.5" />
          <input
            type="tel"
            placeholder={`${data.method === "BKASH" ? "bKash" : "Nagad"} নম্বর`}
            value={data.mobileBankingNumber}
            onChange={(e) =>
              onChange({ ...data, mobileBankingNumber: e.target.value })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>
      )}
    </div>
  );
}