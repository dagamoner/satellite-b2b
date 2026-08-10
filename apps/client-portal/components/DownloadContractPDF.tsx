"use client";
import React from "react";

interface DownloadContractPDFProps {
  form: any;
  contractNumber: string;
}

export default function DownloadContractPDF({ form, contractNumber }: DownloadContractPDFProps) {
  const handleDownload = async () => {
    try {
      const { generateContractPDF } = await import("../lib/pdf");
      await generateContractPDF({
        ...form,
        id: "new",
        contractNumber: contractNumber,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor reintenta.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors group"
    >
      <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Descargar Solicitud (PDF)
    </button>
  );
}
