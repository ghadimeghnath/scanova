import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className='bg-sc-pink py-16 md:py-24 px-4 md:px-12 border-t-4 md:border-t-8 border-black shadow-[0px_-8px_0px_0px_rgba(0,0,0,1)]'>
      <div className='max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 text-center sm:text-left'>
        {/* Column 1: Branding */}
        <div className='flex flex-col gap-4 items-center sm:items-start'>
          <Link
            href='/'
            className='font-heading text-4xl md:text-5xl text-white [-webkit-text-stroke:2px_black] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] tracking-widest uppercase hover:scale-105 transition-transform'
          >
            SCANOVA
          </Link>
          <p className='font-sans font-bold text-black mt-2 text-lg'>
            Bridging physical merchandise with digital magic.
          </p>
          <div className='bg-white border-4 border-black px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-sans font-bold text-black text-sm inline-block transform -rotate-2 mt-4'>
            © {new Date().getFullYear()} SCANOVA AR
          </div>
        </div>

        {/* Column 2: Company */}
        <div className='flex flex-col gap-4 items-center sm:items-start'>
          <h4 className='font-heading text-2xl text-white [-webkit-text-stroke:1px_black] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-2'>
            COMPANY
          </h4>
          <Link
            href='/about'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            About Us
          </Link>
          <Link
            href='/contact'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            Contact Us
          </Link>
        </div>

        {/* Column 3: Support */}
        <div className='flex flex-col gap-4 items-center sm:items-start'>
          <h4 className='font-heading text-2xl text-white [-webkit-text-stroke:1px_black] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-2'>
            SUPPORT
          </h4>
          <Link
            href='/faq'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            FAQ
          </Link>
          <Link
            href='/shipping'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            Shipping & Delivery
          </Link>
          <Link
            href='/track-order'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            Track Order
          </Link>
        </div>

        {/* Column 4: Legal */}
        <div className='flex flex-col gap-4 items-center sm:items-start'>
          <h4 className='font-heading text-2xl text-white [-webkit-text-stroke:1px_black] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-2'>
            LEGAL
          </h4>
          <Link
            href='/privacy'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            Privacy Policy
          </Link>
          <Link
            href='/terms'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            Terms of Service
          </Link>
          <Link
            href='/refunds'
            className='font-sans font-bold text-black hover:text-white hover:translate-x-2 transition-all'
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
