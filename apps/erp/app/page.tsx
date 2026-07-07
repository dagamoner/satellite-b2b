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
const SatelliteOrbit = () => (
  <motion.div
    className="fixed z-[5] opacity-55"
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
  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 font-sans overflow-x-hidden relative">

      {/* Fondo universo */}
      <SpaceBackground />
      <SatelliteOrbit />

      {/* Tierra — esquina superior derecha */}
      <motion.div
        className="fixed top-[-16vw] right-[-16vw] z-[1] pointer-events-none"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.6, rotate: 360 }}
        transition={{
          opacity: { duration: 90, ease: [0.04, 0, 0.16, 1] },
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
        transition={{ duration: 2 }}
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
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* ── Encabezado sticky ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700">
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
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 max-w-3xl"
        >
          {/* Maxirest Info - Sin fondo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 w-full cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setShowInfo(true)}
          >
            <div className="bg-white rounded-full p-2 shadow-[0_0_25px_rgba(51,232,255,0.3)] shrink-0 flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
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
                <div className="flex flex-col items-center w-full max-w-5xl mb-12 mt-4 px-4">
                  <h3 className="text-[#33E8FF] font-black text-xl md:text-2xl text-center tracking-widest uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.5)] mb-8">
                    La solución más completa para negocios gastronómicos
                  </h3>
                  <img
                    src="/Instancias Maxirest.png"
                    alt="Instancias Maxirest"
                    className="w-full object-contain rounded-xl drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  />
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

      {/* Footer mínimo */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5">
        <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">
          © 2026 MR Technology · Software ERP / SAAS Empresarial
        </p>
      </footer>
    </main>
  );
}