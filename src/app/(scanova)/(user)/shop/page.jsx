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
    <div className="min-h-screen w-full relative pb-28 overflow-hidden selection:bg-sc-pink selection:text-white bg-background">
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-[10%] right-[2%] sc-blob bg-sc-pink w-24 h-24 md:w-32 md:h-32 border-[3px] border-black animate-funky -z-10 opacity-50"></div>
      <div className="fixed bottom-[15%] left-[2%] sc-blob bg-sc-cyan w-32 h-32 md:w-48 md:h-48 border-[3px] border-black animate-funky -z-10 opacity-50" style={{ animationDelay: '1.5s' }}></div>

      {/* Nav - Compacted vertically */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 sm:py-3 md:px-8 bg-white border-b-[3px] md:border-b-[4px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <Link 
          href="/" 
          className="font-heading text-xl sm:text-2xl md:text-3xl text-black uppercase tracking-tight hover:-translate-y-0.5 hover:text-sc-purple transition-all drop-shadow-[2px_2px_0px_rgba(34,211,238,1)]"
        >
          Scanova
        </Link>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link 
            href="/#how" 
            className="hidden sm:block font-sans font-bold text-xs md:text-sm uppercase tracking-widest text-black hover:text-sc-pink transition-colors"
          >
            How it Works
          </Link>
          {cartTotal > 0 && (
            <button 
              onClick={goToCheckout} 
              className="sc-btn-push bg-sc-yellow border-[2px] border-black rounded-full px-4 py-1.5 flex items-center gap-2 font-heading text-black text-xs md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase"
            >
              <span className="text-sm md:text-base leading-none">🛒</span> 
              <span className="hidden sm:inline">Checkout</span> 
              <span className="bg-black text-white px-2 py-0.5 rounded-full text-[10px]">{cartTotal}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero - Reduced padding and font sizes to bring cards up */}
      <div className="pt-24 sm:pt-28 pb-6 px-4 text-center relative z-10 flex flex-col items-center">
        <div className="inline-block transform -rotate-2 mb-3">
          <span className="bg-sc-yellow text-black font-heading text-[10px] sm:text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full">
            Drop 001 Live
          </span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[3px_3px_0px_rgba(159,122,234,1)] md:drop-shadow-[4px_4px_0px_rgba(159,122,234,1)] [-webkit-text-stroke:1.5px_black] md:[-webkit-text-stroke:2px_black] mb-4 uppercase leading-none">
          Choose Your<br />
          <span className="text-sc-pink drop-shadow-[3px_3px_0px_rgba(34,211,238,1)] md:drop-shadow-[4px_4px_0px_rgba(34,211,238,1)]">Portal.</span>
        </h1>
        <p className="sc-slogan bg-white px-4 py-2 md:py-3 border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 text-xs md:text-sm leading-snug max-w-lg">
          Physical streetwear + AR markers. Unlock immersive reality instantly.
        </p>
      </div>

      {/* Products Grid Area */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 relative z-10">
        {loading ? (
          <div className="sc-card max-w-sm mx-auto text-center transform rotate-2 bg-sc-yellow !p-6">
            <div className="font-heading text-xl sm:text-2xl text-black animate-pulse">Loading Drops...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="sc-card max-w-xl mx-auto text-center transform -rotate-1 bg-sc-cyan !p-6">
            <h2 className="font-heading text-2xl sm:text-3xl text-black mb-2">Collection Dropping Soon</h2>
            <p className="font-sans font-bold text-black text-sm">Stay funky and check back shortly.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            
            {/* Stickers Section */}
            {stickers.length > 0 && (
              <section>
                <div className="mb-6 relative inline-block">
                  <span className="absolute -top-4 -left-3 md:-left-4 font-handwritten text-lg md:text-xl text-sc-pink transform -rotate-12 bg-white px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg z-10">
                    Tier 01
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl uppercase text-black bg-sc-cyan border-[3px] border-black px-5 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                    AR Stickers
                  </h2>
                </div>
                {/* 2 on mobile, 3 tablet, 4 laptop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {stickers.map((product) => (
                    <ProductCard key={product.id} product={product} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
                  ))}
                </div>
              </section>
            )}

            {/* Keychains Section */}
            {keychains.length > 0 && (
              <section id="keychain">
                <div className="mb-6 relative inline-block">
                  <span className="absolute -top-4 -right-3 md:-right-4 font-handwritten text-lg md:text-xl text-sc-yellow transform rotate-12 bg-black px-2 py-0.5 border-2 border-sc-yellow shadow-[2px_2px_0px_0px_rgba(253,224,71,1)] rounded-lg z-10">
                    Premium
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl uppercase text-white bg-sc-purple-dark border-[3px] border-black px-5 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                    AR Keychains
                  </h2>
                </div>
                {/* 2 on mobile, 3 tablet, 4 laptop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {keychains.map((product) => (
                    <ProductCard key={product.id} product={product} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Sticky cart bar - Compacted */}
      {cartTotal > 0 && (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 md:gap-4 px-4 py-3 bg-black border-[3px] border-sc-pink rounded-full shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] md:shadow-[6px_6px_0px_0px_rgba(244,114,182,1)] w-[90%] sm:w-[75%] max-w-md animate-in slide-in-from-bottom-10">
          <span className="font-heading text-white text-sm sm:text-base tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
            {cartTotal} item{cartTotal !== 1 ? "s" : ""} <span className="text-sc-cyan mx-1.5 font-sans">|</span> <span className="text-sc-yellow">{formatPrice(cartValue)}</span>
          </span>
          <button 
            onClick={goToCheckout} 
            className="sc-btn-push bg-sc-pink border-2 border-white rounded-full px-4 py-1.5 md:py-2 font-heading text-white text-xs sm:text-sm uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] whitespace-nowrap"
          >
            Checkout ↗
          </button>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Product Card (Optimized Height & Neobrutalist styling)
function ProductCard({ product, cart, onAdd, onRemove }) {
  const qty = cart[product.id] || 0;
  const isOut = product.stock === 0;
  
  const themeColor = product.type === "keychain" ? "bg-sc-purple text-white" : "bg-sc-yellow text-black";
  
  return (
    <div className={`sc-card flex flex-col h-full relative transition-transform duration-200 hover:-translate-y-1.5 !p-3 sm:!p-4 ${qty > 0 ? 'border-sc-pink shadow-[4px_4px_0px_0px_rgba(244,114,182,1)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px]'}`}>
      
      {/* Stock badges */}
      {product.stock <= 10 && product.stock > 0 && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-lg border-2 border-black bg-sc-cyan font-heading text-black text-[10px] sm:text-xs tracking-widest uppercase transform rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 animate-pulse">
          {product.stock} Left!
        </div>
      )}
      {isOut && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-lg border-2 border-black bg-white font-heading text-black text-[10px] sm:text-xs tracking-widest uppercase transform -rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
          Sold Out
        </div>
      )}

      {/* Product Image - Height strictly controlled */}
      {product.imageUrl && (
        <div className="w-full h-32 sm:h-40 md:h-48 mb-3 border-[3px] border-black rounded-lg overflow-hidden bg-white shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] flex-shrink-0">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      )}

      {/* Card Header */}
      <div className="font-handwritten text-sm sm:text-base text-sc-purple-dark mb-0.5 transform -rotate-2 origin-left">
        {product.type}
      </div>
      <h3 className="font-heading text-lg sm:text-xl md:text-2xl text-black mb-1.5 leading-tight uppercase line-clamp-1">
        {product.name}
      </h3>
      
      {/* Tracking Tag */}
      <div className="inline-block bg-black text-sc-yellow border border-black rounded-md px-2 py-0.5 font-sans font-bold text-[8px] sm:text-[10px] uppercase tracking-wider mb-2 self-start shadow-[1px_1px_0px_0px_rgba(253,224,71,1)]">
        Marker-Based
      </div>

      <p className="font-sans font-medium text-black text-xs sm:text-sm leading-snug mb-3 flex-grow line-clamp-2 md:line-clamp-3">
        {product.description}
      </p>

      {/* Features - Hidden on mobile, compact on larger screens to save vertical space */}
      {product.features?.length > 0 && (
        <div className="hidden sm:flex flex-col gap-1 mb-3 bg-zinc-100 border-2 border-black rounded-lg p-2 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]">
          {product.features.slice(0, 2).map((f, i) => (
            <div key={i} className="flex items-start gap-1.5 font-sans font-bold text-[10px] md:text-xs text-black line-clamp-1">
              <span className="text-sc-pink text-xs leading-none mt-0.5">✦</span> 
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="font-heading text-xl sm:text-2xl md:text-3xl text-black mb-3 drop-shadow-[1.5px_1.5px_0px_rgba(34,211,238,1)]">
        {formatPrice(product.price)}
      </div>

      {/* Cart Controls */}
      <div className="mt-auto">
        {isOut ? (
          <div className="w-full py-1.5 sm:py-2 border-[3px] border-black bg-gray-200 rounded-lg text-center font-heading text-gray-500 uppercase text-xs sm:text-sm cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Out of Stock
          </div>
        ) : qty === 0 ? (
          <button 
            onClick={() => onAdd(product.id)} 
            className={`w-full py-1.5 sm:py-2 rounded-lg font-heading text-sm sm:text-base uppercase border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sc-btn-push ${themeColor}`}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-stretch gap-2 h-9 sm:h-10 md:h-11">
            <button 
              onClick={() => onRemove(product.id)} 
              className="w-10 sm:w-12 rounded-lg border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sc-btn-push font-heading text-lg sm:text-xl flex items-center justify-center text-black"
            >
              −
            </button>
            <div className={`flex-1 flex items-center justify-center border-[3px] border-black rounded-lg font-heading text-base sm:text-lg md:text-xl ${themeColor} shadow-[inset_1.5px_1.5px_0px_0px_rgba(0,0,0,0.2)]`}>
              {qty}
            </div>
            <button 
              onClick={() => onAdd(product.id)} 
              disabled={qty >= product.stock} 
              className={`w-10 sm:w-12 rounded-lg border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-heading text-lg sm:text-xl flex items-center justify-center ${qty >= product.stock ? 'opacity-50 cursor-not-allowed translate-y-0.5 shadow-none' : 'sc-btn-push text-black'}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}