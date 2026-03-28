// src/app/(admin)/admin/analytics/page.jsx
"use client";

import { useState, useEffect } from "react";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";
function fmt(p) { return `₹${((p || 0) / 100).toLocaleString("en-IN")}`; }

const STATUS_COLORS = {
  pending: "#C8A96E", confirmed: "#00E5FF", processing: "#00E5FF",
  shipped: "#64c864", delivered: "#64c864", cancelled: "#ff8080",
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/orders?limit=100"),
      ]);
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      setStats(statsData);
      setOrders(ordersData.orders || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  // Build last-30-days order timeline
  const timeline = (() => {
    if (!orders.length) return [];
    const days = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { date: key, orders: 0, revenue: 0 };
    }
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (days[key]) {
        days[key].orders++;
        days[key].revenue += o.total;
      }
    });
    return Object.values(days);
  })();

  const maxRevenue = Math.max(...timeline.map((d) => d.revenue), 1);

  // Top products by revenue
  const productRevenue = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const name = item.product?.name || "Unknown";
      if (!productRevenue[name]) productRevenue[name] = { revenue: 0, units: 0 };
      productRevenue[name].revenue += item.total;
      productRevenue[name].units += item.quantity;
    });
  });
  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 6);
  const maxProductRevenue = Math.max(...topProducts.map(([, v]) => v.revenue), 1);

  // Revenue by status
  const totalRevenue = orders.reduce((s, o) => s + (o.paymentStatus !== "failed" ? o.total : 0), 0);
  const deliveredRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "rgba(242,240,235,0.3)", fontSize: 11, letterSpacing: "0.2em", fontFamily: FONT }}>
      LOADING ANALYTICS…
    </div>
  );

  return (
    <div style={{ padding: "32px", fontFamily: FONT, color: "#F2F0EB", maxWidth: 1200 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');`}</style>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(0,229,255,0.7)", marginBottom: 6 }}>INSIGHTS</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300 }}>Analytics</h1>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 40 }}>
        {[
          { label: "Total Revenue", value: fmt(totalRevenue), accent: "#00E5FF" },
          { label: "Delivered Revenue", value: fmt(deliveredRevenue), accent: "#64c864" },
          { label: "Total Orders", value: stats?.totalOrders ?? 0, accent: "#C8A96E" },
          { label: "Total AR Scans", value: (stats?.totalScans ?? 0).toLocaleString(), accent: "#00E5FF" },
          { label: "Active Products", value: stats?.totalProducts ?? 0, accent: "#C8A96E" },
          { label: "Active Keychains", value: stats?.activeKeychains ?? 0, accent: "#00E5FF" },
        ].map((kpi, i) => (
          <div key={i} style={{ padding: "20px", background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(242,240,235,0.35)", marginBottom: 10 }}>{kpi.label.toUpperCase()}</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: kpi.accent, lineHeight: 1 }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart — last 30 days */}
      <div style={{ marginBottom: 40, background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, padding: "24px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 20 }}>REVENUE — LAST 30 DAYS</div>
        {timeline.every((d) => d.revenue === 0) ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(242,240,235,0.25)", fontSize: 12 }}>No revenue data yet</div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120, paddingBottom: 20, borderBottom: "1px solid rgba(242,240,235,0.06)" }}>
            {timeline.map((day, i) => {
              const h = Math.round((day.revenue / maxRevenue) * 100);
              const isToday = i === 29;
              return (
                <div key={day.date} title={`${day.date}: ${fmt(day.revenue)} (${day.orders} orders)`} style={{
                  flex: 1, minWidth: 4, height: `${Math.max(h, day.revenue > 0 ? 4 : 0)}%`,
                  background: isToday ? "#00E5FF" : day.revenue > 0 ? "rgba(0,229,255,0.4)" : "rgba(242,240,235,0.06)",
                  borderRadius: "2px 2px 0 0", cursor: "pointer", transition: "background 0.15s",
                }} />
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: "rgba(242,240,235,0.25)" }}>
          <span>{timeline[0]?.date.slice(5)}</span>
          <span>Today</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
        {/* Top products */}
        <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, padding: "24px" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 20 }}>TOP PRODUCTS BY REVENUE</div>
          {topProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(242,240,235,0.25)", fontSize: 12 }}>No data yet</div>
          ) : topProducts.map(([name, data], i) => {
            const pct = Math.round((data.revenue / maxProductRevenue) * 100);
            return (
              <div key={name} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: "rgba(242,240,235,0.7)" }}>{name}</span>
                  <span style={{ color: "#C8A96E", fontFamily: SERIF, fontStyle: "italic" }}>{fmt(data.revenue)}</span>
                </div>
                <div style={{ height: 4, background: "rgba(242,240,235,0.06)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: i === 0 ? "#00E5FF" : "rgba(0,229,255,0.4)", borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ fontSize: 9, color: "rgba(242,240,235,0.3)", marginTop: 3 }}>{data.units} units</div>
              </div>
            );
          })}
        </div>

        {/* Order status breakdown */}
        <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, padding: "24px" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 20 }}>ORDER STATUS BREAKDOWN</div>
          {!stats?.ordersByStatus || Object.keys(stats.ordersByStatus).length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(242,240,235,0.25)", fontSize: 12 }}>No data yet</div>
          ) : (
            <>
              {Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const pct = Math.round((count / (stats.totalOrders || 1)) * 100);
                const color = STATUS_COLORS[status] || "#888";
                return (
                  <div key={status} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.12em", color, textTransform: "uppercase" }}>{status}</span>
                      <span style={{ fontSize: 11 }}>{count} <span style={{ color: "rgba(242,240,235,0.35)", fontSize: 9 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 4, background: "rgba(242,240,235,0.06)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, opacity: 0.7, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}

              {/* COD vs paid */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(242,240,235,0.06)" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.35)", marginBottom: 12 }}>PAYMENT METHOD</div>
                {Object.entries(
                  orders.reduce((acc, o) => { acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + 1; return acc; }, {})
                ).map(([method, count]) => (
                  <div key={method} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: "rgba(242,240,235,0.55)", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.1em" }}>{method}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* AR scan stats */}
      <div style={{ background: "rgba(242,240,235,0.02)", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12, padding: "24px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(242,240,235,0.4)", marginBottom: 4 }}>AR ENGAGEMENT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24, marginTop: 20 }}>
          {[
            { label: "Total Scans", value: (stats?.totalScans ?? 0).toLocaleString(), accent: "#00E5FF" },
            { label: "Active Keychains", value: stats?.activeKeychains ?? 0, accent: "#C8A96E" },
            {
              label: "Avg Scans / Keychain",
              value: stats?.activeKeychains > 0
                ? ((stats?.totalScans ?? 0) / stats.activeKeychains).toFixed(1)
                : "—",
              accent: "#00E5FF",
            },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(242,240,235,0.35)", marginBottom: 8 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: item.accent }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}