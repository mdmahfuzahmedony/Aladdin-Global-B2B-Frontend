import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

export function FooterSocial() {
  const { t } = useLanguage();

  const socials = [
    {
      name: "Facebook",
      icon: <FaFacebookF size={15} />,
      link: "https://facebook.com",
      hoverClass: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:shadow-blue-200",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn size={15} />,
      link: "https://linkedin.com",
      hoverClass: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:shadow-blue-200",
    },
    {
      name: "YouTube",
      icon: <FaYoutube size={16} />,
      link: "https://youtube.com",
      hoverClass: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:shadow-red-200",
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={15} />,
      link: "https://instagram.com",
      hoverClass: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:text-white hover:shadow-pink-200",
    },
  ];

  return (
    <div className="flex flex-col gap-2.5 pt-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-[#12233F]">
          {t("followUs") || "Follow Us"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {socials.map((item) => (
          <a
            key={item.name}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            title={item.name}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${item.hoverClass}`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
}