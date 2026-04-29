"use client";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { saveInstallationContract, getTechnicians } from "./actions";

// Cargas dinámicas para evitar errores de SSR
const SignaturePad = dynamic(() => import("./components/SignaturePad"), { ssr: false });
const FileUploader = dynamic(() => import("./components/FileUploader"), { ssr: false });

// --- TIPOS ---
interface FormData {
  fecha: string;
  instalacionId: string;
  agente: string;
  razonSocial: string;
  cuit: string;
  fantasia: string;
  email: string;
  celular: string;
  categoria: string;
  provincia: string;
  localidad: string;
  direccion: string;
  numero: string;
  cp: string;
  serieKit: string;
  hardware: string;
  ubicacionAntena: string;
  obstrucciones: string;
  descarga: string;
  carga: string;
  latencia: string;
  modoRed: string;
  aclaracionTecnico: string;
  aclaracionCliente: string;
}

const INITIAL_FORM: FormData = {
  fecha: "", // Se llena en useEffect para evitar errores de hidratación
  instalacionId: "",
  agente: "",
  razonSocial: "",
  cuit: "",
  fantasia: "",
  email: "",
  celular: "",
  categoria: "Residencial",
  provincia: "Mendoza",
  localidad: "Maipú",
  direccion: "",
  numero: "",
  cp: "",
  serieKit: "",
  hardware: "Standard Actuated (Gen 2)",
  ubicacionAntena: "",
  obstrucciones: "Ninguna (0%)",
  descarga: "",
  carga: "",
  latencia: "",
  modoRed: "Router Starlink Default",
  aclaracionTecnico: "",
  aclaracionCliente: "",
};

