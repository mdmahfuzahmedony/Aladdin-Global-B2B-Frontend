import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";
import { CompareProvider } from "../context/CompareContext";
import { LanguageProvider } from "../context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Aladdin Global B2B | Verified Wholesale Marketplace",
  description:
    "Direct sourcing from manufacturers across Bangladesh. Reliable and transparent B2B platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get("aladin_language")?.value;
  const initialLanguage = savedLanguage === "bn" ? "bn" : "en";

  return (
    <html lang={initialLanguage === "bn" ? "bn" : "en"}>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <SiteSettingsProvider>
          <LanguageProvider initialLanguage={initialLanguage}>
            <CompareProvider>
              {children}

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </CompareProvider>
          </LanguageProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}