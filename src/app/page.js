"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/scanova/Footer";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const onMouse = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  // Navigation links data
  const navLinks = [
    { label: "Products", href: "/shop", hidden: "hidden sm:inline-block" },
    { label: "How It Works", href: "#how", hidden: "hidden md:inline-block" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-sc-pink selection:text-white">
      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)] transition-transform">
        <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-12">
          <Link
            href="/"
            className="font-heading text-2xl sm:text-3xl md:text-4xl text-sc-purple tracking-wid no-underline drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sc-btn-push inline-block"
          >
            SCANOVA
          </Link>
          <div className="flex gap-3 sm:gap-4 items-center">
            {/* Desktop Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.hidden} font-sans font-bold text-black border-4 border-black rounded-full px-4 py-2 md:px-6 md:py-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push hover:bg-sc-yellow active:bg-sc-yellow transition-colors text-sm md:text-base`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden font-heading text-lg border-4 border-black rounded-full w-10 h-10 flex items-center justify-center bg-sc-yellow shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black transition-all active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px]"
            >
              {isMobileMenuOpen ? "✕" : "≡"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t-4 border-black bg-white p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans font-bold text-black border-4 border-black rounded-xl px-4 py-3 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-sc-yellow active:bg-sc-yellow transition-colors text-center"
              >
                {link.label}
              </Link>
            ))}

          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center pt-24 md:pt-32 px-4 md:px-6 pb-16 md:pb-20 relative overflow-hidden"
        ref={heroRef}
      >
        {/* Interactive Funky Background Blobs */}
        <div
          className="absolute sc-blob bg-sc-cyan animate-funky pointer-events-none w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[600px] md:h-[600px] top-[5%] left-[-10%] md:left-[10%] opacity-60 md:opacity-80 border-4 border-black"
          style={{
            transform: `translate(calc(${mousePos.x * -20}px), calc(${mousePos.y * -15}px))`,
          }}
        />
        <div
          className="absolute sc-blob bg-sc-pink animate-funky pointer-events-none w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[400px] md:h-[400px] bottom-[5%] right-[-5%] md:right-[10%] opacity-60 md:opacity-80 border-4 border-black"
          style={{
            animationDelay: "1s",
            transform: `translate(calc(${mousePos.x * 20}px), calc(${mousePos.y * 15}px))`,
          }}
        />

        {mounted && (
          <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full">
            <div className="bg-sc-yellow border-4 border-black rounded-full px-4 py-2 md:px-8 md:py-3 mb-6 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              <span className="font-heading text-black tracking-widest uppercase text-xs sm:text-sm md:text-lg">
                Drop 001 · The Funky Edition
              </span>
            </div>

            <h1 className="font-heading text-[clamp(40px,10vw,160px)] leading-[0.9] md:leading-[0.85] text-white [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:4px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] md:drop-shadow-[12px_12px_0px_rgba(0,0,0,1)] mb-4 md:mb-6">
              HOLD <br />
              <span className="text-sc-yellow">MEMORIES</span>
            </h1>

            <p className="sc-slogan bg-white px-4 py-3 md:px-8 md:py-4 border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 mb-8 md:mb-10 max-w-xl text-lg sm:text-xl md:text-3xl leading-snug w-[90%] md:w-full">
              Scan the code. Unlock the magic. No app needed.
            </p>

            <div className="flex gap-4 md:gap-6 flex-col sm:flex-row w-full sm:w-auto px-4 sm:px-0">
              <Link
                href="/shop"
                className="bg-sc-yellow border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-2xl px-6 py-3 md:px-10 md:py-4 sc-btn-push font-heading text-lg md:text-2xl uppercase text-black w-full sm:w-auto text-center transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Shop Now ↗
              </Link>
              <Link
                href="/scanner"
                className="bg-sc-purple border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-2xl px-6 py-3 md:px-10 md:py-4 sc-btn-push text-white font-heading text-lg md:text-2xl uppercase w-full sm:w-auto text-center transition-all active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
              >
                Scan AR ★
              </Link>
            
            </div>
          </div>
        )}
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border-y-4 border-black py-4 md:py-6 bg-sc-cyan flex relative z-20 shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex w-max animate-[marquee_20s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              {[
                "AR Keychains",
                "AR Stickers",
                "Image Tracking",
                "Scan & Reveal",
                "Funky 3D Art",
                "No App Required",
              ].map((text, j) => (
                <div
                  key={j}
                  className="font-heading text-xl sm:text-3xl md:text-5xl text-black uppercase px-6 md:px-10 flex items-center gap-4 md:gap-8 whitespace-nowrap"
                >
                  {text}
                  <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    ★
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Products ─────────────────────────────────────────────────────────── */}
      <section id="products" className="py-20 md:py-32 px-4 md:px-12 max-w-[1400px] mx-auto relative z-10 bg-white">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-black [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:2px_white] drop-shadow-[6px_6px_0px_rgba(159,122,234,1)] md:drop-shadow-[8px_8px_0px_rgba(159,122,234,1)] mb-4">
            CHOOSE YOUR EXPERIENCE
          </h2>
          <p className="sc-slogan text-sc-purple text-xl md:text-3xl">Physical products. Digital magic. Choose your path.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Sticker Card */}
          <Link href="/shop" className="block group sc-btn-push h-full">
            <div className="sc-card !bg-sc-pink h-full transform transition-transform group-hover:scale-105 group-hover:rotate-1 flex flex-col">
              <div className="bg-white border-4 border-black rounded-xl p-2 md:p-4 inline-block mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
                <span className="font-heading text-sc-purple uppercase text-sm md:text-lg">Tier 01</span>
              </div>
              <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:3px_black] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-2 md:mb-4">
                AR STICKER
              </h3>
              <p className="font-sans font-bold text-black mb-6 md:mb-8 border-b-4 border-black pb-6 md:pb-8 text-base md:text-lg flex-grow">
                Die-cut holographic stickers. Point your camera and watch 3D art come to life.
              </p>
              <div className="flex justify-between items-end mt-auto">
                <div className="font-heading text-4xl md:text-6xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  ₹299
                </div>
                <div className="bg-white text-black font-heading text-lg md:text-xl px-6 py-2 md:px-8 md:py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  GET IT ↗
                </div>
              </div>
            </div>
          </Link>

          {/* Keychain Card */}
          <Link href="/shop" className="block group sc-btn-push h-full">
            <div className="sc-card !bg-sc-cyan h-full transform transition-transform group-hover:scale-105 group-hover:-rotate-1 flex flex-col">
              <div className="bg-white border-4 border-black rounded-xl p-2 md:p-4 inline-block mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start relative">
                <span className="font-heading text-sc-purple uppercase text-sm md:text-lg">Tier 02</span>
                <span className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-sc-yellow text-black font-heading text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-12 animate-pulse">
                  HOT!
                </span>
              </div>
              <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:3px_black] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-2 md:mb-4">
                AR KEYCHAIN
              </h3>
              <p className="font-sans font-bold text-black mb-6 md:mb-8 border-b-4 border-black pb-6 md:pb-8 text-base md:text-lg flex-grow">
                Premium acrylic keychains. Upload your photo + message. See them float in your room in 3D.
              </p>
              <div className="flex justify-between items-end mt-auto">
                <div className="font-heading text-4xl md:text-6xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  ₹499
                </div>
                <div className="bg-white text-black font-heading text-lg md:text-xl px-6 py-2 md:px-8 md:py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  GET IT ↗
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how" className="py-20 md:py-32 border-y-4 md:border-y-8 border-black bg-white overflow-hidden relative shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-center text-sc-purple mb-16 md:mb-24 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,0.3)] [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black]">
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 md:gap-12 relative z-10">
            {[
              { num: "1", title: "UNBOX", desc: "Get your AR-enabled merch & QR code.", color: "!bg-sc-yellow", rotation: "sm:-rotate-3" },
              { num: "2", title: "SCAN", desc: "Point your camera. No app downloads.", color: "!bg-sc-pink", rotation: "sm:rotate-3" },
              { num: "3", title: "EXPERIENCE", desc: "See 3D art appear instantly.", color: "!bg-sc-cyan", rotation: "sm:-rotate-1" },
            ].map((step, i) => (
              <div key={i} className={`sc-card ${step.color} transform ${step.rotation} flex flex-col items-center text-center sc-btn-push mt-6 md:mt-0 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="bg-white border-4 border-black w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-heading text-4xl md:text-5xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 md:mb-8 -mt-12 md:-mt-16">
                  {step.num}
                </div>
                <h3 className="font-heading text-3xl md:text-4xl text-white [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-2 md:mb-4">
                  {step.title}
                </h3>
                <p className="font-sans font-bold text-black text-lg md:text-xl">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AR Experience visual ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-[1200px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Simulated AR Camera View */}
          <div className="relative aspect-[3/4] md:aspect-square bg-gray-200 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 md:border-8 border-black group sc-btn-push order-2 lg:order-1 w-full max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400">
            <div className="ar-funky-frame border-[8px] md:border-[12px] z-50"></div>
              <div className="w-full h-full opacity-30 bg-[radial-gradient(circle,rgba(0,0,0,1)_2px,transparent_2px)] bg-[size:16px_16px] md:bg-[size:24px_24px]"></div>
            </div>
            

            {/* Simulated 3D Element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sc-blob bg-sc-pink w-[60%] h-[60%] animate-funky border-4 md:border-8 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.7)]">
               <span className="font-heading text-3xl md:text-5xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-12 [-webkit-text-stroke:1px_black] md:[-webkit-text-stroke:2px_black]">★ AR ★</span>
            </div>

            <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-[80%] md:w-auto text-center">
               <div className="ar-status-pill animate-bounce text-sm md:text-xl inline-block px-4 py-1 md:px-6 md:py-2">
                 ✓ Ready
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:gap-10 order-1 lg:order-2 text-center lg:text-left">
            <div>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black drop-shadow-[4px_4px_0px_rgba(34,211,238,1)] md:drop-shadow-[6px_6px_0px_rgba(34,211,238,1)] mb-4 md:mb-6 leading-tight lg:leading-none">
                POWERED BY TECH
              </h2>
              <p className="sc-slogan text-sc-purple text-xl md:text-3xl">High performance. No downloads.</p>
            </div>

            <div className="space-y-4 md:space-y-6 text-left">
              {[
                { title: "Three.js", desc: "Real-time 3D rendering. Works on all phones." },
                { title: "MindAR", desc: "Image-based tracking. Instant AR response." },
                { title: "60 FPS", desc: "Optimized for mid-range and flagship phones." },
              ].map((item, i) => (
                <div key={i} className="sc-card !p-4 md:!p-6 sc-btn-push flex flex-col justify-center transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="font-heading text-xl md:text-2xl text-sc-purple mb-1 md:mb-2 [-webkit-text-stroke:1px_black]">{item.title}</h4>
                  <p className="font-sans font-bold text-gray-800 text-base md:text-lg">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Drop CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-sc-purple py-24 md:py-40 px-4 md:px-6 border-y-4 md:border-y-8 border-black text-center relative overflow-hidden shadow-[0px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="absolute top-4 left-4 md:top-10 md:left-10 sc-blob w-20 h-20 md:w-40 md:h-40 bg-sc-yellow border-4 md:border-8 border-black animate-funky shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
        <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 sc-blob w-24 h-24 md:w-56 md:h-56 bg-sc-cyan border-4 md:border-8 border-black animate-funky shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{animationDelay: '2s'}}></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-[clamp(40px,10vw,120px)] leading-none text-white [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:4px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] md:drop-shadow-[12px_12px_0px_rgba(0,0,0,1)] mb-8 md:mb-12 transform -rotate-3">
            LIMITED EDITION
          </h2>
          
          <p className="font-heading text-lg sm:text-2xl md:text-3xl text-white mb-10 md:mb-16 bg-black p-4 md:p-6 rounded-xl md:rounded-2xl border-2 md:border-4 border-white inline-block transform rotate-2 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            500 units worldwide · Claim yours today
          </p>

          <div>
            <Link
              href="/shop"
              className="bg-sc-yellow border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl px-8 py-4 md:px-16 md:py-6 sc-btn-push inline-block font-heading text-2xl sm:text-3xl md:text-4xl text-black uppercase w-[90%] sm:w-auto text-center transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}