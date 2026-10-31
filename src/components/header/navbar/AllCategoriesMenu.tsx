"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Folder,
  Loader2,
} from "lucide-react";
import CategoryIcon from "@/components/category/CategoryIcon";
import { useLanguage } from "@/context/LanguageContext";

// ======================================================
// API
// ======================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const CATEGORY_API = `${API_URL}/api/categories/main-with-count`;

// ======================================================
// TYPES
// ======================================================

type ApiCategory = {
  id: string;
  name: string;
  slug?: string;
  type?: string | null;
  fieldsConfig?: unknown;
  image?: string | null;
  icon?: string | null;
  parentId?: string | null;
  sortOrder?: number | null;
  productCount?: number;
  children?: ApiCategory[];
};

type CategoryNode = {
  id: string;
  name: string;
  slug?: string;
  type?: string | null;
  image?: string | null;
  icon?: string | null;
  parentId?: string | null;
  sortOrder: number;
  productCount?: number;
  children: CategoryNode[];
};

type MegaMenuProps = {
  onClose: () => void;
  mode?: "desktop" | "mobile";
};

// ======================================================
// SORT CATEGORIES
// sortOrder একই হলে API-এর আগের ক্রম বজায় থাকবে
// ======================================================

function sortByOrder<T extends { sortOrder?: number | null }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = a.item.sortOrder;
      const orderB = b.item.sortOrder;

      // sortOrder না থাকলে API-এর মূল ক্রম অগ্রাধিকার পাবে
      if (orderA == null && orderB == null) {
        return a.index - b.index;
      }

      if (orderA == null) return 1;
      if (orderB == null) return -1;

      return orderA - orderB || a.index - b.index;
    })
    .map(({ item }) => item);
}

// ======================================================
// EXTRACT API CATEGORIES
// ======================================================

function extractCategories(payload: unknown): ApiCategory[] {
  if (Array.isArray(payload)) {
    return payload as ApiCategory[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = payload as Record<string, unknown>;

  if (Array.isArray(data.categories)) {
    return data.categories as ApiCategory[];
  }

  if (Array.isArray(data.data)) {
    return data.data as ApiCategory[];
  }

  if (data.data && typeof data.data === "object") {
    const nestedData = data.data as Record<string, unknown>;

    if (Array.isArray(nestedData.categories)) {
      return nestedData.categories as ApiCategory[];
    }

    if (Array.isArray(nestedData.data)) {
      return nestedData.data as ApiCategory[];
    }
  }

  return [];
}

// ======================================================
// MAP NESTED CATEGORY
// ======================================================

function mapNestedCategory(category: ApiCategory): CategoryNode {
  const children = Array.isArray(category.children)
    ? sortByOrder(category.children).map(mapNestedCategory)
    : [];

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type,
    image: category.image ?? null,
    icon: category.icon ?? null,
    parentId: category.parentId ?? null,
    sortOrder: category.sortOrder ?? 0,
    productCount: category.productCount,
    children,
  };
}

// ======================================================
// BUILD CATEGORY TREE
// Supports nested and flat API responses
// ======================================================

function buildCategoryTree(categories: ApiCategory[]): CategoryNode[] {
  if (categories.length === 0) {
    return [];
  }

  const hasNestedChildren = categories.some(
    (category) =>
      Array.isArray(category.children) && category.children.length > 0,
  );

  // API already provides a nested category tree
  if (hasNestedChildren) {
    return sortByOrder(categories.filter((category) => !category.parentId)).map(
      mapNestedCategory,
    );
  }

  // API provides a flat category list
  const categoryMap = new Map<string, CategoryNode>();

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
      image: category.image ?? null,
      icon: category.icon ?? null,
      parentId: category.parentId ?? null,
      sortOrder: category.sortOrder ?? 0,
      productCount: category.productCount,
      children: [],
    });
  });

  const roots: CategoryNode[] = [];

  categories.forEach((category) => {
    const current = categoryMap.get(category.id);

    if (!current) return;

    if (category.parentId && categoryMap.has(category.parentId)) {
      categoryMap.get(category.parentId)!.children.push(current);
    } else {
      roots.push(current);
    }
  });

  // Sort every level using the saved order
  const sortTree = (items: CategoryNode[]): CategoryNode[] => {
    return sortByOrder(items).map((item) => ({
      ...item,
      children: sortTree(item.children),
    }));
  };

  return sortTree(roots);
}

