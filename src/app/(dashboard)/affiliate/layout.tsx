import { AffiliateNavbar } from "@/components/navbar/affiliate-navbar";
import { AffiliateSidebar } from "@/components/sidebar/affiliate-sidebar";


export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <AffiliateSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AffiliateNavbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}