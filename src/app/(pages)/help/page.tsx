
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  UserRound,
  Store,
  ShieldCheck,
  Package,
  ChevronDown,
  MessageCircle,
  Search,
} from "lucide-react";

const topics = [
  {
    icon: ShoppingBag,
    title: "Orders & Shopping",
    description: "Help with placing orders and managing purchases.",
    questions: [
      {
        q: "How can I place an order?",
        a: "Browse products, select the product you need, choose the available options and add it to your cart. Then proceed to checkout to complete your order.",
      },
      {
        q: "How can I track my order?",
        a: "Visit your account's Orders section to check the latest available order status and tracking information.",
      },
      {
        q: "Can I cancel an order?",
        a: "Order cancellation depends on the current order status. Check your order details or contact customer support for assistance.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Information about payment options and transactions.",
    questions: [
      {
        q: "Which payment methods are available?",
        a: "Available payment methods are displayed during checkout. Options may vary depending on the order.",
      },
      {
        q: "What happens if my payment fails?",
        a: "Check your payment details and try again. If the amount was deducted but your order was not confirmed, contact support with your transaction information.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Find answers about delivery and shipping charges.",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Delivery time depends on the seller, delivery location and shipping method. Check the product or order details for available information.",
      },
      {
        q: "How are delivery charges calculated?",
        a: "Delivery charges may depend on the seller's delivery settings, product weight and destination.",
      },
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    description: "Get help with returns and refund-related questions.",
    questions: [
      {
        q: "How can I request a return?",
        a: "Check the applicable return policy and your order details. Contact customer support if you need help with a return request.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refund processing time depends on the payment method and the review of your request.",
      },
    ],
  },
  {
    icon: UserRound,
    title: "Account & Security",
    description: "Manage your profile and keep your account secure.",
    questions: [
      {
        q: "How can I update my account information?",
        a: "Sign in to your account and visit your profile or account settings to update the available information.",
      },
      {
        q: "What should I do if I forget my password?",
        a: "Use the password recovery option on the sign-in page and follow the instructions.",
      },
    ],
  },
  {
    icon: Store,
    title: "Seller & Vendor Support",
    description: "Guidance for sellers managing their stores.",
    questions: [
      {
        q: "How can I become a seller?",
        a: "Start the vendor registration process and provide the requested business and verification information.",
      },
      {
        q: "How can I manage my store?",
        a: "After signing in with your vendor account, visit your vendor dashboard to manage products, orders and store settings.",
      },
    ],
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group border-b border-slate-100 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium text-[#12233F]">
        <span>{question}</span>
        <ChevronDown
          size={18}
          className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
        />
      </summary>
      <p className="pb-4 pr-5 text-sm leading-7 text-slate-500">
        {answer}
      </p>
    </details>
  );
}

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#F5F6FA]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#12233F] px-4 py-16 text-white sm:py-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D6A419]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Headphones size={30} className="text-[#D6A419]" />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#D6A419]">
            Customer Support
          </p>

          <h1 className="text-3xl font-extrabold sm:text-5xl">
            How Can We Help You?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Welcome to the Aladdin Global Help Center. Find answers,
            explore support topics and get help with your shopping
            or seller account.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-xl">
            <Search size={20} className="shrink-0 text-slate-400" />
            <span className="text-sm text-slate-400">
              Browse the topics below to find answers...
            </span>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#D6A419]">
            Help & Support
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#12233F] sm:text-3xl">
            Explore Help Topics
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select a topic to find answers to frequently asked questions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D6A419]/60 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#12233F]/5">
                    <Icon size={23} className="text-[#D6A419]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#12233F]">
                      {topic.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {topic.questions.length} common questions
                    </p>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-6 text-slate-500">
                  {topic.description}
                </p>

                <div className="border-t border-slate-100">
                  {topic.questions.map((item) => (
                    <FAQItem
                      key={item.q}
                      question={item.q}
                      answer={item.a}
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Trust section */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <ShieldCheck className="text-emerald-600" size={25} />
            </div>
            <div>
              <h3 className="font-bold text-[#12233F]">
                Safe Shopping
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Always review product, seller and order details before
                completing a purchase.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Package className="text-[#D6A419]" size={25} />
            </div>
            <div>
              <h3 className="font-bold text-[#12233F]">
                Order Assistance
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Check your account for order updates and available
                purchase information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[#12233F] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <MessageCircle size={27} className="text-[#D6A419]" />
          </div>

          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Still Need Help?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
            We understand that you may need additional assistance.
            Visit our contact page to find the available ways to reach us.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#D6A419] px-6 py-3 text-sm font-bold text-[#12233F] transition hover:bg-amber-400"
          >
            Contact Us
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
