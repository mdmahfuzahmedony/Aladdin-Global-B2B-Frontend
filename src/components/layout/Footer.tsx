import { FooterAccount } from "../Footer/FooterAccount";
import { FooterBrand } from "../Footer/FooterBrand";
import { FooterLinks } from "../Footer/FooterLinks";
import { FooterPayment } from "../Footer/FooterPayment";
import { FooterSupport } from "../Footer/FooterSupport";
import { FooterSocial } from "../Footer/FooterSocial";
import { FooterLegal } from "../Footer/FooterLegal";


export function Footer() {
  return (
    <footer className="bg-brand-navy text-white overflow-hidden">
      {/* মেইন কন্টেইনার - আপনার আগের 1440px র‍্যাপার ব্যবহার করা হয়েছে */}
      <div className="mx-auto max-w-[1440px] px-8 pt-16 pb-8 lg:px-12">
        
        {/* ৪ কলামের মেইন গ্রিড */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          
          {/* ১. ব্র্যান্ড কলাম (লোগো, কন্টাক্ট ইনফো) */}
          <FooterBrand />

          {/* ২. অ্যাবাউট কোম্পানি কলাম */}
          <FooterLinks />

          {/* ৩. মাই অ্যাকাউন্ট কলাম */}
          <FooterAccount />

          {/* ৪. কাস্টমার সার্ভিস + পেমেন্ট + ফলো আস (সব একসাথে এই কলামে) */}
          <div className="flex flex-col gap-10">
            {/* কাস্টমার সার্ভিস লিঙ্কগুলো */}
            <FooterSupport />
            
            {/* পেমেন্ট অপশনগুলো ঠিক এর নিচেই */}
            <div className="flex flex-col gap-6">
              <FooterPayment />
              
        
            </div>
          </div>

        </div>

        {/* নিচের কপিরাইট অংশ */}
        <div className="mt-16">
          <FooterLegal />
        </div>
      </div>
    </footer>
  );
}