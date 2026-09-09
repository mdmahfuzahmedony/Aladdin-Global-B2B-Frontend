"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Globe, User, ShoppingCart, Smartphone, ChevronDown, Menu } from "lucide-react";

import { AppDownloadDropdown } from "@/components/header/navbar/app-download-dropdown";
import { LanguageDropdown } from "@/components/header/navbar/language-dropdown";
import { AccountDropdown } from "@/components/header/navbar/account-dropdown";
import { MoreDropdown } from "@/components/header/navbar/more-dropdown";
import { MegaMenu } from "@/components/header/navbar/mega-menu";

export const MainNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<"app" | "lang" | "account" | "more" | "mega" | null>(null);
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("BDT");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (menu: "app" | "lang" | "account" | "more" | "mega") => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className="w-full bg-brand-navy text-white sticky top-0 z-[999] shadow-2xl border-b border-white/10" ref={dropdownRef}>
      
      {/* Top Strip (প্যাডিংpy-2.5 করা হয়েছে) */}
      <div className="bg-amber-500 text-slate-950 text-xs py-2.5 px-8 font-extrabold flex justify-between items-center tracking-wide">
        <span>TOP DEALS FOR YOU: UP TO 40% OFF ON WHOLESALE ORDERS</span>
        <span className="hidden md:inline bg-brand-navy text-amber-400 px-3 py-1 rounded-md text-[11px] font-semibold border border-amber-500/20">
          FREE Delivery on Bulk Orders over ৳ 50,000
        </span>
      </div>

      {/* Main Navbar Bar (প্যাডিং py-6 করা হয়েছে হাইট বাড়ানোর জন্য) */}
      <div className="max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between gap-10">
        
        {/* Logo Link */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-amber-500 text-slate-950 font-black text-2xl px-3.5 py-2 rounded-xl shadow-md">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-2xl leading-none tracking-tight text-white">
              Aladdin<span className="text-amber-500">.</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-300 uppercase tracking-widest mt-1 opacity-90">
              Global B2B Wholesale
            </p>
          </div>
        </Link>

        {/* Global Search Bar (উচ্চতা ও ভেতরের গ্যাপ বাড়ানো হয়েছে) */}
        <div className="hidden lg:flex flex-1 max-w-2xl items-center bg-white rounded-xl overflow-hidden border-2 border-slate-600 focus-within:border-amber-500 transition-all shadow-inner h-12">
          <input
            type="text"
            placeholder="Search for products, brands, or suppliers..."
            className="w-full px-5 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium h-full"
          />
          <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 h-full text-sm font-extrabold flex items-center gap-2 transition-colors shrink-0">
            <Search className="w-4 h-4 stroke-[2.5]" /> Search
          </button>
        </div>

        {/* Action Controls (আইটেমগুলোর মধ্যে গ্যাপ gap-8 করা হয়েছে) */}
        <div className="flex items-center gap-8 text-sm font-semibold relative shrink-0">
          
          {/* App Dropdown */}
          <div className="relative">
            <button onClick={() => toggleDropdown("app")} className="hidden md:flex items-center gap-3 hover:text-amber-400 transition-colors">
              <Smartphone className="w-6 h-6 text-amber-500" />
              <div className="text-left">
                <p className="text-[11px] text-slate-300 font-normal">Download the</p>
                <p className="font-bold leading-none flex items-center gap-1 text-sm text-white mt-0.5">
                  Aladdin App <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </p>
              </div>
            </button>
            {activeDropdown === "app" && <AppDownloadDropdown />}
          </div>

          <div className="h-8 w-px bg-white/15 hidden md:block" />

          {/* Language Dropdown */}
          <div className="relative">
            <button onClick={() => toggleDropdown("lang")} className="flex items-center gap-2 hover:text-amber-400 transition-colors py-2 text-sm text-slate-200">
              <Globe className="w-4.5 h-4.5 text-slate-300" />
              <span>{lang === "en" ? "English" : "বাংলা"} / {currency === "BDT" ? "৳" : "$"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {activeDropdown === "lang" && (
              <LanguageDropdown lang={lang} setLang={setLang} currency={currency} setCurrency={setCurrency} />
            )}
          </div>

          {/* Account Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("account")} 
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 px-5 py-2.5 rounded-xl border border-white/10 hover:border-amber-500 transition-all text-sm font-bold text-white"
            >
              <User className="w-4.5 h-4.5 text-amber-500" />
              <span>Sign In</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>
            {activeDropdown === "account" && <AccountDropdown onClose={() => setActiveDropdown(null)} />}
          </div>

          {/* Cart Link */}
          <Link href="/cart" className="flex items-center gap-2 hover:text-amber-400 transition-colors relative">
            <div className="relative p-1">
              <ShoppingCart className="w-6.5 h-6.5 text-white" />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-navy">
                0
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Category Navigation Strip (প্যাডিং py-3.5 করা হয়েছে) */}
      <div className="bg-black/20 border-t border-white/10 text-xs font-semibold relative z-10 overflow-visible backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-8 py-3.5 flex items-center justify-between relative overflow-visible">
          <div className="flex items-center gap-10 overflow-visible">
            
            {/* All Categories Button */}
            <div className="relative overflow-visible">
              <button
                onClick={() => toggleDropdown("mega")}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2.5 shrink-0 transition-colors shadow-md text-xs tracking-wide"
              >
                <Menu className="w-4 h-4 stroke-[2.5]" /> All Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Menu Dropdown */}
              {activeDropdown === "mega" && (
                <MegaMenu onClose={() => setActiveDropdown(null)} />
              )}
            </div>

            <Link href="/" className="text-slate-200 hover:text-amber-400 text-sm font-medium shrink-0 transition-colors">Home</Link>
            <Link href="/travel" className="text-slate-200 hover:text-amber-400 text-sm font-medium shrink-0 transition-colors">Travel</Link>
            
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => toggleDropdown("more")}
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-400 font-bold py-1 text-sm transition-colors"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {activeDropdown === "more" && <MoreDropdown onClose={() => setActiveDropdown(null)} />}
          </div>
        </div>
      </div>
    </header>
  );
};