import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background gradients and stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-8">
        <Image 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MR%20TECHNOLOGY%20-%20Logo%20Color-uTq5w2wQdF8T62l7W1R9b08fM2x9aC.png"
          alt="MR Technology" 
          width={200} 
          height={60} 
          className="mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        />
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] tracking-widest uppercase">
          ¡PRÓXIMAMENTE!
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 font-light mt-4 mb-8 max-w-2xl">
          Estamos construyendo el futuro del <strong>Software ERP y SAAS Empresarial</strong> para potenciar tu negocio. ¡Mantenete atento!
        </p>

        <Link href="https://www.mrtechnology.it.com" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-wider">
          Volver a MR Technology
        </Link>
      </div>
    </div>
  );
}