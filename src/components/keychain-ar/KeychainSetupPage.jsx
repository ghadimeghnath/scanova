// src/components/keychain-ar/KeychainSetupPage.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/keychain-ar/ImageUpload";
import { KEYCHAIN_THEMES, getTheme } from "@/config/keychainThemes";

export default function KeychainSetupPage({ code }) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const canProceedStep1 = !!imageUrl;
  const canProceedStep2 = message.trim().length > 0;
  const canSubmit = canProceedStep1 && canProceedStep2 && !submitting;
  const activeColor = getTheme(colorIndex);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/keychain-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          imageUrl,
          message: message.trim(),
          themeIndex: colorIndex,
        }),
      });
      const data = await res.json();
      if (res.status === 409 && data.alreadyClaimed) {
        router.replace(`/keychain/${code}`);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.replace(`/keychain/${code}`);
    } catch {
      setError("Network error. Please check your connection.");
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen w-full overflow-y-auto selection:bg-sc-pink selection:text-white relative z-0'>
      <div className='fixed top-[10%] left-[5%] sc-blob bg-sc-cyan w-40 h-40 border-4 border-black dark:border-white animate-funky -z-10 opacity-30 md:opacity-100' />
      <div
        className='fixed bottom-[10%] right-[5%] sc-blob bg-sc-yellow w-64 h-64 border-4 border-black dark:border-white animate-funky -z-10 opacity-30 md:opacity-100'
        style={{ animationDelay: "1s" }}
      />

      <div className='flex flex-col items-center justify-center min-h-full px-4 py-12 md:py-20 relative z-10'>
        <div className='w-full max-w-lg mb-10 text-center'>
          <div className='bg-sc-yellow border-4 border-black rounded-full px-6 py-2 inline-block mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2'>
            <span className='font-heading text-black uppercase tracking-widest text-sm md:text-base'>
              Activation Portal
            </span>
          </div>
          <h1 className='font-heading text-5xl md:text-7xl text-foreground drop-shadow-[4px_4px_0px_var(--color-sc-pink)] mb-6'>
            MAKE IT YOURS
          </h1>
          <p className='sc-slogan bg-white dark:bg-zinc-800 px-6 py-4 border-4 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transform rotate-1 text-xl md:text-2xl leading-snug mx-auto max-w-sm'>
            Upload a photo & drop a secret message. Your AR magic awaits!
          </p>
        </div>

        <div className='flex items-center gap-2 sm:gap-4 mb-8'>
          {[1, 2, 3].map((s) => {
            const isActive = step === s;
            const isPast = step > s;
            return (
              <div key={s} className='flex items-center gap-2 sm:gap-4'>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-heading text-xl sm:text-2xl border-4 transition-all duration-300 ${
                    isPast
                      ? "bg-sc-cyan border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : isActive
                      ? "bg-sc-yellow border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform scale-110"
                      : "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-300"
                  }`}
                >
                  {isPast ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-2 w-8 sm:w-12 rounded-full border-2 transition-all duration-500 ${
                      isPast
                        ? "bg-black border-black dark:bg-white dark:border-white"
                        : "bg-gray-200 border-gray-300 dark:bg-zinc-700 dark:border-zinc-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className='w-full max-w-md sc-card relative'>
          {step === 1 && (
            <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <StepLabel num='01' text='Upload Cover Photo' />
              <p className='font-sans font-bold text-gray-600 dark:text-gray-300 -mt-2 text-sm sm:text-base'>
                This photo appears floating in AR when the keychain is scanned.
                Make it pop!
              </p>
              <div className='bg-gray-50 dark:bg-zinc-800 border-4 border-dashed border-black dark:border-white rounded-xl p-2 hover:bg-sc-yellow/10 transition-colors'>
                <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={`w-full py-4 rounded-xl font-heading text-xl sm:text-2xl uppercase border-4 transition-all duration-200 mt-2 ${
                  canProceedStep1
                    ? "bg-sc-yellow text-black border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
                    : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
              >
                Next Step ↗
              </button>
            </div>
          )}

          {step === 2 && (
            <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <StepLabel num='02' text='Message & AR Color' />
              <p className='font-sans font-bold text-gray-600 dark:text-gray-300 -mt-2 text-sm sm:text-base'>
                Drop your secret AR text and pick a color for your AR overlay.
              </p>
              <div>
                <p className='font-heading text-xs text-foreground opacity-50 uppercase tracking-widest mb-2'>
                  AR Overlay Color
                </p>
                <div className='flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border-4 border-black dark:border-white'>
                  {KEYCHAIN_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorIndex(t.id)}
                      style={{ backgroundColor: t.bg }}
                      title={t.name}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-transform ${
                        colorIndex === t.id
                          ? "border-black dark:border-white scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "border-transparent hover:scale-105 opacity-50 hover:opacity-100"
                      }`}
                      aria-label={`Select ${t.name} AR color`}
                    />
                  ))}
                </div>
              </div>
              <div className='relative transform rotate-1'>
                <input
                  type='text'
                  autoFocus
                  maxLength={40}
                  placeholder='e.g. Stay Funky! ✌️'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='w-full px-4 py-4 bg-white dark:bg-zinc-800 border-4 border-black dark:border-white rounded-xl text-foreground text-lg font-sans font-bold placeholder:text-gray-400 outline-none focus:bg-sc-yellow/20 focus:border-sc-pink shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-colors'
                />
                <span
                  className={`absolute right-4 bottom-4 font-heading text-sm sm:text-base ${
                    message.length > 35 ? "text-sc-pink" : "text-gray-400"
                  }`}
                >
                  {message.length}/40
                </span>
              </div>
              {message && (
                <div className='mt-4 flex flex-col items-center'>
                  <div className='font-heading text-xs text-foreground opacity-50 uppercase tracking-widest mb-2'>
                    AR Label Preview
                  </div>
                  <div className='relative transform -rotate-2 w-full max-w-[90%]'>
                    <div className='absolute inset-0 bg-black dark:bg-white rounded-xl translate-x-2 translate-y-2' />
                    <div
                      className='relative border-4 border-black dark:border-white rounded-xl px-6 py-4 text-center transition-colors duration-300'
                      style={{ backgroundColor: activeColor.bg }}
                    >
                      <div
                        className='font-heading text-2xl sm:text-3xl truncate transition-colors duration-300'
                        style={{ color: activeColor.text }}
                      >
                        {message}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className='flex gap-4 mt-6'>
                <button
                  onClick={() => setStep(1)}
                  className='w-1/3 py-4 rounded-xl font-heading text-lg text-black border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push uppercase'
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className={`w-2/3 py-4 rounded-xl font-heading text-xl uppercase border-4 transition-all duration-200 ${
                    canProceedStep2
                      ? "bg-sc-cyan text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
                      : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  Review ↗
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300'>
              <StepLabel num='03' text='Lock It In' />
              <p className='font-sans font-bold text-gray-600 dark:text-gray-300 -mt-2 text-sm sm:text-base'>
                Almost done! Check your drop. Once activated, it&apos;s
                permanent.
              </p>
              <div className='relative flex flex-col items-center py-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border-4 border-black dark:border-white overflow-hidden'>
                <div className='font-heading text-xs text-foreground opacity-50 uppercase tracking-widest mb-4'>
                  Actual AR Layout
                </div>
                <div className='absolute top-10 z-20 w-16 h-5 bg-white border-2 border-black transform rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' />
                <div
                  className='relative z-10 w-40 sm:w-48 aspect-square border-4 border-black p-2 sm:p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 transition-colors duration-300'
                  style={{ backgroundColor: activeColor.bg }}
                >
                  <div className='w-full h-full border-2 border-black bg-white overflow-hidden'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt='Your AR photo'
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
                <div className='relative z-30 mt-6 max-w-[85%]'>
                  <div className='absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 rounded-md' />
                  <div
                    className='relative border-[3px] border-black px-4 py-2 transform rotate-2 transition-colors duration-300'
                    style={{ backgroundColor: activeColor.bg }}
                  >
                    <div
                      className='font-heading text-lg sm:text-xl truncate text-center transition-colors duration-300'
                      style={{ color: activeColor.text }}
                    >
                      {message}
                    </div>
                  </div>
                </div>
              </div>
              <div className='px-4 py-4 bg-sc-yellow border-4 border-black rounded-xl font-sans font-bold text-black flex items-center gap-3 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                <span className='text-2xl'>⚠️</span>
                <span className='text-sm'>
                  Cannot be edited after activation!
                </span>
              </div>
              {error && (
                <div className='px-4 py-4 bg-sc-pink border-4 border-black rounded-xl font-sans font-bold text-white text-sm transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                  ❌ {error}
                </div>
              )}
              <div className='flex gap-4 mt-2'>
                <button
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className='w-1/3 py-4 rounded-xl font-heading text-lg text-black border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push uppercase disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-2/3 py-4 rounded-xl font-heading text-xl uppercase border-4 transition-all duration-200 ${
                    canSubmit
                      ? "bg-sc-purple text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push"
                      : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "ACTIVATING..." : "ACTIVATE ↗"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='mt-12 bg-white dark:bg-zinc-800 border-4 border-black dark:border-white rounded-full px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transform -rotate-2'>
          <span className='font-heading text-sm sm:text-base text-foreground tracking-widest uppercase'>
            ID: {code}
          </span>
        </div>
      </div>
    </div>
  );
}

function StepLabel({ num, text }) {
  return (
    <div className='flex items-center gap-3 border-b-4 border-black dark:border-white pb-4 mb-2'>
      <div className='bg-black text-white dark:bg-white dark:text-black font-heading text-xl px-3 py-1 rounded-lg border-2 border-black dark:border-white transform -rotate-3'>
        {num}
      </div>
      <h2 className='font-heading text-2xl sm:text-3xl text-foreground m-0 leading-none'>
        {text}
      </h2>
    </div>
  );
}
