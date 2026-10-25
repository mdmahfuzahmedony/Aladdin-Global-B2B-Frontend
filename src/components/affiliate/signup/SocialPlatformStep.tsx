"use client";
import { toast } from "react-toastify";

import { Globe, Link as LinkIcon, Music2, Users } from "lucide-react";

import type {
  AffiliateSignupData,
  AffiliateSocialPlatform,
} from "@/app/(auth)/affiliate-signup/types/affiliate";

type SocialPlatformStepProps = {
  data: AffiliateSignupData;
  updateData: (data: Partial<AffiliateSignupData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const platforms: {
  value: AffiliateSocialPlatform;
  label: string;
  icon?: React.ReactNode;
}[] = [
  {
    value: "FACEBOOK",
    label: "Facebook",
    // icon: <Facebook size={20} />,
  },
  {
    value: "INSTAGRAM",
    label: "Instagram",
    // icon: <Instagram size={20} />,
  },
  {
    value: "YOUTUBE",
    label: "YouTube",
    // icon: <Youtube size={20} />,
  },
  {
    value: "TIKTOK",
    label: "TikTok",
    icon: <Music2 size={20} />,
  },
  {
    value: "WEBSITE",
    label: "Website",
    icon: <Globe size={20} />,
  },
  {
    value: "OTHER",
    label: "Other",
    icon: <LinkIcon size={20} />,
  },
];

export default function SocialPlatformStep({
  data,
  updateData,
  onNext,
  onBack,
}: SocialPlatformStepProps) {
  const handleNext = () => {
    if (!data.socialPlatform) {
      toast.warning("Please select your main platform.");
      return;
    }

    if (!data.socialMediaLink.trim()) {
      toast.warning("Please enter your profile or website link.");
      return;
    }

    onNext();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-amber-500">STEP 2</p>

        <h2 className="font-poppins text-2xl font-bold text-[#12233f]">
          Social Platform
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell us where you will promote Aladdin products.
        </p>
      </div>

      {/* PLATFORM */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          Main Promotion Platform
        </label>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {platforms.map((platform) => {
            const selected = data.socialPlatform === platform.value;

            return (
              <button
                key={platform.value}
                type="button"
                onClick={() =>
                  updateData({
                    socialPlatform: platform.value,
                  })
                }
                className={[
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  selected
                    ? "border-amber-500 bg-amber-50 text-amber-600 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-gray-50",
                ].join(" ")}
              >
                {platform.icon}

                <span className="text-sm font-semibold">{platform.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {/* LINK */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Profile / Website Link
          </label>

          <div className="relative">
            <LinkIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="url"
              value={data.socialMediaLink}
              onChange={(e) =>
                updateData({
                  socialMediaLink: e.target.value,
                })
              }
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        {/* FOLLOWERS */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Approximate Follower / Audience Count
          </label>

          <div className="relative">
            <Users
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="number"
              min="0"
              value={data.followerCount}
              onChange={(e) =>
                updateData({
                  followerCount: e.target.value,
                })
              }
              placeholder="e.g. 10000"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-amber-500 px-7 py-3 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
