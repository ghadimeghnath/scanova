// src/app/(admin)/admin/orders/page.jsx
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";
function fmt(p) { return `₹${((p || 0) / 100).toLocaleString("en-IN")}`; }

const STATUS_OPTS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending:    ["rgba(200,169,110,0.12)", "rgba(200,169,110,0.5)", "#C8A96E"],
  confirmed:  ["rgba(0,229,255,0.08)",   "rgba(0,229,255,0.4)",   "#00E5FF"],
  processing: ["rgba(0,229,255,0.08)",   "rgba(0,229,255,0.4)",   "#00E5FF"],
  shipped:    ["rgba(100,200,100,0.08)", "rgba(100,200,100,0.4)", "#64c864"],
  delivered:  ["rgba(100,200,100,0.12)", "rgba(100,200,100,0.5)", "#64c864"],
  cancelled:  ["rgba(255,80,80,0.08)",   "rgba(255,80,80,0.4)",   "#ff8080"],
};

function StatusBadge({ status }) {
  const [bg, border, color] = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return <span style={{ padding: "3px 10px", borderRadius: 20, background: bg, border: `1px solid ${border}`, fontSize: 9, letterSpacing: "0.15em", color, textTransform: "uppercase" }}>{status}</span>;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initStatus = searchParams.get("status") || "all";
  const focusId = searchParams.get("id");

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(initStatus);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, page, limit: 15 });
      if (search) params.set("search", search);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      if (focusId) {
        const found = (data.orders || []).find((o) => o.id === focusId || o.orderNumber === focusId);
        if (found) setSelected(found);
      }
    } catch {}
    setLoading(false);
  }, [status, search, page, focusId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(orderId, newStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.order) {
        setSelected(data.order);
        setOrders((prev) => prev.map((o) => o.id === orderId ? data.order : o));
      }
    } catch {}
    setUpdating(false);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", height: "100vh", fontFamily: FONT, color: "#F2F0EB" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap'); input::placeholder{color:rgba(242,240,235,0.25);}`}</style>

      {/* List panel */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "28px 28px 0", flexShrink: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(0,229,255,0.7)", marginBottom: 6 }}>MANAGE</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, marginBottom: 24 }}>Orders <span style={{ fontSize: 16, color: "rgba(242,240,235,0.3)", fontFamily: FONT, fontStyle: "normal" }}>({total})</span></h1>

          {/* Search + filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <input
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by order #, name, email…"
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", background: "rgba(242,240,235,0.04)", border: "1px solid rgba(242,240,235,0.1)", borderRadius: 8, color: "#F2F0EB", fontSize: 12, fontFamily: FONT, outline: "none" }}
            />
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              style={{ padding: "10px 14px", background: "#0d0d0f", border: "1px solid rgba(242,240,235,0.1)", borderRadius: 8, color: "#F2F0EB", fontSize: 11, fontFamily: FONT, outline: "none" }}>
              {STATUS_OPTS.map((s) => <option key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 28px 28px" }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 11 }}>Loading orders…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 12 }}>No orders found</div>
          ) : (
            <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, overflow: "hidden" }}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1fr 120px 100px", gap: 12, padding: "10px 20px", borderBottom: "1px solid rgba(242,240,235,0.05)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.35)" }}>
                <div>ORDER #</div><div>CUSTOMER</div><div>ITEMS</div><div>STATUS</div><div style={{ textAlign: "right" }}>TOTAL</div>
              </div>
              {orders.map((order, i) => (
                <div key={order.id} onClick={() => setSelected(selected?.id === order.id ? null : order)} style={{
                  display: "grid", gridTemplateColumns: "140px 1fr 1fr 120px 100px",
                  gap: 12, padding: "14px 20px", alignItems: "center", cursor: "pointer",
                  borderBottom: i < orders.length - 1 ? "1px solid rgba(242,240,235,0.04)" : "none",
                  background: selected?.id === order.id ? "rgba(0,229,255,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (selected?.id !== order.id) e.currentTarget.style.background = "rgba(242,240,235,0.03)"; }}
                onMouseLeave={(e) => { if (selected?.id !== order.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ fontSize: 11, letterSpacing: "0.05em" }}>{order.orderNumber}</div>
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{order.customerName}</div>
                    <div style={{ fontSize: 10, color: "rgba(242,240,235,0.4)" }}>{order.customerEmail}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(242,240,235,0.5)" }}>
                    {order.items?.slice(0, 2).map((it) => it.product?.name).join(", ")}
                    {order.items?.length > 2 && ` +${order.items.length - 2}`}
                  </div>
                  <div><StatusBadge status={order.status} /></div>
                  <div style={{ fontSize: 13, fontFamily: SERIF, fontStyle: "italic", textAlign: "right" }}>{fmt(order.total)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 15 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle(page === 1)}>← Prev</button>
              <span style={{ padding: "8px 12px", fontSize: 11, color: "rgba(242,240,235,0.4)" }}>Page {page} of {Math.ceil(total / 15)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)} style={pageBtnStyle(page >= Math.ceil(total / 15))}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ borderLeft: "1px solid rgba(242,240,235,0.06)", overflowY: "auto", background: "#0a0a0c" }}>
          <div style={{ padding: "28px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 6 }}>ORDER DETAIL</div>
                <div style={{ fontFamily: SERIF, fontSize: 20 }}>{selected.orderNumber}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(242,240,235,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Status update */}
            <div style={{ marginBottom: 24, padding: "16px", background: "rgba(242,240,235,0.03)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", marginBottom: 10 }}>UPDATE STATUS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STATUS_OPTS.filter(s => s !== "all").map((s) => {
                  const [bg, border, color] = STATUS_COLORS[s];
                  const isActive = selected.status === s;
                  return (
                    <button key={s} onClick={() => !isActive && updateStatus(selected.id, s)} disabled={updating || isActive} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 9, letterSpacing: "0.15em",
                      textTransform: "uppercase", cursor: isActive || updating ? "default" : "pointer",
                      background: isActive ? bg : "transparent",
                      border: `1px solid ${isActive ? border : "rgba(242,240,235,0.1)"}`,
                      color: isActive ? color : "rgba(242,240,235,0.4)",
                      fontFamily: FONT, transition: "all 0.15s",
                      opacity: updating ? 0.5 : 1,
                    }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer */}
            <Section title="CUSTOMER">
              <Row label="Name" value={selected.customerName} />
              <Row label="Email" value={selected.customerEmail} />
              <Row label="Phone" value={selected.customerPhone} />
            </Section>

            {/* Address */}
            <Section title="SHIPPING ADDRESS">
              <div style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(242,240,235,0.65)" }}>
                {selected.addressLine1}
                {selected.addressLine2 && <><br />{selected.addressLine2}</>}
                <br />{selected.city}, {selected.state} – {selected.pincode}
              </div>
            </Section>

            {/* Items */}
            <Section title="ITEMS">
              {selected.items?.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 12 }}>{item.product?.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(242,240,235,0.4)" }}>Qty: {item.quantity} × {fmt(item.unitPrice)}</div>
                  </div>
                  <div style={{ fontSize: 12, fontFamily: SERIF, fontStyle: "italic" }}>{fmt(item.total)}</div>
                </div>
              ))}
            </Section>

            {/* Pricing */}
            <Section title="PRICING">
              <Row label="Subtotal" value={fmt(selected.subtotal)} />
              <Row label="Shipping" value={selected.shippingCharge === 0 ? "FREE" : fmt(selected.shippingCharge)} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(242,240,235,0.06)" }}>
                <span style={{ fontFamily: SERIF, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: "#C8A96E" }}>{fmt(selected.total)}</span>
              </div>
            </Section>

            {/* Payment */}
            <Section title="PAYMENT">
              <Row label="Method" value={selected.paymentMethod?.toUpperCase()} />
              <Row label="Status" value={<StatusBadge status={selected.paymentStatus} />} />
              {selected.paymentId && <Row label="ID" value={selected.paymentId} />}
            </Section>

            {selected.notes && (
              <Section title="NOTES">
                <div style={{ fontSize: 12, color: "rgba(242,240,235,0.55)", lineHeight: 1.7 }}>{selected.notes}</div>
              </Section>
            )}

            <div style={{ fontSize: 10, color: "rgba(242,240,235,0.3)", marginTop: 16 }}>
              Placed: {new Date(selected.createdAt).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(242,240,235,0.05)" }}>
      <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.35)", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
      <span style={{ color: "rgba(242,240,235,0.4)" }}>{label}</span>
      <span style={{ color: "#F2F0EB" }}>{value}</span>
    </div>
  );
}

function pageBtnStyle(disabled) {
  return {
    padding: "8px 16px", background: "rgba(242,240,235,0.04)",
    border: "1px solid rgba(242,240,235,0.08)", borderRadius: 8,
    color: disabled ? "rgba(242,240,235,0.2)" : "rgba(242,240,235,0.6)",
    fontSize: 11, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Space Mono',monospace",
  };
}

export default function AdminOrdersPage() {
  return <Suspense><OrdersContent /></Suspense>;
}