// ======================================================
// CATEGORY URL
// ======================================================

function getCategoryHref(category: CategoryNode) {
  return category.slug
    ? `/categories/${encodeURIComponent(category.slug)}`
    : `/products?category=${encodeURIComponent(category.id)}`;
}

// ======================================================
// MEGA MENU
// ======================================================

export function AllCategoriesMenu({
  onClose,
  mode = "desktop",
}: MegaMenuProps) {
  const isMobile = mode === "mobile";
  const { t } = useLanguage();

  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Desktop hover path
  const [activePath, setActivePath] = useState<CategoryNode[]>([]);

  // Mobile expanded categories
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (isMobile) return;

    cancelCloseTimer();

    closeTimerRef.current = setTimeout(() => {
      onClose();
      closeTimerRef.current = null;
    }, 220);
  }, [cancelCloseTimer, onClose, isMobile]);

  useEffect(() => {
    return () => {
      cancelCloseTimer();
    };
  }, [cancelCloseTimer]);

  // ====================================================
  // LOAD CATEGORIES FROM API
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(CATEGORY_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load categories (${response.status})`);
        }

        const payload: unknown = await response.json();
        const apiCategories = extractCategories(payload);
        const tree = buildCategoryTree(apiCategories);

        // গুরুত্বপূর্ণ:
        // এখানে নাম অনুযায়ী tree.sort() করা হবে না।
        // API/database-এর sortOrder-ই category order নির্ধারণ করবে।

        if (!mounted) return;

        setCategories(tree);
        setActivePath(tree.length > 0 ? [tree[0]] : []);
        setExpandedIds(new Set());
      } catch (err) {
        console.error("MegaMenu error:", err);

        if (!mounted) return;

        setError("Categories could not be loaded.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // DESKTOP COLUMN DATA
  // ====================================================

  const getColumnCategories = useCallback(
    (depth: number): CategoryNode[] => {
      if (depth === 0) {
        return categories;
      }

      const parent = activePath[depth - 1];

      return parent?.children ?? [];
    },
    [categories, activePath],
  );

  // ====================================================
  // DESKTOP HOVER
  // ====================================================

  const handleCategoryHover = useCallback(
    (category: CategoryNode, depth: number) => {
      cancelCloseTimer();

      if (category.children.length > 0) {
        setActivePath((current) => {
          const nextPath = current.slice(0, depth);
          nextPath.push(category);
          return nextPath;
        });

        return;
      }

      setActivePath((current) => current.slice(0, depth));
    },
    [cancelCloseTimer],
  );

  // ====================================================
  // MOBILE CATEGORY TOGGLE
  // ====================================================

  const handleCategoryTap = (category: CategoryNode) => {
    if (category.children.length > 0) {
      setExpandedIds((current) => {
        const next = new Set(current);

        if (next.has(category.id)) {
          next.delete(category.id);

          const removeDescendants = (items: CategoryNode[]) => {
            items.forEach((item) => {
              next.delete(item.id);

              if (item.children.length > 0) {
                removeDescendants(item.children);
              }
            });
          };

          removeDescendants(category.children);
        } else {
          next.add(category.id);
        }

        return next;
      });

      return;
    }

    window.location.href = getCategoryHref(category);
  };

  // ====================================================
  // DESKTOP CATEGORY ITEM
  // ====================================================

  const renderDesktopCategoryItem = (category: CategoryNode, depth: number) => {
    const hasChildren = category.children.length > 0;
    const active = depth === 0 && activePath[0]?.id === category.id;

    return (
      <a
        key={category.id}
        href={getCategoryHref(category)}
        className={[
          "flex w-full min-w-0 items-center justify-between gap-2",
          "rounded-lg px-2 text-left transition-all duration-150 ease-out",
          depth === 0 ? "py-2" : "py-1",
          active
            ? "bg-[#fff8e6] text-[#12233F] shadow-sm"
            : "text-slate-700 hover:bg-[#fffbf2] hover:text-[#12233F]",
        ].join(" ")}
        onMouseEnter={() => handleCategoryHover(category, depth)}
        onFocus={() => handleCategoryHover(category, depth)}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {depth === 0 && (
            <CategoryIcon
              icon={category.icon}
              name={category.name}
              size={17}
              className="shrink-0 text-[#d6a419]"
            />
          )}
          <span className="truncate text-sm font-medium">{category.name}</span>
        </span>

        {hasChildren && (
          <ChevronRight
            size={16}
            className={[
              "shrink-0",
              active ? "text-[#d6a419]" : "text-slate-400",
            ].join(" ")}
          />
        )}
      </a>
    );
  };

  // ====================================================
  // MOBILE CATEGORY ITEM
  // ====================================================

  const renderMobileCategory = (
    category: CategoryNode,
    depth = 0,
  ): React.ReactNode => {
    const hasChildren = category.children.length > 0;
    const expanded = expandedIds.has(category.id);

    return (
      <React.Fragment key={category.id}>
        <button
          type="button"
          onClick={() => handleCategoryTap(category)}
          aria-expanded={hasChildren ? expanded : undefined}
          className={[
            "flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3 text-left transition-colors hover:text-[#12233F]",
            depth === 0 ? "py-2.5" : "py-1",
          ].join(" ")}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {depth === 0 && (
              <CategoryIcon
                icon={category.icon}
                name={category.name}
                size={17}
                className="shrink-0 text-[#d6a419]"
              />
            )}
            <span className="truncate text-sm font-medium text-slate-700">
              {category.name}
            </span>
          </span>

          {hasChildren && (
            <ChevronRight
              size={16}
              aria-hidden="true"
              className={[
                "shrink-0 text-slate-400 transition-transform duration-150",
                expanded ? "rotate-90" : "",
              ].join(" ")}
            />
          )}
        </button>

        {hasChildren && expanded && (
          <div className="w-full">
            {category.children.map((child) =>
              renderMobileCategory(child, depth + 1),
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-[180px] items-center justify-center gap-3 p-6 text-sm text-slate-500">
        <Loader2 size={20} className="animate-spin text-[#D6A419]" />
        {t("loadingCategories")}
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertCircle size={28} className="text-red-500" />

        <p className="text-sm text-slate-600">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#12233F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c355c]"
        >
          {t("reloadPage")}
        </button>
      </div>
    );
  }

  // ====================================================
  // EMPTY
  // ====================================================

  if (categories.length === 0) {
    return (
      <div className="flex min-h-[150px] flex-col items-center justify-center gap-2 p-6 text-center">
        <Folder size={28} className="text-slate-400" />

        <p className="text-sm font-medium text-slate-700">
          {t("categoriesUnavailable")}
        </p>

        <p className="text-xs text-slate-500">
          {t("categoryApiHelp")}
        </p>
      </div>
    );
  }

  // ====================================================
  // MOBILE MENU
  // ====================================================

  if (isMobile) {
    return (
      <div className="flex min-h-full flex-col overflow-x-hidden bg-white">
        <div className="min-w-0 flex-1 px-3 pb-5">
          {categories.map((category) => renderMobileCategory(category))}
        </div>
      </div>
    );
  }

  // ====================================================
  // DESKTOP MEGA MENU
  // ====================================================

  return (
    <div
      className="relative w-fit min-w-0 max-w-[90vw] overflow-hidden bg-white"
      onMouseEnter={cancelCloseTimer}
      onMouseLeave={scheduleClose}
    >
      <div className="flex max-h-[520px] min-h-[320px] w-fit min-w-0 max-w-[90vw] overflow-hidden">
        <div className="flex w-fit min-w-0 overflow-x-hidden">
          {Array.from({ length: activePath.length + 1 }, (_, depth) => {
            const columnCategories = getColumnCategories(depth);

            if (columnCategories.length === 0) {
              return null;
            }

            return (
              <div
                key={`category-column-${depth}`}
                className={[
                  "w-[240px] min-w-0 shrink-0 overflow-y-auto p-2",
                  depth > 0 ? "border-l border-slate-100" : "bg-white",
                ].join(" ")}
              >
                <div className="space-y-1">
                  {columnCategories.map((category) =>
                    renderDesktopCategoryItem(category, depth),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
        <Link
          href="/categories"
          onClick={onClose}
          className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#12233F] transition hover:text-[#D6A419]"
        >
          <span className="truncate">{t("browseAllCategories")}</span>
          <ArrowRight size={15} className="shrink-0" />
        </Link>

        <span className="shrink-0 text-xs text-slate-400">
          {categories.length} {t("mainCategories")}
        </span>
      </div>
    </div>
  );
}
