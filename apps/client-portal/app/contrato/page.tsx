"use client";
import dynamic from "next/dynamic";

// Carga completamente en cliente para evitar errores de SSR con jspdf/fflate
const ContratoClient = dynamic(() => import("./ContratoClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <svg className="w-10 h-10 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm font-medium tracking-widest">Cargando formulario...</p>
      </div>
    </div>
  ),
});

export default function ContratoPage() {
  return <ContratoClient />;
}
