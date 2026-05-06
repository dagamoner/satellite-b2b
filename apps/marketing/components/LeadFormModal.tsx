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
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
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

          // Asegurar que la URL sea absoluta
          if (!portalUrl.startsWith("http")) {
            portalUrl = `https://${portalUrl}`;
          }

          const targetBase = portalUrl.endsWith('/') ? portalUrl.slice(0, -1) : portalUrl;
          
          // LÓGICA DE REDIRECCIÓN UNIFICADA:
          // Ambos van a /contratos. El portal se encarga de mostrar la vista correcta según el plan.
          window.location.href = `${targetBase}/contratos?p_name=${encodeURIComponent(formData.name)}&p_email=${encodeURIComponent(formData.email)}&p_dni=${formData.dni}&p_phone=${encodeURIComponent(formData.phone)}&p_plan=${encodeURIComponent(planInfo.title)}&p_contract=${data.contractNumber}`;
        }, 3000); // Un poco más de tiempo para que anoten el número si quieren
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
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] bg-cyan-500/10 px-3 py-1 rounded-lg mb-3 inline-block">
                  {planInfo.type === 'QUOTE' ? 'Suscripción Corporativa' : 'Alta de Servicio'}
                </span>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{planInfo.title}</h2>
                <p className="text-slate-500 text-sm mt-3 font-medium">{planInfo.description}</p>
              </div>
              <button 
                type="button"
                onClick={handleManualClose}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5 active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">DNI / CUIT</label>
                  <input 
                    type="text" 
                    required
                    value={formData.dni}
                    onChange={e => setFormData({...formData, dni: e.target.value})}
                    placeholder="Sin puntos ni guiones"
                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Corporativo</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="usuario@empresa.com"
                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+54 9..."
                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mensaje o Requerimientos</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Detalle su consulta técnica o comercial..."
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all resize-none placeholder:text-slate-700"
                />
              </div>

              <div className="pt-6 space-y-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-cyan-500 text-slate-950 hover:text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-cyan-500/10 text-sm uppercase tracking-[0.2em] relative overflow-hidden group active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10">
                    {loading ? "GENERANDO CANAL SEGURO..." : "INICIAR CONEXIÓN Y CHAT"}
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={handleManualClose}
                  disabled={loading}
                  className="w-full bg-transparent border-2 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold py-4 rounded-2xl transition-all text-sm uppercase tracking-widest active:scale-[0.98]"
                >
                  Volver Atrás
                </button>
              </div>

              <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest leading-relaxed">
                Al iniciar la conexión, se le asignará un consultor del NOC <br/> 
                para validar su factibilidad técnica.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
