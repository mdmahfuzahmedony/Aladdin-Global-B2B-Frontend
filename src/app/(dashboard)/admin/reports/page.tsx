"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Banknote,
  CalendarDays,
  ChartColumnIncreasing,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Handshake,
  Package,
  Printer,
  RefreshCw,
  Search,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { createClient } from "../../../../../lib/supabase-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const supabase = createClient();

type ReportCategory =
  | "Overview"
  | "Sales & Revenue"
  | "Orders"
  | "Vendors"
  | "Customers"
  | "Affiliates"
  | "Payments"
  | "Products";

type DetailedReportItem = {
  id: string;
  orderNumber?: string;
  date: string;
  vendor: string;
  customer: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
};

type ReportResponseData = {
  stats: {
    totalSales: number;
    totalOrders: number;
    activeVendors: number;
    activeAffiliates: number;
  };
  orderSummary: {
    completed: number;
    processing: number;
    pending: number;
    cancelled: number;
  };
  salesByDate: {
    date: string;
    sales: number;
  }[];
  reports: DetailedReportItem[];
};

const categories: {
  label: ReportCategory;
  icon: typeof Activity;
}[] = [
  { label: "Overview", icon: ChartColumnIncreasing },
  { label: "Sales & Revenue", icon: Banknote },
  { label: "Orders", icon: ShoppingBag },
  { label: "Vendors", icon: Users },
  { label: "Customers", icon: Users },
  { label: "Affiliates", icon: Handshake },
  { label: "Payments", icon: Banknote },
  { label: "Products", icon: Package },
];

