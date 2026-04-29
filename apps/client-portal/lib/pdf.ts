/**
 * Genera un PDF profesional para el contrato.
 * IMPORTANTE: Se usan imports dinámicos dentro de la función para evitar 
 * errores de SSR en Next.js (window is not defined, etc).
 */
export const generateContractPDF = async (contract: any) => {
  // Carga dinámica de librerías (solo en el cliente)
  const [ { default: jsPDF }, { default: autoTable } ] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);

  const doc = new jsPDF();
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

  autoTable(doc, {
    startY: currentY,
    theme: "plain",
    body: [
      ["Nombre / Razón Social:", contract.clientName],
      ["DNI / CUIT:", contract.clientDni],
      ["Email:", contract.clientEmail],
      ["Teléfono:", contract.clientPhone],
      ["Empresa:", contract.companyName || "-"],
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
    styles: { fontSize: 10 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

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
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
    styles: { fontSize: 10 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

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
      ["Equipo:", EQUIPMENT_LABELS[contract.equipmentType] || contract.equipmentType],
      ["Plan de Datos:", PLAN_LABELS[contract.planType] || contract.planType],
      ["Abono Mensual:", contract.monthlyFee ? `$${Number(contract.monthlyFee).toLocaleString("es-AR")}` : "A convenir"],
      ["Fecha de Solicitud:", new Date(contract.createdAt).toLocaleDateString("es-AR")],
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
    styles: { fontSize: 10 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (contract.installationNotes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones adicionales:", 15, currentY);
    currentY += 5;
    doc.setFont("helvetica", "normal");
    const splitNotes = doc.splitTextToSize(contract.installationNotes, pageWidth - 30);
    doc.text(splitNotes, 15, currentY);
    currentY += splitNotes.length * 5 + 10;
  }

  const footerY = doc.internal.pageSize.getHeight() - 25;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Este documento sirve como comprobante de solicitud de instalación.", pageWidth / 2, footerY, { align: "center" });
  doc.text("MR Technology - Mendoza, Argentina | Contacto: soporte@mrtechnology.com.ar", pageWidth / 2, footerY + 5, { align: "center" });

  doc.save(`Contrato_${contract.contractNumber}.pdf`);
};
