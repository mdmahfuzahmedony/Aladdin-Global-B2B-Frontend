"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

type Props = {
  onExportTransactionsCSV?: () => void;
  onExportPayoutsCSV?: () => void;
  onExportPDF?: () => void;
};

export default function ExportReports({
  onExportTransactionsCSV,
  onExportPayoutsCSV,
  onExportPDF,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#12233F]">Export Reports</h2>

        <p className="mt-1 text-sm text-slate-500">
          Financial data Excel অথবা PDF format-এ print ও export করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Transactions Excel */}
        <button
          type="button"
          onClick={onExportTransactionsCSV}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#12233F] hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={20} className="text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-[#12233F]">
                Transactions
              </p>
              <p className="text-xs text-slate-400">Excel / CSV export</p>
            </div>
          </div>

          <Download size={16} className="text-slate-400" />
        </button>

        {/* Payouts Excel */}
        <button
          type="button"
          onClick={onExportPayoutsCSV}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#12233F] hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={20} className="text-blue-600" />

            <div>
              <p className="text-sm font-semibold text-[#12233F]">Payouts</p>
              <p className="text-xs text-slate-400">Excel / CSV export</p>
            </div>
          </div>

          <Download size={16} className="text-slate-400" />
        </button>

        {/* Revenue Statement PDF */}
        <button
          type="button"
          onClick={onExportPDF}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#12233F] hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-red-500" />

            <div>
              <p className="text-sm font-semibold text-[#12233F]">
                Financial Statement
              </p>
              <p className="text-xs text-slate-400">Official PDF Report</p>
            </div>
          </div>

          <Download size={16} className="text-slate-400" />
        </button>

        {/* Commission PDF */}
        <button
          type="button"
          onClick={onExportPDF}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#12233F] hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-orange-500" />

            <div>
              <p className="text-sm font-semibold text-[#12233F]">
                Audit Report
              </p>
              <p className="text-xs text-slate-400">Print / PDF Statement</p>
            </div>
          </div>

          <Download size={16} className="text-slate-400" />
        </button>
      </div>
    </section>
  );
}
