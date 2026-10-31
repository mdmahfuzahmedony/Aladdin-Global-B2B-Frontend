"use client";

import React, { useRef, useState } from "react";
import { createClient } from "../../../../../../../../lib/supabase-client";

type ProductImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  description?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function ProductImageUploader({
  images,
  onChange,
  label = "Product Images (মূল ছবি)",
  description = "পণ্যটির প্রধান গ্যালারি ও কভার ছবি যুক্ত করুন (হোমপেজ ও ক্যাটালগে প্রদর্শনের জন্য)",
}: ProductImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const getAccessToken = async () => {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  };

  const handleSelectImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const token = await getAccessToken();

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/uploads/product-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Image upload failed.");
      }

      const imageUrl = result?.data?.url;

      if (!imageUrl) {
        throw new Error("Image uploaded but URL was not returned.");
      }

      onChange([...images, imageUrl]);
    } catch (error: any) {
      console.error("Image upload error:", error);

      setError(error?.message || "Image upload failed.");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (image: string, index: number) => {
    try {
      setError("");
      setDeletingIndex(index);

      const token = await getAccessToken();

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/api/uploads/product-image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: image,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Image delete failed.");
      }

      onChange(images.filter((_, imageIndex) => imageIndex !== index));
    } catch (error: any) {
      console.error("Image delete error:", error);

      setError(error?.message || "Image delete failed.");
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSelectImage}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-800">
            {label}
          </label>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-medium text-[#12233F] hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {uploading ? "Uploading..." : "+ Add Image"}
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="aspect-square bg-slate-100">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-2">
                <button
                  type="button"
                  disabled={deletingIndex === index}
                  onClick={() => handleRemoveImage(image, index)}
                  className="w-full rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingIndex === index ? "Deleting..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-xs text-slate-400">
          No images added
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
