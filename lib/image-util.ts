const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Extracts a valid and reachable image URL from various data formats:
 * - string URL (http://, https://, data:, blob:)
 * - relative path (/uploads/...)
 * - object with `url` field
 * - array of strings or objects (returns first valid URL)
 */
export function getValidImageUrl(input: any): string {
  if (!input) return "";

  // If array is passed, try the first item
  if (Array.isArray(input)) {
    for (const item of input) {
      const resolved = getValidImageUrl(item);
      if (resolved) return resolved;
    }
    return "";
  }

  // If object is passed, extract url property
  let url: any = input;
  if (typeof input === "object" && input !== null) {
    url = input.url || input.src || input.image || input.productImage || "";
  }

  if (typeof url !== "string") return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  return `${API_BASE_URL}/${trimmed}`;
}
