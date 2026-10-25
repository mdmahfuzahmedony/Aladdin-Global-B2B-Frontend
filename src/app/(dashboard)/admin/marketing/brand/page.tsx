"use client";



import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import BrandModal from "@/components/modals/Add/BrandModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { createClient } from "../../../../../../lib/supabase-client";

// =====================================================
// API
// =====================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// =====================================================
// TYPES
// =====================================================

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type BrandModalData = {
  name: string;
  slug: string;
  logoFile: File | null;
  status: string;
};

// =====================================================
// PAGE
// =====================================================

export default function BrandManagementPage() {
  const supabase = createClient();

  // ===================================================
  // STATE
  // ===================================================

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  // ===================================================
  // FETCH BRANDS
  // ===================================================

  const fetchBrands = useCallback(
    async (showRefreshLoader = false): Promise<boolean> => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(`${API_URL}/api/brands`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error || "Failed to fetch brands",
          );
        }

        setBrands(Array.isArray(result?.data) ? result.data : []);

        return true;
      } catch (error: unknown) {
        console.error("GET BRANDS ERROR:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load brands";

        toast.error(message);

        return false;
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  // ===================================================
  // FILTERED BRANDS
  // ===================================================

  const filteredBrands = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return brands;
    }

    return brands.filter((brand) => {
      return (
        brand.name?.toLowerCase().includes(keyword) ||
        brand.slug?.toLowerCase().includes(keyword)
      );
    });
  }, [brands, search]);

  // ===================================================
  // BRAND STATS
  // ===================================================

  const activeBrands = useMemo(() => {
    return brands.filter(
      (brand) => brand.status?.toLowerCase() === "active",
    ).length;
  }, [brands]);

  const inactiveBrands = useMemo(() => {
    return brands.filter(
      (brand) => brand.status?.toLowerCase() !== "active",
    ).length;
  }, [brands]);

  // ===================================================
  // BRAND CREATED
  // ===================================================

  const handleSaveBrand = async (_brandData: BrandModalData) => {
    // BrandModal performs the actual API creation.
    // This callback is expected to run after successful creation.
    setIsBrandModalOpen(false);

    // Show success independently of the list refresh.
    toast.success("Brand added successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

    // Refresh the brand list from the database.
    await fetchBrands(true);
  };

  // ===================================================
  // DELETE BRAND
  // ===================================================

  const handleDeleteBrand = async (brand: Brand) => {
    try {
      setDeletingId(brand.id);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("SESSION ERROR:", sessionError);
        throw new Error("Unable to get login session");
      }

      if (!session?.access_token) {
        throw new Error("লগইন করা নেই। আগে login করুন।");
      }

      const response = await fetch(
        `${API_URL}/api/brands/${brand.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Failed to delete brand",
        );
      }

      setBrands((prev) =>
        prev.filter((item) => item.id !== brand.id),
      );

      toast.success(
        result?.message || "Brand deleted successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        },
      );
    } catch (error: unknown) {
      console.error("DELETE BRAND ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete brand";

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "-";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===================================================
  // STATUS
  // ===================================================

  const renderStatus = (status: string) => {
    const isActive = status?.toLowerCase() === "active";

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
        {status || "Inactive"}
      </span>
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Award size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
                Brand Management
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage all brands available in your store.
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2
              size={30}
              className="animate-spin text-emerald-600"
            />
            <p className="text-sm font-medium">Loading brands...</p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN
  // ===================================================

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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Award size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
                Brand Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage all brands available in your store.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBrandModalOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
          >
            <Plus size={18} />
            Add Brand
          </button>
        </div>
      </div>

      {/* BRAND STAT CARDS */}

      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#12233F]">
            Brand Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your store brands.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <AdminStatCard
            label="Total Brands"
            value={brands.length}
            icon={Award}
            variant="green"
            description="Total brands created"
          />

          <AdminStatCard
            label="Active Brands"
            value={activeBrands}
            icon={CheckCircle2}
            variant="blue"
            description="Currently active brands"
          />

          <AdminStatCard
            label="Inactive Brands"
            value={inactiveBrands}
            icon={XCircle}
            variant="orange"
            description="Currently inactive brands"
          />

          <AdminStatCard
            label="Showing"
            value={filteredBrands.length}
            icon={Search}
            variant="purple"
            description="Brands matching your search"
          />
        </div>
      </section>

      {/* BRAND LIST */}

      <section>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#12233F]">
                  All Brands
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all brands.
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
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search brand..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-[240px]"
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
                  onClick={() => void fetchBrands(true)}
                  disabled={refreshing}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* EMPTY STATE */}

          {filteredBrands.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Award size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#12233F]">
                {search
                  ? "No brands found"
                  : "No brands created yet"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {search
                  ? "Try searching with another brand name or slug."
                  : "Create your first brand to start managing your store brands."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={17} />
                  Add Brand
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Brand
                      </th>

                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Slug
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
                    {filteredBrands.map((brand) => (
                      <tr
                        key={brand.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                              {brand.logo ? (
                                <img
                                  src={brand.logo}
                                  alt={brand.name}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <Award
                                  size={20}
                                  className="text-slate-400"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#12233F]">
                                {brand.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Brand
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {brand.slug}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {renderStatus(brand.status)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock3 size={14} />
                            {formatDate(brand.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteBrand(brand)
                            }
                            disabled={deletingId === brand.id}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === brand.id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}

                            {deletingId === brand.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="space-y-3 p-4 md:hidden">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Award
                              size={20}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-[#12233F]">
                            {brand.name}
                          </h3>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {brand.slug}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {renderStatus(brand.status)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                        <Clock3 size={13} className="shrink-0" />
                        <span>{formatDate(brand.createdAt)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDeleteBrand(brand)
                        }
                        disabled={deletingId === brand.id}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === brand.id ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}

                        {deletingId === brand.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* BRAND MODAL */}

      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={handleSaveBrand}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await handleDeleteBrand(deleteTarget);
        }}
        isLoading={Boolean(deletingId)}
        title="ব্র্যান্ড মুছে ফেলতে চান?"
        description={`আপনি কি নিশ্চিতভাবে "${deleteTarget?.name}" ব্র্যান্ডটি ডিলিট করতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
      />
    </div>
  );
}
