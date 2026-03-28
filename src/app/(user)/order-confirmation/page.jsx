// src/app/(user)/order-confirmation/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";

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
    <div style={{ minHeight: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 11, color: "rgba(242,240,235,0.3)", letterSpacing: "0.2em" }}>LOADING ORDER…</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#060608", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, textAlign: "center", padding: 24 }}>
      <div style={{ fontFamily: SERIF, fontSize: 32, marginBottom: 16, color: "#F2F0EB" }}>Order Not Found</div>
      <div style={{ fontSize: 12, color: "rgba(242,240,235,0.4)", marginBottom: 32 }}>{error}</div>
      <Link href="/shop" style={{ color: "#00E5FF", fontSize: 11, letterSpacing: "0.15em" }}>← Return to Shop</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "#F2F0EB", fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-glow { 0%,100% { box-shadow:0 0 20px rgba(0,229,255,0.2); } 50% { box-shadow:0 0 50px rgba(0,229,255,0.5); } }
        @keyframes check-draw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px" }}>
        {/* Success icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          border: "2px solid rgba(0,229,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          animation: "pulse-glow 3s infinite",
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l7 7 13-13" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="60" strokeDashoffset="0"
              style={{ animation: "check-draw 0.6s ease 0.2s both" }} />
          </svg>
        </div>

        <div style={{ textAlign: "center", marginBottom: 48, animation: "fade-up 0.8s ease both" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "#00E5FF", marginBottom: 16 }}>ORDER CONFIRMED</div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,6vw,72px)", fontWeight: 300, lineHeight: 0.95, marginBottom: 16 }}>
            Thank You,<br />
            <em style={{ color: "#C8A96E" }}>{order.customerName.split(" ")[0]}.</em>
          </h1>
          <p style={{ fontSize: 12, color: "rgba(242,240,235,0.45)", lineHeight: 1.8 }}>
            Your order has been placed and is being prepared for shipment.
            We'll send updates to {order.customerEmail}.
          </p>
        </div>

        {/* Order details card */}
        <div style={{
          background: "rgba(242,240,235,0.02)",
          border: "1px solid rgba(242,240,235,0.08)",
          borderRadius: 12, overflow: "hidden",
          marginBottom: 24,
          animation: "fade-up 0.8s ease 0.1s both",
        }}>
          {/* Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(242,240,235,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 4 }}>ORDER NUMBER</div>
              <div style={{ fontSize: 16, fontFamily: SERIF, letterSpacing: "0.1em" }}>{order.orderNumber}</div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(242,240,235,0.06)" }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, marginBottom: 2 }}>{item.product.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(242,240,235,0.4)" }}>
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </div>
                </div>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16 }}>{formatPrice(item.total)}</div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(242,240,235,0.06)" }}>
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)} accent={order.shippingCharge === 0} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(242,240,235,0.06)" }}>
              <span style={{ fontFamily: SERIF, fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: "#C8A96E" }}>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 12 }}>SHIPPING TO</div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(242,240,235,0.7)" }}>
              {order.customerName}<br />
              {order.addressLine1}
              {order.addressLine2 && <>, {order.addressLine2}</>}<br />
              {order.city}, {order.state} – {order.pincode}
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div style={{
          background: "rgba(0,229,255,0.03)",
          border: "1px solid rgba(0,229,255,0.12)",
          borderRadius: 12, padding: "24px",
          marginBottom: 40,
          animation: "fade-up 0.8s ease 0.2s both",
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#00E5FF", marginBottom: 16 }}>WHAT HAPPENS NEXT</div>
          {[
            ["📦", "We package your order within 1–2 business days"],
            ["🚚", "Shipped via standard courier (3–7 days across India)"],
            ["📲", "Your AR QR code gets activated once your product is shipped"],
            ["✨", "Scan, personalize, and experience your AR — forever"],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(242,240,235,0.6)", marginBottom: i < 3 ? 10 : 0, lineHeight: 1.6 }}>
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" style={{
            padding: "14px 32px", background: "#00E5FF", borderRadius: 40,
            color: "#000", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
            textDecoration: "none", fontFamily: FONT,
          }}>
            ← Continue Shopping
          </Link>
          <Link href="/" style={{
            padding: "14px 32px", border: "1px solid rgba(242,240,235,0.15)", borderRadius: 40,
            color: "rgba(242,240,235,0.6)", fontSize: 12, letterSpacing: "0.1em",
            textDecoration: "none", fontFamily: FONT,
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "rgba(242,240,235,0.5)" }}>
      <span>{label}</span>
      <span style={{ color: accent ? "#00E5FF" : undefined }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: ["rgba(200,169,110,0.15)", "rgba(200,169,110,0.5)", "#C8A96E"],
    confirmed: ["rgba(0,229,255,0.1)", "rgba(0,229,255,0.4)", "#00E5FF"],
    processing: ["rgba(0,229,255,0.1)", "rgba(0,229,255,0.4)", "#00E5FF"],
    shipped: ["rgba(100,200,100,0.1)", "rgba(100,200,100,0.4)", "#64c864"],
    delivered: ["rgba(100,200,100,0.15)", "rgba(100,200,100,0.5)", "#64c864"],
    cancelled: ["rgba(255,80,80,0.1)", "rgba(255,80,80,0.4)", "#ff8080"],
  };
  const [bg, border, color] = colors[status] || colors.pending;
  return (
    <div style={{
      padding: "4px 14px", borderRadius: 20, background: bg, border: `1px solid ${border}`,
      fontSize: 9, letterSpacing: "0.2em", color, textTransform: "uppercase",
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