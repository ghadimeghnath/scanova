"use client";
import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/scanova/Footer";

const faqs = [
  {
    category: "Orders & Payment",
    color: "bg-sc-yellow",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit/debit cards, net banking, and wallets via PhonePe Payment Gateway. Cash on Delivery (COD) is also available for eligible pin codes."
      },
      {
        q: "Is it safe to pay on SCANOVA?",
        a: "Yes. All payments are processed via PhonePe's secure payment gateway, which is PCI-DSS compliant. We do not store any card or payment details on our servers."
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes, once your order is placed successfully, you will see an order confirmation page with your order number (e.g. SCNV-00001). Save this number to track your order."
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 12 hours of placement by emailing support@scanova.in with your order number. Once the order is shipped, cancellation is not possible."
      },
      {
        q: "How are prices listed?",
        a: "All prices on SCANOVA are listed in Indian Rupees (₹) and are inclusive of all applicable taxes. Shipping charges (₹60) are added at checkout. Orders above ₹300 qualify for free shipping."
      },
    ]
  },
  {
    category: "Shipping & Delivery",
    color: "bg-sc-cyan",
    items: [
      {
        q: "How do you ship orders?",
        a: "All orders are shipped via India Post Speed Post. This is a government-operated postal service that delivers across all pin codes in India, including remote areas."
      },
      {
        q: "How long does delivery take?",
        a: "India Post Speed Post typically delivers within 3–7 business days after dispatch. Delivery timelines may vary slightly depending on your pin code and location."
      },
      {
        q: "How much does shipping cost?",
        a: "Shipping is ₹60 for all orders. Orders with a product total of ₹300 or above qualify for free shipping."
      },
      {
        q: "Do you ship outside India?",
        a: "Currently, we only ship within India. International shipping is not available at this time."
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you will receive an India Post consignment number. You can track your shipment at the India Post official tracking portal via our Track Order page."
      },
    ]
  },
  {
    category: "AR Experience",
    color: "bg-sc-purple",
    items: [
      {
        q: "Do I need to download an app to use the AR?",
        a: "No app needed at all! SCANOVA's AR experiences run entirely in your phone's browser. Just scan the QR code on your keychain or sticker and you're in."
      },
      {
        q: "Which phones support the AR experience?",
        a: "Any modern smartphone with a browser (Chrome, Safari, Firefox) and a working camera can run SCANOVA's AR. It works on both Android and iOS, including mid-range devices."
      },
      {
        q: "How do I claim my keychain AR experience?",
        a: "When you receive your keychain, scan the QR code on it. You'll be prompted to upload a personal photo and enter a message (up to 40 characters). Once submitted, your custom AR experience is live and can be revisited anytime by scanning the same QR code."
      },
      {
        q: "Can someone else see my AR experience?",
        a: "Yes — anyone who scans your QR code will see the AR experience. This is intentional; SCANOVA keychains are designed to be shared. Your photo and message will appear in the AR scene."
      },
      {
        q: "What if the AR doesn't load?",
        a: "Ensure your browser has camera permission granted. Try refreshing the page or using Chrome on Android / Safari on iOS. If the issue persists, contact us at support@scanova.in with your device model and browser."
      },
    ]
  },
  {
    category: "Returns & Refunds",
    color: "bg-sc-pink",
    items: [
      {
        q: "Do you accept returns?",
        a: "No. Due to our shipping partner (India Post), we are unable to accept product returns once an order is dispatched. Please review your order carefully before placing it."
      },
      {
        q: "What if I receive a damaged or defective product?",
        a: "We're sorry if this happened! Email us at support@scanova.in within 48 hours of delivery with your order number and clear photo/video proof of the damage. We will arrange a free replacement shipment for valid claims."
      },
      {
        q: "What if I receive the wrong item?",
        a: "If you received an item that does not match your order, email support@scanova.in within 48 hours of delivery with your order number and a photo. We'll send the correct item at no extra charge."
      },
      {
        q: "Are cash refunds available?",
        a: "Cash refunds are only issued in exceptional cases — for example, if we are unable to fulfill your order due to stock unavailability after payment. In all other cases, we offer a replacement or store credit."
      },
    ]
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${open ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-sc-yellow transition-colors text-left"
      >
        <span className="font-sans font-bold text-black text-base md:text-lg pr-4">{q}</span>
        <span className="font-heading text-2xl text-sc-purple flex-shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-6 py-4 bg-white border-t-4 border-black">
          <p className="font-sans text-gray-700 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-sc-pink selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-12">
          <Link href="/" className="font-heading text-2xl sm:text-3xl md:text-4xl text-sc-purple tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sc-btn-push inline-block">
            SCANOVA
          </Link>
          <Link href="/shop" className="font-sans font-bold text-black border-4 border-black rounded-full px-4 py-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push hover:bg-sc-yellow transition-colors text-sm md:text-base">
            Shop
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-12 text-center relative overflow-hidden border-b-4 border-black" style={{ backgroundColor: "var(--color-sc-purple)" }}>
        <div className="absolute top-6 right-6 sc-blob w-24 h-24 bg-sc-yellow border-4 border-black animate-funky" />
        <div className="relative z-10">
          <h1 className="font-heading text-[clamp(48px,10vw,120px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">FAQ</h1>
          <p className="sc-slogan text-sc-yellow text-xl md:text-2xl">Every question, answered honestly.</p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 px-4 md:px-12 max-w-[900px] mx-auto">
        {faqs.map((section, si) => (
          <div key={si} className="mb-14">
            <div className={`${section.color} border-4 border-black rounded-xl px-6 py-3 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 transform -rotate-1`}>
              <h2 className="font-heading text-2xl text-black">{section.category}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {section.items.map((item, ii) => (
                <FAQItem key={ii} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="font-heading text-3xl text-black mb-3">Still have questions?</h2>
          <p className="font-sans font-bold text-gray-800 mb-6">We&apos;re happy to help. Email us and we&apos;ll reply within 24–48 hours.</p>
          <Link href="/contact" className="bg-black text-white border-4 border-black rounded-xl px-8 py-3 font-heading text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push inline-block uppercase">
            Contact Us ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
