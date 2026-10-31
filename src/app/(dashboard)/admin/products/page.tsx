"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Package,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Store,
  Boxes,
  X,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import { CategoryDeleteWarningModal } from "@/components/modals/Warning/CategoryWarningModal";
import { createClient } from "../../../../../lib/supabase-client";
import CategoryModal from "@/app/(dashboard)/admin/products/add-product/components/CategoryModal";

import ProductDetailsSidebar from "@/app/(dashboard)/vendor/products/components/ProductDetailsSidebar";
import type {
  ProductDetails,
  ProductCoupon,
} from "@/app/(dashboard)/vendor/products/components/ProductDetailsSidebar";

const supabase = createClient();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/* =========================================================
   TYPES
========================================================= */

type ProductStatus = "ACTIVE" | "PENDING" | "OUT_OF_STOCK";

type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  seller: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image?: string;
  images?: string[] | null;
  description?: string | null;
  shortDescription?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  coupon?: ProductCoupon | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  fieldsConfig: unknown;
  parentId: string | null;
};

type DeleteTarget =
  | { type: "single"; id: string; name: string }
  | { type: "bulk"; ids: string[] }
  | null;

/* =========================================================
   PRODUCT STATUS BADGE
========================================================= */

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-600">
        <CheckCircle2 size={14} />
        Active
      </span>
    );
  }

  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-600">
        <Clock3 size={14} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-red-600">
      <AlertTriangle size={14} />
      Out of Stock
    </span>
  );
}

/* =========================================================
   PRODUCT IMAGE
========================================================= */

function ProductImage({ name, image }: { name: string; image?: string }) {
  return (
    <div
      title={name}
      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400"
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <Package size={21} />
      )}
    </div>
  );
}

/* =========================================================
   CATEGORY MENU ITEM
========================================================= */

type CategoryMenuItemProps = {
  category: Category;
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  setIsCategoryMenuOpen: (value: boolean) => void;
  openCategoryPath: string[];
  setOpenCategoryPath: (path: string[]) => void;
  parentPath: string[];
  onDeleteCategory: (category: Category) => void;
};

