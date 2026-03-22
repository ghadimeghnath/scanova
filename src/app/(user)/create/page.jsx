// (user)/create/page.jsx

"use client";

import { useState } from "react";
import ImageUpload from "@/components/keychain-ar/ImageUpload";

export default function CreateKeychainPage() {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");

  const validateForm = () => {
    const errors = [];

    if (!imageUrl?.trim()) {
      errors.push("Please upload a photo for your keychain");
    }

    if (!message?.trim()) {
      errors.push("Please enter a message");
    } else if (message.length > 40) {
      errors.push("Message must be 40 characters or less");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join("; "));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), imageUrl: imageUrl.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessData(data);
      } else {
        setError(data.error || "Failed to save your design. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS UI ---
  if (successData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-zinc-50 to-zinc-100">
        <div className="max-w-md w-full p-8 text-center bg-white border border-green-200 rounded-3xl shadow-xl">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold mb-2">Design Saved!</h1>
          <p className="text-zinc-600 mb-6">
            Your custom AR keychain is ready. Print your QR code and customers can scan to see the AR experience.
          </p>
          <div className="p-4 bg-zinc-100 rounded-xl mb-6 font-mono text-sm border border-zinc-200">
            Code: <span className="font-bold text-black text-lg">{successData.shortCode}</span>
          </div>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
            <strong>Next Step:</strong> Navigate to <code>/ar/{successData.shortCode}</code> to view your experience
          </div>
          <button
            onClick={() => window.location.href = `/ar/${successData.shortCode}`}
            className="w-full py-3 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700 font-medium mb-3"
          >
            View AR Experience
          </button>
          <button
            onClick={() => {
              setSuccessData(null);
              setMessage("");
              setImageUrl("");
            }}
            className="w-full py-3 text-zinc-900 transition-colors bg-zinc-200 rounded-xl hover:bg-zinc-300 font-medium"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  // --- CREATION FORM ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 py-12 px-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-lg border border-zinc-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Design Your Keychain
          </h1>
          <p className="text-zinc-500 mt-2">
            Upload a photo and add a custom 3D message. The message will appear when customers scan your QR code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              1. Upload Cover Photo <span className="text-red-500">*</span>
            </label>
            <ImageUpload onUploadComplete={setImageUrl} />
            {imageUrl && (
              <p className="text-xs text-green-600 mt-2">✓ Photo uploaded successfully</p>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-zinc-900 mb-2">
              2. Your Hidden 3D Message <span className="text-red-500">*</span>
            </label>
            <input
              id="message"
              type="text"
              placeholder="e.g., Happy Anniversary! ❤️"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 40))}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-zinc-500">
                This message appears when the QR is scanned
              </p>
              <p className={`text-xs font-medium ${message.length > 35 ? "text-orange-600" : "text-zinc-500"}`}>
                {message.length}/40
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !imageUrl || !message}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              isSubmitting || !imageUrl || !message
                ? "bg-zinc-300 cursor-not-allowed"
                : "bg-black hover:bg-zinc-800 shadow-md hover:shadow-xl hover:-translate-y-1"
            }`}
          >
            {isSubmitting ? "Creating Design..." : "Create AR Experience →"}
          </button>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <strong>💡 Tip:</strong> You'll receive a unique QR code to print on your product. Customers can scan it with any phone to see your custom AR experience.
          </div>
        </form>
      </div>
    </div>
  );
}