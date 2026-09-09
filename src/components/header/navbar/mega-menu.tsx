"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ShoppingBag, 
  Shirt, 
  Home, 
  Sparkles, 
  BookOpen, 
  Smartphone, 
  Dumbbell, 
  Gamepad2, 
  Gift, 
  Car, 
  Cpu, 
  Code, 
  Plane, 
  Grid,
  ArrowRight
} from "lucide-react";

interface Props {
  onClose: () => void;
}

const categoriesData = [
  {
    id: "grocery-pet",
    name: "Grocery & Pet care",
    icon: ShoppingBag,
    subcategories: ["Rice & Flour", "Oils & Ghee", "Spices", "Pet Food", "Pet Accessories"]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    subcategories: ["Men's Wear", "Women's Wear", "Kids Fashion", "Shoes", "Bags"]
  },
  {
    id: "home-living",
    name: "Home & Living",
    icon: Home,
    subcategories: ["Furniture", "Kitchenware", "Bedding", "Home Decor", "Lighting"]
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    icon: Sparkles,
    subcategories: ["Skincare", "Cosmetics", "Haircare", "Personal Care"]
  },
  {
    id: "books-stationery",
    name: "Books & Stationery",
    icon: BookOpen,
    subcategories: ["Academic Books", "Fiction", "Office Supplies", "Writing Gear"]
  },
  {
    id: "electrical-electronics",
    name: "Electrical & Electronics",
    icon: Smartphone,
    subcategories: ["Mobile Phones", "Laptops", "Appliances", "Cables"]
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    icon: Dumbbell,
    subcategories: ["Gym Gear", "Football", "Cricket", "Yoga Mats"]
  },
  {
    id: "toys-games",
    name: "Toys & Games",
    icon: Gamepad2,
    subcategories: ["Board Games", "Remote Toys", "Soft Toys", "Educational"]
  },
  {
    id: "gifts-crafts",
    name: "Gifts & Crafts",
    icon: Gift,
    subcategories: ["Gift Boxes", "Party Decor", "Handmade", "Festive"]
  },
  {
    id: "automotive-motorcycles",
    name: "Automotive & Motorcycles",
    icon: Car,
    subcategories: ["Car Parts", "Tyres", "Lubricants", "Helmets"]
  },
  {
    id: "industrial-machinery",
    name: "Industrial & Machinery",
    icon: Cpu,
    subcategories: ["Tools", "Safety Gear", "Machinery", "Packaging"]
  },
  {
    id: "software-service",
    name: "Software & Service",
    icon: Code,
    subcategories: ["Cloud Hosting", "IT Support", "Software Licenses"]
  },
  {
    id: "hotel-travel",
    name: "Hotel & Travel",
    icon: Plane,
    subcategories: ["Booking", "Travel Gear", "Luggage", "Tour Packages"]
  },
  {
    id: "more-categories",
    name: "More Categories",
    icon: Grid,
    subcategories: ["Vehicles", "Property", "Phones & Tablets", "Electronics", "Home, Furniture & Appliance", "Fashion"]
  }
];

export const MegaMenu: React.FC<Props> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);

  return (
    /* z-[9999] এবং shadow-2xl নিশ্চিত করবে এটি সবার উপরে ভেসে থাকবে */
    <div className="absolute left-0 top-full mt-2 w-[850px] bg-white text-slate-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden z-[9999] flex h-[460px]">
      
      {/* Left Sidebar Category List */}
      <div className="w-[260px] bg-slate-50 border-r border-slate-200 p-2 overflow-y-auto space-y-1 shrink-0">
        {categoriesData.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory.id === cat.id;

          return (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat)}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-amber-600"}`} />
                <span className="truncate">{cat.name}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
            </button>
          );
        })}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between bg-white overflow-y-auto">
        <div>
          {/* Active Category Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <activeCategory.icon className="w-5 h-5 text-amber-500" />
              {activeCategory.name}
            </h3>
            <Link
              href={`/categories?cat=${encodeURIComponent(activeCategory.name)}`}
              onClick={onClose}
              className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
            >
              Explore Category <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subcategories Grid List */}
          <div>
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Subcategories</h4>
            <div className="grid grid-cols-2 gap-3">
              {activeCategory.subcategories.map((sub, idx) => (
                <Link
                  key={idx}
                  href={`/products?category=${encodeURIComponent(activeCategory.name)}&sub=${encodeURIComponent(sub)}`}
                  onClick={onClose}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-medium text-slate-800 group-hover:text-amber-700">{sub}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Aladdin Wholesale Hub</p>
            <h4 className="text-xs font-bold text-slate-200">Get Direct Factory Prices</h4>
          </div>
          <Link
            href="/rfq"
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Submit RFQ
          </Link>
        </div>

      </div>
    </div>
  );
};