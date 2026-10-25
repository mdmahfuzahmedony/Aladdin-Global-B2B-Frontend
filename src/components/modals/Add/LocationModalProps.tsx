"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle2, Truck, Sparkles, AlertCircle } from "lucide-react";

interface LocationSelectorModalProps {
  isOpen: boolean;
  onSave: (locationData: { district: string; upazila: string; address: string }) => void;
}

export default function LocationSelectorModal({ isOpen, onSave }: LocationSelectorModalProps) {
  const [district, setDistrict] = useState("Jashore");
  const [upazila, setUpazila] = useState("Sharsha");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!address.trim()) {
      setError("Doya kore apnar nirdisto address ba shop-er jayga likhun (jemon: 3km radius-er modde).");
      return;
    }
    setError("");
    onSave({ district, upazila, address });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-brand-navy border border-amber-500/30 p-6 text-white shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mb-4 border border-amber-500/30">
            <MapPin className="h-7 w-7 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Upozela & 3km Radius Location Set Korun
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Kacha bajar ebong fresh product-er jonno seller-er **3km radius** er modde delivery nischit korte upojela ebong address din.
          </p>
        </div>

        {/* Benefits List */}
        <div className="my-5 space-y-2.5 rounded-xl bg-white/5 p-4 border border-white/10 text-xs">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-slate-300"><strong className="text-white">Hyperlocal Matching:</strong> Sharsha ba nirdisto upojelar local seller-der product dekhte paben.</p>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-slate-300"><strong className="text-white">3km Radius Check:</strong> Kacha mangsho ba sobji druto ebong nosto na hoye pouche jabe.</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide block mb-1">
                District:
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-amber-500"
              >
                <option value="Jashore">Jashore</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide block mb-1">
                Upazila:
              </label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-amber-500"
              >
                <option value="Sharsha">Sharsha (শার্শা)</option>
                <option value="Jashore Sadar">Jashore Sadar</option>
                <option value="Bagherpara">Bagherpara</option>
                <option value="Monirampur">Monirampur</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide block mb-1">
              Specific Area / Shop Address (For 3km Radius Check):
            </label>
            <input
              type="text"
              placeholder="Jemon: Navaron Bazar, Seller hub-er kase..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-amber-500 placeholder:text-slate-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-xl bg-amber-500 py-3 text-sm font-extrabold text-slate-950 transition-colors hover:bg-amber-600 shadow-lg cursor-pointer"
          >
            Location Confirm Korun & Browse Korun
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          * Jodi 3km-er bahire hon, tahoke kacha bajar order block ba blur dekhabe.
        </p>

      </div>
    </div> 
  );
}