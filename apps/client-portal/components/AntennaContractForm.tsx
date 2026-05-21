"use client";

import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { updateTicketStatus } from "@/app/contrato/actions";

// html2pdf debe cargarse dinámicamente en el cliente
let html2pdf: any; // Se mantiene any por simplicidad con la librería externa
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
    clientCategory?: string;
    planType?: string;
    street?: string;
    houseNumber?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    terminalId?: string;
    serialKit?: string;
    downloadSpeed?: string;
    uploadSpeed?: string;
    latency?: string;
    networkMode?: string;
    antennaLocation?: string;
    antennaModel?: string;
    obstructions?: string;
    obstructionObject?: string;
    observations?: string;
    perfObservations?: string;
    techName?: string | null;
    techDni?: string | null;
    techSignedAt?: Date | string | null;
    clientSignedAt?: Date | string | null;
  };
}

// Interfaz para el estado del formulario
interface AntennaFormData {
  installDate: string;
  installId: string;
  razonSocial: string;
  cuit: string;
  email: string;
  phone: string;
  category: string;
  direccion: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  terminalId: string;
  serialKit: string;
  hardwareType: string;
  ciudad: string;
  provincia: string;
  downloadSpeed: string;
  uploadSpeed: string;
  latency: string;
  networkMode: string;
  antennaLocation: string;
  antennaModel: string;
  obstructions: string;
  obstructionObject: string;
  observations: string;
  perfObservations: string;
  photoAntena: string;
  photoSoporte: string;
  photoRouter: string;
  photoTest: string;
  photoApp: string;
  photoRack: string;
  cableColor?: string;
  // Campos de firma detallados
  techName: string;
  techDni: string;
  techSignedAt?: string;
  clientNameSign: string;
  clientDniSign: string;
  clientSignedAt?: string;
}

