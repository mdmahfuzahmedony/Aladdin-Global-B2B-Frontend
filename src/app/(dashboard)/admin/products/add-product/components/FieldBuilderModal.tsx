"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

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

export default function CategoryModal({
  open,
  onClose,
  onCreated,
}: CategoryModalProps) {
  const supabase = createClient();

  /* =======================================================
     STATES
  ======================================================= */

  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedMainCategory, setSelectedMainCategory] =
    useState<Category | null>(null);

  const [currentParent, setCurrentParent] = useState<Category | null>(null);

  const [categoryPath, setCategoryPath] = useState<PathItem[]>([]);

  const [subcategoryName, setSubcategoryName] = useState("");

  const [mainCategoryName, setMainCategoryName] = useState("");

  const [pasteText, setPasteText] = useState("");

  const [mode, setMode] = useState<"manual" | "subcategory" | "paste">(
    "manual",
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     ROOT / MAIN CATEGORIES
  ======================================================= */

  const mainCategories = useMemo(() => {
    return categories.filter((category) => category.parentId === null);
  }, [categories]);

  /* =======================================================
     FETCH ALL CATEGORIES
  ======================================================= */

  async function fetchCategories() {
    try {
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

      setCategories(Array.isArray(result?.data) ? result.data : []);
    } catch (err: any) {
      console.error("Category fetch error:", err);

      setError(err?.message || "Categories fetch করা যায়নি।");
    }
  }

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  useEffect(() => {
    if (!open) return;

    setSelectedMainCategory(null);
    setCurrentParent(null);
    setCategoryPath([]);

    setSubcategoryName("");
    setMainCategoryName("");
    setPasteText("");

    setMode("manual");
    setError("");

    fetchCategories();
  }, [open]);

  /* =======================================================
     SELECT MAIN CATEGORY
  ======================================================= */

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

  /* =======================================================
     ADD SUBCATEGORY
  ======================================================= */

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

      /* =================================================
         IMPORTANT

         নতুন category এখন automatically
         next parent হবে।
      ================================================= */

      setCurrentParent(createdCategory);

      setCategoryPath((current) => [
        ...current,
        {
          id: createdCategory.id,
          name: createdCategory.name,
        },
      ]);

      setSubcategoryName("");

      /*
       * Database থেকে latest categories আনছি
       */
      await fetchCategories();

      /*
       * Parent page refresh
       */
      onCreated?.();

      /*
       * Modal subcategory screen-এই থাকবে
       */
      setMode("subcategory");
    } catch (err: any) {
      console.error("Subcategory create error:", err);

      setError(err?.message || "Subcategory create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     CHANGE PARENT FROM BREADCRUMB
     
     Example:
     Fashion → Men → Clothing → Shirt

     যদি Men click করে:
     Parent = Men
  ======================================================= */

  function handlePathClick(index: number) {
    const clickedPathItem = categoryPath[index];

    const category = categories.find((item) => item.id === clickedPathItem.id);

    if (!category) {
      /*
       * যদি fetchCategories-এর আগে নতুন category
       * click করা হয়, current path-এর data
       * ব্যবহার করব।
       */
      if (currentParent?.id === clickedPathItem.id) {
        setCategoryPath(categoryPath.slice(0, index + 1));

        setSubcategoryName("");
        setError("");

        return;
      }

      return;
    }

    /*
     * এখানেই parent change হচ্ছে
     */
    setCurrentParent(category);

    /*
     * Path-ও ওই level পর্যন্ত থাকবে
     */
    setCategoryPath(categoryPath.slice(0, index + 1));

    setSubcategoryName("");
    setError("");

    setMode("subcategory");
  }

  /* =======================================================
     BACK ONE LEVEL
  ======================================================= */

  function handleBack() {
    /*
     * যদি শুধু main category থাকে,
     * তাহলে main category selection screen-এ যাবে।
     */
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

  /* =======================================================
     CREATE MAIN CATEGORY
  ======================================================= */

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
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Main category create করা যায়নি।");
      }

      const createdCategory = result?.data as Category | undefined;

      if (!createdCategory?.id) {
        throw new Error("Main category ID পাওয়া যায়নি।");
      }

      setMainCategoryName("");

      /*
       * Fresh data
       */
      await fetchCategories();

      /*
       * Main category automatically select
       */
      setSelectedMainCategory(createdCategory);

      setCurrentParent(createdCategory);

      setCategoryPath([
        {
          id: createdCategory.id,
          name: createdCategory.name,
        },
      ]);

      setSubcategoryName("");

      setMode("subcategory");

      onCreated?.();
    } catch (err: any) {
      console.error("Main category create error:", err);

      setError(err?.message || "Main category create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     PARSE PASTE LIST
  ======================================================= */

  function parseIndentedText(text: string) {
    const lines = text
      .split("\n")
      .map((line) => line.replace(/\t/g, "    "))
      .map((line) => line.trimEnd())
      .filter((line) => line.trim() !== "");

    const roots: any[] = [];

    const stack: {
      level: number;
      node: any;
    }[] = [];

    for (const line of lines) {
      const spaces = line.match(/^ */)?.[0].length || 0;

      const level = Math.floor(spaces / 2);

      const node = {
        name: line.trim(),
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

  /* =======================================================
     CREATE PASTE TREE
  ======================================================= */

  async function createPasteTree(
    nodes: any[],
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

      const createdId = result?.data?.id;

      if (!createdId) {
        throw new Error(
          `"${node.name}" create হয়েছে কিন্তু ID পাওয়া যায়নি।`,
        );
      }

      if (node.children && node.children.length > 0) {
        await createPasteTree(node.children, createdId, accessToken);
      }
    }
  }

  /* =======================================================
     PASTE SUBMIT
  ======================================================= */

  async function handlePasteSubmit() {
    if (!pasteText.trim()) {
      setError("Category list paste করুন।");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const parsed = parseIndentedText(pasteText);

      if (!parsed.length) {
        throw new Error("Valid category পাওয়া যায়নি।");
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি।");
      }

      await createPasteTree(parsed, null, session.access_token);

      setPasteText("");

      await fetchCategories();

      onCreated?.();

      setMode("manual");
    } catch (err: any) {
      console.error("Paste category error:", err);

      setError(err?.message || "Category list save করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     CLOSE
  ======================================================= */

  function handleClose() {
    if (loading) return;

    setSelectedMainCategory(null);
    setCurrentParent(null);
    setCategoryPath([]);

    setSubcategoryName("");
    setMainCategoryName("");
    setPasteText("");

    setMode("manual");
    setError("");

    onClose();
  }

  /* =======================================================
     UI
  ======================================================= */

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Create Categories
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Main category এবং subcategory তৈরি করুন
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="border-b border-slate-200 px-5 pt-4">
          <div className="flex w-fit rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("manual");
                setError("");
              }}
              className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                mode === "manual" || mode === "subcategory"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Manual
            </button>

            {selectedMainCategory && (
              <button
                type="button"
                onClick={() => {
                  setMode("subcategory");
                  setError("");
                }}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                  mode === "subcategory"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Add Subcategory
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMode("paste");
                setError("");
              }}
              className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
                mode === "paste"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Paste List
            </button>
          </div>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {/* =================================================
              MAIN CATEGORY SCREEN
          ================================================= */}

          {mode === "manual" && (
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Existing Main Categories
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                যেই main category-এর under-এ নতুন category দিতে চান সেটি select
                করুন।
              </p>

              {/* MAIN CATEGORY LIST */}

              <div className="mt-3 space-y-2">
                {mainCategories.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center">
                    <p className="text-xs text-slate-400">
                      এখনো কোনো main category নেই।
                    </p>
                  </div>
                ) : (
                  mainCategories.map((category) => {
                    const selected = selectedMainCategory?.id === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleSelectMainCategory(category)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-[#12233F] bg-slate-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs font-semibold text-slate-800">
                          {category.name}
                        </span>

                        {selected && (
                          <span className="text-[11px] font-bold text-emerald-600">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* CREATE MAIN */}

              <div className="mt-6 border-t border-slate-200 pt-5">
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Create New Main Category
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mainCategoryName}
                    onChange={(e) => setMainCategoryName(e.target.value)}
                    placeholder="Example: Fashion"
                    disabled={loading}
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none transition focus:border-[#D6A419]"
                  />

                  <button
                    type="button"
                    onClick={handleCreateMainCategory}
                    disabled={loading || !mainCategoryName.trim()}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#12233F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1b3154] disabled:opacity-60"
                  >
                    <Plus size={14} />
                    Add Main
                  </button>
                </div>
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
                onClick={handleBack}
                disabled={loading}
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              {/* =================================================
                    BREADCRUMB
                ================================================= */}

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-700">
                  Category Path
                </p>

                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  {categoryPath.map((item, index) => {
                    const isCurrent = index === categoryPath.length - 1;

                    return (
                      <div key={item.id} className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePathClick(index)}
                          disabled={loading}
                          title={
                            isCurrent
                              ? "Current parent"
                              : `Change parent to ${item.name}`
                          }
                          className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                            isCurrent
                              ? "bg-[#12233F] text-white"
                              : "bg-white text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                          }`}
                        >
                          {item.name}
                        </button>

                        {!isCurrent && (
                          <ChevronRight size={13} className="text-slate-400" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  মাঝের কোনো category-তে আবার subcategory দিতে চাইলে উপরের সেই
                  category-তে click করুন।
                </p>
              </div>

              {/* =================================================
                    CURRENT PARENT
                ================================================= */}

              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                  Parent Category
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-900">
                  {currentParent.name}
                </p>
              </div>

              {/* =================================================
                    SUBCATEGORY INPUT
                ================================================= */}

              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Subcategory Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleAddSubcategory();
                  }
                }}
                placeholder="Example: Men"
                disabled={loading}
                autoFocus
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-xs outline-none transition focus:border-[#D6A419]"
              />

              {/* =================================================
                    ADD BUTTON
                ================================================= */}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  disabled={loading || !subcategoryName.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b3154] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={14} />

                  {loading ? "Adding..." : "Add Subcategory"}
                </button>
              </div>

              {/* =================================================
                    HELP
                ================================================= */}

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs leading-5 text-slate-500">
                  <strong className="text-slate-700">Example:</strong> Fashion →
                  Men → Clothing → Shirt
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  নতুন category তৈরি হলে সেটিই automatically পরের parent হবে।
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  আর মাঝের কোনো level-এ যেতে চাইলে উপরের breadcrumb থেকে সেই
                  category click করুন।
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              PASTE SCREEN
          ================================================= */}

          {mode === "paste" && (
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Paste Category List
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Indentation ব্যবহার করে nested category তৈরি করুন।
              </p>

              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Fashion
  Men
    Clothing
      Shirt
        Formal Shirt
  Women
    Saree
      Silk Saree`}
                disabled={loading}
                className="mt-4 min-h-[300px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-6 outline-none transition focus:border-[#D6A419] focus:bg-white"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handlePasteSubmit}
                  disabled={loading || !pasteText.trim()}
                  className="rounded-lg bg-[#12233F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b3154] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Categories"}
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          {mode === "subcategory" && currentParent && (
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Current parent</p>

              <p className="text-xs font-bold text-slate-700">
                {currentParent.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
