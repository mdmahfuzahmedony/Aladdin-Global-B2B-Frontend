"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  ClipboardList,
  Image as ImageIcon,
} from "lucide-react";

import { createClient } from "../../../../../../../lib/supabase-client";

type CategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  fieldsConfig: unknown;
  parentId: string | null;
  image?: string | null;
  icon?: string | null;
};

type PathItem = {
  id: string;
  name: string;
};

type Mode = "manual" | "subcategory" | "paste";

type PasteNode = {
  name: string;
  children: PasteNode[];
};

const supabase = createClient();

export default function CategoryModal({
  open,
  onClose,
  onCreated,
}: CategoryModalProps) {
  /* =========================================================
     STATE
  ========================================================= */

  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedMainCategory, setSelectedMainCategory] =
    useState<Category | null>(null);

  const [currentParent, setCurrentParent] = useState<Category | null>(null);

  const [categoryPath, setCategoryPath] = useState<PathItem[]>([]);

  const [mainCategoryName, setMainCategoryName] = useState("");

  const [mainCategoryImage, setMainCategoryImage] = useState<File | null>(null);

  const [mainCategoryImagePreview, setMainCategoryImagePreview] = useState<
    string | null
  >(null);

  const [subcategoryName, setSubcategoryName] = useState("");

  const [pasteText, setPasteText] = useState("");

  const [mode, setMode] = useState<Mode>("manual");

  const [loading, setLoading] = useState(false);

  const [fetchingCategories, setFetchingCategories] = useState(false);

  const [error, setError] = useState("");

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  /* =========================================================
     ROOT CATEGORIES
  ========================================================= */

  const mainCategories = useMemo(() => {
    return categories.filter((category) => category.parentId === null);
  }, [categories]);

  /* =========================================================
     CURRENT PARENT CHILDREN
  ========================================================= */

  const currentChildren = useMemo(() => {
    if (!currentParent) {
      return [];
    }

    return categories.filter(
      (category) => category.parentId === currentParent.id,
    );
  }, [categories, currentParent]);

  /* =========================================================
     FETCH CATEGORIES
  ========================================================= */

  async function fetchCategories() {
    try {
      setFetchingCategories(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Categories fetch করা যায়নি।");
      }

      const categoryData = Array.isArray(result?.data) ? result.data : [];

      setCategories(categoryData);

      return categoryData as Category[];
    } catch (err: any) {
      console.error("Category fetch error:", err);

      setError(err?.message || "Categories fetch করা যায়নি।");

      return [];
    } finally {
      setFetchingCategories(false);
    }
  }

  /* =========================================================
     IMAGE SELECT
  ========================================================= */

  function handleMainCategoryImageChange(file: File | null) {
    setError("");

    if (!file) {
      setMainCategoryImage(null);
      setMainCategoryImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("শুধু image file নির্বাচন করুন।");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size সর্বোচ্চ 5MB হতে পারবে।");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      return;
    }

    setMainCategoryImage(file);

    const previewUrl = URL.createObjectURL(file);

    setMainCategoryImagePreview(previewUrl);
  }

  /* =========================================================
     UPLOAD CATEGORY IMAGE
  ========================================================= */

  async function uploadMainCategoryImage(file: File, accessToken: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${apiUrl}/api/uploads/category-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || "Category image upload করা যায়নি।");
    }

    const imageUrl = result?.data?.url;

    if (!imageUrl) {
      throw new Error("Image upload হয়েছে কিন্তু URL পাওয়া যায়নি।");
    }

    return imageUrl as string;
  }

  /* =========================================================
     RESET MODAL
  ========================================================= */

  function resetModal() {
    if (mainCategoryImagePreview) {
      URL.revokeObjectURL(mainCategoryImagePreview);
    }

    setSelectedMainCategory(null);
    setCurrentParent(null);
    setCategoryPath([]);

    setMainCategoryName("");

    setMainCategoryImage(null);
    setMainCategoryImagePreview(null);

    setSubcategoryName("");
    setPasteText("");

    setMode("manual");
    setError("");
    setLoading(false);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  /* =========================================================
     OPEN MODAL
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    resetModal();
    fetchCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* =========================================================
     CLOSE
  ========================================================= */

  function handleClose() {
    if (loading) {
      return;
    }

    resetModal();
    onClose();
  }

  /* =========================================================
     SELECT MAIN CATEGORY
  ========================================================= */

  function handleSelectMainCategory(category: Category) {
    setSelectedMainCategory(category);
    setCurrentParent(category);

    setCategoryPath([
      {
        id: category.id,
        name: category.name,
      },
    ]);

    setSubcategoryName("");
    setError("");
    setMode("subcategory");
  }

  /* =========================================================
     CREATE MAIN CATEGORY
  ========================================================= */

  async function handleCreateMainCategory() {
    const name = mainCategoryName.trim();

    if (!name) {
      setError("Main category name দিতে হবে।");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      let imageUrl: string | null = null;

      /* =====================================================
         STEP 1
         IMAGE UPLOAD
      ===================================================== */

      if (mainCategoryImage) {
        imageUrl = await uploadMainCategoryImage(
          mainCategoryImage,
          session.access_token,
        );
      }

      /* =====================================================
         STEP 2
         CATEGORY CREATE
      ===================================================== */

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          name,
          parentId: null,
          image: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Main category create করা যায়নি।");
      }

      const createdCategory = result?.data as Category | undefined;

      if (!createdCategory?.id) {
        throw new Error("Category তৈরি হয়েছে কিন্তু ID পাওয়া যায়নি।");
      }

      setMainCategoryName("");

      setMainCategoryImage(null);

      if (mainCategoryImagePreview) {
        URL.revokeObjectURL(mainCategoryImagePreview);
      }

      setMainCategoryImagePreview(null);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      /* =====================================================
         REFRESH CATEGORIES
      ===================================================== */

      const updatedCategories = await fetchCategories();

      const freshCategory =
        updatedCategories.find(
          (category) => category.id === createdCategory.id,
        ) || createdCategory;

      setSelectedMainCategory(freshCategory);

      setCurrentParent(freshCategory);

      setCategoryPath([
        {
          id: freshCategory.id,
          name: freshCategory.name,
        },
      ]);

      setMode("subcategory");

      onCreated?.();
    } catch (err: any) {
      console.error("Main category create error:", err);

      setError(err?.message || "Main category create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     CREATE SUBCATEGORY
  ========================================================= */

  async function handleAddSubcategory() {
    const name = subcategoryName.trim();

    if (!name) {
      setError("Subcategory name দিতে হবে।");
      return;
    }

    if (!currentParent) {
      setError("আগে একটি parent category select করুন।");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          name,
          parentId: currentParent.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Subcategory create করা যায়নি।");
      }

      const createdCategory = result?.data as Category | undefined;

      if (!createdCategory?.id) {
        throw new Error("Category তৈরি হয়েছে কিন্তু ID পাওয়া যায়নি।");
      }

      /*
       * নতুন তৈরি category-কে
       * automatically next parent বানানো হচ্ছে।
       */

      setCurrentParent(createdCategory);

      setCategoryPath((current) => [
        ...current,
        {
          id: createdCategory.id,
          name: createdCategory.name,
        },
      ]);

      setSubcategoryName("");

      await fetchCategories();

      onCreated?.();

      setMode("subcategory");
    } catch (err: any) {
      console.error("Subcategory create error:", err);

      setError(err?.message || "Subcategory create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     BREADCRUMB CLICK
  ========================================================= */

  function handlePathClick(index: number) {
    if (loading) {
      return;
    }

    const clickedPathItem = categoryPath[index];

    const category = categories.find((item) => item.id === clickedPathItem.id);

    if (!category) {
      return;
    }

    setCurrentParent(category);

    setCategoryPath(categoryPath.slice(0, index + 1));

    setSubcategoryName("");
    setError("");
    setMode("subcategory");
  }

  /* =========================================================
     EXISTING CHILD CLICK
  ========================================================= */

  function handleChildClick(child: Category) {
    if (loading) {
      return;
    }

    setCurrentParent(child);

    setCategoryPath((current) => {
      const alreadyExists = current.some((item) => item.id === child.id);

      if (alreadyExists) {
        const index = current.findIndex((item) => item.id === child.id);

        return current.slice(0, index + 1);
      }

      return [
        ...current,
        {
          id: child.id,
          name: child.name,
        },
      ];
    });

    setSubcategoryName("");
    setError("");
    setMode("subcategory");
  }

  /* =========================================================
     BACK
  ========================================================= */

  function handleBack() {
    if (loading) {
      return;
    }

    if (categoryPath.length <= 1) {
      setSelectedMainCategory(null);

      setCurrentParent(null);

      setCategoryPath([]);

      setSubcategoryName("");

      setError("");

      setMode("manual");

      return;
    }

    const newPath = categoryPath.slice(0, categoryPath.length - 1);

    const previous = newPath[newPath.length - 1];

    const previousCategory = categories.find(
      (category) => category.id === previous.id,
    );

    if (!previousCategory) {
      return;
    }

    setCurrentParent(previousCategory);

    setCategoryPath(newPath);

    setSubcategoryName("");
    setError("");
    setMode("subcategory");
  }

  /* =========================================================
     PASTE PARSER
  ========================================================= */

  function parseIndentedText(text: string): PasteNode[] {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.replace(/\t/g, "    "))
      .map((line) => line.trimEnd())
      .filter((line) => line.trim() !== "");

    const roots: PasteNode[] = [];

    const stack: {
      level: number;
      node: PasteNode;
    }[] = [];

    for (const line of lines) {
      const leadingSpaces = line.match(/^ */)?.[0].length ?? 0;

      const level = Math.floor(leadingSpaces / 2);

      const name = line.trim();

      if (!name) {
        continue;
      }

      const node: PasteNode = {
        name,
        children: [],
      };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        roots.push(node);
      } else {
        stack[stack.length - 1].node.children.push(node);
      }

      stack.push({
        level,
        node,
      });
    }

    return roots;
  }

  /* =========================================================
     CREATE PASTE TREE
  ========================================================= */

  async function createPasteTree(
    nodes: PasteNode[],
    parentId: string | null,
    accessToken: string,
  ) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

    for (const node of nodes) {
      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          name: node.name,
          parentId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || `"${node.name}" create করা যায়নি।`);
      }

      const created = result?.data as Category | undefined;

      if (!created?.id) {
        throw new Error(
          `"${node.name}" create হয়েছে কিন্তু ID পাওয়া যায়নি।`,
        );
      }

      if (node.children.length > 0) {
        await createPasteTree(node.children, created.id, accessToken);
      }
    }
  }

  /* =========================================================
     PARSE PASTE
  ========================================================= */

  function handleParsePaste() {
    if (!pasteText.trim()) {
      setError("Category list paste করুন।");

      return;
    }

    try {
      const parsed = parseIndentedText(pasteText);

      if (parsed.length === 0) {
        setError("কোনো valid category পাওয়া যায়নি।");

        return;
      }

      setError("");

      return parsed;
    } catch (err) {
      console.error("Category parse error:", err);

      setError("Category list parse করা যায়নি।");

      return null;
    }
  }

  /* =========================================================
     PASTE SUBMIT
  ========================================================= */

  async function handlePasteSubmit() {
    const parsed = handleParsePaste();

    if (!parsed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      await createPasteTree(parsed, null, session.access_token);

      setPasteText("");

      await fetchCategories();

      onCreated?.();

      setMode("manual");
    } catch (err: any) {
      console.error("Paste category create error:", err);

      setError(err?.message || "Category list create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     MODAL
  ========================================================= */

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#12233F]">Add Category</h2>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Create unlimited nested categories
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {/* =================================================
              TOP MODE SWITCH
          ================================================= */}

          <div className="mb-5 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setMode(currentParent ? "subcategory" : "manual");

                setError("");
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                mode !== "paste"
                  ? "bg-white text-[#12233F] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Manual
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setMode("paste");
                setError("");
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                mode === "paste"
                  ? "bg-white text-[#12233F] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Paste List
            </button>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-xs font-medium text-rose-600">{error}</p>
            </div>
          )}

          {/* =================================================
              FETCHING
          ================================================= */}

          {fetchingCategories && categories.length === 0 && (
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Categories loading...</p>
            </div>
          )}

          {/* =================================================
              MANUAL MAIN CATEGORY SCREEN
          ================================================= */}

          {mode === "manual" && (
            <div>
              {/* =================================================
                  MAIN CATEGORY CREATE
              ================================================= */}

              <div className="mb-5">
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Main Category
                </label>

                <input
                  type="text"
                  value={mainCategoryName}
                  onChange={(e) => {
                    setMainCategoryName(e.target.value);

                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleCreateMainCategory();
                    }
                  }}
                  placeholder="Example: Fashion"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none transition focus:border-[#12233F] disabled:bg-slate-50"
                />

                {/* =================================================
                    MAIN CATEGORY IMAGE
                ================================================= */}

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Category Image
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <div className="flex items-center gap-3">
                    {/* IMAGE PREVIEW */}

                    {mainCategoryImagePreview ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={mainCategoryImagePreview}
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            if (mainCategoryImagePreview) {
                              URL.revokeObjectURL(mainCategoryImagePreview);
                            }

                            setMainCategoryImage(null);

                            setMainCategoryImagePreview(null);

                            if (imageInputRef.current) {
                              imageInputRef.current.value = "";
                            }
                          }}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-300">
                        <ImageIcon size={24} />
                      </div>
                    )}

                    {/* FILE BUTTON */}

                    <div className="min-w-0 flex-1">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={loading}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;

                          handleMainCategoryImageChange(file);
                        }}
                      />

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => imageInputRef.current?.click()}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#12233F] hover:text-[#12233F] disabled:opacity-40"
                      >
                        {mainCategoryImage ? "Change Image" : "Choose Image"}
                      </button>

                      <p className="mt-1.5 text-[10px] text-slate-400">
                        JPG, PNG, WEBP • Maximum 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CREATE BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={handleCreateMainCategory}
                  disabled={loading || !mainCategoryName.trim()}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#1b3153] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={14} />

                  {loading
                    ? mainCategoryImage
                      ? "Uploading & Saving..."
                      : "Saving..."
                    : "Create Main Category"}
                </button>
              </div>

              {/* =================================================
                  EXISTING MAIN CATEGORIES
              ================================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700">
                    Existing Main Categories
                  </p>

                  <span className="text-[10px] font-medium text-slate-400">
                    {mainCategories.length} found
                  </span>
                </div>

                {mainCategories.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
                    <p className="text-xs text-slate-400">
                      এখনো কোনো main category নেই।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mainCategories.map((category) => {
                      const childCount = categories.filter(
                        (item) => item.parentId === category.id,
                      ).length;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSelectMainCategory(category)}
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[#12233F] hover:bg-slate-50 disabled:opacity-50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {/* EXISTING IMAGE */}

                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                                <ImageIcon size={16} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800">
                                {category.name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {childCount}{" "}
                                {childCount === 1
                                  ? "subcategory"
                                  : "subcategories"}
                              </p>
                            </div>
                          </div>

                          <ChevronRight
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================
              SUBCATEGORY SCREEN
          ================================================= */}

          {mode === "subcategory" && currentParent && (
            <div>
              {/* BACK */}

              <button
                type="button"
                disabled={loading}
                onClick={handleBack}
                className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-[#12233F] disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Back
              </button>

              {/* =================================================
                    BREADCRUMB
                ================================================= */}

              <div className="mb-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Category Path
                </p>

                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  {categoryPath.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handlePathClick(index)}
                        className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                          index === categoryPath.length - 1
                            ? "bg-[#12233F] text-white"
                            : "text-slate-500 hover:bg-white hover:text-[#12233F]"
                        }`}
                      >
                        {item.name}
                      </button>

                      {index < categoryPath.length - 1 && (
                        <ChevronRight size={12} className="text-slate-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* =================================================
                    CURRENT PARENT
                ================================================= */}

              <div className="mb-5 rounded-xl border border-[#12233F]/10 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Parent Category
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-[#12233F]">
                    {currentParent.name}
                  </p>

                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                    Parent
                  </span>
                </div>
              </div>

              {/* =================================================
                    EXISTING CHILDREN
                ================================================= */}

              {currentChildren.length > 0 && (
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700">
                      Existing Subcategories
                    </p>

                    <span className="text-[10px] font-medium text-slate-400">
                      {currentChildren.length} found
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentChildren.map((child) => {
                      const childChildrenCount = categories.filter(
                        (item) => item.parentId === child.id,
                      ).length;

                      return (
                        <button
                          key={child.id}
                          type="button"
                          disabled={loading}
                          onClick={() => handleChildClick(child)}
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[#12233F] hover:bg-slate-50 disabled:opacity-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-800">
                              {child.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {childChildrenCount > 0
                                ? `${childChildrenCount} child ${
                                    childChildrenCount === 1
                                      ? "category"
                                      : "categories"
                                  }`
                                : "Click to use as parent"}
                            </p>
                          </div>

                          <ChevronRight
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =================================================
                    ADD SUBCATEGORY

                    এখানে কোনো image option নেই।
                ================================================= */}

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  New Subcategory
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => {
                      setSubcategoryName(e.target.value);

                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) {
                        handleAddSubcategory();
                      }
                    }}
                    placeholder={`Add under ${currentParent.name}`}
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none transition focus:border-[#12233F] disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    disabled={loading || !subcategoryName.trim()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#1b3153] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} />

                    {loading ? "Saving..." : "Add"}
                  </button>
                </div>
              </div>

              {/* =================================================
                    HELP
                ================================================= */}

              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-[11px] leading-5 text-amber-700">
                  নতুন category তৈরি হলে সেটি automatically next parent হবে।
                  Breadcrumb থেকে আগের যেকোনো level select করে সেখানে নতুন
                  subcategory তৈরি করতে পারবেন।
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              PASTE MODE
          ================================================= */}

          {mode === "paste" && (
            <div>
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <ClipboardList size={15} className="text-[#12233F]" />

                  <p className="text-xs font-bold text-slate-700">
                    Paste Category Tree
                  </p>
                </div>

                <p className="text-[11px] leading-5 text-slate-400">
                  প্রতি level-এর জন্য 2 spaces ব্যবহার করুন।
                </p>
              </div>

              <textarea
                value={pasteText}
                onChange={(e) => {
                  setPasteText(e.target.value);

                  setError("");
                }}
                disabled={loading}
                rows={12}
                placeholder={`Fashion
  Men
    Clothing
      Shirt
        Formal Shirt
        Casual Shirt
    Shoes
  Women
    Clothing
      Saree`}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs leading-6 outline-none transition focus:border-[#12233F] disabled:bg-slate-50"
              />

              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={loading || !pasteText.trim()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#1b3153] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={14} />

                {loading ? "Creating..." : "Create Category Tree"}
              </button>
            </div>
          )}
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="flex shrink-0 items-center justify-end border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
