import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://aladdin-global-b2-b-backend-3c9f.vercel.app",
  },
};

export default nextConfig;
