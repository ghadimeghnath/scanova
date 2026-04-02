// src/app/(user)/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatPrice(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar","Chandigarh","Delhi",
  "Dadra & Nagar Haveli","Daman & Diu","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    paymentMethod: "cod",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
    try {
      const saved = sessionStorage.getItem("scanova_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(parsed);
        if (Object.keys(parsed).length === 0) router.replace("/shop");
      } else {
        router.replace("/shop");
      }
    } catch {
      router.replace("/shop");
    }
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {}
  }

  const cartItems = products
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({ ...p, quantity: cart[p.id] || 0 }));

  const subtotal = cartItems.reduce((s, p) => s + p.price * p.quantity, 0);
  const shipping = subtotal >= 99900 ? 0 : 4900;
  const total = subtotal + shipping;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) errs.customerEmail = "Valid email required";
    if (!/^[6-9]\d{9}$/.test(form.customerPhone.replace(/\s/g, ""))) errs.customerPhone = "Valid 10-digit number";
    if (!form.addressLine1.trim()) errs.addressLine1 = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.state) errs.state = "Required";
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = "Valid 6-digit pincode";
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      const items = cartItems.map((p) => ({ productId: p.id, quantity: p.quantity }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      sessionStorage.removeItem("scanova_cart");
      router.push(`/order-confirmation?order=${data.order.orderNumber}`);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  // New Helper for Funky Tailwind Inputs
  const getInputClass = (field) => {
    const base = "w-full px-4 py-3 bg-white border-4 rounded-xl font-sans font-bold text-black placeholder:text-gray-400 focus:outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all";
    const border = errors[field] ? "border-sc-pink bg-sc-pink/10" : "border-black";
    return `${base} ${border}`;
  };

  const labelClass = "block font-sans font-bold text-sm uppercase tracking-wider mb-2 text-black";

  return (
    <div className="bg-white min-h-screen w-full relative pb-10 overflow-hidden selection:bg-sc-yellow selection:text-black">
      
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 bg-white border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <Link 
          href="/shop" 
          className="font-heading text-xl md:text-2xl text-sc-purple uppercase tracking-tight hover:text-sc-pink transition-colors flex items-center gap-2 sc-btn-push"
        >
          <span className="text-2xl mt-[-4px]">←</span> Back to Shop
        </Link>
        <span className="font-handwritten text-xl text-sc-cyan hidden md:inline-block transform rotate-2 font-bold bg-black px-4 py-1 rounded-lg border-2 border-sc-cyan">
          CHECKOUT
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_min(450px,100%)] gap-12 items-start relative z-10">

        {/* Form */}
        <div>
          <h1 className="font-heading text-5xl md:text-7xl text-sc-yellow mb-10 uppercase leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Complete <br />
            <span className="text-sc-purple ">Your Order.</span>
          </h1>

          {errors.submit && (
            <div className="bg-sc-pink text-white border-4 border-black p-4 rounded-xl font-sans font-bold mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              ✗ {errors.submit}
            </div>
          )}

          {/* Contact */}
          <section className="mb-12">
            <div className="inline-block bg-sc-yellow border-4 border-black px-4 py-1 rounded-full mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              <h2 className="font-heading text-xl text-black uppercase">Contact Info</h2>
            </div>
            <div className="grid gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input className={getInputClass("customerName")} value={form.customerName} onChange={(e) => setField("customerName", e.target.value)} placeholder="Your full name" />
                {errors.customerName && <div className="text-sc-pink font-bold text-sm mt-1">{errors.customerName}</div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={getInputClass("customerEmail")} type="email" value={form.customerEmail} onChange={(e) => setField("customerEmail", e.target.value)} placeholder="you@example.com" />
                  {errors.customerEmail && <div className="text-sc-pink font-bold text-sm mt-1">{errors.customerEmail}</div>}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={getInputClass("customerPhone")} type="tel" value={form.customerPhone} onChange={(e) => setField("customerPhone", e.target.value)} placeholder="10-digit mobile" maxLength={10} />
                  {errors.customerPhone && <div className="text-sc-pink font-bold text-sm mt-1">{errors.customerPhone}</div>}
                </div>
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="mb-12">
            <div className="inline-block bg-sc-cyan border-4 border-black px-4 py-1 rounded-full mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <h2 className="font-heading text-xl text-black uppercase">Shipping Address</h2>
            </div>
            <div className="grid gap-6">
              <div>
                <label className={labelClass}>Address Line 1</label>
                <input className={getInputClass("addressLine1")} value={form.addressLine1} onChange={(e) => setField("addressLine1", e.target.value)} placeholder="House / Flat / Building" />
                {errors.addressLine1 && <div className="text-sc-pink font-bold text-sm mt-1">{errors.addressLine1}</div>}
              </div>
              <div>
                <label className={labelClass}>Address Line 2 (Optional)</label>
                <input className={getInputClass("addressLine2")} value={form.addressLine2} onChange={(e) => setField("addressLine2", e.target.value)} placeholder="Street, Area, Landmark" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>City</label>
                  <input className={getInputClass("city")} value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="Mumbai" />
                  {errors.city && <div className="text-sc-pink font-bold text-sm mt-1">{errors.city}</div>}
                </div>
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input className={getInputClass("pincode")} value={form.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, ""))} placeholder="400001" maxLength={6} />
                  {errors.pincode && <div className="text-sc-pink font-bold text-sm mt-1">{errors.pincode}</div>}
                </div>
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select className={`${getInputClass("state")} appearance-none cursor-pointer`} value={form.state} onChange={(e) => setField("state", e.target.value)}>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="mb-12">
            <div className="inline-block bg-sc-purple border-4 border-black px-4 py-1 rounded-full mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h2 className="font-heading text-xl text-white uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Payment Method</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
              ].map((method) => {
                const isSelected = form.paymentMethod === method.value;
                return (
                  <label key={method.value} className={`
                    flex items-center gap-4 p-5 rounded-2xl border-4 border-black cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-sc-yellow translate-x-1 translate-y-1 shadow-none' 
                      : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}
                  `}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method.value} 
                      checked={isSelected} 
                      onChange={() => setField("paymentMethod", method.value)} 
                      className="w-5 h-5 accent-sc-purple border-black" 
                    />
                    <span className="text-3xl">{method.icon}</span>
                    <div>
                      <div className="font-heading text-xl text-black">{method.label}</div>
                      <div className="font-sans font-bold text-sm text-gray-700">{method.desc}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Notes */}
          <section className="mb-8">
            <label className={labelClass}>Order Notes (Optional)</label>
            <textarea 
              value={form.notes} 
              onChange={(e) => setField("notes", e.target.value)} 
              placeholder="Any special instructions for the drop?" 
              rows={3} 
              className={getInputClass("notes")} 
            />
          </section>

          {/* Desktop Form Submit (Hidden on small, moves to Order Summary) */}
          <div className="hidden lg:block">
            <button onClick={handleSubmit} disabled={loading || cartItems.length === 0} className={`
              w-full py-5 rounded-2xl border-4 border-black font-heading text-2xl uppercase transition-all
              ${loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-sc-purple text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sc-btn-push'}
            `}>
              {loading ? "Processing..." : `Place Order · ${formatPrice(total)}`}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="sticky top-28">
          <div className="sc-card bg-white p-0 overflow-hidden transform rotate-1">
            
            <div className="bg-black p-6 border-b-4 border-black">
              <h2 className="font-heading text-3xl text-sc-cyan uppercase mb-1">Order Summary</h2>
              <div className="font-sans font-bold text-white text-sm">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</div>
            </div>

            <div className="p-6 bg-white">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start mb-4 pb-4 border-b-4 border-dashed border-gray-200">
                  <div>
                    <div className="font-heading text-xl text-black mb-1">{item.name}</div>
                    <div className="font-sans font-bold text-gray-500 text-sm">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-heading text-xl text-black">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}

              <div className="flex justify-between items-center mb-2 font-sans font-bold text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4 font-sans font-bold text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? "text-sc-purple font-heading text-lg uppercase" : "text-gray-600"}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              
              {shipping > 0 && (
                <div className="sc-slogan text-sm text-sc-purple text-right mb-4">
                  Free shipping on orders above ₹999
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t-4 border-black mt-4">
                <span className="font-heading text-2xl text-black uppercase">Total</span>
                <span className="font-heading text-3xl text-black ">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="bg-sc-yellow border-t-4 border-black p-4">
              {["Secure order processing", "Physical delivery across India", "AR code activated post-shipment"].map((t, i) => (
                <div key={i} className="flex items-start gap-2 font-sans font-bold text-xs text-black mb-2 last:mb-0">
                  <span className="text-sc-purple mt-[2px]">✦</span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Form Submit */}
          <div className="mt-8 block lg:hidden">
            <button onClick={handleSubmit} disabled={loading || cartItems.length === 0} className={`
              w-full py-5 rounded-2xl border-4 border-black font-heading text-2xl uppercase transition-all
              ${loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-sc-purple text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sc-btn-push'}
            `}>
              {loading ? "Processing..." : `Place Order · ${formatPrice(total)}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}