"use client";


import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import imageCompression from "browser-image-compression";
import { compressPDF } from "compress-pdf-lib";

export type VerificationData = {
  nidNumber: string;
  nidFrontDocument: File | null;
  nidBackDocument: File | null;
  tradeLicenseNumber: string;
  tradeLicenseDocument: File | null;
  tinNumber: string;
  tinDocument: File | null;
};

type Props = {
  data: VerificationData;
  onChange: (data: VerificationData) => void;
};

type DocumentField =
  | "nidFrontDocument"
  | "nidBackDocument"
  | "tradeLicenseDocument"
  | "tinDocument";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-slate-700";

const uploadClass =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3.5 py-3 text-[13px] text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function isPdf(file: File): boolean {
  return (
    file.type.toLowerCase() === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

async function optimizeDocument(file: File): Promise<File> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("ফাইলের সাইজ সর্বোচ্চ ২০ MB হতে পারবে।");
  }

  if (isPdf(file)) {
    if (
      file.type &&
      file.type.toLowerCase() !== "application/pdf"
    ) {
      throw new Error("PDF ফাইলটি সঠিক ফরম্যাটে নেই।");
    }

    try {
      const result = await compressPDF(file, {
        quality: 85,
        scale: 1,
      });

      const compressedFile = result.file;

      if (
        compressedFile &&
        compressedFile.size > 0 &&
        compressedFile.size < file.size
      ) {
        return new File(
          [compressedFile],
          file.name.replace(/\.pdf$/i, "") + ".pdf",
          {
            type: "application/pdf",
            lastModified: Date.now(),
          }
        );
      }
    } catch (error) {
      console.warn(
        "PDF compression failed; using original PDF.",
        error
      );
    }

    return file;
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) {
    throw new Error("শুধু JPG, PNG, WebP অথবা PDF ফাইল আপলোড করুন।");
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 2000,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });

  if (
    compressed.type !== "image/webp" ||
    compressed.size === 0
  ) {
    throw new Error("ছবিটি WebP-তে রূপান্তর করা যায়নি।");
  }

  if (compressed.size > MAX_FILE_SIZE) {
    throw new Error("Compress করার পরও ফাইলটি ২০ MB-এর বেশি।");
  }

  const originalName = file.name.replace(/\.[^.]+$/, "");

  return new File(
    [compressed],
    `${originalName || "document"}.webp`,
    {
      type: "image/webp",
      lastModified: Date.now(),
    }
  );
}

