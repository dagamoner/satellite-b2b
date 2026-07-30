"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


/* ── Fondo del universo (igual que corporate) ── */
const SpaceBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById("erp-space-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const stars = Array.from({ length: 600 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      delta: Math.random() * 0.015 + 0.005,
    }));

    const trainAngle = (Math.PI / 180) * 15;
    const trainSpeed = 1.2;
    let trainX = -200;
    let trainY = canvas.height * 0.3;
    const trainNodes = Array.from({ length: 22 }).map((_, i) => ({
      offsetX: -i * 18 * Math.cos(trainAngle),
      offsetY: -i * 18 * Math.sin(trainAngle),
    }));

    const satellites = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.8,
    }));

    let animationFrameId: number;
    let lastTime = 0;

    const render = (time: number) => {
      if (time - lastTime < 16) { animationFrameId = requestAnimationFrame(render); return; }
      lastTime = time;
      ctx.fillStyle = "rgba(2, 6, 23, 0.45)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.alpha += star.delta;
        if (star.alpha <= 0.1 || star.alpha >= 1) star.delta = -star.delta;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha.toFixed(2)})`;
        ctx.fill();
      });

      satellites.forEach((sat) => {
        sat.x += Math.cos(sat.angle) * sat.speed;
        sat.y += Math.sin(sat.angle) * sat.speed;
        if (sat.x > canvas.width) sat.x = 0;
        if (sat.x < 0) sat.x = canvas.width;
        if (sat.y > canvas.height) sat.y = 0;
        if (sat.y < 0) sat.y = canvas.height;
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,240,255,0.8)";
        ctx.fill();
      });

      trainX += Math.cos(trainAngle) * trainSpeed;
      trainY += Math.sin(trainAngle) * trainSpeed;
      if (trainX > canvas.width + 600) {
        trainX = -500;
        trainY = Math.random() * canvas.height * 0.7;
      }

      ctx.shadowBlur = 12;
      ctx.shadowColor = "#06b6d4";
      trainNodes.forEach((node) => {
        const nx = trainX + node.offsetX;
        const ny = trainY + node.offsetY;
        ctx.beginPath();
        ctx.arc(nx, ny, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      const first = trainNodes[0];
      const last = trainNodes[trainNodes.length - 1];
      if (first && last) {
        ctx.beginPath();
        ctx.moveTo(trainX + first.offsetX, trainY + first.offsetY);
        ctx.lineTo(trainX + last.offsetX, trainY + last.offsetY);
        ctx.strokeStyle = "rgba(6,182,212,0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="erp-space-canvas"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", display: "block" }}
    />
  );
};

/* ── Satélite orbitando ── */
const SatelliteOrbit = ({ isHidden }: { isHidden: boolean }) => (
  <motion.div
    className={`fixed z-[5] transition-opacity duration-500 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-55'}`}
    animate={{
      x: ["-30vw", "50vw", "120vw", "70vw", "-30vw"],
      y: ["20vh", "-10vh", "60vh", "110vh", "20vh"],
      rotate: [0, 30, -15, 10, 0],
      scale: [0.4, 0.6, 0.3, 0.5, 0.4],
    }}
    transition={{ duration: 60, ease: "linear", repeat: Infinity }}
    style={{ top: 0, left: 0 }}
  >
    <img
      src="/satelite.png"
      alt=""
      className="w-24 md:w-40 h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.5)] select-none"
      style={{
        mixBlendMode: "screen",
        filter: "brightness(1.2) contrast(1.5)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
        pointerEvents: "none",
      }}
    />
  </motion.div>
);

