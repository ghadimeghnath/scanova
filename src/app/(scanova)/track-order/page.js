"use client";
import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [consignment, setConsignment] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const handleTrack = () => {
    if (!consignment.trim()) return;
    // India Post tracking URL
    const trackingUrl = `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignment.aspx`;
    window.open(trackingUrl, "_blank", "noopener,noreferrer");
  };

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
      <section className="pt-32 pb-16 px-4 md:px-12 text-center relative overflow-hidden bg-sc-purple border-b-4 border-black">
        <div className="absolute top-6 left-6 sc-blob w-28 h-28 bg-sc-cyan border-4 border-black animate-funky opacity-70" />
        <div className="absolute bottom-4 right-8 sc-blob w-20 h-20 bg-sc-yellow border-4 border-black animate-funky opacity-80" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10">
          <h1 className="font-heading text-[clamp(36px,8vw,100px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">
            TRACK<br />MY ORDER
          </h1>
          <p className="sc-slogan text-sc-yellow text-xl md:text-2xl">Real-time tracking via India Post.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-12 max-w-[700px] mx-auto">
        {/* Main Tracker Card */}
        <div className="sc-card mb-10">
          <h2 className="font-heading text-3xl text-sc-purple mb-2 [-webkit-text-stroke:1px_black]">Enter Your Tracking Details</h2>
          <p className="font-sans text-gray-600 mb-8 leading-relaxed">
            Your India Post consignment number is shared when your order is dispatched. Enter it below to be taken directly to India Post&apos;s tracking portal.
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="font-sans font-bold text-black text-sm uppercase tracking-wider block mb-2">
                India Post Consignment Number *
              </label>
              <input
                type="text"
                value={consignment}
                onChange={(e) => setConsignment(e.target.value.toUpperCase())}
                placeholder="e.g. EW123456789IN"
                className="w-full border-4 border-black rounded-xl px-5 py-4 font-sans font-bold text-black text-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(159,122,234,1)] focus:border-sc-purple outline-none transition-all tracking-widest"
              />
              <p className="font-sans text-gray-500 text-xs mt-2">
                India Post Speed Post consignment numbers are typically 13 characters (e.g. EW123456789IN).
              </p>
            </div>

            <div>
              <label className="font-sans font-bold text-black text-sm uppercase tracking-wider block mb-2">
                SCANOVA Order Number (optional)
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="e.g. SCNV-00001"
                className="w-full border-4 border-black rounded-xl px-5 py-4 font-sans font-bold text-black text-lg bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(159,122,234,1)] focus:border-sc-purple outline-none transition-all tracking-widest"
              />
            </div>

            <button
              onClick={handleTrack}
              disabled={!consignment.trim()}
              className={`bg-sc-yellow border-4 border-black rounded-xl px-8 py-4 font-heading text-2xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all w-full
                ${consignment.trim()
                  ? "sc-btn-push cursor-pointer hover:bg-sc-cyan active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "opacity-50 cursor-not-allowed"
                }`}
            >
              Track on India Post ↗
            </button>

            <p className="font-sans text-gray-500 text-xs text-center">
              Clicking &quot;Track on India Post&quot; will open the official India Post tracking portal in a new tab.
            </p>
          </div>
        </div>

        {/* Or direct link */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 text-center">
          <p className="font-sans font-bold text-black mb-3">Prefer to go directly to India Post?</p>
          <a
            href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/TrackConsignment.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white border-4 border-black rounded-xl px-8 py-3 font-heading text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push inline-block uppercase"
          >
            Open India Post Tracking →
          </a>
        </div>

        {/* How to find consignment number */}
        <div className="sc-card mb-8">
          <h2 className="font-heading text-2xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">How to Find Your Consignment Number</h2>
          <div className="flex flex-col gap-4">
            {[
              { step: "1", text: "After your order is dispatched, we will update your order status to 'Shipped'." },
              { step: "2", text: "Your India Post consignment number will be available on your Order Confirmation page." },
              { step: "3", text: "If you can't find it, email support@scanova.in with your SCANOVA order number (e.g. SCNV-00001)." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 items-start">
                <div className="bg-sc-purple border-4 border-black rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-heading text-white text-sm">{s.step}</span>
                </div>
                <p className="font-sans text-gray-700 leading-relaxed pt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Timeline reference */}
        <div className="sc-card mb-8">
          <h2 className="font-heading text-2xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">Expected Delivery Time</h2>
          <p className="font-sans text-gray-700 leading-relaxed">
            India Post Speed Post typically delivers within <strong>3–7 business days</strong> from the date of dispatch. If your tracking shows no movement for more than 7 business days, please contact us at <a href="mailto:support@scanova.in" className="font-bold text-sc-purple underline">support@scanova.in</a>.
          </p>
        </div>

        {/* No delivery note */}
        <div className="bg-sc-pink border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-heading text-xl text-white [-webkit-text-stroke:1px_black] mb-2">⚠️ Didn't receive your order?</h3>
          <p className="font-sans font-bold text-black leading-relaxed">
            If your tracking shows &quot;Delivered&quot; but you haven&apos;t received the parcel, please contact India Post at your local post office and email us at <a href="mailto:support@scanova.in" className="underline">support@scanova.in</a> with your consignment number. We will assist you in raising a complaint.
          </p>
        </div>
      </section>

    </div>
  );
}
