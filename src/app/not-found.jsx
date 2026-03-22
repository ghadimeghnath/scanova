import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[#080808] flex flex-col items-center justify-center text-center p-6 font-mono">
      
      <div className="font-serif italic text-[96px] text-[#00e5ff]/15 mb-2 leading-none">
        404
      </div>
      
      <h1 className="font-serif text-[28px] font-normal text-white mb-3">
        Experience Not Found
      </h1>
      
      <p className="text-[13px] text-white/40 leading-[1.7] max-w-85 mb-9">
        This AR experience doesn't exist or has been deactivated. Make sure you scanned the right code.
      </p>
      
      <Link 
        href="/" 
        className="px-8 py-3 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full text-[#00e5ff] text-[13px] tracking-widest hover:bg-[#00e5ff]/20 transition-colors"
      >
        ← Back to SCANOVA
      </Link>
      
    </div>
  );
}