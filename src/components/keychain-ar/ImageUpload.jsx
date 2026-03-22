// components/keychain-ar/ImageUpload.jsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export default function ImageUpload({ onUploadComplete }) {
  const [url, setUrl] = useState(null);

  const onSuccess = (result) => {
    const u = result.info.secure_url;
    setUrl(u);
    onUploadComplete?.(u);
  };

  return (
    <div className={`flex flex-col items-center gap-4 p-6 border rounded-xl transition-all duration-200 ${
      url
        ? "border-green-400/30 bg-green-400/[0.03]"
        : "border-dashed border-white/15 bg-white/[0.02]"
    }`}>
      {url ? (
        <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-white/10 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Uploaded photo"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
          {/* Green check overlay */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-400/90 flex items-center justify-center text-black text-xs font-bold">
            ✓
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl">
            📷
          </div>
          <div className="font-mono text-xs text-white/30 leading-relaxed">
            JPG · PNG · WEBP<br />
            <span className="text-white/20">Max 10MB</span>
          </div>
        </div>
      )}

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={onSuccess}
        options={{
          maxFiles            : 1,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          sources             : ["local", "camera"],
          maxFileSize         : 10_000_000,
          cropping            : true,        // let user crop to square
          croppingAspectRatio : 1,
          showSkipCropButton  : true,
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className={`px-6 py-2.5 rounded-full font-serif font-bold text-sm tracking-wide border-none cursor-pointer transition-all ${
              url
                ? "bg-white/[0.06] text-white/60 hover:bg-white/10"
                : "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            }`}
          >
            {url ? "Change Photo" : "Choose Photo"}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