export default function AntennaContractForm({ 
  agents = [], 
  nextInstallId, 
  ticketStatus, 
  ticketId, 
  onBack,
  initialData 
}: AntennaContractFormProps) {
  
  const [formData, setFormData] = useState<AntennaFormData>({
    installDate: new Date().toLocaleDateString('es-AR'),
    installId: nextInstallId || '',
    razonSocial: initialData?.clientName || '',
    cuit: initialData?.clientDni || '',
    email: initialData?.clientEmail || '',
    phone: initialData?.clientPhone || '',
    category: initialData?.clientCategory || 'Hogareño',
    direccion: '',
    street: initialData?.street || '',
    houseNumber: initialData?.houseNumber || '',
    zipCode: initialData?.zipCode || '',
    terminalId: initialData?.terminalId || '',
    serialKit: initialData?.serialKit || '',
    hardwareType: initialData?.planType || 'Antena Estándar V4',
    ciudad: initialData?.city || '',
    provincia: initialData?.province || 'Mendoza',
    // Technical Specs
    downloadSpeed: initialData?.downloadSpeed || '',
    uploadSpeed: initialData?.uploadSpeed || '',
    latency: initialData?.latency || '',
    networkMode: initialData?.networkMode || 'DHCP/Router',
    antennaLocation: initialData?.antennaLocation || '',
    antennaModel: initialData?.antennaModel || 'STANDAR V4',
    obstructions: initialData?.obstructions || 'Ninguna 0%',
    obstructionObject: initialData?.obstructionObject || '',
    observations: initialData?.observations || '',
    perfObservations: initialData?.perfObservations || '',
    // Photos
    photoAntena: '',
    photoSoporte: '',
    photoRouter: '',
    photoTest: '',
    photoApp: '',
    photoRack: '',
    // Inicialización de firmas
    techName: initialData?.techName || '',
    techDni: initialData?.techDni || '',
    techSignedAt: initialData?.techSignedAt ? new Date(initialData.techSignedAt).toLocaleString('es-AR') : '',
    clientNameSign: initialData?.clientName || '', // Por defecto el del titular
    clientDniSign: initialData?.clientDni || '',   // Por defecto el del titular
    clientSignedAt: initialData?.clientSignedAt ? new Date(initialData.clientSignedAt).toLocaleString('es-AR') : '',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isTechAccepted, setIsTechAccepted] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const [isTechDigitallySigned, setIsTechDigitallySigned] = useState(false);
  const [isClientDigitallySigned, setIsClientDigitallySigned] = useState(false);

  const handleTechDigitalSignToggle = (checked: boolean) => {
    setIsTechDigitallySigned(checked);
    const canvasElement = techSigCanvas.current?.getCanvas();
    const ctx = canvasElement?.getContext("2d");
    if (checked) {
      if (canvasElement && ctx) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.strokeRect(5, 5, canvasElement.width - 10, canvasElement.height - 10);
        
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(25, 30, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 30);
        ctx.lineTo(24, 34);
        ctx.lineTo(30, 26);
        ctx.stroke();
        
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("FIRMADO DIGITALMENTE", 45, 27);
        
        const signerName = formData.techName || "Técnico de MR Technology";
        ctx.fillStyle = "#2563eb";
        ctx.font = "italic bold 12px Georgia";
        ctx.fillText(signerName, 45, 50);
        
        const dateTime = new Date().toLocaleString("es-AR");
        ctx.fillStyle = "#64748b";
        ctx.font = "7px monospace";
        ctx.fillText(`FECHA Y HORA: ${dateTime}`, 45, 70);
        ctx.fillText("AUTENTICADO POR SATELLITE B2B", 45, 80);
      }
    } else {
      techSigCanvas.current?.clear();
    }
  };

  const handleClientDigitalSignToggle = (checked: boolean) => {
    setIsClientDigitallySigned(checked);
    const canvasElement = sigCanvas.current?.getCanvas();
    const ctx = canvasElement?.getContext("2d");
    if (checked) {
      if (canvasElement && ctx) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.strokeRect(5, 5, canvasElement.width - 10, canvasElement.height - 10);
        
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(25, 30, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 30);
        ctx.lineTo(24, 34);
        ctx.lineTo(30, 26);
        ctx.stroke();
        
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("FIRMADO DIGITALMENTE", 45, 27);
        
        const signerName = formData.clientNameSign || formData.razonSocial || "Cliente de MR Technology";
        ctx.fillStyle = "#2563eb";
        ctx.font = "italic bold 12px Georgia";
        ctx.fillText(signerName, 45, 50);
        
        const dateTime = new Date().toLocaleString("es-AR");
        ctx.fillStyle = "#64748b";
        ctx.font = "7px monospace";
        ctx.fillText(`FECHA Y HORA: ${dateTime}`, 45, 70);
        ctx.fillText("AUTENTICADO POR SATELLITE B2B", 45, 80);
      }
    } else {
      sigCanvas.current?.clear();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const techSigCanvas = useRef<SignatureCanvas>(null);

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
        clientCategory: formData.category,
        street: formData.street,
        houseNumber: formData.houseNumber,
        city: formData.ciudad,
        province: formData.provincia,
        zipCode: formData.zipCode,
        address: `${formData.street} ${formData.houseNumber}, ${formData.ciudad}, ${formData.provincia}`,
      });
      onBack(); // Vuelve al chat o refresca
    } catch (err) {
      console.error(err);
      alert("Error al confirmar datos");
    } finally {
      setIsExporting(false);
    }
  };

  // Fase 2: Técnico finaliza instalación
  const handleTechFinalize = async () => {
    if (!isTechAccepted) {
      alert("El técnico debe confirmar los datos de instalación tildando el checkbox.");
      return;
    }
    if (!isTechDigitallySigned && techSigCanvas.current?.isEmpty()) {
      alert("Por favor, estampe su firma de técnico.");
      return;
    }
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
        techNotes: formData.observations,
        obstructionObject: formData.obstructionObject,
        perfObservations: formData.perfObservations,
        // Firmas
        techSignature: isTechDigitallySigned
          ? techSigCanvas.current?.getCanvas().toDataURL("image/png")
          : techSigCanvas.current?.toDataURL(),
        // Enviar Fotos
        photoAntena: formData.photoAntena,
        photoSoporte: formData.photoSoporte,
        photoRouter: formData.photoRouter,
        photoTest: formData.photoTest,
        photoApp: formData.photoApp,
        photoRack: formData.photoRack,
        // Datos de firma técnico
        techName: formData.techName,
        techDni: formData.techDni,
        techSignedAt: new Date(),
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
    if (!isClientDigitallySigned && sigCanvas.current?.isEmpty()) {
      alert("Por favor, estampe su firma holográfica.");
      return;
    }

    setIsExporting(true);
    setShowFinalModal(true);

    try {
      const signatureData = isClientDigitallySigned
        ? sigCanvas.current?.getCanvas().toDataURL("image/png")
        : sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

      // 1. Finalizar Contrato en DB
      await updateTicketStatus(ticketId, "COMPLETED", {
        clientSignature: signatureData,
        installedAt: new Date(),
        clientSignedAt: new Date(),
        // Asegurar que los datos del firmante cliente se guarden (pueden ser distintos al titular)
        clientName: formData.clientNameSign,
        clientDni: formData.clientDniSign,
      });

      // 2. Generar y Enviar PDF
      if (reportRef.current && html2pdf) {
        const element = reportRef.current;
        const opt = {
          margin: 10,
          filename: `Certificado_${formData.installId}_${formData.razonSocial.toUpperCase()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Generar el PDF
        const worker = html2pdf().set(opt).from(element);
        
        // 2a. Descarga local para el cliente
        await worker.save();
        
        // 2b. Obtener base64 y enviar por email
        try {
          const pdfBase64 = await worker.outputPdf('datauristring');
          await fetch(`/api/support/tickets/${ticketId}/send-certificate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pdfBase64,
              fileName: `Certificado_${formData.installId}.pdf`,
              clientEmail: formData.email,
              clientName: formData.razonSocial
            })
          });
          console.log("[EMAIL_AUTO] Certificado enviado a:", formData.email);
        } catch (emailErr) {
          console.error("[EMAIL_AUTO_ERROR]", emailErr);
          // No bloqueamos el flujo si falla el mail
        }
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
            <div className="input-field">
              <label>Correo Electrónico</label>
              <input id="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} />
            </div>
            <div className="input-field">
              <label>Categoría</label>
              <select id="category" value={formData.category} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)}>
                <option value="Hogareño">Hogareño</option>
                <option value="Hogareño residencial">Hogareño residencial</option>
                <option value="Local comercial">Local comercial</option>
                <option value="Local gastronómico">Local gastronómico</option>
                <option value="PYME">PYME</option>
                <option value="Empresa">Empresa</option>
                <option value="Bodega">Bodega</option>
              </select>
            </div>
            
            <div className="input-field full-row">
              <label>Provincia</label>
              <select id="provincia" value={formData.provincia} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)}>
                {["Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="input-field">
              <label>Localidad / Ciudad</label>
              <input id="ciudad" value={formData.ciudad} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} placeholder="Ej: San Rafael" />
            </div>
            <div className="input-field">
              <label>C.P.</label>
              <input id="zipCode" value={formData.zipCode} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} placeholder="5500" />
            </div>

            <div className="input-field">
              <label>Dirección / Calle</label>
              <input id="street" value={formData.street} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} placeholder="Av. San Martín" />
            </div>
            <div className="input-field">
              <label>Número</label>
              <input id="houseNumber" value={formData.houseNumber} onChange={handleInputChange} disabled={!['CONTRACT_INITIATED', 'OPEN', 'LEAD'].includes(ticketStatus)} placeholder="1234" />
            </div>
          </div>
        </div>

        {/* SECTION 2: TECHNICAL SPECS (Edit: TECH_IN_PROGRESS) */}
        <div className="doc-section">
          <div className="section-header">02. Especificaciones Técnicas (Starlink)</div>
          <div className="form-grid">
            <div className="input-field">
              <label>Número de Serie (KIT/Dish)</label>
              <input id="serialKit" value={formData.serialKit} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="Ej: KIT-000000" />
            </div>
            <div className="input-field">
              <label>Tipo de Antena</label>
              <select id="antennaModel" value={formData.antennaModel} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'}>
                <option value="MINI X">MINI X</option>
                <option value="STANDAR V4">STANDAR V4</option>
                <option value="ITINERANTE">ITINERANTE</option>
              </select>
            </div>
            <div className="input-field">
              <label>Ubicación de Antena</label>
              <input id="antennaLocation" value={formData.antennaLocation} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="Ej: Terraza, Mástil" />
            </div>
            <div className="input-field">
              <label>Obstrucciones</label>
              <select id="obstructions" value={formData.obstructions} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'}>
                <option value="Ninguna 0%">Ninguna 0%</option>
                <option value="Minima <1%">Mínima &lt;1%</option>
                <option value="Moderada 1-5%">Moderada 1-5%</option>
                <option value="Crítica >5%">Crítica &gt;5%</option>
                <option value="Objeto">Objeto (Especificar)</option>
              </select>
            </div>

            {formData.obstructions === 'Objeto' && (
              <div className="input-field full-row animate-in fade-in slide-in-from-top-2">
                <label>Descripción del Objeto Obstructor</label>
                <input id="obstructionObject" value={formData.obstructionObject} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'} placeholder="Ej: Árbol, Chimenea, Edificio..." />
              </div>
            )}
          </div>

          <div className="mt-8">
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Observaciones Técnicas Generales</label>
            <textarea 
              id="observations" 
              value={formData.observations} 
              onChange={(e) => handleInputChange(e)} 
              disabled={ticketStatus !== 'TECH_IN_PROGRESS'}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-medium focus:border-blue-500 transition-all outline-none"
              rows={3}
              placeholder="Notas generales de la instalación..."
            />
          </div>

          {/* PHOTO EVIDENCE (Only for Technician) */}
          {ticketStatus === 'TECH_IN_PROGRESS' && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { id: 'photoAntena', label: 'Antena (Panorámica)' },
                { id: 'photoSoporte', label: 'Montaje y Soporte' },
                { id: 'photoRouter', label: 'Router/Switch Interior' },
                { id: 'photoTest', label: 'Test de Velocidad' },
                { id: 'photoApp', label: 'Obstrucciones (App)' },
                { id: 'photoRack', label: 'Rack Empresarial' }
              ].map((item) => (
                <div key={item.id} className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all overflow-hidden relative group ${formData[item.id as keyof typeof formData] ? 'border-green-500 bg-green-50/50' : 'border-slate-200 hover:border-blue-500'}`}>
                  <label className="cursor-pointer block h-full">
                    <input type="file" className="hidden" accept="image/*" capture="environment" onChange={(e) => handleFileChange(e, item.id)} />
                    
                    {formData[item.id as keyof typeof formData] ? (
                      <div className="relative">
                        <img src={formData[item.id as keyof typeof formData] as string} className="h-24 w-full object-cover rounded-lg shadow-sm" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                          <span className="text-white text-[8px] font-bold uppercase">Cambiar</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-2">{item.label}</div>
                        <svg className="w-6 h-6 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </>
                    )}
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
            <div className="input-field">
              <label>Modo de Red</label>
              <select id="networkMode" value={formData.networkMode} onChange={handleInputChange} disabled={ticketStatus !== 'TECH_IN_PROGRESS'}>
                <option value="Router Starlink">Router Starlink</option>
                <option value="Switch Starlink">Switch Starlink</option>
                <option value="Router + Switch Starlink">Router + Switch Starlink</option>
                <option value="Router o Switch del Cliente">Router o Switch del Cliente</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Observaciones de Rendimiento</label>
            <textarea 
              id="perfObservations" 
              value={formData.perfObservations} 
              onChange={(e) => handleInputChange(e)} 
              disabled={ticketStatus !== 'TECH_IN_PROGRESS'}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-medium focus:border-blue-500 transition-all outline-none"
              rows={3}
              placeholder="Notas sobre la estabilidad, velocidad, latencia, etc..."
            />
          </div>
        </div>

        {/* SECTION 4: HOLOGRAPHIC SIGNATURES */}
        <div className="doc-section">
          <div className="section-header">04. Conformidad y Firmas</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Firma del Técnico */}
            <div className="signature-box border rounded-2xl p-6 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Visto Bueno / Firma del Técnico</p>
                {ticketStatus === 'TECH_IN_PROGRESS' && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-500 hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={isTechDigitallySigned}
                      onChange={(e) => handleTechDigitalSignToggle(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[10px] font-bold">Firmar</span>
                  </label>
                )}
              </div>
              {ticketStatus === 'TECH_IN_PROGRESS' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="input-group">
                      <label className="text-[9px] uppercase font-bold text-slate-500">Nombre y Apellido</label>
                      <input 
                        type="text" 
                        id="techName" 
                        value={formData.techName} 
                        onChange={handleInputChange} 
                        placeholder="Nombre del Técnico"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[10px] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="input-group">
                      <label className="text-[9px] uppercase font-bold text-slate-500">DNI</label>
                      <input 
                        type="text" 
                        id="techDni" 
                        value={formData.techDni} 
                        onChange={handleInputChange} 
                        placeholder="DNI del Técnico"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[10px] outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className={`sig-canvas-container bg-white border rounded-xl overflow-hidden shadow-inner ${isTechDigitallySigned ? "pointer-events-none opacity-90" : ""}`}>
                    <SignatureCanvas 
                      ref={techSigCanvas}
                      penColor='#0f172a'
                      canvasProps={{width: 300, height: 150, className: 'sigCanvas'}}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setIsTechDigitallySigned(false);
                      techSigCanvas.current?.clear();
                    }}
                    className="text-[9px] uppercase font-bold text-red-500 mt-2 block mx-auto"
                  >
                    Limpiar Firma Técnico
                  </button>
                  <div className="mt-4 flex items-center gap-3 justify-center">
                    <input type="checkbox" id="techAccept" checked={isTechAccepted} onChange={(e) => setIsTechAccepted(e.target.checked)} className="w-4 h-4" />
                    <label htmlFor="techAccept" className="normal-case font-medium text-[10px] text-slate-700">Confirmo los datos técnicos.</label>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="text-[10px] font-bold text-slate-700 mb-1">{formData.techName || 'TÉCNICO AUTORIZADO'}</div>
                  <div className="text-[9px] text-slate-400 mb-2">DNI: {formData.techDni || 'N/A'}</div>
                  <div className="h-16 w-32 bg-slate-100 rounded mx-auto flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase border border-dashed border-slate-200">
                    {formData.techSignedAt ? `FIRMADO: ${formData.techSignedAt}` : 'INSTALACIÓN AUDITADA'}
                  </div>
                </div>
              )}
            </div>

            {/* Firma del Cliente */}
            <div className="signature-box border rounded-2xl p-6 bg-blue-50/30 border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Firma de Aceptación del Cliente</p>
                {ticketStatus === 'SIGNATURE_PENDING' && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-500 hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={isClientDigitallySigned}
                      onChange={(e) => handleClientDigitalSignToggle(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-blue-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[10px] font-bold text-blue-600">Firmar</span>
                  </label>
                )}
              </div>
              
              {(ticketStatus === 'SIGNATURE_PENDING' || ticketStatus === 'COMPLETED') ? (
                <>
                  {ticketStatus === 'SIGNATURE_PENDING' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="input-group">
                          <label className="text-[9px] uppercase font-bold text-blue-500">Nombre y Apellido</label>
                          <input 
                            type="text" 
                            id="clientNameSign" 
                            value={formData.clientNameSign} 
                            onChange={handleInputChange} 
                            placeholder="Nombre de quien recibe"
                            className="w-full bg-white border border-blue-100 rounded-lg p-2 text-[10px] outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="input-group">
                          <label className="text-[9px] uppercase font-bold text-blue-500">DNI / CUIT</label>
                          <input 
                            type="text" 
                            id="clientDniSign" 
                            value={formData.clientDniSign} 
                            onChange={handleInputChange} 
                            placeholder="DNI del receptor"
                            className="w-full bg-white border border-blue-100 rounded-lg p-2 text-[10px] outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] mb-4 text-slate-600 leading-relaxed text-center">
                        Yo, <strong>{formData.clientNameSign || formData.razonSocial}</strong>, acepto la instalación realizada y los términos del contrato.
                      </p>
                      
                      <div className={`sig-canvas-container bg-white border rounded-xl overflow-hidden shadow-inner ${isClientDigitallySigned ? "pointer-events-none opacity-90" : ""}`}>
                        <SignatureCanvas 
                          ref={sigCanvas}
                          penColor='#0f172a'
                          canvasProps={{width: 300, height: 150, className: 'sigCanvas'}}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setIsClientDigitallySigned(false);
                          sigCanvas.current?.clear();
                        }}
                        className="text-[9px] uppercase font-bold text-red-500 mt-2 block mx-auto"
                      >
                        Limpiar Firma
                      </button>
                      
                      <div className="mt-4 flex items-center gap-3 justify-center">
                        <input type="checkbox" id="accept" checked={isAccepted} onChange={(e) => setIsAccepted(e.target.checked)} className="w-4 h-4" />
                        <label htmlFor="accept" className="normal-case font-medium text-[10px] text-slate-700">Acepto los términos y condiciones.</label>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-[10px] font-bold text-blue-700 mb-1">{formData.clientNameSign || formData.razonSocial}</div>
                      <div className="text-[9px] text-slate-400 mb-2">DNI: {formData.clientDniSign || formData.cuit}</div>
                      <div className="h-16 w-32 bg-blue-500/10 rounded mx-auto flex items-center justify-center text-[9px] text-blue-500 font-bold uppercase tracking-tighter border border-dashed border-blue-200">
                        {formData.clientSignedAt ? `FIRMADO: ${formData.clientSignedAt}` : 'CONTRATO FIRMADO DIGITALMENTE'}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-slate-300 text-[10px] uppercase font-bold tracking-tighter">
                  Esperando finalización <br/> de instalación técnica...
                </div>
              )}
            </div>
          </div>
        </div>

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
