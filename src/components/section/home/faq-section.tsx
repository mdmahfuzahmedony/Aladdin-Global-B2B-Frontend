"use client";


import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function FAQSection() {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/faqs`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "FAQs fetch করা যায়নি");
        }

        setFaqs(Array.isArray(result?.data) ? result.data : []);
      } catch (error: unknown) {
        console.error("FAQ fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "FAQs fetch করা যায়নি"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  return (
    <section className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-0">
        {/* HEADER */}
        <div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3">
          

          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight text-[#12233F] sm:text-xl">
              {t("faqTitle")}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              {t("faqSubtitle")}
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-2.5 sm:space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-lg bg-slate-100 sm:h-14 sm:rounded-xl"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-xs text-red-600 sm:rounded-xl sm:px-4 sm:py-4 sm:text-sm">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && faqs.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-500 sm:rounded-xl sm:px-5 sm:py-6 sm:text-sm">
            {t("noFaqs")}
          </div>
        )}

        {/* FAQ LIST */}
        {!loading && !error && faqs.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-lg border border-slate-200 transition-colors hover:border-slate-300 sm:rounded-xl"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left sm:min-h-12 sm:gap-4 sm:px-4 sm:py-3.5 lg:px-5"
                  >
                    <span className="min-w-0 text-xs font-semibold leading-5 text-[#12233F] sm:text-sm">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-amber-500 transition-transform duration-200 sm:h-[18px] sm:w-[18px] ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="border-t border-slate-100 bg-slate-50/50 px-3 py-3 sm:px-4 sm:py-3.5 lg:px-5"
                    >
                      <p className="break-words text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
