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

  const [imageUrl,     setImageUrl]     = useState("");
  const [message,      setMessage]      = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");
  const [step,         setStep]         = useState(1); // 1 = upload, 2 = message, 3 = confirm

  const canProceedStep1 = !!imageUrl;
  const canProceedStep2 = message.trim().length > 0;
  const canSubmit       = canProceedStep1 && canProceedStep2 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/keychain-claim", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ code, imageUrl, message: message.trim() }),
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

      // Success — reload the page; server will now serve WebXRWrapper
      router.replace(`/keychain/${code}`);

    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#080808] text-white">
      <div className="flex flex-col items-center justify-center min-h-full px-5 py-12">

      {/* Header */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/70 uppercase mb-3">
          SCANOVA · Keychain Activation
        </div>
        <h1 className="font-serif text-3xl font-normal text-white mb-2">
          Make It Yours
        </h1>
        <p className="font-mono text-sm text-white/40 leading-relaxed">
          Upload a photo and write a secret message. When someone scans this keychain, your AR experience appears.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
              step > s
                ? "bg-green-400/20 border border-green-400/50 text-green-400"
                : step === s
                ? "bg-cyan-400/15 border border-cyan-400/50 text-cyan-400"
                : "bg-white/5 border border-white/10 text-white/30"
            }`}>
              {step > s ? "✓" : s}
            </div>
            {s < 3 && (
              <div className={`h-[1px] w-8 transition-all duration-500 ${step > s ? "bg-green-400/40" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7">

        {/* ── STEP 1: Photo upload ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <StepLabel num="01" text="Upload Your Cover Photo" />
            <p className="font-mono text-xs text-white/35 -mt-2 leading-relaxed">
              This photo appears floating in AR when the keychain is scanned.
            </p>
            <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className={`w-full py-4 rounded-xl font-serif font-bold text-sm tracking-widest border-none transition-all duration-200 ${
                canProceedStep1
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black cursor-pointer shadow-[0_0_30px_rgba(0,229,255,0.25)]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              Next — Add Message →
            </button>
          </div>
        )}

        {/* ── STEP 2: Message ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <StepLabel num="02" text="Your Hidden AR Message" />
            <p className="font-mono text-xs text-white/35 -mt-2 leading-relaxed">
              This glowing text appears in 3D above your photo. Only visible in AR.
            </p>

            <div className="relative">
              <input
                type="text"
                autoFocus
                maxLength={40}
                placeholder="e.g. Happy Anniversary ❤️"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-base font-serif placeholder:text-white/25 outline-none focus:border-cyan-400/40 transition-colors"
              />
              <span className={`absolute right-3 bottom-3 font-mono text-[10px] ${message.length > 35 ? "text-amber-400" : "text-white/25"}`}>
                {message.length}/40
              </span>
            </div>

            {/* Preview */}
            {message && (
              <div className="p-3 bg-black/40 border border-cyan-400/10 rounded-xl text-center">
                <div className="font-mono text-[10px] text-cyan-400/50 uppercase tracking-widest mb-1">Preview in AR</div>
                <div className="font-serif text-lg text-amber-400" style={{ textShadow: "0 0 20px rgba(0,229,255,0.5)" }}>
                  {message}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl font-mono text-xs tracking-widest text-white/40 border border-white/[0.08] bg-transparent cursor-pointer hover:border-white/20 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className={`flex-[2] py-3.5 rounded-xl font-serif font-bold text-sm tracking-widest border-none transition-all duration-200 ${
                  canProceedStep2
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black cursor-pointer"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                Review & Activate →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <StepLabel num="03" text="Confirm Your Experience" />
            <p className="font-mono text-xs text-white/35 -mt-2 leading-relaxed">
              Once activated, this keychain is permanently linked to your photo and message.
            </p>

            {/* Preview card */}
            <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
              {/* Image preview */}
              <div className="relative w-full aspect-square bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Your AR photo"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              {/* Message */}
              <div className="px-4 py-3 flex items-center gap-3 border-t border-white/[0.06]">
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest shrink-0">Message</div>
                <div className="font-serif text-white/90 truncate">{message}</div>
              </div>
            </div>

            {/* Warning */}
            <div className="px-4 py-3 bg-amber-400/5 border border-amber-400/20 rounded-xl font-mono text-[11px] text-amber-400/70 leading-relaxed">
              ⚠️ This action is permanent. Your photo and message cannot be changed after activation.
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl font-mono text-xs text-red-400">
                ❌ {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={submitting}
                className="flex-1 py-3.5 rounded-xl font-mono text-xs tracking-widest text-white/40 border border-white/[0.08] bg-transparent cursor-pointer hover:border-white/20 transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`flex-[2] py-3.5 rounded-xl font-serif font-bold text-sm tracking-widest border-none transition-all duration-200 ${
                  canSubmit
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black cursor-pointer shadow-[0_0_30px_rgba(0,255,136,0.2)]"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {submitting ? "Activating…" : "✦ Activate AR Keychain"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Code badge */}
      <div className="mt-6 font-mono text-[10px] text-white/20 tracking-widest">
        KEYCHAIN CODE · {code.toUpperCase()}
      </div>
    </div>
    </div>
  );
}

function StepLabel({ num, text }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.25em] text-cyan-400/60 uppercase mb-1">{num}</div>
      <div className="font-serif text-xl text-white">{text}</div>
    </div>
  );
}
