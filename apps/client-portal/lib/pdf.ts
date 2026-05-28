/**
 * Genera un PDF profesional para el contrato.
 * IMPORTANTE: Se usan imports dinámicos dentro de la función para evitar 
 * errores de SSR en Next.js (window is not defined, etc).
 */
interface Contract {
  id: string;
  contractNumber: string;
  clientName: string;
  clientDni: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  address: string;
  city: string;
  province: string;
  zipCode?: string;
  cbu?: string;
  rubro?: string;
  clientCategory?: string;
  antennaModel?: string;
  installationPrice?: number | string;
  installationNotes?: string | null;
  equipmentType: string;
  planType: string;
  monthlyFee?: string | number;
  createdAt: string | Date;
  downloadSpeed?: number;
  uploadSpeed?: number;
  latency?: number;
  kitSerialNumber?: string;
  hardwareVersion?: string;
  antennaLocation?: string;
  networkMode?: string;
  technician?: { name: string };
  clientSignature?: string;
  techSignature?: string;
  photoCasa?: string;
  photoAntena?: string;
  photoSoporte?: string;
  photoRouter?: string;
  photoCable?: string;
  photoTest?: string;
  photoApp?: string;
  photoRack?: string;
}

export const generateContractPDF = async (contract: Contract, returnBase64: boolean = false) => {
  // Carga dinámica de librerías (solo en el cliente)
  const [ { default: jsPDFConstructor }, { default: autoTable } ] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);

  // Interfaz para extender jsPDF con lastAutoTable
  interface jsPDFWithAutoTable extends InstanceType<typeof jsPDFConstructor> {
    lastAutoTable: {
      finalY: number;
    };
  }

  // Función auxiliar para cargar imágenes de URL/Base64
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  const doc = new jsPDFConstructor() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();

  const EQUIPMENT_LABELS: Record<string, string> = {
    MINI_X: "Mini X",
    STANDARD_V4: "Estándar V4",
  };

  const PLAN_LABELS: Record<string, string> = {
    BASICO_MINI: "Básico Mini",
    BASICO_V4: "Básico V4",
    FULL_V4: "Full V4",
    ITINERANTE: "Itinerante",
    EMPRESARIAL: "Empresarial",
  };

  // --- Header ---
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MR TECHNOLOGY", 15, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Soluciones de Conectividad Satelital B2B", 15, 28);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`CONTRATO DE INSTALACIÓN #${contract.contractNumber}`, pageWidth - 15, 25, { align: "right" });

  // --- Content ---
  doc.setTextColor(33, 33, 33);
  let currentY = 55;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", 15, currentY);
  currentY += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, currentY, pageWidth - 15, currentY);
  currentY += 10;

  let nombreFantasia = "-";
  if (contract.installationNotes) {
    const match = contract.installationNotes.match(/Nombre Fantasía:\s*(.+?)\./);
    if (match && match[1]) {
      nombreFantasia = match[1];
    }
  }

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    body: [
      ["Nombre Completo:", contract.clientName],
      ["DNI / CUIT:", contract.clientDni],
      ["Email:", contract.clientEmail],
      ["Teléfono:", contract.clientPhone],
      ["Empresa (Razón Social):", contract.companyName || "-"],
      ["Nombre de Fantasía:", nombreFantasia],
      ["Categoría:", contract.clientCategory || "-"],
      ["Rubro:", contract.rubro || "-"],
      ["CBU:", contract.cbu || "-"],
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
    styles: { fontSize: 10 },
  });

  currentY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("UBICACIÓN DE INSTALACIÓN", 15, currentY);
  currentY += 5;
  doc.line(15, currentY, pageWidth - 15, currentY);
  currentY += 10;

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    body: [
      ["Dirección:", contract.address],
      ["Ciudad:", contract.city],
      ["Provincia:", contract.province],
      ["Código Postal:", contract.zipCode || "-"],
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
    styles: { fontSize: 10 },
  });

  currentY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES DEL SERVICIO", 15, currentY);
  currentY += 5;
  doc.line(15, currentY, pageWidth - 15, currentY);
  currentY += 10;

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    body: [
      ["Plan de Datos:", PLAN_LABELS[contract.planType] || contract.planType],
      ["Antena Seleccionada:", contract.antennaModel || EQUIPMENT_LABELS[contract.equipmentType] || contract.equipmentType],
      ["Instalación / Importe:", contract.installationPrice !== undefined && contract.installationPrice !== null ? `$${Number(contract.installationPrice).toLocaleString("es-AR")}` : "A convenir"],
      ["Abono Mensual:", contract.monthlyFee ? `$${Number(contract.monthlyFee).toLocaleString("es-AR")}` : "A convenir"],
      ["Fecha de Solicitud:", new Date(contract.createdAt).toLocaleDateString("es-AR")],
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
    styles: { fontSize: 10 },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // --- Sección Técnica (Si tiene datos) ---
  if (contract.downloadSpeed || contract.kitSerialNumber) {
     doc.setFontSize(14);
     doc.setFont("helvetica", "bold");
     doc.text("INFORME TÉCNICO DE INSTALACIÓN", 15, currentY + 10);
     currentY += 15;
     doc.line(15, currentY, pageWidth - 15, currentY);
     currentY += 10;

     autoTable(doc, {
       startY: currentY,
       theme: "striped",
       head: [["Parámetro", "Valor Registrado"]],
       body: [
         ["Número de Serie Kit:", contract.kitSerialNumber || "N/A"],
         ["Versión Hardware:", contract.hardwareVersion || "N/A"],
         ["Ubicación Antena:", contract.antennaLocation || "N/A"],
         ["Velocidad de Bajada:", `${contract.downloadSpeed || 0} Mbps`],
         ["Velocidad de Subida:", `${contract.uploadSpeed || 0} Mbps`],
         ["Latencia:", `${contract.latency || 0} ms`],
         ["Modo de Red:", contract.networkMode || "N/A"],
         ["Técnico Responsable:", contract.technician?.name || "No asignado"],
       ],
       styles: { fontSize: 9 },
       headStyles: { fillColor: [51, 65, 85] }
     });
     currentY = doc.lastAutoTable.finalY + 15;
  }

  // --- Firmas ---
  if (contract.clientSignature || contract.techSignature) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CONFORMIDAD Y FIRMAS", 15, currentY);
    currentY += 10;

    // Firma Cliente
    if (contract.clientSignature) {
      try {
        doc.addImage(contract.clientSignature, "PNG", 20, currentY, 50, 20);
      } catch (e) { console.error("Error firma cliente", e); }
    }
    doc.setFontSize(8);
    doc.text("Firma del Cliente", 20, currentY + 25);
    doc.text(contract.clientName, 20, currentY + 29);

    // Firma Técnico
    if (contract.techSignature) {
      try {
        doc.addImage(contract.techSignature, "PNG", 120, currentY, 50, 20);
      } catch (e) { console.error("Error firma tecnico", e); }
    }
    doc.text("Firma del Técnico", 120, currentY + 25);
    doc.text(contract.technician?.name || "Técnico Autorizado", 120, currentY + 29);
    
    currentY += 45;
  }

  // --- Anexo Fotográfico ---
  const photos = [
    { label: "Fachada / Casa", path: contract.photoCasa },
    { label: "Ubicación Antena", path: contract.photoAntena },
    { label: "Soporte y Montaje", path: contract.photoSoporte },
    { label: "Router y Conexiones", path: contract.photoRouter },
    { label: "Cableado / Ingreso", path: contract.photoCable },
    { label: "Prueba de Velocidad", path: contract.photoTest },
    { label: "Obstrucciones (App)", path: contract.photoApp },
    { label: "Rack Empresarial", path: contract.photoRack },
  ].filter(p => p.path);

  if (photos.length > 0) {
    doc.addPage();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("ANEXO FOTOGRÁFICO DE EVIDENCIA", 15, 13);
    
    let photoY = 35;
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      if (!p) continue;
      try {
        let img;
        if (p.path!.startsWith("data:")) {
          img = await loadImage(p.path!);
        } else {
          const res = await fetch(`/api/contracts/photos?path=${encodeURIComponent(p.path!)}`);
          const { signedUrl } = await res.json();
          if (signedUrl) {
            img = await loadImage(signedUrl);
          }
        }

        if (img) {
          if (photoY > 240) { doc.addPage(); photoY = 25; }
          
          doc.setTextColor(51, 65, 85);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(p.label, 15, photoY - 5);
          
          // Mantener proporción
          const imgRatio = img.height / img.width;
          const imgWidth = 85; 
          const imgHeight = imgWidth * imgRatio;
          
          // Renderizar en 2 columnas
          const xPos = (i % 2 === 0) ? 15 : 110;
          doc.addImage(img, "JPEG", xPos, photoY, imgWidth, Math.min(imgHeight, 60));
          
          if (i % 2 !== 0 || i === photos.length - 1) {
             photoY += 75;
          }
        }
      } catch (e) {
        console.error("Error cargando foto para PDF", e);
      }
    }
  }

  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Documento generado electrónicamente el ${new Date().toLocaleString()} | ID: ${contract.id}`, pageWidth / 2, footerY, { align: "center" });

  if (returnBase64) {
    return doc.output('datauristring');
  }

  doc.save(`Contrato_${contract.contractNumber}_Auditoria.pdf`);
};
