"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';


import { saveInstallationContract } from '../app/contrato/actions';

// Nota: html2pdf debe cargarse dinámicamente en el cliente
let html2pdf: any;
if (typeof window !== 'undefined') {
  import('html2pdf.js').then((module) => {
    html2pdf = module.default;
  });
}

interface AntennaContractFormProps {
  agents: Array<{ id: string; name: string; role: string }>;
  nextInstallId: string;
  initialData?: {
    clientName?: string;
    clientEmail?: string;
    clientDni?: string;
    clientPhone?: string;
    planType?: string;
  };
}

export default function AntennaContractForm({ agents, nextInstallId, initialData }: AntennaContractFormProps) {
  const [formData, setFormData] = useState({
    installDate: new Date().toLocaleDateString('es-AR'),
    installId: nextInstallId || '',
    agentName: agents.length > 0 ? agents[0].name : '',
    razonSocial: initialData?.clientName || '',
    cuit: initialData?.clientDni || '',
    fantasia: 'MR TECHNOLOGY',
    email: initialData?.clientEmail || '',
    phone: initialData?.clientPhone || '',
    categoria: '',
    direccion: '',
    latitud: '',
    longitud: '',
    terminalId: '',
    serialKit: '',
    hardwareType: initialData?.planType || 'ESTANDAR V4',
    antennaModel: '',
    cableColor: '',
    estadoInstalacion: 'OPERATIVO',
    ubicacion: '',
    obstrucciones: 'Ninguna (0%)',
    downloadSpeed: '',
    uploadSpeed: '',
    latencia: '',
    modoRed: 'Router Starlink',
    
    // Checkboxes técnicos
    alturaCheck: false,
    soporteCheck: false,
    routerCheck: false,
    speedCheck: false,

    aceptoContrato: false,
    finalizadaInstalacion: false,
    clienteAclaracion: initialData?.clientName || '',
    clienteDni: initialData?.clientDni || '',
    agenteNombreCheck: agents.length > 0 ? agents[0].name : '',
    agenteDniCheck: '',
  });

  const { data: session } = useSession();
  const isTechnician = session?.user?.role === 'TECH' || session?.user?.role === 'ADMIN';

  const [isExporting, setIsExporting] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Imágenes
  const [photos, setPhotos] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handlePhotoUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => ({ ...prev, [key]: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    if (!reportRef.current || !html2pdf) return;

    setIsExporting(true);
    setShowFinalModal(true);

    const element = reportRef.current;
    const opt = {
      margin: 0,
      filename: `MR Contrato Starlink ${formData.razonSocial.toUpperCase() || 'CLIENTE'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3,
        useCORS: true, 
        letterRendering: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      // 1. Guardar en Base de Datos
      const dataToSave = {
        titular: formData.razonSocial,
        dni: formData.clienteDni,
        email: formData.email,
        telefono: formData.phone,
        ubicacion: formData.direccion,
        latitud: formData.latitud,
        longitud: formData.longitud,
        terminalId: formData.terminalId,
        nroSerieKit: formData.serialKit,
        producto: formData.hardwareType,
        antennaModel: formData.antennaModel,
        cableColor: formData.cableColor,
        ubicacionAntena: formData.ubicacion,
        obstrucciones: formData.obstrucciones,
        velocidadBajada: formData.downloadSpeed,
        velocidadSubida: formData.uploadSpeed,
        latencia: formData.latencia,
        modoRed: formData.modoRed,
        technicianId: agents.find(a => a.name === formData.agenteNombreCheck)?.id,
        // Checkboxes
        alturaCheck: formData.alturaCheck,
        soporteCheck: formData.soporteCheck,
        routerCheck: formData.routerCheck,
        speedCheck: formData.speedCheck
      };

      const result = await saveInstallationContract(dataToSave);
      console.log("Contrato guardado en DB:", result);

      // 2. Generar PDF
      await html2pdf().set(opt).from(element).save();
      
      // WhatsApp Logic
      setTimeout(() => {
        sendWhatsApp();
        setShowFinalModal(false);
        setIsExporting(false);
      }, 3000);
    } catch (err) {
      console.error("Error en proceso final:", err);
      setIsExporting(false);
    }
  };

  const sendWhatsApp = () => {
    let phone = formData.phone.replace(/\D/g, '');
    if (!phone) return;
    if (!phone.startsWith('54')) phone = '54' + phone;

    const message = encodeURIComponent(
      `📡 *MR Technology - Starlink*\n` +
      `―――――――――――――――――\n` +
      `Estimado/a *${formData.razonSocial}*,\n\n` +
      `Su instalación Starlink fue completada exitosamente. ✅\n\n` +
      `📌 *Detalles de la instalación:*\n` +
      `• N° de Instalación: *${formData.installId}*\n` +
      `• Fecha: *${formData.installDate}*\n` +
      `• Agente: *${formData.agentName}*\n\n` +
      `📄 Le enviamos a continuación el contrato de instalación. Por favor adjunte el PDF descargado a este chat.\n\n` +
      `Gracias por confiar en *MR Technology*. 🚀\n` +
      `Ante cualquier consulta, estamos a su disposición.`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  useEffect(() => {
    if (formData.agenteDniCheck.length === 8 && formData.finalizadaInstalacion) {
      generatePDF();
    }
  }, [formData.agenteDniCheck]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans py-10 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>
      
      {/* Styles Ported from HTML */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@500;600;700&family=Tourney:wght@700;900&display=swap');
        
        :root {
          --primary: #00d4ff;
          --secondary: #001a33;
          --accent: rgb(0, 212, 255);
        }

        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .neo-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .neo-input:focus {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: rgba(0, 212, 255, 0.5) !important;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
        }

        .glow-text {
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        .scanline {
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(0, 212, 255, 0.2), transparent);
          position: absolute;
          width: 100%;
          animation: scan 3s linear infinite;
          z-index: 20;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .premium-page {
          width: 210mm;
          min-height: 297mm;
          padding: 15mm;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 0 40px rgba(0,0,0,0.15);
          position: relative;
          border-radius: 4px;
        }

        .orbitron { font-family: 'Orbitron', sans-serif; }
        .inter { font-family: 'Inter', sans-serif; }

        input:disabled, select:disabled, textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .preview-value {
          display: block;
          width: 100%;
          padding: 4px 0;
          border-bottom: 1px solid #cbd5e1;
          color: #000000;
          font-weight: 800;
          font-size: 14px;
          min-height: 24px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--secondary);
          margin: 20px 0 10px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 5px solid var(--secondary);
          padding-left: 15px;
          background: rgba(0,0,0,0.03);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .form-row { grid-column: span 6; }
        .form-row.full { grid-column: span 12; }

        label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #0f172a;
          margin-bottom: 2px;
          display: block;
        }

        .photo-box {
          aspect-ratio: 4/3;
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          transition: all 0.3s ease;
        }

        .photo-box:hover { border-color: var(--primary); background: rgba(0, 212, 255, 0.05); }

        .final-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,15,30,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(10px);
        }

        @media print {
          .no-print { display: none; }
        }
      `}</style>

      {/* Modal de Finalización */}
      {showFinalModal && (
        <div className="final-modal animate-in fade-in duration-500">
          <div className="text-center p-10 border-2 border-cyan-400 rounded-[3rem] bg-slate-900 shadow-[0_0_50px_rgba(0,212,255,0.3)]">
             <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 animate-pulse">
                <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <h2 className="orbitron text-3xl font-black text-white mb-2 uppercase tracking-widest">
                ¡Instalación Finalizada!
             </h2>
             <p className="text-cyan-400 font-bold uppercase tracking-tighter mb-8">
                {isExporting ? "Generando Contrato PDF..." : "Abriendo WhatsApp del Cliente..."}
             </p>
             <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-10 no-print flex justify-between items-center relative z-10">
         <Link href="/" className="bg-slate-900/60 backdrop-blur-md border border-slate-800 text-slate-400 px-6 py-2 rounded-xl font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2} /></svg>
            Volver al Portal
         </Link>
         
         <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</p>
               <p className="text-cyan-400 font-bold text-xs uppercase tracking-tighter">Sincronización Activa</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
         </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-8 relative z-10">
         {/* Main Container: Form + PDF Preview */}
         <div className="space-y-8">
            {/* Interactive Card Summary for Mobile/Top */}
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-6 mb-8 flex items-center gap-6 shadow-2xl lg:hidden">
               <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 012 2" strokeWidth={1.5}/></svg>
               </div>
               <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">{formData.hardwareType}</h2>
                  <p className="text-cyan-500/70 text-xs font-bold tracking-widest">ORDEN #{formData.installId}</p>
               </div>
            </div>

            {/* Form Section */}
            <div className="glass-panel border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full scanline" />
               <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
               
                {/* Single Page Form Header */}
                <div className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 no-print">
                   <div>
                      <h2 className="orbitron text-4xl font-black text-white tracking-tighter uppercase glow-text">Certification <span className="text-cyan-400">Hub</span></h2>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        Protocolo de Validación Técnica V4.1
                      </p>
                   </div>
                   <div className="text-right bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ID Operación</p>
                      <p className="orbitron text-cyan-400 font-bold text-xl tracking-tighter">#{formData.installId}</p>
                   </div>
                </div>

                <div className="relative z-10 space-y-16">
                   
                   {/* SECCIÓN 1: DATOS DEL TITULAR */}
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black orbitron text-xl shadow-[0_0_20px_rgba(37,99,235,0.2)]">01</div>
                         <div>
                            <h3 className="orbitron font-black text-white uppercase tracking-wider text-xl">Perfil del Cliente</h3>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Identificación y Ubicación Geográfica</p>
                         </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="group md:col-span-2">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Titular / Razón Social</label>
                            <input id="razonSocial" value={formData.razonSocial} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">DNI / CUIT</label>
                            <input id="cuit" value={formData.cuit} onChange={handleInputChange} placeholder="00-00000000-0" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Teléfono de Contacto</label>
                            <input id="phone" value={formData.phone} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none" />
                         </div>
                         <div className="group md:col-span-2">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Domicilio de Instalación</label>
                            <input id="direccion" value={formData.direccion} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div className="group">
                               <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Latitud</label>
                               <input id="latitud" value={formData.latitud} onChange={handleInputChange} placeholder="-00.00000" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none" />
                            </div>
                            <div className="group">
                               <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Longitud</label>
                               <input id="longitud" value={formData.longitud} onChange={handleInputChange} placeholder="-00.00000" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none" />
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* SECCIÓN 2: HARDWARE Y PLAN */}
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black orbitron text-xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">02</div>
                         <div>
                            <h3 className="orbitron font-black text-white uppercase tracking-wider text-xl">Hardware Specs</h3>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Inventario y Componentes Técnicos</p>
                         </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-8">
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Plan de Servicio</label>
                            <input id="hardwareType" value={formData.hardwareType} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">ID Terminal</label>
                            <input id="terminalId" value={formData.terminalId} onChange={handleInputChange} placeholder="0000-0000" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Número de Serie (KIT)</label>
                            <input id="serialKit" value={formData.serialKit} onChange={handleInputChange} placeholder="KIT-000000" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Modelo de Antena</label>
                            <input id="antennaModel" value={formData.antennaModel} onChange={handleInputChange} placeholder="Standard V4" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Color de Cable</label>
                            <input id="cableColor" value={formData.cableColor} onChange={handleInputChange} placeholder="Gris / Negro" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none uppercase" />
                         </div>
                         <div className="group">
                            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Status Final</label>
                            <select id="estadoInstalacion" value={formData.estadoInstalacion} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-bold outline-none cursor-pointer">
                               <option value="OPERATIVO">OPERATIVO</option>
                               <option value="EN PRUEBAS">EN PRUEBAS</option>
                               <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   {/* SECCIÓN 3: RENDIMIENTO Y VALIDACIÓN */}
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black orbitron text-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">03</div>
                         <div>
                            <h3 className="orbitron font-black text-white uppercase tracking-wider text-xl">Performance Bench</h3>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Métricas de Conectividad y Validación</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                         {[
                            { id: 'downloadSpeed', label: 'Descarga', unit: 'MBPS', icon: 'M13 17V7m0 10l4-4m-4 4l-4-4' },
                            { id: 'uploadSpeed', label: 'Carga', unit: 'MBPS', icon: 'M11 7v10m0-10l-4 4m4-4l4 4' },
                            { id: 'latencia', label: 'Latencia', unit: 'MS', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            { id: 'modoRed', label: 'Modo Red', unit: '', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.5 9.5 0 0114.142 0M2.474 9.01a13.5 13.5 0 0119.052 0' }
                         ].map(stat => (
                            <div key={stat.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-all group/stat">
                               <div className="flex items-center justify-between mb-4">
                                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</label>
                                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d={stat.icon} strokeWidth={2}/></svg>
                               </div>
                               <div className="flex items-end gap-2">
                                  <input id={stat.id} value={formData[stat.id as keyof typeof formData] as string} onChange={handleInputChange} className="w-full bg-transparent text-3xl font-black text-white outline-none placeholder-white/10" placeholder="00" />
                                  <span className="text-[10px] font-black text-emerald-500 mb-2">{stat.unit}</span>
                               </div>
                            </div>
                         ))}
                      </div>

                      {/* Checkboxes Técnicos con diseño premium */}
                      <div className="grid md:grid-cols-2 gap-4">
                         {[
                            { id: 'alturaCheck', label: 'Instalación en Altura (Torre/Mástil)', desc: 'Certifica montaje seguro a más de 3m' },
                            { id: 'soporteCheck', label: 'Soporte Oficial MR Technology', desc: 'Uso de anclajes y soportes homologados' },
                            { id: 'routerCheck', label: 'Configuración de Router Finalizada', desc: 'SSID y Password configurados' },
                            { id: 'speedCheck', label: 'Pruebas de Velocidad Verificadas', desc: 'Rendimiento estable bajo protocolo' }
                         ].map(check => (
                            <div key={check.id} 
                                 className={`flex items-center gap-5 p-6 rounded-3xl border-2 transition-all cursor-pointer group/check ${formData[check.id as keyof typeof formData] ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                 onClick={() => handleInputChange({ target: { id: check.id, value: !formData[check.id as keyof typeof formData], type: 'checkbox', checked: !formData[check.id as keyof typeof formData] } } as any)}>
                               <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${formData[check.id as keyof typeof formData] ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10 text-white/30'}`}>
                                  {formData[check.id as keyof typeof formData] ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg>
                                  ) : (
                                    <div className="w-3 h-3 rounded-sm border-2 border-current" />
                                  )}
                               </div>
                               <div>
                                  <p className="text-white font-black text-xs uppercase tracking-tighter">{check.label}</p>
                                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">{check.desc}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* SECCIÓN 4: REGISTRO FOTOGRÁFICO */}
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black orbitron text-xl shadow-[0_0_20px_rgba(234,88,12,0.2)]">04</div>
                         <div>
                            <h3 className="orbitron font-black text-white uppercase tracking-wider text-xl">Visual Evidence</h3>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Documentación Visual del Proceso</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                         {['antena', 'montaje', 'router', 'speedtest', 'obstruccion', 'entorno'].map((key) => (
                            <div key={key} className="space-y-3">
                               <div className="photo-box relative h-32 group/photo" onClick={() => document.getElementById(`file-${key}`)?.click()}>
                                  {photos[key] ? (
                                     <img src={photos[key]} className="w-full h-full object-cover" />
                                  ) : (
                                     <div className="text-center">
                                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/10 group-hover/photo:border-orange-500/50 transition-all">
                                           <svg className="w-5 h-5 text-slate-500 group-hover/photo:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={1.5}/></svg>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover/photo:text-orange-400 transition-colors">{key}</span>
                                     </div>
                                  )}
                                  <input id={`file-${key}`} type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(key, e)} />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* SECCIÓN 5: VALIDACIÓN Y FIRMAS */}
                   <div className="space-y-10 pt-10 border-t border-white/10">
                      <div className="grid md:grid-cols-2 gap-8">
                         {/* Firma Técnico */}
                         <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-700 relative overflow-hidden group/sig ${formData.finalizadaInstalacion ? 'bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-500/20' : 'bg-white/5 border-white/10'} ${!isTechnician ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                            {formData.finalizadaInstalacion && <div className="absolute top-0 right-0 p-4"><svg className="w-8 h-8 text-blue-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg></div>}
                            <div className="flex items-center gap-5 mb-8">
                               <input id="finalizadaInstalacion" type="checkbox" checked={formData.finalizadaInstalacion} onChange={handleInputChange} disabled={!isTechnician} className="w-10 h-10 accent-blue-600 rounded-2xl cursor-pointer" />
                               <div>
                                  <p className="orbitron text-white font-black text-lg uppercase tracking-tight">Tech Authority</p>
                                  <p className="text-blue-400 text-[9px] uppercase font-bold tracking-[0.2em]">Certificación MR Technology</p>
                               </div>
                            </div>
                            {formData.finalizadaInstalacion && (
                               <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                  <div className="group">
                                     <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Identificación del Técnico</label>
                                     <select id="agenteNombreCheck" value={formData.agenteNombreCheck} onChange={handleInputChange} disabled={!isTechnician} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-black uppercase text-xs">
                                        {agents.map(agent => <option key={agent.id} value={agent.name}>{agent.name}</option>)}
                                     </select>
                                  </div>
                                  <div className="group">
                                     <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Token de Firma (DNI)</label>
                                     <input id="agenteDniCheck" value={formData.agenteDniCheck} onChange={handleInputChange} disabled={!isTechnician} placeholder="TOKEN DIGITAL" className="w-full neo-input rounded-2xl px-6 py-4 text-white font-black text-xs tracking-widest" maxLength={8} />
                                  </div>
                               </div>
                            )}
                         </div>

                         {/* Firma Cliente */}
                         <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-700 relative overflow-hidden group/sig ${formData.aceptoContrato ? 'bg-emerald-600/10 border-emerald-500 shadow-2xl shadow-emerald-500/20' : 'bg-white/5 border-white/10'} ${!formData.finalizadaInstalacion ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                            {formData.aceptoContrato && <div className="absolute top-0 right-0 p-4"><svg className="w-8 h-8 text-emerald-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg></div>}
                            <div className="flex items-center gap-5 mb-8">
                               <input id="aceptoContrato" type="checkbox" checked={formData.aceptoContrato} onChange={handleInputChange} disabled={!formData.finalizadaInstalacion} className="w-10 h-10 accent-emerald-600 rounded-2xl cursor-pointer" />
                               <div>
                                  <p className="orbitron text-white font-black text-lg uppercase tracking-tight">Customer Verify</p>
                                  <p className="text-emerald-400 text-[9px] uppercase font-bold tracking-[0.2em]">Conformidad Final de Obra</p>
                               </div>
                            </div>
                            {formData.aceptoContrato && (
                               <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                  <div className="group">
                                     <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Aclaración del Titular</label>
                                     <input id="clienteAclaracion" value={formData.clienteAclaracion} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-black uppercase text-xs" />
                                  </div>
                                  <div className="group">
                                     <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block tracking-widest">Documento de Respaldo</label>
                                     <input id="clienteDni" value={formData.clienteDni} onChange={handleInputChange} className="w-full neo-input rounded-2xl px-6 py-4 text-white font-black text-xs" />
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>

                      {/* Botón de Finalización Único Premium */}
                      <div className="flex justify-center pt-10">
                         <button 
                            disabled={!formData.aceptoContrato || !formData.finalizadaInstalacion || formData.agenteDniCheck.length < 7}
                            onClick={generatePDF}
                            className={`group relative px-16 py-6 rounded-[2.5rem] font-black orbitron uppercase tracking-[0.3em] transition-all duration-700 overflow-hidden ${formData.aceptoContrato && formData.finalizadaInstalacion ? 'bg-white text-black hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'}`}
                         >
                            <div className="relative z-10 flex items-center gap-6">
                               <span className="text-lg">Deploy Contract</span>
                               <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3}/></svg>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                            {formData.aceptoContrato && formData.finalizadaInstalacion && <div className="absolute top-0 left-0 w-full scanline opacity-50" />}
                         </button>
                      </div>
                   </div>
                </div>
            </div>
             
             {/* The PDF Preview */}
            <div className="mt-10 overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm p-2 group">
               <div className="flex items-center justify-between px-8 py-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-slate-500" />
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Previsualización del Documento Contractual</p>
                  </div>
                  <div className="bg-slate-800 rounded-full px-4 py-1 text-[9px] font-bold text-slate-500 uppercase">Hoja A4</div>
               </div>
               <div className="origin-top scale-[0.8] -mb-[400px] flex justify-center">
                  <div ref={reportRef} className="premium-page !m-0 !shadow-2xl pointer-events-none group-hover:scale-[1.01] transition-transform duration-700">
        {/* Header */}
        <div className="flex justify-between items-start mb-10 border-b-4 border-[#001a33] pb-6">
          <div className="w-1/2">
            <img 
              src="/logo_mr_tech.png" 
              alt="Logo" 
              className="max-h-24 object-contain"
            />
          </div>
          <div className="w-1/2 flex flex-col items-end gap-3 text-black">
             <div className="flex items-center gap-4">
                <span className="inter font-black text-[10px] text-slate-500 uppercase tracking-widest">Fecha</span>
                <span className="preview-value w-40 text-right">{formData.installDate}</span>
             </div>
             <div className="flex items-center gap-4">
                <span className="inter font-black text-[10px] text-slate-500 uppercase tracking-widest">ID Instalación</span>
                <span className="preview-value w-40 text-right">{formData.installId}</span>
             </div>
             <div className="flex items-center gap-4">
                <span className="inter font-black text-[10px] text-slate-500 uppercase tracking-widest">Agente Oficial</span>
                <span className="preview-value w-48 text-right uppercase">MR TECHNOLOGY</span>
             </div>
          </div>
        </div>

        <div className="text-center mb-8">
           <h1 className="orbitron text-3xl font-black text-[#001a33] border-y-2 border-[#001a33] py-3 inline-block px-10 tracking-[0.2em]">
              CONTRATO DE INSTALACIÓN
           </h1>
        </div>

        {/* Datos Cliente */}
        <div className="section-title">Datos del Cliente</div>
        <div className="form-grid text-black">
          <div className="form-row">
            <label>Razón Social</label>
            <span className="preview-value uppercase">{formData.razonSocial}</span>
          </div>
          <div className="form-row">
            <label>CUIT</label>
            <span className="preview-value">{formData.cuit}</span>
          </div>
          <div className="form-row">
            <label>Nombre de Fantasía</label>
            <span className="preview-value uppercase">{formData.fantasia}</span>
          </div>
          <div className="form-row">
            <label>Email</label>
            <span className="preview-value">{formData.email}</span>
          </div>
          <div className="form-row">
            <label>WSP / Celular</label>
            <span className="preview-value">{formData.phone}</span>
          </div>
          <div className="form-row">
            <label>Categoría</label>
            <span className="preview-value uppercase">{formData.categoria}</span>
          </div>
          <div className="form-row full">
            <label>Dirección</label>
            <span className="preview-value uppercase">{formData.direccion}</span>
          </div>
        </div>

        {/* Detalles Técnicos */}
        <div className="section-title">Detalles Técnicos Starlink</div>
        <div className="form-grid text-black">
          <div className="form-row">
            <label>Número de Serie (Kit)</label>
            <span className="preview-value uppercase">{formData.serialKit}</span>
          </div>
          <div className="form-row">
            <label>ID de Terminal</label>
            <span className="preview-value uppercase">{formData.terminalId}</span>
          </div>
          <div className="form-row">
            <label>Tipo de Hardware</label>
            <span className="preview-value uppercase">{formData.hardwareType}</span>
          </div>
          <div className="form-row">
            <label>Modelo de Antena</label>
            <span className="preview-value uppercase">{formData.antennaModel}</span>
          </div>
          <div className="form-row">
            <label>Color de Cable</label>
            <span className="preview-value uppercase">{formData.cableColor}</span>
          </div>
          <div className="form-row">
            <label>Ubicación de Antena</label>
            <span className="preview-value uppercase">{formData.ubicacion}</span>
          </div>
          <div className="form-row">
            <label>Coordenadas (LAT/LON)</label>
            <span className="preview-value">{formData.latitud} / {formData.longitud}</span>
          </div>
          <div className="form-row">
            <label>Obstrucciones</label>
            <span className="preview-value">{formData.obstrucciones}</span>
          </div>
        </div>

        {/* Verificación Técnica */}
        <div className="section-title">Verificación Técnica (Checklist)</div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 mb-8 text-black">
          {[
            { id: 'alturaCheck', label: 'Instalación en Altura' },
            { id: 'soporteCheck', label: 'Soporte Oficial MR' },
            { id: 'routerCheck', label: 'Config. Router' },
            { id: 'speedCheck', label: 'Pruebas de Velocidad' }
          ].map(check => (
            <div key={check.id} className="flex items-center gap-2 border-b border-slate-100 pb-1">
              <div className={`w-3 h-3 border border-slate-400 rounded-sm ${formData[check.id as keyof typeof formData] ? 'bg-black' : ''}`} />
              <span className="inter font-bold text-[9px] uppercase">{check.label}</span>
            </div>
          ))}
        </div>

        {/* Rendimiento */}
        <div className="section-title">Pruebas de Rendimiento</div>
        <div className="form-grid text-black">
          <div className="form-row">
             <label>Descarga (Mbps)</label>
             <span className="preview-value">{formData.downloadSpeed} MBPS</span>
          </div>
          <div className="form-row">
             <label>Carga (Mbps)</label>
             <span className="preview-value">{formData.uploadSpeed} MBPS</span>
          </div>
          <div className="form-row">
             <label>Latencia (ms)</label>
             <span className="preview-value">{formData.latencia} MS</span>
          </div>
          <div className="form-row">
             <label>Modo de Red</label>
             <span className="preview-value uppercase">{formData.modoRed}</span>
          </div>
        </div>

        {/* Fotos */}
        <div className="section-title">Registro Fotográfico</div>
        <div className="grid grid-cols-3 gap-3 mb-10">
          {['antena', 'montaje', 'router', 'speedtest', 'obstruccion', 'entorno'].map((key) => (
            <div key={key} className="photo-box relative" onClick={() => document.getElementById(`file-${key}`)?.click()}>
               {photos[key] ? (
                 <img src={photos[key]} className="w-full h-full object-cover" />
               ) : (
                 <span className="inter font-bold text-[10px] text-slate-400 uppercase text-center px-4">
                   Cargar {key}
                 </span>
               )}
               <input 
                 id={`file-${key}`} 
                 type="file" 
                 className="hidden" 
                 onChange={(e) => handlePhotoUpload(key, e)}
               />
            </div>
          ))}
        </div>

        {/* Firmas */}
        <div className="flex justify-around items-start mt-10 gap-10 text-black">
          <div className="w-1/2 border-t-2 border-[#001a33] pt-4 text-center">
             <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${formData.aceptoContrato ? 'bg-green-600' : 'bg-slate-200'}`} />
                <span className="inter font-black text-[10px] uppercase tracking-tighter">Aceptación Cliente</span>
             </div>
             {formData.aceptoContrato && (
               <div className="flex flex-col gap-1">
                 <span className="font-black text-xs uppercase">{formData.clienteAclaracion}</span>
                 <span className="font-bold text-[10px]">DNI: {formData.clienteDni}</span>
               </div>
             )}
          </div>

          <div className="w-1/2 border-t-2 border-[#001a33] pt-4 text-center">
             <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${formData.finalizadaInstalacion ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <span className="inter font-black text-[10px] uppercase tracking-tighter">Validación Técnica</span>
             </div>
              {formData.finalizadaInstalacion && (
                <div className="flex flex-col gap-1">
                  <span className="font-black text-xs uppercase">{formData.agenteNombreCheck}</span>
                  <span className="font-bold text-[10px]">DNI TÉCNICO: {formData.agenteDniCheck}</span>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 flex justify-between items-end">
           <div>
              <p className="orbitron text-xl font-black leading-none">MR TECHNOLOGY</p>
              <p className="orbitron text-[8px] tracking-[0.3em] font-bold text-slate-500 uppercase mt-1">Satellite Connectivity Solutions</p>
           </div>
           <div className="text-right">
              <p className="inter font-black text-[8px] text-slate-400 uppercase tracking-widest">
                Documento de Instalación de Servicio <br/>
                Propiedad de MR Technology S.A.
              </p>
           </div>
        </div>
         </div>
               </div>
            </div>
         </div>

         {/* Sidebar: Hardware Summary & Actions */}
         <div className="hidden lg:block space-y-6 sticky top-10 h-fit">
            <div className="bg-slate-900/60 backdrop-blur-3xl border border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M0 20 H60 V100" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500"/></svg>
               </div>
               
               <div className="relative z-10">
                  <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Equipamiento Seleccionado</p>
                  
                  <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/5">
                     <div className="w-20 h-20 rounded-[1.5rem] bg-blue-600/10 flex items-center justify-center border-2 border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all">
                        <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-white leading-none">{formData.hardwareType}</h4>
                        
                     </div>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[10px] font-bold uppercase">Ubicación</span>
                        <span className="text-white text-xs font-black uppercase">{formData.direccion || 'Pendiente'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[10px] font-bold uppercase">Sincronización</span>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                           <span className="text-green-500 text-xs font-black uppercase tracking-tighter">En Línea</span>
                        </div>
                     </div>
                  </div>

                  <button 
                     disabled={!formData.aceptoContrato || !formData.finalizadaInstalacion}
                     onClick={generatePDF}
                     className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl ${
                        formData.aceptoContrato && formData.finalizadaInstalacion 
                        ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-105" 
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                     }`}
                  >
                     {isExporting ? "Generando..." : "Firmar y Finalizar"}
                  </button>
                  
                  <p className="mt-6 text-[9px] text-slate-600 text-center uppercase font-bold leading-relaxed tracking-widest">
                     Al finalizar, se generará el contrato PDF oficial <br/> y se notificará al centro de mando.
                  </p>
               </div>
            </div>

            {/* Support Box */}
            <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6">
               <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                  <p className="text-xs font-black uppercase tracking-wider">Asistencia Técnica</p>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed">
                  ¿Necesita ayuda con la validación del Kit? <br/> Contacte a soporte de MR Technology.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
