import { FooterAccount } from "../Footer/FooterAccount";
import { FooterBrand } from "../Footer/FooterBrand";
import { FooterLinks } from "../Footer/FooterLinks";
import { FooterPayment } from "../Footer/FooterPayment";
import { FooterSupport } from "../Footer/FooterSupport";
import { FooterLegal } from "../Footer/FooterLegal";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      {/* Main Container - Reduced vertical padding for compact look */}
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-0 xl:px-0">
        
        {/* Main Footer Grid - Adjusted gap for less spacing */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:gap-6 xl:gap-8">
          
          {/* Brand */}
          <div className="min-w-0">
            <FooterBrand />
          </div>

          {/* Company Links */}
          <div className="min-w-0">
            <FooterLinks />
          </div>

          {/* Account */}
          <div className="min-w-0">
            <FooterAccount />
          </div>

          {/* Support and Payment */}
          <div className="flex min-w-0 flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <FooterSupport />

            <div className="border-t border-slate-200 pt-4">
              <FooterPayment />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-200 pt-5 sm:mt-10 sm:pt-6">
          <FooterLegal />
        </div>
      </div>
    </footer>
  );
}