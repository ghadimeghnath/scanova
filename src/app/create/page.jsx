"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";

export default function CreateKeychainPage() {
  // State to hold the user's inputs
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // UI states for loading and success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if they haven't uploaded an image
    if (!imageUrl) {
      alert("Please upload a photo for your keychain first!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Hit the MongoDB Prisma API route we just built
      const response = await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, imageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        // Boom! Saved successfully. Show the success UI.
        setSuccessData(data);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS UI ---
  // Once they submit, we show them their unique code
  if (successData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-zinc-50">
        <div className="max-w-md w-full p-8 text-center bg-white border border-zinc-200 rounded-3xl shadow-xl">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold mb-2">Design Saved!</h1>
          <p className="text-zinc-600 mb-6">
            Your custom AR keychain is ready for production.
          </p>
          <div className="p-4 bg-zinc-100 rounded-xl mb-6 font-mono text-sm">
            Unique AR Code: <span className="font-bold text-black">{successData.shortCode}</span>
          </div>
          <p className="text-sm text-zinc-500 mb-6">
            (In the final version, this is where we redirect them to Razorpay to pay ₹499 before generating this code!)
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 text-white transition-colors bg-black rounded-xl hover:bg-zinc-800 font-medium"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  // --- THE CREATION FORM UI ---
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-lg border border-zinc-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Design Your Keychain
          </h1>
          <p className="text-zinc-500 mt-2">
            Upload a photo and add a secret 3D message.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Cloudinary Image Upload Component */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              1. Upload Cover Photo
            </label>
            <ImageUpload 
              onUploadComplete={(url) => setImageUrl(url)} 
            />
          </div>

          {/* 2. Custom 3D Text Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-zinc-900 mb-2">
              2. Your Hidden 3D Message
            </label>
            <input
              id="message"
              type="text"
              required
              maxLength={40}
              placeholder="e.g., Happy Anniversary! ❤️"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
            />
            <p className="text-xs text-zinc-500 mt-2 text-right">
              {message.length}/40 characters
            </p>
          </div>

          {/* 3. Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              isSubmitting 
                ? "bg-zinc-400 cursor-not-allowed" 
                : "bg-black hover:bg-zinc-800 shadow-md hover:shadow-xl translate-y-0 hover:-translate-y-1"
            }`}
          >
            {isSubmitting ? "Saving Design..." : "Save & Generate AR Code"}
          </button>

        </form>
      </div>
    </div>
  );
}