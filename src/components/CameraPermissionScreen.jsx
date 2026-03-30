import React from 'react'

function CameraPermissionScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center z-200 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titan+One&display=swap');
        .font-heading { font-family: 'Titan One', cursive; }
      `}</style>
      <div className="w-full max-w-sm text-center bg-white border-4 border-purple-600 rounded-3xl p-10 shadow-[12px_12px_0px_0px_rgba(124,58,237,0.25)]">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="font-heading text-4xl text-purple-700 mb-4 leading-tight">Camera Required</h2>
        <p className="text-sm leading-relaxed text-gray-700 mb-8 font-sans">
          SCANOVA needs your camera to recognise the sticker and overlay 3D art.
        </p>
        <div className="bg-yellow-100 border-4 border-yellow-500 rounded-2xl p-5 text-xs text-gray-900 font-sans leading-[2] text-left mb-8 shadow-[4px_4px_0px_0px_rgba(253,224,71,0.4)]">
          <strong className="text-purple-700 text-sm">📱 iOS Safari</strong><br />
          Settings → Safari → Camera → Allow<br /><br />
          <strong className="text-purple-700 text-sm">🤖 Android Chrome</strong><br />
          Site Settings → Camera → Allow
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl text-white font-heading font-bold text-base tracking-wide border-3 border-purple-800 shadow-[6px_6px_0px_0px_rgba(88,28,135,0.4)] pointer-events-auto cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(88,28,135,0.5)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(88,28,135,0.3)] transition-all"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  )
}

export default CameraPermissionScreen