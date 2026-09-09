"use client";
// এখানে শুধুমাত্র সেই আইকনগুলো আছে যা আপনার লাইব্রেরিতে ১০০% কাজ করবে
import { Share2, ArrowUpRight, MessageSquare, ExternalLink, Globe, Hash } from "lucide-react";

export function FooterSocial() {
  const socials = [
    { name: "Facebook", code: "FB", link: "https://facebook.com" },
    { name: "LinkedIn", code: "LN", link: "https://linkedin.com" },
    { name: "Youtube", code: "YT", link: "https://youtube.com" },
  ];

  return (
    <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-5">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
         <div className="bg-brand-gold/10 p-1.5 rounded-md">
            <Share2 size={12} className="text-brand-gold" />
         </div>
         <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Global Connectivity</h6>
      </div>
      
      {/* Social Links List - No brand icons, strictly professional UI */}
      <div className="flex flex-col gap-2.5">
        {socials.map((item) => (
          <a 
            key={item.name} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full group py-1.5 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
               {/* এখানে ব্র্যান্ডের লোগোর বদলে তার কোড (যেমন LN, FB) গোল্ডেন কালারে দেখা যাবে */}
               <span className="text-[9px] font-black w-7 h-5 flex items-center justify-center rounded border border-white/10 text-white/20 group-hover:border-brand-gold group-hover:text-brand-gold transition-all bg-white/5">
                  {item.code}
               </span>
               <span className="text-[13px] font-semibold text-white/40 group-hover:text-white transition-colors">
                 {item.name}
               </span>
            </div>
            
            {/* ছোট্ট মডার্ন এ্যারো */}
            <div className="opacity-0 group-hover:opacity-100 transition-all">
               <ExternalLink size={11} className="text-brand-gold" />
            </div>
          </a>
        ))}
      </div>

      {/* Instant Help Section - কর্পোরেট ফিনিশিং */}
      <div className="mt-3 flex items-center gap-4 bg-brand-navy-light/30 p-3 rounded-xl border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer">
         <Globe size={16} className="text-brand-gold animate-pulse" />
         <div>
            <p className="text-[11px] font-bold text-white uppercase tracking-tighter">Support 24/7</p>
            <p className="text-[10px] text-white/30">Connect Now</p>
         </div>
      </div>
    </div>
  );
}