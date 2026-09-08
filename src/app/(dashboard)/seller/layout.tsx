import { SellerSidebar } from "@/components/sidebar/seller-sidebar";
import { SellerNavbar } from '@/components/navbar/seller-navbar';


        


export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <SellerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SellerNavbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}