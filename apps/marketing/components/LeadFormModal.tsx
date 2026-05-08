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
            p_name: formData.name,
            p_email: formData.email,
            p_dni: normalizedDni,
            p_phone: formData.phone,
            p_plan: planInfo.title,
            p_contract: data.contractNumber
          });

          window.location.href = `${targetBase}/contrato?${params.toString()}`;
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full" />
        
        {success ? (
          <div className="py-8 text-center animate-in zoom-in duration-500">
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
              {/* Left Panel: Mission Details */}
              <div className="lg:w-1/3 bg-slate-950/50 p-10 border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] bg-cyan-500/10 px-3 py-1 rounded-lg mb-6 inline-block">
                    {planInfo.type === 'QUOTE' ? 'Misión: Relevamiento' : 'Configuración de Enlace'}
                  </span>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                    {planInfo.title}
                  </h2>
                  <div className="h-1 w-12 bg-cyan-500 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
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

                <div className="relative z-10 pt-10 border-t border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estado del Canal</span>
                   </div>
                   <p className="text-[11px] font-bold text-cyan-400/70 uppercase">Cifrado de Punto a Punto Activo</p>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute bottom-[-20%] left-[-20%] w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
              </div>

              {/* Right Panel: Form */}
              <div className="lg:w-2/3 p-10 bg-slate-900/30">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Datos de la Solicitud</h3>
                  <button 
                    type="button"
                    onClick={handleManualClose}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre y Apellido</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Juan Pérez"
                        className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">DNI / CUIT Titular</label>
                      <input 
                        type="text" 
                        required
                        value={formData.dni}
                        onChange={e => setFormData({...formData, dni: e.target.value})}
                        placeholder="20345678901"
                        className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email de Contacto</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="correo@empresa.com"
                        className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Teléfono Móvil</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+54 9..."
                        className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Observaciones / Detalles</label>
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Describa brevemente el entorno de instalación..."
                      className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all resize-none placeholder:text-slate-700 text-sm"
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-grow bg-white hover:bg-cyan-500 text-slate-950 hover:text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-cyan-500/10 text-xs uppercase tracking-[0.2em] group active:scale-[0.98]"
                    >
                      {loading ? "ESTABLECIENDO ENLACE..." : "INICIAR PROCESO DE ALTA"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    <span className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Seguridad de Datos de Nivel Corporativo</span>
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
