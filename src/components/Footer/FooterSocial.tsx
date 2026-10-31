import { ExternalLink, Share2, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function FooterSocial() {
  const { t } = useLanguage();
  const socials = [
    { name: "Facebook", code: "FB", link: "https://facebook.com" },
    { name: "LinkedIn", code: "LN", link: "https://linkedin.com" },
    { name: "Youtube", code: "YT", link: "https://youtube.com" },
  ];

  return (
    <div className="flex flex-col gap-2 pt-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-[#12233F]">{t("followUs")}</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {socials.map((item) => (
          <a 
            key={item.name} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-[#12233F] hover:text-white"
          >
            <span className="text-[10px] font-bold opacity-70">
              {item.code}
            </span>
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}