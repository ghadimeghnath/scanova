"use client";
import Link from "next/link";

const EFFECTIVE_DATE = "1 July 2025";
const OWNER = "Meghnath Mahesh Ghadi";
const BUSINESS = "SCANOVA";
const EMAIL = "support@scanova.in";
const WEBSITE = "scanova-ashen.vercel.app";
const ADDRESS = "123, Example Street, Sector 5, Pune, Maharashtra – 411001, India";

function Section({ title, children }) {
  return (
    <div className="sc-card mb-6">
      <h2 className="font-heading text-2xl text-sc-purple mb-4 [-webkit-text-stroke:1px_black]">{title}</h2>
      <div className="font-sans text-gray-700 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
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
      <section className="pt-32 pb-12 px-4 md:px-12 text-center bg-sc-cyan border-b-4 border-black">
        <h1 className="font-heading text-[clamp(36px,8vw,100px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">
          TERMS OF<br />SERVICE
        </h1>
        <div className="bg-sc-yellow border-4 border-black rounded-full px-6 py-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-heading text-black text-sm uppercase tracking-widest">Effective Date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-16 px-4 md:px-12 max-w-[900px] mx-auto">

        {/* Intro */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <p className="font-sans font-bold text-black leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your use of the SCANOVA website at <strong>{WEBSITE}</strong> and the purchase of products and AR experiences offered by <strong>{BUSINESS}</strong>, a sole proprietorship owned by <strong>{OWNER}</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing our Website or placing an order, you agree to be bound by these Terms. If you do not agree, please do not use our Website.
          </p>
        </div>

        <Section title="1. Business Information">
          <div className="bg-sc-yellow border-4 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p><strong>Business Name:</strong> {BUSINESS}</p>
            <p><strong>Business Type:</strong> Sole Proprietorship</p>
            <p><strong>Owner:</strong> {OWNER}</p>
            <p><strong>Registered Address:</strong> {ADDRESS}</p>
            <p><strong>Contact Email:</strong> <a href={`mailto:${EMAIL}`} className="text-sc-purple underline">{EMAIL}</a></p>
            <p><strong>Website:</strong> {WEBSITE}</p>
            <p><strong>GSTIN:</strong> Not Applicable</p>
          </div>
        </Section>

        <Section title="2. Products and AR Experiences">
          <p>SCANOVA sells physical AR-enabled merchandise (keychains and stickers) embedded with QR codes. Each product grants access to a unique digital Augmented Reality experience viewable via any modern mobile browser — no app download required.</p>
          <p>Product images on the Website are representative. Minor variations in physical products may occur due to the handcrafted or printed nature of the merchandise.</p>
          <p>AR experiences are powered by Three.js and MindAR, run client-side in the user&apos;s browser, and require camera permission. SCANOVA does not guarantee performance on all device models.</p>
        </Section>

        <Section title="3. Pricing and Payment">
          <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. Shipping charges are calculated at checkout based on order value:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Orders below ₹300: ₹60 shipping charge applies</li>
            <li>Orders of ₹300 and above: Free shipping</li>
          </ul>
          <p>Payments are processed securely via <strong>PhonePe Payment Gateway</strong>. SCANOVA does not store any card, UPI, or banking credentials. By completing a purchase, you agree to PhonePe&apos;s Terms of Service and Privacy Policy.</p>
          <p>Cash on Delivery (COD) may be available for select pin codes. COD eligibility is shown at checkout.</p>
        </Section>

        <Section title="4. Order Confirmation and Processing">
          <p>An order is confirmed only after successful payment processing. You will receive an order confirmation with a unique order number (e.g. SCNV-00001) on the confirmation page. Please save your order number.</p>
          <p>Orders are typically dispatched within 1–2 business days. We reserve the right to cancel an order in case of product unavailability, payment failure, or suspected fraud, in which case a full refund will be issued.</p>
        </Section>

        <Section title="5. Shipping and Delivery">
          <p>All orders are shipped via <strong>India Post Speed Post</strong> within India only. We do not currently offer international shipping.</p>
          <p>Estimated delivery time is <strong>3–7 business days</strong> from dispatch. Delivery timelines are estimates and may vary due to factors beyond our control including postal delays, remote locations, and public holidays.</p>
          <p>SCANOVA is not liable for delays caused by India Post or incorrect addresses provided by the customer. Please ensure your shipping address is accurate before placing an order.</p>
        </Section>

        <Section title="6. Returns and Refunds">
          <p><strong>No Returns Policy:</strong> Due to our shipping partner (India Post), we are unable to facilitate product returns once an order is dispatched. All sales are considered final upon dispatch.</p>
          <p><strong>Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, you must notify us at <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a> within <strong>48 hours of delivery</strong> with your order number and photo/video evidence. Valid claims will be resolved via a free replacement shipment at our discretion.</p>
          <p><strong>Cash Refunds:</strong> Cash refunds are issued only in cases where SCANOVA is unable to fulfil your order (e.g. out-of-stock after payment). In all other circumstances, we offer a replacement or store credit. Refunds, where applicable, will be processed to the original payment method within 7–10 business days.</p>
          <p>For the complete Refund Policy, please see our <Link href="/refunds" className="text-sc-purple underline font-bold">Refund Policy</Link> page.</p>
        </Section>

        <Section title="7. AR Experience Terms">
          <p>By claiming and customising your AR experience, you confirm:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You own the rights to any photo you upload or have the permission of the person in the photo.</li>
            <li>You will not upload content that is illegal, obscene, defamatory, or infringes on third-party intellectual property rights.</li>
            <li>You understand that the AR experience linked to your QR code is publicly viewable by anyone who scans it.</li>
          </ul>
          <p>SCANOVA reserves the right to deactivate any AR experience that violates these terms without prior notice.</p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>All content on the SCANOVA Website — including logos, product designs, graphics, and AR experiences developed by us — is the intellectual property of SCANOVA and Meghnath Mahesh Ghadi. You may not reproduce, copy, distribute, or create derivative works without express written permission.</p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>SCANOVA shall not be liable for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Delays in delivery caused by India Post or force majeure events</li>
            <li>Device incompatibility affecting the AR experience</li>
            <li>Loss of data due to third-party service failures (Cloudinary, Vercel, PhonePe)</li>
            <li>Indirect, incidental, or consequential damages arising from use of our products or Website</li>
          </ul>
          <p>Our total liability to you for any claim shall not exceed the amount paid by you for the specific order in question.</p>
        </Section>

        <Section title="10. Governing Law and Jurisdiction">
          <p>These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts in <strong>Pune, Maharashtra, India</strong>.</p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>We reserve the right to update these Terms at any time. Changes will be posted on this page with a revised effective date. Continued use of our Website after any updates constitutes acceptance of the revised Terms.</p>
        </Section>

        <Section title="12. Contact">
          <p>For any questions about these Terms, please contact:</p>
          <div className="bg-sc-yellow border-4 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-2">
            <p><strong>{BUSINESS}</strong> · Sole Proprietorship</p>
            <p>Owner: {OWNER}</p>
            <p>Address: {ADDRESS}</p>
            <p>Email: <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a></p>
          </div>
        </Section>
      </section>

    </div>
  );
}
