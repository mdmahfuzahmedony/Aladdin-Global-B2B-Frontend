"use client";

import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";

import {
  Users,
  UserCheck,
  Store,
  ShoppingBag,
  ShieldCheck,
  UserRound,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import UserSearch from "@/components/admin/users/UserSearch";
import UserTable from "@/components/admin/users/UserTable";
import UserSidePanel from "@/components/admin/users/UserSidePanel/UserSidePanel";
import AddUserModal from "@/components/admin/users/AddUserModal";

import { createClient } from "../../../../../lib/supabase-client";

/* =========================================================
   TYPES
========================================================= */

export type UserRole =
  | "SUPER_ADMIN"
  | "CUSTOMER"
  | "VENDOR"
  | "WHOLESALER"
  | "MANAGER"
  | "AFFILIATE";

export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";

/* =========================================================
   VENDOR DATA
========================================================= */

export type VendorData = {
  id?: string;
  userId?: string;

  storeName?: string;
  businessAddress?: string;
  businessCategory?: string | null;

  status?: string;
  commissionRate?: string | number;

  nidNumber?: string;
  nidDocumentUrl?: string;

  tradeLicenseNumber?: string | null;
  tradeLicenseDocUrl?: string | null;

  taxIdentificationNumber?: string | null;
  tinDocUrl?: string | null;

  payoutMethod?: string;

  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountHolder?: string | null;
  mobileBankingNumber?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   USER DATA
========================================================= */

export type UserData = {
  id: string;

  name: string;
  email: string;
  phone: string;

  role: UserRole;
  status: UserStatus;

  joined: string;

  vendor?: VendorData | null;
};

/* =========================================================
   MAIN PAGE
========================================================= */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function UsersPage() {
  /* =======================================================
     USERS
  ======================================================= */

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  /* =======================================================
     SEARCH / FILTER
  ======================================================= */

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");

  const [statusFilter, setStatusFilter] = useState<"ALL" | UserStatus>("ALL");

  /* =======================================================
     SELECTED USERS
  ======================================================= */

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* =======================================================
     USER SIDE PANEL
  ======================================================= */

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
    isBulk?: boolean;
  }>({
    isOpen: false,
    userId: null,
    userName: "",
    isBulk: false,
  });

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  /* =======================================================
     ADD USER MODAL
  ======================================================= */

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  /* =======================================================
     FETCH REAL USERS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      try {
        setLoading(true);

        const supabase = createClient();

        /* ---------------------------------------------------
           Get current Supabase session
        --------------------------------------------------- */

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Supabase Session Error:", sessionError);
        }

        if (!session) {
          console.error("❌ No Supabase session found.");

          if (mounted) {
            setUsers([]);
            setLoading(false);
          }

          return;
        }

        /* ---------------------------------------------------
           Backend API URL
        --------------------------------------------------- */

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        console.log("🔥 Users API:", `${apiUrl}/api/users/admin/all-users`);

        /* ---------------------------------------------------
           Fetch users from backend
        --------------------------------------------------- */

        const response = await fetch(`${apiUrl}/api/users/admin/all-users`, {
          method: "GET",

          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },

          cache: "no-store",
        });

        /* ---------------------------------------------------
           API Error
        --------------------------------------------------- */

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          console.error("❌ Fetch Users API Error:", errorData);

          throw new Error(
            errorData?.error || `Failed to fetch users (${response.status})`,
          );
        }

        /* ---------------------------------------------------
           API Response
        --------------------------------------------------- */

        const data = await response.json();

        console.log("✅ USERS FROM BACKEND:", data.users);

        /* ---------------------------------------------------
           Valid roles
        --------------------------------------------------- */

        const validRoles: UserRole[] = [
          "SUPER_ADMIN",
          "CUSTOMER",
          "VENDOR",
          "WHOLESALER",
          "MANAGER",
          "AFFILIATE",
        ];

        /* ---------------------------------------------------
           Map backend users
        --------------------------------------------------- */

        const mappedUsers: UserData[] = (data.users ?? []).map(
          (user: any): UserData => {
            /* ---------------------------------------------
                 ROLE
              --------------------------------------------- */

            const backendRole = String(user.role || "CUSTOMER").toUpperCase();

            const finalRole: UserRole = validRoles.includes(
              backendRole as UserRole,
            )
              ? (backendRole as UserRole)
              : "CUSTOMER";

            /* ---------------------------------------------
                   STATUS
              --------------------------------------------- */

            const backendStatus = String(user.status || "ACTIVE").toUpperCase();

            let finalStatus: UserStatus = "ACTIVE";

            if (backendStatus === "PENDING") {
              finalStatus = "PENDING";
            } else if (backendStatus === "SUSPENDED") {
              finalStatus = "SUSPENDED";
            } else if (backendStatus === "BANNED") {
              finalStatus = "BANNED";
            } else {
              finalStatus = "ACTIVE";
            }

            /* ---------------------------------------------
                   RETURN USER
              --------------------------------------------- */

            return {
              id: String(user.id),

              name: user.fullName || "Unnamed User",

              email: user.email || "—",

              phone: user.phone || "—",

              role: finalRole,

              status: finalStatus,

              joined: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—",

              /* -----------------------------------------
                     VENDOR DATA
                ----------------------------------------- */

              vendor: user.vendor
                ? {
                    id: user.vendor.id,

                    userId: user.vendor.userId,

                    storeName: user.vendor.storeName,

                    businessAddress: user.vendor.businessAddress,

                    businessCategory: user.vendor.businessCategory,

                    status: user.vendor.status,

                    commissionRate: user.vendor.commissionRate?.toString(),

                    nidNumber: user.vendor.nidNumber,

                    nidDocumentUrl: user.vendor.nidDocumentUrl,

                    tradeLicenseNumber: user.vendor.tradeLicenseNumber,

                    tradeLicenseDocUrl: user.vendor.tradeLicenseDocUrl,

                    taxIdentificationNumber:
                      user.vendor.taxIdentificationNumber,

                    tinDocUrl: user.vendor.tinDocUrl,

                    payoutMethod: user.vendor.payoutMethod,

                    bankName: user.vendor.bankName,

                    bankAccountNumber: user.vendor.bankAccountNumber,

                    bankAccountHolder: user.vendor.bankAccountHolder,

                    mobileBankingNumber: user.vendor.mobileBankingNumber,

                    createdAt: user.vendor.createdAt,

                    updatedAt: user.vendor.updatedAt,
                  }
                : null,
            };
          },
        );

        /* ---------------------------------------------------
           Set users
        --------------------------------------------------- */

        if (mounted) {
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);

        if (mounted) {
          setUsers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return users.filter((user) => {
      /* ---------------------------------------------------
         Search
      --------------------------------------------------- */

      const searchMatch =
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.phone.toLowerCase().includes(searchText);

      /* ---------------------------------------------------
         Role
      --------------------------------------------------- */

      const roleMatch = roleFilter === "ALL" || user.role === roleFilter;

      /* ---------------------------------------------------
         Status
      --------------------------------------------------- */

      const statusMatch =
        statusFilter === "ALL" || user.status === statusFilter;

      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalUsers = users.length;

  const customerCount = users.filter((user) => user.role === "CUSTOMER").length;

  const vendorCount = users.filter((user) => user.role === "VENDOR").length;

  const wholesalerCount = users.filter(
    (user) => user.role === "WHOLESALER",
  ).length;

  const managerCount = users.filter((user) => user.role === "MANAGER").length;

  const affiliateCount = users.filter(
    (user) => user.role === "AFFILIATE",
  ).length;

  const superAdminCount = users.filter(
    (user) => user.role === "SUPER_ADMIN",
  ).length;

  /* =======================================================
     SELECT ALL
  ======================================================= */

  const allVisibleSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedIds.includes(user.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredUsers.some((user) => user.id === id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...filteredUsers.map((user) => user.id)]),
      ]);
    }
  }

  /* =======================================================
     SELECT ONE
  ======================================================= */

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  /* =======================================================
     OPEN USER SIDE PANEL
  ======================================================= */

  function handleViewUser(user: UserData) {
    console.log("👤 OPEN USER:", user);

    setSelectedUser(user);
    setIsSidePanelOpen(true);
  }

  /* =======================================================
     CLOSE USER SIDE PANEL
  ======================================================= */

  function handleCloseSidePanel() {
    setIsSidePanelOpen(false);
    setSelectedUser(null);
  }

  /* =======================================================
     DELETE USER
  ======================================================= */

  function confirmDeleteUser(id: string) {
    const user = users.find((u) => u.id === id);
    setDeleteModal({
      isOpen: true,
      userId: id,
      userName: user?.name || "এই ইউজার",
      isBulk: false,
    });
  }

  function confirmBulkDelete() {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      userId: null,
      userName: `${selectedIds.length} জন নির্বাচিত ইউজার`,
      isBulk: true,
    });
  }

  async function handleDeleteConfirmed() {
    try {
      setIsDeleting(true);
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("লগইন করা নেই");
      }

      const token = session.access_token;

      if (deleteModal.isBulk) {
        const response = await fetch(`${API_BASE_URL}/api/users/admin/bulk`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: selectedIds }),
        });

        const res = await response.json();
        if (!response.ok) {
          throw new Error(
            res?.error || res?.message || "ইউজার মুছে ফেলতে ব্যর্থ হয়েছে",
          );
        }

        setUsers((prev) =>
          prev.filter((user) => !selectedIds.includes(user.id)),
        );
        if (selectedUser && selectedIds.includes(selectedUser.id)) {
          handleCloseSidePanel();
        }
        toast.success(
          res?.message ||
            `${selectedIds.length} জন ইউজার সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে!`,
        );
        setSelectedIds([]);
      } else if (deleteModal.userId) {
        const id = deleteModal.userId;
        const response = await fetch(`${API_BASE_URL}/api/users/admin/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await response.json();
        if (!response.ok) {
          throw new Error(
            res?.error || res?.message || "ইউজার মুছে ফেলতে ব্যর্থ হয়েছে",
          );
        }

        setUsers((prev) => prev.filter((user) => user.id !== id));
        setSelectedIds((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        );
        if (selectedUser?.id === id) {
          handleCloseSidePanel();
        }
        toast.success(
          `ইউজার "${deleteModal.userName}" সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে!`,
        );
      }
      setDeleteModal({
        isOpen: false,
        userId: null,
        userName: "",
        isBulk: false,
      });
    } catch (err: any) {
      console.error("Delete user error:", err);
      toast.error(err?.message || "ইউজার মুছে ফেলতে সমস্যা হয়েছে");
    } finally {
      setIsDeleting(false);
    }
  }

  /* =======================================================
     ADD USER
  ======================================================= */

  function handleOpenAddUserModal() {
    setIsAddUserModalOpen(true);
  }

  function handleCloseAddUserModal() {
    setIsAddUserModalOpen(false);
  }

  /* =======================================================
     USER CREATED SUCCESSFULLY
  ======================================================= */

  function handleUserCreated() {
    setIsAddUserModalOpen(false);

    /*
      পরে চাইলে এখানে fetchUsers() আলাদা function
      করে database থেকে নতুন user আবার load করবো।
    */

    window.location.reload();
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#12233F]">Users</h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Manage customers, vendors, wholesalers and platform users
          </p>
        </div>

        {/* ADD USER BUTTON */}
        <button
          type="button"
          onClick={handleOpenAddUserModal}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#1b3154] sm:w-fit"
        >
          <UserPlus size={16} className="shrink-0" />
          <span>Add User</span>
        </button>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="Total Users"
          value={totalUsers}
          icon={Users}
          variant="blue"
          description="All platform users"
        />

        <AdminStatCard
          label="Customers"
          value={customerCount}
          icon={UserRound}
          variant="purple"
          description="Registered buyers"
        />

        <AdminStatCard
          label="Vendors"
          value={vendorCount}
          icon={Store}
          variant="green"
          description="Active vendor accounts"
        />

        <AdminStatCard
          label="Wholesalers"
          value={wholesalerCount}
          icon={ShoppingBag}
          variant="orange"
          description="Wholesale buyers"
        />

        <AdminStatCard
          label="Managers"
          value={managerCount}
          icon={ShieldCheck}
          variant="yellow"
          description="Admin managers"
        />

        <AdminStatCard
          label="Affiliates"
          value={affiliateCount}
          icon={UserCheck}
          variant="pink"
          description="Affiliate accounts"
        />

        <AdminStatCard
          label="Super Admins"
          value={superAdminCount}
          icon={ShieldCheck}
          variant="yellow"
          description="Platform super admins"
        />
      </div>

      {/* =================================================
          USERS TABLE CARD
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* =================================================
            SEARCH HEADER
        ================================================= */}

        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#12233F]">
                All Users
              </h2>

              <p className="mt-1 text-[11.5px] text-slate-400">
                {filteredUsers.length} users found
              </p>
            </div>

            <UserSearch
              search={search}
              setSearch={setSearch}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </div>

        {/* =================================================
            BULK ACTION BAR
        ================================================= */}

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-rose-100 bg-rose-50 px-4 py-3 sm:px-5">
            <div className="text-[12px] font-semibold text-rose-700">
              {selectedIds.length} user
              {selectedIds.length > 1 ? "s" : ""} selected
            </div>

            <button
              type="button"
              onClick={confirmBulkDelete}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-[11.5px] font-bold text-white transition hover:bg-red-700"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        )}

        {/* =================================================
            USER TABLE
        ================================================= */}

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Loading real users...
          </div>
        ) : (
          <UserTable
            filteredUsers={filteredUsers}
            selectedIds={selectedIds}
            toggleSelectAll={toggleSelectAll}
            toggleSelect={toggleSelect}
            deleteUser={confirmDeleteUser}
            allVisibleSelected={allVisibleSelected}
            onViewUser={handleViewUser}
          />
        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[11.5px] text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">{users.length}</span>{" "}
            users
          </p>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              className="rounded-lg bg-[#12233F] px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              1
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          USER SIDE PANEL
      ================================================= */}

      <UserSidePanel
        user={selectedUser}
        isOpen={isSidePanelOpen}
        onClose={handleCloseSidePanel}
        onStatusChange={(userId, newStatus, vendorStatus) => {
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === userId) {
                return {
                  ...u,
                  status: newStatus as UserStatus,
                  ...(u.vendor && vendorStatus
                    ? { vendor: { ...u.vendor, status: vendorStatus } }
                    : {}),
                };
              }
              return u;
            }),
          );
          setSelectedUser((prev) =>
            prev && prev.id === userId
              ? {
                  ...prev,
                  status: newStatus as UserStatus,
                  ...(prev.vendor && vendorStatus
                    ? { vendor: { ...prev.vendor, status: vendorStatus } }
                    : {}),
                }
              : prev,
          );
        }}
      />

      {/* =================================================
          ADD USER MODAL
      ================================================= */}

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSuccess={handleUserCreated}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            userId: null,
            userName: "",
            isBulk: false,
          })
        }
        onConfirm={handleDeleteConfirmed}
        isLoading={isDeleting}
        title={
          deleteModal.isBulk
            ? "নির্বাচিত ইউজারগুলো মুছে ফেলতে চান?"
            : "ইউজার মুছে ফেলতে চান?"
        }
        description={
          deleteModal.isBulk
            ? `আপনি কি নিশ্চিতভাবে ${deleteModal.userName} ডিলিট করতে চান? এই ইউজারের সমস্ত ডাটা স্থায়ীভাবে মুছে যাবে।`
            : `আপনি কি নিশ্চিতভাবে ${deleteModal.userName} এর অ্যাকাউন্ট ডিলিট করতে চান? এই ইউজারের সমস্ত ডাটা স্থায়ীভাবে মুছে যাবে।`
        }
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
      />
    </div>
  );
}
