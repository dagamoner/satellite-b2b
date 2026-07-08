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
  const [showInfo, setShowInfo] = useState(true);
  const [mostrarInstanciaA, setMostrarInstanciaA] = useState(false);
  const [mostrarInstanciaB, setMostrarInstanciaB] = useState(false);
  const [mostrarPreciosB, setMostrarPreciosB] = useState(false);
  
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
                  src="/logo_eco.jpg.jpg"
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
          {/* Maxirest Info - Sin fondo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4 w-full cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setShowInfo(!showInfo)}
          >
            <div className={`bg-white rounded-full p-2 shadow-[0_0_25px_rgba(249,115,22,0.3)] shrink-0 flex items-center justify-center relative group transition-shadow duration-300 ${showInfo ? 'shadow-[0_0_40px_rgba(249,115,22,0.6)]' : ''}`}>
              <div className={`absolute inset-0 rounded-full bg-orange-500 blur-xl transition-opacity duration-300 ${showInfo ? 'opacity-80' : 'opacity-0 group-hover:opacity-60'}`}></div>
              <img
                src="/logo_maxirest.jpg"
                alt="Maxirest"
                className="h-24 w-24 md:h-28 md:w-28 object-contain rounded-full relative z-10"
              />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
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
            </div>
          </motion.div>

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
                <img src="/logo_eco.jpg.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent p-4 md:p-8"
            onClick={() => { setMostrarInstanciaB(false); setMostrarPreciosB(false); }}
          >
            {/* Botón Regresar */}
            <button 
              onClick={() => { setMostrarInstanciaB(false); setMostrarPreciosB(false); }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[120] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">
                REGRESAR
              </span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/logo_eco.jpg.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl w-full flex flex-col items-center justify-start z-10 mt-8 h-full max-h-[85vh] overflow-y-auto overflow-x-hidden custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[#33E8FF] font-black text-3xl md:text-4xl tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(51,232,255,0.8)] mb-8 shrink-0">
                INSTANCIA B - MAXIREST
              </h2>
              
              <div className={`flex flex-col ${mostrarPreciosB ? 'lg:flex-row' : ''} items-center lg:items-start justify-center gap-8 md:gap-12 w-full transition-all duration-700`}>
                
                {/* Columna de Imágenes (Opciones) */}
                <div className={`relative flex flex-col items-center justify-start gap-8 ${mostrarPreciosB ? 'w-full lg:w-[45%]' : 'w-full max-w-3xl'} transition-all duration-700`}>
                  
                  {/* 1. Licencias Maxirest */}
                  <div className="relative w-full group flex justify-center">
                    <img
                      src="/Licencias Maxirest.png"
                      alt="Licencias Maxirest"
                      onClick={() => setMostrarPreciosB(mostrarPreciosB === 'licencias' ? false : 'licencias')}
                      className={`w-full h-auto max-h-[25vh] lg:max-h-[30vh] object-contain cursor-pointer transition-all duration-500 hover:scale-105 ${mostrarPreciosB === 'licencias' ? 'drop-shadow-[0_0_40px_rgba(51,232,255,0.8)] scale-105' : 'drop-shadow-[0_0_20px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(51,232,255,0.6)]'}`}
                      style={{ mixBlendMode: 'screen' }}
                    />
                    {!mostrarPreciosB && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-2 border-cyan-400 rounded-2xl pointer-events-none opacity-50"
                        style={{ filter: 'blur(6px)' }}
                      />
                    )}
                  </div>

                  {/* 2. Implementaciones Maxirest */}
                  <div className="relative w-full group flex justify-center">
                    <img
                      src="/Implementaciones Maxirest.png"
                      alt="Implementaciones Maxirest"
                      onClick={() => setMostrarPreciosB(mostrarPreciosB === 'implementaciones' ? false : 'implementaciones')}
                      className={`w-full h-auto max-h-[25vh] lg:max-h-[30vh] object-contain cursor-pointer transition-all duration-500 hover:scale-105 ${mostrarPreciosB === 'implementaciones' ? 'drop-shadow-[0_0_40px_rgba(51,232,255,0.8)] scale-105' : 'drop-shadow-[0_0_20px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(51,232,255,0.6)]'}`}
                      style={{ mixBlendMode: 'screen' }}
                    />
                  </div>

                  {/* 3. Capacitaciones MAXIREST */}
                  <div className="relative w-full group flex justify-center">
                    <img
                      src="/Capacitaciones MAXIREST.png"
                      alt="Capacitaciones MAXIREST"
                      onClick={() => setMostrarPreciosB(mostrarPreciosB === 'capacitaciones' ? false : 'capacitaciones')}
                      className={`w-full h-auto max-h-[25vh] lg:max-h-[30vh] object-contain cursor-pointer transition-all duration-500 hover:scale-105 ${mostrarPreciosB === 'capacitaciones' ? 'drop-shadow-[0_0_40px_rgba(51,232,255,0.8)] scale-105' : 'drop-shadow-[0_0_20px_rgba(51,232,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(51,232,255,0.6)]'}`}
                      style={{ mixBlendMode: 'screen' }}
                    />
                  </div>
                </div>

                {/* Panel Derecho de Detalles */}
                <AnimatePresence mode="wait">
                  {mostrarPreciosB === 'licencias' && (
                    <motion.div 
                      key="licencias-panel"
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="w-full lg:w-[55%] flex flex-col gap-6 mt-8 lg:mt-0"
                    >
                      {/* Tarjeta FULL-PRO */}
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 md:p-8 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(51,232,255,0.25)] transition-shadow duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#33E8FF]/30 transition-all duration-500 pointer-events-none" />
                        <h4 className="text-2xl md:text-3xl font-black text-[#33E8FF] mb-3 tracking-widest drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">FULL-PRO</h4>
                        <p className="text-slate-300 text-sm md:text-base mb-6 font-medium tracking-wide leading-relaxed">
                          La versión FULL brinda todos los Módulos y funcionalidades completas del software.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                            <span className="text-white font-bold text-lg md:text-xl">Sistema MAXIREST BASE</span>
                            <span className="text-orange-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_14px_rgba(249,115,22,0.7)]">$130.899</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-white/80 font-medium text-base md:text-lg">Terminal Adicional (cada una)</span>
                            <span className="text-orange-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_14px_rgba(249,115,22,0.7)]">$16.854</span>
                          </div>
                        </div>

                        <p className="mt-5 text-xs font-semibold tracking-wide leading-snug" style={{ color: '#33E8FF' }}>
                          * El valor manifestado es Mensual en concepto de alquiler del software.
                        </p>
                      </div>

                      {/* Tarjeta XPRESS */}
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 md:p-8 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(51,232,255,0.25)] transition-shadow duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#33E8FF]/30 transition-all duration-500 pointer-events-none" />
                        <h4 className="text-2xl md:text-3xl font-black text-[#33E8FF] mb-3 tracking-widest drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">XPRESS</h4>
                        <p className="text-slate-300 text-sm md:text-base mb-6 font-medium tracking-wide leading-relaxed">
                          La versión XPRESS brinda todos los Módulos y funcionalidades completas del software para operar como Punto de Venta. No cuenta con Compras ni Stock.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                            <span className="text-white font-bold text-lg md:text-xl">Sistema MAXIREST BASE</span>
                            <span className="text-orange-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_14px_rgba(249,115,22,0.7)]">$85.860</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-white/80 font-medium text-base md:text-lg">Terminal Adicional (cada una)</span>
                            <span className="text-orange-400 font-black text-2xl md:text-3xl drop-shadow-[0_0_14px_rgba(249,115,22,0.7)]">$11.236</span>
                          </div>
                        </div>

                        <p className="mt-5 text-xs font-semibold tracking-wide leading-snug" style={{ color: '#33E8FF' }}>
                          * El valor manifestado es Mensual en concepto de alquiler del software.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {mostrarPreciosB === 'implementaciones' && (
                    <motion.div 
                      key="implementaciones-panel"
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="w-full lg:w-[55%] flex flex-col gap-6 mt-8 lg:mt-0"
                    >
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] min-h-[400px]">
                        <h4 className="text-2xl md:text-3xl font-black text-[#33E8FF] mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">IMPLEMENTACIONES</h4>
                        <p className="text-slate-300 text-lg font-medium tracking-wide">Detalle de implementaciones disponible próximamente...</p>
                      </div>
                    </motion.div>
                  )}

                  {mostrarPreciosB === 'capacitaciones' && (
                    <motion.div 
                      key="capacitaciones-panel"
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="w-full lg:w-[55%] flex flex-col gap-6 mt-8 lg:mt-0"
                    >
                      <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] min-h-[400px]">
                        <h4 className="text-2xl md:text-3xl font-black text-[#33E8FF] mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">CAPACITACIONES</h4>
                        <p className="text-slate-300 text-lg font-medium tracking-wide">Planes de capacitación disponibles próximamente...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer mínimo */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5">
        {/* GitHub Repository Link */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <a
            href="https://github.com/dagamoner/satellite-b2b"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#33E8FF]/40 transition-all duration-300"
            title="Repositorio GitHub — satellite-b2b"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-[#33E8FF] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-mono tracking-wider text-slate-400 group-hover:text-[#33E8FF] transition-colors duration-300">
              https://github.com/dagamoner/satellite-b2b
            </span>
          </a>
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">
          © 2026 MR Technology · Software ERP / SAAS Empresarial
        </p>
      </footer>
    </main>
  );
}