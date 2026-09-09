"use client"; // যদি লেআউটে স্টেট বা ইন্টারঅ্যাকশন থাকে
import { Footer } from "@/components/layout/Footer"; // সঠিক পাথ সেট করা হয়েছে
import { MainNavbar } from "@/components/layout/Navbar";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      {/* এখানে আপনার হেডার থাকতে পারে */}
      <MainNavbar />
      
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* এখন আপনার তৈরি করা প্রিমিয়াম ফুটার এখানে কাজ করবে */}
      <Footer />
    </div>
  );
}