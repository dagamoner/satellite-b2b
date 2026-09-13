"use client";

import Link from "next/link";

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col text-slate-100 selection:bg-[#33E8FF]/30 selection:text-[#33E8FF]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[300px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* ── Navigation (Sticky Header) ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700">
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
          
          {/* Left – MR Tech Logo */}
          <div className="flex-1 flex items-center justify-start hidden md:flex opacity-100">
            <Link href="/" className="relative shrink-0 flex items-center cursor-pointer">
              <img
                src="/Logo WEB MR Tech.png"
                alt="MR Technology"
                className="w-24 md:w-32 object-contain hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.1)" }}
              />
            </Link>
          </div>

          {/* Center – Transformación Digital */}
          <div className="flex-1 md:flex-none flex items-center justify-center relative shrink-0">
            <img
              src="/Transformacion.png"
              alt="Transformación Digital Empresarial"
              className="h-14 md:h-[4.5rem] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] relative z-10"
              style={{
                mixBlendMode: "screen",
                WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Right – Ecosistema + Hablamos */}
          <div className="flex-1 flex justify-end items-center hidden md:flex gap-4 opacity-100">
            <button
              onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
              className="relative group/eco shrink-0 flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 mr-2 cursor-pointer"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[#33E8FF] rounded-full blur-[15px] opacity-30 group-hover/eco:opacity-70 transition-opacity duration-300 pointer-events-none" />
                <img
                  src="/ecosistema.jpg"
                  alt="Ecosistema"
                  className="w-full h-full object-cover rounded-full relative z-10"
                  style={{
                    mixBlendMode: "screen",
                    WebkitMaskImage: "radial-gradient(circle at center, black 55%, transparent 70%)",
                    maskImage: "radial-gradient(circle at center, black 55%, transparent 70%)",
                    filter: "drop-shadow(0 0 8px rgba(51,232,255,0.7)) brightness(1.2)",
                  }}
                />
              </div>
              <span className="text-[#33E8FF] font-black text-[10px] tracking-[0.15em] uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">
                ECOSISTEMA
              </span>
            </button>

            <button
              onClick={() => { window.location.href = "https://www.mrtechnology.it.com/#whatsapp-contact"; }}
              className="relative group/hablamos shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-md opacity-0 group-hover/hablamos:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <img
                src="/Hablamos.png"
                alt="Hablamos"
                className="h-24 md:h-28 w-auto object-contain relative z-10"
                style={{
                  mixBlendMode: "screen",
                  WebkitMaskImage: "radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)",
                  maskImage: "radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Content Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-16 px-4 flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center w-full">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#33E8FF] to-blue-400 tracking-tight uppercase mb-12 drop-shadow-[0_0_15px_rgba(51,232,255,0.4)]">
            MR Real Estate - CENI
          </h1>

          <div className="w-full max-w-4xl relative group">
            {/* Glow effect behind the image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-[#33E8FF] rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            
            <Link href="/real-estate" className="relative block rounded-3xl overflow-hidden bg-slate-900 border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src="/real-estate/MR Real Estate - CENI.png"
                alt="MR Real Estate - CENI"
                className="w-full h-auto object-cover transition-opacity duration-500 hover:opacity-95"
              />
            </Link>
          </div>
          
        </div>
      </section>
    </div>
  );
}
