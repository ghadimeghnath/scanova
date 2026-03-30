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

export default function PrivacyPage() {
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
      <section className="pt-32 pb-12 px-4 md:px-12 text-center bg-sc-purple border-b-4 border-black">
        <h1 className="font-heading text-[clamp(36px,8vw,100px)] leading-none text-white [-webkit-text-stroke:3px_black] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-4">
          PRIVACY<br />POLICY
        </h1>
        <div className="bg-sc-yellow border-4 border-black rounded-full px-6 py-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-heading text-black text-sm uppercase tracking-widest">Effective Date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-16 px-4 md:px-12 max-w-[900px] mx-auto">

        {/* Intro */}
        <div className="bg-sc-yellow border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <p className="font-sans font-bold text-black leading-relaxed">
            This Privacy Policy describes how <strong>{BUSINESS}</strong> (a sole proprietorship owned by <strong>{OWNER}</strong>, hereinafter referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, stores, and protects your personal information when you visit or make a purchase from <strong>{WEBSITE}</strong> (the &quot;Website&quot;). By using our Website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect the following categories of personal information when you interact with our Website:</p>
          <p><strong>a) Information you provide directly:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number (10-digit Indian mobile number)</li>
            <li>Shipping address (street, city, state, pin code)</li>
            <li>Order details and items purchased</li>
            <li>Photos and messages uploaded for AR experience customisation (keychain/sticker)</li>
          </ul>
          <p><strong>b) Information collected automatically:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>IP address and approximate geographic location</li>
            <li>Browser type and version</li>
            <li>Device type (mobile/desktop)</li>
            <li>Pages visited and time spent on site</li>
            <li>QR code scan activity and AR experience engagement metrics</li>
          </ul>
          <p><strong>c) Payment information:</strong><br />
          All payment processing is handled by PhonePe Payment Gateway. We do <strong>not</strong> collect, store, or process your credit/debit card numbers, UPI IDs, or banking credentials. Payment data is governed by PhonePe&apos;s privacy policy.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your personal information for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>To process and fulfil your orders</li>
            <li>To dispatch and track your shipment via India Post Speed Post</li>
            <li>To provide and personalise your AR experience</li>
            <li>To respond to your customer support queries</li>
            <li>To send you order confirmation and status updates</li>
            <li>To detect, investigate, and prevent fraudulent transactions and abuse</li>
            <li>To comply with legal obligations under applicable Indian law</li>
          </ul>
        </Section>

        <Section title="3. Sharing of Information">
          <p>We do not sell, rent, or trade your personal information to third parties. We share your data only in the following circumstances:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>India Post:</strong> We share your name, address, and phone number with India Post Speed Post for order delivery.</li>
            <li><strong>PhonePe Payment Gateway:</strong> Your payment information is processed by PhonePe. We share the minimum order details required for payment processing.</li>
            <li><strong>Cloudinary:</strong> Photos uploaded for AR experiences are stored securely on Cloudinary&apos;s image hosting service.</li>
            <li><strong>Legal compliance:</strong> We may disclose your information if required by law, court order, or government authority in India.</li>
          </ul>
        </Section>

        <Section title="4. Data Storage and Security">
          <p>Your data is stored on secure servers hosted on Vercel (cloud infrastructure) and a PostgreSQL database. We implement industry-standard security measures including:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>HTTPS encryption for all data transmission</li>
            <li>HTTP-only secure cookies for session management</li>
            <li>No storage of payment credentials on our servers</li>
          </ul>
          <p>While we take reasonable precautions, no method of electronic transmission is 100% secure. We cannot guarantee absolute security of your data.</p>
        </Section>

        <Section title="5. Cookies">
          <p>We use essential session cookies to maintain your session while using our Website. We do not currently use third-party tracking or advertising cookies. By using our Website, you consent to the use of these essential cookies.</p>
        </Section>

        <Section title="6. AR Experience Data (User-Uploaded Content)">
          <p>When you claim your keychain AR experience, you upload a personal photo and message. This content is:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Stored on Cloudinary and linked to your unique QR code</li>
            <li>Visible to anyone who scans your QR code (this is the intended function of the product)</li>
            <li>Not used for any advertising, profiling, or third-party sharing purposes</li>
          </ul>
          <p>If you wish to have your uploaded content removed, contact us at <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a>.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>As a user, you have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate personal data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a> with your request. We will respond within 30 days.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>Our Website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has submitted personal information to us, please contact us immediately at <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a>.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. The revised policy will be posted on this page with an updated effective date. Continued use of the Website after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>For any questions or concerns regarding this Privacy Policy, please contact:</p>
          <div className="bg-sc-yellow border-4 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-2">
            <p><strong>{BUSINESS}</strong> (Sole Proprietorship)</p>
            <p>Owner: <strong>{OWNER}</strong></p>
            <p>Address: {ADDRESS}</p>
            <p>Email: <a href={`mailto:${EMAIL}`} className="text-sc-purple underline font-bold">{EMAIL}</a></p>
            <p>Website: {WEBSITE}</p>
          </div>
        </Section>
      </section>

    </div>
  );
}
