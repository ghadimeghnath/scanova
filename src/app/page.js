// app/page.jsx  — SCANOVA Landing Page
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  return (
<div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#060608] text-[#F2F0EB] font-['Space_Mono','Courier_New',monospace] scroll-smooth selection:bg-[#00E5FF] selection:text-black no-scrollbar">
      {/* Retain keyframes for complex custom animations to work seamlessly with Tailwind's arbitrary animate classes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes glitch-slice {
          0%   { clip-path: inset(0 0 100% 0); opacity: 0; }
          20%  { clip-path: inset(0 0 60% 0);  opacity: 1; }
          40%  { clip-path: inset(0 0 40% 0); }
          60%  { clip-path: inset(0 0 20% 0); }
          80%  { clip-path: inset(0 0 5% 0); }
          100% { clip-path: inset(0 0 0 0);   opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,229,255,0.3); }
          50%      { box-shadow: 0 0 45px rgba(0,229,255,0.6); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scan {
          0%, 100% { top: 20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: 80%; }
        }
      `}</style>

      {/* ── Background Overlays ──────────────────────────────────────────────── */}
      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.55] bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_256_256%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27noise%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27_numOctaves=%274%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23noise)%27_opacity=%270.035%27/%3E%3C/svg%3E')]"></div>

      {/* Scanline */}
      <div className='pointer-events-none fixed inset-0 z-[9998] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]'></div>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav className='fixed top-0 left-0 right-0 z-[100] flex items-center justify-between py-[18px] px-[20px] md:py-[22px] md:px-[40px] border-b border-[#F2F0EB]/[0.06] backdrop-blur-[24px] bg-[#060608]/70 animate-[fade-in_0.6s_ease_both]'>
        <a
          href='/'
          className="font-['Cormorant_Garamond',Georgia,serif] text-[20px] font-light tracking-[0.35em] uppercase text-[#F2F0EB] no-underline"
        >
          Scanova
        </a>
        <div className='flex gap-[8px] items-center'>
          <a
            href='#products'
            className="hidden md:inline-block py-[8px] px-[16px] rounded-full font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.15em] uppercase no-underline text-[#F2F0EB]/[0.45] border border-transparent transition-all duration-200 hover:text-[#F2F0EB] hover:border-[#F2F0EB]/[0.12]"
          >
            Products
          </a>
          <a
            href='#how'
            className="hidden md:inline-block py-[8px] px-[16px] rounded-full font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.15em] uppercase no-underline text-[#F2F0EB]/[0.45] border border-transparent transition-all duration-200 hover:text-[#F2F0EB] hover:border-[#F2F0EB]/[0.12]"
          >
            How It Works
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className='min-h-screen flex flex-col items-center justify-center text-center pt-[140px] px-[24px] pb-[80px] relative overflow-hidden'
        ref={heroRef}
      >
        {/* Ambient orbs */}
        <div
          className='absolute rounded-full blur-[120px] pointer-events-none w-[600px] h-[600px] top-[20%] left-[50%] bg-[radial-gradient(circle,rgba(0,229,255,0.05),transparent_70%)] transition-transform duration-800 ease-[cubic-bezier(.16,1,.3,1)]'
          style={{
            transform: `translate(calc(-50% + ${
              (mousePos.x - 0.5) * -40
            }px), calc(-50% + ${(mousePos.y - 0.5) * -30}px))`,
          }}
        />
        <div className='absolute rounded-full blur-[120px] pointer-events-none w-[400px] h-[400px] bottom-[10%] right-[15%] bg-[radial-gradient(circle,rgba(200,169,110,0.04),transparent_70%)]' />

        {mounted && (
          <>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.4em] uppercase text-[#00E5FF] mb-[28px] flex items-center gap-[12px] before:content-[''] before:h-[1px] before:w-[32px] before:bg-[#00E5FF] before:opacity-50 after:content-[''] after:h-[1px] after:w-[32px] after:bg-[#00E5FF] after:opacity-50 opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.1s]">
              Drop 001 · Limited 500 Units
            </div>

            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(56px,11vw,140px)] font-light leading-[0.92] tracking-[-0.02em] text-[#F2F0EB] mb-[12px] animate-[glitch-slice_1.2s_cubic-bezier(.16,1,.3,1)_0.2s_both]">
              Wear The
              <br />
              <em className='italic text-[#C8A96E]'>Invisible.</em>
            </h1>

            <p className="font-['Space_Mono','Courier_New',monospace] text-[clamp(11px,1.4vw,14px)] text-[#F2F0EB]/[0.45] tracking-[0.05em] leading-[1.9] max-w-[480px] mt-[28px] mx-auto mb-[52px] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.4s]">
              Physical streetwear accessories embedded with stylized QR codes
              that unlock high-fidelity 3D augmented reality — directly in your
              browser. No app. No friction. Just magic.
            </p>

            <div className='flex gap-[12px] flex-wrap justify-center opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.6s]'>
              <a
                href='#products'
                className="inline-flex items-center gap-[10px] py-[18px] px-[44px] bg-[#00E5FF] text-black font-['Cormorant_Garamond',Georgia,serif] text-[15px] font-semibold tracking-[0.08em] no-underline rounded-full transition-all duration-250 animate-[pulse-glow_3s_infinite] hover:-translate-y-[2px] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)]"
              >
                ✦ &nbsp;Shop Drop 001
              </a>
              <Link
                href='/create'
                className="inline-flex items-center gap-[10px] py-[18px] px-[44px] bg-transparent border border-[#F2F0EB]/[0.18] text-[#F2F0EB] font-['Space_Mono','Courier_New',monospace] text-[11px] tracking-[0.15em] uppercase no-underline rounded-full transition-all duration-250 hover:border-[#F2F0EB]/[0.4] hover:bg-[#F2F0EB]/[0.04]"
              >
                Create Custom →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────────── */}
      <div className='overflow-hidden border-y border-[#F2F0EB]/[0.07] py-[18px] bg-[#F2F0EB]/[0.02]'>
        <div className='flex gap-0 w-max animate-[marquee_28s_linear_infinite]'>
          {[...Array(2)].map((_, i) => (
            <div key={i} className='flex'>
              {[
                "AR Keychains",
                "AR Stickers",
                "WebAR",
                "No App Required",
                "Drop 001",
                "500 Units Only",
                "Scan. Reveal. Own.",
                "Chrome 3D Art",
                "Instant AR",
                "Streetwear × Tech",
              ].map((text, j) => (
                <div
                  key={j}
                  className="font-['Cormorant_Garamond',Georgia,serif] italic text-[15px] text-[#F2F0EB]/[0.45] px-[40px] whitespace-nowrap flex items-center gap-[40px]"
                >
                  {text}
                  <span className='w-[4px] h-[4px] bg-[#C8A96E] rounded-full' />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Products ─────────────────────────────────────────────────────────── */}
      <section
        id='products'
        className='py-[80px] px-[20px] md:py-[120px] md:px-[40px] max-w-[1200px] mx-auto'
      >
        <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.4em] uppercase text-[#00E5FF] mb-[16px] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards]">
          Drop 001 Collection
        </div>
        <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(36px,5vw,64px)] font-light text-[#F2F0EB] mb-[64px] leading-[1.05] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.25s]">
          Choose Your
          <br />
          <em className='italic text-[#C8A96E]'>Portal.</em>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-[2px]'>
          {/* Sticker card */}
          <Link
            href='/create'
            className='group relative overflow-hidden py-[56px] px-[48px] bg-[#F2F0EB]/[0.02] border border-[#F2F0EB]/[0.07] transition-all duration-400 ease-[cubic-bezier(.16,1,.3,1)] cursor-pointer block no-underline rounded-t-[4px] md:rounded-tr-none md:rounded-l-[4px] hover:bg-[#F2F0EB]/[0.04] hover:border-[#F2F0EB]/[0.14]'
          >
            <div className='absolute bottom-0 left-0 right-0 height-[2px] h-[2px] bg-[#00E5FF] origin-left scale-x-0 transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100' />
            <span className='absolute top-[48px] right-[48px] text-[20px] text-[#00E5FF] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[4px] group-hover:-translate-y-[4px]'>
              ↗
            </span>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[9px] tracking-[0.3em] uppercase mb-[28px] inline-block text-[#00E5FF]">
              Tier 01
            </div>
            <div className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,4vw,48px)] font-light text-[#F2F0EB] mb-[8px]">
              AR Sticker
            </div>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.2em] text-[#F2F0EB]/[0.45] uppercase mb-[24px]">
              Marker-Based Tracking
            </div>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[12px] text-[#F2F0EB]/[0.45] leading-[1.8] mb-[36px] max-w-[360px]">
              Die-cut holographic vinyl. Point your phone at the sticker and a
              3D chrome sculpture erupts directly from the surface — anchored to
              the artwork itself.
            </div>
            <div className="font-['Cormorant_Garamond',Georgia,serif] italic text-[36px] text-[#F2F0EB] mb-[28px]">
              ₹299
            </div>
            <div className='flex flex-col gap-[8px]'>
              {[
                "Image recognition tracking",
                "3D chrome art overlay",
                "Safari + Chrome ready",
                "60fps on mid-range phones",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[10px] font-['Space_Mono','Courier_New',monospace] text-[11px] text-[#00E5FF] before:content-['✦'] before:text-[8px] before:shrink-0"
                >
                  {feature}
                </div>
              ))}
            </div>
          </Link>

          {/* Keychain card */}
          <Link
            href='/create'
            className='group relative overflow-hidden py-[56px] px-[48px] bg-[rgba(200,169,110,0.03)] border border-[rgba(200,169,110,0.15)] transition-all duration-400 ease-[cubic-bezier(.16,1,.3,1)] cursor-pointer block no-underline rounded-b-[4px] md:rounded-bl-none md:rounded-r-[4px] hover:bg-[#F2F0EB]/[0.04] hover:border-[#F2F0EB]/[0.14]'
          >
            <div className='absolute bottom-0 left-0 right-0 height-[2px] h-[2px] bg-[#C8A96E] origin-left scale-x-0 transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100' />
            <span className='absolute top-[48px] right-[48px] text-[20px] text-[#C8A96E] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[4px] group-hover:-translate-y-[4px]'>
              ↗
            </span>
            <span className="absolute top-[24px] right-[24px] py-[4px] px-[12px] rounded-full font-['Space_Mono','Courier_New',monospace] text-[9px] tracking-[0.2em] uppercase bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]">
              Featured
            </span>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[9px] tracking-[0.3em] uppercase mb-[28px] inline-block text-[#C8A96E]">
              Tier 02
            </div>
            <div className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,4vw,48px)] font-light text-[#F2F0EB] mb-[8px]">
              AR Keychain
            </div>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.2em] text-[#F2F0EB]/[0.45] uppercase mb-[24px]">
              Markerless Floor Tracking
            </div>
            <div className="font-['Space_Mono','Courier_New',monospace] text-[12px] text-[#F2F0EB]/[0.45] leading-[1.8] mb-[36px] max-w-[360px]">
              Premium acrylic. Scan the QR once, upload your photo + secret
              message — they float in life-sized 3D in your room, surrounded by
              particles, forever.
            </div>
            <div className="font-['Cormorant_Garamond',Georgia,serif] italic text-[36px] text-[#F2F0EB] mb-[28px]">
              ₹499
            </div>
            <div className='flex flex-col gap-[8px]'>
              {[
                "WebXR surface tracking",
                "Custom photo + text in AR",
                "Particle burst on placement",
                "Permanent — activated once",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[10px] font-['Space_Mono','Courier_New',monospace] text-[11px] text-[#C8A96E] before:content-['✦'] before:text-[8px] before:shrink-0"
                >
                  {feature}
                </div>
              ))}
            </div>
          </Link>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section
        id='how'
        className='py-[80px] px-[20px] md:py-[120px] md:px-[40px] border-t border-[#F2F0EB]/[0.07]'
      >
        <div className='max-w-[1200px] mx-auto'>
          <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.4em] uppercase text-[#00E5FF] mb-[16px]">
            The Experience
          </div>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(36px,5vw,64px)] font-light text-[#F2F0EB] mb-[64px] leading-[1.05]">
            Three Steps
            <br />
            <em className='italic'>to Another Dimension.</em>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-0 mt-[64px]'>
            {[
              {
                num: "01",
                title: "Unbox",
                desc: "Receive your premium die-cut vinyl sticker or acrylic keychain. The stylized QR code is seamlessly integrated into the artwork — not slapped on top.",
                accent: "#00E5FF",
              },
              {
                num: "02",
                title: "Scan",
                desc: "Open your native camera app and point it at the code. A browser notification appears — one tap. No app download. No account. No waiting.",
                accent: "#C8A96E",
              },
              {
                num: "03",
                title: "Experience",
                desc: "Your phone becomes a portal. 3D art blooms from the sticker surface, or life-sized sculptures appear on your floor. Entirely in your browser.",
                accent: "#00E5FF",
              },
            ].map((step, i) => (
              <div
                key={i}
                className='py-[48px] px-[20px] md:px-[40px] border-b md:border-b-0 md:border-r border-[#F2F0EB]/[0.07] last:border-b-0 md:last:border-r-0 relative'
              >
                <div
                  className='absolute top-[48px] right-[40px] w-[8px] h-[8px] rounded-full'
                  style={{
                    background: step.accent,
                    boxShadow: `0 0 12px ${step.accent}`,
                  }}
                />
                <div className="font-['Cormorant_Garamond',Georgia,serif] italic text-[72px] font-light text-[#F2F0EB]/[0.06] leading-none mb-[24px]">
                  {step.num}
                </div>
                <div className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-light text-[#F2F0EB] mb-[12px]">
                  {step.title}
                </div>
                <p className="font-['Space_Mono','Courier_New',monospace] text-[11px] text-[#F2F0EB]/[0.45] leading-[1.85]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div className='py-[60px] md:py-[100px] px-[20px] md:px-[40px] border-y border-[#F2F0EB]/[0.07] bg-[#F2F0EB]/[0.015]'>
        <div className='max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-0'>
          {[
            { num: "<2s", label: "Load Time", sub: "on 4G connection" },
            {
              num: "60fps",
              label: "Target Framerate",
              sub: "mid-range devices",
            },
            { num: "<3MB", label: "Asset Budget", sub: "per experience" },
            { num: "500", label: "Drop 001 Units", sub: "limited run" },
          ].map((s, i) => (
            <div
              key={i}
              className={`p-[40px] text-center border-[#F2F0EB]/[0.07] md:border-r ${
                i === 3 ? "md:border-r-0" : ""
              } ${i % 2 !== 0 ? "border-r-0" : "border-r"} ${
                i >= 2 ? "border-t md:border-t-0" : ""
              }`}
            >
              <span className="font-['Cormorant_Garamond',Georgia,serif] italic text-[clamp(40px,5vw,64px)] text-[#00E5FF] mb-[8px] block">
                {s.num}
              </span>
              <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.2em] uppercase text-[#F2F0EB]/[0.45]">
                {s.label}
              </div>
              <div className="font-['Space_Mono','Courier_New',monospace] text-[9px] text-[#F2F0EB]/[0.25] mt-[4px] tracking-[0.1em]">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AR Experience visual ──────────────────────────────────────────────── */}
      <section className='py-[80px] md:py-[120px] px-[20px] md:px-[40px] max-w-[1200px] mx-auto'>
        <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.4em] uppercase text-[#00E5FF] mb-[16px]">
          Under The Hood
        </div>
        <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(36px,5vw,64px)] font-light text-[#F2F0EB] mb-[64px] leading-[1.05]">
          Built for
          <br />
          <em className='italic'>Performance.</em>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[80px] items-center mt-[64px]'>
          {/* Visual */}
          <div className='aspect-square bg-[#F2F0EB]/[0.02] border border-[#F2F0EB]/[0.07] rounded-[4px] relative overflow-hidden flex items-center justify-center'>
            <div className='absolute w-[24px] h-[24px] border-[rgba(0,229,255,0.4)] top-[20px] left-[20px] border-t border-l' />
            <div className='absolute w-[24px] h-[24px] border-[rgba(0,229,255,0.4)] top-[20px] right-[20px] border-t border-r' />
            <div className='absolute w-[24px] h-[24px] border-[rgba(0,229,255,0.4)] bottom-[20px] left-[20px] border-b border-l' />
            <div className='absolute w-[24px] h-[24px] border-[rgba(0,229,255,0.4)] bottom-[20px] right-[20px] border-b border-r' />
            <div className='absolute left-[20px] right-[20px] h-[1px] bg-[linear-gradient(90deg,transparent,rgba(0,229,255,0.5),transparent)] animate-[scan_3s_ease-in-out_infinite]' />

            {/* Rings */}
            {[180, 240, 300].map((s, i) => (
              <div
                key={i}
                className='absolute rounded-full border border-[rgba(0,229,255,0.15)]'
                style={{
                  width: s,
                  height: s,
                  opacity: 0.4 - i * 0.1,
                  animation: `spin-slow ${20 + i * 8}s linear infinite ${
                    i % 2 ? "reverse" : ""
                  }`,
                }}
              />
            ))}
            <div className="w-[100px] h-[100px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.2),rgba(0,229,255,0.02))] border border-[rgba(0,229,255,0.4)] animate-[float_4s_ease-in-out_infinite,pulse-glow_3s_ease-in-out_infinite] flex items-center justify-center font-['Cormorant_Garamond',Georgia,serif] italic text-[12px] text-[#00E5FF] tracking-[0.15em]">
              AR
            </div>

            {/* Floating labels */}
            {[
              { text: "Three.js", x: "12%", y: "20%" },
              { text: "WebXR", x: "68%", y: "15%" },
              { text: "MindAR", x: "10%", y: "72%" },
              { text: "60fps", x: "70%", y: "75%" },
            ].map((l, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: l.x,
                  top: l.y,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: "rgba(0,229,255,0.5)",
                  letterSpacing: "0.15em",
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {l.text}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className='flex flex-col gap-[32px]'>
            {[
              {
                num: "01",
                title: "Three.js Rendering",
                desc: "All 3D art is rendered in real-time via Three.js r128+ with ACESFilmic tone mapping, physically-based materials, and dynamic lighting. Chrome metalness. Glass transparency.",
              },
              {
                num: "02",
                title: "WebXR Hit-Test",
                desc: "For keychains, the WebXR Device API performs floor surface detection via hit-test. Your photo and message float exactly where you place them — no drift, no jitter.",
              },
              {
                num: "03",
                title: "MindAR Image Tracking",
                desc: "For stickers, MindAR handles real-time image target compilation. The neural network detects feature points on the physical sticker to lock the 3D model onto the real world at a buttery 60fps.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-[20px] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards]`}
                style={{ animationDelay: `${0.4 + i * 0.15}s` }}
              >
                <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] text-[#00E5FF] tracking-[0.2em] shrink-0 pt-[4px]">
                  {item.num}
                </div>
                <div>
                  <div className="font-['Cormorant_Garamond',Georgia,serif] text-[20px] font-light text-[#F2F0EB] mb-[6px]">
                    {item.title}
                  </div>
                  <div className="font-['Space_Mono','Courier_New',monospace] text-[11px] text-[#F2F0EB]/[0.45] leading-[1.8]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Drop CTA ─────────────────────────────────────────────────────────── */}
      <section className='py-[100px] md:py-[140px] px-[20px] md:px-[40px] text-center relative overflow-hidden border-t border-[#F2F0EB]/[0.07]'>
        <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.4em] uppercase text-[#C8A96E] mb-[24px] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards]">
          Join The Underground
        </div>
        <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(48px,8vw,100px)] font-light leading-[0.95] text-[#F2F0EB] mb-[12px] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.1s]">
          Enter the
          <br />
          <em className='italic text-[#C8A96E]'>Unknown.</em>
        </h2>

        <p className="font-['Space_Mono','Courier_New',monospace] text-[12px] text-[#F2F0EB]/[0.45] leading-[1.8] max-w-[440px] mt-[24px] mx-auto mb-[48px] opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.25s]">
          Drop 001 is strictly limited to 500 units worldwide. Once they are
          gone, they will never be minted again. Secure your piece of the
          physical-digital frontier.
        </p>

        <div className='opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.4s]'>
          <div className="inline-flex items-center gap-[8px] py-[8px] px-[20px] rounded-full border border-[rgba(200,169,110,0.3)] mb-[40px] font-['Space_Mono','Courier_New',monospace] text-[10px] text-[#C8A96E] tracking-[0.2em] uppercase">
            <span className='w-[6px] h-[6px] rounded-full bg-[#C8A96E] animate-[pulse-glow_2s_infinite]' />
            500 / 500 Remaining
          </div>
        </div>

        <div className='opacity-0 animate-[fade-up_0.9s_cubic-bezier(.16,1,.3,1)_forwards] [animation-delay:0.6s]'>
          <a
            href='#products'
            className="inline-flex items-center gap-[10px] py-[20px] px-[56px] text-[16px] bg-[#00E5FF] text-black font-['Cormorant_Garamond',Georgia,serif] font-semibold tracking-[0.08em] no-underline rounded-full transition-all duration-250 animate-[pulse-glow_3s_infinite] hover:-translate-y-[2px] hover:shadow-[0_0_60px_rgba(0,229,255,0.5)]"
          >
            ✦ &nbsp;Access Drop 001
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className='py-[36px] md:py-[48px] px-[20px] md:px-[40px] border-t border-[#F2F0EB]/[0.07] flex flex-col md:flex-row justify-between items-start md:items-center flex-wrap gap-[20px]'>
        <div className="font-['Cormorant_Garamond',Georgia,serif] text-[18px] font-light tracking-[0.3em] uppercase text-[#F2F0EB]/[0.45]">
          Scanova
        </div>

        <div className='flex gap-[24px]'>
          <Link
            href='/create'
            className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.15em] uppercase text-[#F2F0EB]/[0.45] no-underline transition-colors duration-200 hover:text-[#F2F0EB]"
          >
            Create
          </Link>
          <a
            href='#products'
            className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.15em] uppercase text-[#F2F0EB]/[0.45] no-underline transition-colors duration-200 hover:text-[#F2F0EB]"
          >
            Shop
          </a>
          <a
            href='https://twitter.com'
            target='_blank'
            rel='noreferrer'
            className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.15em] uppercase text-[#F2F0EB]/[0.45] no-underline transition-colors duration-200 hover:text-[#F2F0EB]"
          >
            Twitter
          </a>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noreferrer'
            className="font-['Space_Mono','Courier_New',monospace] text-[10px] tracking-[0.15em] uppercase text-[#F2F0EB]/[0.45] no-underline transition-colors duration-200 hover:text-[#F2F0EB]"
          >
            Instagram
          </a>
        </div>

        <div className="font-['Space_Mono','Courier_New',monospace] text-[10px] text-[#F2F0EB]/[0.2] tracking-[0.1em]">
          © {new Date().getFullYear()} SCANOVA. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