export default function ErpPage() {
  const [showInfo, setShowInfo] = useState(false);
  const [showAuditoria, setShowAuditoria] = useState(false);
  const [auditTab, setAuditTab] = useState<'que-es' | 'para-que' | 'primer-paso'>('que-es');
  const [auditKeysOpen, setAuditKeysOpen] = useState(false);
  const [mostrarPropuesta, setMostrarPropuesta] = useState(false);
  const [mostrarInstanciaA, setMostrarInstanciaA] = useState(false);
  const [mostrarInstanciaB, setMostrarInstanciaB] = useState(false);
  const [mostrarInstanciaC, setMostrarInstanciaC] = useState(false);
  const [showTipsAuditoria, setShowTipsAuditoria] = useState(false);
  const [tipsTab, setTipsTab] = useState('intro');
  const [tipsObsOpen, setTipsObsOpen] = useState<Record<string, boolean>>({});

  const [tipsObsText, setTipsObsText] = useState<Record<string, string>>({});
  const [tipsSelections, setTipsSelections] = useState<Record<string, string[]>>({});
  const [mrTechObsText, setMrTechObsText] = useState<Record<string, string>>({});
  const [mrTechSelections, setMrTechSelections] = useState<Record<string, string[]>>({});
  const [reportEmpresa, setReportEmpresa] = useState('');
  const [reportResponsable, setReportResponsable] = useState('');

  const handleCheckboxChange = (
    setState: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
    tab: string,
    item: string,
    checked: boolean
  ) => {
    setState((prev) => {
      const current = prev[tab] || [];
      if (checked) {
        if (!current.includes(item)) return { ...prev, [tab]: [...current, item] };
        return prev;
      } else {
        return { ...prev, [tab]: current.filter((i) => i !== item) };
      }
    });
  };

  const runGeneratePDF = (type: 'tips' | 'mrTech') => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    const isMrTech = type === 'mrTech';
    const title = isMrTech ? 'Reporte Virtual - Auditoría MR Tech' : 'Reporte Virtual - Tips Auditoría';
    const selections = isMrTech ? mrTechSelections : tipsSelections;
    const obsText = isMrTech ? mrTechObsText : tipsObsText;
    const sections = ['ventas', 'pedidos', 'stock', 'caja', 'limpieza', 'encargado', 'rrhh', 'varios'];

    const logoUrl = '/Logo WEB MR Tech.png';
    const img = new window.Image();
    img.src = logoUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG', 15, 10, 40, 20);
      
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 130, 15);
      doc.text(`Empresa: ${reportEmpresa || 'No especificada'}`, 130, 22);
      doc.text(`Responsable: ${reportResponsable || 'No especificado'}`, 130, 29);
      
      doc.setFontSize(16);
      doc.text(title, 15, 45);
      
      let y = 55;
      doc.setFontSize(12);

      sections.forEach(sec => {
        const secSelections = selections[sec] || [];
        const secObs = obsText[sec] || '';
        
        if (secSelections.length > 0 || secObs.trim() !== '') {
          if (y > 270) { doc.addPage(); y = 20; }
          
          doc.setFont('helvetica', 'bold');
          doc.text(sec.toUpperCase(), 15, y);
          y += 8;
          
          doc.setFont('helvetica', 'normal');
          secSelections.forEach(item => {
            if (y > 280) { doc.addPage(); y = 20; }
            const lines = doc.splitTextToSize(`- ${item}`, 180);
            doc.text(lines, 15, y);
            y += 6 * lines.length;
          });
          
          if (secObs.trim() !== '') {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFont('helvetica', 'italic');
            const obsLines = doc.splitTextToSize(`Observaciones: ${secObs}`, 180);
            doc.text(obsLines, 15, y);
            y += 6 * obsLines.length;
            doc.setFont('helvetica', 'normal');
          }
          y += 5;
        }
      });
      
      doc.save(`Reporte_Virtual_${new Date().getTime()}.pdf`);
    };
    img.onerror = () => {
      alert("Error cargando el logo para el PDF. Intente nuevamente.");
    };
  };

  const generatePDF = (type: 'tips' | 'mrTech') => {
    if (typeof window === 'undefined') return;
    
    if (!(window as any).jspdf) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => {
        runGeneratePDF(type);
      };
      document.body.appendChild(script);
    } else {
      runGeneratePDF(type);
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mrTechPassword, setMrTechPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showAuditoriaMRTech, setShowAuditoriaMRTech] = useState(false);
  const [mrTechTab, setMrTechTab] = useState('intro');
  const [mrTechObsOpen, setMrTechObsOpen] = useState<Record<string, boolean>>({});


  const [mostrarPreciosB, setMostrarPreciosB] = useState<string | boolean>(false);
  const [mostrarPreciosC, setMostrarPreciosC] = useState<string | boolean>(false);
  const [moduloSeleccionado, setModuloSeleccionado] = useState("");
  
  const isModalOpen = mostrarInstanciaA || mostrarInstanciaB || mostrarInstanciaC || showAuditoria || mostrarPropuesta || showTipsAuditoria || showAuditoriaMRTech || showPasswordModal;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 font-sans overflow-x-hidden relative">

      {/* Fondo universo */}
      <SpaceBackground />
      <SatelliteOrbit isHidden={false} />

      {/* Tierra — esquina superior derecha */}
      <motion.div
        className="fixed top-[-16vw] right-[-16vw] z-[1] pointer-events-none"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.6, rotate: 360 }}
        transition={{
          opacity: { duration: 0.5 },
          rotate: { duration: 600, ease: "linear", repeat: Infinity },
        }}
        style={{ width: "52vw", maxWidth: "660px" }}
      >
        <img
          src="/tierra.png"
          alt=""
          className="w-full h-full object-contain"
          style={{
            mixBlendMode: "screen",
            filter: "brightness(0.7) saturate(1.3) contrast(1.0)",
            WebkitMaskImage: "radial-gradient(circle 48% at 50% 50%, black 30%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 68%, transparent 82%)",
            maskImage: "radial-gradient(circle 48% at 50% 50%, black 30%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 68%, transparent 82%)",
          }}
        />
      </motion.div>

      {/* Sello de agua - logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center"
      >
        <img
          src="/Logo_new.png"
          alt=""
          className="w-[520px] max-w-[60vw] select-none"
          style={{
            filter: "grayscale(100%) brightness(3)",
            mixBlendMode: "screen",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* Halos de luz de fondo */}
      <div className={`fixed top-[-20%] left-[-10%] w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0 transition-opacity duration-500 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`} />
      <div className={`fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none z-0 transition-opacity duration-500 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`} />

      {/* ── Encabezado sticky ── */}
      <nav className={`fixed top-0 w-full z-50 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700 ${isModalOpen ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20 transition-all duration-500">

          {/* Left Block - MR Tech Logo */}
          <div className="flex-1 flex items-center justify-start hidden md:flex opacity-100 transition-opacity duration-500">
            <div className="relative shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="/Logo WEB MR Tech.png"
                alt="MR Technology"
                className="w-24 md:w-32 object-contain hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) contrast(1.1)' }}
              />
            </div>
          </div>

          {/* Center Block - Transformacion Legend */}
          <div className="flex-1 md:flex-none flex items-center justify-center relative shrink-0">
            <div className="relative flex items-center justify-center">
              <img
                src="/Transformacion.png"
                alt="Transformación Digital Empresarial"
                className="h-14 md:h-[4.5rem] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] relative z-10"
                style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)' }}
              />
            </div>
          </div>

          {/* Right Block - Ecosistema + Hablamos */}
          <div className="flex-1 flex justify-end items-center hidden md:flex gap-4 opacity-100 transition-opacity duration-500">
            {/* ECOSISTEMA Header Button */}
            <button
              onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
              className="relative group/eco shrink-0 flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 mr-2"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[#33E8FF] rounded-full blur-[15px] opacity-30 group-hover/eco:opacity-70 transition-opacity duration-300 pointer-events-none" />
                <img
                  src="/ecosistema.jpg"
                  alt="Ecosistema"
                  className="w-full h-full object-cover rounded-full relative z-10"
                  style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 70%)', maskImage: 'radial-gradient(circle at center, black 55%, transparent 70%)', filter: 'drop-shadow(0 0 8px rgba(51,232,255,0.7)) brightness(1.2)' }}
                />
              </div>
              <span className="text-[#33E8FF] font-black text-[10px] tracking-[0.15em] uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">ECOSISTEMA</span>
            </button>

            {/* Hablamos Button */}
            <button
              onClick={() => { window.location.href = "https://www.mrtechnology.it.com/#whatsapp-contact"; }}
              className="relative group/hablamos shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-md opacity-0 group-hover/hablamos:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <img
                src="/Hablamos.png"
                alt="Hablamos"
                className="h-24 md:h-28 w-auto object-contain relative z-10"
                style={{
                  mixBlendMode: 'screen',
                  WebkitMaskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)',
                  maskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)'
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Contenido principal ── */}
      <section className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 text-center pt-32 md:pt-40 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isModalOpen ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center gap-6 max-w-3xl w-full ${isModalOpen ? 'pointer-events-none' : ''}`}
        >
          {/* Main Info Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-14 items-start w-full max-w-5xl mx-auto mb-8 px-4 md:px-0">
            
            {/* --- MAXIREST ROW --- */}
            {!showAuditoria && (
              <>
                {/* Logo Maxirest */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center w-full md:w-auto"
                >
                  <div 
                    className="flex items-center justify-center relative cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setShowInfo(!showInfo);
                      setShowAuditoria(false);
                    }}
                  >
                    <img
                      src="/logo maxirest ONE.png"
                      alt="Maxirest ONE"
                      className={`w-72 md:w-80 h-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] ${showInfo ? 'drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]' : ''}`}
                    />
                  </div>
                </motion.div>
                
                {/* Text Maxirest */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col items-center md:items-start text-center md:text-left cursor-pointer transition-transform duration-300 hover:scale-105 md:pt-3"
                  onClick={() => {
                    setShowInfo(!showInfo);
                    setShowAuditoria(false);
                  }}
                >
                  <h2 className="text-[#33E8FF] font-black text-lg md:text-xl tracking-[0.15em] uppercase drop-shadow-[0_0_10px_rgba(51,232,255,0.5)]">
                    Software Gastronómico <span className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">MAXIREST</span>
                  </h2>
                  <span className="text-white font-bold text-base md:text-lg tracking-widest mt-2 mb-2 opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                    Potenciamos tu proyecto gastronómico al siguiente nivel
                  </span>
                  <span className="text-[#33E8FF] font-black text-lg md:text-xl tracking-widest mt-2 mb-1 uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.6)]">
                    AGENTES OFICIALES.
                  </span>
                  <span className="text-slate-100 text-sm md:text-base font-bold tracking-[0.2em] mt-1 uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                    Provincia de Mendoza y Alrededores
                  </span>
                </motion.div>
              </>
            )}

            {/* --- AUDITORIA ROW --- */}
            {!showInfo && (
              <>
                {/* Logo Auditoria */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex justify-center w-full md:w-auto md:mt-2"
                >
                  <div 
                    className="cursor-pointer transition-all duration-300 hover:scale-105 flex items-center justify-center w-36 md:w-44"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAuditoria(!showAuditoria);
                      setShowInfo(false);
                    }}
                    title="Auditoría y Consultoría Gastronómica"
                  >
                    <img
                      src="/Logo MR Consultoria Gast.png"
                      alt="MR Consultoria Gastronómica"
                      className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.5)]"
                      style={{ mixBlendMode: 'screen' }}
                    />
                  </div>
                </motion.div>

                {/* Text Auditoria */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col items-center md:items-start text-center md:text-left cursor-pointer transition-transform duration-300 hover:scale-105 md:pt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuditoria(!showAuditoria);
                    setShowInfo(false);
                  }}
                >
                  <h2 className="text-[#33E8FF] font-black text-lg md:text-xl tracking-[0.15em] uppercase drop-shadow-[0_0_10px_rgba(51,232,255,0.5)]">
                    EL FUTURO DE LA GESTIÓN GASTRONÓMICA
                  </h2>
                  <p className="text-white font-bold text-sm md:text-[15px] tracking-wide mt-3 mb-2 leading-[1.7] drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] w-full" style={{ textAlign: "justify", textAlignLast: "left" }}>
                    Auditoria & Consultoria con un equipo interdisciplinario gastronomico y sistematico que junto a herramientas de IT + IA = optimización de procesos en base a los puntos de dolor, control de toda la gestión gastronomica del local e integración tecnológica de vanguardia para llevar su restaurante al siguiente nivel de rentabilidad y excelencia.
                  </p>
                </motion.div>
              </>
            )}
          </div>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                key="info-content"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                {/* Nueva Sección de Solución Completa */}
                <div className="flex flex-col items-center w-full max-w-[1200px] mb-8 mt-2 px-2">
                  <h3 className="text-[#33E8FF] font-black text-xl md:text-2xl text-center tracking-widest uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.5)] mb-4">
                    La solución más completa para negocios gastronómicos
                  </h3>
                  
                  {/* Contenedor relativo para la imagen principal y su overlay (Botón A) */}
                  <div className="relative w-full max-w-4xl mx-auto flex justify-center">
                    <img
                      src="/Instancias Maxirest.png"
                      alt="Instancias Maxirest"
                      className="w-full object-contain relative z-10 pointer-events-none"
                      style={{ 
                        mixBlendMode: 'screen', 
                        filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 20px rgba(51,232,255,0.2))' 
                      }}
                    />
                    
                    {/* Botón Ir Instancia A (Overlay a la derecha arriba) */}
                    <button 
                      onClick={() => setMostrarInstanciaA(true)}
                      className="absolute z-[50] group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline-none"
                      style={{ top: '5%', right: '-18%', width: '18%' }}
                      title="Ver Instancia A"
                    >
                      <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-80 blur-2xl transition-all duration-300 pointer-events-none scale-90" />
                      <img 
                        src="/ir instancia A.png" 
                        alt="Ir a Instancia A"
                        className="w-full h-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_10px_rgba(51,232,255,0.5)] group-hover:drop-shadow-[0_0_30px_rgba(51,232,255,1)]"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.2) contrast(1.2)' }}
                      />
                    </button>

                    {/* Botón Ir Instancia B (Overlay a la derecha abajo de Instancia A) */}
                    <button 
                      onClick={() => setMostrarInstanciaB(true)}
                      className="absolute z-[50] group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline-none"
                      style={{ top: '35%', right: '-18%', width: '18%' }}
                      title="Ver Instancia B"
                    >
                      <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-80 blur-2xl transition-all duration-300 pointer-events-none scale-90" />
                      <img 
                        src="/ir instancia B.png" 
                        alt="Ir a Instancia B"
                        className="w-full h-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_10px_rgba(51,232,255,0.5)] group-hover:drop-shadow-[0_0_30px_rgba(51,232,255,1)]"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.2) contrast(1.2)' }}
                      />
                    </button>

                    {/* Botón Ir Instancia C */}
                    <button 
                      onClick={() => {
                        setShowInfo(false);
                        setShowAuditoria(true);
                        setAuditTab('que-es');
                      }}
                      className="absolute z-[50] group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline-none"
                      style={{ top: '65%', right: '-18%', width: '18%' }}
                      title="Ver Instancia C"
                    >
                      <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-80 blur-2xl transition-all duration-300 pointer-events-none scale-90" />
                      <img 
                        src="/ir instancia C.png" 
                        alt="Ir a Instancia C"
                        className="w-full h-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] group-hover:drop-shadow-[0_0_30px_rgba(249,115,22,1)] scale-[1.15]"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.2) contrast(1.2)' }}
                      />
                    </button>
                  </div>
                </div>

                {/* Separador con destellos */}
                <div className="flex items-center gap-4 w-full max-w-md">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="text-[#33E8FF]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-[0_0_8px_rgba(51,232,255,1)]">
                      <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
                    </svg>
                  </motion.div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Modal Auditoría & Consultoría ── */}
      <AnimatePresence>
        {showAuditoria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-start justify-start bg-[#020617]/40 backdrop-blur-md overflow-y-auto"
          >
            {/* Botón Regresar */}
            <button
              onClick={() => { setShowAuditoria(false); setAuditKeysOpen(false); setAuditTab('que-es'); }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[120] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-24 pb-16">

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center gap-6 mb-10"
              >
                <img
                  src="/Logo MR Consultoria Gast.png"
                  alt="MR Consultoria Gastronómica"
                  className="w-28 md:w-36 h-auto object-contain drop-shadow-[0_0_25px_rgba(51,232,255,0.6)]"
                  style={{ mixBlendMode: 'screen' }}
                />
                <div className="flex flex-col items-center md:items-start text-center md:text-left">

                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">El Futuro de la Gestión<br/><span className="text-[#33E8FF] drop-shadow-[0_0_12px_rgba(51,232,255,0.8)]">Gastronómica</span></h2>
                  <p className="text-slate-400 text-sm md:text-base mt-2 font-medium max-w-xl">Auditoría & Consultoría con un equipo interdisciplinario gastronómico e IT para llevar tu restaurante al siguiente nivel de rentabilidad.</p>
                </div>
              </motion.div>

              {/* Tab Buttons + CTA inline */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8">
                {(['que-es', 'para-que', 'primer-paso'] as const).map((tab, i) => {
                  const labels = ['¿Qué es?', '¿Para qué sirve?', 'El Primer Paso Obligatorio'];
                  return (
                    <button
                      key={tab}
                      onClick={() => setAuditTab(tab)}
                      className={`relative px-5 py-2.5 rounded-xl font-black text-xs md:text-sm tracking-widest uppercase transition-all duration-300 border ${
                        auditTab === tab
                          ? 'bg-[#33E8FF]/15 border-[#33E8FF]/60 text-[#33E8FF] drop-shadow-[0_0_10px_rgba(51,232,255,0.5)]'
                          : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {labels[i]}
                    </button>
                  );
                })}

                {/* CTA: solo visible cuando está activa la pestaña Primer Paso */}
                <AnimatePresence>
                  {auditTab === 'primer-paso' && (
                    <motion.button
                      key="cta-comenzamos"
                      onClick={() => { setShowAuditoria(false); setMostrarPropuesta(true); }}
                      initial={{ opacity: 0, scale: 0.85, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: 20 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="ml-auto flex flex-col items-center justify-center gap-0.5 px-6 py-3 rounded-2xl font-black uppercase text-slate-900 bg-[#33E8FF] hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(51,232,255,0.55)] hover:shadow-[0_0_45px_rgba(51,232,255,0.9)] cursor-pointer select-none shrink-0"
                    >
                      <span className="text-sm md:text-base tracking-[0.12em] leading-tight">ANALIZAMOS</span>
                      <span className="text-[8px] md:text-[9px] tracking-[0.15em] leading-tight font-bold opacity-80">AUDITORÍA, TECNOLOGÍA & CONSULTORÍA</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Panel Content */}
              <AnimatePresence mode="wait">
                {auditTab === 'que-es' && (
                  <motion.div
                    key="que-es"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-5" style={{ textAlign: 'justify' }}>
                        Es una intervención profesional de 3 a 4 horas en tu local, realizada de forma estratégica en tu turno fuerte. Nuestro gran valor diferencial acá es la objetividad absoluta: al ser un servicio tercerizado y externo, no tenemos contaminación visual, ni vicios de rutina, ni compromisos de amiguismo con el personal. Miramos lo que el día a día ya no te deja ver.
                      </p>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed" style={{ textAlign: 'justify' }}>
                        Para tu tranquilidad, la auditoría no interfiere ni frena tu despacho. El trabajo se inicia un tiempo antes de que explote el movimiento de clientes. Hacemos breves entrevistas individuales con empleados clave en frío. Una vez que el local abre sus puertas, nos movemos en modo <span className="text-[#33E8FF] font-bold">'sombra'</span>: observamos y registramos el flujo real del negocio en vivo sin interrumpir a nadie.
                      </p>
                    </div>

                    {/* 6 Claves */}
                    <div className="bg-slate-900/40 border border-[#33E8FF]/20 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setAuditKeysOpen(!auditKeysOpen)}
                        className="w-full flex items-center justify-between px-6 py-4 group hover:bg-[#33E8FF]/5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#33E8FF] text-xl">★</span>
                          <span className="font-black tracking-widest uppercase text-[#33E8FF] drop-shadow-[0_0_8px_rgba(51,232,255,0.7)]">6 Claves de la Auditoría</span>
                        </div>
                        <motion.svg
                          viewBox="0 0 24 24" fill="none" stroke="#33E8FF" strokeWidth="2.5" className="w-5 h-5"
                          animate={{ rotate: auditKeysOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                        </motion.svg>
                      </button>

                      <AnimatePresence>
                        {auditKeysOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 border-t border-white/10">
                              {[
                                { color: '#00f0ff', title: 'Gestión de Costos', desc: 'Analizamos la brecha real entre lo presupuestado y lo que se sirve en el plato.', icon: <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" /> },
                                { color: '#00ff88', title: 'Circuito de Compras', desc: 'Evaluamos el control físico de la mercadería frente a lo facturado por los proveedores.', icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></> },
                                { color: '#0077ff', title: 'Servicio y Salón', desc: 'Evaluamos los tiempos críticos de atención y la efectividad de venta del personal.', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></> },
                                { color: '#ffaa00', title: 'Control de Caja', desc: 'Auditamos la transparencia y los procesos en el flujo diario del efectivo.', icon: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></> },
                                { color: '#ff0055', title: 'Estándares de Higiene', desc: 'Verificamos el cumplimiento normativo, preventivo y operativo del local.', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 11l2 2 4-4" /></> },
                                { color: '#a800ff', title: 'Liderazgo', desc: 'Evaluamos la autonomía del negocio y el desempeño real de los mandos medios.', icon: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></> },
                              ].map((key, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.07, duration: 0.35 }}
                                  className="flex gap-4 items-start p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/15 transition-all duration-300 group/key"
                                >
                                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${key.color}18`, boxShadow: `0 0 14px ${key.color}44` }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke={key.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                      {key.icon}
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-white text-sm mb-1" style={{ textShadow: `0 0 10px ${key.color}55` }}>{key.title}</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">{key.desc}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {auditTab === 'para-que' && (
                  <motion.div
                    key="para-que"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md flex flex-col gap-5">
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed" style={{ textAlign: 'justify' }}>
                        Sirve para sacar a la luz los puntos ciegos por donde se te está yendo la ganancia sin que te des cuenta. Podés tener el local lleno de clientes, pero si las operaciones están desordenadas, estás moviendo mucha caja pero perdiendo rentabilidad.
                      </p>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed" style={{ textAlign: 'justify' }}>
                        Esta auditoría te sirve para entender que las fugas de dinero no ocurren solo por un plato mal costeado. Ocurren cuando la falta de manuales de procedimientos hace que el personal trabaje sin un estándar claro, cuando una mala selección de personal rompe la eficiencia del equipo, o cuando el descuido en los controles bromatológicos te expone a multas y a la pérdida de mercadería valiosa. <span className="text-[#33E8FF] font-bold">El objetivo es ponerle un número exacto a ese impacto y saber con precisión dónde estás parado.</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {auditTab === 'primer-paso' && (
                  <motion.div
                    key="primer-paso"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md flex flex-col gap-5">
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed" style={{ textAlign: 'justify' }}>
                        Es fundamental entender que la auditoría es el diagnóstico, no la solución. Es el análisis clínico que nos dice exactamente dónde está la infección. <span className="text-[#33E8FF] font-bold">Ningún médico te va a operar ni a medicar sin hacerte estudios previos;</span> en un negocio gastronómico funciona igual.
                      </p>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed" style={{ textAlign: 'justify' }}>
                        Este es el primer paso obligatorio para detectar las fallas. Una vez que tengamos el mapa de puntos rojos sobre la mesa, recién ahí podemos diseñar el plan de acción a medida para solucionar el desorden de raíz, proteger tu plata y devolverte la rentabilidad.
                      </p>
                      {/* CTA removido del panel: ahora est\u00e1 junto a los tabs */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>




              {/* Footer tag */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#33E8FF]/30 to-transparent" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#33E8FF]/60">01. AUDITORÍA OPERATIVA · MR CONSULTORÍA GASTRONÓMICA</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#33E8FF]/30 to-transparent" />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal PROPUESTA ── */}
      <AnimatePresence>
        {mostrarPropuesta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-start justify-start bg-[#020617]/40 backdrop-blur-md overflow-y-auto"
          >
            {/* Halo de fondo decorativo */}
            <div className="pointer-events-none fixed top-[-15%] left-[-10%] w-[700px] h-[500px] bg-[#33E8FF]/6 blur-[140px] rounded-full" />
            <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#f97316]/6 blur-[140px] rounded-full" />

            {/* Botón Regresar */}
            <button
              onClick={() => { setMostrarPropuesta(false); setShowAuditoria(true); }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[220] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-24 pb-20 relative z-10">

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="mb-14 text-center"
              >

                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                  Auditoría,{" "}
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #33E8FF 0%, #0ea5e9 50%, #33E8FF 100%)' }}>
                    Tecnología
                  </span>
                  {" "}&amp;{" "}
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #f97316 100%)' }}>
                    Consultoría
                  </span>
                </h2>
                {/* LA FUSIÓN PERFECTA */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#33E8FF]/60" />
                  <span className="text-xs md:text-sm font-black tracking-[0.3em] uppercase" style={{ backgroundImage: 'linear-gradient(90deg, #33E8FF, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 8px rgba(51,232,255,0.5))' }}>
                    LA FUSIÓN PERFECTA
                  </span>
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#f97316]/60" />
                </div>
                <p className="text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                  Gastronomía tradicional impulsada por tecnología y auditorías de precisión.
                </p>
              </motion.div>

              {/* Cards — 3 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

                {/* Card 1: Auditoría de Calidad - IZQUIERDA */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border-2 border-[#a855f7]/80 rounded-2xl transition-all duration-500 group-hover:border-[#a855f7]" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-[#a855f7]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Logo Banner */}
                    <div className="w-full h-40 md:h-48 relative flex items-center justify-center overflow-hidden rounded-t-2xl border-b border-[#a855f7]/20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(168,85,247,0.05))' }}>
                      <img
                        src="/Logo Auditoria Operativa.png"
                        alt="Auditoria de Calidad"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(168,85,247,0.4))' }}
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1 gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg md:text-xl font-black text-white tracking-wide drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          Auditoria de Calidad
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed" style={{ textAlign: 'justify' }}>
                          Evaluamos minuciosamente cada eslabón de la cadena operativa: desde el ingreso de materia prima hasta la entrega en mesa. Detectamos mermas, desvíos en recetas y fallas operativas críticas.
                        </p>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full mt-auto pt-4 border-t border-[#a855f7]/20 gap-1">
                        {['Cadena Operativa', 'Mermas', 'Recetas'].map(tag => (
                          <span key={tag} className="flex-1 text-center px-1 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase text-[#a855f7] bg-[#a855f7]/5 truncate">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Integración Tecnológica - CENTRO */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border-2 border-[#33E8FF]/80 rounded-2xl transition-all duration-500 group-hover:border-[#33E8FF]" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#33E8FF] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#33E8FF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-[#33E8FF]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Logo Banner */}
                    <div className="w-full h-40 md:h-48 relative flex items-center justify-center overflow-hidden rounded-t-2xl border-b border-[#33E8FF]/20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(51,232,255,0.05))' }}>
                      <img
                        src="/Logo Integracion Tecnologica.png"
                        alt="Integracion Tecnologica"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(51,232,255,0.4))' }}
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1 gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg md:text-xl font-black text-white tracking-wide drop-shadow-[0_0_8px_rgba(51,232,255,0.3)]">
                          Integracion Tecnologica
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed" style={{ textAlign: 'justify' }}>
                          Diseñamos e implementamos el ecosistema digital ideal para su marca (POS, KDS, ERP). Integramos datos operativos para una toma de decisiones informada, rápida y automatizada.
                        </p>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full mt-auto pt-4 border-t border-[#33E8FF]/20 gap-1">
                        {['POS', 'KDS', 'ERP', 'Automatización'].map(tag => (
                          <span key={tag} className="flex-1 text-center px-1 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase text-[#33E8FF] bg-[#33E8FF]/5 truncate">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Consultoría Estratégica - DERECHA */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border-2 border-[#f97316]/80 rounded-2xl transition-all duration-500 group-hover:border-[#f97316]" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-[#f97316]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Logo Banner */}
                    <div className="w-full h-40 md:h-48 relative flex items-center justify-center overflow-hidden rounded-t-2xl border-b border-[#f97316]/20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(249,115,22,0.05))' }}>
                      <img
                        src="/Logo Consultoria Estrategica.png"
                        alt="Consultoria Estrategica"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(249,115,22,0.4))' }}
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1 gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg md:text-xl font-black text-white tracking-wide drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                          Consultoria Estrategica
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed" style={{ textAlign: 'justify' }}>
                          Ingeniería de menús, fijación de precios, reestructuración financiera y diseño de planes de expansión. Acompañamos a los gerentes y dueños a lograr rentabilidad sustentable.
                        </p>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full mt-auto pt-4 border-t border-[#f97316]/20 gap-1">
                        {['Ingeniería de Menús', 'Precios', 'Expansión', 'Rentabilidad'].map(tag => (
                          <span key={tag} className="flex-1 text-center px-1 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase text-[#f97316] bg-[#f97316]/5 truncate">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* Separador + CTA WhatsApp */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-4 w-full max-w-md">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#33E8FF]/30 to-transparent" />
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="text-[#33E8FF]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 drop-shadow-[0_0_8px_rgba(51,232,255,1)]">
                      <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
                    </svg>
                  </motion.div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#33E8FF]/30 to-transparent" />
                </div>

                <div className="flex flex-col items-stretch gap-4 w-max mx-auto mt-6">
                  <button
                    onClick={() => { setMostrarPropuesta(false); setShowTipsAuditoria(true); }}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black tracking-widest uppercase text-sm text-[#33E8FF] bg-[#020617] border border-[#33E8FF]/30 hover:border-[#33E8FF] hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.15)] hover:shadow-[0_0_35px_rgba(51,232,255,0.6)]"
                  >
                    Ejecuta tu propia AUDITORIA
                  </button>
                  <button
                    onClick={() => { setMostrarPropuesta(false); setShowPasswordModal(true); }}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black tracking-widest uppercase text-sm text-[#020617] bg-[#33E8FF] hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)]"
                  >
                    AUDITORIA MR Tech
                  </button>
                </div>

              </motion.div>



              {/* Footer tag */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#33E8FF]/20 to-transparent" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#33E8FF]/50">02. PROPUESTA · MR CONSULTORÍA GASTRONÓMICA</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#33E8FF]/20 to-transparent" />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal / Lightbox para Instancia A */}
      <AnimatePresence>
        {mostrarInstanciaA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-4 md:p-8"
            onClick={() => setMostrarInstanciaA(false)}
          >
            <button 
              onClick={() => setMostrarInstanciaA(false)}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[120] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">
                REGRESAR
              </span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full flex flex-col items-center justify-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/instancia A.png"
                alt="Instancia A"
                className="w-full h-auto max-h-[85vh] object-contain drop-shadow-[0_0_40px_rgba(51,232,255,0.4)] rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal / Lightbox para Instancia B */}
      <AnimatePresence>
        {mostrarInstanciaB && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent p-4 md:p-6"
            onClick={() => {
              if (mostrarPreciosB) {
                setMostrarPreciosB(false);
              } else {
                setMostrarInstanciaB(false);
              }
            }}
          >
            {/* Botón Regresar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (mostrarPreciosB) {
                  setMostrarPreciosB(false);
                } else {
                  setMostrarInstanciaB(false);
                }
              }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[120] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl w-full flex flex-col items-center z-10 mt-2 h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">

                {/* ── Estado inicial: imagen hero + título + 3 logos ── */}
                {!mostrarPreciosB && (
                  <motion.div
                    key="selector"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col w-full max-w-5xl mx-auto pb-16 pt-0 -mt-6 px-4"
                  >

                    {/* ── HERO Instancia B ── */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6 w-full mt-12 md:mt-24"
                    >
                      {/* Imagen con glow y levitación */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 rounded-full bg-[#33E8FF] blur-[55px] opacity-25 animate-pulse pointer-events-none scale-110" />
                        <motion.img
                          src="/ir instancia B.png"
                          alt="Instancia B - Maxirest"
                          className="relative z-10 w-32 md:w-44 h-auto object-contain drop-shadow-[0_0_35px_rgba(51,232,255,0.7)]"
                          style={{ mixBlendMode: "screen", filter: "brightness(1.15) contrast(1.1)" }}
                          animate={{ y: [0, -9, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Textos futuristas */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
                        {/* Badge */}
                        <div className="flex items-center gap-2">
                          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#33E8FF] opacity-80" />
                          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#33E8FF] drop-shadow-[0_0_8px_rgba(51,232,255,0.9)]">
                            MAXIREST ONE - NUEVA GENERACIÓN
                          </span>
                          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#33E8FF] opacity-80" />
                        </div>

                        {/* Título */}
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">INSTANCIA </span>
                          <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg, #33E8FF 0%, #0ea5e9 40%, #33E8FF 100%)" }}
                          >
                            B
                          </span>
                        </h2>

                        <p className="text-[#33E8FF] font-bold text-lg md:text-xl tracking-wide drop-shadow-[0_0_5px_rgba(51,232,255,0.6)]">
                          La revolución digital gastronómica.
                        </p>

                        {/* Separador decorativo */}
                        <div className="flex items-center gap-3 mt-1 w-full">
                          <div className="flex-1 h-px bg-gradient-to-r from-[#33E8FF]/40 to-transparent" />
                          <motion.svg
                            viewBox="0 0 24 24" fill="#33E8FF"
                            className="w-2.5 h-2.5 opacity-70 drop-shadow-[0_0_5px_rgba(51,232,255,1)]"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                          >
                            <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
                          </motion.svg>
                          <div className="flex-1 h-px bg-gradient-to-l from-[#33E8FF]/40 to-transparent" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="text-[#33E8FF] font-black text-xl md:text-2xl tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(51,232,255,0.8)] mb-2 text-center self-center"
                    >
                      SELECCIONÁ TU OPCIÓN
                    </motion.h2>

                    {/* ── 3 opciones en grid horizontal ── */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 w-full mt-4">

                      {/* Licencias */}
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                        className="relative flex flex-col items-center justify-center group cursor-pointer"
                        onClick={() => setMostrarPreciosB('licencias')}
                      >
                        <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-10 blur-[30px] transition-opacity duration-500 rounded-2xl pointer-events-none" />
                        <img
                          src="/Licencias Maxirest.png"
                          alt="Licencias Maxirest"
                          className="w-full h-auto object-contain transition-all duration-500 hover:scale-[1.05] drop-shadow-[0_0_15px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_35px_rgba(51,232,255,0.8)] relative z-10"
                          style={{ mixBlendMode: 'screen' }}
                        />
                      </motion.div>

                      {/* Implementaciones */}
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="relative flex flex-col items-center justify-center group cursor-pointer"
                        onClick={() => setMostrarPreciosB('implementaciones')}
                      >
                        <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-10 blur-[30px] transition-opacity duration-500 rounded-2xl pointer-events-none" />
                        <img
                          src="/Implementaciones Maxirest.png"
                          alt="Implementaciones Maxirest"
                          className="w-full h-auto object-contain transition-all duration-500 hover:scale-[1.05] drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:drop-shadow-[0_0_35px_rgba(249,115,22,0.8)] relative z-10"
                          style={{ mixBlendMode: 'screen' }}
                        />
                      </motion.div>

                      {/* Capacitaciones */}
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                        className="relative flex flex-col items-center justify-center group cursor-pointer"
                        onClick={() => setMostrarPreciosB('capacitaciones')}
                      >
                        <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-10 blur-[30px] transition-opacity duration-500 rounded-2xl pointer-events-none" />
                        <img
                          src="/Capacitaciones MAXIREST.png"
                          alt="Capacitaciones MAXIREST"
                          className="w-full h-auto object-contain transition-all duration-500 hover:scale-[1.05] drop-shadow-[0_0_15px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_35px_rgba(51,232,255,0.8)] relative z-10"
                          style={{ mixBlendMode: 'screen' }}
                        />
                      </motion.div>

                    </div>
                  </motion.div>
                )}

                {/* ── LICENCIAS: logo centrado + cards izq + estructuras der ── */}
                {mostrarPreciosB === 'licencias' && (
                  <motion.div
                    key="licencias-layout"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center w-full gap-4 pb-8"
                  >
                    {/* Logo centrado arriba — clic vuelve al selector */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex justify-center w-full cursor-pointer"
                      onClick={() => setMostrarPreciosB(false)}
                      title="Volver a opciones"
                    >
                      <img
                        src="/Licencias Maxirest.png"
                        alt="Licencias Maxirest"
                        className="object-contain drop-shadow-[0_0_40px_rgba(51,232,255,0.9)] hover:scale-105 transition-transform duration-300"
                        style={{ mixBlendMode: 'screen', maxHeight: '36vh', maxWidth: '80%' }}
                      />
                    </motion.div>

                    {/* Layout de una columna: Cards y Estructuras intercaladas */}
                    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto items-center mt-4">
                      
                      {/* --- FULL PRO --- */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full flex flex-col gap-6"
                      >
                        {/* Card FULL-PRO */}
                        <div className="bg-slate-900/65 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_28px_rgba(0,0,0,0.5)] hover:shadow-[0_0_55px_rgba(51,232,255,0.22)] transition-shadow duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#33E8FF]/30 transition-all duration-500 pointer-events-none" />
                          <h4 className="text-2xl font-black text-[#33E8FF] mb-2 tracking-widest drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">FULL-PRO</h4>
                          <p className="text-slate-300 text-sm mb-4 font-medium leading-relaxed">
                            La versión FULL brinda todos los Módulos y funcionalidades completas del software.
                          </p>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                              <span className="text-white font-bold text-base">Sistema MAXIREST BASE</span>
                              <span className="text-orange-400 font-black text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$130.899</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-white/80 font-medium text-sm">Terminal Adicional (cada una)</span>
                              <span className="text-orange-400 font-black text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$16.854</span>
                            </div>
                          </div>
                          <p className="mt-4 text-[12px] font-semibold" style={{ color: '#33E8FF' }}>
                            * El valor manifestado es Mensual en concepto de alquiler del software.
                          </p>
                        </div>
                        
                        {/* Estructura FULL */}
                        <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-900/40 p-4">
                          <img
                            src="/Estructura FULL.png"
                            alt="Estructura FULL Maxirest"
                            className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.3)]"
                          />
                        </div>
                      </motion.div>

                      {/* --- XPRESS --- */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full flex flex-col gap-6"
                      >
                        {/* Card XPRESS */}
                        <div className="bg-slate-900/65 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_28px_rgba(0,0,0,0.5)] hover:shadow-[0_0_55px_rgba(51,232,255,0.22)] transition-shadow duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#33E8FF]/30 transition-all duration-500 pointer-events-none" />
                          <h4 className="text-2xl font-black text-[#33E8FF] mb-2 tracking-widest drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">XPRESS</h4>
                          <p className="text-slate-300 text-sm mb-4 font-medium leading-relaxed">
                            La versión XPRESS brinda todos los Módulos y funcionalidades completas del software para operar como Punto de Venta. No cuenta con Compras ni Stock.
                          </p>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                              <span className="text-white font-bold text-base">Sistema MAXIREST BASE</span>
                              <span className="text-orange-400 font-black text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$85.860</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-white/80 font-medium text-sm">Terminal Adicional (cada una)</span>
                              <span className="text-orange-400 font-black text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$11.236</span>
                            </div>
                          </div>
                          <p className="mt-4 text-[12px] font-semibold" style={{ color: '#33E8FF' }}>
                            * El valor manifestado es Mensual en concepto de alquiler del software.
                          </p>
                        </div>
                        
                        {/* Estructura XPRESS */}
                        <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-900/40 p-4">
                          <img
                            src="/Estrcutura Xpress.png"
                            alt="Estructura XPRESS Maxirest"
                            className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.3)]"
                          />
                        </div>
                      </motion.div>

                    </div>
                  </motion.div>
                )}

                {/* ── IMPLEMENTACIONES ── */}
                {mostrarPreciosB === 'implementaciones' && (
                  <motion.div
                    key="implementaciones-layout"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-5 w-full pb-8"
                  >
                    <div className="flex justify-center w-full cursor-pointer" onClick={() => setMostrarPreciosB(false)} title="Volver a opciones">
                      <img src="/Implementaciones Maxirest.png" alt="Implementaciones Maxirest"
                        className="object-contain drop-shadow-[0_0_40px_rgba(51,232,255,0.9)] hover:scale-105 transition-transform duration-300"
                        style={{ mixBlendMode: 'screen', maxHeight: '36vh', maxWidth: '80%' }} />
                    </div>
                    
                    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto items-center mt-4">
                      {/* Título de Implementación */}
                      <div className="w-full text-center">
                        <h3 className="text-[#33E8FF] text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-[0_0_12px_rgba(51,232,255,0.7)]">
                          Instalación, configuración y puesta en marcha. Llave en mano.
                        </h3>
                      </div>

                      {/* --- FULL PRO --- */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full"
                      >
                        <div className="bg-slate-900/65 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_28px_rgba(0,0,0,0.5)] hover:shadow-[0_0_55px_rgba(51,232,255,0.22)] transition-shadow duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#33E8FF]/30 transition-all duration-500 pointer-events-none" />
                          <div className="flex flex-col w-full gap-3 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-2 border-b border-slate-700/50 pb-3">
                              <h4 className="text-2xl font-black text-white tracking-widest">Sistema Maxirest <span className="text-[#33E8FF] drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">PRO FULL</span></h4>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-300 font-bold uppercase text-sm">Importe</span>
                                <span className="text-orange-400 font-black text-3xl md:text-4xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$250.000 <span className="text-xl">+ IVA</span></span>
                              </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-1">
                              <span className="text-white/80 font-medium text-lg tracking-wide">Terminal Adicional PRO - FULL</span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-300 font-bold uppercase text-sm">Importe</span>
                                <span className="text-orange-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$95.000 <span className="text-lg">+ IVA</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* --- XPRESS --- */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full"
                      >
                        <div className="bg-slate-900/65 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_28px_rgba(0,0,0,0.5)] hover:shadow-[0_0_55px_rgba(51,232,255,0.22)] transition-shadow duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#33E8FF]/30 transition-all duration-500 pointer-events-none" />
                          <div className="flex flex-col w-full gap-3 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-2 border-b border-slate-700/50 pb-3">
                              <h4 className="text-2xl font-black text-white tracking-widest">Sistema Maxirest <span className="text-[#33E8FF] drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">XPRESS</span></h4>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-300 font-bold uppercase text-sm">Importe</span>
                                <span className="text-orange-400 font-black text-3xl md:text-4xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$200.000 <span className="text-xl">+ IVA</span></span>
                              </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-1">
                              <span className="text-white/80 font-medium text-lg tracking-wide">Terminal Adicional XPRESS</span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-300 font-bold uppercase text-sm">Importe</span>
                                <span className="text-orange-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]">$75.000 <span className="text-lg">+ IVA</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* --- TEXTO INFORMATIVO --- */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-full mt-4"
                      >
                        <div className="border border-[#33E8FF]/30 bg-[#33E8FF]/5 p-6 rounded-xl text-center">
                          <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium" style={{ textAlign: "justify", textAlignLast: "center" }}>
                            Los valores incluyen las parametrizaciones generales para el funcionamiento inicial del software junto con toda la Carta Menú del local. Además, está incluida la configuración de cada PC con respecto al MAXIREST y las comanderas necesarias junto con la Factura Electrónica.
                          </p>

                        </div>
                      </motion.div>

                    </div>
                  </motion.div>
                )}

                {/* ── CAPACITACIONES ── */}
                {mostrarPreciosB === 'capacitaciones' && (
                  <motion.div
                    key="capacitaciones-layout"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center w-full pb-12 px-4"
                  >
                    {/* Logo principal */}
                    <div className="flex items-center justify-center w-full cursor-pointer -mt-20 md:-mt-24 mb-0 relative z-10" onClick={() => setMostrarPreciosB(false)} title="Volver">
                      <img src="/Leyenda Capacitaciones.png" alt="Leyenda Capacitaciones"
                        className="object-contain w-full h-auto drop-shadow-[0_0_30px_rgba(51,232,255,0.7)] hover:drop-shadow-[0_0_40px_rgba(51,232,255,0.9)] transition-all duration-500"
                        style={{ mixBlendMode: 'screen', maxHeight: '75vh' }} />
                    </div>

                    {/* Selector de módulos */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 -mt-24 md:-mt-48 mb-4 w-full max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)] relative z-10">
                      <h4 className="text-[#33E8FF] font-black text-lg md:text-xl tracking-widest uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.6)] text-center">
                        ¿Qué MÓDULOS querés aprender?
                      </h4>
                      <div className="relative min-w-[280px]">
                        <select 
                          className="appearance-none w-full bg-[#33E8FF] text-slate-900 font-bold tracking-wider px-5 py-3 pr-12 rounded-xl border-2 border-cyan-400 outline-none hover:bg-[#5ae6ff] focus:bg-[#5ae6ff] focus:shadow-[0_0_20px_rgba(51,232,255,0.6)] transition-all duration-300 cursor-pointer text-sm"
                          value={moduloSeleccionado}
                          onChange={(e) => setModuloSeleccionado(e.target.value)}
                        >
                          <option value="" disabled className="font-bold text-white bg-slate-900">Seleccioná una opción...</option>
                          <option value="adicion-ventas" className="font-bold text-white bg-slate-900">ADICIÓN & VENTAS</option>
                          <option value="compras" className="font-bold text-white bg-slate-900">COMPRAS</option>
                          <option value="stock" className="font-bold text-white bg-slate-900">STOCK</option>
                          <option value="personal-auditorias" className="font-bold text-white bg-slate-900">PERSONAL & AUDITORIAS</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Detalle de Capacitación Seleccionada */}
                    {moduloSeleccionado && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl mx-auto -mt-2 mb-6 relative z-10 px-4 md:px-0"
                      >
                        <div className="text-center px-4">
                          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium">
                            Importe Modulo <span style={{ color: '#33E8FF' }} className="font-bold">{
                              moduloSeleccionado === 'adicion-ventas' ? 'VENTAS & ADICION' :
                              moduloSeleccionado === 'stock' ? 'STOCK' :
                              moduloSeleccionado === 'compras' ? 'COMPRAS' :
                              moduloSeleccionado === 'personal-auditorias' ? 'PERSONAL & AUDITORIAS' : ''
                            }</span> <span className="text-xl md:text-2xl font-black text-white drop-shadow-md">$95000 + IVA</span> (Remoto)
                          </p>
                          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium mt-2">
                            Sin limite de personas ni tiempo, el objetivo es adquirir el conocimiento.
                          </p>

                        </div>
                      </motion.div>
                    )}

                    {/* Lista de módulos adquiridos */}
                    {moduloSeleccionado && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl mx-auto mb-6 px-4 md:px-0 text-left bg-slate-900/40 p-6 rounded-xl border border-[#33E8FF]/20"
                      >
                        <h5 className="text-[#33E8FF] font-black text-xl mb-4 drop-shadow-[0_0_8px_rgba(51,232,255,0.6)]">
                          Módulos Adquiridos:
                        </h5>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-slate-200 font-bold text-base md:text-lg">
                          {(
                            moduloSeleccionado === 'adicion-ventas' ? ["Adición", "Punto de Venta", "Carta / Menu", "Ventas", "Tesorería", "Personal", "Seguridad", "Mantenimiento", "Configuraciones", "Caja Adición", "Caja Mayor", "Estadísticas", "Clientes", "Ctas Ctes Clientes"] :
                            moduloSeleccionado === 'stock' ? ["Insumos", "Stock", "Recetas de Artículos", "Recetas de Insumos", "Seguridad", "Mantenimiento", "Configuraciones", "Estadísticas"] :
                            moduloSeleccionado === 'compras' ? ["Ingreso de Órdenes de Compra", "Ingreso de Compras", "Órdenes de Pago", "Insumos", "Caja Adición", "Caja Mayor", "Seguridad", "Mantenimiento", "Configuraciones", "Estadísticas", "Balances", "Proveedores", "Cuentas Corrientes Proveedores"] :
                            moduloSeleccionado === 'personal-auditorias' ? ["Personal", "Seguridad", "Mantenimiento", "Configuraciones", "Estadísticas", "Claves del Sistema", "Caja Adición", "Ingreso del Personal"] : []
                          ).map((mod, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-[#33E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              {mod}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Modal / Lightbox para Instancia C */}
      <AnimatePresence>
        {mostrarInstanciaC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent p-4 md:p-6"
            onClick={() => {
              if (mostrarPreciosC) {
                setMostrarPreciosC(false);
              } else {
                setMostrarInstanciaC(false);
              }
            }}
          >
            {/* Botón Regresar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (mostrarPreciosC) {
                  setMostrarPreciosC(false);
                } else {
                  setMostrarInstanciaC(false);
                }
              }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[120] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#f97316] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#f97316] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl w-full flex flex-col items-center z-10 mt-2 h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">

                {/* ── Estado inicial: imagen hero + título ── */}
                {!mostrarPreciosC && (
                  <motion.div
                    key="selector-c"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col w-full max-w-5xl mx-auto pb-16 pt-12 md:pt-24 px-4"
                  >

                    {/* ── HERO Instancia C ── */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full"
                    >
                      {/* Imagen con glow y levitación */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 rounded-full bg-[#f97316] blur-[55px] opacity-25 animate-pulse pointer-events-none scale-110" />
                        <motion.img
                          src="/ir instancia C.png"
                          alt="Instancia C - Maxirest"
                          className="relative z-10 w-32 md:w-44 h-auto object-contain drop-shadow-[0_0_35px_rgba(249,115,22,0.7)]"
                          style={{ mixBlendMode: "screen", filter: "brightness(1.15) contrast(1.1)" }}
                          animate={{ y: [0, -9, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Textos futuristas */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
                        {/* Badge */}
                        <div className="flex items-center gap-2">
                          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#f97316] opacity-80" />
                          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]">
                            MAXIREST ONE - CRECIMIENTO
                          </span>
                          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#f97316] opacity-80" />
                        </div>

                        {/* Título */}
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">INSTANCIA </span>
                          <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg, #f97316 0%, #ea580c 40%, #f97316 100%)" }}
                          >
                            C
                          </span>
                        </h2>

                        <p className="text-[#f97316] font-bold text-lg md:text-xl tracking-wide drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]">
                          La revolución digital gastronómica.
                        </p>

                        {/* Separador decorativo */}
                        <div className="flex items-center gap-3 mt-1 w-full">
                          <div className="flex-1 h-px bg-gradient-to-r from-[#f97316]/40 to-transparent" />
                          <motion.svg
                            viewBox="0 0 24 24" fill="#f97316"
                            className="w-2.5 h-2.5 opacity-70 drop-shadow-[0_0_5px_rgba(249,115,22,1)]"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                          >
                            <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
                          </motion.svg>
                          <div className="flex-1 h-px bg-gradient-to-l from-[#f97316]/40 to-transparent" />
                        </div>
                      </div>
                    </motion.div>

                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

{/* Footer mínimo */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5">
        <p className="text-xs uppercase tracking-widest text-slate-600 font-bold mb-2">
          © 2026 MR Technology · Software ERP / SAAS Empresarial
        </p>
      </footer>

      {/* ── Modal TIPS DE AUDITORIA ── */}
      <AnimatePresence>
        {showTipsAuditoria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex flex-col bg-[#020617]/40 backdrop-blur-md overflow-y-auto"
          >
            <div className="pointer-events-none fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#33E8FF]/5 blur-[120px] rounded-full" />
            
            {/* Botón Regresar */}
            <button
              onClick={() => { setShowTipsAuditoria(false); setMostrarPropuesta(true); setTipsTab('intro'); setTipsObsOpen({}); }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[260] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-16 flex flex-col md:flex-row gap-8">
              
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-widest mb-6 border-b border-white/10 pb-4">
                  TIPS DE<br/><span className="text-[#33E8FF]">AUDITORÍA</span>
                </h2>
                
                {[
                  { id: 'intro', label: 'Introducción' },
                  { id: 'ventas', label: 'Ventas' },
                  { id: 'pedidos', label: 'Pedidos / Compras' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'caja', label: 'Caja' },
                  { id: 'limpieza', label: 'Limpieza' },
                  { id: 'encargado', label: 'Encargado' },
                  { id: 'rrhh', label: 'RRHH' },
                  { id: 'varios', label: 'Varios' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTipsTab(tab.id)}
                    className={`text-left px-5 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 border ${
                      tipsTab === tab.id
                        ? 'bg-[#33E8FF]/15 border-[#33E8FF]/60 text-[#33E8FF] shadow-[0_0_15px_rgba(51,232,255,0.2)]'
                        : 'border-transparent text-slate-400 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-10 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipsTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Contenido Dinámico por Tab */}
                    {tipsTab === 'intro' && (
                      <>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-4">INTRODUCCIÓN</h3>
                        <div className="flex flex-col gap-4 text-slate-300 text-sm md:text-base leading-relaxed">
                          <p>¿Sabes que puntos de dolor tiene tu local? Que porcentaje tenes cubierto con tips aplicados y que porcentaje en puntos de dolor que no has podido resolver.</p>
                          <p>La auditoria nos refleja con un rapido y dinamico check list que determines como esta parado el local actualmente.</p>
                          <p>Versión resumida de AUDITORIA para que entiendas el procedimiento y alcance de las mismas, la AUDITORIA full es desarrollada por personal de MR Tech idoneo y calificado para este tipo de actividades.</p>
                          <p>Una buena base de AUDITORIA y sus resultados, nos permite desarrollar la CONSULTORIA a MEDIDA para tu local.</p>
                        </div>
                      </>
                    )}

                    {tipsTab !== 'intro' && (
                      <>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-4 uppercase">{tipsTab.replace('-', ' ')}</h3>
                        <div className="flex flex-col gap-3">
                          {/* Lista de Checkboxes generada */}
                          {tipsTab === 'ventas' && ['Recepción de cliente.', 'Tiempo de atención y armado de mesas.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}
                          
                          {tipsTab === 'pedidos' && ['Circuito de pedidos.', 'Recepción de mercadería.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'stock' && ['Recetas y subrecetas.', 'Procesos de producción y elaboración de platos.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'caja' && ['Cierres X.', 'Gastos/Ingresos.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'limpieza' && ['Orden y limpieza cocina', 'Orden y limpieza barra/heladeras'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'encargado' && ['Preparación de salón.', 'Distribución de plazas.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'rrhh' && ['Entrevistas', 'Capacitación'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'varios' && ['Tareas de Administración', 'Comunicación (redes, pagina)'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                              <label className="inline-flex items-center gap-3 cursor-pointer select-none self-start bg-[#33E8FF]/10 border border-[#33E8FF]/30 rounded-full px-5 py-2.5 hover:bg-[#33E8FF]/20 transition-all">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 accent-[#33E8FF] cursor-pointer" 
                                  checked={tipsObsOpen[tipsTab] || false}
                                  onChange={(e) => setTipsObsOpen({ ...tipsObsOpen, [tipsTab]: e.target.checked })}
                                />
                                <span className="text-[#33E8FF] font-black text-[11px] uppercase tracking-widest">Agregar Observaciones</span>
                              </label>

                              <AnimatePresence>
                                {tipsObsOpen[tipsTab] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <textarea 
                                      maxLength={100} 
                                      placeholder="Escriba las observaciones aquí (máx 100 caracteres)..." 
                                      value={tipsObsText[tipsTab] || ''} onChange={(e) => setTipsObsText({ ...tipsObsText, [tipsTab]: e.target.value })} className="w-full h-24 bg-black/40 border border-[#33E8FF]/50 text-white p-4 rounded-xl font-medium text-sm focus:outline-none focus:border-[#33E8FF] focus:ring-1 focus:ring-[#33E8FF] transition-all resize-none"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                          {tipsTab === 'varios' && (
                            <div className="flex flex-col items-center justify-center py-10 gap-6">
                              <p className="text-slate-400 text-center max-w-lg leading-relaxed">
                                Fin de AUDITORIA !!!. Asegurate de haber completado bien el check list de ser correcto y recorda las observaciones de ser necesarias, un solo clic y tendras tu reporte de inmediato.
                              </p>
                              
                              <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                  <label className="text-xs text-[#33E8FF] font-bold uppercase tracking-widest mb-1 block">Empresa:</label>
                                  <input type="text" value={reportEmpresa} onChange={(e) => setReportEmpresa(e.target.value)} placeholder="Nombre de la empresa" className="w-full bg-black/40 border border-[#33E8FF]/30 text-white p-3 rounded-lg focus:outline-none focus:border-[#33E8FF] transition-all" />
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-[#33E8FF] font-bold uppercase tracking-widest mb-1 block">Responsable:</label>
                                  <input type="text" value={reportResponsable} onChange={(e) => setReportResponsable(e.target.value)} placeholder="Nombre del responsable" className="w-full bg-black/40 border border-[#33E8FF]/30 text-white p-3 rounded-lg focus:outline-none focus:border-[#33E8FF] transition-all" />
                                </div>
                              </div>
                              <button onClick={() => generatePDF('mrTech')} className="px-8 py-4 bg-[#33E8FF] text-slate-900 font-black rounded-xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)] hover:scale-105 hover:bg-white transition-all duration-300">
                                Generar Reporte Virtual
                              </button>

                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

{/* ── Modal AUDITORIA MR TECH ── */}

      <AnimatePresence>
        {showAuditoriaMRTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex flex-col bg-[#020617]/40 backdrop-blur-md overflow-y-auto"
          >
            <div className="pointer-events-none fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#33E8FF]/5 blur-[120px] rounded-full" />
            
            {/* Botón Regresar */}
            <button
              onClick={() => { setShowAuditoriaMRTech(false); setMostrarPropuesta(true); setMrTechTab('intro'); setMrTechObsOpen({}); }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[260] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-16 flex flex-col md:flex-row gap-8">
              
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-widest mb-6 border-b border-white/10 pb-4">
                  AUDITORÍA<br/><span className="text-[#33E8FF]">MR TECH</span>
                </h2>
                
                {[
                  { id: 'intro', label: 'Introducción' },
                  { id: 'ventas', label: 'Ventas' },
                  { id: 'pedidos', label: 'Pedidos / Compras' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'caja', label: 'Caja' },
                  { id: 'limpieza', label: 'Limpieza' },
                  { id: 'encargado', label: 'Encargado' },
                  { id: 'rrhh', label: 'RRHH' },
                  { id: 'varios', label: 'Varios' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setMrTechTab(tab.id)}
                    className={`text-left px-5 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 border ${
                      mrTechTab === tab.id
                        ? 'bg-[#33E8FF]/15 border-[#33E8FF]/60 text-[#33E8FF] shadow-[0_0_15px_rgba(51,232,255,0.2)]'
                        : 'border-transparent text-slate-400 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-10 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mrTechTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Contenido Dinámico por Tab */}
                    {mrTechTab === 'intro' && (
                      <>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-4">INTRODUCCIÓN</h3>
                        <div className="flex flex-col gap-4 text-slate-300 text-sm md:text-base leading-relaxed">
                          <p>¿Sabes que puntos de dolor tiene tu local? Que porcentaje tenes cubierto con tips aplicados y que porcentaje en puntos de dolor que no has podido resolver.</p>
                          <p>La auditoria nos refleja con un rapido y dinamico check list que determines como esta parado el local actualmente.</p>
                          <p>Versión resumida de AUDITORIA para que entiendas el procedimiento y alcance de las mismas, la AUDITORIA full es desarrollada por personal de MR Tech idoneo y calificado para este tipo de actividades.</p>
                          <p>Una buena base de AUDITORIA y sus resultados, nos permite desarrollar la CONSULTORIA a MEDIDA para tu local.</p>
                        </div>
                      </>
                    )}

                    {mrTechTab !== 'intro' && (
                      <>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-4 uppercase">{mrTechTab.replace('-', ' ')}</h3>
                        <div className="flex flex-col gap-3">
                          {/* Lista de Checkboxes generada */}
                          {mrTechTab === 'ventas' && ['Recepción de cliente.', 'Tiempo de atención y armado de mesas.', 'Inicio de venta, presentación', 'Conocimiento de carta.', 'Sugerencias del día.', 'Atención a la mesa y re-venta. (Continuo)', 'Cierre de venta, encuesta, QR Reseña, etc.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(tipsSelections[tipsTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setTipsSelections, tipsTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}
                          
                          {mrTechTab === 'pedidos' && ['Circuito de pedidos.', 'Recepción de mercadería.', 'Cuentas corrientes y pagos.', 'Producción y almacenamiento correcto.', 'Rotación y rotulado de mercadería.', 'Sugerencias del chef para rotar mercadería.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {mrTechTab === 'stock' && ['Recetas y subrecetas.', 'Procesos de producción y elaboración de platos.', 'Inventarios.', 'Mermas', 'Movimiento de stock/Remitos. (Desperdicios, platos devueltos, perdidas)', 'Menú personal/consumos internos.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {mrTechTab === 'caja' && ['Cierres X.', 'Gastos/Ingresos.', 'Pago personal eventual/completo.', 'Procedimientos de apertura y cierre de caja.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {mrTechTab === 'limpieza' && ['Orden y limpieza cocina', 'Orden y limpieza barra/heladeras', 'Limpieza y orden de salón', 'Limpieza baños.', 'Planillas para bromatología (Limpieza y temperaturas de heladera)'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {mrTechTab === 'encargado' && ['Preparación de salón.', 'Distribución de plazas.', 'Comunicación cocina/salón', 'Briefing', 'Función operativa.', 'Distribución y control de tareas.', 'Armado y comunicación de reservas'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {mrTechTab === 'rrhh' && ['Entrevistas', 'Capacitación', 'Sueldos e Incentivos', 'Manuales de Procedimientos', 'Incentivos', 'Uniformes', 'Organigrama', 'Evaluaciones'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {mrTechTab === 'varios' && ['Tareas de Administración', 'Comunicación (redes, pagina)'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" checked={(mrTechSelections[mrTechTab] || []).includes(item)} onChange={(e) => handleCheckboxChange(setMrTechSelections, mrTechTab, item, e.target.checked)} />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                              <label className="inline-flex items-center gap-3 cursor-pointer select-none self-start bg-[#33E8FF]/10 border border-[#33E8FF]/30 rounded-full px-5 py-2.5 hover:bg-[#33E8FF]/20 transition-all">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 accent-[#33E8FF] cursor-pointer" 
                                  checked={mrTechObsOpen[mrTechTab] || false}
                                  onChange={(e) => setMrTechObsOpen({ ...mrTechObsOpen, [mrTechTab]: e.target.checked })}
                                />
                                <span className="text-[#33E8FF] font-black text-[11px] uppercase tracking-widest">Agregar Observaciones</span>
                              </label>

                              <AnimatePresence>
                                {mrTechObsOpen[mrTechTab] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <textarea 
                                      maxLength={100} 
                                      placeholder="Escriba las observaciones aquí (máx 100 caracteres)..." 
                                      value={mrTechObsText[mrTechTab] || ''} onChange={(e) => setMrTechObsText({ ...mrTechObsText, [mrTechTab]: e.target.value })} className="w-full h-24 bg-black/40 border border-[#33E8FF]/50 text-white p-4 rounded-xl font-medium text-sm focus:outline-none focus:border-[#33E8FF] focus:ring-1 focus:ring-[#33E8FF] transition-all resize-none"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                          {mrTechTab === 'varios' && (
                            <div className="flex flex-col items-center justify-center py-10 gap-6">
                              <p className="text-slate-400 text-center max-w-lg leading-relaxed">
                                Fin de AUDITORIA !!!. Asegurate de haber completado bien el check list de ser correcto y recorda las observaciones de ser necesarias, un solo clic y tendras tu reporte de inmediato.
                              </p>
                              <button className="px-8 py-4 bg-[#33E8FF] text-slate-900 font-black rounded-xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)] hover:scale-105 hover:bg-white transition-all duration-300">
                                Generar Reporte Virtual
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Modal CONTRASEÑA MR TECH ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020617]/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900/60 border border-[#33E8FF]/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(51,232,255,0.15)] flex flex-col items-center gap-6 text-center"
            >
              <button
                onClick={() => { setShowPasswordModal(false); setMostrarPropuesta(true); setPasswordError(false); setMrTechPassword(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <div className="w-40 h-40 flex items-center justify-center mb-2 drop-shadow-[0_0_15px_rgba(51,232,255,0.5)]">
                <img src="/logo-ciberseguridad.jpg" alt="Ciberseguridad" className="w-full h-full object-contain" style={{ mixBlendMode: 'screen' }} />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-white tracking-widest uppercase">Acceso Restringido</h3>
                <p className="text-slate-400 text-sm">Ingrese la contraseña para acceder a la Auditoría MR Tech</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <input
                  type="password"
                  value={mrTechPassword}
                  onChange={(e) => { setMrTechPassword(e.target.value); setPasswordError(false); }}
                  placeholder="Contraseña..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (mrTechPassword === 'mrtech26&') {
                        setShowPasswordModal(false);
                        setShowAuditoriaMRTech(true);
                        setMrTechPassword('');
                        setPasswordError(false);
                      } else {
                        setPasswordError(true);
                      }
                    }
                  }}
                  className={`w-full bg-black/40 border ${passwordError ? 'border-red-500' : 'border-[#33E8FF]/50'} text-white p-4 rounded-xl font-medium text-center focus:outline-none focus:border-[#33E8FF] focus:ring-1 focus:ring-[#33E8FF] transition-all`}
                />
                <AnimatePresence>
                  {passwordError && (
                    <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-xs font-bold uppercase tracking-wider">Contraseña incorrecta</motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    if (mrTechPassword === 'mrtech26&') {
                      setShowPasswordModal(false);
                      setShowAuditoriaMRTech(true);
                      setMrTechPassword('');
                      setPasswordError(false);
                    } else {
                      setPasswordError(true);
                    }
                  }}
                  className="w-full mt-2 bg-[#33E8FF] hover:bg-white text-slate-900 font-black tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.4)]"
                >
                  Ingresar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>

  );
}