function formatBDT(val: number) {
  return `৳${Number(val || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(val: string) {
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val || "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function getPeriodInfo(daysStr: string) {
  const days = Number(daysStr) || 30;
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);

  return {
    label:
      days === 7
        ? "Last 7 Days (গত ৭ দিন)"
        : days === 30
          ? "Last 30 Days (গত ৩০ দিন)"
          : days === 90
            ? "Last 90 Days (গত ৯০ দিন)"
            : "Last 1 Year (গত ১ বছর)",
    rangeText: `${fmt(start)} – ${fmt(end)}`,
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

export default function ReportsPage() {
  const { settings } = useSiteSettings();

  const [category, setCategory] = useState<ReportCategory>("Overview");
  const [period, setPeriod] = useState("30");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [reportData, setReportData] = useState<ReportResponseData>({
    stats: {
      totalSales: 0,
      totalOrders: 0,
      activeVendors: 0,
      activeAffiliates: 0,
    },
    orderSummary: {
      completed: 0,
      processing: 0,
      pending: 0,
      cancelled: 0,
    },
    salesByDate: [],
    reports: [],
  });

  // Fetch real report data from backend
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const params = new URLSearchParams({
        period,
        category,
        status: statusFilter,
        search,
      });

      const response = await fetch(`${API_URL}/api/admin/reports?${params}`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json?.data) {
        setReportData({
          stats: {
            totalSales: Number(json.data.stats?.totalSales || 0),
            totalOrders: Number(json.data.stats?.totalOrders || 0),
            activeVendors: Number(json.data.stats?.activeVendors || 0),
            activeAffiliates: Number(json.data.stats?.activeAffiliates || 0),
          },
          orderSummary: {
            completed: Number(json.data.orderSummary?.completed || 0),
            processing: Number(json.data.orderSummary?.processing || 0),
            pending: Number(json.data.orderSummary?.pending || 0),
            cancelled: Number(json.data.orderSummary?.cancelled || 0),
          },
          salesByDate: Array.isArray(json.data.salesByDate)
            ? json.data.salesByDate
            : [],
          reports: Array.isArray(json.data.reports) ? json.data.reports : [],
        });
      }
    } catch (err) {
      console.warn("Failed to load admin reports:", err);
    } finally {
      setLoading(false);
    }
  }, [period, category, statusFilter, search]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  // Client-side search and filtering over real reports
  const visibleReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reportData.reports;

    return reportData.reports.filter((r) => {
      const id = String(r.orderNumber || r.id).toLowerCase();
      const vendor = String(r.vendor).toLowerCase();
      const customer = String(r.customer).toLowerCase();
      const status = String(r.status).toLowerCase();
      return (
        id.includes(q) ||
        vendor.includes(q) ||
        customer.includes(q) ||
        status.includes(q)
      );
    });
  }, [reportData.reports, search]);

  // Max daily sales for chart
  const maxDailySales = useMemo(() => {
    if (reportData.salesByDate.length === 0) return 1;
    return Math.max(...reportData.salesByDate.map((i) => i.sales), 1);
  }, [reportData.salesByDate]);

  // Total order calculations
  const totalOrdersCalculated = Math.max(
    reportData.stats.totalOrders,
    reportData.orderSummary.completed +
      reportData.orderSummary.processing +
      reportData.orderSummary.pending +
      reportData.orderSummary.cancelled,
    1,
  );

  // CSV Export
  function exportCsv() {
    if (visibleReports.length === 0) {
      toast.warn("Export করার মতো কোনো রিপোর্ট রেকর্ড নেই।");
      return;
    }

    try {
      const headers = [
        "Order ID",
        "Date",
        "Vendor",
        "Customer",
        "Order Status",
        "Payment Status",
        "Subtotal",
        "Delivery Fee",
        "Discount",
        "Total Amount (BDT)",
      ];

      const rows = visibleReports.map((r) => [
        `"${r.orderNumber || r.id}"`,
        `"${formatDate(r.date)}"`,
        `"${r.vendor}"`,
        `"${r.customer}"`,
        `"${r.status}"`,
        `"${r.paymentStatus}"`,
        r.subtotal,
        r.deliveryFee,
        r.discount,
        r.totalAmount,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `admin-marketplace-report-${period}d-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("CSV রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!");
    } catch {
      toast.error("CSV export করা যায়নি।");
    }
  }

  // Generate Professional PDF HTML Statement
  const generatePDFReportHTML = () => {
    const periodInfo = getPeriodInfo(period);
    const siteName = settings.siteName || "Aladin Global B2B";
    const supportEmail =
      settings.supportEmail || "support@aladdinglobalb2b.com";
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

    const refNumber = `REP-ADM-${Date.now().toString().slice(-6)}`;

    const totalGross = visibleReports.reduce(
      (sum, r) => sum + Number(r.totalAmount || 0),
      0,
    );

    const rowsHtml = visibleReports
      .map(
        (r, idx) => `
        <tr>
          <td style="width: 32px; text-align: center; color: #64748b;">${idx + 1}</td>
          <td style="white-space: nowrap; font-weight: 500;">${formatDate(r.date)}</td>
          <td style="font-weight: 600; color: #12233F;">${r.orderNumber || r.id.slice(0, 8)}</td>
          <td style="font-weight: 600;">${r.vendor}</td>
          <td>${r.customer}</td>
          <td><span style="font-size: 8.5px; font-weight: 700; color: ${r.status === "DELIVERED" ? "#047857" : "#1e293b"};">${r.status}</span></td>
          <td><span style="font-size: 8.5px; font-weight: 700; color: ${r.paymentStatus === "PAID" ? "#047857" : "#d97706"};">${r.paymentStatus}</span></td>
          <td class="right" style="font-weight: 700; color: #12233F;">${formatBDT(r.totalAmount)}</td>
        </tr>
      `,
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Marketplace_Report_${period}D_${new Date().toISOString().slice(0, 10)}</title>
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

    /* Summary Bar */
    .status-summary-bar {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .status-item {
      text-align: center;
      flex: 1;
    }
    .status-num {
      font-size: 13px;
      font-weight: 800;
      color: #12233F;
    }
    .status-lbl {
      font-size: 8.5px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
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
      📄 ${siteName} — Super Admin Marketplace Report (${periodInfo.label})
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
          <div><strong>Central Marketplace Management & Audit Directorate</strong></div>
          <div>Helpline: ${contactNumber} | Email: ${supportEmail}</div>
          <div>${address}</div>
        </div>
      </div>

      <div class="report-info-col">
        <div class="doc-title">Marketplace Audit Report</div>
        <div class="doc-subtitle">সার্বিক মার্কেটপ্লেস পারফরম্যান্স বিবরণী</div>
        <div>
          <span class="meta-badge badge-period">${periodInfo.label}</span>
          <span class="meta-badge badge-verified">Verified System Report</span>
        </div>
        <div class="doc-dates">
          <div>Ref No: <strong>${refNumber}</strong></div>
          <div>Issue Date: <strong>${periodInfo.generatedAt}</strong></div>
        </div>
      </div>
    </div>

    <!-- Executive KPI Highlights -->
    <div class="kpi-row">
      <div class="kpi-box blue">
        <div class="kpi-lbl">Total Sales / GMV</div>
        <div class="kpi-num">${formatBDT(reportData.stats.totalSales || totalGross)}</div>
        <div class="kpi-desc">Delivered marketplace sales</div>
      </div>
      <div class="kpi-box green">
        <div class="kpi-lbl">Total Orders</div>
        <div class="kpi-num green">${reportData.stats.totalOrders}</div>
        <div class="kpi-desc">Orders placed in selected period</div>
      </div>
      <div class="kpi-box purple">
        <div class="kpi-lbl">Active Vendors</div>
        <div class="kpi-num">${reportData.stats.activeVendors}</div>
        <div class="kpi-desc">Approved vendor stores</div>
      </div>
      <div class="kpi-box amber">
        <div class="kpi-lbl">Active Affiliates</div>
        <div class="kpi-num">${reportData.stats.activeAffiliates}</div>
        <div class="kpi-desc">Active partner affiliates</div>
      </div>
    </div>

    <!-- Order Status Summary -->
    <div class="status-summary-bar">
      <div class="status-item">
        <div class="status-num" style="color: #059669;">${reportData.orderSummary.completed}</div>
        <div class="status-lbl">Completed Orders</div>
      </div>
      <div class="status-item">
        <div class="status-num" style="color: #2563eb;">${reportData.orderSummary.processing}</div>
        <div class="status-lbl">Processing Orders</div>
      </div>
      <div class="status-item">
        <div class="status-num" style="color: #d97706;">${reportData.orderSummary.pending}</div>
        <div class="status-lbl">Pending Review</div>
      </div>
      <div class="status-item">
        <div class="status-num" style="color: #dc2626;">${reportData.orderSummary.cancelled}</div>
        <div class="status-lbl">Cancelled / Returned</div>
      </div>
    </div>

    <!-- Itemized Detailed Report Table -->
    <div class="table-section-title">
      <span>Detailed Order & Report Ledger (${visibleReports.length} Records)</span>
      <span style="font-size: 9px; color: #64748b; font-weight: 500;">Category: ${category}</span>
    </div>

    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 32px; text-align: center;">SL</th>
          <th style="width: 80px;">Date</th>
          <th style="width: 100px;">Order #</th>
          <th>Vendor Store</th>
          <th>Customer</th>
          <th style="width: 80px;">Order Status</th>
          <th style="width: 75px;">Payment</th>
          <th class="right" style="width: 100px;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${
          rowsHtml ||
          `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #94a3b8;">No records found for this period.</td></tr>`
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7" style="font-weight: 800;">TOTAL SUMMARY FOR ${periodInfo.label.toUpperCase()}</td>
          <td class="right" style="font-weight: 800; color: #059669;">${formatBDT(totalGross)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Signatures -->
    <div class="signatures-row">
      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-name">Marketplace Operations Head</div>
        <div class="sig-role">Super Admin Audit Committee</div>
      </div>

      <div class="stamp-badge">
        ★ ALADIN GLOBAL B2B ★<br/>
        OFFICIAL MARKETPLACE AUDIT
      </div>

      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-name">System Auditor</div>
        <div class="sig-role">Compliance & Accounts Directorate</div>
      </div>
    </div>

    <!-- Legal disclaimer -->
    <div class="legal-notice">
      <strong>Official System Generated Audit:</strong> This report is electronically generated from live production databases of ${siteName}. All figures reflect verified customer orders, vendor transactions, and partner operations.
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

  const handleExportPDF = () => {
    setGeneratingPdf(true);
    try {
      const html = generatePDFReportHTML();
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
      console.error("Admin PDF report error:", err);
      toast.error("পিডিএফ তৈরি করার সময় সমস্যা হয়েছে।");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const periodInfo = getPeriodInfo(period);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Super Admin</span>
            <span>/</span>
            <span className="font-medium text-[#12233F]">Reports</span>
          </div>

          <h1 className="text-xl font-bold text-[#12233F]">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor real-time marketplace performance, sales trends and download
            audit statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={generatingPdf || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1d355d] disabled:opacity-50"
            title="Download / Print PDF Report with Company Logo"
          >
            <FileText size={15} className="text-[#D6A419]" />
            {generatingPdf ? "Generating..." : "Export PDF (পিডিএফ)"}
          </button>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <Eye size={15} className="text-slate-500" />
            Preview
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || visibleReports.length === 0}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Download size={15} className="text-slate-500" />
            CSV
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => void fetchReports()}
            disabled={loading}
            aria-label="Refresh reports"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Category */}
          <div>
            <label
              htmlFor="report-category"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Report category
            </label>

            <div className="relative">
              <select
                id="report-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ReportCategory)
                }
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs text-slate-700 outline-none focus:border-[#D6A419]"
              >
                {categories.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <label
              htmlFor="report-period"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Report period
            </label>

            <div className="relative">
              <CalendarDays
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="report-period"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-700 outline-none focus:border-[#D6A419]"
              >
                <option value="7">Last 7 days (গত ৭ দিন)</option>
                <option value="30">Last 30 days (গত ৩০ দিন)</option>
                <option value="90">Last 90 days (গত ৯০ দিন)</option>
                <option value="365">This year (চলতি বছর)</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="report-status"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Order / Payment status
            </label>

            <div className="relative">
              <select
                id="report-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs text-slate-700 outline-none focus:border-[#D6A419]"
              >
                <option value="ALL">All statuses (সকল স্ট্যাটাস)</option>
                <option value="DELIVERED">Delivered (সম্পন্ন)</option>
                <option value="PROCESSING">Processing (চলমান)</option>
                <option value="PENDING">Pending (অপেক্ষমাণ)</option>
                <option value="CANCELLED">Cancelled (বাতিল)</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards with Real Data */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#12233F]">
            Marketplace Overview ({periodInfo.label})
          </h2>

          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800">
            {periodInfo.rangeText}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total Sales (GMV)"
            value={
              loading
                ? "..."
                : formatBDT(
                    reportData.stats.totalSales ||
                      visibleReports.reduce(
                        (sum, r) => sum + Number(r.totalAmount || 0),
                        0,
                      ),
                  )
            }
            icon={Banknote}
            variant="blue"
            description="Delivered merchandise volume"
          />

          <AdminStatCard
            label="Total Orders"
            value={loading ? "..." : reportData.stats.totalOrders}
            icon={ShoppingBag}
            variant="orange"
            description="Orders placed in this period"
          />

          <AdminStatCard
            label="Active Vendors"
            value={loading ? "..." : reportData.stats.activeVendors}
            icon={Users}
            variant="purple"
            description="Approved partner stores"
          />

          <AdminStatCard
            label="Active Affiliates"
            value={loading ? "..." : reportData.stats.activeAffiliates}
            icon={Handshake}
            variant="green"
            description="Active affiliate marketers"
          />
        </div>
      </section>

      {/* Chart and Order Summary with Real Data */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Sales Trend Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 xl:col-span-2 shadow-xs">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-bold text-[#12233F]">
                {category === "Overview"
                  ? "Sales & Revenue Trend"
                  : `${category} Performance`}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Daily sales activity recorded for {periodInfo.label}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Daily Gross Sales (৳)
            </div>
          </div>

          {loading ? (
            <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
              Loading sales trend...
            </div>
          ) : reportData.salesByDate.length === 0 ? (
            <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
              <Activity size={22} className="mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">
                No sales recorded for this period
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                New order sales will appear dynamically in this chart
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex h-40 items-end justify-between gap-2 overflow-x-auto sm:gap-3">
                {reportData.salesByDate.map((item, index) => {
                  const pct = Math.max(
                    (item.sales / maxDailySales) * 100,
                    item.sales > 0 ? 12 : 4,
                  );

                  return (
                    <div
                      key={`${item.date}-${index}`}
                      className="group flex h-full min-w-[28px] flex-1 flex-col items-center justify-end"
                    >
                      <div
                        title={`${formatDate(item.date)}: ৳${Number(item.sales || 0).toLocaleString("en-BD")}`}
                        className="w-full max-w-[42px] rounded-t-md bg-amber-400 transition-all hover:bg-amber-500"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="mt-2 whitespace-nowrap text-[9px] font-medium text-slate-400">
                        {formatDate(item.date).slice(0, 6)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Real Order Status Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-[#12233F]">
              Order Status Breakdown
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Distribution of orders for {periodInfo.label}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Completed",
                count: reportData.orderSummary.completed,
                color: "bg-emerald-500",
                textColor: "text-emerald-700",
                pct: Math.round(
                  (reportData.orderSummary.completed / totalOrdersCalculated) *
                    100,
                ),
              },
              {
                label: "Processing",
                count: reportData.orderSummary.processing,
                color: "bg-blue-500",
                textColor: "text-blue-700",
                pct: Math.round(
                  (reportData.orderSummary.processing / totalOrdersCalculated) *
                    100,
                ),
              },
              {
                label: "Pending",
                count: reportData.orderSummary.pending,
                color: "bg-amber-400",
                textColor: "text-amber-700",
                pct: Math.round(
                  (reportData.orderSummary.pending / totalOrdersCalculated) *
                    100,
                ),
              },
              {
                label: "Cancelled",
                count: reportData.orderSummary.cancelled,
                color: "bg-rose-500",
                textColor: "text-rose-700",
                pct: Math.round(
                  (reportData.orderSummary.cancelled / totalOrdersCalculated) *
                    100,
                ),
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                    />
                    {item.label}
                  </span>

                  <span className="font-bold text-[#12233F]">
                    {item.count}{" "}
                    <span className="text-[10px] font-normal text-slate-400">
                      ({item.pct}%)
                    </span>
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <p className="text-xs font-bold text-[#12233F]">
              Total Orders in Period
            </p>
            <p className="mt-1 text-base font-extrabold text-[#12233F]">
              {reportData.stats.totalOrders}{" "}
              <span className="text-xs font-normal text-slate-500">
                recorded transactions
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Real Reports Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-bold text-[#12233F]">
              Detailed Order & Sales Records ({visibleReports.length})
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Live orders and performance ledger from database
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order #, vendor, customer..."
              className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#D6A419]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Order #
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Vendor Store
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Order Status
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Payment
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-slate-400"
                  >
                    রিপোর্ট ডেটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : visibleReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-slate-500">
                      <Search size={22} className="text-slate-300" />
                      <p className="text-xs font-semibold text-slate-700">
                        কোনো রিপোর্ট পাওয়া যায়নি
                      </p>
                      <p className="text-xs text-slate-400">
                        অন্য কোনো ফিল্টার বা সময়কাল দিয়ে চেষ্টা করুন।
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleReports.map((row) => (
                  <tr key={row.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-[#12233F]">
                      {row.orderNumber || row.id.slice(0, 8)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {formatDate(row.date)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-700">
                      {row.vendor}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                      {row.customer}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          row.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : row.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : row.status === "CANCELLED"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          row.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {row.paymentStatus}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-bold text-[#12233F]">
                      {formatBDT(row.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {visibleReports.length > 0 && (
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50 font-bold">
                  <td colSpan={6} className="px-4 py-3 text-xs text-[#12233F]">
                    Total Summary ({visibleReports.length} records)
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-black text-emerald-600">
                    {formatBDT(
                      visibleReports.reduce(
                        (sum, r) => sum + Number(r.totalAmount || 0),
                        0,
                      ),
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {visibleReports.length} real order & performance records
          </span>

          <span className="text-emerald-600 font-semibold">
            ● Live database synchronization active
          </span>
        </div>
      </section>

      {/* REPORT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12233F] text-[#D6A419]">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#12233F]">
                    Super Admin Marketplace Report Preview
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
                  onClick={exportCsv}
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

            {/* Modal Body */}
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
                      {periodInfo.label}
                    </span>
                    <h3 className="mt-1 text-sm font-black text-[#12233F]">
                      MARKETPLACE AUDIT REPORT
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500">
                      {periodInfo.rangeText}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Generated: {periodInfo.generatedAt}
                    </p>
                  </div>
                </div>

                {/* KPI Highlights */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Total Sales (GMV)
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {formatBDT(
                        reportData.stats.totalSales ||
                          visibleReports.reduce(
                            (s, r) => s + Number(r.totalAmount || 0),
                            0,
                          ),
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Total Orders
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {reportData.stats.totalOrders}
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-purple-700">
                      Active Vendors
                    </span>
                    <p className="text-base font-black text-purple-600">
                      {reportData.stats.activeVendors}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">
                      Active Affiliates
                    </span>
                    <p className="text-base font-black text-emerald-600">
                      {reportData.stats.activeAffiliates}
                    </p>
                  </div>
                </div>

                {/* Status Breakdown Bar */}
                <div className="mt-4 grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-3 text-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-600">
                      {reportData.orderSummary.completed}
                    </span>
                    <p className="text-[9.5px] uppercase text-slate-500">
                      Completed
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600">
                      {reportData.orderSummary.processing}
                    </span>
                    <p className="text-[9.5px] uppercase text-slate-500">
                      Processing
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600">
                      {reportData.orderSummary.pending}
                    </span>
                    <p className="text-[9.5px] uppercase text-slate-500">
                      Pending
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-600">
                      {reportData.orderSummary.cancelled}
                    </span>
                    <p className="text-[9.5px] uppercase text-slate-500">
                      Cancelled
                    </p>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="mt-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#12233F]">
                    Order Ledger ({visibleReports.length} records)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#12233F] text-white">
                        <tr>
                          <th className="py-2 pl-3">Date</th>
                          <th className="py-2">Order #</th>
                          <th className="py-2">Vendor</th>
                          <th className="py-2">Customer</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 pr-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleReports.slice(0, 15).map((r) => (
                          <tr key={r.id}>
                            <td className="py-2 pl-3">{formatDate(r.date)}</td>
                            <td className="py-2 font-semibold">
                              {r.orderNumber || r.id.slice(0, 8)}
                            </td>
                            <td className="py-2 font-medium">{r.vendor}</td>
                            <td className="py-2 text-slate-500">
                              {r.customer}
                            </td>
                            <td className="py-2">
                              <span className="font-semibold text-emerald-600">
                                {r.status}
                              </span>
                            </td>
                            <td className="py-2 pr-3 text-right font-bold text-[#12233F]">
                              {formatBDT(r.totalAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t border-slate-200 bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={5} className="py-2 pl-3 text-[#12233F]">
                            Total Sum
                          </td>
                          <td className="py-2 pr-3 text-right text-emerald-600">
                            {formatBDT(
                              visibleReports.reduce(
                                (s, r) => s + Number(r.totalAmount || 0),
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
                      Super Admin Operations
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
                      Audit Committee
                    </p>
                    <p className="text-[9px] text-slate-400">Internal Audit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
