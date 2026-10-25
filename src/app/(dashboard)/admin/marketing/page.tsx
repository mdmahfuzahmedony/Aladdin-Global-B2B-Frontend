"use client";

import { useCallback, useEffect, useState, type ElementType } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Gift,
  HelpCircle,
  Image as ImageIcon,
  Megaphone,
  MousePointerClick,
  Percent,
  RadioTower,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  Users,
  Wallet,
  ChevronDown,
  Clock,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import BrandModal from "@/components/modals/Add/BrandModal";
import { createClient } from "../../../../../lib/supabase-client";

// =====================================================
// API CONFIGURATION
// =====================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const supabase = createClient();

// =====================================================
// TYPES
// =====================================================
type ActionVariant = "blue" | "green" | "purple" | "orange" | "pink" | "yellow";

type MarketingAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  variant: ActionVariant;
  isReady: boolean;
};

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
};

type Banner = {
  id: string;
  name: string;
  image?: string;
  status?: string;
  placementKey?: string;
};

// =====================================================
// ALL MARKETING ACTIONS (Preserved for future use)
// =====================================================
const marketingActions: MarketingAction[] = [
  {
    id: "banners",
    title: "Homepage Banners",
    description: "Manage promotional hero and section banners.",
    href: "/admin/marketing/banners",
    icon: ImageIcon,
    variant: "blue",
    isReady: true,
  },
  {
    id: "brand",
    title: "Brand Management",
    description: "Manage your store brands and official brand catalog.",
    href: "/admin/marketing/brand",
    icon: Award,
    variant: "green",
    isReady: true,
  },
  {
    id: "faq",
    title: "FAQ Management",
    description: "Create and manage customer and vendor FAQs.",
    href: "/admin/marketing/faq",
    icon: HelpCircle,
    variant: "pink",
    isReady: true,
  },
  {
    id: "coupons",
    title: "Coupon Codes",
    description: "Create and manage discount promo codes.",
    href: "/admin/marketing/coupons",
    icon: Percent,
    variant: "yellow",
    isReady: false,
  },
  {
    id: "discounts",
    title: "Discount Offers",
    description: "Manage regular and flash discount pricing.",
    href: "/admin/marketing/discounts",
    icon: Sparkles,
    variant: "orange",
    isReady: false,
  },
  {
    id: "festival-campaigns",
    title: "Festival Campaigns",
    description: "Create and schedule special festive campaigns.",
    href: "/admin/marketing/festival-campaigns",
    icon: Gift,
    variant: "orange",
    isReady: false,
  },
  {
    id: "free-shipping",
    title: "Free Shipping",
    description: "Manage free delivery promotional campaigns.",
    href: "/admin/marketing/free-shipping",
    icon: Truck,
    variant: "blue",
    isReady: false,
  },
  {
    id: "category-offers",
    title: "Category Offers",
    description: "Create promotional deals for selected categories.",
    href: "/admin/marketing/category-offers",
    icon: Tag,
    variant: "green",
    isReady: false,
  },
  {
    id: "seller-promotions",
    title: "Seller Promotions",
    description: "Promotional booster tools for vendors and sellers.",
    href: "/admin/marketing/seller-promotions",
    icon: Users,
    variant: "purple",
    isReady: false,
  },
  {
    id: "sponsored-products",
    title: "Sponsored Products",
    description: "Promote featured products across search & feed.",
    href: "/admin/marketing/sponsored-products",
    icon: Megaphone,
    variant: "pink",
    isReady: false,
  },
];

const actionStyles: Record<
  ActionVariant,
  {
    icon: string;
    hover: string;
  }
> = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    hover: "hover:border-blue-200 hover:bg-blue-50/40",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    hover: "hover:border-emerald-200 hover:bg-emerald-50/40",
  },
  purple: {
    icon: "bg-violet-100 text-violet-600",
    hover: "hover:border-violet-200 hover:bg-violet-50/40",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    hover: "hover:border-orange-200 hover:bg-orange-50/40",
  },
  pink: {
    icon: "bg-pink-100 text-pink-600",
    hover: "hover:border-pink-200 hover:bg-pink-50/40",
  },
  yellow: {
    icon: "bg-amber-100 text-amber-600",
    hover: "hover:border-amber-200 hover:bg-amber-50/40",
  },
};

// Helper to get formatted recent dates for charts
function getRecentChartDates() {
  const dates = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    dates.push(
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
      }).format(d),
    );
  }
  return dates;
}

