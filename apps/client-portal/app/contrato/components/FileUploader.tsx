"use client";

import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "../../../lib/supabase";

interface FileUploaderProps {
  label: string;
  onUploadComplete: (url: string) => void;
  contractId?: string;
  fieldName: string;
}

export default function FileUploader({ label, onUploadComplete, contractId, fieldName }: FileUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));

    try {
      // 1. Compresión en el cliente
      setIsCompressing(true);
      const options = {
        maxSizeMB: 0.8, // Menos de 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      setIsCompressing(false);

      // 2. Subida a Supabase Storage
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${contractId || 'temp'}_${fieldName}_${Date.now()}.${fileExt}`;
      const filePath = `evidencias/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('contratos-evidencia')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Obtener URL (Como es privado, el tecnico necesitará permiso para ver, pero guardamos el path)
      // Guardamos la ruta interna para poder manejarla con permisos después
      onUploadComplete(filePath);
      
      setIsUploading(false);
    } catch (err: any) {
      console.error("Error en carga:", err);
      setError("Error al subir archivo");
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-950/30 border-2 border-dashed border-slate-700/70 rounded-2xl hover:bg-slate-900 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group h-40 relative overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            {isCompressing || isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {isCompressing ? "Comprimiendo..." : "Subiendo..."}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                   <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Imagen Lista</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="text-[9px] text-slate-400 underline hover:text-white"
                >
                  Cambiar foto
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div 
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-500 transition-colors shadow-inner">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200 text-center">{label}</span>
          <span className="text-[10px] text-slate-600 mt-1">Solo Cámara</span>
        </div>
      )}

      {error && (
        <div className="absolute bottom-2 inset-x-0 text-center">
          <span className="text-[10px] text-red-400 font-bold">{error}</span>
        </div>
      )}
    </div>
  );
}
