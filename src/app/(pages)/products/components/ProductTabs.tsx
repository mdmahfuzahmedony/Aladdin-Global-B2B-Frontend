"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import type { ProductDetails } from "../types";
import ProductReview from "./ProductReviews";
import {
  FileText,
  Sliders,
  Store,
  MessageSquareQuote,
  HelpCircle,
  Star,
  Clock,
  ShieldCheck,
  ThumbsUp,
  MapPin,
  ExternalLink,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type TabKey =
  | "description"
  | "specification"
  | "vendor"
  | "reviews"
  | "questions";

type Props = {
  product: ProductDetails;
};

export default function ProductTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  // Vendor rating interaction state
  const vendorStorageKey = `aladin_vendor_rating_${product.vendor.id || product.sellerId || "default"}`;
  const [vendorRating, setVendorRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [vendorComment, setVendorComment] = useState<string>("");
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [hasRatedVendor, setHasRatedVendor] = useState<boolean>(false);
  const [savedRatingData, setSavedRatingData] = useState<{
    rating: number;
    comment: string;
    aspects: string[];
    date: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(vendorStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedRatingData(parsed);
        setHasRatedVendor(true);
      }
    } catch {
      // Ignore local storage parse error
    }
  }, [vendorStorageKey]);

  const ratingAspects = [
    "পণ্যের গুণমান ও সঠিকতা",
    "নিরাপদ ও সুন্দর প্যাকেজিং",
    "দ্রুত শিপিং ও ডেলিভারি",
    "বন্ধুসুলভ বিক্রেতা সহায়তা",
  ];

  const handleToggleAspect = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
    );
  };

  const handleSubmitVendorRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorRating === 0) {
      toast.warning("অনুগ্রহ করে বিক্রেতার সার্ভিসের জন্য স্টার রেটিং সিলেক্ট করুন।");
      return;
    }

    setIsSubmittingRating(true);
    setTimeout(() => {
      const submission = {
        rating: vendorRating,
        comment: vendorComment.trim(),
        aspects: selectedAspects,
        date: new Date().toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      try {
        localStorage.setItem(vendorStorageKey, JSON.stringify(submission));
      } catch {
        // Ignore
      }

      setSavedRatingData(submission);
      setHasRatedVendor(true);
      setIsSubmittingRating(false);
      toast.success("ধন্যবাদ! আপনার সেলার রেটিং সফলভাবে জমা হয়েছে।");
    }, 400);
  };

  const getStarRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return "অসাধারণ সার্ভিস (Excellent)";
      case 4:
        return "খুব ভালো (Very Good)";
      case 3:
        return "ভালো (Good)";
      case 2:
        return "মোটামুটি (Fair)";
      case 1:
        return "সন্তোষজনক নয় (Poor)";
      default:
        return "রেটিং নির্বাচন করুন";
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "description",
      label: "Description",
      icon: <FileText size={15} />,
    },
    {
      key: "specification",
      label: "Specification",
      icon: <Sliders size={15} />,
    },
    {
      key: "vendor",
      label: "Vendor Information",
      icon: <Store size={15} />,
    },
    {
      key: "reviews",
      label: `Customer Reviews (${product.reviewCount || 0})`,
      icon: <MessageSquareQuote size={15} />,
    },
    {
      key: "questions",
      label: "Questions & Answer",
      icon: <HelpCircle size={15} />,
    },
  ];

  const positiveRatingPercent =
    product.vendor.positiveSellerRating > 0
      ? product.vendor.positiveSellerRating
      : 96;

  const shippingOnTimePercent =
    product.vendor.shippingOnTime > 0
      ? product.vendor.shippingOnTime
      : 98;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Tabs Header */}
      <div className="overflow-x-auto no-scrollbar scroll-smooth border-b border-slate-200/80 bg-slate-50/60">
        <div className="flex min-w-max px-2 sm:px-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold transition ${
                activeTab === tab.key
                  ? "text-[#12233f]"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span className={activeTab === tab.key ? "text-[#f59e0b]" : "text-slate-400"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>

              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#f59e0b] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[220px] p-4 sm:p-6 lg:p-7">
        {/* Description */}
        {activeTab === "description" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#12233f]">
              Product Description
            </h3>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
              {product.description || "No description available for this product."}
            </div>
          </div>
        )}

        {/* Specification */}
        {activeTab === "specification" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#12233f]">
              Product Specifications
            </h3>

            {product.specifications?.length ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {product.specifications.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className={`grid grid-cols-1 sm:grid-cols-3 border-b border-slate-100 last:border-0 ${
                      index % 2 === 0 ? "bg-slate-50/70" : "bg-white"
                    } p-3 text-xs`}
                  >
                    <span className="font-medium text-slate-500">
                      {item.label}
                    </span>
                    <span className="font-semibold text-slate-800 sm:col-span-2">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No specifications listed for this product.
              </p>
            )}
          </div>
        )}

        {/* Vendor Information */}
        {activeTab === "vendor" && (
          <div className="space-y-6">
            {/* 1. Vendor Profile Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/20 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#12233f] text-xl font-bold text-white shadow-sm">
                  {product.vendor.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[#12233f]">
                      {product.vendor.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Merchant
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{product.vendor.location || "Bangladesh"}</span>
                  </div>
                </div>
              </div>

              {product.sellerId && (
                <Link
                  href={`/vendor/store/${product.sellerId}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#12233f] px-4 py-2 text-xs font-bold text-[#12233f] transition hover:bg-[#12233f] hover:text-white"
                >
                  <span>দোকান ভিজিট করুন</span>
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>

            {/* 2. Vendor Performance Metrics */}
            <div>
              <h4 className="text-sm font-bold text-[#12233f] mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>বিক্রেতার পারফরম্যান্স ও রেটিং স্কোর</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Positive Seller Rating
                    </p>
                    <ThumbsUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-[#12233f]">
                    {positiveRatingPercent}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    সন্তুষ্ট ক্রেতাদের ইতিবাচক মূল্যায়ন
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Shipping On Time
                    </p>
                    <Clock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-emerald-700">
                    {shippingOnTimePercent}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    নির্দিষ্ট সময়ে অর্ডার হ্যান্ডওভার ও শিপিং
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Response Rate
                    </p>
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-indigo-900">
                    99%
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    গ্রাহকের প্রশ্নের অতি দ্রুত উত্তর প্রদান
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Overall Score
                    </p>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-amber-600">
                    {product.vendor.averageRating || 4.8} / 5.0
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    সার্বিক ভেন্ডর সার্ভিস মান
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Customer Vendor Rating Interactive Section */}
            <div className="mt-6 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-[#12233f] flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span>Rate This Seller (বিক্রেতাকে রেটিং দিন)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    এই বিক্রেতার পণ্য ও সার্ভিস আপনার কেমন লেগেছে? আপনার সৎ রেটিং অন্য ক্রেতাদের সহায়তা করবে।
                  </p>
                </div>

                {hasRatedVendor && (
                  <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    রেটিং জমা দেওয়া হয়েছে
                  </span>
                )}
              </div>

              {hasRatedVendor && savedRatingData ? (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-slate-700">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= savedRatingData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="font-bold text-slate-800 ml-1">
                        {savedRatingData.rating}★ ({getStarRatingLabel(savedRatingData.rating)})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{savedRatingData.date}</span>
                  </div>

                  {savedRatingData.aspects?.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {savedRatingData.aspects.map((aspect) => (
                        <span
                          key={aspect}
                          className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200"
                        >
                          ✓ {aspect}
                        </span>
                      ))}
                    </div>
                  )}

                  {savedRatingData.comment && (
                    <p className="mt-2.5 italic text-slate-600">
                      &ldquo;{savedRatingData.comment}&rdquo;
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-emerald-200/60 pt-2.5">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      আপনার মূল্যায়নের জন্য ধন্যবাদ!
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasRatedVendor(false)}
                      className="text-[11px] font-bold text-slate-500 hover:text-[#12233f] underline"
                    >
                      রেটিং পরিবর্তন করুন
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitVendorRating} className="mt-5 space-y-4">
                  {/* Star Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ১. সামগ্রিক সেলার রেটিং নির্বাচন করুন:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setVendorRating(star)}
                          className="p-1 transition hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 sm:h-7 sm:w-7 transition ${
                              star <= (hoverRating || vendorRating)
                                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                : "text-slate-300 hover:text-amber-200"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-slate-700">
                        {getStarRatingLabel(hoverRating || vendorRating)}
                      </span>
                    </div>
                  </div>

                  {/* Rating Aspects */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ২. বিক্রেতার কোন দিকগুলো আপনার ভালো লেগেছে? (ক্লিক করে নির্বাচন করুন):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ratingAspects.map((aspect) => {
                        const isSelected = selectedAspects.includes(aspect);
                        return (
                          <button
                            key={aspect}
                            type="button"
                            onClick={() => handleToggleAspect(aspect)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                              isSelected
                                ? "bg-[#12233f] text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {aspect}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ৩. বিক্রেতা সম্পর্কে আপনার মন্তব্য (ঐচ্ছিক):
                    </label>
                    <textarea
                      rows={2}
                      value={vendorComment}
                      onChange={(e) => setVendorComment(e.target.value)}
                      placeholder="যেমন: প্যাকেজিং অনেক ভালো ছিল, নির্ধারিত সময়ে পণ্য হাতে পেয়েছি..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#12233f] focus:outline-none focus:ring-1 focus:ring-[#12233f]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingRating || vendorRating === 0}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-sm ${
                        vendorRating === 0 || isSubmittingRating
                          ? "cursor-not-allowed bg-slate-200 text-slate-400"
                          : "bg-[#12233f] text-white hover:bg-[#1b3155]"
                      }`}
                    >
                      <Send size={13} />
                      <span>{isSubmittingRating ? "জমা হচ্ছে..." : "রেটিং সাবমিট করুন"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#12233f]">
              Customer Reviews ({product.reviewCount || 0})
            </h3>

            <div className="mt-4">
              <ProductReview productId={product.id} />
            </div>
          </div>
        )}

        {/* Questions & Answer */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#12233f]">
              Questions &amp; Answer
            </h3>

            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center space-y-2">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
              <p className="font-bold text-slate-700 text-sm">
                Have questions about this product?
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Get answers from the seller or other customers who bought this product.
              </p>
              <button
                type="button"
                onClick={() => {
                  toast.info("Question & Answer সুবিধাটি খুব শীঘ্রই আসছে!");
                }}
                className="mt-3 inline-flex items-center rounded-xl bg-[#12233f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b3155]"
              >
                Ask a Question
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}
