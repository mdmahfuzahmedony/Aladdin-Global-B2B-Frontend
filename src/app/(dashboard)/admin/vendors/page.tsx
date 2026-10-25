"use client";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
  Clock,
  Store,
  Users,
  AlertTriangle,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";
import AdminStatCard from "@/components/cards/AdminStatCard";
import VendorDetailsSidebar from "./sidebar/VendorDetailsSidebar";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

type Vendor = {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  status: VendorStatus;
  joined: string;
  location: string;
  hasPendingChangeRequest?: boolean;
  pendingChangeRequest?: any;
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"ALL" | VendorStatus>("ALL");

  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [onlyChangeRequests, setOnlyChangeRequests] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // =====================================================
  // SIDEBAR STATE
  // =====================================================

  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    vendorId: string | null;
    storeName: string;
    isBulk?: boolean;
  }>({
    isOpen: false,
    vendorId: null,
    storeName: "",
    isBulk: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // =====================================================
  // SUPABASE
  // =====================================================

  const supabase = createClient();

  const getAccessToken = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (!session?.access_token) {
      throw new Error("লগইন করা নেই");
    }

    return session.access_token;
  };

  // =====================================================
  // FETCH VENDORS
  // =====================================================

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = await getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || result?.message || "Failed to fetch vendors",
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.error || result?.message || "Failed to fetch vendors",
        );
      }

      const mappedVendors: Vendor[] = (result.data || []).map(
        (vendor: any) => ({
          id: String(vendor.id),

          storeName: vendor.storeName || "Unnamed Store",

          ownerName: vendor.fullName || "Unknown Owner",

          email: vendor.email || "No email",

          phone: vendor.phone || "No phone",

          category: vendor.businessCategory || "Not specified",

          status: vendor.status as VendorStatus,

          joined: vendor.createdAt
            ? new Date(vendor.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—",

          location:
            [vendor.location?.district, vendor.location?.division]
              .filter(Boolean)
              .join(", ") || "Not specified",

          hasPendingChangeRequest: Boolean(vendor.hasPendingChangeRequest),

          pendingChangeRequest: vendor.pendingChangeRequest ?? null,
        }),
      );

      setVendors(mappedVendors);
    } catch (err: any) {
      console.error("Fetch Vendors Error:", err);

      setError(err?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        vendor.storeName.toLowerCase().includes(searchText) ||
        vendor.ownerName.toLowerCase().includes(searchText) ||
        vendor.email.toLowerCase().includes(searchText) ||
        vendor.phone.includes(search);

      const matchesStatus =
        statusFilter === "ALL" || vendor.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || vendor.category === categoryFilter;

      const matchesChangeRequest =
        !onlyChangeRequests || vendor.hasPendingChangeRequest;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesChangeRequest
      );
    });
  }, [vendors, search, statusFilter, categoryFilter, onlyChangeRequests]);

  // =====================================================
  // STATS
  // =====================================================

  const totalVendors = vendors.length;

  const activeVendors = vendors.filter((v) => v.status === "APPROVED").length;

  const pendingVendors = vendors.filter((v) => v.status === "PENDING").length;

  const suspendedVendors = vendors.filter(
    (v) => v.status === "SUSPENDED",
  ).length;

  const pendingChangeRequestsCount = vendors.filter(
    (v) => v.hasPendingChangeRequest
  ).length;

  // =====================================================
  // SELECT
  // =====================================================

  const allFilteredSelected =
    filteredVendors.length > 0 &&
    filteredVendors.every((vendor) => selectedIds.includes(vendor.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !filteredVendors.some((vendor) => vendor.id === id),
        ),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...filteredVendors.map((vendor) => vendor.id)]),
      ]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const confirmDeleteVendor = (id: string, storeName: string) => {
    setDeleteModal({
      isOpen: true,
      vendorId: id,
      storeName,
      isBulk: false,
    });
  };

  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      vendorId: null,
      storeName: `${selectedIds.length}টি নির্বাচিত ভেন্ডর`,
      isBulk: true,
    });
  };

  const handleDeleteConfirmed = async () => {
    try {
      setIsDeleting(true);
      const token = await getAccessToken();

      if (deleteModal.isBulk) {
        const response = await fetch(`${API_BASE_URL}/api/vendors/bulk`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: selectedIds }),
        });

        const res = await response.json();
        if (!response.ok) {
          throw new Error(res?.message || res?.error || "ভেন্ডর মুছে ফেলা ব্যর্থ হয়েছে");
        }

        setVendors((prev) => prev.filter((v) => !selectedIds.includes(v.id)));
        if (selectedVendorId && selectedIds.includes(selectedVendorId)) {
          setSelectedVendorId(null);
        }
        toast.success(res?.message || `${selectedIds.length}টি ভেন্ডর সফলভাবে মুছে ফেলা হয়েছে!`);
        setSelectedIds([]);
        await fetchVendors();
      } else if (deleteModal.vendorId) {
        const id = deleteModal.vendorId;
        const response = await fetch(`${API_BASE_URL}/api/vendors/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await response.json();
        if (!response.ok) {
          throw new Error(res?.message || res?.error || "ভেন্ডর মুছে ফেলা ব্যর্থ হয়েছে");
        }

        setVendors((prev) => prev.filter((v) => v.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        if (selectedVendorId === id) {
          setSelectedVendorId(null);
        }
        toast.success(`ভেন্ডর "${deleteModal.storeName}" ডাটাবেজ থেকে সফলভাবে মুছে ফেলা হয়েছে!`);
        await fetchVendors();
      }
      setDeleteModal({ isOpen: false, vendorId: null, storeName: "", isBulk: false });
    } catch (err: any) {
      console.error("Delete Vendor Error:", err);
      toast.error(err?.message || "ভেন্ডর মুছে ফেলতে সমস্যা হয়েছে");
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const updateStatus = async (id: string, status: VendorStatus) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/vendors/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res?.message || res?.error || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
      }

      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === id
            ? {
                ...vendor,
                status,
              }
            : vendor,
        ),
      );

      toast.success(
        status === "APPROVED"
          ? "ভেন্ডর সফলভাবে সক্রিয় করা হয়েছে!"
          : status === "SUSPENDED"
          ? "ভেন্ডর সাময়িকভাবে স্থগিত করা হয়েছে"
          : "স্ট্যাটাস পরিবর্তন সফল হয়েছে"
      );
    } catch (err: any) {
      console.error("Update Status Error:", err);
      toast.error(err?.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleBulkUpdateStatus = async (status: VendorStatus) => {
    if (selectedIds.length === 0) return;
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/vendors/bulk-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedIds, status }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res?.message || res?.error || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
      }

      setVendors((prev) =>
        prev.map((vendor) =>
          selectedIds.includes(vendor.id)
            ? { ...vendor, status }
            : vendor
        )
      );

      toast.success(
        status === "APPROVED"
          ? `${selectedIds.length}টি ভেন্ডর সফলভাবে সক্রিয় করা হয়েছে!`
          : `${selectedIds.length}টি ভেন্ডর সাময়িকভাবে স্থগিত করা হয়েছে`
      );
      setSelectedIds([]);
    } catch (err: any) {
      console.error("Bulk update status error:", err);
      toast.error(err?.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [...new Set(vendors.map((vendor) => vendor.category))];

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const StatusBadge = ({ status }: { status: VendorStatus }) => {
    const styles: Record<VendorStatus, string> = {
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",

      PENDING: "bg-amber-50 text-amber-700 border-amber-200",

      SUSPENDED: "bg-red-50 text-red-700 border-red-200",

      REJECTED: "bg-slate-100 text-slate-600 border-slate-200",
    };

    const icons: Record<VendorStatus, React.ReactNode> = {
      APPROVED: <CheckCircle size={13} />,

      PENDING: <Clock size={13} />,

      SUSPENDED: <Ban size={13} />,

      REJECTED: <AlertTriangle size={13} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
              Vendors
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage sellers, approvals and vendor accounts
            </p>
          </div>

          <Link
            href="/become-seller"
            className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold md:w-auto"
          >
            <Plus size={18} />
            Add Vendor
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <AdminStatCard
            label="Total Vendors"
            value={totalVendors}
            icon={Store}
            variant="blue"
            description="All registered vendors"
          />

          <AdminStatCard
            label="Active Vendors"
            value={activeVendors}
            icon={CheckCircle}
            variant="green"
            description="Currently active"
          />

          <AdminStatCard
            label="Pending Approval"
            value={pendingVendors}
            icon={Clock}
            variant="orange"
            description="Waiting for admin review"
          />

          <AdminStatCard
            label="Suspended"
            value={suspendedVendors}
            icon={AlertTriangle}
            variant="pink"
            description="Suspended vendor accounts"
          />
        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TOOLBAR */}

          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search vendor, store, email or phone..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>

              {/* FILTERS */}

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                {/* FILTER LABEL */}

                <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">
                  <Filter size={16} className="text-slate-400" />

                  <span>Filters</span>
                </div>

                {/* STATUS FILTER */}

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "ALL" | VendorStatus)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 sm:w-[150px]"
                >
                  <option value="ALL">All Status</option>

                  <option value="APPROVED">Active</option>

                  <option value="PENDING">Pending</option>

                  <option value="SUSPENDED">Suspended</option>

                  <option value="REJECTED">Rejected</option>
                </select>

                {/* CATEGORY FILTER */}

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 sm:w-[170px]"
                >
                  <option value="ALL">All Categories</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* CHANGE REQUEST FILTER */}
                {pendingChangeRequestsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setOnlyChangeRequests(!onlyChangeRequests)}
                    className={`flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition shadow-2xs ${
                      onlyChangeRequests
                        ? "bg-amber-500 text-white shadow-amber-500/20"
                        : "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                  >
                    <AlertTriangle
                      size={14}
                      className={onlyChangeRequests ? "text-white" : "text-amber-600"}
                    />
                    <span>পরিবর্তন অনুরোধ ({pendingChangeRequestsCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* BULK ACTION */}

            {selectedIds.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                  <Users size={17} />
                  {selectedIds.length} vendor(s) selected
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* APPROVE */}

                  <button
                    type="button"
                    onClick={() => handleBulkUpdateStatus("APPROVED")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>

                  {/* SUSPEND */}

                  <button
                    type="button"
                    onClick={() => handleBulkUpdateStatus("SUSPENDED")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Ban size={14} />
                    Suspend
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={confirmBulkDelete}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 accent-amber-500"
                    />
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vendor
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-16 text-center text-sm text-slate-500"
                    >
                      Loading vendors...
                    </td>
                  </tr>
                ) : filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      onClick={() => setSelectedVendorId(vendor.id)}
                      className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      {/* CHECKBOX */}

                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(vendor.id)}
                          onChange={() => toggleSelect(vendor.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-amber-500"
                        />
                      </td>

                      {/* VENDOR */}

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-700">
                            {vendor.storeName.charAt(0)}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-[#12233F]">
                                {vendor.storeName}
                              </p>
                              {vendor.hasPendingChangeRequest && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-300 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-700 animate-pulse">
                                  <AlertTriangle size={10} className="text-amber-600" />
                                  <span>পরিবর্তন অনুরোধ</span>
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {vendor.ownerName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">{vendor.email}</p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {vendor.phone}
                        </p>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-4 py-4">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {vendor.category}
                        </span>
                      </td>

                      {/* LOCATION */}

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {vendor.location}
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">
                        <StatusBadge status={vendor.status} />
                      </td>

                      {/* JOINED */}

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {vendor.joined}
                      </td>

                      {/* ACTIONS */}

                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {/* VIEW */}

                          <button
                            type="button"
                            title="View vendor"
                            onClick={() => setSelectedVendorId(vendor.id)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit vendor"
                            onClick={() =>
                              (window.location.href = `/admin/vendors/${vendor.id}/edit`)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* SUSPEND / ACTIVATE */}

                          {vendor.status === "SUSPENDED" ? (
                            <button
                              type="button"
                              title="Activate vendor"
                              onClick={() =>
                                updateStatus(vendor.id, "APPROVED")
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <CheckCircle size={17} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Suspend vendor"
                              onClick={() =>
                                updateStatus(vendor.id, "SUSPENDED")
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Ban size={17} />
                            </button>
                          )}

                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete vendor"
                            onClick={() => confirmDeleteVendor(vendor.id, vendor.storeName)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Store size={22} className="text-slate-400" />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-700">
                          No vendors found
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}

          <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredVendors.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {vendors.length}
              </span>{" "}
              vendors
            </p>

            {selectedIds.length > 0 && (
              <p className="text-xs font-medium text-amber-600">
                {selectedIds.length} selected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          VENDOR DETAILS SIDEBAR
          ===================================================== */}

      <VendorDetailsSidebar
        vendorId={selectedVendorId}
        onClose={() => setSelectedVendorId(null)}
        onStatusChange={(vId, newStatus) => {
          setVendors((prev) =>
            prev.map((v) => (v.id === vId ? { ...v, status: newStatus as VendorStatus } : v))
          );
        }}
        onVendorUpdated={() => {
          void fetchVendors();
        }}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, vendorId: null, storeName: "", isBulk: false })}
        onConfirm={handleDeleteConfirmed}
        isLoading={isDeleting}
        title={deleteModal.isBulk ? "নির্বাচিত ভেন্ডরগুলো মুছে ফেলতে চান?" : "ভেন্ডর মুছে ফেলতে চান?"}
        description={
          deleteModal.isBulk
            ? `আপনি কি নিশ্চিতভাবে ${deleteModal.storeName} ডিলিট করতে চান? এই তথ্যটি আর ফিরে পাওয়া যাবে না।`
            : `আপনি কি নিশ্চিতভাবে ভেন্ডর "${deleteModal.storeName}" ডিলিট করতে চান? এই তথ্যটি আর ফিরে পাওয়া যাবে না।`
        }
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
      />
    </>
  );
}