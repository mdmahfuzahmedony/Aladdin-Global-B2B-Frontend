import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google"; // ফন্ট যোগ করা হলো
import "./globals.css"; // সিএসএস অবশ্যই সবার উপরে থাকবে
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ১. প্রিমিয়াম ফন্ট কনফিগারেশন
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["600", "700", "800"], 
  subsets: ["latin"], 
  variable: "--font-poppins" 
});

// ২. মেটাডাটা (এসইও এর জন্য জরুরি)
export const metadata: Metadata = {
  title: "Aladdin Global B2B | Verified Wholesale Marketplace",
  description: "Direct sourcing from manufacturers across Bangladesh. Reliable and transparent B2B platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        
        {/* মেইন কন্টেন্ট */}
        {children}

        {/* টোস্ট নোটিফিকেশন সিস্টেম */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true} // নতুন নোটিফিকেশন উপরে আসবে
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" 
        />
      </body>
    </html>
  );
}