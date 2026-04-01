import React from 'react'

function ProductsSection() {
  return (
    <section id="products" className="py-20 md:py-32 px-4 md:px-12  mx-auto relative z-10 bg-white">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl text-black [-webkit-text-stroke:1px_white] md:[-webkit-text-stroke:2px_white] drop-shadow-[6px_6px_0px_rgba(159,122,234,1)] md:drop-shadow-[8px_8px_0px_rgba(159,122,234,1)] mb-4">
            CHOOSE YOUR EXPERIENCE
          </h2>
          <p className="sc-slogan text-sc-purple text-xl md:text-3xl">Physical products. Digital magic. Choose your path.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Sticker Card */}
          <Link href="/shop" className="block group sc-btn-push h-full">
            <div className="sc-card !bg-sc-pink h-full transform transition-transform group-hover:scale-105 group-hover:rotate-1 flex flex-col">
              <div className="bg-white border-4 border-black rounded-xl p-2 md:p-4 inline-block mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
                <span className="font-heading text-sc-purple uppercase text-sm md:text-lg">Tier 01</span>
              </div>
              <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:3px_black] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-2 md:mb-4">
                AR STICKER
              </h3>
              <p className="font-sans font-bold text-black mb-6 md:mb-8 border-b-4 border-black pb-6 md:pb-8 text-base md:text-lg flex-grow">
                Die-cut holographic stickers. Point your camera and watch 3D art come to life.
              </p>
              <div className="flex justify-between items-end mt-auto">
                <div className="font-heading text-4xl md:text-6xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  ₹299
                </div>
                <div className="bg-white text-black font-heading text-lg md:text-xl px-6 py-2 md:px-8 md:py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  GET IT ↗
                </div>
              </div>
            </div>
          </Link>

          {/* Keychain Card */}
          <Link href="/shop#keychain" className="block group sc-btn-push h-full">
            <div className="sc-card !bg-sc-cyan h-full transform transition-transform group-hover:scale-105 group-hover:-rotate-1 flex flex-col">
              <div className="bg-white border-4 border-black rounded-xl p-2 md:p-4 inline-block mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start relative">
                <span className="font-heading text-sc-purple uppercase text-sm md:text-lg">Tier 02</span>
                <span className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-sc-yellow text-black font-heading text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-12 animate-pulse">
                  HOT!
                </span>
              </div>
              <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:3px_black] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-2 md:mb-4">
                AR KEYCHAIN
              </h3>
              <p className="font-sans font-bold text-black mb-6 md:mb-8 border-b-4 border-black pb-6 md:pb-8 text-base md:text-lg flex-grow">
                Premium acrylic keychains. Upload your photo + message. See them float in your room in 3D.
              </p>
              <div className="flex justify-between items-end mt-auto">
                <div className="font-heading text-4xl md:text-6xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  ₹499
                </div>
                <div className="bg-white text-black font-heading text-lg md:text-xl px-6 py-2 md:px-8 md:py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  GET IT ↗
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
  )
}

export default ProductsSection