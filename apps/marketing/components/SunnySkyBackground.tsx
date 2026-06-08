export function SunnySkyBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-sky-200">
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100" />

      {/* Sun Effect */}
      <div className="absolute top-10 right-10 md:top-20 md:right-32 w-64 h-64 bg-yellow-200 rounded-full blur-[100px] opacity-80" />
      <div className="absolute top-20 right-20 md:top-32 md:right-40 w-32 h-32 bg-white rounded-full blur-[40px] opacity-90" />

      {/* Cloud Layer 1 (Slow) */}
      <div
        className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-[slide-right_60s_linear_infinite]"
        style={{ backgroundSize: "400px" }}
      />
      
      {/* Cloud Layer 2 (Faster, subtle) */}
      <div className="absolute inset-0 opacity-60 pointer-events-none mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" />
            <feColorMatrix type="matrix" values="1 0 0 0 1  1 0 0 0 1  1 0 0 0 1  0 0 0 0.5 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" className="animate-[slide-right_120s_linear_infinite]" />
        </svg>
      </div>

      {/* Atmospheric Mist at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/60 to-transparent" />
    </div>
  );
}
