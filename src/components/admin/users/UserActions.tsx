"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";

type UserActionsProps = {
  userId: string | number;
  onDelete: (id: string) => void;
};

export default function UserActions({ userId, onDelete }: UserActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        className="
          rounded-lg
          p-2
          text-slate-400
          transition
          hover:bg-slate-100
          hover:text-[#12233F]
        "
        title="More"
      >
        <MoreHorizontal size={17} />
      </button>

      <button
        type="button"
        onClick={() => onDelete(String(userId))}
        className="
          rounded-lg
          p-2
          text-slate-400
          transition
          hover:bg-red-50
          hover:text-red-600
        "
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}