"use client";


import {
  Globe2,
  MapPin,
  Plus,
  Trash2,
  Truck,
  Weight,
  Banknote,
} from "lucide-react";

export type DeliveryScope = "UPAZILA_BASED" | "NATIONWIDE";

export type DeliveryRate = {
  minDistanceKm: string;
  maxDistanceKm: string;
  firstKgCharge: string;
  additionalKgCharge: string;
};

export type ProductDeliveryData = {
  scope: DeliveryScope;
  weightKg: string;
  nationwideCharge: string;
  rates: DeliveryRate[];
};

type ProductDeliveryProps = {
  value: ProductDeliveryData;
  onChange: (value: ProductDeliveryData) => void;
};

const emptyRate = (): DeliveryRate => ({
  minDistanceKm: "",
  maxDistanceKm: "",
  firstKgCharge: "",
  additionalKgCharge: "",
});

export default function ProductDelivery({
  value,
  onChange,
}: ProductDeliveryProps) {
  const updateField = (
    field: "scope" | "weightKg" | "nationwideCharge",
    fieldValue: string,
  ) => {
    if (field === "scope") {
      if (
        fieldValue !== "UPAZILA_BASED" &&
        fieldValue !== "NATIONWIDE"
      ) {
        return;
      }

      onChange({
        ...value,
        scope: fieldValue,
      });

      return;
    }

    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const updateRate = (
    index: number,
    field: keyof DeliveryRate,
    fieldValue: string,
  ) => {
    onChange({
      ...value,
      rates: value.rates.map((rate, i) =>
        i === index
          ? { ...rate, [field]: fieldValue }
          : rate,
      ),
    });
  };

  const addRate = () => {
    const lastRate = value.rates[value.rates.length - 1];

    onChange({
      ...value,
      rates: [
        ...value.rates,
        {
          ...emptyRate(),
          minDistanceKm: lastRate?.maxDistanceKm ?? "",
        },
      ],
    });
  };

  const removeRate = (index: number) => {
    if (value.rates.length <= 1) return;

    onChange({
      ...value,
      rates: value.rates.filter((_, i) => i !== index),
    });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]";

  const labelClass =
    "mb-1.5 block text-[11px] font-medium text-slate-600";

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Truck size={17} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#12233F]">
            Product Delivery Settings
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            পণ্যের Delivery Area, Weight এবং Charge নির্ধারণ করুন।
          </p>
        </div>
      </div>

      {/* Delivery Scope */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-[13px] font-bold text-[#12233F]">
            Delivery Scope
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">
            এই Product কোন এলাকায় Delivery করা যাবে তা নির্বাচন করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Upazila Based */}
          <button
            type="button"
            onClick={() => updateField("scope", "UPAZILA_BASED")}
            aria-pressed={value.scope === "UPAZILA_BASED"}
            className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
              value.scope === "UPAZILA_BASED"
                ? "border-[#12233F] bg-slate-50 ring-1 ring-[#12233F]"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                value.scope === "UPAZILA_BASED"
                  ? "bg-[#12233F] text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <MapPin size={17} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-bold text-[#12233F]">
                Upazila Based
              </span>
              <span className="mt-1 block text-[11px] leading-5 text-slate-400">
                Seller-এর Upazila-এর মধ্যে Distance Slab অনুযায়ী Delivery।
              </span>
            </span>

            <span
              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                value.scope === "UPAZILA_BASED"
                  ? "border-[#12233F] bg-[#12233F]"
                  : "border-slate-300 bg-white"
              }`}
            >
              {value.scope === "UPAZILA_BASED" && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
          </button>

          {/* Nationwide */}
          <button
            type="button"
            onClick={() => updateField("scope", "NATIONWIDE")}
            aria-pressed={value.scope === "NATIONWIDE"}
            className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
              value.scope === "NATIONWIDE"
                ? "border-[#12233F] bg-slate-50 ring-1 ring-[#12233F]"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                value.scope === "NATIONWIDE"
                  ? "bg-[#12233F] text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Globe2 size={17} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-bold text-[#12233F]">
                Nationwide
              </span>
              <span className="mt-1 block text-[11px] leading-5 text-slate-400">
                Courier-এর মাধ্যমে সারা বাংলাদেশে Delivery।
              </span>
            </span>

            <span
              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                value.scope === "NATIONWIDE"
                  ? "border-[#12233F] bg-[#12233F]"
                  : "border-slate-300 bg-white"
              }`}
            >
              {value.scope === "NATIONWIDE" && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Nationwide Fixed Charge */}
      {value.scope === "NATIONWIDE" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Banknote size={17} />
            </span>

            <div>
              <h3 className="text-[13px] font-bold text-[#12233F]">
                Nationwide Delivery Charge
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-400">
                সারা বাংলাদেশে এই পণ্যের জন্য নির্দিষ্ট ডেলিভারি চার্জ দিন।
              </p>
            </div>
          </div>

          <div className="max-w-sm">
            <label
              htmlFor="nationwide-charge"
              className={labelClass}
            >
              Delivery Charge (৳) <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <input
                id="nationwide-charge"
                type="number"
                min="0"
                step="0.01"
                value={value.nationwideCharge}
                onChange={(e) =>
                  updateField("nationwideCharge", e.target.value)
                }
                placeholder="যেমন: 120"
                className={`${inputClass} pr-12`}
                required
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                BDT
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-5 text-slate-400">
              উদাহরণ: ১২০ দিলে এই পণ্যের ন্যাশনাল ডেলিভারি চার্জ হবে ৳১২০।
            </p>
          </div>
        </div>
      )}

      {/* Upazila Based Settings */}
      {value.scope === "UPAZILA_BASED" && (
        <>
          {/* Weight */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Weight size={17} />
              </span>

              <div>
                <h3 className="text-[13px] font-bold text-[#12233F]">
                  Product Weight
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Delivery Charge হিসাবের জন্য পণ্যের ওজন দিন।
                </p>
              </div>
            </div>

            <div className="max-w-sm">
              <label
                htmlFor="delivery-weight"
                className={labelClass}
              >
                Weight (KG) <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  id="delivery-weight"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={value.weightKg}
                  onChange={(e) =>
                    updateField("weightKg", e.target.value)
                  }
                  placeholder="যেমন: 1.500"
                  className={`${inputClass} pr-12`}
                  required
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                  KG
                </span>
              </div>
            </div>
          </div>

          {/* Distance Slabs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-bold text-[#12233F]">
                  Distance-wise Delivery Charge
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  প্রতিটি Distance Range-এর প্রথম ১ KG এবং অতিরিক্ত প্রতি KG-এর চার্জ দিন।
                </p>
              </div>

              <button
                type="button"
                onClick={addRate}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-[#12233F] transition hover:border-[#12233F] hover:bg-slate-50"
              >
                <Plus size={14} />
                Add Slab
              </button>
            </div>

            <div className="space-y-3">
              {value.rates.map((rate, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-slate-700">
                      Distance Slab {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => removeRate(index)}
                      disabled={value.rates.length <= 1}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className={labelClass}>
                        Min Distance (KM)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={rate.minDistanceKm}
                        onChange={(e) =>
                          updateRate(index, "minDistanceKm", e.target.value)
                        }
                        placeholder="0"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Max Distance (KM)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={rate.maxDistanceKm}
                        onChange={(e) =>
                          updateRate(index, "maxDistanceKm", e.target.value)
                        }
                        placeholder="3"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        First 1 KG (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate.firstKgCharge}
                        onChange={(e) =>
                          updateRate(index, "firstKgCharge", e.target.value)
                        }
                        placeholder="60"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Additional / KG (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate.additionalKgCharge}
                        onChange={(e) =>
                          updateRate(index, "additionalKgCharge", e.target.value)
                        }
                        placeholder="20"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {index > 0 && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      এই Slab-এর Min Distance আগের Slab-এর Max Distance (
                      {value.rates[index - 1].maxDistanceKm || "—"}
                      )-এর সমান হতে হবে।
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
