"use client";

export type BusinessInfoData = {
  storeName: string;
  businessAddress: string;
  businessCategory: string;
};

type Props = {
  data: BusinessInfoData;
  onChange: (data: BusinessInfoData) => void;
};

const CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home & Living",
  "Beauty",
  "Kitchen",
  "Industrial",
  "Automotive",
  "Stationery",
  "Sports",
  "Other",
];

export function BusinessInfoStep({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          Store/Shop Name
        </label>
        <input
          type="text"
          value={data.storeName}
          onChange={(e) => onChange({ ...data, storeName: e.target.value })}
          placeholder="যেমন: Rahman Electronics"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          Business Address
        </label>
        <textarea
          value={data.businessAddress}
          onChange={(e) =>
            onChange({ ...data, businessAddress: e.target.value })
          }
          rows={3}
          placeholder="পূর্ণ ঠিকানা লিখুন"
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
          Business Category
        </label>
        <select
          value={data.businessCategory}
          onChange={(e) =>
            onChange({ ...data, businessCategory: e.target.value })
          }
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
        >
          <option value="">নির্বাচন করুন</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}