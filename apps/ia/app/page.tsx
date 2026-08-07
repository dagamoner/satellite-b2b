"use client";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center justify-between p-4">
      {/* Background gradients and stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]"></div>
      
      {/* Navigation (Sticky Header) */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700">
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20 transition-all duration-500">

          {/* Left Block - MR Tech Logo */}
          <div className="flex-1 flex items-center justify-start hidden md:flex opacity-100 transition-opacity duration-500">
            <div className="relative shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="/Logo WEB MR Tech.png"
                alt="MR Technology"
                className="w-24 md:w-32 object-contain hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) contrast(1.1)' }}
              />
            </div>
          </div>

          {/* Center Block - Transformacion Legend */}
          <div className="flex-1 md:flex-none flex items-center justify-center relative shrink-0">
            <div className="relative flex items-center justify-center">
              <img
                src="/Transformacion.png"
                alt="Transformación Digital Empresarial"
                className="h-14 md:h-[4.5rem] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] relative z-10"
                style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)' }}
              />
            </div>
          </div>

          {/* Right Block - Ecosistema + Hablamos */}
          <div className="flex-1 flex justify-end items-center hidden md:flex gap-4 opacity-100 transition-opacity duration-500">
            {/* ECOSISTEMA Header Button */}
            <button
              onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
              className="relative group/eco shrink-0 flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 mr-2"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[#33E8FF] rounded-full blur-[15px] opacity-30 group-hover/eco:opacity-70 transition-opacity duration-300 pointer-events-none" />
                <img
                  src="/ecosistema.jpg"
                  alt="Ecosistema"
                  className="w-full h-full object-cover rounded-full relative z-10"
                  style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 70%)', maskImage: 'radial-gradient(circle at center, black 55%, transparent 70%)', filter: 'drop-shadow(0 0 8px rgba(51,232,255,0.7)) brightness(1.2)' }}
                />
              </div>
              <span className="text-[#33E8FF] font-black text-[10px] tracking-[0.15em] uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">ECOSISTEMA</span>
            </button>

            {/* Hablamos Button */}
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
                  mixBlendMode: 'screen',
                  WebkitMaskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)',
                  maskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)'
                }}
              />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-8 pt-32 pb-12 flex-1 justify-center">
        <img 
          src="/Logo WEB MR Tech.png"
          alt="MR Technology" 
          width="200" 
          height="60" 
          className="mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        />
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] tracking-widest uppercase">
          ¡PRÓXIMAMENTE!
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl">
          Estamos construyendo soluciones de vanguardia en <strong>Inteligencia Artificial</strong>. ¡Mantenete atento!
        </p>
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 w-full py-12 px-4 border-t border-white/5 text-center flex flex-col items-center justify-center mt-auto">
        <img
          src="/Logo WEB MR Tech.png"
          alt="MR Technology"
          className="h-10 object-contain mx-auto mb-4 opacity-80 cursor-pointer hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          style={{ mixBlendMode: "screen" }}
          onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
        />

        <p className="text-white font-bold text-sm">
          © {new Date().getFullYear()} MR Technology — Inteligencia Artificial
        </p>
        <button
          onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
          className="mt-4 inline-flex items-center gap-2 text-[#33E8FF] hover:text-[#33E8FF]/80 text-sm font-bold transition-all duration-300 cursor-pointer group hover:scale-105"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[#33E8FF]/40 shadow-[0_0_8px_rgba(51,232,255,0.4)]">
            <img
              src="/ecosistema.jpg"
              alt="Ecosistema"
              className="w-full h-full object-cover"
              style={{ mixBlendMode: "screen", filter: "brightness(1.2) contrast(1.1)" }}
            />
          </div>
          <span>Volver al Ecosistema MR Technology</span>
        </button>
      </footer>
    </div>
  );
}