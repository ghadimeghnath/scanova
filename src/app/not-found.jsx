import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center text-center p-6 relative overflow-hidden z-0">
      
      {/* Funky Background Decorations */}
      <div className="absolute top-12 left-8 w-20 h-20 bg-sc-yellow border-4 border-black dark:border-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -z-10 animate-[bounce_3s_infinite]" />
      <div className="absolute bottom-24 right-8 w-28 h-28 bg-sc-pink border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] rotate-12 -z-10" />

      {/* Massive 404 Text */}
      <div className="font-heading text-[120px] md:text-[180px] text-sc-cyan leading-none tracking-tighter drop-shadow-[8px_8px_0_rgba(0,0,0,1)] dark:drop-shadow-[8px_8px_0_rgba(255,255,255,1)] mb-2">
        404
      </div>
      
      {/* Heading */}
      <h1 className="font-heading text-3xl md:text-5xl uppercase text-foreground mb-8 drop-shadow-[3px_3px_0_var(--color-sc-pink)]">
        Experience Not Found
      </h1>
      
      {/* Neobrutalist Info Card */}
      <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-6 max-w-md mb-12 transform -rotate-2">
        <p className="font-sans text-base md:text-lg font-bold text-black dark:text-white leading-relaxed">
          This AR experience doesn't exist or has been deactivated. Make sure you scanned the right code!
        </p>
      </div>
      
      {/* Action Button */}
      <Link 
        href="/" 
        className="px-8 py-4 bg-sc-yellow border-4 border-black text-black font-heading text-lg md:text-xl uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all"
      >
        ← Back to SCANOVA
      </Link>
      
    </div>
  );
}