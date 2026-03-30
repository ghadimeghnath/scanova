// src/app/(admin)/admin/products/page.jsx
"use client";

import { useState, useEffect } from "react";

const FONT = "'Space Mono','Courier New',monospace";
const SERIF = "'Cormorant Garamond',Georgia,serif";
function fmt(p) { return `₹${((p || 0) / 100).toLocaleString("en-IN")}`; }

const THEMES = ["love", "celebration", "memory", "achievement", "custom"];
const DEFAULT_KEYCHAIN_FEATURES = ["MindAR image tracking", "Custom photo + text in AR", "Particle burst on placement", "Permanent — activated once"];
const DEFAULT_STICKER_FEATURES = ["Image recognition tracking", "3D chrome art overlay", "Safari + Chrome ready", "60fps on mid-range phones"];

const BLANK = {
  name: "", description: "", type: "keychain", price: "",
  stock: "", imageUrl: "", features: [], theme: "love",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // product id being edited
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products?all=true");
      // Admin needs all products including inactive — we'll update the API
      const res2 = await fetch("/api/products");
      const data = await res2.json();
      setProducts(data.products || []);
    } catch {}
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...BLANK, features: [...DEFAULT_KEYCHAIN_FEATURES] });
    setFeatureInput("");
    setError("");
    setShowForm(true);
  }

  function openEdit(product) {
    setEditing(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      type: product.type,
      price: (product.price / 100).toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || "",
      features: [...(product.features || [])],
      theme: product.theme || "love",
    });
    setFeatureInput("");
    setError("");
    setShowForm(true);
  }

  function setField(key, value) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-fill features when type changes in create mode
      if (key === "type" && !editing) {
        next.features = value === "keychain" ? [...DEFAULT_KEYCHAIN_FEATURES] : [...DEFAULT_STICKER_FEATURES];
      }
      return next;
    });
  }

  function addFeature() {
    if (!featureInput.trim()) return;
    setForm((f) => ({ ...f, features: [...f.features, featureInput.trim()] }));
    setFeatureInput("");
  }

  function removeFeature(i) {
    setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.stock) {
      setError("Name, price and stock are required"); return;
    }
    setSaving(true); setError("");
    try {
      const payload = { ...form };
      const url = editing ? `/api/products/${editing}` : "/api/products";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccess(editing ? "Product updated!" : "Product created!");
      setShowForm(false);
      await fetchProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) { setError(e.message); }
    setSaving(false);
  }

  async function toggleActive(product) {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      await fetchProducts();
    } catch {}
  }

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "rgba(242,240,235,0.04)", border: "1px solid rgba(242,240,235,0.1)",
    borderRadius: 8, color: "#F2F0EB", fontSize: 12, fontFamily: FONT, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "32px", fontFamily: FONT, color: "#F2F0EB", maxWidth: 1200 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap'); input::placeholder,textarea::placeholder{color:rgba(242,240,235,0.25);} select option{background:#1a1a1f;}`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(0,229,255,0.7)", marginBottom: 6 }}>INVENTORY</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300 }}>Products</h1>
        </div>
        <button onClick={openCreate} style={{
          padding: "12px 24px", background: "#00E5FF", border: "none", borderRadius: 40,
          color: "#000", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", fontFamily: FONT,
        }}>+ Add Product</button>
      </div>

      {success && <div style={{ padding: "12px 16px", background: "rgba(100,200,100,0.08)", border: "1px solid rgba(100,200,100,0.3)", borderRadius: 8, color: "#64c864", fontSize: 12, marginBottom: 20 }}>{success}</div>}

      {/* Product form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 560, background: "#0d0d0f", border: "1px solid rgba(242,240,235,0.1)", borderRadius: 16, padding: "32px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 300 }}>{editing ? "Edit Product" : "New Product"}</div>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "rgba(242,240,235,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {error && <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 8, color: "#ff8080", fontSize: 12, marginBottom: 16 }}>{error}</div>}

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>PRODUCT NAME</label>
                <input style={inputStyle} value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. AR Keychain – Love Edition" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>TYPE</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.type} onChange={(e) => setField("type", e.target.value)}>
                    <option value="keychain">Keychain</option>
                    <option value="sticker">Sticker</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>PRICE (₹)</label>
                  <input style={inputStyle} type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="499" min="0" />
                </div>
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>STOCK</label>
                  <input style={inputStyle} type="number" value={form.stock} onChange={(e) => setField("stock", e.target.value)} placeholder="100" min="0" />
                </div>
              </div>

              {form.type === "keychain" && (
                <div>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>THEME</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.theme} onChange={(e) => setField("theme", e.target.value)}>
                    {THEMES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Product description shown in shop" />
              </div>

              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 6 }}>IMAGE URL (CLOUDINARY)</label>
                <input style={inputStyle} value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} placeholder="https://res.cloudinary.com/…" />
              </div>

              {/* Features */}
              <div>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(242,240,235,0.4)", display: "block", marginBottom: 8 }}>FEATURES</label>
                {form.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 8, color: "#00E5FF" }}>✦</span>
                    <span style={{ flex: 1, fontSize: 12, color: "rgba(242,240,235,0.7)" }}>{f}</span>
                    <button onClick={() => removeFeature(i)} style={{ background: "none", border: "none", color: "rgba(255,80,80,0.5)", cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFeature()}
                    placeholder="Add feature and press Enter" />
                  <button onClick={addFeature} style={{ padding: "11px 16px", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 8, color: "#00E5FF", cursor: "pointer", fontSize: 12, fontFamily: FONT }}>+</button>
                </div>
              </div>

              <button onClick={handleSave} disabled={saving} style={{
                padding: "14px", background: saving ? "rgba(255,255,255,0.06)" : "#00E5FF",
                border: "none", borderRadius: 10, color: saving ? "rgba(242,240,235,0.3)" : "#000",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: saving ? "not-allowed" : "pointer", fontFamily: FONT,
              }}>
                {saving ? "SAVING…" : editing ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products list */}
      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "rgba(242,240,235,0.3)", fontSize: 11 }}>Loading products…</div>
      ) : products.length === 0 ? (
        <div style={{ padding: 80, textAlign: "center", border: "1px solid rgba(242,240,235,0.07)", borderRadius: 12 }}>
          <div style={{ fontFamily: SERIF, fontSize: 28, marginBottom: 12 }}>No Products Yet</div>
          <div style={{ fontSize: 12, color: "rgba(242,240,235,0.4)", marginBottom: 24 }}>Add your first product to start selling.</div>
          <button onClick={openCreate} style={{ padding: "12px 28px", background: "#00E5FF", border: "none", borderRadius: 40, color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.1em" }}>+ Add First Product</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {products.map((product) => (
            <div key={product.id} style={{
              display: "grid", gridTemplateColumns: "1fr auto auto auto",
              gap: 20, alignItems: "center", padding: "20px 24px",
              background: product.isActive ? "rgba(242,240,235,0.02)" : "rgba(242,240,235,0.01)",
              border: `1px solid ${product.isActive ? "rgba(242,240,235,0.07)" : "rgba(242,240,235,0.03)"}`,
              borderRadius: 12, opacity: product.isActive ? 1 : 0.5,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, letterSpacing: "0.2em", color: product.type === "keychain" ? "#C8A96E" : "#00E5FF" }}>
                    {product.type.toUpperCase()}
                  </span>
                  {!product.isActive && <span style={{ fontSize: 9, color: "rgba(255,80,80,0.6)", letterSpacing: "0.15em" }}>INACTIVE</span>}
                </div>
                <div style={{ fontSize: 16, fontFamily: SERIF, fontWeight: 300, marginBottom: 4 }}>{product.name}</div>
                <div style={{ fontSize: 11, color: "rgba(242,240,235,0.4)" }}>
                  {fmt(product.price)} · Stock: <span style={{ color: product.stock <= 5 ? "#ff8080" : "rgba(242,240,235,0.4)" }}>{product.stock}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(242,240,235,0.3)", textAlign: "right" }}>
                {product.theme && product.type === "keychain" && <div>Theme: {product.theme}</div>}
              </div>
              <button onClick={() => openEdit(product)} style={{
                padding: "8px 18px", background: "rgba(242,240,235,0.06)", border: "1px solid rgba(242,240,235,0.1)",
                borderRadius: 8, color: "rgba(242,240,235,0.7)", fontSize: 10, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.1em",
              }}>Edit</button>
              <button onClick={() => toggleActive(product)} style={{
                padding: "8px 18px",
                background: product.isActive ? "rgba(255,80,80,0.08)" : "rgba(100,200,100,0.08)",
                border: `1px solid ${product.isActive ? "rgba(255,80,80,0.3)" : "rgba(100,200,100,0.3)"}`,
                borderRadius: 8,
                color: product.isActive ? "#ff8080" : "#64c864",
                fontSize: 10, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.1em",
              }}>
                {product.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}