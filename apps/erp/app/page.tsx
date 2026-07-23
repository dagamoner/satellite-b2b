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
  const [mostrarInstanciaA, setMostrarInstanciaA] = useState(false);
  const [mostrarInstanciaB, setMostrarInstanciaB] = useState(false);
  const [mostrarPreciosB, setMostrarPreciosB] = useState<string | boolean>(false);
  const [moduloSeleccionado, setModuloSeleccionado] = useState("");
  
  const isModalOpen = mostrarInstanciaA || mostrarInstanciaB;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 font-sans overflow-x-hidden relative">

      {/* Fondo universo */}
      <SpaceBackground />
      <SatelliteOrbit isHidden={isModalOpen} />

      {/* Tierra — esquina superior derecha */}
      <motion.div
        className="fixed top-[-16vw] right-[-16vw] z-[1] pointer-events-none"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: isModalOpen ? 0 : 0.6, rotate: 360 }}
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
        animate={{ opacity: isModalOpen ? 0 : 0.07 }}
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
                    className={`bg-white rounded-full p-2 shadow-[0_0_25px_rgba(249,115,22,0.3)] flex items-center justify-center relative cursor-pointer transition-all duration-300 hover:scale-105 ${showInfo ? 'shadow-[0_0_40px_rgba(249,115,22,0.6)]' : ''}`}
                    onClick={() => {
                      setShowInfo(!showInfo);
                      setShowAuditoria(false);
                    }}
                  >
                    <img
                      src="/logo_maxirest.jpg"
                      alt="Maxirest"
                      className="h-24 w-24 md:h-28 md:w-28 object-contain rounded-full relative z-10"
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
                      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6 w-full"
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
                            MAXIREST · SUITE EMPRESARIAL
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

                        {/* Subtítulo */}
                        <p className="text-white/75 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                          Gestión Full · Multi-sede · Control Total
                        </p>

                        {/* Descripción */}
                        <p className="text-slate-300 text-xs leading-relaxed max-w-sm font-medium tracking-wide mt-1">
                          La solución más avanzada de <span className="text-[#33E8FF] font-black">MAXIREST</span> para operaciones gastronómicas de alto volumen. Licencias, implementaciones y capacitaciones integradas.
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

                    {/* Licencias (Orientado a la Izquierda) */}
                    <motion.div 
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                      className="relative w-full md:w-[88%] flex justify-start self-start group z-10"
                    >
                      <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity duration-500 rounded-full" />
                      <img
                        src="/Licencias Maxirest.png"
                        alt="Licencias Maxirest"
                        onClick={() => setMostrarPreciosB('licencias')}
                        className="w-full h-auto max-h-[30vh] object-contain object-left cursor-pointer transition-all duration-500 hover:scale-[1.03] drop-shadow-[0_0_15px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_35px_rgba(51,232,255,0.8)] relative z-10"
                        style={{ mixBlendMode: 'screen' }}
                      />
                    </motion.div>

                    {/* Implementaciones (Orientado al Medio) */}
                    <motion.div 
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                      className="relative w-full md:w-[88%] flex justify-center self-center group -mt-4 md:-mt-10 z-20"
                    >
                      <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity duration-500 rounded-full" />
                      <img
                        src="/Implementaciones Maxirest.png"
                        alt="Implementaciones Maxirest"
                        onClick={() => setMostrarPreciosB('implementaciones')}
                        className="w-full h-auto max-h-[30vh] object-contain object-center cursor-pointer transition-all duration-500 hover:scale-[1.03] drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:drop-shadow-[0_0_35px_rgba(249,115,22,0.8)] relative z-10"
                        style={{ mixBlendMode: 'screen' }}
                      />
                    </motion.div>

                    {/* Capacitaciones (Orientado a la Derecha) */}
                    <motion.div 
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
                      className="relative w-full md:w-[88%] flex justify-end self-end group -mt-4 md:-mt-10 z-30"
                    >
                      <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity duration-500 rounded-full" />
                      <img
                        src="/Capacitaciones MAXIREST.png"
                        alt="Capacitaciones MAXIREST"
                        onClick={() => setMostrarPreciosB('capacitaciones')}
                        className="w-full h-auto max-h-[30vh] object-contain object-right cursor-pointer transition-all duration-500 hover:scale-[1.03] drop-shadow-[0_0_15px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_35px_rgba(51,232,255,0.8)] relative z-10"
                        style={{ mixBlendMode: 'screen' }}
                      />
                    </motion.div>
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
                          <p className="mt-4 text-[#33E8FF] font-black text-sm md:text-base tracking-wider uppercase text-center">
                            ACTIVIDADES IT DESARROLLADAS DE MANERA PRESENCIAL.
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
                          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium mt-2">
                            Si desea dicha capacitaciòn de manera <span style={{ color: '#33E8FF' }} className="font-bold drop-shadow-[0_0_8px_rgba(51,232,255,0.6)]">PRESENCIAL</span> se debe sumar <span className="text-xl md:text-2xl font-black text-white drop-shadow-md">$50000 + IVA</span>.
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

                    {/* Fila Horizontal de Capacitaciones */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full max-w-7xl mx-auto items-center mt-2">
                      {[
                        { src: "/CAJA ADICION.png", alt: "Caja Adicion" },
                        { src: "/CAJA MAYOR.png", alt: "Caja Mayor" },
                        { src: "/PUNTO DE VENTA.png", alt: "Punto de Venta" },
                        { src: "/3. Carta menu.png", alt: "Carta menu" },
                        { src: "/4. Ventas.png", alt: "Ventas" },
                        { src: "/5. Tesoreria.png", alt: "Tesoreria" },
                        { src: "/6. Compras.png", alt: "Compras" },
                        { src: "/7. Balances.png", alt: "Balances" },
                        { src: "/8. Stock.png", alt: "Stock" },
                        { src: "/9. Personal.png", alt: "Personal" },
                        { src: "/10. Seguridad.png", alt: "Seguridad" },
                        { src: "/11. mANTENIMIENTO.png", alt: "Mantenimiento" },
                        { src: "/12. Configuraciones.png", alt: "Configuraciones" },
                        { src: "/13. Caja.png", alt: "Caja" },
                        { src: "/14. Estadisticas.png", alt: "Estadisticas" },
                        { src: "/15. Auditorias.png", alt: "Auditorias" },
                        { src: "/16. Claves del Sistema.png", alt: "Claves del Sistema" },
                        { src: "/PROVEEDORES.png", alt: "Proveedores" },
                        { src: "/CLIENTES.png", alt: "Clientes" },
                        { src: "/INSUMOS.png", alt: "Insumos" },
                        { src: "/RECETAS DE INSUMOS.png", alt: "Recetas de Insumos" },
                        { src: "/RECETAS DE ARTICULOS.png", alt: "Recetas de Artículos" },
                        { src: "/ctas ctes clientes.png", alt: "Ctas Ctes Clientes" },
                      ].filter(item => {
                        if (moduloSeleccionado === 'adicion-ventas') {
                          return [
                            "Caja Adicion", "Punto de Venta", "Carta menu", "Ventas", "Tesoreria",
                            "Personal", "Seguridad", "Mantenimiento", "Configuraciones",
                            "Caja Mayor", "Estadisticas", "Clientes", "Ctas Ctes Clientes"
                          ].includes(item.alt);
                        } else if (moduloSeleccionado === 'stock') {
                          return [
                            "Insumos", "Stock", "Recetas de Artículos", "Recetas de Insumos",
                            "Seguridad", "Mantenimiento", "Configuraciones", "Estadisticas"
                          ].includes(item.alt);
                        } else if (moduloSeleccionado === 'compras') {
                          return [
                            "Compras", "Insumos", "Caja Adicion", "Caja Mayor", 
                            "Seguridad", "Mantenimiento", "Configuraciones", "Estadisticas", 
                            "Balances", "Proveedores"
                          ].includes(item.alt);
                        } else if (moduloSeleccionado === 'personal-auditorias') {
                          return [
                            "Personal", "Seguridad", "Mantenimiento", "Configuraciones", 
                            "Estadisticas", "Claves del Sistema", "Caja Adicion", "Auditorias"
                          ].includes(item.alt);
                        }
                        return true;
                      }).map((item, idx) => (
                        <div key={idx} className="relative group w-[80%] sm:w-[45%] md:w-[30%] lg:w-[22%] flex justify-center p-3">
                          <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-xl" />
                          <div className="w-full flex justify-center">
                            <img
                              src={item.src}
                              alt={item.alt}
                              className="w-full h-auto object-contain transition-all duration-500 hover:scale-105 rounded-xl border-2 border-[#33E8FF] shadow-[0_0_15px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.9)]"
                              style={{ mixBlendMode: 'screen', filter: 'brightness(1.1) contrast(1.1)' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
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
        <a 
          href="https://github.com/dagamoner/satellite-b2b" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-[#33E8FF] hover:text-white transition-colors duration-300 font-medium"
        >
          https://github.com/dagamoner/satellite-b2b
        </a>
      </footer>
    </main>
  );
}