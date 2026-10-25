"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

type CategoryDeleteWarningModalProps = {
  isOpen: boolean;
  categoryName: string;
  childCount?: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function CategoryDeleteWarningModal({
  isOpen,
  categoryName,
  childCount = 0,
  onClose,
  onConfirm,
}: CategoryDeleteWarningModalProps) {
  if (!isOpen) return null;

  const hasChildren = childCount > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center pt-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle
              size={28}
              className="text-red-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4 text-center">
          <h2 className="text-lg font-semibold text-[#12233F]">
            Delete Category?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700">
              “{categoryName}”
            </span>
            ?
          </p>

          {hasChildren ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left">
              <p className="text-xs font-semibold text-red-600">
                Warning
              </p>

              <p className="mt-1 text-xs leading-5 text-red-500">
                This category has{" "}
                <span className="font-semibold">
                  {childCount} child categor
                  {childCount === 1 ? "y" : "ies"}
                </span>
                . If you continue, this category and all of
                its child categories will be deleted.
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-left">
              <p className="text-xs leading-5 text-amber-600">
                This action cannot be undone. The category will
                be permanently deleted.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-w-[100px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex min-w-[125px] items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <Trash2 size={15} />
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}