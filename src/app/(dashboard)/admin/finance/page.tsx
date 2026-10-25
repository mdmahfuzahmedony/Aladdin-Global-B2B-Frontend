"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  WalletCards,
  FileText,
  Eye,
  Printer,
  RefreshCw,
  CalendarDays,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

import ConfirmModal from "@/components/common/ConfirmModal";
import FinanceStats from "@/components/admin/finance/FinanceStats";
import FinanceRevenueChart from "@/components/admin/finance/FinanceRevenueChart";
import PayoutSummary from "@/components/admin/finance/PayoutSummary";
import TransactionFilters from "@/components/admin/finance/TransactionFilters";
import TransactionTable, {
  type Transaction,
} from "@/components/admin/finance/TransactionTable";
import PayoutFilters from "@/components/admin/finance/PayoutFilters";
import PayoutTable, {
  type Payout,
} from "@/components/admin/finance/PayoutTable";
import CommissionConfig from "@/components/admin/finance/CommissionConfig";
import ExportReports from "@/components/admin/finance/ExportReports";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { createClient } from "../../../../../lib/supabase-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const supabase = createClient();

type ReportPeriod = "7D" | "30D" | "90D" | "1Y" | "ALL";

type FinanceOverviewData = {
  stats: {
    totalRevenue: number;
    totalCommission: number;
    totalPaidOut: number;
    pendingPayouts: number;
    pendingPayoutsCount: number;
    activeVendorsCount: number;
    totalTransactions: number;
  };
  revenueTrend: {
    month: string;
    year: number;
    revenue: number;
    commission: number;
  }[];
  recentPayouts: {
    id: string;
    vendor: string;
    amount: number;
    method: string;
    status: string;
    date: string;
  }[];
};

