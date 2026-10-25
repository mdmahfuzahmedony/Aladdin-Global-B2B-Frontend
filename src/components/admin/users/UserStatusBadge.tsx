"use client";

import { CheckCircle2, Clock3, Ban } from "lucide-react";

type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";

export default function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600">
        <CheckCircle2 size={14} />
        Active
      </span>
    );
  }

  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-600">
        <Clock3 size={14} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-red-600">
      <Ban size={14} />
      Suspended
    </span>
  );
}