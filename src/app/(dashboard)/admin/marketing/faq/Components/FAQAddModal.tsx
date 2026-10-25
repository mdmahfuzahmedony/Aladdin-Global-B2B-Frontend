"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { HelpCircle, Loader2, Plus, X } from "lucide-react";
import { createClient } from "../../../../../../../lib/supabase-client";

// =====================================================
// API
// =====================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// =====================================================
// TYPES
// =====================================================

export type FAQModalData = {
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
};

type FAQAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FAQModalData) => Promise<void>;
};

// =====================================================
// COMPONENT
// =====================================================

export default function FAQAddModal({
  isOpen,
  onClose,
  onSave,
}: FAQAddModalProps) {
  const supabase = createClient();

  // ===================================================
  // STATE
  // ===================================================

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [sortOrder, setSortOrder] = useState("0");

  const [saving, setSaving] = useState(false);

  // ===================================================
  // RESET
  // ===================================================

  useEffect(() => {
    if (isOpen) {
      setQuestion("");
      setAnswer("");
      setIsActive(true);
      setSortOrder("0");
      setSaving(false);
    }
  }, [isOpen]);

  // ===================================================
  // CLOSE
  // ===================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose();
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!question.trim()) {
      toast.warning("Question লিখুন।");
      return;
    }

    if (!answer.trim()) {
      toast.warning("Answer লিখুন।");
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------------
      // GET SESSION
      // -----------------------------------------------

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

      // -----------------------------------------------
      // CREATE FAQ
      // -----------------------------------------------

      const response = await fetch(`${API_URL}/api/faqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          isActive,
          sortOrder: Number(sortOrder) || 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to create FAQ");
      }

      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------

      await onSave({
        question: question.trim(),
        answer: answer.trim(),
        isActive,
        sortOrder: Number(sortOrder) || 0,
      });

      onClose();
    } catch (error: unknown) {
      console.error("CREATE FAQ ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to create FAQ";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // HIDDEN
  // ===================================================

  if (!isOpen) {
    return null;
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <HelpCircle size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#12233F]">Add FAQ</h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Create a new frequently asked question.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-180px)] overflow-y-auto"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* QUESTION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#12233F]">
                Question
              </label>

              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="e.g. What is the minimum order quantity?"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* ANSWER */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#12233F]">
                Answer
              </label>

              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write the answer to this question..."
                rows={6}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* ACTIVE + SORT ORDER */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* ACTIVE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#12233F]">
                      Active FAQ
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Show this FAQ on the homepage.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsActive((prev) => !prev)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    aria-label="Toggle FAQ status"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        isActive ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SORT ORDER */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#12233F]">
                  Sort Order
                </label>

                <input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />

                <p className="mt-1 text-[11px] text-slate-400">
                  Lower number appears first.
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-pink-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add FAQ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
