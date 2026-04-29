"use client";

import dynamic from "next/dynamic";

// IMPORTANTE: Cargamos el componente del contrato con SSR desactivado
// Esto evita errores de hidratación con librerías de PDF y fechas.
const ContratoClient = dynamic(() => import("./ContratoClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-500 font-bold tracking-widest animate-pulse">CARGANDO FORMULARIO...</p>
      </div>
    </div>
  ),
});

export default function ContratoPage() {
  return <ContratoClient />;
}
