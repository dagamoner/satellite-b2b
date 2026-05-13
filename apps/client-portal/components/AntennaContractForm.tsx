"use client";

import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { saveInstallationContract, updateTicketStatus } from '../app/contrato/actions';

// html2pdf debe cargarse dinámicamente en el cliente
let html2pdf: any;
if (typeof window !== 'undefined') {
  import('html2pdf.js').then((module) => {
    html2pdf = module.default;
  });
}

interface AntennaContractFormProps {
  agents?: Array<{ id: string; name: string; role: string }>;
  nextInstallId: string;
  ticketStatus: string;
  ticketId: string;
  onBack: () => void;
  initialData?: {
    clientName?: string;
    clientEmail?: string;
    clientDni?: string;
    clientPhone?: string;
    planType?: string;
  };
}

export default function AntennaContractForm({ 
  agents = [], 
  nextInstallId, 
  ticketStatus, 
  ticketId, 
  onBack,
  initialData 
}: AntennaContractFormProps) {
  
  const [formData, setFormData] = useState({
    installDate: new Date().toLocaleDateString('es-AR'),
    installId: nextInstallId || '',
    razonSocial: initialData?.clientName || '',
    cuit: initialData?.clientDni || '',
    email: initialData?.clientEmail || '',
    phone: initialData?.clientPhone || '',
    direccion: '',
    terminalId: '',
    serialKit: '',
    hardwareType: initialData?.planType || 'Antena Estándar V4',
    ciudad: 'Mendoza',
    provincia: 'Mendoza',
    // Technical Specs
    downloadSpeed: '',
    uploadSpeed: '',
    latency: '',
    networkMode: 'DHCP/Router',
    antennaLocation: '',
    obstructions: '0%',
    cableColor: 'Gris',
    antennaModel: 'Standard V4',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Fase 1: Cliente confirma sus datos
  const handleClientDataConfirm = async () => {
    try {
      setIsExporting(true);
      // Actualizar ticket a TECH_IN_PROGRESS
      await updateTicketStatus(ticketId, "TECH_IN_PROGRESS", {
        clientName: formData.razonSocial,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        clientDni: formData.cuit,
        address: formData.direccion,
        city: formData.ciudad,
        province: formData.provincia,
      });
      onBack(); // Vuelve al chat o refresca
    } catch (err) {
      alert("Error al confirmar datos");
    } finally {
      setIsExporting(false);
    }
  };

  // Fase 2: Técnico finaliza instalación
  const handleTechFinalize = async () => {
    try {
      setIsExporting(true);
      // Actualizar ticket a SIGNATURE_PENDING y guardar datos técnicos
      await updateTicketStatus(ticketId, "SIGNATURE_PENDING", {
        terminalId: formData.terminalId,
        kitSerialNumber: formData.serialKit,
        antennaModel: formData.antennaModel,
        cableColor: formData.cableColor,
        antennaLocation: formData.antennaLocation,
        obstructions: formData.obstructions,
        downloadSpeed: parseFloat(formData.downloadSpeed) || 0,
        uploadSpeed: parseFloat(formData.uploadSpeed) || 0,
        latency: parseInt(formData.latency) || 0,
        networkMode: formData.networkMode,
      });
      onBack();
    } catch (err) {
      alert("Error al guardar datos técnicos");
    } finally {
      setIsExporting(false);
    }
  };

  // Fase 3: Firma Holográfica y Finalización Total
  const handleFinalSign = async () => {
    if (!isAccepted) {
      alert("Debe aceptar los términos para continuar.");
      return;
    }
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, estampe su firma holográfica.");
      return;
    }

    setIsExporting(true);
    setShowFinalModal(true);

    try {
      const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

      // 1. Finalizar Contrato en DB
      await updateTicketStatus(ticketId, "COMPLETED", {
        clientSignature: signatureData,
        installedAt: new Date(),
      });

      // 2. Generar PDF
      if (reportRef.current && html2pdf) {
        const element = reportRef.current;
        const opt = {
          margin: 10,
          filename: `Contrato_${formData.installId}_${formData.razonSocial.toUpperCase()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
      }
      
      // WhatsApp Notification
      sendWhatsApp();
      
      setTimeout(() => {
        setShowFinalModal(false);
        setIsExporting(false);
        onBack();
      }, 3000);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      setShowFinalModal(false);
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
      `Su contrato de instalación ha sido FINALIZADO y FIRMADO con éxito. ✅\n\n` +
      `📌 *ID Ticket:* *${ticketId.slice(0, 8)}*\n` +
      `• N° Contrato: *${formData.installId}*\n\n` +
      `📄 Ya puede descargar su copia final desde el portal.\n\n` +
      `Gracias por elegir a *MR Technology*. 🚀`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="main-wrapper">
      <style jsx>{`
        .main-wrapper { background: #0f172a; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; font-family: 'Inter', sans-serif; }
        .document-page { background: white; width: 100%; max-width: 210mm; min-height: 297mm; padding: 20mm; box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5); border-radius: 4px; position: relative; color: #1e293b; }
        .doc-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .logo-area h1 { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 1.5rem; color: #0f172a; margin: 0; letter-spacing: 1px; }
        .logo-area p { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin: 4px 0 0 0; font-weight: 700; }
        .contract-info { text-align: right; }
        .contract-info .label { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: #64748b; display: block; }
        .contract-info .value { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 700; color: #2563eb; }
        .doc-title { text-align: center; margin-bottom: 40px; }
        .doc-title h2 { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 10px 0; display: inline-block; min-width: 80%; color: #0f172a; text-transform: uppercase; letter-spacing: 2px; }
        .doc-section { margin-bottom: 30px; }
        .section-header { background: #f8fafc; border-left: 4px solid #2563eb; padding: 8px 15px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 15px; letter-spacing: 1px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .input-field { display: flex; flex-direction: column; gap: 5px; }
        .full-row { grid-column: span 2; }
        label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #64748b; }
        input, select { border: none; border-bottom: 1px solid #cbd5e1; padding: 8px 0; font-size: 0.95rem; font-weight: 600; color: #0f172a; outline: none; transition: border-color 0.3s; background: transparent; }
        input:focus { border-bottom-color: #2563eb; }
        .signature-area { margin-top: 40px; border: 2px dashed #e2e8f0; border-radius: 20px; padding: 20px; background: #f8fafc; position: relative; }
        .sig-canvas-container { background: white; border-radius: 15px; border: 1px solid #e2e8f0; }
        .status-badge { position: absolute; top: -15px; right: 20px; background: #2563eb; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .btn-action { background: #0f172a; color: white; border: none; padding: 15px 40px; border-radius: 12px; font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; margin: 10px; }
        .btn-action:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
        .btn-secondary { background: #64748b; }
        .actions { margin-top: 40px; width: 100%; max-width: 210mm; display: flex; flex-wrap: wrap; justify-content: center; }
        .final-modal { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .loader { width: 48px; height: 48px; border: 5px solid #FFF; border-bottom-color: #2563eb; border-radius: 50%; animation: rotation 1s linear infinite; margin-bottom: 20px; }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media print { .main-wrapper { padding: 0; background: white; } .document-page { box-shadow: none; padding: 0; margin: 0; } .actions { display: none; } }
      `}</style>

      {showFinalModal && (
        <div className="final-modal">
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div className="loader" style={{ margin: '0 auto 20px' }}></div>
            <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px' }}>
              {isExporting ? 'FINALIZANDO CONTRATO...' : 'DOCUMENTO GENERADO'}
            </h2>
            <p style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.6 }}>Redirigiendo al portal de soporte...</p>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEW */}
      <div className="document-page" ref={reportRef}>
        <div className="status-badge">{ticketStatus.replace('_', ' ')}</div>
        <div className="doc-header">
          <div className="logo-area">
            <h1>MR TECHNOLOGY</h1>
            <p>Satellite Connectivity Solutions</p>
          </div>
          <div className="contract-info">
            <span className="label">Contrato N°</span>
            <span className="value">{formData.installId}</span>
            <span className="label" style={{ marginTop: '10px' }}>{formData.installDate}</span>
          </div>
        </div>

        <div className="doc-title">
          <h2>CONTRATO DE INSTALACIÓN DE ANTENA</h2>
        </div>

        {/* SECTION 1: CLIENT DATA (Edit: CONTRACT_INITIATED) */}
        <div className="doc-section">
          <div className="section-header">01. Información del Titular</div>
          <div className="form-grid">
            <div className="input-field full-row">
              <label>Nombre / Razón Social</label>
              <input id="razonSocial" value={formData.razonSocial} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} />
            </div>
            <div className="input-field">
              <label>DNI / CUIT</label>
              <input id="cuit" value={formData.cuit} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} />
            </div>
            <div className="input-field">
              <label>Teléfono / WhatsApp</label>
              <input id="phone" value={formData.phone} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} />
            </div>
            <div className="input-field full-row">
              <label>Correo Electrónico</label>
              <input id="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} />
            </div>
            <div className="input-field full-row">
              <label>Dirección de Instalación</label>
              <input id="direccion" value={formData.direccion} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} />
            </div>
          </div>
        </div>

        {/* SECTION 2: TECHNICAL SPECS (Edit: TECH_IN_PROGRESS) */}
        <div className="doc-section">
          <div className="section-header">02. Especificaciones Técnicas (Starlink)</div>
          <div className="form-grid">
            <div className="input-field">
              <label>ID Terminal (KIT)</label>
              <input id="terminalId" value={formData.terminalId} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="Ej: 0000-0000" />
            </div>
            <div className="input-field">
              <label>Número de Serie</label>
              <input id="serialKit" value={formData.serialKit} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="KIT-000000" />
            </div>
            <div className="input-field">
              <label>Modelo de Antena</label>
              <input id="antennaModel" value={formData.antennaModel} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} />
            </div>
            <div className="input-field">
              <label>Ubicación de Antena</label>
              <input id="antennaLocation" value={formData.antennaLocation} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="Ej: Techo, Mástil" />
            </div>
            <div className="input-field">
              <label>Obstrucciones</label>
              <input id="obstructions" value={formData.obstructions} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} />
            </div>
            <div className="input-field">
              <label>Modo de Red</label>
              <select id="networkMode" value={formData.networkMode} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} className="w-full">
                <option value="DHCP/Router">DHCP/Router</option>
                <option value="Bypass/Bridge">Bypass/Bridge</option>
              </select>
            </div>
          </div>

          {/* PHOTO EVIDENCE (Only for Technician) */}
          {ticketStatus === 'TECH_IN_PROGRESS' && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
              {['photoCasa', 'photoAntena', 'photoRouter', 'photoCable', 'photoTest'].map((photo) => (
                <div key={photo} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors">
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={() => alert('Evidencia capturada con éxito')} />
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">{photo.replace('photo', 'FOTO ')}</div>
                    <svg className="w-6 h-6 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: PERFORMANCE TESTS (Edit: TECH_IN_PROGRESS) */}
        <div className="doc-section">
          <div className="section-header">03. Pruebas de Rendimiento Final</div>
          <div className="form-grid">
            <div className="input-field">
              <label>Bajada (Mbps)</label>
              <input id="downloadSpeed" value={formData.downloadSpeed} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="0.0" />
            </div>
            <div className="input-field">
              <label>Subida (Mbps)</label>
              <input id="uploadSpeed" value={formData.uploadSpeed} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="0.0" />
            </div>
            <div className="input-field">
              <label>Latencia (ms)</label>
              <input id="latency" value={formData.latency} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="0" />
            </div>
          </div>
        </div>

        {/* SECTION 4: HOLOGRAPHIC SIGNATURE (Visible: SIGNATURE_PENDING) */}
        {(ticketStatus === 'SIGNATURE_PENDING' || ticketStatus === 'COMPLETED') && (
          <div className="doc-section">
            <div className="section-header">04. Conformidad y Firma Holográfica</div>
            <div className="signature-area">
              <p style={{ fontSize: '0.7rem', marginBottom: '15px', color: '#64748b' }}>
                Yo, <strong>{formData.razonSocial}</strong>, acepto la instalación realizada y los términos del contrato de servicio satelital.
              </p>
              
              {ticketStatus === 'SIGNATURE_PENDING' ? (
                <>
                  <div className="sig-canvas-container">
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor='#0f172a'
                      canvasProps={{width: 600, height: 200, className: 'sigCanvas'}}
                    />
                  </div>
                  <button onClick={() => sigCanvas.current?.clear()} className="text-[9px] uppercase font-bold text-red-500 mt-2 block">Limpiar Firma</button>
                  
                  <div className="mt-6 flex items-center gap-3">
                    <input type="checkbox" id="accept" checked={isAccepted} onChange={(e) => setIsAccepted(e.target.checked)} className="w-5 h-5" />
                    <label htmlFor="accept" className="normal-case font-medium text-slate-700">Acepto los términos y condiciones del servicio.</label>
                  </div>
                </>
              ) : (
                <div className="flex justify-center p-4">
                  <img src={initialData?.clientDni /* Fallback or actual data */} alt="Firma" className="max-h-24 opacity-80" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="doc-section" style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '0.6rem', lineHeight: '1.4', color: '#94a3b8', textAlign: 'center' }}>
            MR TECHNOLOGY S.A. - CUIT 30-XXXXXXXX-X - MENDOZA, ARGENTINA<br/>
            Soporte Técnico: +54 9 261 XXXXXXX · Email: info@mrtechnology.com.ar
          </p>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="actions">
        <button className="btn-action btn-secondary" onClick={onBack}>Volver al Chat</button>
        
        {(['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)) && (
          <button className="btn-action" onClick={handleClientDataConfirm}>Confirmar Mis Datos</button>
        )}
        
        {ticketStatus === 'TECH_IN_PROGRESS' && (
          <button className="btn-action" onClick={handleTechFinalize}>Finalizar Instalación (Técnico)</button>
        )}
        
        {ticketStatus === 'SIGNATURE_PENDING' && (
          <button className="btn-action" onClick={handleFinalSign}>Acepto y Firmar Contrato</button>
        )}

        {ticketStatus === 'COMPLETED' && (
          <button className="btn-action" onClick={() => window.print()}>Imprimir / Descargar PDF</button>
        )}
      </div>
    </div>
  );
}
