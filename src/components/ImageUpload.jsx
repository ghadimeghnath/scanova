"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export default function ImageUpload({ onUploadComplete }) {
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const handleUploadSuccess = (result) => {
    const imageUrl = result.info.secure_url;
    setUploadedUrl(imageUrl);
    if (onUploadComplete) {
      onUploadComplete(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50">

      {uploadedUrl ? (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md">
          <img
            src={uploadedUrl}
            alt="User uploaded custom design"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <p className="text-zinc-500">Upload your custom photo for the keychain</p>
      )}

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUploadSuccess}
        options={{
          maxFiles: 1,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          sources: ["local", "camera", "instagram"],
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() =>  open()} // Correctly passes the open function to the button's onClick
            className="px-6 py-2 text-white transition-colors bg-black rounded-full hover:bg-zinc-800"
          >
            {uploadedUrl ? "Change Photo" : "Upload Photo"}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}