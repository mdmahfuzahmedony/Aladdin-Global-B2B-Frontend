/**
 * Chat Security & Off-Platform Leakage Prevention
 * Pure high-performance regex logic — No expensive external AI API required!
 */

// Convert Bengali digits (০-৯) to English digits (0-9)
export function normalizeBengaliDigits(text: string): string {
  const bnToEn: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return text.replace(/[০-৯]/g, (char) => bnToEn[char] || char);
}

export interface MessageSecurityCheck {
  originalText: string;
  filteredText: string;
  hasSensitiveData: boolean;
  sensitiveType?: "PHONE" | "EMAIL" | "EXTERNAL_LINK";
  isSuspicious: boolean;
  suspiciousReasons: string[];
  warningMessage?: string;
}

// Suspicious keywords that indicate attempting off-platform transaction
const SUSPICIOUS_KEYWORDS = [
  "বিকাশ",
  "নগদ",
  "রকেট",
  "কল দিন",
  "কল করুন",
  "ফোন দিন",
  "হোয়াটসঅ্যাপ",
  "হোয়াটসঅ্যাপ",
  "ব্যক্তিগত",
  "পার্সোনাল",
  "বাইরে কথা বলি",
  "বাইরে লেনদেন",
  "সরাসরি টাকা",
  "ক্যাশ পাঠান",
  "whatsapp",
  "call me",
  "call দিন",
  "bkash",
  "nagad",
  "rocket",
  "personal number",
  "offline deal",
  "direct payment",
  "telegram",
  "imo",
  "inbox me",
];

export function sanitizeAndInspectMessage(rawText: string): MessageSecurityCheck {
  const normalized = normalizeBengaliDigits(rawText);
  let filtered = rawText;
  let hasSensitiveData = false;
  let sensitiveType: "PHONE" | "EMAIL" | "EXTERNAL_LINK" | undefined;
  const suspiciousReasons: string[] = [];

  // 1. Phone number pattern (Bangladesh: 013-019XXXXXXXX, with or without +88, spaces, dots or dashes)
  // E.g., 01712345678, 018-1234-5678, 0 1 7 1 2..., +88017...
  const phoneRegex = /(?:\+?880\s*|0)?1[3-9](?:[\s.-]*\d){8}/g;

  if (phoneRegex.test(normalized)) {
    hasSensitiveData = true;
    sensitiveType = "PHONE";
    suspiciousReasons.push("ফোন নম্বর শেয়ার করার চেষ্টা");

    // Mask phone numbers in the text
    filtered = filtered.replace(
      /(?:\+?880\s*|0)?1[3-9](?:[\s.-]*[0-9০-৯]){8}/gi,
      "[🔒 ফোন নম্বর লুকানো হয়েছে]"
    );
  }

  // 2. Email address detection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  if (emailRegex.test(filtered)) {
    hasSensitiveData = true;
    sensitiveType = sensitiveType || "EMAIL";
    suspiciousReasons.push("ইমেইল অ্যাড্রেস শেয়ার করার চেষ্টা");
    filtered = filtered.replace(emailRegex, "[🔒 ইমেইল লুকানো হয়েছে]");
  }

  // 3. Social / Messaging links (WhatsApp, Telegram, Facebook)
  const linkRegex = /(?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com|t\.me|facebook\.com|fb\.me|m\.me)[^\s]*/gi;
  if (linkRegex.test(filtered)) {
    hasSensitiveData = true;
    sensitiveType = sensitiveType || "EXTERNAL_LINK";
    suspiciousReasons.push("সামাজিক মাধ্যম লিঙ্ক শেয়ার করার চেষ্টা");
    filtered = filtered.replace(linkRegex, "[🔒 এক্সটার্নাল লিঙ্ক লুকানো হয়েছে]");
  }

  // 4. Keyword check for suspicious offline transaction intention
  const lowerNorm = normalized.toLowerCase();
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (lowerNorm.includes(kw.toLowerCase())) {
      suspiciousReasons.push(`সন্দেহজনক শব্দ: "${kw}"`);
    }
  }

  const isSuspicious = hasSensitiveData || suspiciousReasons.length > 0;

  let warningMessage: string | undefined;
  if (hasSensitiveData) {
    warningMessage =
      "⚠️ প্ল্যাটফর্মের বাইরে ব্যক্তিগত ফোন নম্বর বা লিঙ্ক পাঠানো নিষিদ্ধ। আপনার বার্তাটি স্বয়ংক্রিয়ভাবে ফিল্টার করা হয়েছে।";
  }

  return {
    originalText: rawText,
    filteredText: filtered,
    hasSensitiveData,
    sensitiveType,
    isSuspicious,
    suspiciousReasons,
    warningMessage,
  };
}
