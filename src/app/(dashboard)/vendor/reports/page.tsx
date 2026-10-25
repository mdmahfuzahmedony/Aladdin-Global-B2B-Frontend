"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Wallet,
  Users,
  Search,
  Download,
  CalendarDays,
  RefreshCw,
  FileText,
  Eye,
  Printer,
  X,
  Store,
  ShieldCheck,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { createClient } from "../../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const REPORTS_URL = `${API_BASE_URL}/api/vendors/reports`;

type ReportPeriod = "7D" | "30D" | "90D" | "1Y";

type Summary = {
  totalOrders: number;
  productsSold: number;
  grossSales: number;
  commission: number;
  netEarnings: number;
  availableEarnings?: number;
  averageOrderValue?: number;
};

type SalesTrend = {
  date: string;
  sales: number;
};

type SalesDetail = {
  id: string;
  orderNumber: string;
  date: string;
  grossSales: number;
  products: string[] | string;
  commission?: number;
  earnings?: number;
};

type ProductReport = {
  productId: string;
  name: string;
  quantity: number;
  sales: number;
  orders?: number;
};

type ReportsResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    summary?: Partial<Summary>;
    salesTrend?: SalesTrend[];
    salesDetails?: SalesDetail[];
    topProducts?: ProductReport[];
  };
};

const supabase = createClient();

const EMPTY_SUMMARY: Summary = {
  totalOrders: 0,
  productsSold: 0,
  grossSales: 0,
  commission: 0,
  netEarnings: 0,
  availableEarnings: 0,
  averageOrderValue: 0,
};

