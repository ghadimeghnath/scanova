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
    <div className={`flex flex-col items-center gap-6 p-8 border-4 transition-all duration-200 ${
      url
        ? "border-purple-600 bg-purple-50 rounded-3xl"
        : "border-dashed border-purple-400 bg-purple-100/30 rounded-3xl"
    }`}>
      {url ? (
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-purple-600 shadow-[6px_6px_0px_0px_rgba(124,58,237,0.3)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Uploaded photo"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
          {/* Green check overlay */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-black text-lg font-bold">
            ✓
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-200 border-3 border-purple-600 flex items-center justify-center text-4xl">
            📷
          </div>
          <div className="font-mono text-sm font-bold text-purple-900 leading-relaxed">
            JPG · PNG · WEBP<br />
            <span className="text-purple-700 text-xs font-normal">Max 10MB</span>
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
            className={`px-8 py-3 rounded-full font-heading font-bold text-sm tracking-wide border-3 cursor-pointer transition-all ${
              url
                ? "bg-purple-100 text-purple-700 border-purple-400 hover:bg-purple-200 shadow-[3px_3px_0px_0px_rgba(168,85,247,0.2)]"
                : "bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-900 shadow-[6px_6px_0px_0px_rgba(88,28,135,0.4)] hover:shadow-[8px_8px_0px_0px_rgba(88,28,135,0.5)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(88,28,135,0.3)]"
            }`}
          >
            {url ? "Change Photo" : "Choose Photo"}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
