export type AffiliateSocialPlatform =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "YOUTUBE"
  | "TIKTOK"
  | "WEBSITE"
  | "OTHER"
  | "";

export type AffiliatePayoutMethod =
  | "BKASH"
  | "NAGAD"
  | "BANK"
  | "";

export type AffiliateSignupData = {
  // STEP 1 — Personal Information
  fullName: string;
  email: string;
  phone: string;

  // STEP 2 — Social Platform
  socialPlatform: AffiliateSocialPlatform;
  socialMediaLink: string;
  followerCount: string;

  // STEP 3 — Affiliate / Audience Information
  promotionCategory: string;
  promotionMethod: string;
  audienceDescription: string;

  // STEP 4 — Payout Information
  payoutMethod: AffiliatePayoutMethod;
  payoutAccountName: string;
  payoutAccountNumber: string;
  payoutMobileNumber: string;

  // STEP 5 — Security
  password: string;
  confirmPassword: string;

  // OTP
  otp: string;
};