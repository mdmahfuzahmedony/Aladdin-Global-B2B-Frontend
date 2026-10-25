export type WholesalerSignupData = {
  fullName: string;
  email: string;
  phone: string;

  businessName: string;
  businessType: string;
  businessCategory: string;

  address: string;
  city: string;
  district: string;
  postalCode: string;

  interestedCategories: string[];
  monthlyPurchaseVolume: string;
  preferredPaymentMethod: string;
  preferredDeliveryLocation: string;

  tradeLicenseNumber: string;
  tradeLicenseDocumentUrl: string;

  password: string;
  confirmPassword: string;
};