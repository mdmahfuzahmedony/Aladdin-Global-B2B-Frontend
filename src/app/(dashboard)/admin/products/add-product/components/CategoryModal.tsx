"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  ClipboardList,
  GripVertical,
  ImagePlus,
  Save,
  Trash2,
} from "lucide-react";

import { createClient } from "../../../../../../../lib/supabase-client";
import CategoryIcon from "@/components/category/CategoryIcon";
import { FASHION_CATEGORY_TREE_TEXT } from "./product-field/Fashion/FashionCategoryTree";

type Category = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  fieldsConfig: unknown;
  parentId: string | null;
  image?: string | null;
  icon?: string | null;
  sortOrder: number;
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

function normalizeCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoryImageControl({
  category,
  apiUrl,
  onSaved,
}: {
  category: Pick<Category, "id" | "name" | "image">;
  apiUrl: string;
  onSaved: (id: string, image: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(category.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSelectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    if (!file.type.startsWith("image/")) {
      setError("শুধু image file নির্বাচন করুন।");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size সর্বোচ্চ 5MB হতে পারবে।");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${apiUrl}/api/uploads/category-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result?.success || !result?.data?.url) {
        throw new Error(result?.error || "Category image upload করা যায়নি।");
      }

      setImage(result.data.url as string);
    } catch (uploadError) {
      console.error("Category image upload error:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Category image upload করা যায়নি।",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveImage() {
    if (!image) {
      setError("আগে image upload করুন।");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
      }

      const response = await fetch(
        `${apiUrl}/api/categories/${encodeURIComponent(category.id)}/image`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ image }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result?.success || !result?.data?.image) {
        throw new Error(result?.error || "Category image save করা যায়নি।");
      }

      const savedImage = result.data.image as string;
      setImage(savedImage);
      onSaved(category.id, savedImage);
    } catch (saveError) {
      console.error("Category image save error:", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Category image save করা যায়নি।",
      );
    } finally {
      setSaving(false);
    }
  }

  const changed = image !== (category.image ?? "");

  return (
    <div className="flex shrink-0 items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => void handleSelectImage(event)}
        className="hidden"
      />
      {image ? (
        <img
          src={image}
          alt={`${category.name} category`}
          className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400">
          <ImagePlus size={16} />
        </span>
      )}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || saving}
          className="whitespace-nowrap rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:border-amber-400 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : image ? "Change image" : "Add image"}
        </button>
        {changed && (
          <button
            type="button"
            onClick={() => void handleSaveImage()}
            disabled={uploading || saving}
            className="whitespace-nowrap rounded-md bg-[#12233F] px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
        {error && (
          <span role="alert" className="max-w-36 text-[9px] text-rose-600">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

type CategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CategoryModal({
  open,
  onClose,
  onCreated,
}: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<Category | null>(null);
  const [currentParent, setCurrentParent] = useState<Category | null>(null);
  const [categoryPath, setCategoryPath] = useState<PathItem[]>([]);
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [mainCategoryImage, setMainCategoryImage] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState("");
  const [currentCategoryImage, setCurrentCategoryImage] = useState("");
  const [uploadingMainCategoryImage, setUploadingMainCategoryImage] = useState(false);
  const [uploadingSubcategoryImage, setUploadingSubcategoryImage] = useState(false);
  const [uploadingCurrentCategoryImage, setUploadingCurrentCategoryImage] =
    useState(false);
  const [savingCurrentCategoryImage, setSavingCurrentCategoryImage] =
    useState(false);
  const [pasteText, setPasteText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mode, setMode] = useState<Mode>("manual");
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const mainCategoryImageInputRef = useRef<HTMLInputElement>(null);
  const subcategoryImageInputRef = useRef<HTMLInputElement>(null);
  const currentCategoryImageInputRef = useRef<HTMLInputElement>(null);

  const mainCategories = useMemo(
    () =>
      categories
        .filter((item) => item.parentId === null)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [categories],
  );

  const currentChildren = useMemo(
    () =>
      currentParent
        ? categories
            .filter((item) => item.parentId === currentParent.id)
            .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
        : [],
    [categories, currentParent],
  );

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  async function getToken() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session?.access_token) {
      throw new Error("আপনার login session পাওয়া যায়নি। আবার login করুন।");
    }

    return session.access_token;
  }

  async function fetchCategories(): Promise<Category[]> {
    try {
      setFetchingCategories(true);
      const token = await getToken();

      const response = await fetch(`${apiUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Categories fetch করা যায়নি।");
      }

      const items: Category[] = (result?.data ?? []).map(
        (item: Category) => ({
          ...item,
          sortOrder: Number(item.sortOrder ?? 0),
        }),
      );

      setCategories(items);
      return items;
    } finally {
      setFetchingCategories(false);
    }
  }

  function handleCategoryImageSaved(id: string, image: string) {
    const updateImage = (category: Category) =>
      category.id === id ? { ...category, image } : category;

    setCategories((previous) => previous.map(updateImage));
    setCurrentParent((previous) =>
      previous?.id === id ? updateImage(previous) : previous,
    );
    setSelectedMainCategory((previous) =>
      previous?.id === id ? updateImage(previous) : previous,
    );
    if (currentParent?.id === id) setCurrentCategoryImage(image);
    onCreated?.();
  }

  function resetModal() {
    setSelectedMainCategory(null);
    setCurrentParent(null);
    setCategoryPath([]);
    setMainCategoryName("");
    setMainCategoryImage("");
    setSubcategoryName("");
    setSubcategoryImage("");
    setCurrentCategoryImage("");
    setPasteText("");
    setSuccessMessage("");
    setMode("manual");
    setError("");
    setLoading(false);
    setSavingOrder(false);
    setOrderChanged(false);
    setDraggingId(null);
  }

  useEffect(() => {
    if (!open) return;

    resetModal();

    void fetchCategories().catch((err: unknown) => {
      setError(
        err instanceof Error ? err.message : "Categories fetch করা যায়নি।",
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    if (loading || savingOrder) return;
    resetModal();
    onClose();
  }

  function selectMainCategory(category: Category) {
    setSelectedMainCategory(category);
    setCurrentParent(category);
    setCurrentCategoryImage(category.image ?? "");
    setCategoryPath([{ id: category.id, name: category.name }]);
    setSubcategoryName("");
    setSubcategoryImage("");
    setError("");
    setSuccessMessage("");
    setMode("subcategory");
  }

  async function createOneCategory(
    name: string,
    parentId: string | null,
    image?: string,
  ) {
    const token = await getToken();

    const response = await fetch(`${apiUrl}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, parentId, image }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || "Category create করা যায়নি।");
    }

    if (!result?.data?.id) {
      throw new Error("Category তৈরি হয়েছে কিন্তু ID পাওয়া যায়নি।");
    }

    return result.data as Category;
  }

  async function uploadCategoryImage(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
      throw new Error("শুধু image file নির্বাচন করুন।");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size সর্বোচ্চ 5MB হতে পারবে।");
    }

    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiUrl}/api/uploads/category-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();

    if (!response.ok || !result?.success || !result?.data?.url) {
      throw new Error(result?.error || "Category image upload করা যায়নি।");
    }

    return result.data.url as string;
  }

  async function handleMainCategoryImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    try {
      setUploadingMainCategoryImage(true);
      setError("");
      setMainCategoryImage(await uploadCategoryImage(file));
    } catch (uploadError) {
      console.error("Main category image upload error:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Category image upload করা যায়নি।",
      );
    } finally {
      setUploadingMainCategoryImage(false);
    }
  }

  async function handleSubcategoryImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    try {
      setUploadingSubcategoryImage(true);
      setError("");
      setSubcategoryImage(await uploadCategoryImage(file));
    } catch (uploadError) {
      console.error("Subcategory image upload error:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Category image upload করা যায়নি।",
      );
    } finally {
      setUploadingSubcategoryImage(false);
    }
  }

  async function handleCurrentCategoryImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    try {
      setUploadingCurrentCategoryImage(true);
      setError("");
      setCurrentCategoryImage(await uploadCategoryImage(file));
    } catch (uploadError) {
      console.error("Current category image upload error:", uploadError);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Category image upload করা যায়নি।",
      );
    } finally {
      setUploadingCurrentCategoryImage(false);
    }
  }

  async function handleSaveCurrentCategoryImage() {
    if (!currentParent || !currentCategoryImage) {
      setError("আগে category image upload করুন।");
      return;
    }

    try {
      setSavingCurrentCategoryImage(true);
      setError("");
      setSuccessMessage("");

      const token = await getToken();
      const response = await fetch(
        `${apiUrl}/api/categories/${encodeURIComponent(currentParent.id)}/image`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: currentCategoryImage }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result?.success || !result?.data?.image) {
        throw new Error(result?.error || "Category image save করা যায়নি।");
      }

      const updatedCategory = {
        ...currentParent,
        image: result.data.image as string,
      };
      setCurrentParent(updatedCategory);
      setCurrentCategoryImage(updatedCategory.image ?? "");
      setCategories((previous) =>
        previous.map((item) =>
          item.id === updatedCategory.id ? updatedCategory : item,
        ),
      );
      setSuccessMessage(`${updatedCategory.name} image save হয়েছে।`);
      onCreated?.();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Category image save করা যায়নি।",
      );
    } finally {
      setSavingCurrentCategoryImage(false);
    }
  }

  async function handleCreateMainCategory() {
    const name = mainCategoryName.trim();

    if (!name) {
      setError("Main category name দিতে হবে।");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      if (uploadingMainCategoryImage) {
        setError("Image upload শেষ হওয়া পর্যন্ত অপেক্ষা করুন।");
        return;
      }

      const created = await createOneCategory(name, null, mainCategoryImage);
      const items = await fetchCategories();
      const fresh = items.find((item) => item.id === created.id) ?? created;

      setMainCategoryName("");
      setMainCategoryImage("");
      selectMainCategory(fresh);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Category create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubcategory() {
    const name = subcategoryName.trim();

    if (uploadingSubcategoryImage) {
      setError("Image upload শেষ হওয়া পর্যন্ত অপেক্ষা করুন।");
      return;
    }

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
      setSuccessMessage("");

      const created = await createOneCategory(
        name,
        currentParent.id,
        subcategoryImage,
      );

      await fetchCategories();

      setSuccessMessage(
        `"${created.name}" যোগ হয়েছে: ${categoryPath
          .map((item) => item.name)
          .join(" > ")} > ${created.name}`,
      );
      setCurrentParent(created);
      setCurrentCategoryImage(created.image ?? "");
      setCategoryPath((previous) => [
        ...previous,
        { id: created.id, name: created.name },
      ]);
      setSubcategoryName("");
      setSubcategoryImage("");
      setMode("subcategory");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subcategory create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  function handlePathClick(index: number) {
    const item = categoryPath[index];
    if (!item) return;

    const category = categories.find((entry) => entry.id === item.id);
    if (!category) return;

    setCurrentParent(category);
    setCurrentCategoryImage(category.image ?? "");
    setSubcategoryImage("");
    setCategoryPath((previous) => previous.slice(0, index + 1));
    setError("");
    setMode("subcategory");
  }

  function handleChildClick(child: Category) {
    setCurrentParent(child);
    setCurrentCategoryImage(child.image ?? "");
    setSubcategoryImage("");
    setCategoryPath((previous) => {
      const index = previous.findIndex((item) => item.id === child.id);
      if (index >= 0) return previous.slice(0, index + 1);

      return [...previous, { id: child.id, name: child.name }];
    });
    setError("");
  }

  function handleBack() {
    if (categoryPath.length <= 1) {
      setSelectedMainCategory(null);
      setCurrentParent(null);
      setCurrentCategoryImage("");
      setCategoryPath([]);
      setMode("manual");
      setError("");
      return;
    }

    const nextPath = categoryPath.slice(0, -1);
    const previous = categories.find(
      (item) => item.id === nextPath[nextPath.length - 1].id,
    );

    if (!previous) return;

    setCategoryPath(nextPath);
    setCurrentParent(previous);
    setCurrentCategoryImage(previous.image ?? "");
    setSubcategoryImage("");
    setMode("subcategory");
    setError("");
  }

  function handleDrop(
    draggedId: string,
    targetId: string,
    parentId: string | null,
  ) {
    if (draggedId === targetId) return;

    const siblings = categories
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

    const fromIndex = siblings.findIndex((item) => item.id === draggedId);
    const toIndex = siblings.findIndex((item) => item.id === targetId);

    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = [...siblings];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const orderMap = new Map(
      reordered.map((item, index) => [item.id, index + 1]),
    );

    setCategories((previous) =>
      previous.map((item) => {
        const newOrder = orderMap.get(item.id);
        return newOrder === undefined
          ? item
          : { ...item, sortOrder: newOrder };
      }),
    );

    setOrderChanged(true);
    setDraggingId(null);
    setError("");
    setSuccessMessage("");
  }

  async function handleSaveOrder() {
    try {
      setSavingOrder(true);
      setError("");
      setSuccessMessage("");

      const token = await getToken();
      const parentId = currentParent?.id ?? null;

      const siblings = categories
        .filter((item) => item.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const response = await fetch(`${apiUrl}/api/categories/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parentId,
          categoryIds: siblings.map((item) => item.id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Category order save করা যায়নি।");
      }

      await fetchCategories();
      setOrderChanged(false);
      setSuccessMessage("Category order সফলভাবে সংরক্ষণ হয়েছে।");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Category order save করা যায়নি।");
    } finally {
      setSavingOrder(false);
    }
  }

  function parseIndentedText(text: string): PasteNode[] {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.replace(/\t/g, "    "))
      .filter((line) => line.trim());

    const roots: PasteNode[] = [];
    const stack: { level: number; node: PasteNode }[] = [];

    for (const line of lines) {
      const spaces = line.match(/^ */)?.[0].length ?? 0;
      const level = Math.floor(spaces / 2);
      const node: PasteNode = {
        name: line.trim(),
        children: [],
      };

      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (!stack.length) roots.push(node);
      else stack[stack.length - 1].node.children.push(node);

      stack.push({ level, node });
    }

    return roots;
  }

  async function createPasteTree(
    nodes: PasteNode[],
    parentId: string | null,
    token: string,
    known: Category[],
    counts: { created: number; reused: number },
  ): Promise<void> {
    for (const node of nodes) {
      const normalized = normalizeCategoryName(node.name);

      let category = known.find(
        (item) =>
          item.parentId === parentId &&
          normalizeCategoryName(item.name) === normalized,
      );

      if (category) {
        counts.reused++;

        await createPasteTree(
          node.children,
          category.id,
          token,
          known,
          counts,
        );
        continue;
      }

      const response = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: node.name, parentId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || `"${node.name}" create করা যায়নি।`);
      }

      category = result.data as Category;
      known.push(category);
      counts.created++;

      await createPasteTree(
        node.children,
        category.id,
        token,
        known,
        counts,
      );
    }
  }

  async function handlePasteSubmit(text = pasteText) {
    if (!text.trim()) {
      setError("Category list paste করুন।");
      return;
    }

    try {
      const tree = parseIndentedText(text);

      if (!tree.length) {
        setError("কোনো valid category পাওয়া যায়নি।");
        return;
      }

      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = await getToken();
      const known = await fetchCategories();
      const counts = { created: 0, reused: 0 };

      await createPasteTree(tree, null, token, known, counts);

      setPasteText("");
      await fetchCategories();
      setSuccessMessage(
        `${counts.created}টি নতুন category তৈরি হয়েছে; ${counts.reused}টি আগে থেকেই ছিল।`,
      );
      setMode("manual");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Category list create করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const displayedParentId = currentParent?.id ?? null;
  const displayedCategories = currentParent ? currentChildren : mainCategories;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#12233F]">
              Add & Arrange Categories
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Drag categories to change their display order
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading || savingOrder}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-5 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode(currentParent ? "subcategory" : "manual");
                setError("");
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${
                mode !== "paste"
                  ? "bg-white text-[#12233F] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("paste");
                setError("");
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${
                mode === "paste"
                  ? "bg-white text-[#12233F] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Paste List
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-600">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              {successMessage}
            </div>
          )}

          {fetchingCategories && categories.length === 0 && (
            <p className="mb-4 text-xs text-slate-500">Categories loading...</p>
          )}

          {mode === "manual" && (
            <>
              <div className="mb-6">
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Main Category
                </label>

                <input
                  value={mainCategoryName}
                  onChange={(event) => {
                    setMainCategoryName(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading) {
                      void handleCreateMainCategory();
                    }
                  }}
                  placeholder="Example: Grocery"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-[#12233F]"
                />

                <input
                  ref={mainCategoryImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleMainCategoryImageChange(event)}
                  className="hidden"
                />
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Category image
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Optional · image up to 5MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => mainCategoryImageInputRef.current?.click()}
                      disabled={loading || uploadingMainCategoryImage}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-[#12233F] hover:border-amber-400 disabled:opacity-50"
                    >
                      <ImagePlus size={14} />
                      {uploadingMainCategoryImage ? "Uploading..." : "Choose image"}
                    </button>
                  </div>
                  {mainCategoryImage && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={mainCategoryImage}
                        alt="Category preview"
                        className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate text-[10px] text-slate-500">
                        Image ready to save
                      </span>
                      <button
                        type="button"
                        onClick={() => setMainCategoryImage("")}
                        disabled={loading}
                        aria-label="Remove category image"
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#12233F]">
                    <CategoryIcon name={mainCategoryName} size={25} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Automatic Category Icon
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Icon category name অনুযায়ী তৈরি হবে।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleCreateMainCategory()}
                  disabled={
                    loading ||
                    uploadingMainCategoryImage ||
                    !mainCategoryName.trim()
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white disabled:opacity-40"
                >
                  <Plus size={14} />
                  {loading ? "Saving..." : "Create Main Category"}
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  Main Categories
                </p>
                <span className="text-right text-[10px] text-slate-400">
                  {mainCategories.length} categories · Scroll to view all
                </span>
              </div>

              {mainCategories.length === 0 ? (
                <p className="rounded-xl border border-dashed p-5 text-center text-xs text-slate-400">
                  এখনো কোনো main category নেই।
                </p>
              ) : (
                <div className="max-h-[35vh] space-y-2 overflow-y-auto overscroll-contain pr-1">
                  {mainCategories.map((category) => {
                    const count = categories.filter(
                      (item) => item.parentId === category.id,
                    ).length;

                    return (
                      <div
                        key={category.id}
                        draggable={!loading && !savingOrder}
                        onDragStart={() => setDraggingId(category.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() =>
                          draggingId &&
                          handleDrop(draggingId, category.id, null)
                        }
                        onDragEnd={() => setDraggingId(null)}
                        className={`flex items-center gap-2 rounded-xl border p-2 ${
                          draggingId === category.id
                            ? "border-[#D6A419] bg-amber-50 opacity-60"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span
                          title="Drag to reorder"
                          className="cursor-grab touch-none px-1 text-slate-400 active:cursor-grabbing"
                        >
                          <GripVertical size={20} />
                        </span>

                        <CategoryImageControl
                          key={`${category.id}-${category.image ?? ""}`}
                          category={category}
                          apiUrl={apiUrl}
                          onSaved={handleCategoryImageSaved}
                        />

                        <button
                          type="button"
                          onClick={() => selectMainCategory(category)}
                          disabled={loading || savingOrder}
                          className="flex min-w-0 flex-1 items-center justify-between gap-2 py-1 text-left"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-slate-800">
                              {category.name}
                            </span>
                            <span className="mt-1 block text-[10px] text-slate-400">
                              {count} subcategories
                            </span>
                          </span>
                          <ChevronRight size={16} className="text-slate-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {orderChanged && !currentParent && (
                <button
                  type="button"
                  onClick={() => void handleSaveOrder()}
                  disabled={savingOrder}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white disabled:opacity-50"
                >
                  <Save size={15} />
                  {savingOrder ? "Saving order..." : "Save Main Category Order"}
                </button>
              )}
            </>
          )}

          {mode === "subcategory" && currentParent && (
            <>
              <button
                type="button"
                onClick={handleBack}
                disabled={loading || savingOrder}
                className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#12233F]"
              >
                <ChevronLeft size={15} /> Back
              </button>

              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Category Path
              </p>

              <div className="mb-5 flex flex-wrap items-center gap-1 rounded-xl border bg-slate-50 p-2">
                {categoryPath.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handlePathClick(index)}
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                        index === categoryPath.length - 1
                          ? "bg-[#12233F] text-white"
                          : "text-slate-500 hover:bg-white"
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

              <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Current Parent
                </p>
                <p className="mt-1 text-sm font-bold text-[#12233F]">
                  {currentParent.name}
                </p>
                <input
                  ref={currentCategoryImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    void handleCurrentCategoryImageChange(event)
                  }
                  className="hidden"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {currentCategoryImage ? (
                    <img
                      src={currentCategoryImage}
                      alt={`${currentParent.name} category`}
                      className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 text-[9px] text-slate-400">
                      No image
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => currentCategoryImageInputRef.current?.click()}
                    disabled={
                      loading ||
                      uploadingCurrentCategoryImage ||
                      savingCurrentCategoryImage
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-[#12233F] hover:border-amber-400 disabled:opacity-50"
                  >
                    {uploadingCurrentCategoryImage
                      ? "Uploading..."
                      : currentCategoryImage
                        ? "Change image"
                        : "Upload image"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveCurrentCategoryImage()}
                    disabled={
                      loading ||
                      savingCurrentCategoryImage ||
                      uploadingCurrentCategoryImage ||
                      !currentCategoryImage ||
                      currentCategoryImage === (currentParent.image ?? "")
                    }
                    className="rounded-lg bg-[#12233F] px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-40"
                  >
                    {savingCurrentCategoryImage ? "Saving..." : "Save image"}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700">
                    Subcategories
                  </p>
                  <span className="text-right text-[10px] text-slate-400">
                    {currentChildren.length} categories · Scroll to view all
                  </span>
                </div>

                {currentChildren.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-4 text-center text-xs text-slate-400">
                    কোনো subcategory নেই।
                  </p>
                ) : (
                  <div className="max-h-[35vh] space-y-2 overflow-y-auto overscroll-contain pr-1">
                    {currentChildren.map((child) => {
                      const childCount = categories.filter(
                        (item) => item.parentId === child.id,
                      ).length;

                      return (
                        <div
                          key={child.id}
                          draggable={!loading && !savingOrder}
                          onDragStart={() => setDraggingId(child.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() =>
                            draggingId &&
                            handleDrop(draggingId, child.id, currentParent.id)
                          }
                          onDragEnd={() => setDraggingId(null)}
                          className={`flex items-center gap-2 rounded-xl border p-2 ${
                            draggingId === child.id
                              ? "border-[#D6A419] bg-amber-50 opacity-60"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <span
                            title="Drag to reorder"
                            className="cursor-grab touch-none px-1 text-slate-400 active:cursor-grabbing"
                          >
                            <GripVertical size={20} />
                          </span>

                          <CategoryImageControl
                            key={`${child.id}-${child.image ?? ""}`}
                            category={child}
                            apiUrl={apiUrl}
                            onSaved={handleCategoryImageSaved}
                          />

                          <button
                            type="button"
                            onClick={() => handleChildClick(child)}
                            disabled={loading || savingOrder}
                            className="flex min-w-0 flex-1 items-center justify-between gap-2 py-2 text-left"
                          >
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold text-slate-800">
                                  {child.name}
                                </span>
                                <span className="mt-1 block text-[10px] text-slate-400">
                                  {childCount
                                    ? `${childCount} child categories`
                                    : "Click to open"}
                                </span>
                            </span>
                            <ChevronRight size={15} className="shrink-0 text-slate-400" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {orderChanged && (
                  <button
                    type="button"
                    onClick={() => void handleSaveOrder()}
                    disabled={savingOrder}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    <Save size={15} />
                    {savingOrder ? "Saving order..." : "Save Subcategory Order"}
                  </button>
                )}
              </div>

              <label className="mb-2 block text-xs font-bold text-slate-700">
                New Subcategory
              </label>

              <div className="flex gap-2">
                <input
                  value={subcategoryName}
                  onChange={(event) => {
                    setSubcategoryName(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading) {
                      void handleAddSubcategory();
                    }
                  }}
                  placeholder={`Add under ${currentParent.name}`}
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none focus:border-[#12233F]"
                />

                <button
                  type="button"
                  onClick={() => void handleAddSubcategory()}
                  disabled={
                    loading ||
                    uploadingSubcategoryImage ||
                    !subcategoryName.trim()
                  }
                  className="flex items-center gap-1 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white disabled:opacity-40"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              <input
                ref={subcategoryImageInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => void handleSubcategoryImageChange(event)}
                className="hidden"
              />
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Subcategory image
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Optional · image up to 5MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => subcategoryImageInputRef.current?.click()}
                    disabled={loading || uploadingSubcategoryImage}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-[#12233F] hover:border-amber-400 disabled:opacity-50"
                  >
                    <ImagePlus size={14} />
                    {uploadingSubcategoryImage ? "Uploading..." : "Choose image"}
                  </button>
                </div>
                {subcategoryImage && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={subcategoryImage}
                      alt="Subcategory preview"
                      className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate text-[10px] text-slate-500">
                      Image ready to save
                    </span>
                    <button
                      type="button"
                      onClick={() => setSubcategoryImage("")}
                      disabled={loading}
                      aria-label="Remove subcategory image"
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] leading-5 text-amber-700">
                নতুন category তৈরি হলে সেটি পরবর্তী parent হবে। Breadcrumb
                থেকে আগের level-এ ফিরতে পারবেন।
              </p>
            </>
          )}

          {mode === "paste" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  void handlePasteSubmit(FASHION_CATEGORY_TREE_TEXT);
                }}
                disabled={loading}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#12233F] px-4 py-3 text-xs font-semibold text-[#12233F] disabled:opacity-40"
              >
                <Plus size={14} />
                {loading ? "Creating..." : "Create Fashion Categories"}
              </button>

              <p className="mb-4 text-[11px] leading-5 text-slate-500">
                Fashion-এর category tree তৈরি হবে। আগে থেকে থাকা একই parent-এর
                category পুনরায় তৈরি হবে না।
              </p>

              <div className="mb-2 flex items-center gap-2">
                <ClipboardList size={15} className="text-[#12233F]" />
                <p className="text-xs font-bold text-slate-700">
                  Paste Category Tree
                </p>
              </div>

              <p className="mb-2 text-[11px] text-slate-400">
                প্রতি level-এর জন্য 2 spaces ব্যবহার করুন।
              </p>

              <textarea
                value={pasteText}
                onChange={(event) => {
                  setPasteText(event.target.value);
                  setError("");
                }}
                disabled={loading}
                rows={12}
                placeholder={`Grocery
  Cooking Essentials
  Fruits & Vegetables
  Fish & Meat
  Dairy & Eggs`}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs leading-6 outline-none focus:border-[#12233F]"
              />

              <button
                type="button"
                onClick={() => void handlePasteSubmit()}
                disabled={loading || !pasteText.trim()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-3 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Plus size={14} />
                {loading ? "Creating..." : "Create Category Tree"}
              </button>
            </>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading || savingOrder}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}