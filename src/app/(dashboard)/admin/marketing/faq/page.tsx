"use client";


import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

import { toast } from "react-toastify";
import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../../../lib/supabase-client";
import FAQAddModal, { FAQModalData } from "./Components/FAQAddModal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // =========================================
  // GET ACCESS TOKEN
  // =========================================

  const getAccessToken = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("SESSION ERROR:", error);
      throw new Error("Unable to get login session.");
    }

    if (!session?.access_token) {
      throw new Error("লগইন করা নেই। আগে লগইন করুন।");
    }

    return session.access_token;
  }, [supabase]);

  // =========================================
  // SAFE API RESPONSE
  // =========================================

  const parseResponse = async (response: Response): Promise<any> => {
    const text = await response.text();

    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server থেকে সঠিক response পাওয়া যায়নি।");
    }
  };

  const checkResponse = (response: Response, result: any) => {
    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.message ||
          result?.error ||
          `Request failed (${response.status}).`,
      );
    }
  };

  // =========================================
  // FETCH FAQS
  // =========================================

  const fetchFAQs = useCallback(
    async (showRefreshToast = false): Promise<boolean> => {
      try {
        if (showRefreshToast) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const accessToken = await getAccessToken();

        const response = await fetch(`${API_URL}/api/faqs/admin`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await parseResponse(response);
        checkResponse(response, result);

        if (!Array.isArray(result?.data)) {
          throw new Error("FAQ data সঠিক format-এ পাওয়া যায়নি।");
        }

        setFaqs(result.data);

        if (showRefreshToast) {
          toast.success("FAQs refreshed successfully!");
        }

        return true;
      } catch (error: unknown) {
        console.error("GET FAQS ERROR:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load FAQs.",
        );

        return false;
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getAccessToken],
  );

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    void fetchFAQs();
  }, [fetchFAQs]);

  // =========================================
  // FILTERED FAQS
  // =========================================

  const filteredFAQs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return faqs;

    return faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)
      );
    });
  }, [faqs, search]);

  // =========================================
  // FAQ STATS
  // =========================================

  const activeFAQs = useMemo(
    () => faqs.filter((faq) => faq.isActive).length,
    [faqs],
  );

  const inactiveFAQs = useMemo(
    () => faqs.filter((faq) => !faq.isActive).length,
    [faqs],
  );

  // =========================================
  // FAQ CREATED
  // =========================================

  const handleSaveFAQ = async (_faqData: FAQModalData) => {
    // FAQAddModal থেকে এই callback সফল create-এর পর আসা উচিত।
    setIsFAQModalOpen(false);

    toast.success("FAQ added successfully!");

    // Create সফল হওয়ার পরে list refresh।
    // Refresh ব্যর্থ হলে fetchFAQs নিজেই error toast দেখাবে।
    await fetchFAQs();
  };

  // =========================================
  // OPEN DELETE MODAL
  // =========================================

  const openDeleteModal = (faq: FAQ) => {
    if (deletingId) return;
    setFaqToDelete(faq);
  };

  // =========================================
  // DELETE FAQ
  // =========================================

  const handleDeleteFAQ = async () => {
    if (!faqToDelete || deletingId) return;

    const faq = faqToDelete;

    try {
      setDeletingId(faq.id);

      const accessToken = await getAccessToken();

      const response = await fetch(
        `${API_URL}/api/faqs/${encodeURIComponent(faq.id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await parseResponse(response);
      checkResponse(response, result);

      // API success হলে তবেই list থেকে remove।
      setFaqs((prev) => prev.filter((item) => item.id !== faq.id));
      setFaqToDelete(null);

      toast.success(result?.message || "FAQ deleted successfully!");
    } catch (error: unknown) {
      console.error("DELETE FAQ ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete FAQ.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // STATUS
  // =========================================

  const renderStatus = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={13} />
          Active
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        <XCircle size={13} />
        Inactive
      </span>
    );
  };

  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/admin/marketing"
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back to Marketing
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <HelpCircle size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
                FAQ Management
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage frequently asked questions shown on your website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 size={30} className="animate-spin text-pink-600" />
            <p className="text-sm font-medium">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
      {/* HEADER */}

      <div className="mb-7">
        <Link
          href="/admin/marketing"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Back to Marketing
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <HelpCircle size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
                FAQ Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage frequently asked questions shown on your website.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFAQModalOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 sm:w-auto"
          >
            <Plus size={18} />
            Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ OVERVIEW */}

      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#12233F]">
            FAQ Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your frequently asked questions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <AdminStatCard
            label="Total FAQs"
            value={faqs.length}
            icon={HelpCircle}
            variant="pink"
            description="Total FAQs created"
          />

          <AdminStatCard
            label="Active FAQs"
            value={activeFAQs}
            icon={CheckCircle2}
            variant="green"
            description="Currently visible FAQs"
          />

          <AdminStatCard
            label="Inactive FAQs"
            value={inactiveFAQs}
            icon={XCircle}
            variant="orange"
            description="Currently hidden FAQs"
          />

          <AdminStatCard
            label="Showing"
            value={filteredFAQs.length}
            icon={Search}
            variant="purple"
            description="FAQs matching your search"
          />
        </div>
      </section>

      {/* FAQ LIST */}

      <section>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#12233F]">
                  All FAQs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all frequently asked questions.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                {/* SEARCH */}

                <div className="relative w-full sm:w-auto">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search FAQ..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:w-[280px]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                </div>

                {/* REFRESH */}

                <button
                  type="button"
                  onClick={() => void fetchFAQs(true)}
                  disabled={refreshing}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {/* EMPTY STATE */}

          {filteredFAQs.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-400">
                <HelpCircle size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#12233F]">
                {search ? "No FAQs found" : "No FAQs created yet"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {search
                  ? "Try searching with another question or answer."
                  : "Create your first FAQ to start managing your website questions."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() => setIsFAQModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  <Plus size={17} />
                  Add FAQ
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Question
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Answer
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Created
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredFAQs.map((faq) => (
                      <tr
                        key={faq.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="max-w-[350px] px-5 py-4">
                          <p className="line-clamp-2 text-sm font-bold text-[#12233F]">
                            {faq.question}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Sort order: {faq.sortOrder}
                          </p>
                        </td>

                        <td className="max-w-[400px] px-5 py-4">
                          <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                            {faq.answer}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {renderStatus(faq.isActive)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock3 size={14} />
                            {formatDate(faq.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openDeleteModal(faq)}
                            disabled={deletingId !== null}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="space-y-3 p-4 md:hidden">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                          <HelpCircle size={19} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-sm font-bold text-[#12233F]">
                            {faq.question}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            Sort order: {faq.sortOrder}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {renderStatus(faq.isActive)}
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
                      <p className="line-clamp-4 text-xs leading-5 text-slate-600">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                        <Clock3 size={13} className="shrink-0" />
                        <span>{formatDate(faq.createdAt)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(faq)}
                        disabled={deletingId !== null}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* DELETE CONFIRMATION MODAL */}

      {faqToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!deletingId) setFaqToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-faq-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2
              id="delete-faq-title"
              className="mt-4 text-center text-xl font-bold text-[#12233F]"
            >
              Delete FAQ?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete this FAQ? This action cannot
              be undone.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="line-clamp-3 text-sm font-semibold text-slate-700">
                {faqToDelete.question}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => setFaqToDelete(null)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => void handleDeleteFAQ()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === faqToDelete.id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FAQ MODAL */}

      <FAQAddModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
        onSave={handleSaveFAQ}
      />
    </div>
  );
}
