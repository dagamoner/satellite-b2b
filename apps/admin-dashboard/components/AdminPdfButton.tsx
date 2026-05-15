"use client";
import React from "react";

interface AdminPdfButtonProps {
  contract: any;
}

export default function AdminPdfButton({ contract }: AdminPdfButtonProps) {
  const [generating, setGenerating] = React.useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar abrir el modal si está en una fila de tabla
    setGenerating(true);
    try {
      const { generateContractPDF } = await import("../lib/pdf");
      await generateContractPDF(contract);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
        generating 
          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 hover:scale-105 active:scale-95"
      }`}
      title="Descargar Reporte de Auditoría"
    >
      {generating ? (
        <div className="w-3 h-3 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {generating ? "Generando..." : "Reporte PDF"}
    </button>
  );
}
