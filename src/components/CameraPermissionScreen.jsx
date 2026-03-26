import React from 'react'

function CameraPermissionScreen() {
  return (
    <div className="fixed inset-0 bg-[#080808] flex items-center justify-center z-200 p-6">
      <div className="w-full max-w-xs text-center bg-white/3 border border-white/10 rounded-3xl p-9">
        <div className="text-5xl mb-5">🔒</div>
        <h2 className="font-serif text-[22px] text-white mb-3">Camera Required</h2>
        <p className="text-[13px] leading-relaxed text-white/50 mb-6 font-mono">
          SCANOVA needs your camera to recognise the sticker and overlay 3D art.
        </p>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-xs text-cyan-400 font-mono leading-[1.9] text-left mb-6">
          <strong className="text-white">iOS Safari</strong><br />
          Settings → Safari → Camera → Allow<br /><br />
          <strong className="text-white">Android Chrome</strong><br />
          Site Settings → Camera → Allow
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full text-black font-bold text-sm tracking-wide font-serif pointer-events-auto cursor-pointer border-none"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default CameraPermissionScreen