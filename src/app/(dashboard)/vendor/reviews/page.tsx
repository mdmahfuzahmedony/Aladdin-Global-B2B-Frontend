"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Clock3,
  Search,
  MoreHorizontal,
  Eye,
  Flag,
  Package,
  User,
  RefreshCw,
  X,
} from "lucide-react";
import { createClient } from "../../../../../lib/supabase-client";
import AdminStatCard from "@/components/cards/AdminStatCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type ReviewStatus = "PUBLISHED" | "PENDING" | "HIDDEN";
type StatusFilter = "ALL" | ReviewStatus;

type Review = {
  id: string;
  customer: string;
  email: string;
  product: string;
  productId?: string;
  productImage?: string | null;
  rating: number;
  comment: string;
  status: ReviewStatus;
  date: string;
  verified: boolean;
};

type ReviewStats = {
  total: number;
  published: number;
  pending: number;
  hidden: number;
  averageRating: number;
};

type RatingSummaryItem = {
  rating: number;
  count: number;
  percentage?: number;
};

type ApiResponse = {
  success?: boolean;
  data?: Review[];
  stats?: ReviewStats;
  ratingSummary?: RatingSummaryItem[];
  message?: string;
  error?: string;
};

const EMPTY_STATS: ReviewStats = {
  total: 0,
  published: 0,
  pending: 0,
  hidden: 0,
  averageRating: 0,
};

const STATUS_LABEL: Record<ReviewStatus, string> = {
  PUBLISHED: "Published",
  PENDING: "Pending",
  HIDDEN: "Hidden",
};

const STATUS_STYLE: Record<ReviewStatus, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  HIDDEN: "bg-slate-100 text-slate-600 border-slate-200",
};