function CategoryMenuItem({
  category,
  categories,
  categoryFilter,
  setCategoryFilter,
  setIsCategoryMenuOpen,
  openCategoryPath,
  setOpenCategoryPath,
  parentPath,
  onDeleteCategory,
}: CategoryMenuItemProps) {
  const children = categories.filter((item) => item.parentId === category.id);

  const hasChildren = children.length > 0;
  const currentPath = [...parentPath, category.id];
  const isOpen = openCategoryPath.includes(category.id);
  const isSelected = categoryFilter === category.name;

  function handleCategoryClick() {
    if (hasChildren) {
      setOpenCategoryPath(isOpen ? parentPath : currentPath);
      return;
    }

    setCategoryFilter(category.name);
    setOpenCategoryPath([]);
    setIsCategoryMenuOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex w-full items-center gap-1 rounded-lg">
        <button
          type="button"
          onClick={handleCategoryClick}
          className={`flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[12px] transition ${
            isSelected
              ? "bg-slate-100 font-semibold text-[#12233F]"
              : "text-slate-600 hover:bg-slate-50 hover:text-[#12233F]"
          }`}
        >
          <span className="truncate">{category.name}</span>

          {hasChildren && (
            <ChevronRight
              size={14}
              className={`shrink-0 text-slate-400 transition-transform duration-150 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          )}
        </button>

        <button
          type="button"
          title={`Delete ${category.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onDeleteCategory(category);
          }}
          className="shrink-0 rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {hasChildren && isOpen && (
        <div className="ml-3 border-l border-slate-100 pl-1">
          {children.map((child) => (
            <CategoryMenuItem
              key={child.id}
              category={child}
              categories={categories}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              setIsCategoryMenuOpen={setIsCategoryMenuOpen}
              openCategoryPath={openCategoryPath}
              setOpenCategoryPath={setOpenCategoryPath}
              parentPath={currentPath}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Product delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [statusFilter, setStatusFilter] = useState<"ALL" | ProductStatus>(
    "ALL",
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null,
  );

  function openProductSidebar(product: Product) {
    setSelectedProduct({
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.stock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
      image: product.image,
      images: product.images,
      description: product.description,
      shortDescription: product.shortDescription,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      coupon: product.coupon ?? null,
    });
  }

  function closeProductSidebar() {
    setSelectedProduct(null);
  }

  const handleCouponChange = useCallback(
    (productId: string, coupon: ProductCoupon | null) => {
      setProducts((previous) =>
        previous.map((item) =>
          item.id === productId ? { ...item, coupon } : item,
        ),
      );
      setSelectedProduct((previous) =>
        previous?.id === productId ? { ...previous, coupon } : previous,
      );
    },
    [],
  );

  /* =======================================================
     CATEGORY STATES
  ======================================================= */

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const [openCategoryPath, setOpenCategoryPath] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [categoryError, setCategoryError] = useState("");

  /* =======================================================
     ACCESS TOKEN
  ======================================================= */

  async function getAccessToken() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session?.access_token) {
      throw new Error("লগইন session পাওয়া যায়নি। আবার login করুন।");
    }

    return session.access_token;
  }

  /* =======================================================
     FETCH CATEGORIES
  ======================================================= */

  async function fetchCategories() {
    try {
      const token = await getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || `Category API failed: ${response.status}`,
        );
      }

      if (result?.success && Array.isArray(result?.data)) {
        setCategories(result.data);
      } else {
        throw new Error("Category data পাওয়া যায়নি।");
      }
    } catch (error: unknown) {
      setCategoryError(
        error instanceof Error ? error.message : "Category load করা যায়নি।",
      );
    }
  }

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  async function fetchProducts() {
    try {
      setProductsLoading(true);
      setProductsError("");

      const token = await getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/products/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result?.success || !Array.isArray(result?.data)) {
        throw new Error(
          result?.error || `Product API failed: ${response.status}`,
        );
      }

      const mappedProducts: Product[] = result.data.map((item: any) => {
        const stock = Number(item.stockQuantity ?? 0);
        const pricing = item.pricing ?? {};

        const images: string[] = Array.isArray(item.images)
          ? item.images
              .map((image: any) =>
                typeof image === "string" ? image : image?.url,
              )
              .filter(
                (image: unknown): image is string =>
                  typeof image === "string" && image.trim().length > 0,
              )
          : [];

        return {
          id: String(item.id),
          slug: item.slug ?? "",
          name: item.title ?? "Untitled product",
          sku: item.sku ?? "—",
          category: item.category?.name ?? "Uncategorized",
          seller:
            item.vendor?.storeName ??
            item.vendor?.user?.fullName ??
            "Unknown Seller",
          price: Number(
            pricing.customerSalePrice ?? pricing.customerRegularPrice ?? 0,
          ),
          stock,
          status:
            item.status === "PENDING"
              ? "PENDING"
              : stock <= 0
                ? "OUT_OF_STOCK"
                : "ACTIVE",
          image: images[0],
          images,
          description: item.description ?? null,
          shortDescription: item.shortDescription ?? null,
          createdAt: item.createdAt ?? null,
          updatedAt: item.updatedAt ?? null,
          coupon: item.coupon ?? null,
        };
      });

      setProducts(mappedProducts);

      const currentIds = new Set(mappedProducts.map((product) => product.id));

      setSelectedIds((previous) => previous.filter((id) => currentIds.has(id)));

      setSelectedProduct((previous) => {
        if (!previous) return null;

        const updated = mappedProducts.find(
          (product) => product.id === previous.id,
        );

        if (!updated) return null;

        return {
          id: updated.id,
          slug: updated.slug,
          name: updated.name,
          sku: updated.sku,
          category: updated.category,
          price: updated.price,
          stock: updated.stock,
          status: updated.stock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
          image: updated.image,
          images: updated.images,
          description: updated.description,
          shortDescription: updated.shortDescription,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };
      });
    } catch (error: unknown) {
      setProductsError(
        error instanceof Error ? error.message : "Products load করা যায়নি।",
      );
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    void fetchCategories();
    void fetchProducts();
  }, []);

  /* =======================================================
     CATEGORY DATA
  ======================================================= */

  const totalCategories = categories.length;

  const rootCategories = categories.filter(
    (category) => category.parentId === null,
  );

  function handleCategoryMenuToggle() {
    const willOpen = !isCategoryMenuOpen;

    setOpenCategoryPath([]);
    setIsCategoryMenuOpen(willOpen);
  }

  function handleDeleteCategory(category: Category) {
    setSelectedCategory(category);
    setCategoryError("");
    setIsDeleteCategoryModalOpen(true);
  }

  function getAllDescendantIds(categoryId: string): string[] {
    const directChildren = categories.filter(
      (category) => category.parentId === categoryId,
    );

    const childIds = directChildren.map((child) => child.id);

    const descendantIds = directChildren.flatMap((child) =>
      getAllDescendantIds(child.id),
    );

    return [...childIds, ...descendantIds];
  }

  async function confirmDeleteCategory() {
    if (!selectedCategory) return;

    try {
      setCategoryError("");

      const categoryId = selectedCategory.id;
      const token = await getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/categories/${encodeURIComponent(categoryId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(result?.error || "Category delete করা যায়নি।");
      }

      const descendantIds = getAllDescendantIds(categoryId);
      const idsToRemove = new Set([categoryId, ...descendantIds]);

      setCategories((previous) =>
        previous.filter((category) => !idsToRemove.has(category.id)),
      );

      if (categoryFilter === selectedCategory.name) {
        setCategoryFilter("ALL");
      }

      setOpenCategoryPath([]);
      setIsCategoryMenuOpen(false);
      setIsDeleteCategoryModalOpen(false);
      setSelectedCategory(null);

      void fetchCategories();
    } catch (error: unknown) {
      setCategoryError(
        error instanceof Error
          ? error.message
          : "Category delete করা যায়নি। আবার চেষ্টা করুন।",
      );
    }
  }

  const selectedCategoryChildCount = selectedCategory
    ? getAllDescendantIds(selectedCategory.id).length
    : 0;

  /* =======================================================
     PRODUCT STATS
  ======================================================= */

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "ACTIVE",
  ).length;

  const pendingProducts = products.filter(
    (product) => product.status === "PENDING",
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.status === "OUT_OF_STOCK",
  ).length;

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const searchMatch =
        product.name.toLowerCase().includes(searchText) ||
        product.sku.toLowerCase().includes(searchText) ||
        product.seller.toLowerCase().includes(searchText);

      const categoryMatch =
        categoryFilter === "ALL" || product.category === categoryFilter;

      const statusMatch =
        statusFilter === "ALL" || product.status === statusFilter;

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [products, search, categoryFilter, statusFilter]);

  /* =======================================================
     SELECT PRODUCTS
  ======================================================= */

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedIds.includes(product.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) => !filteredProducts.some((product) => product.id === id),
        ),
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...filteredProducts.map((product) => product.id),
        ]),
      ]);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  /* =======================================================
     OPEN PRODUCT DELETE MODAL
  ======================================================= */

  function requestDeleteProduct(product: Product) {
    if (deletingIds.includes(product.id) || isBulkDeleting) return;

    setDeleteError("");
    setDeleteSuccess("");
    setDeleteTarget({
      type: "single",
      id: product.id,
      name: product.name,
    });
  }

  function requestBulkDelete() {
    if (selectedIds.length === 0 || isBulkDeleting) return;

    const ids = [...selectedIds];
    setDeleteError("");
    setDeleteSuccess("");
    setDeleteTarget({ type: "bulk", ids });
  }

  function closeDeleteModal() {
    if (isDeleteSubmitting) return;

    setDeleteTarget(null);
    setDeleteError("");
  }

  /* =======================================================
     CONFIRM PRODUCT DELETE
  ======================================================= */

  async function confirmDeleteProducts() {
    if (!deleteTarget || isDeleteSubmitting) return;

    const idsToDelete =
      deleteTarget.type === "single" ? [deleteTarget.id] : deleteTarget.ids;

    if (idsToDelete.length === 0) return;

    setIsDeleteSubmitting(true);
    setDeleteError("");
    setDeleteSuccess("");

    setDeletingIds((previous) => [...new Set([...previous, ...idsToDelete])]);

    if (deleteTarget.type === "bulk") {
      setIsBulkDeleting(true);
    }

    const successfulIds: string[] = [];
    const failedProducts: { id: string; message: string }[] = [];

    try {
      const token = await getAccessToken();

      for (const id of idsToDelete) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/products/${encodeURIComponent(id)}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const result = await response.json().catch(() => null);

          if (!response.ok || result?.success === false) {
            throw new Error(
              result?.error ||
                result?.message ||
                `Product delete failed: ${response.status}`,
            );
          }

          successfulIds.push(id);
        } catch (error: unknown) {
          failedProducts.push({
            id,
            message:
              error instanceof Error
                ? error.message
                : "Product delete করা যায়নি।",
          });
        }
      }

      if (successfulIds.length > 0) {
        const deletedSet = new Set(successfulIds);

        setProducts((previous) =>
          previous.filter((product) => !deletedSet.has(product.id)),
        );

        setSelectedIds((previous) =>
          previous.filter((id) => !deletedSet.has(id)),
        );

        setSelectedProduct((previous) =>
          previous && deletedSet.has(previous.id) ? null : previous,
        );
      }

      if (failedProducts.length > 0) {
        setDeleteError(
          successfulIds.length > 0
            ? `${successfulIds.length}টি Product Delete হয়েছে, কিন্তু ${failedProducts.length}টি Delete করা যায়নি। আবার চেষ্টা করো।`
            : failedProducts[0].message,
        );

        setSelectedIds((previous) => [
          ...new Set([
            ...previous,
            ...failedProducts.map((product) => product.id),
          ]),
        ]);

        // Failed items remain in the list; keep the modal open.
        setDeleteTarget(
          deleteTarget.type === "bulk"
            ? {
                type: "bulk",
                ids: failedProducts.map((product) => product.id),
              }
            : deleteTarget,
        );
      } else {
        const successMessage =
          deleteTarget.type === "single"
            ? "Product সফলভাবে Delete করা হয়েছে।"
            : `${successfulIds.length}টি Product সফলভাবে Delete করা হয়েছে।`;

        setDeleteTarget(null);
        setDeleteSuccess(successMessage);
      }
    } catch (error: unknown) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Product Delete করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setDeletingIds((previous) =>
        previous.filter((id) => !idsToDelete.includes(id)),
      );

      setIsBulkDeleting(false);
      setIsDeleteSubmitting(false);

      void fetchProducts();
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#12233F]">Products</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Manage all products available on the platform
          </p>
        </div>

        <div className="flex w-full shrink-0 items-center gap-2 sm:w-fit">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#12233F] px-3 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#1b3154] sm:flex-none sm:gap-2 sm:px-4 sm:text-[12px]"
          >
            <Plus size={16} className="shrink-0" />
            <span className="whitespace-nowrap">Add Category</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products/add-product")}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#12233F] px-3 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#1b3154] sm:flex-none sm:gap-2 sm:px-4 sm:text-[12px]"
          >
            <Plus size={16} className="shrink-0" />
            <span className="whitespace-nowrap">Add Product</span>
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}

      {deleteSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1 text-sm font-medium">{deleteSuccess}</div>
          <button
            type="button"
            onClick={() => setDeleteSuccess("")}
            aria-label="Dismiss success message"
            className="rounded-md p-1 hover:bg-emerald-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* CATEGORY ERROR MESSAGE */}

      {categoryError && !isDeleteCategoryModalOpen && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p className="flex-1 text-sm">{categoryError}</p>
          <button
            type="button"
            onClick={() => setCategoryError("")}
            aria-label="Dismiss error message"
            className="rounded-md p-1 hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* PRODUCT STAT CARDS */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="Total Products"
          value={totalProducts}
          icon={Boxes}
          variant="blue"
          description="All platform products"
        />
        <AdminStatCard
          label="Active Products"
          value={activeProducts}
          icon={CheckCircle2}
          variant="green"
          description="Currently available"
        />
        <AdminStatCard
          label="Pending Products"
          value={pendingProducts}
          icon={Clock3}
          variant="orange"
          description="Waiting for approval"
        />
        <AdminStatCard
          label="Out of Stock"
          value={outOfStockProducts}
          icon={AlertTriangle}
          variant="yellow"
          description="Stock needs attention"
        />
      </div>

      {/* CATEGORY STAT */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <AdminStatCard
          label="All Categories"
          value={totalCategories}
          icon={Boxes}
          variant="blue"
          description="All platform categories"
        />
      </div>

      {/* PRODUCT TABLE */}

      <div className="overflow-x-clip rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#12233F]">
                All Products
              </h2>
              <p className="mt-1 text-[11.5px] text-slate-400">
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* SEARCH */}

              <div className="relative w-full sm:w-auto">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[12px] outline-none transition focus:border-[#D6A419] focus:bg-white sm:w-64"
                />
              </div>

              {/* CATEGORY FILTER */}

              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCategoryMenuToggle}
                  className="flex w-full min-w-[180px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-600 outline-none transition hover:bg-white focus:border-[#D6A419] sm:w-auto"
                >
                  <span className="max-w-[140px] truncate">
                    {categoryFilter === "ALL"
                      ? "All Categories"
                      : categoryFilter}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-transform ${
                      isCategoryMenuOpen ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute right-0 top-full z-[60] mt-2 max-h-[calc(100dvh-2rem)] w-60 max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter("ALL");
                        setOpenCategoryPath([]);
                        setIsCategoryMenuOpen(false);
                      }}
                      className={`mb-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-[12px] transition ${
                        categoryFilter === "ALL"
                          ? "bg-slate-100 font-semibold text-[#12233F]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#12233F]"
                      }`}
                    >
                      All Categories
                    </button>

                    {rootCategories.length === 0 ? (
                      <div className="px-3 py-3 text-center text-[11px] text-slate-400">
                        No categories found
                      </div>
                    ) : (
                      rootCategories.map((category) => (
                        <CategoryMenuItem
                          key={category.id}
                          category={category}
                          categories={categories}
                          categoryFilter={categoryFilter}
                          setCategoryFilter={setCategoryFilter}
                          setIsCategoryMenuOpen={setIsCategoryMenuOpen}
                          openCategoryPath={openCategoryPath}
                          setOpenCategoryPath={setOpenCategoryPath}
                          parentPath={[]}
                          onDeleteCategory={handleDeleteCategory}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* STATUS FILTER */}

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "ALL" | ProductStatus)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-600 outline-none focus:border-[#D6A419] sm:w-auto"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* BULK DELETE BAR */}

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 px-5 py-3">
            <p className="text-[12px] font-semibold text-rose-700">
              {selectedIds.length} product
              {selectedIds.length > 1 ? "s" : ""} selected
            </p>

            <button
              type="button"
              onClick={requestBulkDelete}
              disabled={isBulkDeleting || isDeleteSubmitting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-[11.5px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-12 px-5 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    disabled={
                      productsLoading ||
                      isBulkDeleting ||
                      isDeleteSubmitting ||
                      filteredProducts.length === 0
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-[#D6A419]"
                  />
                </th>

                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Product
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Category
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Seller
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Price
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Stock
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {productsLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-[13px] text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : productsError ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-[13px] text-red-500"
                  >
                    <p>{productsError}</p>
                    <button
                      type="button"
                      onClick={() => void fetchProducts()}
                      className="mt-3 rounded-lg border border-red-200 px-3 py-2 text-[12px] font-semibold hover:bg-red-50"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-[13px] text-slate-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => openProductSidebar(product)}
                    className="cursor-pointer transition hover:bg-slate-50/70"
                  >
                    <td
                      className="px-5 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        disabled={
                          isBulkDeleting ||
                          isDeleteSubmitting ||
                          deletingIds.includes(product.id)
                        }
                        onChange={() => toggleSelect(product.id)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#D6A419]"
                      />
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          name={product.name}
                          image={product.image}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-semibold text-[#12233F]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-slate-400">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-medium text-slate-600">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Store size={14} />
                        </div>
                        <span className="text-[11.5px] font-medium text-slate-600">
                          {product.seller}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <span className="text-[12.5px] font-bold text-[#12233F]">
                        ৳{product.price.toLocaleString("en-BD")}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`text-[12px] font-semibold ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock < 10
                              ? "text-amber-600"
                              : "text-slate-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <ProductStatusBadge status={product.status} />
                    </td>

                    <td
                      className="px-5 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="View Product Details"
                          aria-label={`View details for ${product.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            openProductSidebar(product);
                          }}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#12233F]"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          disabled={
                            isBulkDeleting ||
                            isDeleteSubmitting ||
                            deletingIds.includes(product.id)
                          }
                          onClick={() => requestDeleteProduct(product)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingIds.includes(product.id) ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-[11.5px] text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {products.length}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-200 p-2 text-slate-400 disabled:opacity-50"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#12233F] px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-200 p-2 text-slate-400 disabled:opacity-50"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT DELETE CONFIRMATION MODAL */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-4 border-b border-slate-100 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <ShieldAlert size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="delete-product-title"
                  className="text-lg font-bold text-[#12233F]"
                >
                  Delete Confirmation
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  তুমি কি সত্যিই{" "}
                  {deleteTarget.type === "single"
                    ? "এই Product"
                    : `নির্বাচিত ${deleteTarget.ids.length}টি Product`}{" "}
                  Delete করতে চাও?
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleteSubmitting}
                aria-label="Close delete confirmation"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {deleteTarget.type === "single" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Product to delete
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#12233F]">
                    {deleteTarget.name}
                  </p>
                </div>
              )}

              {deleteTarget.type === "bulk" && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-700">
                    {deleteTarget.ids.length}টি Product Delete হবে।
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-600">
                    যেসব Product সফলভাবে Delete হবে, সেগুলো তালিকা থেকে সরিয়ে
                    দেওয়া হবে।
                  </p>
                </div>
              )}

              <p className="text-xs leading-5 text-slate-500">
                এই কাজটি ফিরিয়ে আনা নাও যেতে পারে। নিশ্চিত না হলে Cancel করো।
              </p>

              {deleteError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-5">{deleteError}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleteSubmitting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void confirmDeleteProducts()}
                disabled={isDeleteSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleteSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}

      <CategoryModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreated={() => {
          void fetchCategories();
        }}
      />

      {/* CATEGORY DELETE WARNING MODAL */}

      <CategoryDeleteWarningModal
        isOpen={isDeleteCategoryModalOpen}
        categoryName={selectedCategory?.name ?? ""}
        childCount={selectedCategoryChildCount}
        onClose={() => {
          setIsDeleteCategoryModalOpen(false);
          setSelectedCategory(null);
          setCategoryError("");
        }}
        onConfirm={confirmDeleteCategory}
      />

      {/* PRODUCT DETAILS SIDEBAR */}

      <ProductDetailsSidebar
        product={selectedProduct}
        onClose={closeProductSidebar}
        onCouponChange={handleCouponChange}
        onEdit={(product) => {
          const target = product.slug?.trim() || product.id;
          if (!target) {
            setProductsError("এই Product-এর ID বা slug পাওয়া যায়নি।");
            return;
          }

          router.push(`/admin/products/edit/${encodeURIComponent(target)}`);
        }}
      />
    </div>
  );
}