export default function ContratoClient() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [finalizado, setFinalizado] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para firmas
  const [techSignature, setTechSignature] = useState("");
  const [clientSignature, setClientSignature] = useState("");
  
  // Estado para técnicos registrados
  const [technicians, setTechnicians] = useState<{id: string, name: string}[]>([]);
  const [selectedTechId, setSelectedTechId] = useState("");

  // Estados para URLs de fotos (Storage paths)
  const [photos, setPhotos] = useState({
    photoCasa: "",
    photoAntena: "",
    photoRouter: "",
    photoCable: "",
    photoTest: "",
    photoObstrucciones: ""
  });

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    // Establecer fecha solo en cliente
    setForm(prev => ({ ...prev, fecha: new Date().toLocaleDateString("es-AR") }));
    
    // Cargar técnicos registrados
    const loadTechs = async () => {
      const techs = await getTechnicians();
      setTechnicians(techs);
      if (techs.length > 0) setSelectedTechId(techs[0].id);
    };
    loadTechs();
  }, []);

  const handleFinalizar = async () => {
    if (!techSignature || !clientSignature) {
      alert("Ambas firmas son obligatorias para finalizar el contrato.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveInstallationContract({
        ...form,
        techSignature,
        clientSignature,
        ...photos,
        technicianId: selectedTechId,
        // Datos específicos mapeados del formulario
        titular: form.razonSocial,
        dni: form.cuit,
        ubicacion: `${form.direccion} ${form.numero}`,
        nroSerieKit: form.serieKit,
        versionHardware: form.hardware,
        velocidadBajada: form.descarga,
        velocidadSubida: form.carga,
        latencia: form.latencia,
        modoRed: form.modoRed,
        obstrucciones: form.obstrucciones,
        ubicacionAntena: form.ubicacionAntena
      });

      if (result.success && result.contractNumber) {
        setFinalizado(true);
        const newNumber = result.contractNumber;
        setForm(prev => ({ ...prev, instalacionId: newNumber }));
        
        const banner = document.getElementById("banner-exito");
        if (banner) {
          banner.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        alert("Error al guardar: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error crítico de conexión al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerarPDF = async () => {
    setGenerando(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const W = 210;
      const MARGIN = 18;
      let y = 20;

      // ── Cabecera ───────────────────────────────────────────────
      doc.setFillColor(2, 6, 23);
      doc.rect(0, 0, W, 38, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MR Technology", MARGIN, 16);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 200, 230);
      doc.text("Conectividad Satelital · Starlink Official Partner", MARGIN, 23);
      doc.setFontSize(7);
      doc.setTextColor(100, 130, 160);
      doc.text(
        `Fecha: ${form.fecha}   |   ID Instalación: ${form.instalacionId || "—"}   |   Agente: ${form.agente || "—"}`,
        MARGIN,
        31
      );

      // Título
      y = 50;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 182, 212);
      doc.text("CONTRATO DE INSTALACIÓN DE ANTENA", W / 2, y, { align: "center" });
      y += 3;
      doc.setDrawColor(6, 182, 212);
      doc.setLineWidth(0.4);
      doc.line(MARGIN * 3, y, W - MARGIN * 3, y);
      y += 10;

      // ── Helpers ────────────────────────────────────────────────
      const section = (title: string, r: number, g: number, b: number) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(title.toUpperCase(), MARGIN, y);
        doc.setDrawColor(r, g, b);
        doc.setLineWidth(0.2);
        doc.line(MARGIN + doc.getTextWidth(title.toUpperCase()) + 2, y - 1, W - MARGIN, y - 1);
        y += 7;
      };

      const row = (label: string, value: string) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(120, 140, 170);
        doc.text(label + ":", MARGIN, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 50, 70);
        doc.text(value || "—", MARGIN + 52, y);
        y += 6;
      };

      // ── Secciones ──────────────────────────────────────────────
      section("1. Datos del Cliente", 80, 130, 200);
      row("Razón Social", form.razonSocial);
      row("CUIT", form.cuit);
      row("Nombre de Fantasía", form.fantasia);
      row("Email", form.email);
      row("WSP / Celular", form.celular);
      row("Categoría", form.categoria);
      row("Provincia", form.provincia);
      row("Localidad", form.localidad);
      row("Dirección", `${form.direccion} ${form.numero}`);
      row("Código Postal", form.cp);
      y += 4;

      section("2. Detalles Técnicos Starlink", 6, 140, 160);
      row("N° de Serie (KIT)", form.serieKit);
      row("Versión Hardware", form.hardware);
      row("Ubicación de Antena", form.ubicacionAntena);
      row("Obstrucciones", form.obstrucciones);
      y += 4;

      section("3. Pruebas de Rendimiento", 40, 160, 120);
      row("Velocidad Descarga", form.descarga ? `${form.descarga} Mbps` : "");
      row("Velocidad Carga", form.carga ? `${form.carga} Mbps` : "");
      row("Latencia", form.latencia ? `${form.latencia} ms` : "");
      row("Modo de Red", form.modoRed);
      y += 10;

      // ── Firmas ─────────────────────────────────────────────────
      if (y > 220) { doc.addPage(); y = 20; }
      doc.setDrawColor(50, 70, 100);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y + 18, MARGIN + 70, y + 18);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 100, 130);
      doc.text("FIRMA TÉCNICO MR", MARGIN, y + 24);
      doc.setFont("helvetica", "normal");
      doc.text(form.aclaracionTecnico || "—", MARGIN, y + 30);
      doc.line(W - MARGIN - 70, y + 18, W - MARGIN, y + 18);
      doc.setFont("helvetica", "bold");
      doc.text("FIRMA CLIENTE", W - MARGIN - 70, y + 24);
      doc.setFont("helvetica", "normal");
      doc.text(form.aclaracionCliente || "—", W - MARGIN - 70, y + 30);

      // ── Footer ─────────────────────────────────────────────────
      const totalPages = (doc.internal as any).getNumberOfPages?.() ?? 1;
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(6);
        doc.setTextColor(120, 140, 170);
        doc.text(
          `MR Technology · Contrato de Instalación Satelital · ${form.fecha}  |  Página ${p} de ${totalPages}`,
          W / 2,
          292,
          { align: "center" }
        );
      }

      const fileName = `MR-Contrato-${form.instalacionId || "NUEVO"}-${
        form.razonSocial.replace(/\s+/g, "_") || "cliente"
      }.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Error al generar el PDF. Revisá la consola.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans selection:bg-cyan-500/30">
      {/* Top action bar */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <Link href="/">
          <Button
            variant="outline"
            className="text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white rounded-full px-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Portal
          </Button>
        </Link>

        <button
          id="btn-dynamic-action"
          onClick={finalizado ? handleGenerarPDF : handleFinalizar}
          disabled={generando}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm tracking-widest transition-all duration-300 active:scale-95 shadow-lg
            ${
              finalizado
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-900/20 hover:shadow-emerald-500/30"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-900/20 hover:shadow-cyan-500/30"
            }`}
        >
          {generando || isSaving ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isSaving ? "GUARDANDO..." : "PROCESANDO..."}
            </>
          ) : finalizado ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              EXPORTAR PDF
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FINALIZAR CONTRATO
            </>
          )}
        </button>
      </div>

      {/* Banner de éxito */}
      {finalizado && (
        <div id="banner-exito" className="max-w-5xl mx-auto mb-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.1)] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-emerald-300">¡Contrato finalizado exitosamente!</p>
            <p className="text-sm text-emerald-500/80">
              Ya podés exportar el PDF con el botón de arriba a la derecha o el de abajo.
            </p>
          </div>
          <button
            onClick={() => setFinalizado(false)}
            className="ml-auto text-emerald-700 hover:text-emerald-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-10 mb-10 relative z-10">
          <div className="flex items-center gap-4 mb-8 md:mb-0">
            <img src="/logo.jpg" alt="MR Technology" className="w-16 h-16 rounded-full border border-slate-700 shadow-lg" />
            <h2 className="text-2xl font-black tracking-widest text-white drop-shadow-md">MR Technology</h2>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <FieldRow label="Fecha">
              <input type="text" value={form.fecha} onChange={update("fecha")}
                className="bg-slate-950 border-b-2 border-cyan-500/50 text-white font-bold px-4 py-2 w-48 text-center focus:outline-none focus:border-cyan-400 transition-colors rounded-t-md" />
            </FieldRow>
            <FieldRow label="Instalación ID">
              <input type="text" value={form.instalacionId} onChange={update("instalacionId")} placeholder="Ej: INST-9923"
                className="bg-slate-950 border border-slate-800 text-slate-300 font-medium px-4 py-2 w-48 focus:outline-none focus:border-cyan-500/50 rounded-md" />
            </FieldRow>
            <FieldRow label="Técnico Responsable">
              <select 
                value={selectedTechId} 
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 font-medium px-4 py-2 w-52 focus:outline-none focus:border-cyan-500/50 rounded-md appearance-none"
              >
                {technicians.length > 0 ? (
                  technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))
                ) : (
                  <option value="">Cargando técnicos...</option>
                )}
              </select>
            </FieldRow>
          </div>
        </div>

        <div className="text-center mb-16 relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-[0.1em] drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            CONTRATO DE INSTALACIÓN DE ANTENA
          </h1>
          <div className="w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-6 opacity-50" />
        </div>

        <form className="space-y-16 relative z-10" onSubmit={(e) => e.preventDefault()}>

          {/* 1. DATOS DEL CLIENTE */}
          <section>
            <SectionTitle color="text-slate-300">Datos del Cliente</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormInput label="Razón Social" placeholder="Ej: Mariano Rigato" value={form.razonSocial} onChange={update("razonSocial")} />
              <FormInput label="CUIT" placeholder="Ej: 20-45678912-3" value={form.cuit} onChange={update("cuit")} />
              <FormInput label="Nombre de Fantasía" placeholder="Ej: MR Technology" value={form.fantasia} onChange={update("fantasia")} />
              <FormInput label="Email" type="email" placeholder="Ej: contacto@mr.com" value={form.email} onChange={update("email")} />
              <FormInput label="WSP / Celular" placeholder="+54 9 261 ..." value={form.celular} onChange={update("celular")} />
              <FormSelect label="Categoría" options={["Residencial", "PyME", "Corporativo", "Itinerante"]} value={form.categoria} onChange={update("categoria")} />
              <FormSelect label="Provincia" options={["Mendoza", "San Juan", "San Luis", "Neuquén"]} value={form.provincia} onChange={update("provincia")} />
              <FormSelect label="Localidad / Ciudad" options={["Maipú", "Godoy Cruz", "Luján de Cuyo", "Capital"]} value={form.localidad} onChange={update("localidad")} />
              <div className="md:col-span-2">
                <FormInput label="Dirección (Calle)" placeholder="Ej: Av. San Martín" value={form.direccion} onChange={update("direccion")} />
              </div>
              <FormInput label="Número" placeholder="Ej: 1234" value={form.numero} onChange={update("numero")} />
              <FormInput label="C.P." placeholder="Ej: 5500" value={form.cp} onChange={update("cp")} />
            </div>
          </section>

          {/* 2. DETALLES TÉCNICOS */}
          <section>
            <SectionTitle color="text-blue-400">Detalles Técnicos Starlink</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormInput label="Número de Serie (KIT)" placeholder="Localizar en la caja (Ej: KIT000...)" value={form.serieKit} onChange={update("serieKit")} />
              <FormSelect label="Versión del Hardware" options={["Standard Actuated (Gen 2)", "Standard V4", "Mini X", "High Performance Flat"]} value={form.hardware} onChange={update("hardware")} />
              <FormInput label="Ubicación de Antena" placeholder="Ej: Techo a dos aguas / Mástil 3mts" value={form.ubicacionAntena} onChange={update("ubicacionAntena")} />
              <FormSelect label="Obstrucciones" options={["Ninguna (0%)", "Leve (1-5%)", "Moderada (5-15%)", "Severa (>15%)"]} value={form.obstrucciones} onChange={update("obstrucciones")} highlight />
            </div>
          </section>

          {/* 3. PRUEBAS DE RENDIMIENTO */}
          <section>
            <SectionTitle color="text-cyan-400">Pruebas de Rendimiento</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormInput label="Velocidad Descarga (MBPS)" placeholder="Ej: 250" value={form.descarga} onChange={update("descarga")} />
              <FormInput label="Velocidad Carga (MBPS)" placeholder="Ej: 35" value={form.carga} onChange={update("carga")} />
              <FormInput label="Latencia (MS)" placeholder="Ej: 28" value={form.latencia} onChange={update("latencia")} />
              <FormSelect label="Modo de Red" options={["Router Starlink Default", "Bypass (Router Externo)", "Mesh System"]} value={form.modoRed} onChange={update("modoRed")} />
            </div>
          </section>

          {/* 4. REGISTRO FOTOGRÁFICO */}
          <section>
            <SectionTitle color="text-slate-300">Registro Fotográfico (Captura Directa)</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <FileUploader 
                label="Antena (Panorámica)" 
                fieldName="antena_panoramica"
                contractId={form.cuit}
                onUploadComplete={(path) => setPhotos(p => ({ ...p, photoAntena: path }))}
              />
              <FileUploader 
                label="Fachada / Casa" 
                fieldName="casa"
                contractId={form.cuit}
                onUploadComplete={(path) => setPhotos(p => ({ ...p, photoCasa: path }))}
              />
              <FileUploader 
                label="Router / Interior" 
                fieldName="router"
                contractId={form.cuit}
                onUploadComplete={(path) => setPhotos(p => ({ ...p, photoRouter: path }))}
              />
              <FileUploader 
                label="Mástil / Detalle" 
                fieldName="mastil"
                contractId={form.cuit}
                onUploadComplete={(path) => setPhotos(p => ({ ...p, photoCable: path }))}
              />
              <FileUploader 
                label="Test de Velocidad" 
                fieldName="speedtest"
                contractId={form.cuit}
                onUploadComplete={(path) => setPhotos(p => ({ ...p, photoTest: path }))}
              />
              <FileUploader 
                label="Obstrucciones" 
                fieldName="obstrucciones_img"
                contractId={form.cuit}
                onUploadComplete={(path) => setPhotos(p => ({ ...p, photoObstrucciones: path }))}
              />
            </div>
          </section>

          {/* 5. FIRMAS */}
          <section className="pt-10 mt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-16 md:gap-8">
            <div className="flex-1 flex flex-col items-center">
              <SignaturePad 
                label="Área de Firma - Técnico" 
                onSave={setTechSignature} 
                onClear={() => setTechSignature("")}
                disabled={finalizado}
              />
              <h4 className="font-bold text-slate-300 tracking-wider mt-4">FIRMA TÉCNICO MR</h4>
              <input type="text" placeholder="Aclaración" value={form.aclaracionTecnico} onChange={update("aclaracionTecnico")}
                className="mt-2 bg-transparent border-b border-slate-800 text-center text-sm text-slate-300 px-4 py-1 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <SignaturePad 
                label="Área de Firma - Cliente" 
                onSave={setClientSignature} 
                onClear={() => setClientSignature("")}
                disabled={finalizado}
              />
              <h4 className="font-bold text-slate-300 tracking-wider mt-4">FIRMA CLIENTE</h4>
              <input type="text" placeholder="Aclaración" value={form.aclaracionCliente} onChange={update("aclaracionCliente")}
                className="mt-2 bg-transparent border-b border-slate-800 text-center text-sm text-slate-300 px-4 py-1 focus:outline-none focus:border-cyan-500/50" />
            </div>
          </section>

          {/* ── BOTÓN FINALIZAR / GENERAR PDF ──────────────────── */}
          <div id="seccion-finalizar" className="pt-10 border-t border-slate-800/60">
            {!finalizado ? (
              <div className="flex flex-col items-center gap-5">
                <p className="text-sm text-slate-500 text-center max-w-md">
                  Revisá todos los datos antes de continuar. Una vez finalizado, podrás exportar el PDF del contrato firmado.
                </p>
                <button
                  id="btn-finalizar-contrato"
                  type="button"
                  onClick={handleFinalizar}
                  className="group relative px-14 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xl tracking-widest rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.35)] hover:shadow-[0_0_60px_rgba(6,182,212,0.55)] transition-all duration-300 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    FINALIZAR CONTRATO
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                <div className="flex items-center gap-3 text-emerald-400">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold text-2xl">Contrato Finalizado</span>
                </div>

                <button
                  id="btn-generar-pdf"
                  type="button"
                  onClick={handleGenerarPDF}
                  disabled={generando}
                  className="flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60 text-white font-black text-xl tracking-wider rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.35)] hover:shadow-[0_0_60px_rgba(6,182,212,0.55)] transition-all duration-300 active:scale-95"
                >
                  {generando ? (
                    <>
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      GENERAR PDF
                    </>
                  )}
                </button>

                <button type="button" onClick={() => setFinalizado(false)}
                  className="text-slate-500 hover:text-slate-300 text-sm underline transition-colors mt-2 md:mt-0">
                  Editar formulario
                </button>
              </div>
            )}
          </div>

          {/* STARLINK LOGO BOTTOM */}
          <div className="flex justify-between items-center pt-10 pb-2 opacity-40">
            <div>
              <p className="text-3xl font-black tracking-widest text-slate-300" style={{ fontFamily: "Arial Black", letterSpacing: "0.2em" }}>
                STARLINK
              </p>
              <p className="text-sm font-bold tracking-[0.3em] text-slate-500 mt-1">INTERNET FROM SPACE</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-slate-600 flex items-center justify-center relative overflow-hidden">
              <div className="w-16 h-px bg-slate-600 absolute rotate-45" />
              <div className="w-2 h-2 rounded-full bg-slate-400 absolute" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// ── Sub-componentes ────────────────────────────────────────────────────────────

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h3 className={`flex items-center gap-4 text-sm font-black ${color} tracking-[0.2em] uppercase mb-8`}>
      {children}
      <div className="h-px bg-slate-800 flex-1" />
    </h3>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <span className="font-bold text-slate-500 tracking-widest text-xs uppercase w-40 text-right">{label}</span>
      {children}
    </div>
  );
}

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function FormInput({ label, placeholder, type = "text", value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  highlight?: boolean;
}
function FormSelect({ label, options, value, onChange, highlight }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-xl px-4 py-3 font-medium transition-all focus:outline-none focus:ring-1 cursor-pointer
          ${
            highlight
              ? "bg-slate-900 border-2 border-cyan-500/50 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:border-cyan-400 focus:ring-cyan-400"
              : "bg-slate-950/50 border border-slate-700/80 text-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-inner"
          }`}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
          <svg className={`w-4 h-4 ${highlight ? "text-cyan-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PhotoUpload({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/30 border-2 border-dashed border-slate-700/70 rounded-2xl hover:bg-slate-900 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group h-40">
      <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-500 transition-colors shadow-inner">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200 text-center">{title}</span>
    </div>
  );
}