function money(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function getPeriodInfo(period: ReportPeriod) {
  const end = new Date();
  const start = new Date(end);
  let label = "Last 7 Days";
  let bnLabel = "গত ৭ দিন";

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
    rangeText: `${fmt(start)} – ${fmt(end)}`,
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

export default function ReportsPage() {
  const { settings } = useSiteSettings();

  const [period, setPeriod] = useState<ReportPeriod>("7D");
  const [search, setSearch] = useState("");

  const [summary, setSummary] = useState<Summary>(EMPTY_SUMMARY);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [salesDetails, setSalesDetails] = useState<SalesDetail[]>([]);
  const [topProducts, setTopProducts] = useState<ProductReport[]>([]);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [vendorProfile, setVendorProfile] = useState<{
    storeName: string;
    vendorName: string;
    email: string;
    phone: string;
  }>({
    storeName: "আমার স্টোর",
    vendorName: "ভেন্ডর",
    email: "",
    phone: "",
  });

  // Load Vendor Store details for Report Header
  useEffect(() => {
    async function loadVendorInfo() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const metadata = session.user.user_metadata ?? {};
        const metaName =
          (typeof metadata.fullName === "string" && metadata.fullName) ||
          (typeof metadata.full_name === "string" && metadata.full_name) ||
          (typeof metadata.name === "string" && metadata.name) ||
          "";
        const userEmail = session.user.email || "";

        setVendorProfile((prev) => ({
          ...prev,
          vendorName:
            metaName || (userEmail ? userEmail.split("@")[0] : prev.vendorName),
          email: userEmail || prev.email,
        }));

        const res = await fetch(`${API_BASE_URL}/api/vendors/store/settings`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json?.data) {
            setVendorProfile((prev) => ({
              ...prev,
              storeName: json.data.storeName?.trim() || prev.storeName,
              phone: json.data.phone || prev.phone,
              email: json.data.email || prev.email,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not load vendor store info for report:", err);
      }
    }
    void loadVendorInfo();
  }, []);

  const fetchReports = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const token = session?.access_token;

        if (!token) {
          throw new Error("আপনার সেশন পাওয়া যায়নি। আবার লগইন করুন।");
        }

        const response = await fetch(
          `${REPORTS_URL}?period=${period}&limit=500`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
            signal,
          },
        );

        const result = (await response
          .json()
          .catch(() => null)) as ReportsResponse | null;

        if (!response.ok || !result || result.success === false) {
          throw new Error(
            result?.message ||
              result?.error ||
              `রিপোর্ট লোড করা যায়নি। HTTP ${response.status}`,
          );
        }

        if (!result.data) {
          throw new Error("Backend থেকে রিপোর্টের তথ্য পাওয়া যায়নি।");
        }

        const data = result.data;

        setSummary({
          ...EMPTY_SUMMARY,
          ...(data.summary || {}),
        });

        setSalesTrend(Array.isArray(data.salesTrend) ? data.salesTrend : []);
        setSalesDetails(
          Array.isArray(data.salesDetails) ? data.salesDetails : [],
        );
        setTopProducts(Array.isArray(data.topProducts) ? data.topProducts : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "রিপোর্ট লোড করার সময় সমস্যা হয়েছে।",
        );

        setSummary(EMPTY_SUMMARY);
        setSalesTrend([]);
        setSalesDetails([]);
        setTopProducts([]);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [period, refreshKey],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchReports(controller.signal);
    return () => controller.abort();
  }, [fetchReports]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...topProducts]
      .filter((product) =>
        String(product.name || "")
          .toLowerCase()
          .includes(query),
      )
      .sort((a, b) => Number(b.sales || 0) - Number(a.sales || 0));
  }, [topProducts, search]);

  const filteredSalesDetails = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return salesDetails;

    return salesDetails.filter((row) => {
      const products = Array.isArray(row.products)
        ? row.products.join(", ")
        : row.products || "";

      return (
        String(row.orderNumber || "")
          .toLowerCase()
          .includes(query) || products.toLowerCase().includes(query)
      );
    });
  }, [salesDetails, search]);

  const maxSales = Math.max(
    ...salesTrend.map((item) => Number(item.sales || 0)),
    1,
  );

  const averageOrderValue =
    summary.averageOrderValue !== undefined
      ? Number(summary.averageOrderValue)
      : summary.totalOrders > 0
        ? summary.grossSales / summary.totalOrders
        : 0;

  const commissionRate =
    summary.grossSales > 0
      ? ((summary.commission / summary.grossSales) * 100).toFixed(1)
      : "0.0";

  // CSV Export
  const handleExportCSV = () => {
    if (filteredSalesDetails.length === 0) {
      setError("Export করার মতো কোনো sales details নেই।");
      return;
    }

    setExporting(true);

    try {
      const headers = [
        "Date",
        "Order Number",
        "Products",
        "Gross Sales",
        "Commission",
        "Net Earnings",
      ];

      const rows = filteredSalesDetails.map((row) => {
        const products = Array.isArray(row.products)
          ? row.products.join(", ")
          : row.products || "";

        const commission = Number(row.commission ?? 0);
        const earnings = Number(
          row.earnings ?? Number(row.grossSales || 0) - commission,
        );

        return [
          formatDate(row.date),
          row.orderNumber,
          products,
          Number(row.grossSales || 0),
          commission,
          earnings,
        ];
      });

      const csv = [
        headers.map(csvCell).join(","),
        ...rows.map((row) => row.map(csvCell).join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `vendor-sales-report-${period}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("CSV export করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setExporting(false);
    }
  };

  // Generate Professional HTML Document for PDF Print
  const generateReportHTML = () => {
    const periodInfo = getPeriodInfo(period);
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

    const refNumber = `REP-VND-${period}-${Date.now().toString().slice(-6)}`;

    const orderRowsHtml = filteredSalesDetails
      .map((row, index) => {
        const products = Array.isArray(row.products)
          ? row.products.join(", ")
          : row.products || "—";
        const comm = Number(row.commission ?? 0);
        const earn = Number(
          row.earnings ?? Number(row.grossSales || 0) - comm,
        );

        return `
          <tr>
            <td style="width: 32px; text-align: center; color: #64748b;">${index + 1}</td>
            <td style="white-space: nowrap; font-weight: 500;">${formatDate(row.date)}</td>
            <td style="font-weight: 600; color: #12233F;">${row.orderNumber}</td>
            <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${products}">${products}</td>
            <td class="right" style="font-weight: 600;">${money(row.grossSales)}</td>
            <td class="right" style="color: #dc2626;">-${money(comm)}</td>
            <td class="right" style="font-weight: 700; color: #059669;">${money(earn)}</td>
          </tr>
        `;
      })
      .join("");

    const topProductsHtml = topProducts
      .slice(0, 6)
      .map(
        (p, idx) => `
        <tr>
          <td style="width: 38px; text-align: center; font-weight: 700; color: #12233F;">#${idx + 1}</td>
          <td style="font-weight: 600; color: #1e293b;">${p.name}</td>
          <td class="right">${Number(p.orders || 0).toLocaleString("en-BD")}</td>
          <td class="right">${Number(p.quantity || 0).toLocaleString("en-BD")}</td>
          <td class="right" style="font-weight: 700; color: #12233F;">${money(p.sales)}</td>
        </tr>
      `,
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Sales_Report_${period}_${vendorProfile.storeName.replace(/\s+/g, "_")}</title>
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
      transition: background 0.2s;
    }
    .btn-print:hover {
      background: #e5b225;
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
    .btn-close:hover {
      background: rgba(255,255,255,0.2);
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
      letter-spacing: 0.3px;
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

    /* Store Info */
    .store-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: 1.4fr 1.1fr 1fr 0.8fr;
      gap: 12px;
      align-items: center;
    }
    .store-label {
      font-size: 8.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .store-val {
      font-size: 11.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .store-sub {
      font-size: 9.5px;
      color: #64748b;
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

    /* Table Styles */
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
      📄 ${siteName} — Vendor Sales & Performance Report (${periodInfo.bnLabel})
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
          <div><strong>Official B2B Multi-Vendor E-Commerce Network</strong></div>
          <div>Helpline: ${contactNumber} | Support: ${supportEmail}</div>
          <div>${address}</div>
        </div>
      </div>

      <div class="report-info-col">
        <div class="doc-title">Vendor Sales & Earnings Report</div>
        <div class="doc-subtitle">বিক্রেতা বিক্রয় ও আয় প্রতিবেদন</div>
        <div>
          <span class="meta-badge badge-period">${periodInfo.bnLabel} (${periodInfo.rangeText})</span>
          <span class="meta-badge badge-verified">Verified Partner</span>
        </div>
        <div class="doc-dates">
          <div>Ref No: <strong>${refNumber}</strong></div>
          <div>Issue Date: <strong>${periodInfo.generatedAt}</strong></div>
        </div>
      </div>
    </div>

    <!-- Store Info Card -->
    <div class="store-card">
      <div>
        <div class="store-label">Store / Business Name</div>
        <div class="store-val">${vendorProfile.storeName}</div>
        <div class="store-sub">Registered Seller Partner</div>
      </div>
      <div>
        <div class="store-label">Vendor Account</div>
        <div class="store-val">${vendorProfile.vendorName}</div>
        <div class="store-sub">${vendorProfile.email || "—"}</div>
      </div>
      <div>
        <div class="store-label">Helpline / Phone</div>
        <div class="store-val">${vendorProfile.phone || contactNumber}</div>
        <div class="store-sub">Account Active</div>
      </div>
      <div>
        <div class="store-label">Currency / Status</div>
        <div class="store-val">BDT (৳)</div>
        <div class="store-sub" style="color: #059669; font-weight: 700;">● Active Approved</div>
      </div>
    </div>

    <!-- Executive KPI Highlights -->
    <div class="kpi-row">
      <div class="kpi-box blue">
        <div class="kpi-lbl">Total Gross Sales</div>
        <div class="kpi-num">${money(summary.grossSales)}</div>
        <div class="kpi-desc">Delivered sales volume</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-lbl">Total Orders</div>
        <div class="kpi-num">${summary.totalOrders.toLocaleString("en-BD")}</div>
        <div class="kpi-desc">Successful orders in period</div>
      </div>
      <div class="kpi-box amber">
        <div class="kpi-lbl">Units Sold</div>
        <div class="kpi-num">${summary.productsSold.toLocaleString("en-BD")}</div>
        <div class="kpi-desc">Product units delivered</div>
      </div>
      <div class="kpi-box green">
        <div class="kpi-lbl">Net Vendor Earnings</div>
        <div class="kpi-num green">${money(summary.netEarnings)}</div>
        <div class="kpi-desc">After platform commission (${commissionRate}%)</div>
      </div>
    </div>

    <!-- Secondary KPIs -->
    <div class="kpi-row">
      <div class="kpi-box purple">
        <div class="kpi-lbl">Avg Order Value (AOV)</div>
        <div class="kpi-num">${money(averageOrderValue)}</div>
        <div class="kpi-desc">Gross average per order</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-lbl">Platform Commission</div>
        <div class="kpi-num" style="color: #dc2626;">-${money(summary.commission)}</div>
        <div class="kpi-desc">${commissionRate}% effective rate</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-lbl">Available Balance</div>
        <div class="kpi-num">${money(summary.availableEarnings ?? summary.netEarnings)}</div>
        <div class="kpi-desc">Cleared payable balance</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-lbl">Reporting Period</div>
        <div class="kpi-num" style="font-size: 13px;">${periodInfo.label}</div>
        <div class="kpi-desc">${periodInfo.rangeText}</div>
      </div>
    </div>

    <!-- Itemized Sales Table -->
    <div class="table-section-title">
      <span>Order & Sales Breakdown (${filteredSalesDetails.length} Records)</span>
      <span style="font-size: 9px; color: #64748b; font-weight: 500;">Sorted by latest transaction</span>
    </div>

    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 32px; text-align: center;">SL</th>
          <th style="width: 85px;">Date</th>
          <th style="width: 120px;">Order #</th>
          <th>Products Ordered</th>
          <th class="right" style="width: 95px;">Gross Sales</th>
          <th class="right" style="width: 90px;">Commission</th>
          <th class="right" style="width: 100px;">Net Earning</th>
        </tr>
      </thead>
      <tbody>
        ${
          orderRowsHtml ||
          `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #94a3b8;">No sales details recorded for this period.</td></tr>`
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="font-weight: 800;">TOTAL SUMMARY FOR ${periodInfo.label.toUpperCase()}</td>
          <td class="right" style="font-weight: 800;">${money(summary.grossSales)}</td>
          <td class="right" style="font-weight: 800; color: #dc2626;">-${money(summary.commission)}</td>
          <td class="right" style="font-weight: 800; color: #059669;">${money(summary.netEarnings)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Top Products Table (if any) -->
    ${
      topProducts.length > 0
        ? `
      <div class="table-section-title" style="margin-top: 16px;">
        <span>Top Performing Products</span>
        <span style="font-size: 9px; color: #64748b; font-weight: 500;">Best sellers by revenue</span>
      </div>
      <table class="report-table">
        <thead>
          <tr>
            <th style="width: 38px; text-align: center;">Rank</th>
            <th>Product Name</th>
            <th class="right" style="width: 80px;">Orders</th>
            <th class="right" style="width: 80px;">Units Sold</th>
            <th class="right" style="width: 110px;">Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${topProductsHtml}
        </tbody>
      </table>
    `
        : ""
    }

    <!-- Signatures -->
    <div class="signatures-row">
      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-name">System Automated Audit</div>
        <div class="sig-role">Prepared by Aladin Global Finance</div>
      </div>

      <div class="stamp-badge">
        ★ ALADIN GLOBAL B2B ★<br/>
        OFFICIALLY VERIFIED STATEMENT
      </div>

      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-name">Authorized Signatory</div>
        <div class="sig-role">Vendor Operations & Compliance</div>
      </div>
    </div>

    <!-- Legal disclaimer -->
    <div class="legal-notice">
      <strong>Statement Notice:</strong> This vendor earnings and sales report is electronically compiled from verified and delivered customer orders on ${siteName}. Platform commissions have been computed in accordance with the vendor merchant agreement. For disputes or payout queries, contact finance support at ${supportEmail} within 7 business days of issue.
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
    setError("");

    try {
      const html = generateReportHTML();
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        setShowPreviewModal(true);
        setError(
          "ব্রাউজারে পপ-আপ ব্লক থাকায় প্রিভিউ উইন্ডো খোলা হয়েছে। নিচের 'প্রিন্ট / সেভ পিডিএফ' বাটনে ক্লিক করুন।",
        );
        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("পিডিএফ তৈরি করার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const periodInfo = getPeriodInfo(period);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">
            Reports & Statement
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Track your store sales, orders, products, commissions and earnings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-xs">
            <CalendarDays size={16} className="text-slate-400" />

            <select
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value as ReportPeriod)
              }
              className="cursor-pointer bg-transparent text-[12px] font-semibold text-slate-700 outline-none"
            >
              <option value="7D">Last 7 Days (গত ৭ দিন)</option>
              <option value="30D">Last 30 Days (গত ৩০ দিন)</option>
              <option value="90D">Last 90 Days (গত ৯০ দিন)</option>
              <option value="1Y">Last 1 Year (গত ১ বছর)</option>
            </select>
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={loading || generatingPdf}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#12233F] px-4 text-[12px] font-semibold text-white shadow-xs transition hover:bg-[#1b3156] disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
            title="Preview formal report on screen"
          >
            <Eye size={15} className="text-slate-500" />
            Preview
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={loading || exporting || salesDetails.length === 0}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Export raw data to CSV file"
          >
            <Download size={14} className="text-slate-500" />
            {exporting ? "CSV..." : "CSV"}
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
            aria-label="Refresh reports"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[12px] text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Sales"
          value={money(summary.grossSales)}
          icon={TrendingUp}
          variant="blue"
          description={`Gross sales for ${periodInfo.bnLabel}`}
        />

        <AdminStatCard
          label="Total Orders"
          value={summary.totalOrders.toLocaleString("en-BD")}
          icon={ShoppingCart}
          variant="green"
          description={`Delivered orders in ${periodInfo.bnLabel}`}
        />

        <AdminStatCard
          label="Products Sold"
          value={summary.productsSold.toLocaleString("en-BD")}
          icon={Package}
          variant="purple"
          description="Units sold in selected period"
        />

        <AdminStatCard
          label="Your Earnings"
          value={money(summary.netEarnings)}
          icon={Wallet}
          variant="orange"
          description={`After platform commission (${commissionRate}%)`}
        />
      </div>

      {/* SALES OVERVIEW CHART */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-[#12233F]">
              Sales Trend ({periodInfo.bnLabel})
            </h2>

            <p className="mt-1 text-[11.5px] text-slate-400">
              Daily gross sales for the period ({periodInfo.rangeText})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-[11.5px] font-medium text-slate-500">
              Gross Sales (৳)
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="relative h-[280px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[4, 3, 2, 1, 0].map((line) => (
                <div
                  key={line}
                  className="border-t border-dashed border-slate-100"
                />
              ))}
            </div>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[12px] text-slate-400">
                  Loading sales chart...
                </p>
              </div>
            ) : salesTrend.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[12px] text-slate-400">
                  No sales data recorded for this period.
                </p>
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-between gap-2 overflow-x-auto px-2 sm:gap-3 sm:px-5">
                {salesTrend.map((item, index) => {
                  const height = Math.max(
                    (Number(item.sales || 0) / maxSales) * 100,
                    2,
                  );

                  return (
                    <div
                      key={`${item.date}-${index}`}
                      className="group flex h-full min-w-[26px] flex-1 flex-col items-center justify-end"
                    >
                      <div className="relative flex w-full max-w-[52px] flex-1 items-end">
                        <div
                          title={`${formatDate(item.date)}: ${money(item.sales)}`}
                          className="relative w-full rounded-t-lg bg-blue-500 transition-colors group-hover:bg-blue-600"
                          style={{ height: `${height}%` }}
                        >
                          <span className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#12233F] px-2.5 py-1.5 text-[10px] font-semibold text-white group-hover:block">
                            {money(item.sales)}
                          </span>
                        </div>
                      </div>

                      <span className="mt-3 whitespace-nowrap text-[10px] font-medium text-slate-400 sm:text-[11px]">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <MetricCard
          icon={Wallet}
          label="Average Order Value"
          value={money(averageOrderValue)}
          description="Average gross value per order"
        />

        <MetricCard
          icon={Users}
          label="Commission Deducted"
          value={money(summary.commission)}
          description={`${commissionRate}% platform fee`}
        />

        <MetricCard
          icon={TrendingUp}
          label="Net Earnings"
          value={money(summary.netEarnings)}
          description="Total payable to vendor"
        />
      </div>

      {/* SALES DETAILS AND TOP PRODUCTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* SALES DETAILS */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-[15px] font-bold text-[#12233F]">
              Sales Details
            </h2>

            <p className="mt-1 text-[11.5px] text-slate-400">
              Order and earnings breakdown for {periodInfo.bnLabel}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {[
                    "Date",
                    "Order",
                    "Products",
                    "Gross Sales",
                    "Commission",
                    "Earnings",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 first:pl-5"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-[12px] text-slate-400"
                    >
                      Loading sales details...
                    </td>
                  </tr>
                ) : filteredSalesDetails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-[12px] text-slate-400"
                    >
                      No sales details found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredSalesDetails.map((row) => {
                    const products = Array.isArray(row.products)
                      ? row.products.join(", ")
                      : row.products || "—";

                    const commission = Number(row.commission ?? 0);
                    const earnings = Number(
                      row.earnings ?? Number(row.grossSales || 0) - commission,
                    );

                    return (
                      <tr
                        key={row.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-[11.5px] font-medium text-slate-600">
                          {formatDate(row.date)}
                        </td>

                        <td className="px-3 py-4 text-[11.5px] font-semibold text-[#12233F]">
                          {row.orderNumber}
                        </td>

                        <td
                          title={products}
                          className="max-w-[150px] truncate px-3 py-4 text-[11.5px] text-slate-500"
                        >
                          {products}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-[11.5px] font-semibold text-[#12233F]">
                          {money(row.grossSales)}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-[11.5px] text-red-500">
                          -{money(commission)}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-[11.5px] font-bold text-emerald-600">
                          {money(earnings)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/70">
                  <td
                    colSpan={3}
                    className="px-5 py-4 text-[11.5px] font-bold text-[#12233F]"
                  >
                    Summary Total
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-[11.5px] font-bold text-[#12233F]">
                    {money(summary.grossSales)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-[11.5px] font-bold text-red-500">
                    -{money(summary.commission)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-[11.5px] font-bold text-emerald-600">
                    {money(summary.netEarnings)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* TOP PRODUCTS */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-[15px] font-bold text-[#12233F]">
              Top Products
            </h2>

            <p className="mt-1 text-[11.5px] text-slate-400">
              Products generating the most revenue in {periodInfo.bnLabel}
            </p>
          </div>

          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#D6A419] focus:bg-white"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-5 py-10 text-center text-[12px] text-slate-400">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[12px] font-semibold text-slate-600">
                  No products found
                </p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={product.productId || `${product.name}-${index}`}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-bold text-slate-500">
                    #{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[#12233F]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-[10.5px] text-slate-400">
                      {Number(product.orders || 0).toLocaleString("en-BD")}{" "}
                      orders ·{" "}
                      {Number(product.quantity || 0).toLocaleString("en-BD")}{" "}
                      units
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[12px] font-bold text-[#12233F]">
                      {money(product.sales)}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">Revenue</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* PERFORMANCE SUMMARY */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-[15px] font-bold text-[#12233F]">
            Performance Summary ({periodInfo.bnLabel})
          </h2>

          <p className="mt-1 text-[11.5px] text-slate-400">
            Key performance indicators for your store ({periodInfo.rangeText})
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <PerformanceItem
            label="Total Sales"
            value={money(summary.grossSales)}
            description={`Gross sales for ${periodInfo.bnLabel}`}
          />

          <PerformanceItem
            label="Total Orders"
            value={summary.totalOrders.toLocaleString("en-BD")}
            description="Delivered orders in this report"
          />

          <PerformanceItem
            label="Products Sold"
            value={summary.productsSold.toLocaleString("en-BD")}
            description="Units sold in this period"
          />

          <PerformanceItem
            label="Commission Rate"
            value={`${commissionRate}%`}
            description="Platform fee share of gross sales"
          />
        </div>
      </section>

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
                    Sales & Performance Report Preview
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
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-[#12233F] px-4 text-[12px] font-semibold text-white shadow-xs transition hover:bg-[#1b3156]"
                >
                  <Printer size={14} className="text-[#D6A419]" />
                  Print / Save as PDF
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
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
                      VENDOR SALES REPORT
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500">
                      {periodInfo.rangeText}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Generated: {periodInfo.generatedAt}
                    </p>
                  </div>
                </div>

                {/* Store Profile Box */}
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase text-slate-400">
                      Store Name
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      {vendorProfile.storeName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold uppercase text-slate-400">
                      Vendor Account
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {vendorProfile.vendorName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold uppercase text-slate-400">
                      Email
                    </span>
                    <p className="text-xs text-slate-600">
                      {vendorProfile.email || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold uppercase text-slate-400">
                      Status
                    </span>
                    <p className="text-xs font-bold text-emerald-600">
                      ● Active Verified
                    </p>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Total Sales
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {money(summary.grossSales)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Orders
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {summary.totalOrders}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Units Sold
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {summary.productsSold}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">
                      Net Earnings
                    </span>
                    <p className="text-base font-black text-emerald-600">
                      {money(summary.netEarnings)}
                    </p>
                  </div>
                </div>

                {/* Sales Details Table */}
                <div className="mt-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#12233F]">
                    Order Breakdown ({filteredSalesDetails.length} orders)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#12233F] text-white">
                        <tr>
                          <th className="py-2 pl-3">Date</th>
                          <th className="py-2">Order #</th>
                          <th className="py-2">Products</th>
                          <th className="py-2 text-right">Gross</th>
                          <th className="py-2 text-right">Comm.</th>
                          <th className="py-2 pr-3 text-right">Net</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSalesDetails.slice(0, 15).map((row) => (
                          <tr key={row.id}>
                            <td className="py-2 pl-3">{formatDate(row.date)}</td>
                            <td className="py-2 font-semibold">
                              {row.orderNumber}
                            </td>
                            <td className="max-w-[180px] truncate py-2 text-slate-500">
                              {Array.isArray(row.products)
                                ? row.products.join(", ")
                                : row.products}
                            </td>
                            <td className="py-2 text-right font-semibold">
                              {money(row.grossSales)}
                            </td>
                            <td className="py-2 text-right text-red-500">
                              -{money(Number(row.commission || 0))}
                            </td>
                            <td className="py-2 pr-3 text-right font-bold text-emerald-600">
                              {money(
                                Number(
                                  row.earnings ||
                                    Number(row.grossSales || 0) -
                                      Number(row.commission || 0),
                                ),
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t border-slate-200 bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={3} className="py-2 pl-3 text-[#12233F]">
                            Total
                          </td>
                          <td className="py-2 text-right">
                            {money(summary.grossSales)}
                          </td>
                          <td className="py-2 text-right text-red-500">
                            -{money(summary.commission)}
                          </td>
                          <td className="py-2 pr-3 text-right text-emerald-600">
                            {money(summary.netEarnings)}
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
                      System Billing Audit
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Aladin Global B2B
                    </p>
                  </div>

                  <div className="rounded-lg border border-dashed border-emerald-500 px-3 py-1.5 text-center text-[10px] font-bold text-emerald-700">
                    ★ VERIFIED STATEMENT ★
                  </div>

                  <div className="text-center">
                    <div className="w-36 border-t border-slate-400 pb-1" />
                    <p className="text-[10px] font-bold text-slate-700">
                      Authorized Signature
                    </p>
                    <p className="text-[9px] text-slate-400">Vendor Partner</p>
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

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[23px] font-bold text-[#12233F]">{value}</p>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function PerformanceItem({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <p className="text-[11.5px] font-semibold text-slate-600">{label}</p>
      <p className="mt-2 break-words text-[17px] font-bold text-[#12233F]">
        {value}
      </p>
      <p className="mt-2 text-[10.5px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}
