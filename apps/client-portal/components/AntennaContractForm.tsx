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
    cuit: '',
    fantasia: 'MR TECHNOLOGY',
    email: initialData?.clientEmail || '',
    phone: initialData?.clientPhone || '',
    categoria: '',
    provincia: 'MENDOZA',
    localidad: '',
    direccion: '',
    numero: '',
    cp: '',
    serialKit: '',
    hardwareType: initialData?.planType?.includes('Mini') ? 'MINI X' : 'ESTANDAR V4',
    ubicacion: '',
    obstrucciones: 'Ninguna (0%)',
    objetoDesc: '',
    downloadSpeed: '',
    uploadSpeed: '',
    latencia: '',
    modoRed: 'Router Starlink',
    obsTecnicas: '',
    obsRendimiento: '',
    showObs1: false,
    showObs2: false,
    aceptoContrato: false,
    finalizadaInstalacion: false,
    clienteAclaracion: initialData?.clientName || '',
    clienteDni: initialData?.clientDni || '',
    agenteNombreCheck: agents.length > 0 ? agents[0].name : '',
    agenteDniCheck: '',
  });

  const { data: session } = useSession();
  const isTechnician = session?.user?.role === 'TECH' || session?.user?.role === 'ADMIN';


  const [currentStep, setCurrentStep] = useState(1);
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
        nroSerieKit: formData.serialKit,
        producto: formData.hardwareType,
        ubicacionAntena: formData.ubicacion,
        obstrucciones: formData.obstrucciones,
        velocidadBajada: formData.downloadSpeed,
        velocidadSubida: formData.uploadSpeed,
        latencia: formData.latencia,
        modoRed: formData.modoRed,
        technicianId: agents.find(a => a.name === formData.agenteNombreCheck)?.id,
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

        .input-header {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 800;
          text-align: center;
          border: none;
          border-bottom: 2px solid #cbd5e1;
          background: rgba(255, 255, 255, 0.4);
          color: #2b6cb0;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
        }

        .input-header:focus, .input-header-filled {
          background: #ffffff !important;
          border-bottom-color: #2b6cb0;
          color: #000000 !important;
          font-weight: 900;
        }

        input, select, textarea {
          background: #ffffff !important;
          color: #000000 !important;
          border: 2px solid #cbd5e1 !important;
          -webkit-text-fill-color: #000000 !important;
          font-weight: 900 !important;
          font-size: 14px !important;
          opacity: 1 !important;
        }

        input::placeholder, textarea::placeholder {
          color: #94a3b8 !important;
        }


        input:disabled, select:disabled, textarea:disabled {
          background: #f8fafc !important;
          color: #1e293b !important;
          -webkit-text-fill-color: #1e293b !important;
          cursor: not-allowed;
          opacity: 1 !important;
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

        input:not(.input-header), select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid #94a3b8 !important;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 900 !important;
          background: white !important;
          color: black !important;
        }

        .photo-box {
          aspect-ratio: 4/3;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          background: white;
          transition: all 0.3s ease;
        }

        .photo-box:hover { border-color: var(--primary); background: #f0f9ff; }

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
            <div className="bg-white border-2 border-slate-300 rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32" />
               {/* Step Navigation Indicators */}
                <div className="flex justify-between items-center mb-12 gap-2 relative z-10 overflow-x-auto pb-4 no-print">
                   {[1,2,3,4,5,6,7].map(num => (
                      <div key={num} className="flex flex-col items-center gap-2 min-w-[60px]">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all border-2 ${currentStep === num ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' : currentStep > num ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                            {currentStep > num ? '✓' : num}
                         </div>
                         <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep === num ? 'text-blue-800' : 'text-slate-400'}`}>
                            {num === 1 ? 'Suscrip.' : num === 2 ? 'Cliente' : num === 3 ? 'Técnico' : num === 4 ? 'Tests' : num === 5 ? 'Fotos' : num === 6 ? 'Certif.' : 'Firma'}
                         </span>
                      </div>
                   ))}
                </div>

                <div className="relative z-10">
                   {/* Step 1: Suscripción */}
                   {currentStep === 1 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-blue-600 !text-blue-800 !px-0 border-b-2 pb-2 font-black">Detalles de Suscripción</div>
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Fecha de Instalación</label>
                               <input id="installDate" value={formData.installDate} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">ID de Instalación (SOL-XXXX)</label>
                               <input id="installId" value={formData.installId} onChange={handleInputChange} placeholder="SOL-2026-XXXX" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div className="group md:col-span-2">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Agente Oficial</label>
                               <input value="MR TECHNOLOGY" disabled className="w-full bg-slate-50 border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-black focus:border-blue-600 outline-none transition-all" />
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 2: Datos del Cliente */}
                   {currentStep === 2 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-blue-600 !text-blue-800 !px-0 border-b-2 pb-2 font-black">Datos del Cliente</div>
                         <div className="space-y-6">
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Razón Social / Nombre Completo</label>
                               <input id="razonSocial" value={formData.razonSocial} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all uppercase" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="group">
                                  <label className="text-black text-[11px] font-black uppercase mb-1 block">CUIT / CUIL</label>
                                  <input id="cuit" value={formData.cuit} onChange={handleInputChange} placeholder="00-00000000-0" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all" />
                               </div>
                               <div className="group">
                                  <label className="text-black text-[11px] font-black uppercase mb-1 block">Nombre de Fantasía</label>
                                  <input id="fantasia" value={formData.fantasia} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all uppercase" />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="group">
                                  <label className="text-black text-[11px] font-black uppercase mb-1 block">Email de Contacto</label>
                                  <input id="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all" />
                               </div>
                               <div className="group">
                                  <label className="text-black text-[11px] font-black uppercase mb-1 block">Celular de Contacto</label>
                                  <input id="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all" />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="group">
                                  <label className="text-black text-[11px] font-black uppercase mb-1 block">Categoría</label>
                                  <select id="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all">
                                     <option value="">Seleccionar...</option>
                                     <option value="HOGAREÑO">HOGAREÑO</option>
                                     <option value="EMPRESA">EMPRESA</option>
                                     <option value="PYME">PYME</option>
                                     <option value="BODEGA">BODEGA</option>
                                  </select>
                               </div>
                               <div className="group">
                                  <label className="text-black text-[11px] font-black uppercase mb-1 block">Dirección de Instalación</label>
                                  <input id="direccion" value={formData.direccion} onChange={handleInputChange} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-blue-600 outline-none transition-all uppercase" />
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 3: Detalles Técnicos Starlink (Solo Técnico) */}
                   {currentStep === 3 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-cyan-600 !text-cyan-800 !px-0 border-b-2 pb-2 font-black flex justify-between items-center">
                            <span>Detalles Técnicos Starlink</span>
                            {!isTechnician && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-md">SOLO PERSONAL AUTORIZADO</span>}
                         </div>
                         <div className={`grid md:grid-cols-2 gap-8 ${!isTechnician ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Número de Serie (Kit)</label>
                               <input id="serialKit" value={formData.serialKit} onChange={handleInputChange} disabled={!isTechnician} placeholder="KIT-XXXXXX" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-cyan-600 outline-none transition-all uppercase" />
                            </div>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Tipo de Hardware</label>
                               <select id="hardwareType" value={formData.hardwareType} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-cyan-600 outline-none transition-all">
                                  <option value="ESTANDAR V4">ESTANDAR V4</option>
                                  <option value="MINI X">MINI X</option>
                                  <option value="ITINERANTE">ITINERANTE</option>
                               </select>
                            </div>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Ubicación de la Antena</label>
                               <input id="ubicacion" value={formData.ubicacion} onChange={handleInputChange} disabled={!isTechnician} placeholder="EJ: Techo principal" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-cyan-600 outline-none transition-all uppercase" />
                            </div>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Nivel de Obstrucciones</label>
                               <select id="obstrucciones" value={formData.obstrucciones} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-cyan-600 outline-none transition-all">
                                  <option>Ninguna (0%)</option>
                                  <option>Mínima (< 1%)</option>
                                  <option>Moderada (1-5%)</option>
                                  <option>Crítica (> 5%)</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 4: Pruebas de Rendimiento (Solo Técnico) */}
                   {currentStep === 4 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-green-600 !text-green-800 !px-0 border-b-2 pb-2 font-black flex justify-between items-center">
                            <span>Pruebas de Rendimiento</span>
                            {!isTechnician && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-md">SOLO PERSONAL AUTORIZADO</span>}
                         </div>
                         <div className={`space-y-8 ${!isTechnician ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <div className="grid grid-cols-3 gap-6">
                               <div className="bg-white p-6 rounded-2xl border-2 border-slate-400 shadow-sm">
                                  <label className="text-black text-[9px] font-black uppercase mb-2 block">Descarga (Mbps)</label>
                                  <input id="downloadSpeed" value={formData.downloadSpeed} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-transparent text-3xl font-black text-blue-800 outline-none" placeholder="000" />
                               </div>
                               <div className="bg-white p-6 rounded-2xl border-2 border-slate-400 shadow-sm">
                                  <label className="text-black text-[9px] font-black uppercase mb-2 block">Carga (Mbps)</label>
                                  <input id="uploadSpeed" value={formData.uploadSpeed} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-transparent text-3xl font-black text-cyan-800 outline-none" placeholder="00" />
                               </div>
                               <div className="bg-white p-6 rounded-2xl border-2 border-slate-400 shadow-sm">
                                  <label className="text-black text-[9px] font-black uppercase mb-2 block">Latencia (ms)</label>
                                  <input id="latencia" value={formData.latencia} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-transparent text-3xl font-black text-green-800 outline-none" placeholder="00" />
                               </div>
                            </div>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Modo de Red</label>
                               <select id="modoRed" value={formData.modoRed} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-green-600 outline-none transition-all">
                                  <option>Router Starlink</option>
                                  <option>Modo Bypass</option>
                                  <option>Router Cliente</option>
                               </select>
                            </div>
                            <div className="group">
                               <label className="text-black text-[11px] font-black uppercase mb-1 block">Observaciones Técnicas</label>
                               <textarea id="obsTecnicas" value={formData.obsTecnicas} onChange={handleInputChange} disabled={!isTechnician} rows={3} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-bold focus:border-green-600 outline-none transition-all resize-none" placeholder="Detalles sobre el rendimiento o instalación..." />
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 5: Registro Fotográfico (Solo Técnico) */}
                   {currentStep === 5 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-orange-600 !text-orange-800 !px-0 border-b-2 pb-2 font-black flex justify-between items-center">
                            <span>Registro Fotográfico</span>
                            {!isTechnician && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-md">SOLO PERSONAL AUTORIZADO</span>}
                         </div>
                         <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${!isTechnician ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            {['antena', 'montaje', 'router', 'speedtest', 'obstruccion', 'entorno'].map((key) => (
                               <div key={key} className="space-y-2">
                                  <label className="text-black text-[9px] font-black uppercase text-center block">{key}</label>
                                  <div className="photo-box relative h-40 border-slate-400" onClick={() => isTechnician && document.getElementById(`file-${key}`)?.click()}>
                                     {photos[key] ? (
                                        <img src={photos[key]} className="w-full h-full object-cover rounded-lg" />
                                     ) : (
                                        <div className="text-center p-4">
                                           <svg className="w-8 h-8 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={1.5}/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={1.5}/></svg>
                                           <span className="text-[9px] font-black text-slate-400 uppercase">Subir Foto</span>
                                        </div>
                                     )}
                                     <input id={`file-${key}`} type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(key, e)} disabled={!isTechnician} />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}

                   {/* Step 6: Certificación Técnica (Solo Técnico) */}
                   {currentStep === 6 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-blue-700 !text-blue-900 !px-0 border-b-2 pb-2 font-black flex justify-between items-center">
                            <span>Certificación Técnica</span>
                            {!isTechnician && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-md">SOLO PERSONAL AUTORIZADO</span>}
                         </div>
                         <div className={`p-10 rounded-[3rem] border-4 transition-all duration-500 ${formData.finalizadaInstalacion ? 'bg-blue-50 border-blue-600 shadow-xl shadow-blue-500/10' : 'bg-white border-slate-300'} ${!isTechnician ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-6 mb-8">
                               <input id="finalizadaInstalacion" type="checkbox" checked={formData.finalizadaInstalacion} onChange={handleInputChange} disabled={!isTechnician} className="w-10 h-10 accent-blue-600 rounded-xl cursor-pointer" />
                               <div>
                                  <p className="text-black font-black text-xl uppercase tracking-tighter">Certificación Técnica</p>
                                  <p className="text-blue-800 text-xs uppercase font-black">Declaro que la instalación ha sido completada según los estándares de MR TECHNOLOGY</p>
                               </div>
                            </div>
                            {formData.finalizadaInstalacion && (
                               <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                                  <div className="group">
                                     <label className="text-black text-[11px] font-black uppercase mb-1 block">Agente Certificador</label>
                                     <select id="agenteNombreCheck" value={formData.agenteNombreCheck} onChange={handleInputChange} disabled={!isTechnician} className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-black uppercase outline-none focus:border-blue-600">
                                        {agents.map(agent => <option key={agent.id} value={agent.name}>{agent.name}</option>)}
                                     </select>
                                  </div>
                                  <div className="group">
                                     <label className="text-black text-[11px] font-black uppercase mb-1 block">DNI del Técnico (Firma Digital)</label>
                                     <input id="agenteDniCheck" value={formData.agenteDniCheck} onChange={handleInputChange} disabled={!isTechnician} placeholder="Ingrese su DNI para firmar" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-black outline-none focus:border-blue-600" maxLength={8} />
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                   )}

                   {/* Step 7: Aceptación del Cliente */}
                   {currentStep === 7 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="section-title !m-0 !bg-transparent !border-green-700 !text-green-900 !px-0 border-b-2 pb-2 font-black flex justify-between items-center">
                            <span>Conformidad del Cliente</span>
                            {!formData.finalizadaInstalacion && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-md uppercase">Esperando Validación Técnica</span>}
                         </div>
                         <div className={`p-10 rounded-[3rem] border-4 transition-all duration-500 ${formData.aceptoContrato ? 'bg-green-50 border-green-600 shadow-xl shadow-green-500/10' : 'bg-white border-slate-300'} ${!formData.finalizadaInstalacion ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-6 mb-8">
                               <input id="aceptoContrato" type="checkbox" checked={formData.aceptoContrato} onChange={handleInputChange} disabled={!formData.finalizadaInstalacion} className="w-10 h-10 accent-green-600 rounded-xl cursor-pointer" />
                               <div>
                                  <p className="text-black font-black text-xl uppercase tracking-tighter">Firma del Titular</p>
                                  <p className="text-green-800 text-xs uppercase font-black">He verificado el funcionamiento y acepto los términos del servicio</p>
                               </div>
                            </div>
                            {formData.aceptoContrato && (
                               <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                                  <div className="group">
                                     <label className="text-black text-[11px] font-black uppercase mb-1 block">Nombre y Apellido / Aclaración</label>
                                     <input id="clienteAclaracion" value={formData.clienteAclaracion} onChange={handleInputChange} placeholder="Nombre completo" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-black uppercase outline-none focus:border-green-600" />
                                  </div>
                                  <div className="group">
                                     <label className="text-black text-[11px] font-black uppercase mb-1 block">DNI / Documento del Titular</label>
                                     <input id="clienteDni" value={formData.clienteDni} onChange={handleInputChange} placeholder="Número de documento" className="w-full bg-white border-2 border-slate-400 rounded-xl px-4 py-3 text-black font-black outline-none focus:border-green-600" />
                                  </div>
                               </div>
                            )}
                            {!formData.finalizadaInstalacion && (
                               <div className="mt-8 p-6 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center gap-4 text-orange-800">
                                  <svg className="w-8 h-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2}/></svg>
                                  <p className="text-xs font-black uppercase leading-relaxed">La firma del cliente se habilitará automáticamente una vez que el técnico complete la Certificación Técnica en el paso anterior.</p>
                               </div>
                            )}
                         </div>
                      </div>
                   )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-12 pt-8 border-t-2 border-slate-100 flex justify-between items-center no-print">
                   <button 
                      onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
                      className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                   >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={3}/></svg>
                      Anterior
                   </button>
                   
                   <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Paso {currentStep} de 7</p>
                      <div className="flex gap-1 mt-1">
                         {[1,2,3,4,5,6,7].map(n => <div key={n} className={`w-3 h-1 rounded-full ${currentStep === n ? 'bg-blue-600' : 'bg-slate-200'}`} />)}
                      </div>
                   </div>

                   {currentStep < 7 ? (
                      <button 
                         onClick={() => setCurrentStep(prev => prev + 1)}
                         className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                      >
                         Siguiente
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
                      </button>
                   ) : (
                      <div className="flex flex-col items-end">
                         {!formData.aceptoContrato && <p className="text-[9px] font-black text-red-500 uppercase mb-2">Debe firmar para finalizar</p>}
                         <button 
                            disabled={!formData.aceptoContrato || !formData.finalizadaInstalacion || formData.agenteDniCheck.length < 7}
                            onClick={generatePDF}
                            className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-2 ${formData.aceptoContrato && formData.finalizadaInstalacion ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                         >
                            Finalizar y Descargar
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={3}/></svg>
                         </button>
                      </div>
                   )}
                  </div>
               </div>
            </div>
            
            {/* The PDF Preview */}
            <div className="mt-10 overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-sm p-2 group">
               <div className="flex items-center justify-between px-8 py-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-slate-500" />
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Previsualización del Documento Certificado</p>
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
          <div className="w-1/2 flex flex-col items-end gap-3">
             <div className="flex items-center gap-4">
                <span className="inter font-black text-[10px] text-slate-500 uppercase tracking-widest">Fecha</span>
                <input 
                  id="installDate"
                  type="text" 
                  value={formData.installDate}
                  onChange={handleInputChange}
                  className="input-header w-40"
                />
             </div>
             <div className="flex items-center gap-4">
                <span className="inter font-black text-[10px] text-slate-500 uppercase tracking-widest">ID Instalación</span>
                <input 
                  id="installId"
                  type="text" 
                  value={formData.installId}
                  onChange={handleInputChange}
                  placeholder="0000"
                  className="input-header w-40"
                />
             </div>
             <div className="flex items-center gap-4">
                <span className="inter font-black text-[10px] text-slate-500 uppercase tracking-widest">Agente Oficial</span>
                <select 
                  id="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  className="input-header w-48 uppercase appearance-none"
                >
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>
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
        <div className="form-grid">
          <div className="form-row">
            <label>Razón Social</label>
            <input id="razonSocial" value={formData.razonSocial} onChange={handleInputChange} className="uppercase font-black text-black" />
          </div>
          <div className="form-row">
            <label>CUIT</label>
            <input id="cuit" value={formData.cuit} onChange={handleInputChange} placeholder="00-00000000-0" className="font-black text-black" />
          </div>
          <div className="form-row">
            <label>Nombre de Fantasía</label>
            <input id="fantasia" value={formData.fantasia} onChange={handleInputChange} className="uppercase font-black text-black" />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input id="email" type="email" value={formData.email} onChange={handleInputChange} className="font-black text-black" />
          </div>
          <div className="form-row">
            <label>WSP / Celular</label>
            <input id="phone" value={formData.phone} onChange={handleInputChange} className="font-black text-black" />
          </div>
          <div className="form-row">
            <label>Categoría</label>
            <select id="categoria" value={formData.categoria} onChange={handleInputChange} className="font-black text-black">
              <option value="">Seleccionar...</option>
              <option value="HOGAREÑO">HOGAREÑO</option>
              <option value="EMPRESA">EMPRESA</option>
              <option value="PYME">PYME</option>
              <option value="BODEGA">BODEGA</option>
            </select>
          </div>
          <div className="form-row full">
            <label>Dirección</label>
            <input id="direccion" value={formData.direccion} onChange={handleInputChange} className="uppercase font-black text-black" />
          </div>
        </div>

        {/* Detalles Técnicos */}
        <div className="section-title">Detalles Técnicos Starlink</div>
        <div className="form-grid">
          <div className="form-row">
            <label>Número de Serie (Kit)</label>
            <input id="serialKit" value={formData.serialKit} onChange={handleInputChange} className="uppercase" />
          </div>
          <div className="form-row">
            <label>Tipo de Hardware</label>
            <select id="hardwareType" value={formData.hardwareType} onChange={handleInputChange}>
              <option value="ESTANDAR V4">ESTANDAR V4</option>
              <option value="MINI X">MINI X</option>
              <option value="ITINERANTE">ITINERANTE</option>
            </select>
          </div>
          <div className="form-row">
            <label>Ubicación</label>
            <input id="ubicacion" value={formData.ubicacion} onChange={handleInputChange} className="uppercase" />
          </div>
          <div className="form-row">
            <label>Obstrucciones</label>
            <select id="obstrucciones" value={formData.obstrucciones} onChange={handleInputChange}>
              <option>Ninguna (0%)</option>
              <option>Mínima (&lt; 1%)</option>
              <option>Moderada (1-5%)</option>
              <option>Crítica (&gt; 5%)</option>
            </select>
          </div>
        </div>

        {/* Rendimiento */}
        <div className="section-title">Pruebas de Rendimiento</div>
        <div className="form-grid">
          <div className="form-row">
             <label>Descarga (Mbps)</label>
             <input id="downloadSpeed" value={formData.downloadSpeed} onChange={handleInputChange} />
          </div>
          <div className="form-row">
             <label>Carga (Mbps)</label>
             <input id="uploadSpeed" value={formData.uploadSpeed} onChange={handleInputChange} />
          </div>
          <div className="form-row">
             <label>Latencia (ms)</label>
             <input id="latencia" value={formData.latencia} onChange={handleInputChange} />
          </div>
          <div className="form-row">
             <label>Modo de Red</label>
             <select id="modoRed" value={formData.modoRed} onChange={handleInputChange}>
               <option>Router Starlink</option>
               <option>Modo Bypass</option>
               <option>Router Cliente</option>
             </select>
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
        <div className="flex justify-around items-start mt-10 gap-10">
          <div className="w-1/2 border-t-2 border-[#001a33] pt-4 text-center">
             <div className="flex items-center justify-center gap-2 mb-4">
                <input 
                  id="aceptoContrato" 
                  type="checkbox" 
                  checked={formData.aceptoContrato}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#001a33]"
                />
                <span className="inter font-black text-xs uppercase tracking-tighter">Acepto Contrato</span>
             </div>
             {formData.aceptoContrato && (
               <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                 <input 
                    id="clienteAclaracion" 
                    value={formData.clienteAclaracion} 
                    onChange={handleInputChange}
                    placeholder="Aclaración"
                    className="text-center font-bold text-sm uppercase"
                 />
                 <input 
                    id="clienteDni" 
                    value={formData.clienteDni} 
                    onChange={handleInputChange}
                    placeholder="DNI"
                    className="text-center font-bold text-sm"
                 />
               </div>
             )}
          </div>

          <div className="w-1/2 border-t-2 border-[#001a33] pt-4 text-center">
             <div className="flex items-center justify-center gap-2 mb-4">
                <input 
                  id="finalizadaInstalacion" 
                  type="checkbox" 
                  checked={formData.finalizadaInstalacion}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-[#001a33]"
                />
                <span className="inter font-black text-xs uppercase tracking-tighter">Instalación Finalizada</span>
             </div>
              {formData.finalizadaInstalacion && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                  <select 
                    id="agenteNombreCheck" 
                    value={formData.agenteNombreCheck} 
                    onChange={handleInputChange}
                    className="text-center font-bold text-sm uppercase bg-transparent border-b border-slate-300 outline-none appearance-none"
                  >
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.name}>{agent.name}</option>
                    ))}
                  </select>
                  <input 
                    id="agenteDniCheck" 
                    value={formData.agenteDniCheck} 
                    onChange={handleInputChange}
                    placeholder="DNI para cerrar"
                    className="text-center font-bold text-sm"
                    maxLength={8}
                  />
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
                Documento de Certificación de Servicio <br/>
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
                        <span className="text-slate-500 text-[10px] font-bold uppercase mt-2 block tracking-widest">Active Certification</span>
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
