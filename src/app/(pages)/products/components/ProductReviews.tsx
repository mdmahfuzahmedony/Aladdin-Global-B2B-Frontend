"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createClient } from "../../../../../lib/supabase-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Review = {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
};

type ReviewStats = {
  averageRating?: number;
  totalReviews?: number;
  starCounts?: Record<number, number>;
  mostCommonStar?: number | null;
  maxStarCount?: number;
};

type Props = {
  productId: string;
};

type ReviewApiResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  stats?: ReviewStats;
};

export default function ProductReview({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [stats, setStats] = useState<ReviewStats | null>(null);

  const starCounts = React.useMemo(() => {
    if (stats?.starCounts) return stats.starCounts;
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews, stats]);

  const mostCommonStarInfo = React.useMemo(() => {
    let max = 0;
    let star: number | null = null;
    ([5, 4, 3, 2, 1] as const).forEach((s) => {
      if ((starCounts[s] || 0) > max) {
        max = starCounts[s] || 0;
        star = s;
      }
    });
    return max > 0 && star !== null ? { star, count: max } : null;
  }, [starCounts]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // তোমার বিদ্যমান createClient() ব্যবহার করা হচ্ছে।
  const [supabase] = useState(() => createClient());

  // প্রকাশিত রিভিউ লোড করা।
  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/products/${encodeURIComponent(productId)}/reviews`,
        {
          cache: "no-store",
        },
      );

      const result: ReviewApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "রিভিউ লোড করা যায়নি।");
      }

      const reviewList = Array.isArray(result.data)
        ? (result.data as Review[])
        : [];

      setReviews(reviewList);
      setAverageRating(Number(result.stats?.averageRating ?? 0));
      setTotalReviews(Number(result.stats?.totalReviews ?? 0));
      setStats(result.stats ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "রিভিউ লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // প্রথমবার পেজ খুললে রিভিউ লোড করা।
  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  // বর্তমান Supabase login session পর্যবেক্ষণ করা।
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (mounted) {
        setLoggedIn(!sessionError && !!session?.access_token);
      }
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setLoggedIn(!!session?.access_token);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // নতুন রিভিউ জমা করা।
  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (rating < 1 || rating > 5) {
      setError("১ থেকে ৫ স্টারের মধ্যে রেটিং নির্বাচন করো।");
      return;
    }

    if (!comment.trim()) {
      setError("তোমার রিভিউ লিখো।");
      return;
    }

    try {
      setSubmitting(true);

      // তোমার createClient() থেকে session/token নেওয়া।
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        setLoggedIn(false);
        throw new Error("রিভিউ দিতে প্রথমে লগইন করো।");
      }

      const response = await fetch(
        `${API_URL}/api/products/${encodeURIComponent(productId)}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
        },
      );

      const result: ReviewApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "রিভিউ জমা দেওয়া যায়নি।");
      }

      const submittedData = result.data;
      const status =
        submittedData &&
        typeof submittedData === "object" &&
        "status" in submittedData
          ? String(submittedData.status)
          : "";

      setComment("");
      setRating(0);

      setSuccess(
        status === "PUBLISHED"
          ? "তোমার রিভিউ প্রকাশিত হয়েছে।"
          : "রিভিউ জমা হয়েছে। Vendor অনুমোদন করলে এটি প্রকাশিত হবে।",
      );

      // POST-এর পরে GET করে সর্বশেষ প্রকাশিত রিভিউ লোড করা।
      await fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "রিভিউ জমা দেওয়া যায়নি।");
    } finally {
      setSubmitting(false);
    }
  };

  const safeRating = Math.min(5, Math.max(0, Math.round(averageRating)));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {/* Rating summary */}
      <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 via-slate-50/60 to-white p-5 sm:p-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big score & most common badge */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-200/80 pb-5 md:pb-0 md:pr-6 text-center md:text-left space-y-2.5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#12233f]">
                Customer Reviews
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ক্রেতাদের বাস্তব অভিজ্ঞতা ও স্টার রেটিং
              </p>
            </div>

            <div className="flex items-baseline justify-center md:justify-start gap-2 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-[#12233f] tracking-tight">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>

            <div className="flex justify-center md:justify-start text-amber-500 text-base tracking-wider" aria-label="গড় রেটিং">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {totalReviews > 0 && i < Math.round(averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>

            <p className="text-xs font-semibold text-slate-600">
              মোট {totalReviews} টি প্রকাশিত রিভিউ
            </p>

            {mostCommonStarInfo && totalReviews > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900 mt-1 shadow-sm">
                <span>🔥 সবচেয়ে বেশি পেয়েছে:</span>
                <span className="text-amber-950 font-extrabold">
                  {mostCommonStarInfo.star}★ ({mostCommonStarInfo.count} টি)
                </span>
              </div>
            )}
          </div>

          {/* Right Column: 5★ to 1★ Progress Breakdown */}
          <div className="md:col-span-7 space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              স্টার রেটিং ব্রেকডাউন (Rating Breakdown)
            </p>

            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = starCounts[star] || 0;
              const percentage =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              const isTop = mostCommonStarInfo?.star === star && count > 0;

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-9 font-bold text-slate-700 flex items-center gap-0.5 shrink-0">
                    {star} <span className="text-amber-500">★</span>
                  </span>

                  <div className="flex-1 h-3 rounded-full bg-slate-200/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTop
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : "bg-amber-300"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-medium text-slate-500 shrink-0">
                    {percentage}%
                  </span>

                  <span className="w-10 text-right font-semibold text-slate-700 shrink-0">
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review form */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <h3 className="text-lg font-bold text-[#12233f]">Write a Review</h3>

        {!loggedIn && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            রিভিউ জমা দিতে প্রথমে লগইন করো।
          </p>
        )}

        <form onSubmit={submitReview} className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              তোমার রেটিং
            </p>

            <div
              className="flex gap-2"
              role="group"
              aria-label="রেটিং নির্বাচন"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} স্টার`}
                  aria-pressed={rating === star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="product-review-comment"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              তোমার অভিজ্ঞতা
            </label>

            <textarea
              id="product-review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="প্রোডাক্টটি কেমন লেগেছে লিখো..."
              rows={4}
              maxLength={2000}
              required
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-[#12233f] focus:ring-2 focus:ring-slate-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {comment.length}/2000
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !loggedIn}
            className="rounded-xl bg-[#12233f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3155] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "জমা হচ্ছে..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Published reviews */}
      <div className="mt-9 border-t border-slate-100 pt-6">
        <h3 className="text-lg font-bold text-[#12233f]">
          Customer Feedback ({totalReviews})
        </h3>

        {loading ? (
          <p className="py-8 text-sm text-slate-500">রিভিউ লোড হচ্ছে...</p>
        ) : reviews.length === 0 ? (
          <p className="py-8 text-sm text-slate-500">
            এখনো কোনো প্রকাশিত রিভিউ নেই। প্রথম রিভিউটি দাও!
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {reviews.map((review) => {
              const reviewRating = Math.min(
                5,
                Math.max(0, Math.floor(Number(review.rating) || 0)),
              );

              return (
                <article key={review.id} className="py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-[#12233f]">
                      {review.customer?.charAt(0)?.toUpperCase() || "C"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-[#12233f]">
                          {review.customer || "Customer"}
                        </p>

                        <time className="text-xs text-slate-400">
                          {review.date && !Number.isNaN(Date.parse(review.date))
                            ? new Date(review.date).toLocaleDateString("bn-BD")
                            : ""}
                        </time>
                      </div>

                      <div
                        className="mt-1 text-sm text-amber-500"
                        aria-label={`${reviewRating} out of 5 stars`}
                      >
                        {"★".repeat(reviewRating)}
                        {"☆".repeat(5 - reviewRating)}
                      </div>

                      {review.verified && (
                        <p className="mt-1 text-xs font-medium text-green-700">
                          ✓ Verified Purchase
                        </p>
                      )}

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