const supabase = createClient();

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>(EMPTY_STATS);
  const [ratingSummary, setRatingSummary] = useState<RatingSummaryItem[]>([]);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [viewReview, setViewReview] = useState<Review | null>(null);

  const getToken = useCallback(async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("লগইন সেশন পাওয়া যায়নি। আবার লগইন করো।");
    }

    return token;
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (ratingFilter !== "ALL") {
        params.set("rating", ratingFilter);
      }

      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }

      const query = params.toString();
      const url = `${API_BASE_URL}/api/vendors/reviews${
        query ? `?${query}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || result.error || "রিভিউ লোড করা যায়নি।",
        );
      }

      setReviews(result.data ?? []);

      setStats({
        total: result.stats?.total ?? 0,
        published: result.stats?.published ?? 0,
        pending: result.stats?.pending ?? 0,
        hidden: result.stats?.hidden ?? 0,
        averageRating: result.stats?.averageRating ?? 0,
      });

      setRatingSummary(result.ratingSummary ?? []);
      setSelectedIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "রিভিউ লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [getToken, search, ratingFilter, statusFilter]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const updateReviewStatus = async (id: string, status: ReviewStatus) => {
    setUpdating(true);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API_BASE_URL}/api/vendors/reviews/${encodeURIComponent(id)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Review status update ব্যর্থ হয়েছে।",
        );
      }

      setOpenMenu(null);
      setNotice(`Review ${STATUS_LABEL[status].toLowerCase()} করা হয়েছে।`);

      await loadReviews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status পরিবর্তন করা যায়নি।",
      );
    } finally {
      setUpdating(false);
    }
  };

  const bulkUpdateStatus = async (status: ReviewStatus) => {
    if (!selectedIds.length) {
      setError("আগে অন্তত একটি review select করো।");
      return;
    }

    setUpdating(true);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API_BASE_URL}/api/vendors/reviews/bulk-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ids: selectedIds,
            status,
          }),
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Bulk update ব্যর্থ হয়েছে।",
        );
      }

      setSelectedIds([]);

      setNotice(
        `Selected reviews ${STATUS_LABEL[status].toLowerCase()} করা হয়েছে।`,
      );

      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk update করা যায়নি।");
    } finally {
      setUpdating(false);
    }
  };

  const filteredReviews = reviews;

  const ratingCounts = useMemo(() => {
    return {
      5: ratingSummary.find((item) => item.rating === 5)?.count ?? 0,
      4: ratingSummary.find((item) => item.rating === 4)?.count ?? 0,
      3: ratingSummary.find((item) => item.rating === 3)?.count ?? 0,
      2: ratingSummary.find((item) => item.rating === 2)?.count ?? 0,
      1: ratingSummary.find((item) => item.rating === 1)?.count ?? 0,
    };
  }, [ratingSummary]);

  const allVisibleSelected =
    filteredReviews.length > 0 &&
    filteredReviews.every((review) => selectedIds.includes(review.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) => !filteredReviews.some((review) => review.id === id),
        ),
      );
    } else {
      setSelectedIds((current) => [
        ...new Set([...current, ...filteredReviews.map((review) => review.id)]),
      ]);
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          className={
            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 text-slate-800">
      {/* HEADER — Products Page-এর মতো alignment */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">Customer Reviews</h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Manage and respond to customer product reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadReviews()}
          disabled={loading || updating}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notice"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* ADMIN STAT CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Reviews"
          value={stats.total}
          icon={MessageSquare}
          variant="blue"
          description="All customer reviews"
        />

        <AdminStatCard
          label="Published"
          value={stats.published}
          icon={CheckCircle2}
          variant="green"
          description="Visible to customers"
        />

        <AdminStatCard
          label="Pending Reviews"
          value={stats.pending}
          icon={Clock3}
          variant="orange"
          description="Awaiting moderation"
        />

        <AdminStatCard
          label="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={Star}
          variant="yellow"
          description="Out of 5 stars"
        />
      </div>

      {/* REVIEWS TABLE + SIDEBAR */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <section className="min-w-0 overflow-visible rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#12233F]">
                  All Reviews
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review feedback from your customers
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search reviews..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#D6A419] sm:w-56"
                  />
                </div>

                <select
                  value={ratingFilter}
                  onChange={(event) => setRatingFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
                  aria-label="Filter by rating"
                >
                  <option value="ALL">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
                  aria-label="Filter by status"
                >
                  <option value="ALL">All Status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="PENDING">Pending</option>
                  <option value="HIDDEN">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50 px-5 py-3">
              <span className="text-sm font-semibold text-[#12233F]">
                {selectedIds.length} selected
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => void bulkUpdateStatus("PUBLISHED")}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Publish
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => void bulkUpdateStatus("PENDING")}
                  className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  Set Pending
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => void bulkUpdateStatus("HIDDEN")}
                  className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  Hide
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-12 px-5 py-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all visible reviews"
                      className="h-4 w-4 rounded border-slate-300 accent-[#12233F]"
                    />
                  </th>

                  <th className="px-4 py-4 font-semibold">Customer</th>

                  <th className="px-4 py-4 font-semibold">Product</th>

                  <th className="px-4 py-4 font-semibold">Rating</th>

                  <th className="px-4 py-4 font-semibold">Review</th>

                  <th className="px-4 py-4 font-semibold">Status</th>

                  <th className="px-4 py-4 font-semibold">Date</th>

                  <th className="px-4 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading && reviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-14 text-center text-sm text-slate-500"
                    >
                      Loading reviews...
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-14 text-center">
                      <MessageSquare
                        className="mx-auto mb-3 text-slate-300"
                        size={34}
                      />

                      <p className="font-semibold text-slate-700">
                        No reviews found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(review.id)}
                          onChange={() => toggleSelected(review.id)}
                          aria-label={`Select review by ${review.customer}`}
                          className="h-4 w-4 rounded border-slate-300 accent-[#12233F]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                            <User size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-44 truncate text-sm font-semibold text-slate-800">
                              {review.customer}
                            </p>

                            <p className="max-w-44 truncate text-xs text-slate-500">
                              {review.email || "No email"}
                            </p>

                            {review.verified && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <CheckCircle2 size={12} />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex max-w-48 items-center gap-2">
                          {review.productImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={review.productImage}
                              alt={review.product}
                              className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <Package size={18} />
                            </div>
                          )}

                          <span className="line-clamp-2 text-sm font-medium text-slate-700">
                            {review.product}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {renderStars(review.rating)}

                          <span className="text-xs text-slate-500">
                            {review.rating}.0 / 5
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="line-clamp-3 max-w-64 text-sm leading-5 text-slate-600">
                          {review.comment || "No written feedback"}
                        </p>

                        {(review.comment || "").length > 100 && (
                          <button
                            type="button"
                            onClick={() => setViewReview(review)}
                            className="mt-1 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Read more
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[review.status]}`}
                        >
                          {STATUS_LABEL[review.status]}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                        {formatDate(review.date)}
                      </td>

                      <td className="relative px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu((current) =>
                              current === review.id ? null : review.id,
                            )
                          }
                          aria-label="Review actions"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {openMenu === review.id && (
                          <div className="absolute right-8 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                            <button
                              type="button"
                              onClick={() => {
                                setViewReview(review);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Eye size={15} />
                              View review
                            </button>

                            {review.status !== "PUBLISHED" && (
                              <button
                                type="button"
                                disabled={updating}
                                onClick={() =>
                                  void updateReviewStatus(
                                    review.id,
                                    "PUBLISHED",
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                              >
                                <CheckCircle2 size={15} />
                                Publish
                              </button>
                            )}

                            {review.status !== "PENDING" && (
                              <button
                                type="button"
                                disabled={updating}
                                onClick={() =>
                                  void updateReviewStatus(review.id, "PENDING")
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                              >
                                <Clock3 size={15} />
                                Set pending
                              </button>
                            )}

                            {review.status !== "HIDDEN" && (
                              <button
                                type="button"
                                disabled={updating}
                                onClick={() =>
                                  void updateReviewStatus(review.id, "HIDDEN")
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                              >
                                <Flag size={15} />
                                Hide review
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center">
            <span>
              Showing {filteredReviews.length} review
              {filteredReviews.length === 1 ? "" : "s"}
            </span>

            <span>
              {stats.published} published · {stats.pending} pending ·{" "}
              {stats.hidden} hidden
            </span>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-[#12233F]">Rating Summary</h2>

            <div className="mt-5 flex items-center gap-4">
              <div>
                <p className="text-4xl font-bold text-[#12233F]">
                  {stats.averageRating.toFixed(1)}
                </p>

                <div className="mt-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>

                <p className="mt-1 text-xs text-slate-500">Published reviews</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {([5, 4, 3, 2, 1] as const).map((rating) => {
                const count = ratingCounts[rating];

                const percentage =
                  stats.published > 0
                    ? Math.round((count / stats.published) * 100)
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="flex w-8 items-center gap-1 text-sm text-slate-600">
                      {rating}
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                    </span>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#D6A419] transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-8 text-right text-xs text-slate-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-[#12233F]">Review Status</h2>

            <div className="mt-4 space-y-3">
              <StatusRow
                label="Published"
                count={stats.published}
                color="bg-emerald-500"
              />

              <StatusRow
                label="Pending"
                count={stats.pending}
                color="bg-amber-500"
              />

              <StatusRow
                label="Hidden"
                count={stats.hidden}
                color="bg-slate-400"
              />
            </div>
          </section>
        </aside>
      </div>

      {/* REVIEW DETAILS MODAL */}
      {viewReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setViewReview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="review-dialog-title"
                  className="text-xl font-bold text-[#12233F]"
                >
                  Review Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {viewReview.customer} · {formatDate(viewReview.date)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewReview(null)}
                aria-label="Close review details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5">{renderStars(viewReview.rating)}</div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              {viewReview.product}
            </p>

            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
              {viewReview.comment || "No written feedback"}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[viewReview.status]}`}
              >
                {STATUS_LABEL[viewReview.status]}
              </span>

              <button
                type="button"
                onClick={() => setViewReview(null)}
                className="rounded-xl bg-[#12233F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b3458]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusRow({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-sm text-slate-600">{label}</span>
      </div>

      <span className="text-sm font-bold text-[#12233F]">{count}</span>
    </div>
  );
}
