"use client";
import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/scanova/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your email/backend
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-sc-pink selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-12">
          <Link href="/" className="font-heading text-2xl sm:text-3xl md:text-4xl text-sc-purple tracking-wide no-underline drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sc-btn-push inline-block">
            SCANOVA
          </Link>
          <Link href="/shop" className="font-sans font-bold text-black border-4 border-black rounded-full px-4 py-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push hover:bg-sc-yellow transition-colors text-sm md:text-base">
            Shop
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-12 text-center relative overflow-hidden bg-sc-yellow border-b-4 border-black">
        <div className="absolute top-6 left-6 sc-blob w-28 h-28 bg-sc-cyan border-4 border-black animate-funky opacity-80" />
        <div className="absolute bottom-6 right-6 sc-blob w-20 h-20 bg-sc-purple border-4 border-black animate-funky opacity-70" style={{ animationDelay: "2s" }} />
        <div className="relative z-10">
          <h1 className="font-heading text-[clamp(48px,10vw,120px)] leading-none text-black [-webkit-text-stroke:2px_black] drop-shadow-[8px_8px_0px_rgba(159,122,234,1)] mb-4">
            CONTACT
          </h1>
          <p className="sc-slogan text-sc-purple-dark text-xl md:text-2xl">We&apos;re real humans. We actually reply.</p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-12 max-w-[900px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="sc-card sc-btn-push">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-heading text-2xl text-sc-purple mb-1">Email Us</h3>
              <a href="mailto:support@scanova.in" className="font-sans font-bold text-black hover:text-sc-purple transition-colors text-lg break-all">
                support@scanova.in
              </a>
              <p className="font-sans text-gray-600 text-sm mt-2">We respond within 24–48 business hours.</p>
            </div>

            <div className="sc-card sc-btn-push">
              <div className="text-3xl mb-2">🕐</div>
              <h3 className="font-heading text-2xl text-sc-purple mb-1">Support Hours</h3>
              <p className="font-sans font-bold text-black">Monday – Saturday</p>
              <p className="font-sans text-gray-700">10:00 AM – 6:00 PM IST</p>
              <p className="font-sans text-gray-500 text-sm mt-2">Closed on national public holidays.</p>
            </div>

            <div className="sc-card sc-btn-push">
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-heading text-2xl text-sc-purple mb-1">Order Issues?</h3>
              <p className="font-sans text-gray-700 leading-relaxed">
                For damaged or wrong items, email us within <strong>48 hours of delivery</strong> with your order number and a photo/video. We&apos;ll sort it out.
              </p>
            </div>

            <div className="bg-sc-yellow border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-heading text-xl text-black mb-2">Track Your Order</h3>
              <p className="font-sans text-gray-800 text-sm mb-3">Shipped via India Post Speed Post. Use the tracking link below.</p>
              <Link href="/track-order" className="bg-black text-white font-heading px-6 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sc-btn-push inline-block text-sm uppercase">
                Track Order →
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="sc-card">
            <h2 className="font-heading text-3xl text-sc-purple mb-6 [-webkit-text-stroke:1px_black]">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-heading text-2xl text-sc-purple mb-2">Message Sent!</h3>
                <p className="font-sans text-gray-700">We&apos;ll get back to you at <strong>{form.email}</strong> within 24–48 hours.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-sans font-bold text-black text-sm uppercase tracking-wider block mb-1">Your Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ravi Kumar"
                    className="w-full border-4 border-black rounded-xl px-4 py-3 font-sans text-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(159,122,234,1)] focus:border-sc-purple outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-sans font-bold text-black text-sm uppercase tracking-wider block mb-1">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ravi@email.com"
                    className="w-full border-4 border-black rounded-xl px-4 py-3 font-sans text-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(159,122,234,1)] focus:border-sc-purple outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-sans font-bold text-black text-sm uppercase tracking-wider block mb-1">Order Number (if any)</label>
                  <input
                    name="orderNumber"
                    value={form.orderNumber}
                    onChange={handleChange}
                    placeholder="SCNV-00001"
                    className="w-full border-4 border-black rounded-xl px-4 py-3 font-sans text-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(159,122,234,1)] focus:border-sc-purple outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-sans font-bold text-black text-sm uppercase tracking-wider block mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full border-4 border-black rounded-xl px-4 py-3 font-sans text-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[5px_5px_0px_0px_rgba(159,122,234,1)] focus:border-sc-purple outline-none transition-all resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="bg-sc-purple text-white border-4 border-black rounded-xl px-8 py-3 font-heading text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push uppercase w-full transition-all active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Send Message ↗
                </button>
                <p className="font-sans text-gray-500 text-xs text-center">We do not share your information with third parties.</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Address */}
        <div className="bg-sc-pink border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <h2 className="font-heading text-3xl text-white [-webkit-text-stroke:1px_black] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-4">Registered Business Address</h2>
          <p className="font-sans font-bold text-black text-lg">SCANOVA (Sole Proprietorship)</p>
          <p className="font-sans text-black">Owned by: Meghnath Mahesh Ghadi</p>
          <p className="font-sans text-black mt-2">123, Example Street, Sector 5<br />Pune, Maharashtra – 411001<br />India</p>
          <p className="font-sans text-black mt-2">Email: <a href="mailto:support@scanova.in" className="font-bold underline">support@scanova.in</a></p>
        </div>
      </section>
    </div>
  );
}
