// src/app/(user)/order-confirmation/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const FONT = "'Plus Jakarta Sans', sans-serif";
const HEADING = "'Titan One', cursive";

function formatPrice(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function OrderContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${orderNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setError("Order not found");
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 14, color: "#9F7AEA", letterSpacing: "0.2em", fontWeight: 700 }}>LOADING ORDER…</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#FFF8F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, textAlign: "center", padding: 24 }}>
      <div style={{ fontFamily: HEADING, fontSize: 48, marginBottom: 16, color: "#7C3AED" }}>Order Not Found</div>
      <div style={{ fontSize: 13, color: "#333", marginBottom: 32 }}>{error}</div>
      <Link href="/shop" style={{ color: "#FDE047", fontSize: 12, letterSpacing: "0.15em", fontWeight: 700 }}>← Return to Shop</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F0", color: "#1A1A1A", fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-beat { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes check-draw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px" }}>
        {/* Success icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          border: "4px solid #7C3AED",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          animation: "pulse-beat 2s infinite",
          background: "#EDE9FE",
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="60" strokeDashoffset="0"
              style={{ animation: "check-draw 0.6s ease 0.2s both" }} />
          </svg>
        </div>

        <div style={{ textAlign: "center", marginBottom: 48, animation: "fade-up 0.8s ease both" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "#9F7AEA", marginBottom: 12, fontWeight: 700 }}>✓ ORDER CONFIRMED</div>
          <h1 style={{ fontFamily: HEADING, fontSize: "clamp(40px,6vw,72px)", fontWeight: 400, lineHeight: 0.95, marginBottom: 16, color: "#7C3AED" }}>
            Thank You!<br />
            <span style={{ color: "#FDE047" }}>{order.customerName.split(" ")[0]}.</span>
          </h1>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
            Your order has been placed and is being prepared for shipment.
            We'll send updates to <span style={{ fontWeight: 700 }}>{order.customerEmail}</span>.
          </p>
        </div>

        {/* Order details card */}
        <div style={{
          background: "#FFFFFF",
          border: "4px solid #000",
          boxShadow: "8px 8px 0px 0px rgba(0,0,0,0.15)",
          borderRadius: "1.5rem", overflow: "hidden",
          marginBottom: 24,
          animation: "fade-up 0.8s ease 0.1s both",
        }}>
          {/* Header */}
          <div style={{ padding: "24px", borderBottom: "3px solid #EDE9FE", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F3E8FF" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#666", marginBottom: 4, fontWeight: 700 }}>ORDER #</div>
              <div style={{ fontSize: 18, fontFamily: HEADING, letterSpacing: "0.05em", color: "#7C3AED" }}>{order.orderNumber}</div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <div style={{ padding: "24px", borderBottom: "2px solid #EDE9FE" }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, marginBottom: 4, fontWeight: 700, color: "#1A1A1A" }}>{item.product.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </div>
                </div>
                <div style={{ fontFamily: HEADING, fontSize: 18, color: "#7C3AED" }}>{formatPrice(item.total)}</div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{ padding: "20px 24px", borderBottom: "2px solid #EDE9FE" }}>
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)} accent={order.shippingCharge === 0} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "2px solid #EDE9FE" }}>
              <span style={{ fontFamily: HEADING, fontSize: 20, color: "#1A1A1A" }}>Total</span>
              <span style={{ fontFamily: HEADING, fontSize: 22, color: "#9F7AEA" }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div style={{ padding: "24px", background: "#F9F5FF" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#666", marginBottom: 12, fontWeight: 700 }}>SHIPPING TO</div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: "#333" }}>
              <strong>{order.customerName}</strong><br />
              {order.addressLine1}
              {order.addressLine2 && <>, {order.addressLine2}</>}<br />
              {order.city}, {order.state} – {order.pincode}
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div style={{
          background: "#FEF3C7",
          border: "4px solid #FDE047",
          boxShadow: "6px 6px 0px 0px rgba(253,224,71,0.4)",
          borderRadius: "1.5rem", padding: "28px",
          marginBottom: 40,
          animation: "fade-up 0.8s ease 0.2s both",
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#92400E", marginBottom: 16, fontWeight: 700 }}>🚀 WHAT HAPPENS NEXT</div>
          {[
            ["📦", "We package your order within 1–2 business days"],
            ["🚚", "Shipped via standard courier (3–7 days across India)"],
            ["📲", "Your AR QR code gets activated once your product is shipped"],
            ["✨", "Scan, personalize, and experience your AR — forever"],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: "#1A1A1A", marginBottom: i < 3 ? 12 : 0, lineHeight: 1.6 }}>
              <span>{icon}</span> <strong>{text}</strong>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" style={{
            padding: "16px 32px", background: "#9F7AEA", border: "3px solid #7C3AED", boxShadow: "4px 4px 0px 0px rgba(124,58,237,0.3)",
            borderRadius: "2rem", color: "#FFF", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
            textDecoration: "none", fontFamily: HEADING, cursor: "pointer", display: "inline-block",
            transition: "all 0.2s",
          }} onMouseEnter={(e) => e.target.style.transform = "translate(2px, 2px)"} onMouseLeave={(e) => e.target.style.transform = "translate(0, 0)"}>
            ← Continue Shopping
          </Link>
          <Link href="/" style={{
            padding: "16px 32px", border: "3px solid #7C3AED", background: "#F3E8FF", boxShadow: "4px 4px 0px 0px rgba(124,58,237,0.2)",
            borderRadius: "2rem", color: "#7C3AED", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
            textDecoration: "none", fontFamily: HEADING, cursor: "pointer", display: "inline-block",
            transition: "all 0.2s",
          }} onMouseEnter={(e) => e.target.style.transform = "translate(2px, 2px)"} onMouseLeave={(e) => e.target.style.transform = "translate(0, 0)"}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#666" }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, color: accent ? "#22D3EE" : "#1A1A1A" }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: ["#FEF3C7", "#FDE047", "#92400E"],
    confirmed: ["#DDD6FE", "#7C3AED", "#5B21B6"],
    processing: ["#E0E7FF", "#6366F1", "#4F46E5"],
    shipped: ["#DCFCE7", "#22D3EE", "#0891B2"],
    delivered: ["#CCFBF1", "#14B8A6", "#0D9488"],
    cancelled: ["#FEE2E2", "#EF4444", "#DC2626"],
  };
  const [bg, color, border] = colors[status] || colors.pending;
  return (
    <div style={{
      padding: "6px 16px", borderRadius: "2rem", background: bg, border: `2px solid ${color}`,
      fontSize: 11, letterSpacing: "0.15em", color: border, textTransform: "uppercase", fontWeight: 700, fontFamily: HEADING,
    }}>
      {status}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderContent />
    </Suspense>
  );
}