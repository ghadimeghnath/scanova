"use client";
import Footer from "@/components/scanova/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-sc-pink selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-12">
          <Link href="/" className="font-heading text-2xl sm:text-3xl md:text-4xl text-sc-purple tracking-wide no-underline drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sc-btn-push inline-block">
            SCANOVA
          </Link>
          <div className="flex gap-3 sm:gap-4 items-center">
            <Link href="/shop" className="font-sans font-bold text-black border-4 border-black rounded-full px-4 py-2 md:px-6 md:py-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push hover:bg-sc-yellow transition-colors text-sm md:text-base">
              Shop
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-12 text-center relative overflow-hidden bg-sc-cyan border-b-4 border-black">
        <div className="absolute top-8 left-8 sc-blob w-32 h-32 bg-sc-yellow border-4 border-black animate-funky opacity-80" />
        <div className="absolute bottom-8 right-8 sc-blob w-24 h-24 bg-sc-pink border-4 border-black animate-funky opacity-80" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="bg-sc-yellow border-4 border-black rounded-full px-6 py-2 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2">
            <span className="font-heading text-black tracking-widest uppercase text-sm">Our Story</span>
          </div>
          <h1 className="font-heading text-[clamp(48px,10vw,120px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-6">
            ABOUT US
          </h1>
          <p className="sc-slogan text-sc-purple-dark text-2xl md:text-3xl bg-white px-6 py-4 border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
            Where physical meets digital. One scan at a time.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 md:px-12 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="sc-card sc-btn-push">
            <h2 className="font-heading text-3xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">Who We Are</h2>
            <p className="font-sans text-gray-800 text-lg leading-relaxed">
              SCANOVA is an AR-powered merchandise brand based in India. We create physical keychains and stickers embedded with QR codes that unlock personalized Augmented Reality experiences — no app download required.
            </p>
          </div>
          <div className="sc-card sc-btn-push" style={{ borderColor: "var(--color-sc-purple)" }}>
            <h2 className="font-heading text-3xl text-sc-pink mb-4 [-webkit-text-stroke:1px_black]">What We Do</h2>
            <p className="font-sans text-gray-800 text-lg leading-relaxed">
              We bridge the gap between physical merchandise and digital magic. Every SCANOVA product is a portal — scan the QR, upload your memory, and watch it come alive in 3D AR. No app. No friction. Just magic.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-sc-purple border-4 border-black rounded-2xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-16 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 sc-blob w-20 h-20 bg-sc-yellow border-4 border-black animate-funky opacity-60" />
          <h2 className="font-heading text-4xl md:text-5xl text-white [-webkit-text-stroke:2px_black] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 relative z-10">OUR MISSION</h2>
          <p className="font-sans font-bold text-white text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto relative z-10">
            To make every memory tangible. We believe the things you carry with you should do more than just exist — they should tell your story, hold your moments, and spark joy every time they&apos;re scanned.
          </p>
        </div>

        {/* Values */}
        <h2 className="font-heading text-4xl md:text-5xl text-black drop-shadow-[4px_4px_0px_rgba(159,122,234,1)] mb-10 text-center">WHY SCANOVA?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { emoji: "⚡", title: "No App Needed", desc: "Our AR experiences run entirely in the browser. Scan and go — instantly." },
            { emoji: "🎨", title: "Fully Personal", desc: "Each keychain is customised with your photo and message. No two are the same." },
            { emoji: "🇮🇳", title: "Made for India", desc: "Designed, built, and shipped from India. We understand our customers because we are one." },
          ].map((v, i) => (
            <div key={i} className="sc-card sc-btn-push text-center">
              <div className="text-4xl mb-3">{v.emoji}</div>
              <h3 className="font-heading text-2xl text-sc-purple mb-2">{v.title}</h3>
              <p className="font-sans text-gray-700 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Business Info */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h2 className="font-heading text-3xl text-black mb-6 [-webkit-text-stroke:1px_black]">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            <div><span className="font-bold text-gray-600 block text-sm uppercase tracking-wider">Business Name</span><span className="font-bold text-black text-lg">SCANOVA</span></div>
            <div><span className="font-bold text-gray-600 block text-sm uppercase tracking-wider">Owner</span><span className="font-bold text-black text-lg">Meghnath Mahesh Ghadi</span></div>
            <div><span className="font-bold text-gray-600 block text-sm uppercase tracking-wider">Business Type</span><span className="font-bold text-black text-lg">Sole Proprietorship</span></div>
            <div><span className="font-bold text-gray-600 block text-sm uppercase tracking-wider">Country</span><span className="font-bold text-black text-lg">India</span></div>
            <div><span className="font-bold text-gray-600 block text-sm uppercase tracking-wider">Email</span><span className="font-bold text-black text-lg">support@scanova.in</span></div>
            <div><span className="font-bold text-gray-600 block text-sm uppercase tracking-wider">Website</span><span className="font-bold text-black text-lg">scanova-ashen.vercel.app</span></div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact" className="bg-sc-purple text-white border-4 border-black rounded-2xl px-10 py-4 font-heading text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sc-btn-push inline-block uppercase">
            Get In Touch ↗
          </Link>
        </div>
      </section>
    </div>
  );
}