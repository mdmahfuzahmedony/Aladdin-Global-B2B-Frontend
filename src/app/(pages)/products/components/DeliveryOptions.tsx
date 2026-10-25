"use client";

import {
  Banknote,
  CheckCircle2,
  MapPin,
  PackageCheck,
  RotateCcw,
  Truck,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import type {
  ProductDetails,
  ProductDeliverySettings,
  VendorLocation,
} from "../types";

type CustomerLocation = {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
  area?: string | null;
  address?: string | null;
};

type Props = {
  delivery: ProductDetails["delivery"];
  deliverySettings?: ProductDeliverySettings | null;
  vendorLocation?: VendorLocation | null;
  customerLocation?: CustomerLocation | null;
  returnPolicy: string[];
  onChangeLocation: () => void;
};

const money = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const normalize = (value?: string | null) =>
  (value ?? "").trim().toLocaleLowerCase("en");

export default function DeliveryOptions({
  delivery,
  deliverySettings,
  vendorLocation,
  customerLocation,
  returnPolicy,
  onChangeLocation,
}: Props) {
  const hasCustomerLocation = Boolean(
    normalize(customerLocation?.division) &&
      normalize(customerLocation?.district) &&
      normalize(customerLocation?.upazila)
  );

  const hasVendorLocation = Boolean(
    normalize(vendorLocation?.division) &&
      normalize(vendorLocation?.district) &&
      normalize(vendorLocation?.upazila)
  );

  const scope = deliverySettings?.scope;
  const nationwideCharge = deliverySettings?.nationwideCharge;

  const hasNationwideCharge =
    nationwideCharge != null &&
    Number.isFinite(nationwideCharge) &&
    nationwideCharge >= 0;

  const sameDivision =
    normalize(customerLocation?.division) ===
    normalize(vendorLocation?.division);

  const sameDistrict =
    normalize(customerLocation?.district) ===
    normalize(vendorLocation?.district);

  const sameUpazila =
    normalize(customerLocation?.upazila) ===
    normalize(vendorLocation?.upazila);

  const sameUpazilaLocation =
    hasCustomerLocation &&
    hasVendorLocation &&
    sameDivision &&
    sameDistrict &&
    sameUpazila;

  let availabilityMessage = "ডেলিভারি এলাকা নিশ্চিত নয়";
  let chargeMessage = "নির্ধারিত নয়";

  if (!hasCustomerLocation) {
    availabilityMessage = "লোকেশন সেট করুন";
  } else if (scope === "NATIONWIDE") {
    availabilityMessage = "সারা বাংলাদেশে ডেলিভারি সুবিধা";
    if (hasNationwideCharge) {
      chargeMessage = money(nationwideCharge);
    }
  } else if (scope === "UPAZILA_BASED") {
    if (!hasVendorLocation) {
      availabilityMessage = "বিক্রেতার লোকেশন অপর্যাপ্ত";
    } else if (sameUpazilaLocation) {
      availabilityMessage = "আপনার এলাকায় সরাসরি ডেলিভারি প্রযোজ্য";
      chargeMessage = "দূরত্ব অনুযায়ী নির্ধারিত";
    } else {
      availabilityMessage = "উপজেলা ভিত্তিক সীমিত ডেলিভারি";
    }
  }

  const locationText = [
    customerLocation?.area,
    customerLocation?.upazila,
    customerLocation?.district,
  ]
    .filter((part) => typeof part === "string" && part.trim())
    .join(", ");

  return (
    <aside className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Truck size={16} className="text-[#12233f]" />
          <h2 className="text-sm font-extrabold text-[#12233f]">
            ডেলিভারি অপশন
          </h2>
        </div>
        <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          {scope === "NATIONWIDE" ? "সারাদেশে ডেলিভারি" : "উপজেলা ভিত্তিক"}
        </span>
      </div>

      <div className="space-y-3">
        {/* Customer Location Box */}
        <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-200/70">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-sky-600"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  আপনার ডেলিভারি ঠিকানা
                </p>
                <p className="mt-0.5 text-xs font-bold text-slate-800 truncate">
                  {hasCustomerLocation
                    ? locationText || "ঠিকানা সংরক্ষিত"
                    : "লোকেশন সেট করা নেই"}
                </p>
                {hasCustomerLocation && customerLocation?.address && (
                  <p className="text-[11px] text-slate-500 truncate">
                    {customerLocation.address}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onChangeLocation}
              className="shrink-0 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-sky-100 shadow-2xs"
            >
              <Pencil size={11} />
              <span>{hasCustomerLocation ? "পরিবর্তন" : "সেট করুন"}</span>
            </button>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-2 text-xs">
          {/* Availability */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-slate-500">উপলব্ধ এলাকা:</span>
            <span className="font-semibold text-slate-800 text-right truncate">
              {availabilityMessage}
            </span>
          </div>

          {/* Time & Charge */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-slate-500">ডেলিভারি সময়:</span>
            <span className="font-semibold text-slate-800">
              {delivery.deliveryTime || "২-৪ কার্যদিবস"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-slate-500">ডেলিভারি চার্জ:</span>
            <span className="font-bold text-[#12233f]">
              {!hasCustomerLocation ? "লোকেশন সেট করুন" : chargeMessage}
            </span>
          </div>

          {delivery.freeShippingMinimum !== undefined &&
            delivery.freeShippingMinimum > 0 && (
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                <span>ফ্রি ডেলিভারি অফার:</span>
                <span className="font-bold">
                  {money(delivery.freeShippingMinimum)}+ অর্ডারে
                </span>
              </div>
            )}
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 pt-0.5 text-[11px]">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2">
            <PackageCheck size={14} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">
              {delivery.collectionPoint ? "পিকআপ পয়েন্ট" : "হোম ডেলিভারি"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2">
            <Banknote size={14} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">
              {delivery.cashOnDelivery ? "ক্যাশ অন ডেলিভারি" : "অনলাইন পেমেন্ট"}
            </span>
          </div>
        </div>

        {/* Return & Warranty */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <RotateCcw size={13} className="text-slate-500" />
            <h4 className="text-xs font-bold text-slate-700">
              রিটার্ন ও সেবার নিশ্চয়তা
            </h4>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {returnPolicy.slice(0, 2).map((policy, index) => (
              <div key={index} className="flex items-start gap-1.5 text-slate-600">
                <CheckCircle2
                  size={12}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <span className="leading-tight">{policy}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
              <ShieldCheck size={13} className="text-sky-600 shrink-0" />
              <span>১০০% আসল ও জেনুইন পণ্যের গ্যারান্টি</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
