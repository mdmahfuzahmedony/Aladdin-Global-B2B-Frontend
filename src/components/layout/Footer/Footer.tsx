import { FooterBrand } from "./FooterBrand";
import { FooterLinks } from "./FooterLinks";
import { FooterAccount } from "./FooterAccount";
import { FooterSupport } from "./FooterSupport";
import { FooterPayment } from "./FooterPayment";
import { FooterLegal } from "./FooterLegal";

export function Footer() {
  return (
    <footer className="bg-[#122746] text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10">

        {/* Main Footer */}
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          <FooterBrand />

          <FooterLinks />

          <FooterAccount />

          <FooterSupport />

        </div>

        {/* Payment */}
        <FooterPayment />

        {/* Copyright */}
        <FooterLegal />

      </div>
    </footer>
  );
}