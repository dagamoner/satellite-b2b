import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background gradients and stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]"></div>
      
      {/* Navigation (Sticky Header) */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-700 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2">
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 transition-all duration-500 flex items-center justify-between h-16 md:h-20">
          {/* Left Block - Hablamos (formerly Right) */}
          <div className="flex-1 flex justify-start items-center hidden md:flex gap-4 opacity-100 transition-opacity duration-500">
             <a href="https://www.mrtechnology.it.com/#whatsapp-contact" className="relative group/hablamos shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95">
               <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-md opacity-0 group-hover/hablamos:opacity-100 transition-opacity duration-300 pointer-events-none" />
               <img src="/Hablamos.png" alt="Hablamos" className="h-24 md:h-28 w-auto object-contain relative z-10" style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)', maskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)' }} />
             </a>
          </div>
          {/* Center Block - Legend Image */}
          <div className="flex-1 md:flex-none flex items-center justify-center relative shrink-0">
             <div className="relative flex items-center justify-center">
                 <img src="/Transformacion.png" alt="Transformación Digital Empresarial" className="h-14 md:h-[4.5rem] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] relative z-10" style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)' }} />
             </div>
          </div>
          {/* Right Block - Small Logo (formerly Left) */}
          <div className="flex-1 flex items-center justify-end hidden md:flex opacity-100 transition-opacity duration-500">
             <div className="relative shrink-0 flex items-center cursor-pointer">
                 <img src="/Logo WEB MR Tech.png" alt="MR Technology" className="w-28 md:w-40 object-contain hover:scale-105 transition-transform duration-300" style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) contrast(1.1)' }} />
             </div>
          </div>
        </div>
      </nav>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-8">
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
        
        <p className="text-xl md:text-2xl text-slate-300 font-light mt-4 mb-8 max-w-2xl">
          Estamos construyendo soluciones de vanguardia en <strong>Inteligencia Artificial</strong>. ¡Mantenete atento!
        </p>

        <Link href="https://www.mrtechnology.it.com" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-wider">
          Volver a MR Technology
        </Link>
      </div>
    </div>
  );
}