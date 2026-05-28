"use client";
import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  planInfo: {
    type: "HARDWARE" | "PLAN" | "QUOTE" | "INFO";
    title: string;
    description: string;
  } | null;
}

export default function LeadFormModal({ isOpen, onClose, planInfo }: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
    message: "",
    cbu: "",
    clientCategory: "HOGAREÑO",
    rubro: "COMERCIAL",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedNumber, setGeneratedNumber] = useState("");

  const isSpecialPlan = planInfo?.title === "Plan Full Estándar V4" || planInfo?.title === "Relevamiento IT - Planes Empresariales";

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isOpen) {
        onClose();
      }
    };

    if (isOpen && !success) {
      // Hacemos push de un estado ficticio para poder atrapar el evento "Volver atrás" del navegador o celular.
      window.history.pushState({ leadModalIdx: window.history.length }, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, success, onClose]);

  const handleManualClose = () => {
    if (window.history.state && window.history.state.leadModalIdx) {
      window.history.back();
    } else {
      onClose();
    }
  };

  if (!isOpen || !planInfo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedDni = formData.dni.replace(/\D/g, "");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dni: normalizedDni,
          type: planInfo.type,
          planName: planInfo.title,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setGeneratedNumber(data.contractNumber);
        
        // Pequeña pausa para que vean el éxito y luego redirección
        setTimeout(() => {
          let portalUrl = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL;
          
          if (!portalUrl) {
            console.warn("NEXT_PUBLIC_CLIENT_PORTAL_URL no está configurada.");
            alert("¡Solicitud enviada con éxito! Un asesor se contactará con usted a la brevedad.");
            onClose();
            return;
          }

          // Asegurar que la URL sea absoluta y tenga protocolo
          let targetBase = portalUrl.trim();
          if (!targetBase.startsWith("http")) {
            targetBase = `https://${targetBase}`;
          }
          
          // Eliminar barra final si existe para evitar dobles barras
          if (targetBase.endsWith("/")) {
            targetBase = targetBase.slice(0, -1);
          }
          
          const params = new URLSearchParams({
            p_dni: normalizedDni,
          });

          window.location.href = `${targetBase}/soporte/${data.ticketId}?${params.toString()}`;
        }, 3000);
      } else {
        const errorMsg = data.message ? `Error: ${data.message}` : (data.error || "Error al procesar la solicitud");
        alert(errorMsg);
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="w-full max-w-7xl bg-slate-900/40 border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col lg:flex-row min-h-[750px] transition-all duration-700">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-50" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        {success ? (
          <div className="w-full py-20 px-10 text-center animate-in zoom-in duration-500 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
               <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">¡Solicitud Registrada!</h2>
            
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-6 my-6">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2">Tu Número de Seguimiento</p>
              <p className="text-2xl font-black text-emerald-400 font-mono tracking-wider">{generatedNumber}</p>
            </div>

            <p className="text-slate-400 text-sm font-medium px-4">
              {isSpecialPlan 
                ? "Tu solicitud de relevamiento está siendo procesada. Te estamos redirigiendo al portal..."
                : "Estamos conectándote con el portal para completar los datos de tu antena..."}
            </p>
            
            <div className="mt-8 flex justify-center">
               <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              <div className="lg:w-[35%] bg-slate-950/40 p-8 md:p-12 border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-8">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 mb-6 inline-block">
                      {planInfo.type === 'QUOTE' ? 'Misión: Relevamiento' : 'Configuración de Enlace'}
                    </span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight mb-8">
                      {planInfo.title}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-600 mb-10 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
                  </div>
                  
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                    {planInfo.description}
                  </p>

                  <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        {planInfo.type === 'HARDWARE' ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        ) : planInfo.type === 'PLAN' ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Prioridad</p>
                        <p className="text-white font-bold text-sm">ALTA - B2B Directo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/5">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(6,182,212,1)]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canal de Enlace Directo</span>
                   </div>
                   <p className="text-[12px] font-black text-cyan-400/80 uppercase tracking-wider">Cifrado de Punto a Punto Activo</p>
                </div>
              </div>

              {/* Right Panel: Form */}
              <div className="lg:w-[65%] p-10 md:p-20 bg-slate-900/20 backdrop-blur-sm flex flex-col justify-center">
                <div className="flex justify-between items-center mb-16">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] leading-none mb-3">Datos de la Solicitud</h3>
                    <div className="h-0.5 w-16 bg-cyan-500/50 rounded-full" />
                  </div>
                  <button 
                    type="button"
                    onClick={handleManualClose}
                    className="w-12 h-12 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 rounded-2xl flex items-center justify-center text-slate-500 transition-all border border-white/10 group active:scale-90"
                  >
                    <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">Nombre Completo / Razón Social / Nombre de fantasía</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Juan Pérez"
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all placeholder:text-slate-800 font-bold shadow-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">CUIT / CUIL</label>
                      <input 
                        type="text" 
                        required
                        value={formData.dni}
                        onChange={e => setFormData({...formData, dni: e.target.value})}
                        placeholder="20345678901"
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all placeholder:text-slate-800 font-mono font-bold shadow-2xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">CBU</label>
                      <input 
                        type="text" 
                        value={formData.cbu}
                        onChange={e => setFormData({...formData, cbu: e.target.value})}
                        placeholder="0000000000000000000000"
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all placeholder:text-slate-800 font-mono font-bold shadow-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">Categoría</label>
                      <select 
                        value={formData.clientCategory}
                        onChange={e => setFormData({...formData, clientCategory: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all font-bold shadow-2xl appearance-none"
                      >
                        <option value="HOGAREÑO">HOGAREÑO</option>
                        <option value="HOGAREÑO RESIDENCIAL">HOGAREÑO RESIDENCIAL</option>
                        <option value="LOCAL COMERCIAL">LOCAL COMERCIAL</option>
                        <option value="LOCAL">LOCAL</option>
                        <option value="GASTRONOMICO">GASTRONOMICO</option>
                        <option value="PYMES">PYMES</option>
                        <option value="EMPRESAS">EMPRESAS</option>
                        <option value="BODEGAS">BODEGAS</option>
                        <option value="HOTELES">HOTELES</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">Rubro</label>
                      <select 
                        value={formData.rubro}
                        onChange={e => setFormData({...formData, rubro: e.target.value})}
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all font-bold shadow-2xl appearance-none"
                      >
                        <option value="GASTRONOMICO">GASTRONOMICO</option>
                        <option value="HOTELERO">HOTELERO</option>
                        <option value="COMERCIAL">COMERCIAL</option>
                        <option value="EMPRESARIAL">EMPRESARIAL</option>
                        <option value="INDUSTRIAL">INDUSTRIAL</option>
                        <option value="RETAIL">RETAIL</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">Email de Contacto</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="correo@empresa.com"
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all placeholder:text-slate-800 font-bold shadow-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">Teléfono Móvil</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+54 9..."
                        className="w-full bg-black/40 border border-white/5 text-white rounded-2xl px-8 py-5 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all placeholder:text-slate-800 font-bold shadow-2xl"
                      />
                    </div>
                  </div>

                  {planInfo.type === 'QUOTE' && (
                    <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Coordenadas del Proyecto</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Latitud (Opcional)" className="w-full bg-black/60 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-blue-500" />
                        <input placeholder="Longitud (Opcional)" className="w-full bg-black/60 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-blue-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 italic">Si conoce la ubicación exacta, nos ayuda a realizar el pre-estudio de factibilidad satelital.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] ml-1 drop-shadow-md">Observaciones / Detalles</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Describa brevemente el entorno de instalación..."
                      className="w-full bg-black/40 border border-white/5 text-white rounded-3xl px-8 py-6 focus:border-cyan-500/50 focus:ring-8 focus:ring-cyan-500/5 outline-none transition-all resize-none placeholder:text-slate-800 text-sm font-medium shadow-2xl"
                    />
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-grow bg-white hover:bg-cyan-500 text-slate-950 hover:text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-cyan-500/20 text-sm uppercase tracking-[0.3em] group active:scale-[0.98] border border-transparent hover:border-cyan-400/50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent animate-spin rounded-full" />
                          <span>ESTABLECIENDO ENLACE...</span>
                        </div>
                      ) : "INICIAR PROCESO DE ALTA"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Seguridad de Grado Militar · MR Technology</span>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
