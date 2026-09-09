"use client";

import { Upload } from "lucide-react";

export type VerificationData = {
  nidNumber: string;
  nidDocument: File | null;
  tradeLicenseNumber: string;
  tradeLicenseDocument: File | null;
  tinNumber: string;
  tinDocument: File | null;
};

type Props = {
  data: VerificationData;
  onChange: (data: VerificationData) => void;
};

export function VerificationStep({ data, onChange }: Props) {
  return (
    <div className="space-y-4 text-left">
      {/* NID Section */}
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          NID নম্বর <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.nidNumber}
          onChange={(e) => onChange({ ...data, nidNumber: e.target.value })}
          placeholder="জাতীয় পরিচয়পত্র নম্বর"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        />
        
        {/* NID File Upload */}
        <div className="mt-2 relative">
          <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-slate-300 px-3.5 py-3 text-[13px] text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
            <Upload size={16} />
            <span>
              {data.nidDocument ? data.nidDocument.name : "NID-এর ছবি আপলোড করুন (সামনে/পেছনে)"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) =>
                onChange({ ...data, nidDocument: e.target.files?.[0] || null })
              }
            />
          </label>
        </div>
      </div>

      {/* Trade License Section */}
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          Trade License নম্বর <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
        </label>
        <input
          type="text"
          value={data.tradeLicenseNumber}
          onChange={(e) =>
            onChange({ ...data, tradeLicenseNumber: e.target.value })
          }
          placeholder="থাকলে দিন, না থাকলে খালি রাখুন"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        />

        {/* Trade License File Upload */}
        <div className="mt-2 relative">
          <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-slate-300 px-3.5 py-3 text-[13px] text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
            <Upload size={16} />
            <span>
              {data.tradeLicenseDocument
                ? data.tradeLicenseDocument.name
                : "Trade License-এর ছবি (ঐচ্ছিক)"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) =>
                onChange({
                  ...data,
                  tradeLicenseDocument: e.target.files?.[0] || null,
                })
              }
            />
          </label>
        </div>
      </div>

      {/* TIN Certificate Section */}
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          TIN নম্বর <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
        </label>
        <input
          type="text"
          value={data.tinNumber}
          onChange={(e) => onChange({ ...data, tinNumber: e.target.value })}
          placeholder="TIN সার্টিফিকেট নম্বর লিখুন"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        />

        {/* TIN Certificate File Upload */}
        <div className="mt-2 relative">
          <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-slate-300 px-3.5 py-3 text-[13px] text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
            <Upload size={16} />
            <span>
              {data.tinDocument
                ? data.tinDocument.name
                : "TIN সার্টিফিকেট আপলোড করুন (ঐচ্ছিক)"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) =>
                onChange({ ...data, tinDocument: e.target.files?.[0] || null })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}