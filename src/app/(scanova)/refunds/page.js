"use client";
import Link from "next/link";

const EFFECTIVE_DATE = "1 July 2025";
const OWNER = "Meghnath Mahesh Ghadi";
const BUSINESS = "SCANOVA";
const EMAIL = "support@scanova.in";
const ADDRESS = "123, Example Street, Sector 5, Pune, Maharashtra – 411001, India";

function Section({ title, children, accent }) {
  return (
    <div className={`sc-card mb-6 ${accent ? `border-${accent}` : ""}`}>
      <h2 className="font-heading text-2xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">{title}</h2>
      <div className="font-sans text-gray-700 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function RefundsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-sc-pink selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-12">
          <Link href="/" className="font-heading text-2xl sm:text-3xl md:text-4xl text-sc-purple tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] sc-btn-push inline-block">
            SCANOVA
          </Link>
          <Link href="/shop" className="font-sans font-bold text-black border-4 border-black rounded-full px-4 py-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push hover:bg-sc-yellow transition-colors text-sm md:text-base">
            Shop
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 md:px-12 text-center bg-sc-pink border-b-4 border-black">
        <h1 className="font-heading text-[clamp(36px,8vw,100px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">
          REFUND<br />POLICY
        </h1>
        <div className="bg-sc-yellow border-4 border-black rounded-full px-6 py-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-heading text-black text-sm uppercase tracking-widest">Effective Date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-16 px-4 md:px-12 max-w-[900px] mx-auto">

        {/* Plain English Summary */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h2 className="font-heading text-2xl text-black mb-3">Summary (Plain English)</h2>
          <ul className="font-sans font-bold text-black space-y-2">
            <li>✅ <strong>No returns</strong> — we ship via India Post, so physical returns are not possible.</li>
            <li>✅ <strong>Damaged or wrong item?</strong> Email us within 48 hours with proof — we&apos;ll send a replacement for free.</li>
            <li>✅ <strong>We can&apos;t fulfil your order?</strong> You get a full cash refund to your original payment method.</li>
            <li>❌ <strong>Changed your mind?</strong> Unfortunately we cannot process refunds for this reason.</li>
          </ul>
        </div>

        <Section title="1. Our Policy on Returns">
          <p>
            <strong>{BUSINESS}</strong> (sole proprietorship owned by {OWNER}) operates a <strong>No Returns</strong> policy. Due to our shipping partner — India Post Speed Post — we are unable to facilitate physical product returns once an order has been dispatched. We encourage customers to review product details carefully before placing an order.
          </p>
          <p>
            This policy is consistent with the nature of our products: personalised, QR-linked AR merchandise that is configured to individual customers.
          </p>
        </Section>

        <Section title="2. Damaged, Defective, or Wrong Item Received">
          <p>We take quality seriously. If you receive a product that is:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Physically damaged or broken on arrival</li>
            <li>Defective in quality (e.g. misprint, broken QR code)</li>
            <li>Incorrect (a different item from what you ordered)</li>
          </ul>
          <p>Please follow these steps:</p>
          <div className="flex flex-col gap-3 mt-2">
            {[
              { step: "Step 1", text: `Email us at ${EMAIL} within 48 hours of delivery.` },
              { step: "Step 2", text: "Include your SCANOVA order number (e.g. SCNV-00001)." },
              { step: "Step 3", text: "Attach clear photo or video evidence of the damage or defect." },
              { step: "Step 4", text: "We will review your claim within 2 business days and respond with a resolution." },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="bg-sc-purple border-4 border-black rounded-xl px-3 py-1 text-white font-heading text-sm flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{s.step}</div>
                <p className="font-sans text-gray-700 pt-1">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-sc-cyan border-4 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-4">
            <p className="font-sans font-bold text-black">
              ⚠️ Claims raised after 48 hours of delivery may not be accepted. Please inspect your parcel promptly upon receipt.
            </p>
          </div>
        </Section>

        <Section title="3. Resolution Options">
          <p>For valid damage or wrong-item claims, we offer the following resolutions at our discretion:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              { title: "Free Replacement", desc: "We ship a new, correct item at no additional cost to you. Replacement is subject to stock availability.", color: "bg-sc-yellow" },
              { title: "Store Credit", desc: "If a replacement cannot be fulfilled (due to stock), we issue a store credit equal to the value of the item for use on a future order.", color: "bg-sc-cyan" },
            ].map((r, i) => (
              <div key={i} className={`${r.color} border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <h3 className="font-heading text-xl text-black mb-2">{r.title}</h3>
                <p className="font-sans text-gray-800 text-sm">{r.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="4. Cash Refunds">
          <p>Cash refunds are issued <strong>only</strong> in the following exceptional circumstances:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>SCANOVA is unable to fulfil your order due to stock unavailability discovered after payment.</li>
            <li>A technical payment error resulted in a double charge.</li>
            <li>An order was cancelled by us (not by the customer).</li>
          </ul>
          <p>Where a cash refund is applicable, it will be processed to the <strong>original payment method</strong> (UPI, card, wallet, etc.) within <strong>7–10 business days</strong> of confirmation. Processing time may vary depending on your bank or payment provider.</p>
          <p>
            <strong>We do not offer cash refunds</strong> for: change of mind, AR experience dissatisfaction due to device incompatibility, or customer-provided address errors resulting in non-delivery.
          </p>
        </Section>

        <Section title="5. Order Cancellation">
          <p>Orders may be cancelled by the customer within <strong>12 hours</strong> of placement by emailing <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a> with your order number. Cancellation requests submitted after 12 hours or after dispatch cannot be accommodated.</p>
          <p>If your cancellation request is accepted before dispatch, you will receive a full refund to your original payment method within 7–10 business days.</p>
        </Section>

        <Section title="6. Non-Refundable Cases">
          <p>Refunds or replacements will <strong>not</strong> be provided in the following cases:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Change of mind after order placement or delivery</li>
            <li>Damage caused by the customer after delivery</li>
            <li>Damage claims raised after 48 hours of delivery</li>
            <li>Non-delivery due to incorrect or incomplete address provided by the customer</li>
            <li>AR experience not functioning due to the customer&apos;s device being unsupported or having camera restrictions</li>
          </ul>
        </Section>

        <Section title="7. Governing Law">
          <p>This Refund Policy is governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Pune, Maharashtra, India.</p>
        </Section>

        <Section title="8. Contact for Refund Queries">
          <p>For any refund-related questions, reach out to us:</p>
          <div className="bg-sc-yellow border-4 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-2">
            <p><strong>{BUSINESS}</strong> · Sole Proprietorship</p>
            <p>Owner: {OWNER}</p>
            <p>Address: {ADDRESS}</p>
            <p>Email: <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a></p>
            <p className="text-sm text-gray-600 mt-1">Support Hours: Monday–Saturday, 10 AM – 6 PM IST</p>
          </div>
        </Section>
      </section>
    </div>
  );
}
