"use client";
import Link from "next/link";

export default function ShippingPage() {
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
      <section className="pt-32 pb-16 px-4 md:px-12 text-center relative overflow-hidden bg-sc-cyan border-b-4 border-black">
        <div className="absolute bottom-4 left-4 sc-blob w-24 h-24 bg-sc-yellow border-4 border-black animate-funky opacity-80" />
        <div className="absolute top-6 right-6 sc-blob w-20 h-20 bg-sc-pink border-4 border-black animate-funky opacity-80" style={{ animationDelay: "1s" }} />
        <div className="relative z-10">
          <h1 className="font-heading text-[clamp(36px,8vw,100px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">
            SHIPPING &<br />DELIVERY
          </h1>
          <p className="sc-slogan text-sc-purple-dark text-xl md:text-2xl">All across India. Every pin code.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-12 max-w-[900px] mx-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {[
            { emoji: "📦", title: "Shipping Partner", value: "India Post Speed Post", sub: "Government postal service" },
            { emoji: "⏱️", title: "Delivery Time", value: "3–7 Business Days", sub: "After dispatch" },
            { emoji: "💰", title: "Shipping Charge", value: "₹60 Flat", sub: "Free above ₹300" },
          ].map((card, i) => (
            <div key={i} className="sc-card sc-btn-push text-center">
              <div className="text-4xl mb-2">{card.emoji}</div>
              <p className="font-sans font-bold text-gray-500 text-xs uppercase tracking-wider mb-1">{card.title}</p>
              <p className="font-heading text-2xl text-sc-purple mb-1">{card.value}</p>
              <p className="font-sans text-gray-500 text-sm">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Shipping Partner Detail */}
        <div className="sc-card mb-8">
          <h2 className="font-heading text-3xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">Our Shipping Partner</h2>
          <p className="font-sans text-gray-700 leading-relaxed mb-4">
            All SCANOVA orders are shipped via <strong>India Post Speed Post</strong> — India&apos;s official government postal service. India Post reaches every pin code in the country, including rural and remote areas, making it the most reliable option for nationwide delivery.
          </p>
          <div className="bg-sc-yellow border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-sans font-bold text-black text-sm">
              📌 India Post Speed Post is tracked end-to-end. Once your order is dispatched, you will receive a consignment number to track your parcel in real time.
            </p>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="sc-card mb-8">
          <h2 className="font-heading text-3xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">Shipping Charges</h2>
          <div className="border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid grid-cols-2 bg-black text-white">
              <div className="font-heading text-lg px-6 py-3">Order Value</div>
              <div className="font-heading text-lg px-6 py-3">Shipping Fee</div>
            </div>
            <div className="grid grid-cols-2 bg-white border-t-4 border-black">
              <div className="font-sans font-bold px-6 py-4 text-black border-r-4 border-black">Below ₹300</div>
              <div className="font-sans font-bold px-6 py-4 text-black">₹60</div>
            </div>
            <div className="grid grid-cols-2 bg-sc-yellow border-t-4 border-black">
              <div className="font-sans font-bold px-6 py-4 text-black border-r-4 border-black">₹300 and above</div>
              <div className="font-sans font-bold px-6 py-4 text-black">FREE 🎉</div>
            </div>
          </div>
          <p className="font-sans text-gray-500 text-sm mt-3">* Shipping charges are displayed at checkout before payment.</p>
        </div>

        {/* Delivery Timeline */}
        <div className="sc-card mb-8">
          <h2 className="font-heading text-3xl text-sc-purple mb-6 [-webkit-text-stroke:1px_black]">Delivery Timeline</h2>
          <div className="flex flex-col gap-4">
            {[
              { day: "Day 0", label: "Order Placed", desc: "Your order is confirmed and enters processing." },
              { day: "Day 1–2", label: "Processing & Dispatch", desc: "We prepare and hand over your parcel to India Post Speed Post." },
              { day: "Day 3–7", label: "In Transit", desc: "India Post delivers to your address. Exact timeline depends on your pin code." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="bg-sc-purple border-4 border-black rounded-xl px-3 py-2 text-center min-w-[80px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-heading text-white text-sm">{step.day}</p>
                </div>
                <div>
                  <p className="font-sans font-bold text-black text-base">{step.label}</p>
                  <p className="font-sans text-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-gray-500 text-sm mt-6">
            * Business days exclude Sundays and national public holidays. Delivery timelines are estimates and may vary due to factors beyond our control (e.g. remote locations, natural disruptions, postal delays).
          </p>
        </div>

        {/* Geographic Coverage */}
        <div className="sc-card mb-8">
          <h2 className="font-heading text-3xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">Where We Ship</h2>
          <p className="font-sans text-gray-700 leading-relaxed mb-4">
            We currently ship <strong>within India only</strong>. India Post Speed Post covers all 6-digit pin codes across all states and union territories in India, including J&K, Northeast India, Andaman & Nicobar Islands, and Lakshadweep.
          </p>
          <p className="font-sans text-gray-700">
            International shipping is not available at this time. If you&apos;re based outside India, stay tuned for future updates.
          </p>
        </div>

        {/* Address Note */}
        <div className="bg-sc-pink border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h3 className="font-heading text-2xl text-white [-webkit-text-stroke:1px_black] mb-3">⚠️ Important: Address Accuracy</h3>
          <p className="font-sans font-bold text-black leading-relaxed">
            Please double-check your shipping address before placing the order. SCANOVA is not responsible for non-delivery due to incorrect or incomplete addresses provided by the customer. If you notice an error, email <a href="mailto:support@scanova.in" className="underline">support@scanova.in</a> within 12 hours of order placement.
          </p>
        </div>

        {/* Track CTA */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="font-heading text-3xl text-black mb-3">Track Your Order</h2>
          <p className="font-sans font-bold text-gray-800 mb-6">Once dispatched, use your India Post consignment number to track your parcel.</p>
          <Link href="/track-order" className="bg-black text-white border-4 border-black rounded-xl px-10 py-3 font-heading text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push inline-block uppercase">
            Track My Order →
          </Link>
        </div>
      </section>
    </div>
  );
}
