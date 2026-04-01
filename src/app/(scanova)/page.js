"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
        className="h-dvh flex flex-col items-center justify-center text-center pt-24 md:pt-32 px-4 md:px-6 pb-16 md:pb-20 relative z-10 overflow-hidden"
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
      

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how" className="py-20 md:py-32 border-y-4 md:border-y-8 border-black overflow-hidden relative shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
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
    </div>
  );
}