export function VerificationStep({
  data,
  onChange,
}: Props) {
  const [processing, setProcessing] =
    useState<DocumentField | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [previews, setPreviews] = useState<
    Partial<Record<DocumentField, string>>
  >({});

  const previewsRef = useRef(previews);
  const mountedRef = useRef(true);
  const processingRef = useRef(false);

  // Keep the latest previews available for safe cleanup.
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      Object.values(previewsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    field: DocumentField,
    label: string
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (processingRef.current) {
      input.value = "";
      return;
    }

    processingRef.current = true;
    setError(null);
    setProcessing(field);

    try {
      const optimizedFile = await optimizeDocument(file);

      if (!mountedRef.current) return;

      const oldPreview = previewsRef.current[field];

      if (oldPreview) {
        URL.revokeObjectURL(oldPreview);
      }

      let newPreview: string | undefined;

      if (optimizedFile.type.startsWith("image/")) {
        newPreview = URL.createObjectURL(optimizedFile);
      }

      setPreviews((previous) => {
        const next = { ...previous };

        if (newPreview) {
          next[field] = newPreview;
        } else {
          delete next[field];
        }

        previewsRef.current = next;
        return next;
      });

      onChange({
        ...data,
        [field]: optimizedFile,
      });

      console.log(
        `${label}: ${(file.size / 1024 / 1024).toFixed(2)} MB → ${(optimizedFile.size / 1024 / 1024).toFixed(2)} MB`,
        optimizedFile.type
      );
    } catch (err) {
      if (!mountedRef.current) return;

      setError(
        err instanceof Error
          ? err.message
          : "ফাইল প্রসেস করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      input.value = "";

      processingRef.current = false;

      if (mountedRef.current) {
        setProcessing(null);
      }
    }
  };

  const removeFile = (field: DocumentField) => {
    if (processingRef.current) return;

    const preview = previewsRef.current[field];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreviews((previous) => {
      const next = { ...previous };
      delete next[field];

      previewsRef.current = next;
      return next;
    });

    onChange({
      ...data,
      [field]: null,
    });

    setError(null);
  };

  const renderUpload = (
    field: DocumentField,
    label: string,
    placeholder: string
  ) => {
    const file = data[field];
    const preview = previews[field];

    return (
      <div className="mt-2 space-y-2">
        <label className={uploadClass}>
          <Upload size={16} />

          <span className="truncate">
            {processing === field
              ? "ফাইল কমপ্রেস হচ্ছে..."
              : file?.name || placeholder}
          </span>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            disabled={processing !== null}
            className="hidden"
            onChange={(event) =>
              handleFileChange(event, field, label)
            }
          />
        </label>

        {preview && (
          <div className="relative w-fit">
            <img
              src={preview}
              alt={`${label} preview`}
              className="h-32 max-w-full rounded-lg border border-slate-200 object-contain"
            />

            <button
              type="button"
              onClick={() => removeFile(field)}
              disabled={processing !== null}
              aria-label={`${label} সরান`}
              className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white disabled:opacity-50"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {file && !preview && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <ImageIcon size={15} />

            <span>
              PDF • {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>

            <button
              type="button"
              onClick={() => removeFile(field)}
              disabled={processing !== null}
              className="text-red-600 hover:underline disabled:opacity-50"
            >
              সরান
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 text-left">
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {/* NID Section */}
      <section className="space-y-4 rounded-xl border border-slate-200 p-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            NID Verification
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            জাতীয় পরিচয়পত্রের সামনের ও পেছনের ছবি আলাদাভাবে দিন।
          </p>
        </div>

        <div>
          <label className={labelClass}>
            NID Number <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={data.nidNumber}
            onChange={(event) =>
              onChange({
                ...data,
                nidNumber: event.target.value,
              })
            }
            placeholder="National ID number"
            autoComplete="off"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            NID Front Image{" "}
            <span className="text-red-500">*</span>
          </label>

          {renderUpload(
            "nidFrontDocument",
            "NID Front",
            "সামনের পাশের ছবি আপলোড করুন"
          )}
        </div>

        <div>
          <label className={labelClass}>
            NID Back Image{" "}
            <span className="text-red-500">*</span>
          </label>

          {renderUpload(
            "nidBackDocument",
            "NID Back",
            "পেছনের পাশের ছবি আপলোড করুন"
          )}
        </div>
      </section>

      {/* Trade License Section */}
      <section>
        <label className={labelClass}>
          Trade License Number
        </label>

        <input
          type="text"
          value={data.tradeLicenseNumber}
          onChange={(event) =>
            onChange({
              ...data,
              tradeLicenseNumber: event.target.value,
            })
          }
          placeholder="Trade License number (if available)"
          className={inputClass}
        />

        {renderUpload(
          "tradeLicenseDocument",
          "Trade License",
          "Trade License-এর ছবি বা PDF"
        )}
      </section>

      {/* TIN Section */}
      <section>
        <label className={labelClass}>TIN Number</label>

        <input
          type="text"
          value={data.tinNumber}
          onChange={(event) =>
            onChange({
              ...data,
              tinNumber: event.target.value,
            })
          }
          placeholder="TIN certificate number"
          className={inputClass}
        />

        {renderUpload(
          "tinDocument",
          "TIN",
          "TIN Certificate-এর ছবি বা PDF"
        )}
      </section>
    </div>
  );
}
