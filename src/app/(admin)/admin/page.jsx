// src/app/(admin)/admin/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";

function fmt(paise) { return `₹${((paise || 0) / 100).toLocaleString("en-IN")}`; }
function growth(v) {
  if (v === null || v === undefined) return null;
  const n = parseFloat(v);
  return { val: Math.abs(n).toFixed(1), up: n >= 0 };
}

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
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, background: bg, border: `1px solid ${border}`, fontSize: 9, letterSpacing: "0.15em", color, textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "rgba(242,240,235,0.3)", fontSize: 11, letterSpacing: "0.2em" }}>
      LOADING DASHBOARD…
    </div>
  );

  const revenueGrowth = growth(stats?.revenueGrowth);
  const orderGrowth = growth(stats?.orderGrowth);

  const STAT_CARDS = [
    {
      label: "Revenue This Month",
      value: fmt(stats?.revenueThisMonth),
      growth: revenueGrowth,
      accent: "#00E5FF",
      sub: "Excluding failed payments",
    },
    {
      label: "Orders This Month",
      value: stats?.ordersThisMonth ?? 0,
      growth: orderGrowth,
      accent: "#C8A96E",
      sub: `${stats?.totalOrders ?? 0} total orders`,
    },
    {
      label: "Active Products",
      value: stats?.totalProducts ?? 0,
      accent: "#00E5FF",
      sub: "In inventory",
    },
    {
      label: "Total AR Scans",
      value: (stats?.totalScans ?? 0).toLocaleString(),
      accent: "#C8A96E",
      sub: `${stats?.activeKeychains ?? 0} active keychains`,
    },
  ];

  return (
    <div style={{ padding: "32px", fontFamily: FONT, color: "#F2F0EB", maxWidth: 1400 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');`}</style>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(0,229,255,0.7)", marginBottom: 8 }}>
          OVERVIEW
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300 }}>
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 40 }}>
        {STAT_CARDS.map((card, i) => (
          <div key={i} style={{
            padding: "24px", background: "rgba(242,240,235,0.02)",
            border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12,
          }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", marginBottom: 16 }}>
              {card.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 36, fontStyle: "italic", color: card.accent, marginBottom: 8, lineHeight: 1 }}>
              {card.value}
            </div>
            {card.growth && (
              <div style={{ fontSize: 10, color: card.growth.up ? "#64c864" : "#ff8080", marginBottom: 4 }}>
                {card.growth.up ? "↑" : "↓"} {card.growth.val}% vs last month
              </div>
            )}
            <div style={{ fontSize: 10, color: "rgba(242,240,235,0.3)" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      {stats?.ordersByStatus && Object.keys(stats.ordersByStatus).length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(242,240,235,0.4)", marginBottom: 16 }}>ORDER STATUS BREAKDOWN</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const [bg, border, color] = STATUS_COLORS[status] || STATUS_COLORS.pending;
              return (
                <Link key={status} href={`/admin/orders?status=${status}`} style={{
                  padding: "10px 18px", background: bg, border: `1px solid ${border}`,
                  borderRadius: 20, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>{count}</span>
                  <span style={{ fontSize: 9, letterSpacing: "0.15em", color, textTransform: "uppercase" }}>{status}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(340px,100%)", gap: 24, alignItems: "start" }}>
        {/* Recent orders */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(242,240,235,0.4)" }}>RECENT ORDERS</div>
            <Link href="/admin/orders" style={{ fontSize: 10, color: "#00E5FF", letterSpacing: "0.1em" }}>View All →</Link>
          </div>
          <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, overflow: "hidden" }}>
            {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 12 }}>
                No orders yet
              </div>
            ) : (
              stats.recentOrders.map((order, i) => (
                <Link key={order.id} href={`/admin/orders?id=${order.id}`} style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto",
                  gap: 16, alignItems: "center",
                  padding: "14px 20px",
                  borderBottom: i < stats.recentOrders.length - 1 ? "1px solid rgba(242,240,235,0.04)" : "none",
                  transition: "background 0.15s", color: "#F2F0EB",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(242,240,235,0.03)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 3 }}>{order.orderNumber}</div>
                    <div style={{ fontSize: 10, color: "rgba(242,240,235,0.4)" }}>{order.customerName}</div>
                  </div>
                  <StatusBadge status={order.status} />
                  <div style={{ fontSize: 12, fontFamily: SERIF, fontStyle: "italic", textAlign: "right" }}>
                    {fmt(order.total)}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low stock alerts */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(242,240,235,0.4)" }}>LOW STOCK ALERTS</div>
            <Link href="/admin/products" style={{ fontSize: 10, color: "#00E5FF", letterSpacing: "0.1em" }}>Manage →</Link>
          </div>
          <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, overflow: "hidden" }}>
            {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 12 }}>
                All products well-stocked
              </div>
            ) : (
              stats.lowStockProducts.map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px",
                  borderBottom: i < stats.lowStockProducts.length - 1 ? "1px solid rgba(242,240,235,0.04)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(242,240,235,0.4)" }}>{p.type.toUpperCase()}</div>
                  </div>
                  <div style={{
                    padding: "4px 12px", borderRadius: 20,
                    background: p.stock === 0 ? "rgba(255,80,80,0.1)" : "rgba(200,169,110,0.1)",
                    border: `1px solid ${p.stock === 0 ? "rgba(255,80,80,0.4)" : "rgba(200,169,110,0.4)"}`,
                    fontSize: 11, fontWeight: 700,
                    color: p.stock === 0 ? "#ff8080" : "#C8A96E",
                  }}>
                    {p.stock === 0 ? "OUT" : `${p.stock} left`}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(242,240,235,0.4)", marginBottom: 12 }}>QUICK ACTIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/admin/products", label: "Add New Product", icon: "+" },
                { href: "/admin/experiences", label: "Generate QR Codes", icon: "◫" },
                { href: "/admin/orders", label: "View All Orders", icon: "→" },
              ].map((a) => (
                <Link key={a.href} href={a.href} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", background: "rgba(242,240,235,0.03)",
                  border: "1px solid rgba(242,240,235,0.07)", borderRadius: 8,
                  color: "rgba(242,240,235,0.6)", fontSize: 11, letterSpacing: "0.1em",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.05)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"; e.currentTarget.style.color = "#F2F0EB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(242,240,235,0.03)"; e.currentTarget.style.borderColor = "rgba(242,240,235,0.07)"; e.currentTarget.style.color = "rgba(242,240,235,0.6)"; }}
                >
                  <span style={{ width: 20, fontSize: 14 }}>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}