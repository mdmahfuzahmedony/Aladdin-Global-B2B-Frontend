"use client";

import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import UserActions from "./UserActions";

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

export type UserStatus =
  | "ACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "BANNED";

export type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
};

type UserTableProps = {
  filteredUsers: UserData[];
  selectedIds: string[];
  toggleSelectAll: () => void;
  toggleSelect: (id: string) => void;
  deleteUser: (id: string) => void;
  allVisibleSelected: boolean;

  /**
   * User row click.
   * Main UsersPage will use this to open UserSidePanel.
   */
  onViewUser: (user: UserData) => void;
};

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

/* =========================================================
   USER TABLE
========================================================= */

export default function UserTable({
  filteredUsers,
  selectedIds,
  toggleSelectAll,
  toggleSelect,
  deleteUser,
  allVisibleSelected,
  onViewUser,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        {/* =================================================
            TABLE HEADER
        ================================================= */}

        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {/* Select All */}

            <th className="w-12 px-5 py-3 text-left">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                aria-label="Select all users"
                className="h-4 w-4 rounded border-slate-300 accent-[#D6A419]"
              />
            </th>

            {/* User */}

            <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
              User
            </th>

            {/* Phone */}

            <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Phone
            </th>

            {/* Role */}

            <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Role
            </th>

            {/* Status */}

            <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Status
            </th>

            {/* Joined */}

            <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Joined
            </th>

            {/* Action */}

            <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        {/* =================================================
            TABLE BODY
        ================================================= */}

        <tbody className="divide-y divide-slate-100">
          {filteredUsers.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-14 text-center text-[13px] text-slate-400"
              >
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => onViewUser(user)}
                className="cursor-pointer transition hover:bg-slate-50/70"
              >
                {/* =================================================
                    CHECKBOX
                ================================================= */}

                <td
                  className="px-5 py-4"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    aria-label={`Select ${user.name}`}
                    className="h-4 w-4 rounded border-slate-300 accent-[#D6A419]"
                  />
                </td>

                {/* =================================================
                    USER
                ================================================= */}

                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#12233F] text-[11px] font-bold text-white">
                      {getInitials(user.name)}
                    </div>

                    {/* Name + Email */}

                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-[#12233F]">
                        {user.name}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* =================================================
                    PHONE
                ================================================= */}

                <td className="px-3 py-4 text-[12px] text-slate-600">
                  {user.phone || "—"}
                </td>

                {/* =================================================
                    ROLE
                ================================================= */}

                <td className="px-3 py-4">
                  <UserRoleBadge role={user.role} />
                </td>

                {/* =================================================
                    STATUS
                ================================================= */}

                <td className="px-3 py-4">
                  <UserStatusBadge status={user.status} />
                </td>

                {/* =================================================
                    JOINED
                ================================================= */}

                <td className="px-3 py-4 text-[12px] text-slate-500">
                  {user.joined}
                </td>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <td
                  className="px-5 py-4"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <UserActions
                    userId={user.id}
                    onDelete={deleteUser}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}