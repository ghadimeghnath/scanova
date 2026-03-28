// src/app/(user)/shop/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatPrice(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load cart from sessionStorage
    try {
      const saved = sessionStorage.getItem("scanova_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function saveCart(newCart) {
    setCart(newCart);
    sessionStorage.setItem("scanova_cart", JSON.stringify(newCart));
  }

  function addToCart(productId) {
    const newCart = { ...cart, [productId]: (cart[productId] || 0) + 1 };
    saveCart(newCart);
  }

  function removeFromCart(productId) {
    const newCart = { ...cart };
    if (newCart[productId] > 1) {
      newCart[productId]--;
    } else {
      delete newCart[productId];
    }
    saveCart(newCart);
  }

  const cartTotal = products.reduce((sum, p) => sum + (cart[p.id] || 0), 0);
  const cartValue = products.reduce((sum, p) => sum + ((cart[p.id] || 0) * p.price), 0);

  function goToCheckout() {
    const cartItems = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));
    sessionStorage.setItem("scanova_cart", JSON.stringify(cart));
    router.push("/checkout");
  }

  const keychains = products.filter((p) => p.type === "keychain");
  const stickers = products.filter((p) => p.type === "sticker");

  return (
    <div className="min-h-screen w-full relative pb-32 overflow-hidden selection:bg-sc-pink selection:text-white">
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-[20%] right-[5%] sc-blob bg-sc-pink w-48 h-48 border-4 border-black animate-funky -z-10 opacity-30 md:opacity-80"></div>
      <div className="fixed bottom-[10%] left-[5%] sc-blob bg-sc-cyan w-64 h-64 border-4 border-black animate-funky -z-10 opacity-30 md:opacity-80" style={{ animationDelay: '1.5s' }}></div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 bg-white border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <Link 
          href="/" 
          className="font-heading text-2xl md:text-3xl text-sc-purple uppercase tracking-tight hover:text-sc-pink transition-colors"
        >
          Scanova
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <Link 
            href="/#how" 
            className="hidden md:block font-sans font-bold text-sm uppercase tracking-wider text-black border-b-2 border-transparent hover:border-black transition-all"
          >
            How it Works
          </Link>
          {cartTotal > 0 && (
            <button 
              onClick={goToCheckout} 
              className="sc-btn-push bg-sc-yellow border-4 border-black rounded-full px-5 py-2 flex items-center gap-2 font-heading text-black text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase"
            >
              <span className="text-lg leading-none">🛒</span> 
              <span className="hidden sm:inline">Checkout</span> ({cartTotal})
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-16 px-4 text-center relative z-10">
        <div className="font-handwritten text-lg md:text-xl text-black mb-4 inline-block bg-sc-yellow border-4 border-black px-4 py-1 rounded-full transform -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          DROP 001 · LIMITED 500 UNITS
        </div>
        <h1 className="font-heading text-6xl md:text-8xl text-black drop-shadow-[4px_4px_0px_rgba(159,122,234,1)] [-webkit-text-stroke:2px_white] mb-6 uppercase leading-none">
          Choose Your<br />
          <span className="text-white drop-shadow-[4px_4px_0px_rgba(244,114,182,1)] [-webkit-text-stroke:2px_black]">Portal.</span>
        </h1>
        <p className="sc-slogan bg-white px-6 py-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 text-xl md:text-2xl leading-snug mx-auto max-w-2xl">
          Physical streetwear embedded with QR codes. Unlock immersive 3D augmented reality instantly in your browser.
        </p>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {loading ? (
          <div className="sc-card max-w-sm mx-auto text-center transform rotate-1">
            <div className="font-heading text-2xl text-black animate-pulse">Loading Drops...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="sc-card max-w-lg mx-auto text-center transform -rotate-1 bg-sc-cyan">
            <h2 className="font-heading text-4xl text-black mb-4">Collection Coming Soon</h2>
            <p className="font-sans font-bold text-black text-lg">Drop 001 inventory is being prepped. Stay funky and check back shortly.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-20">
            {/* Stickers */}
            {stickers.length > 0 && (
              <section>
                <div className="mb-8 relative inline-block">
                  <span className="absolute -top-4 -left-4 font-handwritten text-xl text-sc-pink transform -rotate-6">Tier 01</span>
                  <h2 className="font-heading text-4xl md:text-5xl uppercase text-black bg-white border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                    AR Stickers
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stickers.map((product) => (
                    <ProductCard key={product.id} product={product} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
                  ))}
                </div>
              </section>
            )}

            {/* Keychains */}
            {keychains.length > 0 && (
              <section>
                <div className="mb-8 relative inline-block">
                  <span className="absolute -top-4 -left-4 font-handwritten text-xl text-sc-yellow transform -rotate-6">Tier 02</span>
                  <h2 className="font-heading text-4xl md:text-5xl uppercase text-black bg-sc-purple border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white transform rotate-1">
                    AR Keychains
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {keychains.map((product) => (
                    <ProductCard key={product.id} product={product} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Sticky cart bar */}
      {cartTotal > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-6 py-4 bg-black border-4 border-white rounded-full shadow-[8px_8px_0px_0px_rgba(244,114,182,1)] w-[90%] max-w-md animate-in slide-in-from-bottom-10">
          <span className="font-sans font-bold text-white text-sm md:text-base">
            {cartTotal} item{cartTotal !== 1 ? "s" : ""} <span className="text-sc-pink mx-2">/</span> {formatPrice(cartValue)}
          </span>
          <button 
            onClick={goToCheckout} 
            className="sc-btn-push bg-sc-cyan border-2 border-black rounded-full px-6 py-2 font-heading text-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            Checkout ↗
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, cart, onAdd, onRemove }) {
  const qty = cart[product.id] || 0;
  const isOut = product.stock === 0;
  
  // Dynamic funky colors based on product type to replace the old hex prop passing
  const themeColor = product.type === "keychain" ? "bg-sc-yellow" : "bg-sc-cyan";
  const hoverColor = product.type === "keychain" ? "hover:bg-sc-yellow/20" : "hover:bg-sc-cyan/20";

  return (
    <div className={`sc-card flex flex-col relative transition-transform hover:-translate-y-2 ${qty > 0 ? 'border-sc-purple' : 'border-black'}`}>
      
      {/* Stock badges */}
      {product.stock <= 10 && product.stock > 0 && (
        <div className="absolute -top-3 -right-3 px-4 py-1 rounded-full border-4 border-black bg-sc-pink font-heading text-white text-xs tracking-widest uppercase transform rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
          {product.stock} Left!
        </div>
      )}
      {isOut && (
        <div className="absolute -top-3 -right-3 px-4 py-1 rounded-full border-4 border-black bg-gray-300 font-heading text-gray-500 text-xs tracking-widest uppercase transform -rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
          Sold Out
        </div>
      )}

      {/* Card Header */}
      <div className="font-handwritten text-xl text-sc-purple-dark mb-1">
        {product.type}
      </div>
      <h3 className="font-heading text-3xl md:text-4xl text-black mb-3 leading-tight">
        {product.name}
      </h3>
      
      {/* Tracking Tag */}
      <div className="inline-block bg-gray-100 border-2 border-black rounded-md px-2 py-1 font-sans font-bold text-[10px] uppercase tracking-wider mb-4 self-start">
        {product.type === "keychain" ? "Markerless Floor Tracking" : "Marker-Based Tracking"}
      </div>

      <p className="font-sans font-bold text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
        {product.description}
      </p>

      {/* Features */}
      {product.features?.length > 0 && (
        <div className="flex flex-col gap-2 mb-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4">
          {product.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 font-sans font-bold text-xs text-black">
              <span className="text-sc-pink mt-0.5">✦</span> 
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="font-heading text-4xl text-black mb-6 drop-shadow-[2px_2px_0px_rgba(34,211,238,1)]">
        {formatPrice(product.price)}
      </div>

      {/* Cart Controls */}
      <div className="mt-auto">
        {isOut ? (
          <div className="w-full py-4 border-4 border-gray-300 bg-gray-100 rounded-xl text-center font-heading text-gray-400 uppercase text-lg cursor-not-allowed">
            Out of Stock
          </div>
        ) : qty === 0 ? (
          <button 
            onClick={() => onAdd(product.id)} 
            className={`w-full py-4 rounded-xl font-heading text-xl uppercase border-4 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sc-btn-push ${themeColor}`}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-stretch gap-2 h-14">
            <button 
              onClick={() => onRemove(product.id)} 
              className="w-14 rounded-xl border-4 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sc-btn-push font-heading text-2xl flex items-center justify-center text-black"
            >
              −
            </button>
            <div className={`flex-1 flex items-center justify-center border-4 border-black rounded-xl font-heading text-2xl text-black ${themeColor} shadow-[inset_2px_2px_0px_0px_rgba(255,255,255,0.5)]`}>
              {qty}
            </div>
            <button 
              onClick={() => onAdd(product.id)} 
              disabled={qty >= product.stock} 
              className={`w-14 rounded-xl border-4 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-heading text-2xl flex items-center justify-center ${qty >= product.stock ? 'opacity-50 cursor-not-allowed' : 'sc-btn-push text-black'}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}