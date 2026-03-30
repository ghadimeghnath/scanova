// components/keychain-ar/KeychainSetupPage.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/keychain-ar/ImageUpload";

// ─────────────────────────────────────────────────────────────────────────────
// KeychainSetupPage
// Shown once on first scan of an unclaimed keychain QR.
// User uploads their photo + message → code is claimed → AR launches.
// ─────────────────────────────────────────────────────────────────────────────
export default function KeychainSetupPage({ code }) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = upload, 2 = message, 3 = confirm

  const canProceedStep1 = !!imageUrl;
  const canProceedStep2 = message.trim().length > 0;
  const canSubmit = canProceedStep1 && canProceedStep2 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/keychain-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, imageUrl, message: message.trim() }),
      });

      const data = await res.json();

      if (res.status === 409 && data.alreadyClaimed) {
        // Race condition — someone else claimed it (or double-tap)
        // Just redirect to AR which will show correctly
        router.replace(`/keychain/${code}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Success — reload the page; server will now serve the keychain AR experience
      router.replace(`/keychain/${code}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto selection:bg-sc-pink selection:text-white relative z-0">
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-[10%] left-[5%] sc-blob bg-sc-cyan w-40 h-40 border-4 border-black animate-funky -z-10 opacity-30 md:opacity-100"></div>
      <div className="fixed bottom-[10%] right-[5%] sc-blob bg-sc-yellow w-64 h-64 border-4 border-black animate-funky -z-10 opacity-30 md:opacity-100" style={{ animationDelay: '1s' }}></div>

      <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 md:py-20 relative z-10">
        
        {/* Header */}
        <div className="w-full max-w-lg mb-10 text-center">
          <div className="bg-white border-4 border-black rounded-full px-4 py-2 inline-block mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
            <span className="font-heading text-sc-purple uppercase tracking-widest text-sm md:text-base">
              Activation Portal
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl text-black drop-shadow-[4px_4px_0px_rgba(244,114,182,1)] [-webkit-text-stroke:2px_white] mb-6">
            MAKE IT YOURS
          </h1>
          <p className="sc-slogan bg-white px-6 py-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 text-xl md:text-2xl leading-snug mx-auto max-w-sm">
            Upload a photo & drop a secret message. Your AR magic awaits!
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 sm:gap-4 mb-8">
          {[1, 2, 3].map((s) => {
            const isActive = step === s;
            const isPast = step > s;
            return (
              <div key={s} className="flex items-center gap-2 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-heading text-xl sm:text-2xl border-4 transition-all duration-300 ${
                    isPast
                      ? "bg-sc-cyan border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : isActive
                      ? "bg-sc-yellow border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform scale-110"
                      : "bg-white border-gray-300 text-gray-300"
                  }`}
                >
                  {isPast ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-2 w-8 sm:w-12 rounded-full border-2 transition-all duration-500 ${
                      isPast ? "bg-black border-black" : "bg-gray-200 border-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md sc-card relative">
          
          {/* ── STEP 1: Photo upload ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <StepLabel num="01" text="Upload Cover Photo" />
              <p className="font-sans font-bold text-gray-600 -mt-2 text-sm sm:text-base">
                This photo appears floating in AR when the keychain is scanned. Make it pop!
              </p>
              
              {/* Wraps external ImageUpload for consistent spacing */}
              <div className="bg-gray-50 border-4 border-dashed border-black rounded-xl p-2 hover:bg-sc-yellow/10 transition-colors">
                <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={`w-full py-4 rounded-xl font-heading text-xl sm:text-2xl uppercase border-4 border-black transition-all duration-200 mt-2 ${
                  canProceedStep1
                    ? "bg-sc-yellow text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
                    : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
              >
                Next Step ↗
              </button>
            </div>
          )}

          {/* ── STEP 2: Message ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <StepLabel num="02" text="Hidden AR Message" />
              <p className="font-sans font-bold text-gray-600 -mt-2 text-sm sm:text-base">
                This funky text bursts out in 3D above your photo. Only visible in AR.
              </p>

              <div className="relative transform rotate-1">
                <input
                  type="text"
                  autoFocus
                  maxLength={40}
                  placeholder="e.g. Stay Funky! ✌️"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-4 bg-white border-4 border-black rounded-xl text-black text-lg font-sans font-bold placeholder:text-gray-400 outline-none focus:bg-sc-yellow/20 focus:border-sc-pink shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-colors"
                />
                <span
                  className={`absolute right-4 bottom-4 font-heading text-sm sm:text-base ${
                    message.length > 35 ? "text-sc-pink" : "text-gray-400"
                  }`}
                >
                  {message.length}/40
                </span>
              </div>

              {/* Live Preview */}
              {message && (
                <div className="p-6 bg-sc-purple border-4 border-black rounded-xl text-center transform -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-2">
                  <div className="font-heading text-xs text-white uppercase tracking-widest mb-3 bg-black inline-block px-3 py-1 rounded-full border-2 border-white">
                    AR PREVIEW
                  </div>
                  <div className="font-handwritten text-3xl sm:text-4xl text-sc-yellow drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] leading-tight">
                    {message}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-xl font-heading text-lg text-black border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push uppercase"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className={`w-2/3 py-4 rounded-xl font-heading text-xl uppercase border-4 border-black transition-all duration-200 ${
                    canProceedStep2
                      ? "bg-sc-cyan text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
                      : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  Review ↗
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <StepLabel num="03" text="Lock It In" />
              <p className="font-sans font-bold text-gray-600 -mt-2 text-sm sm:text-base">
                Almost done! Check your drop. Once activated, it's permanently burned into the blockchain... kidding, but it IS permanent.
              </p>

              {/* Final Preview Card */}
              <div className="rounded-2xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <div className="relative w-full aspect-square bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Your AR photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-4 bg-sc-cyan border-t-4 border-black flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="bg-white border-2 border-black px-2 py-1 rounded font-heading text-xs text-black uppercase shrink-0">
                    Message
                  </div>
                  <div className="font-handwritten text-2xl text-black truncate w-full">
                    {message}
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="px-4 py-4 bg-sc-yellow border-4 border-black rounded-xl font-sans font-bold text-black flex gap-3 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl">⚠️</span>
                <span className="text-sm">Cannot be edited after activation!</span>
              </div>

              {error && (
                <div className="px-4 py-4 bg-sc-pink border-4 border-black rounded-xl font-sans font-bold text-white text-sm transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                  ❌ {error}
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className="w-1/3 py-4 rounded-xl font-heading text-lg text-black border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-2/3 py-4 rounded-xl font-heading text-xl uppercase border-4 border-black transition-all duration-200 ${
                    canSubmit
                      ? "bg-sc-pink text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
                      : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "ACTIVATING..." : "ACTIVATE ↗"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Code badge */}
        <div className="mt-12 bg-white border-4 border-black rounded-full px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
          <span className="font-heading text-sm sm:text-base text-black tracking-widest uppercase">
            ID: {code}
          </span>
        </div>

      </div>
    </div>
  );
}

// Sub-component for funky step headers
function StepLabel({ num, text }) {
  return (
    <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-2">
      <div className="bg-black text-white font-heading text-xl px-3 py-1 rounded-lg border-2 border-black transform -rotate-3">
        {num}
      </div>
      <h2 className="font-heading text-2xl sm:text-3xl text-black m-0 leading-none">
        {text}
      </h2>
    </div>
  );
}