"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CoverageSearch({ onCoverageConfirmed }: { onCoverageConfirmed: (address: string) => void }) {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setStatus("scanning");
    
    // Simulate API call and satellite scanning
    setTimeout(() => {
      setStatus("success");
    }, 3000); // 3 seconds of fake scanning
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-12 relative z-20 px-4 md:px-0">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.form 
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 bg-white/60 dark:bg-[#020617]/50 backdrop-blur-xl p-2.5 rounded-[1.5rem] border border-slate-300 dark:border-slate-800 shadow-2xl"
          >
            <div className="relative flex-grow flex items-center">
              <svg className="w-6 h-6 text-slate-400 absolute left-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Ingresa tu dirección o localidad (Ej: Luján de Cuyo, Mendoza)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white pl-14 pr-4 py-4 outline-none text-sm md:text-base placeholder:text-slate-500 font-medium"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_25px_rgba(8,145,178,0.4)] whitespace-nowrap"
            >
              Verificar Cobertura
            </button>
          </motion.form>
        )}

        {status === "scanning" && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-[#020617]/90 backdrop-blur-xl border border-cyan-500/40 rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(8,145,178,0.25)]"
          >
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-4 border-r-4 border-cyan-500 opacity-90"
              />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 rounded-full bg-cyan-500/30"
              />
              <svg className="w-12 h-12 text-cyan-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-wide">Analizando Satélites en Órbita...</h3>
            <p className="text-cyan-400/90 text-sm md:text-base font-medium">Calculando viabilidad técnica para: <span className="text-white border-b border-white/20 pb-0.5">{address}</span></p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/50 rounded-[2rem] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-[0_0_60px_rgba(16,185,129,0.3)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.5)] relative z-10"
            >
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h3 className="text-3xl font-black text-emerald-400 mb-4 tracking-tight uppercase relative z-10">¡Cobertura Confirmada!</h3>
            
            <p className="text-slate-200 mb-10 max-w-lg mx-auto text-base md:text-lg leading-relaxed relative z-10">
              Tenemos capacidad de red satelital óptima y equipos en stock listos para instalar en: <br/><strong className="text-white bg-white/10 px-3 py-1 rounded-lg mt-3 inline-block border border-white/10">{address}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
              <button 
                onClick={() => setStatus("idle")}
                className="px-8 py-4 rounded-xl border border-slate-500/50 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-bold uppercase tracking-wider"
              >
                Probar Otra Dirección
              </button>
              <button 
                onClick={() => onCoverageConfirmed(address)}
                className="px-10 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all text-sm font-bold uppercase tracking-wider transform hover:-translate-y-1"
              >
                Continuar y Solicitar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
