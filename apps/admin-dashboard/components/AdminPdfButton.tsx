"use client";
import React from "react";

interface AdminPdfButtonProps {
  contract: any;
}

export default function AdminPdfButton({ contract }: AdminPdfButtonProps) {
  const handleDownload = async () => {
    try {
      const { generateContractPDF } = await import("../lib/pdf");
      await generateContractPDF(contract);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-blue-300 transition-colors"
      title="Descargar PDF"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      PDF
    </button>
  );
}
