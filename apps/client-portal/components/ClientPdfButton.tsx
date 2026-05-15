"use client";

import { useState } from "react";
import { generateContractPDF } from "../lib/pdf";

interface ClientPdfButtonProps {
  contract: any;
  label?: string;
  className?: string;
}

export default function ClientPdfButton({ contract, label = "Descargar Contrato", className = "" }: ClientPdfButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!contract) return;
    setGenerating(true);
    try {
      await generateContractPDF(contract);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un error al generar el PDF del contrato.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className={`group relative py-5 px-8 bg-slate-950/80 hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-50 ${className}`}
    >
      {generating ? (
        <>
          <div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          Generando Certificado...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 group-hover:text-cyan-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
