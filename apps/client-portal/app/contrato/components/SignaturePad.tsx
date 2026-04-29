"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  label: string;
  onSave: (base64: string) => void;
  onClear: () => void;
  defaultValue?: string;
  disabled?: boolean;
}

export default function SignaturePad({ label, onSave, onClear, defaultValue, disabled }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(!defaultValue);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
    onClear();
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      if (!sigCanvas.current.isEmpty()) {
        setIsEmpty(false);
        const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        onSave(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-400">{label}</label>
      <div 
        className={`relative bg-slate-900 border-2 rounded-lg overflow-hidden transition-colors ${
          disabled ? 'opacity-50 grayscale' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <SignatureCanvas
          ref={(ref) => { sigCanvas.current = ref; }}
          penColor="white"
          onEnd={handleEnd}
          canvasProps={{
            className: "signature-canvas w-full h-40 cursor-crosshair",
          }}
          clearOnResize={false}
        />
        
        {isEmpty && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-600 text-sm italic">Firme aquí</span>
          </div>
        )}

        {!disabled && (
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded-md transition-all text-xs border border-slate-700"
            title="Limpiar firma"
          >
            Limpiar
          </button>
        )}
      </div>
      {!isEmpty && !disabled && (
        <span className="text-[10px] text-emerald-500 font-medium animate-pulse">
           Firma capturada correctamente
        </span>
      )}
    </div>
  );
}
