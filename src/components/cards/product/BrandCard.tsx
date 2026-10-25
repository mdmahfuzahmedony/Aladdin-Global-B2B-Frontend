"use client";

export type BrandItem = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status?: string;
};

export default function BrandCard({
  brand,
}: {
  brand: BrandItem;
}) {
  console.log("BRAND DATA:", brand);
  console.log("BRAND LOGO:", brand.logo);

  return (
    <a
      href={`/brands/${brand.slug}`}
      className="group flex shrink-0 flex-col items-center transition hover:-translate-y-1"
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 shadow-inner transition group-hover:bg-amber-50 group-hover:shadow">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-10 w-10 object-contain"
            onError={(e) => {
              console.error(
                "BRAND IMAGE FAILED:",
                brand.logo
              );

              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-sm font-bold text-slate-400">
            {brand.name.charAt(0)}
          </span>
        )}
      </div>

      <span className="mt-2 text-xs font-semibold text-slate-700 group-hover:text-amber-600">
        {brand.name}
      </span>
    </a>
  );
}