function formatBDT(val: number) {
  return `৳${Number(val || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getPeriodDetails(period: ReportPeriod) {
  const end = new Date();
  const start = new Date(end);
  let label = "Last 30 Days";
  let bnLabel = "গত ৩০ দিন";

  if (period === "7D") {
    start.setDate(start.getDate() - 6);
    label = "Last 7 Days";
    bnLabel = "গত ৭ দিন";
  } else if (period === "30D") {
    start.setDate(start.getDate() - 29);
    label = "Last 30 Days";
    bnLabel = "গত ৩০ দিন";
  } else if (period === "90D") {
    start.setDate(start.getDate() - 89);
    label = "Last 90 Days";
    bnLabel = "গত ৯০ দিন";
  } else if (period === "1Y") {
    start.setFullYear(start.getFullYear() - 1);
    label = "Last 1 Year";
    bnLabel = "গত ১ বছর";
  } else {
    start.setFullYear(start.getFullYear() - 2);
    label = "All Time Statement";
    bnLabel = "সর্বমোট সময়কাল";
  }

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);

  return {
    label,
    bnLabel,
    rangeText:
      period === "ALL"
        ? "All Recorded Platform History"
        : `${fmt(start)} – ${fmt(end)}`,
    startDate: fmt(start),
    endDate: fmt(end),
    generatedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date()),
  };
}

export default function FinancePage() {
  const { settings } = useSiteSettings();

  const [period, setPeriod] = useState<ReportPeriod>("30D");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<FinanceOverviewData | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<
    string[]
  >([]);

  // Filters
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionMethod, setTransactionMethod] = useState("ALL");
  const [transactionStatus, setTransactionStatus] = useState("ALL");

  const [payoutSearch, setPayoutSearch] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("ALL");
  const [payoutStatus, setPayoutStatus] = useState("ALL");

  // PDF & Preview states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Fetch real data from backend
  const loadFinanceData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      // 1. Overview
      const resOverview = await fetch(`${API_URL}/api/admin/finance/overview`, {
        headers,
        cache: "no-store",
      }).catch(() => null);

      if (resOverview && resOverview.ok) {
        const json = await resOverview.json().catch(() => null);
        if (json?.data) {
          setOverview(json.data);
        }
      }

      // 2. Transactions
      const resTx = await fetch(
        `${API_URL}/api/admin/finance/transactions?limit=200`,
        { headers, cache: "no-store" },
      ).catch(() => null);

      if (resTx && resTx.ok) {
        const json = await resTx.json().catch(() => null);
        if (Array.isArray(json?.data) && json.data.length > 0) {
          setTransactions(json.data);
        }
      }

      // 3. Payouts
      const resPayouts = await fetch(`${API_URL}/api/admin/finance/payouts`, {
        headers,
        cache: "no-store",
      }).catch(() => null);

      if (resPayouts && resPayouts.ok) {
        const json = await resPayouts.json().catch(() => null);
        if (Array.isArray(json?.data) && json.data.length > 0) {
          setPayouts(json.data);
        }
      }
    } catch (err) {
      console.warn("Error loading finance data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFinanceData();
  }, [loadFinanceData]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const search = transactionSearch.toLowerCase();
      const matchesSearch =
        transaction.id.toLowerCase().includes(search) ||
        transaction.orderId.toLowerCase().includes(search) ||
        transaction.vendor.toLowerCase().includes(search) ||
        transaction.shop.toLowerCase().includes(search);

      const matchesMethod =
        transactionMethod === "ALL" ||
        transaction.paymentMethod === transactionMethod;

      const matchesStatus =
        transactionStatus === "ALL" ||
        transaction.status.toUpperCase() === transactionStatus.toUpperCase();

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [transactions, transactionSearch, transactionMethod, transactionStatus]);

  // Filtered payouts
  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      const search = payoutSearch.toLowerCase();
      const matchesSearch =
        payout.id.toLowerCase().includes(search) ||
        payout.vendor.toLowerCase().includes(search) ||
        payout.shop.toLowerCase().includes(search);

      const matchesMethod =
        payoutMethod === "ALL" || payout.method === payoutMethod;

      const matchesStatus =
        payoutStatus === "ALL" ||
        payout.status.toUpperCase() === payoutStatus.toUpperCase();

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payouts, payoutSearch, payoutMethod, payoutStatus]);

  // Payout Summary stats
  const payoutStats = useMemo(() => {
    let pending = 0;
    let processing = 0;
    let paid = 0;
    let rejected = 0;

    for (const p of payouts) {
      const s = String(p.status).toUpperCase();
      const amt = Number(p.requestedAmount || 0);
      if (s === "PENDING") pending += amt;
      else if (s === "PROCESSING") processing += amt;
      else if (s === "PAID" || s === "APPROVED") paid += amt;
      else if (s === "REJECTED" || s === "FAILED") rejected += amt;
    }

    return {
      pending: pending || (overview?.stats.pendingPayouts ?? 0),
      processing,
      paid: paid || (overview?.stats.totalPaidOut ?? 0),
      rejected,
    };
  }, [payouts, overview]);

  // Delete transaction handler
  const deleteTransaction = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "ট্রানজ্যাকশন মুছে ফেলতে চান?",
      description: "আপনি কি নিশ্চিতভাবে এই ট্রানজ্যাকশনটি ডিলিট করতে চান?",
      onConfirm: () => {
        setTransactions((current) => current.filter((t) => t.id !== id));
        setSelectedTransactionIds((current) => current.filter((i) => i !== id));
        toast.success("ট্রানজ্যাকশন সফলভাবে সরানো হয়েছে!");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const bulkDeleteTransactions = () => {
    if (selectedTransactionIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: "নির্বাচিত ট্রানজ্যাকশনগুলো ডিলিট করতে চান?",
      description: `আপনি কি নিশ্চিতভাবে ${selectedTransactionIds.length}টি ট্রানজ্যাকশন ডিলিট করতে চান?`,
      onConfirm: () => {
        setTransactions((current) =>
          current.filter((t) => !selectedTransactionIds.includes(t.id)),
        );
        toast.success(
          `${selectedTransactionIds.length}টি ট্রানজ্যাকশন সরানো হয়েছে!`,
        );
        setSelectedTransactionIds([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Payout approve / reject
  const approvePayout = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Find realId or id
      const target = payouts.find((p) => p.id === id);
      const targetId = (target as any)?.realId || id;

      await fetch(`${API_URL}/api/admin/finance/payouts/${targetId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      setPayouts((current) =>
        current.map((p) => (p.id === id ? { ...p, status: "PAID" } : p)),
      );
      toast.success("পে-আউট রিকোয়েস্ট সফলভাবে অনুমোদন করা হয়েছে!");
    } catch {
      toast.error("পে-আউট অনুমোদন করা যায়নি।");
    }
  };

  const rejectPayout = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "পে-আউট বাতিল করতে চান?",
      description: "আপনি কি নিশ্চিতভাবে এই পে-আউট রিকোয়েস্টটি বাতিল করতে চান?",
      onConfirm: async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const token = session?.access_token;
          const target = payouts.find((p) => p.id === id);
          const targetId = (target as any)?.realId || id;

          await fetch(
            `${API_URL}/api/admin/finance/payouts/${targetId}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify({ status: "REJECTED" }),
            },
          );

          setPayouts((current) =>
            current.map((p) =>
              p.id === id ? { ...p, status: "REJECTED" } : p,
            ),
          );
          toast.info("পে-আউট রিকোয়েস্ট বাতিল করা হয়েছে");
        } catch {
          toast.error("পে-আউট স্ট্যাটাস পরিবর্তন করা যায়নি।");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // CSV Export for Transactions
  const exportTransactionsCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.warn("Export করার মতো কোনো ট্রানজ্যাকশন নেই।");
      return;
    }

    try {
      const headers = [
        "Transaction ID",
        "Vendor",
        "Shop",
        "Order ID",
        "Payment Method",
        "Order Amount (BDT)",
        "Vendor Earnings (BDT)",
        "Admin Profit (BDT)",
        "Status",
        "Date",
      ];

      const csvRows = filteredTransactions.map((t) => [
        `"${t.id}"`,
        `"${t.vendor}"`,
        `"${t.shop}"`,
        `"${t.orderId}"`,
        `"${t.paymentMethod}"`,
        t.orderAmount,
        t.vendorEarnings,
        t.adminProfit,
        `"${t.status}"`,
        `"${t.date}"`,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvRows.map((r) => r.join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF", csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `admin-finance-transactions-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Transactions CSV সফলভাবে ডাউনলোড হয়েছে!");
    } catch {
      toast.error("CSV export করা যায়নি।");
    }
  };

  // CSV Export for Payouts
  const exportPayoutsCSV = () => {
    if (filteredPayouts.length === 0) {
      toast.warn("Export করার মতো কোনো পে-আউট নেই।");
      return;
    }

    try {
      const headers = [
        "Payout ID",
        "Vendor",
        "Shop",
        "Wallet Balance (BDT)",
        "Requested Amount (BDT)",
        "Method",
        "Date",
        "Status",
      ];

      const csvRows = filteredPayouts.map((p) => [
        `"${p.id}"`,
        `"${p.vendor}"`,
        `"${p.shop}"`,
        p.walletBalance,
        p.requestedAmount,
        `"${p.method}"`,
        `"${p.date}"`,
        `"${p.status}"`,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvRows.map((r) => r.join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF", csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `admin-finance-payouts-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Payouts CSV সফলভাবে ডাউনলোড হয়েছে!");
    } catch {
      toast.error("Payout CSV export করা যায়নি।");
    }
  };

  // Formal Executive Platform Report HTML Generator
  const generateFinanceReportHTML = () => {
    const periodInfo = getPeriodDetails(period);
    const siteName = settings.siteName || "Aladin Global B2B";
    const supportEmail = settings.supportEmail || "support@aladdinglobalb2b.com";
    const contactNumber = settings.contactNumber || "01322-130929";
    const address =
      settings.address ||
      "Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400";

    let logoUrl = settings.logoUrl;
    if (logoUrl && logoUrl.startsWith("/")) {
      if (typeof window !== "undefined") {
        logoUrl = `${window.location.origin}${logoUrl}`;
      }
    }

    const refNumber = `FIN-AUD-${Date.now().toString().slice(-6)}`;

    // Totals
    const totalGross = filteredTransactions.reduce(
      (sum, t) => sum + Number(t.orderAmount || 0),
      0,
    );
    const totalVendorEarn = filteredTransactions.reduce(
      (sum, t) => sum + Number(t.vendorEarnings || 0),
      0,
    );
    const totalAdminProfit = filteredTransactions.reduce(
      (sum, t) => sum + Number(t.adminProfit || 0),
      0,
    );

    const txRowsHtml = filteredTransactions
      .map(
        (t, idx) => `
        <tr>
          <td style="width: 32px; text-align: center; color: #64748b;">${idx + 1}</td>
          <td style="white-space: nowrap; font-weight: 500;">${t.date}</td>
          <td style="font-weight: 600; color: #12233F;">${t.id}</td>
          <td style="font-weight: 600;">${t.vendor}</td>
          <td>${t.orderId}</td>
          <td><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 8.5px;">${t.paymentMethod}</span></td>
          <td class="right" style="font-weight: 600;">${formatBDT(t.orderAmount)}</td>
          <td class="right" style="color: #059669; font-weight: 600;">${formatBDT(t.vendorEarnings)}</td>
          <td class="right" style="color: #2563eb; font-weight: 700;">+${formatBDT(t.adminProfit)}</td>
          <td><span style="font-size: 8.5px; font-weight: 700; color: #047857;">${t.status}</span></td>
        </tr>
      `,
      )
      .join("");

    const payoutRowsHtml = filteredPayouts
      .slice(0, 10)
      .map(
        (p) => `
        <tr>
          <td style="font-weight: 600; color: #12233F;">${p.id}</td>
          <td style="font-weight: 600;">${p.vendor}</td>
          <td class="right" style="font-weight: 700; color: #12233F;">${formatBDT(p.requestedAmount)}</td>
          <td><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 8.5px;">${p.method}</span></td>
          <td>${p.date}</td>
          <td><span style="font-size: 8.5px; font-weight: 700; color: ${p.status === "PAID" ? "#047857" : "#d97706"};">${p.status}</span></td>
        </tr>
      `,
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Admin_Financial_Statement_${period}_${new Date().toISOString().slice(0, 10)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Kalpurush", "SolaimanLipi", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
    }
    .print-actions-bar {
      background: #12233F;
      color: #ffffff;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn-print {
      background: #D6A419;
      color: #12233F;
      font-weight: 700;
      font-size: 12.5px;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-close {
      background: rgba(255,255,255,0.12);
      color: #ffffff;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 7px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        padding: 0;
      }
      .page-break {
        page-break-before: always;
      }
    }
    .report-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px;
    }
    .header-box {
      border-bottom: 2.5px solid #12233F;
      padding-bottom: 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .brand-col {
      flex: 1;
    }
    .brand-logo {
      max-height: 48px;
      max-width: 190px;
      object-fit: contain;
      margin-bottom: 6px;
      display: block;
    }
    .brand-name {
      font-size: 18px;
      font-weight: 800;
      color: #12233F;
      letter-spacing: -0.3px;
      margin: 0 0 3px 0;
    }
    .brand-meta {
      font-size: 9.5px;
      color: #64748B;
      line-height: 1.4;
    }
    .report-info-col {
      text-align: right;
    }
    .doc-title {
      font-size: 15px;
      font-weight: 800;
      color: #12233F;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 2px 0;
    }
    .doc-subtitle {
      font-size: 11px;
      font-weight: 600;
      color: #0284c7;
      margin: 0 0 8px 0;
    }
    .meta-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-period {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
    }
    .badge-verified {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      margin-left: 6px;
    }
    .doc-dates {
      margin-top: 6px;
      font-size: 9.5px;
      color: #475569;
      line-height: 1.45;
    }

    /* KPI Highlights */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .kpi-box {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 8px;
      padding: 10px 12px;
      border-left: 3.5px solid #12233F;
    }
    .kpi-box.green {
      border-left-color: #059669;
      background: #f0fdf4;
      border-color: #bbf7d0;
    }
    .kpi-box.blue {
      border-left-color: #2563eb;
    }
    .kpi-box.amber {
      border-left-color: #d97706;
    }
    .kpi-box.purple {
      border-left-color: #7c3aed;
    }
    .kpi-lbl {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
    }
    .kpi-num {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .kpi-num.green {
      color: #059669;
    }
    .kpi-desc {
      font-size: 8.5px;
      color: #94a3b8;
      margin-top: 2px;
    }

    /* Tables */
    .table-section-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #12233F;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 14px 0 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 9.5px;
    }
    .report-table th {
      background: #12233F;
      color: #ffffff;
      padding: 6.5px 8px;
      font-weight: 700;
      text-align: left;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .report-table th.right, .report-table td.right {
      text-align: right;
    }
    .report-table td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .report-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    .report-table tfoot td {
      background: #f1f5f9;
      font-weight: 800;
      color: #0f172a;
      border-top: 2px solid #cbd5e1;
      padding: 7px 8px;
    }

    /* Signatures */
    .signatures-row {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
    }
    .sig-col {
      width: 190px;
      text-align: center;
    }
    .sig-line {
      border-top: 1.2px solid #334155;
      margin-bottom: 4px;
    }
    .sig-name {
      font-size: 9.5px;
      font-weight: 700;
      color: #334155;
    }
    .sig-role {
      font-size: 8px;
      color: #64748b;
    }
    .stamp-badge {
      border: 1.5px dashed #059669;
      padding: 6px 12px;
      border-radius: 6px;
      text-align: center;
      color: #059669;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .legal-notice {
      margin-top: 16px;
      padding: 7px 10px;
      background: #f8fafc;
      border-left: 3px solid #94a3b8;
      font-size: 8px;
      color: #64748b;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="no-print print-actions-bar">
    <div style="font-weight: 600; font-size: 13px;">
      📄 ${siteName} — Executive Financial Statement (${periodInfo.bnLabel})
    </div>
    <div style="display: flex; gap: 8px; align-items: center;">
      <button onclick="window.print()" class="btn-print">
        🖨️ Print / Save as PDF
      </button>
      <button onclick="window.close()" class="btn-close">
        ✕ Close Window
      </button>
    </div>
  </div>

  <div class="report-container">
    <!-- Header -->
    <div class="header-box">
      <div class="brand-col">
        ${
          logoUrl
            ? `<img src="${logoUrl}" alt="${siteName}" class="brand-logo" />`
            : `<div class="brand-name">${siteName}</div>`
        }
        <div class="brand-meta">
          <div><strong>Executive Central Accounting & Financial Management</strong></div>
          <div>Helpline: ${contactNumber} | Email: ${supportEmail}</div>
          <div>${address}</div>
        </div>
      </div>

      <div class="report-info-col">
        <div class="doc-title">Executive Financial Statement</div>
        <div class="doc-subtitle">প্ল্যাটফর্ম আর্থিক বিবরণী ও রেভিনিউ অডিট</div>
        <div>
          <span class="meta-badge badge-period">${periodInfo.bnLabel} (${periodInfo.rangeText})</span>
          <span class="meta-badge badge-verified">Official Audit</span>
        </div>
        <div class="doc-dates">
          <div>Ref No: <strong>${refNumber}</strong></div>
          <div>Issue Date: <strong>${periodInfo.generatedAt}</strong></div>
        </div>
      </div>
    </div>

    <!-- Executive KPI Summary Cards -->
    <div class="kpi-row">
      <div class="kpi-box blue">
        <div class="kpi-lbl">Total Platform GMV</div>
        <div class="kpi-num">${formatBDT(totalGross || (overview?.stats.totalRevenue ?? 0))}</div>
        <div class="kpi-desc">Gross delivered merchandise value</div>
      </div>
      <div class="kpi-box green">
        <div class="kpi-lbl">Platform Commission</div>
        <div class="kpi-num green">${formatBDT(totalAdminProfit || (overview?.stats.totalCommission ?? 0))}</div>
        <div class="kpi-desc">Net platform revenue earned</div>
      </div>
      <div class="kpi-box purple">
        <div class="kpi-lbl">Vendor Payouts Paid</div>
        <div class="kpi-num">${formatBDT(payoutStats.paid)}</div>
        <div class="kpi-desc">Disbursed to merchant accounts</div>
      </div>
      <div class="kpi-box amber">
        <div class="kpi-lbl">Pending Payouts</div>
        <div class="kpi-num">${formatBDT(payoutStats.pending)}</div>
        <div class="kpi-desc">Awaiting approval & processing</div>
      </div>
    </div>

    <!-- Detailed Transactions Table -->
    <div class="table-section-title">
      <span>Transactions Breakdown (${filteredTransactions.length} Records)</span>
      <span style="font-size: 9px; color: #64748b; font-weight: 500;">Itemized order ledger</span>
    </div>

    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 32px; text-align: center;">SL</th>
          <th style="width: 80px;">Date</th>
          <th style="width: 100px;">Transaction #</th>
          <th>Vendor Store</th>
          <th style="width: 90px;">Order #</th>
          <th style="width: 70px;">Method</th>
          <th class="right" style="width: 90px;">Order Value</th>
          <th class="right" style="width: 90px;">Vendor Net</th>
          <th class="right" style="width: 90px;">Profit</th>
          <th style="width: 70px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${
          txRowsHtml ||
          `<tr><td colspan="10" style="text-align: center; padding: 20px; color: #94a3b8;">No transaction history found for this period.</td></tr>`
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" style="font-weight: 800;">TOTAL SUMMARY (${periodInfo.label.toUpperCase()})</td>
          <td class="right" style="font-weight: 800;">${formatBDT(totalGross)}</td>
          <td class="right" style="font-weight: 800; color: #059669;">${formatBDT(totalVendorEarn)}</td>
          <td class="right" style="font-weight: 800; color: #2563eb;">+${formatBDT(totalAdminProfit)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <!-- Recent Payout Requests Section -->
    ${
      filteredPayouts.length > 0
        ? `
      <div class="table-section-title" style="margin-top: 18px;">
        <span>Vendor Payout Requests (${filteredPayouts.length} Requests)</span>
        <span style="font-size: 9px; color: #64748b; font-weight: 500;">Withdrawal schedule</span>
      </div>
      <table class="report-table">
        <thead>
          <tr>
            <th style="width: 110px;">Payout Ref</th>
            <th>Vendor Name</th>
            <th class="right" style="width: 110px;">Requested Amount</th>
            <th style="width: 80px;">Method</th>
            <th style="width: 100px;">Request Date</th>
            <th style="width: 80px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${payoutRowsHtml}
        </tbody>
      </table>
    `
        : ""
    }

    <!-- Signatures -->
    <div class="signatures-row">
      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-name">Chief Financial Officer (CFO)</div>
        <div class="sig-role">Accounts & Internal Audit</div>
      </div>

      <div class="stamp-badge">
        ★ ALADIN GLOBAL B2B ★<br/>
        OFFICIAL FINANCIAL STATEMENT
      </div>

      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-name">Managing Director</div>
        <div class="sig-role">Operations & Compliance</div>
      </div>
    </div>

    <!-- Legal disclaimer -->
    <div class="legal-notice">
      <strong>Confidential Financial Audit:</strong> This document represents an official accounting and transaction statement generated by ${siteName}. All transactions, commissions, and payout records have been compiled from system records. Unauthorized duplication or redistribution is strictly prohibited.
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
  };

  // PDF Export Trigger
  const handleExportPDF = () => {
    setGeneratingPdf(true);
    try {
      const html = generateFinanceReportHTML();
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        setShowPreviewModal(true);
        toast.info(
          "ব্রাউজারে পপ-আপ ব্লক থাকায় প্রিভিউ উইন্ডো খোলা হয়েছে। সেখান থেকে প্রিন্ট করুন।",
        );
        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } catch (err) {
      console.error("Finance PDF generation error:", err);
      toast.error("পিডিএফ তৈরি করার সময় সমস্যা হয়েছে।");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const periodInfo = getPeriodDetails(period);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <WalletCards size={24} className="text-[#12233F]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
              Finance & Accounts
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Platform revenue, transactions, commission এবং vendor payouts manage
            করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-xs">
            <CalendarDays size={16} className="text-slate-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="7D">Last 7 Days (গত ৭ দিন)</option>
              <option value="30D">Last 30 Days (গত ৩০ দিন)</option>
              <option value="90D">Last 90 Days (গত ৯০ দিন)</option>
              <option value="1Y">Last 1 Year (গত ১ বছর)</option>
              <option value="ALL">All Time (সর্বমোট)</option>
            </select>
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={generatingPdf}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#12233F] px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1a3157] disabled:opacity-50"
            title="Download / Print Official PDF Financial Report"
          >
            <FileText size={15} className="text-[#D6A419]" />
            {generatingPdf ? "Generating..." : "Export PDF (পিডিএফ)"}
          </button>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
            title="Preview report on screen"
          >
            <Eye size={15} className="text-slate-500" />
            Preview
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={exportTransactionsCSV}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
            title="Export Transactions to CSV"
          >
            <Download size={14} className="text-slate-500" />
            CSV
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => void loadFinanceData()}
            disabled={loading}
            aria-label="Refresh financial data"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <FinanceStats
        totalPaidOut={payoutStats.paid}
        pendingPayouts={payoutStats.pending}
        platformCommission={
          overview?.stats.totalCommission ||
          filteredTransactions.reduce(
            (sum, t) => sum + Number(t.adminProfit || 0),
            0,
          )
        }
        totalRevenue={
          overview?.stats.totalRevenue ||
          filteredTransactions.reduce(
            (sum, t) => sum + Number(t.orderAmount || 0),
            0,
          )
        }
        loading={loading}
      />

      {/* Revenue & Commission Trend Chart */}
      <FinanceRevenueChart data={overview?.revenueTrend} />

      {/* Payout Summary Overview */}
      <PayoutSummary
        pendingAmount={payoutStats.pending}
        processingAmount={payoutStats.processing}
        paidAmount={payoutStats.paid}
        rejectedAmount={payoutStats.rejected}
      />

      {/* Transactions Section */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#12233F]">
                Transactions Ledger ({filteredTransactions.length})
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Platform-এর সকল financial transaction ও অর্ডারের হিসাব
              </p>
            </div>

            {selectedTransactionIds.length > 0 && (
              <button
                type="button"
                onClick={bulkDeleteTransactions}
                className="w-fit rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Delete Selected ({selectedTransactionIds.length})
              </button>
            )}
          </div>

          <TransactionFilters
            search={transactionSearch}
            setSearch={setTransactionSearch}
            paymentMethod={transactionMethod}
            setPaymentMethod={setTransactionMethod}
            status={transactionStatus}
            setStatus={setTransactionStatus}
          />
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          selectedIds={selectedTransactionIds}
          setSelectedIds={setSelectedTransactionIds}
          onDelete={deleteTransaction}
          loading={loading}
        />
      </section>

      {/* Payout Management Section */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#12233F]">
              Payout Management ({filteredPayouts.length})
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Vendor withdrawal request review, অনুমোদন এবং পরিচালনা করুন।
            </p>
          </div>

          <PayoutFilters
            search={payoutSearch}
            setSearch={setPayoutSearch}
            status={payoutStatus}
            setStatus={setPayoutStatus}
            method={payoutMethod}
            setMethod={setPayoutMethod}
          />
        </div>

        <PayoutTable
          payouts={filteredPayouts}
          onApprove={approvePayout}
          onReject={rejectPayout}
        />
      </section>

      {/* Commission Configuration */}
      <CommissionConfig />

      {/* Export Reports Component */}
      <ExportReports
        onExportTransactionsCSV={exportTransactionsCSV}
        onExportPayoutsCSV={exportPayoutsCSV}
        onExportPDF={handleExportPDF}
      />

      {/* REPORT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12233F] text-[#D6A419]">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#12233F]">
                    Executive Financial Statement Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {periodInfo.label} ({periodInfo.rangeText})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-[#12233F] px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1b3156]"
                >
                  <Printer size={14} className="text-[#D6A419]" />
                  Print / Save as PDF
                </button>

                <button
                  type="button"
                  onClick={exportTransactionsCSV}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Download size={14} />
                  CSV
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Styled Sheet Preview */}
            <div className="flex-1 overflow-y-auto bg-slate-100/70 p-6">
              <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-[#12233F] pb-4">
                  <div>
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt={settings.siteName}
                        className="mb-2 max-h-12 max-w-[180px] object-contain"
                      />
                    ) : (
                      <h2 className="text-lg font-black tracking-tight text-[#12233F]">
                        {settings.siteName}
                      </h2>
                    )}
                    <p className="text-[10px] text-slate-500">
                      Helpline: {settings.contactNumber} | Email:{" "}
                      {settings.supportEmail}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {settings.address}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {periodInfo.bnLabel}
                    </span>
                    <h3 className="mt-1 text-sm font-black text-[#12233F]">
                      EXECUTIVE FINANCIAL STATEMENT
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500">
                      {periodInfo.rangeText}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Generated: {periodInfo.generatedAt}
                    </p>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Platform GMV
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {formatBDT(
                        overview?.stats.totalRevenue ||
                          filteredTransactions.reduce(
                            (s, t) => s + Number(t.orderAmount || 0),
                            0,
                          ),
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">
                      Platform Profit
                    </span>
                    <p className="text-base font-black text-emerald-600">
                      {formatBDT(
                        overview?.stats.totalCommission ||
                          filteredTransactions.reduce(
                            (s, t) => s + Number(t.adminProfit || 0),
                            0,
                          ),
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Vendor Payouts Paid
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {formatBDT(payoutStats.paid)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-amber-700">
                      Pending Payouts
                    </span>
                    <p className="text-base font-black text-amber-600">
                      {formatBDT(payoutStats.pending)}
                    </p>
                  </div>
                </div>

                {/* Transactions Table Preview */}
                <div className="mt-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#12233F]">
                    Transactions Ledger ({filteredTransactions.length} records)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#12233F] text-white">
                        <tr>
                          <th className="py-2 pl-3">Date</th>
                          <th className="py-2">Tx ID</th>
                          <th className="py-2">Vendor</th>
                          <th className="py-2">Order #</th>
                          <th className="py-2 text-right">Amount</th>
                          <th className="py-2 text-right">Vendor Share</th>
                          <th className="py-2 pr-3 text-right">Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTransactions.slice(0, 15).map((t) => (
                          <tr key={t.id}>
                            <td className="py-2 pl-3">{t.date}</td>
                            <td className="py-2 font-semibold text-[#12233F]">
                              {t.id}
                            </td>
                            <td className="py-2 font-medium">{t.vendor}</td>
                            <td className="py-2 text-slate-500">{t.orderId}</td>
                            <td className="py-2 text-right font-semibold">
                              {formatBDT(t.orderAmount)}
                            </td>
                            <td className="py-2 text-right text-emerald-600">
                              {formatBDT(t.vendorEarnings)}
                            </td>
                            <td className="py-2 pr-3 text-right font-bold text-blue-600">
                              +{formatBDT(t.adminProfit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t border-slate-200 bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={4} className="py-2 pl-3 text-[#12233F]">
                            Total Summary
                          </td>
                          <td className="py-2 text-right">
                            {formatBDT(
                              filteredTransactions.reduce(
                                (s, t) => s + Number(t.orderAmount || 0),
                                0,
                              ),
                            )}
                          </td>
                          <td className="py-2 text-right text-emerald-600">
                            {formatBDT(
                              filteredTransactions.reduce(
                                (s, t) => s + Number(t.vendorEarnings || 0),
                                0,
                              ),
                            )}
                          </td>
                          <td className="py-2 pr-3 text-right text-blue-600">
                            +
                            {formatBDT(
                              filteredTransactions.reduce(
                                (s, t) => s + Number(t.adminProfit || 0),
                                0,
                              ),
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-8 flex items-end justify-between border-t border-dashed border-slate-300 pt-6">
                  <div className="text-center">
                    <div className="w-36 border-t border-slate-400 pb-1" />
                    <p className="text-[10px] font-bold text-slate-700">
                      Chief Financial Officer
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {settings.siteName}
                    </p>
                  </div>

                  <div className="rounded-lg border border-dashed border-emerald-500 px-3 py-1.5 text-center text-[10px] font-bold text-emerald-700">
                    ★ AUDITED STATEMENT ★
                  </div>

                  <div className="text-center">
                    <div className="w-36 border-t border-slate-400 pb-1" />
                    <p className="text-[10px] font-bold text-slate-700">
                      Managing Director
                    </p>
                    <p className="text-[9px] text-slate-400">Operations Head</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText="হ্যাঁ, নিশ্চিত করুন"
        cancelText="বাতিল"
        variant="danger"
      />
    </div>
  );
}
