"use client";

import { useState, useEffect } from "react";

interface PhotoViewerProps {
  path: string | null;
  label: string;
}

export default function PhotoViewer({ path, label }: PhotoViewerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!path) return;

    const fetchUrl = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/contracts/photos?path=${encodeURIComponent(path)}`);
        const data = await res.json();
        if (data.signedUrl) {
          setUrl(data.signedUrl);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [path]);

  if (!path) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</span>
      <div className="relative group aspect-video bg-slate-950 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all shadow-inner">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 text-[10px]">
             <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
             Sin imagen
          </div>
        ) : url ? (
          <>
            <img 
              src={url} 
              alt={label} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button 
                onClick={() => window.open(url, "_blank")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20"
              >
                Ver amplia →
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