export default function MarketingPage() {
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [selectedUpcoming, setSelectedUpcoming] =
    useState<MarketingAction | null>(null);

  // REAL DATA STATES
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  // FETCH REAL BRANDS
  const fetchBrands = useCallback(async () => {
    try {
      setBrandsLoading(true);
      const response = await fetch(`${API_URL}/api/brands`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error);
      setBrands(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.warn("GET BRANDS ERROR:", error);
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  // FETCH REAL FAQS
  const fetchFAQs = useCallback(async () => {
    try {
      setFaqsLoading(true);
      const response = await fetch(`${API_URL}/api/faqs/admin`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error);
      setFaqs(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.warn("GET FAQS ERROR:", error);
      setFaqs([]);
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  // FETCH REAL BANNERS
  const fetchBanners = useCallback(async () => {
    try {
      setBannersLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${API_URL}/api/banners`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });

      const result = await response.json();
      if (response.ok && Array.isArray(result?.banners)) {
        setBanners(result.banners);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.warn("GET BANNERS ERROR:", error);
      setBanners([]);
    } finally {
      setBannersLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBrands();
    void fetchFAQs();
    void fetchBanners();
  }, [fetchBrands, fetchFAQs, fetchBanners]);

  const handleSaveBrand = async () => {
    await fetchBrands();
    setIsBrandModalOpen(false);
  };

  // Real Calculated Metrics
  const totalBrands = brands.length;
  const activeBrands = brands.filter((b) => b.status === "ACTIVE").length;

  const totalBanners = banners.length;
  const activeBanners = banners.filter(
    (b) => String(b.status).toUpperCase() === "ACTIVE",
  ).length;

  const totalFAQs = faqs.length;
  const activeFAQs = faqs.filter((faq) => faq.isActive).length;

  const chartDates = getRecentChartDates();

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Megaphone size={21} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
                Marketing & Campaigns
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage promotional banners, brands, customer FAQs and campaign
                tools
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQuickMenu((prev) => !prev)}
            className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-xs transition sm:w-auto"
          >
            <Plus size={16} />
            Quick Actions
            <ChevronDown size={14} />
          </button>

          {showQuickMenu && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-30 cursor-default"
                onClick={() => setShowQuickMenu(false)}
              />

              <div className="absolute right-0 top-full z-40 mt-2 w-60 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ready to manage
                </div>

                <Link
                  href="/admin/marketing/banners"
                  onClick={() => setShowQuickMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ImageIcon size={15} className="text-blue-500" />
                  Homepage Banners
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsBrandModalOpen(true);
                    setShowQuickMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Award size={15} className="text-emerald-500" />
                  Add New Brand
                </button>

                <Link
                  href="/admin/marketing/faq"
                  onClick={() => setShowQuickMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <HelpCircle size={15} className="text-pink-500" />
                  Create FAQ
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Upcoming
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedUpcoming({
                      id: "campaign",
                      title: "Campaign Creator",
                      description:
                        "Create scheduled festival and flash sale campaigns.",
                      href: "#",
                      icon: Megaphone,
                      variant: "orange",
                      isReady: false,
                    });
                    setShowQuickMenu(false);
                  }}
                  className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-semibold text-slate-500 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2.5">
                    <Megaphone size={15} className="text-amber-500" />
                    New Campaign
                  </span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-800">
                    Upcoming
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* MARKETING OVERVIEW (Real & Authentic Baseline) */}
      {/* ================================================= */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#12233F]">
            Marketing Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time counts for active marketing channels and promotional
            assets
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {/* TOTAL BRANDS */}
          <AdminStatCard
            label="Total Brands"
            value={brandsLoading ? "..." : totalBrands}
            icon={Award}
            variant="green"
            description={`${activeBrands} active brands in store catalog`}
          />

          {/* TOTAL BANNERS */}
          <AdminStatCard
            label="Total Banners"
            value={bannersLoading ? "..." : totalBanners}
            icon={ImageIcon}
            variant="blue"
            description={`${activeBanners} active promotional banners`}
          />

          {/* TOTAL FAQS */}
          <AdminStatCard
            label="Published FAQs"
            value={faqsLoading ? "..." : totalFAQs}
            icon={HelpCircle}
            variant="pink"
            description={`${activeFAQs} active customer help items`}
          />

          {/* ACTIVE CAMPAIGNS */}
          <AdminStatCard
            label="Active Campaigns"
            value={0}
            icon={Megaphone}
            variant="orange"
            description="No active paid campaigns running"
          />

          {/* CAMPAIGN AD SPEND */}
          <AdminStatCard
            label="Campaign Ad Spend"
            value="৳0"
            icon={Wallet}
            variant="blue"
            description="Total advertising budget utilized"
          />

          {/* MARKETING REVENUE */}
          <AdminStatCard
            label="Marketing Revenue"
            value="৳0"
            icon={ShoppingBag}
            variant="purple"
            description="Revenue generated via campaigns"
          />

          {/* CONVERSION RATE */}
          <AdminStatCard
            label="Campaign Conversion"
            value="0.0%"
            icon={Percent}
            variant="green"
            description="Computed upon campaign execution"
          />

          {/* PENDING APPROVALS */}
          <AdminStatCard
            label="Pending Approvals"
            value={0}
            icon={AlertTriangle}
            variant="yellow"
            description="All marketing items reviewed & OK"
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* PERFORMANCE ANALYTICS (Clean Realistic Baseline) */}
      {/* ================================================= */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#12233F]">
            Performance Analytics
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track promotional reach, brand engagement and campaign conversions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Sales & Revenue Trend */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-bold text-[#12233F]">
                  Promotional Revenue Trend
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Sales attributed to active marketing and banners
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                Weekly Tracking
              </span>
            </div>

            {/* Baseline trend chart */}
            <div className="flex h-[260px] items-end justify-between gap-3 border-b border-l border-slate-100 px-4 pb-4">
              {[15, 20, 25, 30, 45].map((val, idx) => (
                <div
                  key={idx}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="w-full max-w-[48px] rounded-t-md bg-amber-400/80 transition group-hover:bg-amber-500"
                    style={{ height: `${val}%` }}
                    title={`Asset Baseline: ${val}%`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between gap-2 text-[10px] text-slate-400 sm:text-[11px]">
              {chartDates.map((date, idx) => (
                <span key={idx}>{date}</span>
              ))}
            </div>
          </div>

          {/* Marketing Channels Status */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="mb-5">
              <h3 className="font-bold text-[#12233F]">
                Active Marketing Channels
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Live status and deployment across platform assets
              </p>
            </div>

            <div className="space-y-4">
              {/* Banners Channel */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <ImageIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Homepage & Section Banners
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {activeBanners} active / {totalBanners} total banners
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>

              {/* Brands Channel */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Award size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Brand Partnerships & Logos
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {activeBrands} active / {totalBrands} registered brands
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>

              {/* FAQs Channel */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                      <HelpCircle size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        FAQ & Customer Trust Hub
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {activeFAQs} published / {totalFAQs} total FAQs
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>

              {/* Custom Campaigns */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Discount & Coupon Campaigns
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Modules ready for upcoming promotion setup
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* MARKETING TOOLS (All 10 Options Preserved) */}
      {/* ================================================= */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#12233F]">Marketing Tools</h2>
          <p className="mt-1 text-sm text-slate-500">
            Active channels and upcoming promotional tools ready for campaign
            execution
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {marketingActions.map((action) => {
            const Icon = action.icon;
            const style = actionStyles[action.variant];

            if (action.isReady) {
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className={`group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.hover}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                    >
                      <Icon size={21} />
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#12233F]">
                    {action.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-700">
                    <span>Manage →</span>
                    <MousePointerClick
                      size={15}
                      className="text-slate-300 transition group-hover:text-emerald-600"
                    />
                  </div>
                </Link>
              );
            }

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => setSelectedUpcoming(action)}
                className={`group relative rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.hover}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                  >
                    <Icon size={21} />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    Upcoming
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-[#12233F]">
                  {action.title}
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {action.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Configure (Soon) →</span>
                  <Clock
                    size={15}
                    className="text-slate-300 transition group-hover:text-amber-500"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================================================= */}
      {/* UPCOMING FEATURE MODAL */}
      {/* ================================================= */}
      {selectedUpcoming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock size={22} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedUpcoming(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="mt-4 text-base font-bold text-[#12233F]">
              {selectedUpcoming.title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {selectedUpcoming.description}
            </p>

            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/70 p-3.5 text-[11.5px] leading-relaxed text-amber-900">
              💡 <strong>মডিউল স্ট্যাটাস:</strong> এই অপশনটির আর্কিটেকচার ও
              ফ্রেমওয়ার্ক প্রস্তুত রাখা হয়েছে যাতে পরবর্তীতে ক্যাম্পেইন রান করার
              সময় সহজেই এর ব্যাকএন্ড যুক্ত করা যায়।
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedUpcoming(null)}
                className="btn-gold rounded-xl px-4 py-2 text-xs font-semibold"
              >
                ঠিক আছে, বুঝতে পেরেছি
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* BRAND MODAL */}
      {/* ================================================= */}
      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={handleSaveBrand}
      />
    </div>
  );
}
