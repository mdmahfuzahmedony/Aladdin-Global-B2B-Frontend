"use client";

import { ChangeEvent, useState } from "react";
import { Upload, X } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type Props = {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
};

const categories = [
  "PRODUCT",
  "CATEGORY",
  "BRAND",
  "BANNER",
  "SLIDER",
  "STORE",
  "PROMOTION",
  "GENERAL",
];

export default function MediaUploadModal({ open, onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("GENERAL");
  const [altText, setAltText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("category", category);
      formData.append("altText", altText);

      const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }

      setFile(null);
      setAltText("");
      setCategory("GENERAL");

      onUploaded();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Upload Media
            </h2>

            <p className="text-sm text-slate-500">
              Upload image or video to media library
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-[#D6A419]">
            <Upload size={30} className="mb-3 text-slate-400" />

            <span className="text-sm font-medium text-slate-700">
              {file ? file.name : "Click to choose a file"}
            </span>

            <span className="mt-1 text-xs text-slate-500">
              Images up to 10MB, videos up to 50MB
            </span>

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Alt Text
            </label>

            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Enter image description"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="rounded-lg bg-[#12233F] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
