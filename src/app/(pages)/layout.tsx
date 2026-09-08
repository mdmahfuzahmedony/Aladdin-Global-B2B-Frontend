import { Footer } from "@/components/layout/Footer/Footer";



export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
   

      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <Footer />
    </div>
  );
}