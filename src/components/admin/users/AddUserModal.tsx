"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { X, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";

import ManagerPermissionForm, {
  ManagerPermission,
} from "./ManagerPermissionForm";

import { createClient } from "../../../../lib/supabase-client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  onSuccess?: () => void;
};

export default function AddUserModal({ isOpen, onClose, onCreated, onSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [permissions, setPermissions] = useState<ManagerPermission[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMsg("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!fullName.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Email is required.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (permissions.length === 0) {
      setErrorMsg("Please select at least one permission.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // DEBUG - FORM DATA
      // ==========================================

      console.log("========== CREATE MANAGER DATA ==========");

      console.log("Full Name:", fullName);
      console.log("Email:", email);

      // Local debugging only.
      // Remove password logs after testing.
      console.log("Password:", password);
      console.log("Confirm Password:", confirmPassword);

      console.log("Permissions:", permissions);

      console.log("Permissions JSON:", JSON.stringify(permissions, null, 2));

      console.log("=========================================");

      // ==========================================
      // SUPABASE SESSION
      // ==========================================

      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Your admin session has expired. Please login again.");
      }

      console.log("✅ Super Admin session found");

      // ==========================================
      // API URL
      // ==========================================

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

      console.log("API URL:", apiUrl);

      // ==========================================
      // REQUEST BODY
      // ==========================================

      const requestBody = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        permissions,
      };

      console.log("========== API REQUEST BODY ==========");

      console.log("Request Body:", requestBody);

      console.log("Request Body JSON:", JSON.stringify(requestBody, null, 2));

      console.log("======================================");

      // ==========================================
      // CREATE MANAGER
      // ==========================================
      //
      // IMPORTANT:
      // Manager + Permissions are created
      // together by ONE POST request.
      //
      // There is NO PUT request here.
      //
      // ==========================================

      const managerResponse = await fetch(`${apiUrl}/api/managers/create`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestBody),
      });

      // ==========================================
      // READ API RESPONSE
      // ==========================================

      const managerData = await managerResponse.json();

      console.log("========== API RESPONSE ==========");

      console.log("Status:", managerResponse.status);
      console.log("Response:", managerData);

      console.log("==================================");

      // ==========================================
      // API ERROR
      // ==========================================

      if (!managerResponse.ok) {
        throw new Error(
          managerData?.error ||
            managerData?.message ||
            "Failed to create manager.",
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      console.log("✅ MANAGER CREATED SUCCESSFULLY");

      console.log("Created Manager:", managerData?.manager);

      console.log(
        "Created Permissions:",
        managerData?.manager?.managerPermissions,
      );

      toast.success("Manager created successfully!");

      // ==========================================
      // RESET FORM
      // ==========================================

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPermissions([]);
      setErrorMsg("");

      // ==========================================
      // CLOSE MODAL
      // ==========================================

      onClose();

      // ==========================================
      // REFRESH USERS LIST
      // ==========================================

      if (onCreated) {
        onCreated();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("❌ Create Manager Error:", error);

      setErrorMsg(
        error?.message || "Something went wrong while creating manager.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus size={19} className="text-[#12233F]" />

              <h2 className="text-base font-bold text-[#12233F]">
                Add New Manager
              </h2>
            </div>

            <p className="mt-1 text-[11px] text-slate-400">
              Create a manager account and assign permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form onSubmit={handleSubmit} className="p-6">
          {/* ERROR */}

          {errorMsg && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
              {errorMsg}
            </div>
          )}

          {/* ROLE */}

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Role
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-[#12233F]">
              Manager
            </div>
          </div>

          {/* FULL NAME */}

          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Manager full name"
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none transition focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/10 disabled:bg-slate-50"
            />
          </div>

          {/* EMAIL */}

          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@company.com"
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none transition focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/10 disabled:bg-slate-50"
            />
          </div>

          {/* PASSWORD */}

          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-xs outline-none transition focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/10 disabled:bg-slate-50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-xs outline-none transition focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/10 disabled:bg-slate-50"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* ==========================================
              PERMISSIONS
          ========================================== */}

          <ManagerPermissionForm
            permissions={permissions}
            setPermissions={setPermissions}
          />

          {/* ==========================================
              FOOTER
          ========================================== */}

          <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b3154] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Create Manager
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
