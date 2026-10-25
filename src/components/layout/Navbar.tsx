"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingCart,
  Home,
  Package,
  ChevronDown,
  Tags,
  BadgePercent,
  X,
  GitCompareArrows,
  Store,
  Menu,
} from "lucide-react";

import { createClient } from "../../../lib/supabase-client";
import CartSidebar from "../sidebar/CartSidebar";

import { LanguageDropdown } from "../header/navbar/language-dropdown";
import { AccountDropdown } from "./../header/navbar/account-dropdown";
import { AllCategoriesMenu } from "../header/navbar/AllCategoriesMenu";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { useCompare } from "../../context/CompareContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type CartItem = {
  id: string;
  productId?: string;
  quantity: number;
  [key: string]: any;
};

type TopBanner = {
  id?: string;
  imageUrl?: string;
  image?: string;
  title?: string;
  name?: string;
  link?: string;
  [key: string]: any;
};

export default function MainNavbar() {
  const { settings } = useSiteSettings();
  const { compareCount } = useCompare();
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [topBanners, setTopBanners] = useState<TopBanner[]>([]);
  const [currentTopBanner, setCurrentTopBanner] = useState(0);

  const [supabase] = useState(() => createClient());

  const getAccessToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  }, [supabase]);

  const loadCart = useCallback(async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        setIsSignedIn(false);
        setCartItems([]);
        return;
      }

      setIsSignedIn(true);

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Cart load করতে সমস্যা হয়েছে");
      }

      const result = await response.json();

      const items = Array.isArray(result)
        ? result
        : (result?.items ?? result?.data?.items ?? result?.data ?? []);

      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Load cart error:", error);
    }
  }, [getAccessToken]);

  // AUTH SESSION
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setIsSignedIn(Boolean(session?.access_token));
        setAuthReady(true);

        if (session?.access_token) {
          await loadCart();
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (mounted) {
          setIsSignedIn(false);
          setCartItems([]);
          setAuthReady(true);
        }
      }
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setIsSignedIn(false);
        setCartItems([]);
        setCartOpen(false);
        setAccountOpen(false);
        return;
      }

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        setIsSignedIn(Boolean(session?.access_token));
        setAuthReady(true);

        if (session?.access_token) {
          window.setTimeout(() => {
            if (mounted) void loadCart();
          }, 0);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadCart]);

  // TOP BANNERS
  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/banners/public/top`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const result = await response.json();

        const banners = Array.isArray(result)
          ? result
          : (result?.banners ?? result?.data?.banners ?? result?.data ?? []);

        if (mounted && Array.isArray(banners)) {
          setTopBanners(banners);
          setCurrentTopBanner(0);
        }
      } catch (error) {
        console.error("Fetch top banners error:", error);
      }
    };

    void fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  // BANNER SLIDESHOW
  useEffect(() => {
    if (topBanners.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentTopBanner((previous) => (previous + 1) % topBanners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [topBanners.length]);

  // CLOSE ACCOUNT ON OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest("[data-account-area]") &&
        !target.closest("[data-account-dropdown]")
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = search.trim();
    if (!value) return;

    window.location.href = `/products?search=${encodeURIComponent(value)}`;
  };

  const handleOpenCart = async () => {
    const token = await getAccessToken();

    if (!token) {
      setIsSignedIn(false);
      setCartItems([]);
      setCartOpen(false);
      return;
    }

    setIsSignedIn(true);
    setAccountOpen(false);
    setCategoryOpen(false);
    setMobileCategoriesOpen(false);
    setCartOpen(true);

    await loadCart();
  };

  const handleCartChanged = async () => {
    await loadCart();
  };

  const handleAccountToggle = () => {
    setAccountOpen((previous) => !previous);
    setCategoryOpen(false);
    setMobileCategoriesOpen(false);
    setCartOpen(false);
  };

  const handleOpenCategories = () => {
    setCategoryOpen((previous) => !previous);
    setAccountOpen(false);
    setCartOpen(false);
  };

  const handleOpenMobileCategories = () => {
    setMobileCategoriesOpen(true);
    setAccountOpen(false);
    setCartOpen(false);
    setCategoryOpen(false);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  const activeBanner = topBanners[currentTopBanner];
  const bannerImage = activeBanner?.imageUrl || activeBanner?.image || "";
  const bannerTitle =
    activeBanner?.title || activeBanner?.name || "Promotional banner";

  // TOP PROMO BANNER
  const bannerContent = (
    <div className="relative h-[65px] overflow-hidden rounded-none bg-slate-100 sm:h-[80px] xl:h-[100px]">
      {bannerImage ? (
        <Link
          href={activeBanner?.link || "/"}
          className="block h-full w-full"
          aria-label={bannerTitle}
        >
          <img
            src={bannerImage}
            alt={bannerTitle}
            className="h-full w-full object-cover"
          />
        </Link>
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-[#12233F] to-[#243e65] px-3 text-center text-white">
          <div>
            <p className="text-xs font-bold sm:text-sm">
              Discover Great Products
            </p>
            <p className="mt-1 text-[10px] text-white/80 sm:text-xs">
              Shop your favorites at Aladin Global
            </p>
          </div>
        </div>
      )}

      {topBanners.length > 1 && (
        <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {topBanners.map((banner, index) => (
            <button
              key={banner.id || index}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setCurrentTopBanner(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentTopBanner === index
                  ? "w-5 bg-[#D6A419]"
                  : "w-1.5 bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* TOP PROMO BANNER: top gap zero, square corners */}
      <div className="w-full max-w-none px-0 pt-0 pb-2 sm:px-2 lg:px-0 lg:pb-0">
        {bannerContent}
      </div>

      {/* DESKTOP HEADER */}
      <header className="relative z-40 hidden border-b border-white/10 bg-[#24476B] xl:block">
        {/* SECTION 1: LOGO, SEARCH AND ACTIONS */}
        <div className="mx-auto flex min-h-[82px] max-w-[1500px] items-center gap-6 px-6 py-3">
          {/* LOGO */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName || "Logo"}
                className="h-11 w-auto max-w-[180px] object-contain rounded-lg"
              />
            ) : (
              <>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12233F] text-[#D6A419]">
                  <Store size={25} />
                </div>

                <div>
                  <span className="block text-[21px] font-extrabold leading-tight tracking-tight text-white">
                    {settings.siteName?.split(" ")[0] || "Aladin"}
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[2px] text-[#D6A419]">
                    {settings.siteName?.split(" ").slice(1).join(" ") || "Global"}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* DESKTOP SEARCH */}
          <form
            onSubmit={handleSearch}
            className="flex h-[44px] min-w-0 flex-1 overflow-hidden rounded-md border border-white/20 bg-white focus-within:border-[#D6A419] focus-within:ring-1 focus-within:ring-[#D6A419]"
          >
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands and more..."
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-700 outline-none"
            />

            <button
              type="submit"
              aria-label="Search"
              className="flex w-[55px] shrink-0 items-center justify-center bg-[#D6A419] text-[#12233F] transition hover:bg-[#c69a12]"
            >
              <Search size={20} />
            </button>
          </form>

          {/* ACCOUNT */}
          <div
            data-account-area
            className="relative shrink-0"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <button
              type="button"
              onClick={handleAccountToggle}
              aria-expanded={accountOpen}
              className="flex flex-col items-center text-white transition hover:text-[#D6A419]"
            >
              <User size={22} />
              <span className="mt-1 text-[11px] font-semibold">Account</span>
            </button>

            {accountOpen && (
              <div
                data-account-dropdown
                className="absolute right-0 top-full z-[100] w-[300px] pt-3"
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white text-white shadow-xl">
                  <AccountDropdown onClose={() => setAccountOpen(false)} />
                </div>
              </div>
            )}
          </div>

          {/* COMPARE */}
          <Link
            href="/compare"
            className="flex shrink-0 flex-col items-center text-white transition hover:text-[#D6A419]"
          >
            <div className="relative">
              <GitCompareArrows size={22} />
              {compareCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D6A419] px-1 text-[10px] font-bold text-[#12233F]">
                  {compareCount}
                </span>
              )}
            </div>
            <span className="mt-1 text-[11px] font-semibold">Compare</span>
          </Link>

          {/* LANGUAGE */}
          <div className=" text-white">
            <LanguageDropdown />
          </div>

          {/* CART */}
          {authReady && isSignedIn && (
            <button
              type="button"
              onClick={handleOpenCart}
              className="flex shrink-0 flex-col items-center text-white transition hover:text-[#D6A419]"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D6A419] px-1 text-[10px] font-bold text-[#12233F]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] font-semibold">Cart</span>
            </button>
          )}
        </div>

        {/* SECTION 2: NAVIGATION */}
        <div className="border-t border-white/10 ">
          <nav className="mx-auto flex h-[55px] max-w-[1500px] items-center gap-8 px-6 py-2 text-sm font-semibold text-white">
            {/* ALL CATEGORIES: SAME BACKGROUND AS SECTION */}
            <div
              className="relative flex h-full shrink-0 items-center"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >
              <button
                type="button"
                onClick={handleOpenCategories}
                aria-expanded={categoryOpen}
                className="flex h-full items-center gap-2 px-5 text-white transition hover:bg-white/10 hover:text-[#D6A419]"
              >
                <Tags size={17} />
                All Categories
                <ChevronDown size={15} />
              </button>

              {categoryOpen && (
                <div className="absolute left-0 top-full z-[90] w-[850px] max-w-[90vw]">
                  <div className="overflow-hidden rounded-b-lg border border-slate-200 bg-white text-slate-800 shadow-xl">
                    <AllCategoriesMenu onClose={() => setCategoryOpen(false)} />
                  </div>
                </div>
              )}
            </div>

            <Link href="/" className="transition hover:text-[#D6A419]">
              Home
            </Link>

            <Link href="/products" className="transition hover:text-[#D6A419]">
              Products
            </Link>
          </nav>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="relative z-40 border-b border-white/10 bg-[#24476B] px-3 py-5 text-white xl:hidden sm:px-5">
        {/* MOBILE TOP ROW */}
        <div className="flex items-center justify-between gap-2">
          {/* HAMBURGER */}
          <button
            type="button"
            onClick={handleOpenMobileCategories}
            aria-label="Open categories menu"
            aria-expanded={mobileCategoriesOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          >
            <Menu size={23} />
          </button>

          {/* LOGO */}
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-1.5">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName || "Logo"}
                className="h-8 w-auto max-w-[130px] object-contain rounded-md"
              />
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#12233F] text-[#D6A419]">
                  <Store size={21} />
                </div>

                <div>
                  <span className="block text-[16px] font-extrabold leading-tight text-white sm:text-[17px]">
                    {settings.siteName?.split(" ")[0] || "Aladin"}
                  </span>
                  <span className="block text-[9px] font-bold uppercase tracking-[1.5px] text-[#D6A419]">
                    {settings.siteName?.split(" ").slice(1).join(" ") || "Global"}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* ACCOUNT */}
          <button
            type="button"
            data-account-area
            onClick={handleAccountToggle}
            aria-label="Open account"
            aria-expanded={accountOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          >
            <User size={21} />
          </button>

          {/* COMPARE */}
          <Link
            href="/compare"
            aria-label="Compare products"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          >
            <GitCompareArrows size={20} />
            {compareCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D6A419] px-1 text-[9px] font-bold text-[#12233F]">
                {compareCount}
              </span>
            )}
          </Link>

          {/* LANGUAGE */}
          <div className="flex min-w-0 shrink-0 items-center text-white">
            <LanguageDropdown />
          </div>

          {/* CART */}
          {authReady && isSignedIn && (
            <button
              type="button"
              onClick={handleOpenCart}
              aria-label="Open cart"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            >
              <ShoppingCart size={21} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D6A419] px-1 text-[9px] font-bold text-[#12233F]">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* MOBILE SEARCH */}
        <form
          onSubmit={handleSearch}
          className="mt-4 flex h-10 w-full overflow-hidden rounded-lg border border-white/20 bg-white focus-within:border-[#D6A419]"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="min-w-0 flex-1 bg-transparent px-3 text-xs text-slate-700 outline-none sm:text-sm"
          />

          <button
            type="submit"
            aria-label="Search products"
            className="flex w-10 shrink-0 items-center justify-center bg-[#D6A419] text-[#12233F] transition hover:bg-[#c69a12]"
          >
            <Search size={18} />
          </button>
        </form>

        {/* MOBILE NAVIGATION */}
        <nav className="mt-4 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap border-t border-white/10  px-2 pt-4 pb-2 text-xs font-semibold text-white sm:gap-5 sm:text-sm">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 transition hover:text-[#D6A419]"
          >
            <Home size={15} />
            Home
          </Link>

          <Link
            href="/products"
            className="flex shrink-0 items-center gap-1.5 transition hover:text-[#D6A419]"
          >
            <Package size={15} />
            Products
          </Link>

          <Link
            href="/categories"
            className="flex shrink-0 items-center gap-1.5 transition hover:text-[#D6A419]"
          >
            <Tags size={15} />
            Categories
          </Link>

          <Link
            href="/brands"
            className="shrink-0 transition hover:text-[#D6A419]"
          >
            Brands
          </Link>

          <Link
            href="/deals"
            className="flex shrink-0 items-center gap-1.5 transition hover:text-[#D6A419]"
          >
            <BadgePercent size={15} className="text-[#D6A419]" />
            Deals
          </Link>
        </nav>
      </header>

      {/* MOBILE CATEGORY DRAWER */}
      {mobileCategoriesOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden">
          <button
            type="button"
            aria-label="Close categories menu"
            onClick={() => setMobileCategoriesOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-950/50"
          />

          <aside
            className="absolute left-0 top-0 flex h-full w-[320px] max-w-[88vw] flex-col bg-white text-slate-800 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="All categories"
          >
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/10 bg-[#193653] px-4">
              <div className="flex items-center gap-2">
                <Tags size={20} className="text-[#D6A419]" />
                <h2 className="text-base font-bold text-white">
                  All Categories
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(false)}
                aria-label="Close categories sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              >
                <X size={21} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <AllCategoriesMenu
                mode="mobile"
                onClose={() => setMobileCategoriesOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}

      {/* MOBILE ACCOUNT DRAWER */}
      {accountOpen && (
        <div className="fixed inset-0 z-[90] xl:hidden">
          <button
            type="button"
            aria-label="Close account"
            onClick={() => setAccountOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-950/50"
          />

          <aside
            data-account-dropdown
            className="absolute right-0 top-0 flex h-full w-[280px] max-w-[88vw] flex-col bg-white text-slate-800 shadow-2xl sm:w-[320px]"
          >
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/10 bg-[#193653] px-4">
              <div className="flex items-center gap-2">
                <User size={20} className="text-[#D6A419]" />
                <h2 className="text-base font-bold text-white">My Account</h2>
              </div>

              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                aria-label="Close account sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              >
                <X size={21} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <AccountDropdown onClose={() => setAccountOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* CART SIDEBAR */}
      {authReady && isSignedIn && (
        <CartSidebar
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
                    onCartChanged={handleCartChanged}
        />
      )}
    </>
  );
}
