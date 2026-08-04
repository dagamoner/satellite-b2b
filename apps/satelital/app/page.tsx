"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import LeadFormModal from "../components/LeadFormModal";
import CoverageSearch from "../components/CoverageSearch";
import { SunnySkyBackground } from "../components/SunnySkyBackground";
import { useTheme } from "next-themes";

const SpaceBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('space-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); // sin alpha:false para máxima compatibilidad
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // redibujar fondo negro inmediatamente al redimensionar
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    // Generador de Estrellas
    const stars = Array.from({length: 600}).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      delta: (Math.random() * 0.015) + 0.005,
    }));

    // Animación del "Tren" de Starlink
    const trainAngle = (Math.PI / 180) * 15;
    const trainSpeed = 1.2;
    let trainX = -200;
    let trainY = canvas.height * 0.3;
    
    const trainNodes = Array.from({length: 22}).map((_, i) => ({
      offsetX: -i * 18 * Math.cos(trainAngle),
      offsetY: -i * 18 * Math.sin(trainAngle),
    }));

    // Satélites sueltos en diversas órbitas
    const satellites = Array.from({length: 15}).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.8,
    }));

    let animationFrameId: number;
    let lastTime = 0;

    const render = (time: number) => {
      // Throttle: máximo ~60fps
      if (time - lastTime < 16) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;

      // Fondo oscuro con trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Estrellas titilantes
      stars.forEach(star => {
        star.alpha += star.delta;
        if (star.alpha <= 0.1 || star.alpha >= 1) star.delta = -star.delta;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha.toFixed(2)})`;
        ctx.fill();
      });

      // Satélites individuales
      satellites.forEach(sat => {
        sat.x += Math.cos(sat.angle) * sat.speed;
        sat.y += Math.sin(sat.angle) * sat.speed;
        if (sat.x > canvas.width) sat.x = 0;
        if (sat.x < 0) sat.x = canvas.width;
        if (sat.y > canvas.height) sat.y = 0;
        if (sat.y < 0) sat.y = canvas.height;
        
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 240, 255, 0.8)';
        ctx.fill();
      });

      // Tren de Starlink
      trainX += Math.cos(trainAngle) * trainSpeed;
      trainY += Math.sin(trainAngle) * trainSpeed;
      
      if (trainX > canvas.width + 600) {
        trainX = -500;
        trainY = Math.random() * canvas.height * 0.7;
      }

      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';
      
      trainNodes.forEach(node => {
        const nx = trainX + node.offsetX;
        const ny = trainY + node.offsetY;
        ctx.beginPath();
        ctx.arc(nx, ny, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      
      // Línea del tren
      const firstNode = trainNodes[0];
      const lastNode = trainNodes[trainNodes.length - 1];
      if (firstNode && lastNode) {
        ctx.beginPath();
        ctx.moveTo(trainX + firstNode.offsetX, trainY + firstNode.offsetY);
        ctx.lineTo(
          trainX + lastNode.offsetX,
          trainY + lastNode.offsetY
        );
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Dibujar fondo negro antes del primer frame para evitar flash blanco
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      id="space-canvas" 
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', display: 'block' }}
    />
  );
}

import { motion, AnimatePresence } from "framer-motion";

const SatelliteOrbit = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      className="fixed z-[5] opacity-55 md:opacity-45"
      animate={{
        x: ['-30vw', '50vw', '120vw', '70vw', '-30vw'],
        y: ['20vh', '-10vh', '60vh', '110vh', '20vh'],
        rotate: [0, 30, -15, 10, 0],
        scale: [0.4, 0.6, 0.3, 0.5, 0.4],
      }}
      transition={{
        duration: 60,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{ top: 0, left: 0 }}
    >
      <div
        onClick={onClick}
        className="absolute inset-0 z-10"
        style={{ cursor: 'crosshair', background: 'transparent' }}
      />
      <img 
        src="/satelite.png" 
        alt="" 
        className="w-24 md:w-40 h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.5)] select-none"
        style={{
          mixBlendMode: 'screen',
          filter: 'brightness(1.2) contrast(1.5)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
};

export default function MarketingPage() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    type: "HARDWARE" | "PLAN" | "QUOTE" | "INFO";
    title: string;
    description: string;
  } | null>(null);

  const openLeadModal = (type: any, title: string, description: string) => {
    setSelectedPlan({ type, title, description });
    setIsLeadModalOpen(true);
  };
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoGlow, setLogoGlow] = useState<string | null>(null);
  const [hoveredAntenna, setHoveredAntenna] = useState<string | null>(null);
  const [satelliteFlash, setSatelliteFlash] = useState(false);
  const [earthFlash, setEarthFlash] = useState(false);
  const orbitStartRef = useRef<number>(0);

  const triggerConjunction = useCallback(() => {
    setSatelliteFlash(true);
    setEarthFlash(true);
    setTimeout(() => { setSatelliteFlash(false); setEarthFlash(false); }, 1800);
  }, []);

  const handleSatelliteClick = () => {
    if (satelliteFlash) return;
    triggerConjunction();
  };

  const handleEarthClick = () => {
    if (earthFlash) return;
    triggerConjunction();
  };

  useEffect(() => {
    setMounted(true);
    orbitStartRef.current = Date.now();
  }, []);

  // Automatic effect: when satellite passes Earth zone (~42s into each 120s cycle)
  useEffect(() => {
    if (!mounted || theme === 'light') return;

    const CYCLE_MS = 60_000;
    // Satellite is near the Earth (upper-right) at ~21s into cycle, again at ~42.5s (return arc)
    const TRIGGER_OFFSETS = [21_000, 42_500];

    const scheduleAll = () => {
      const elapsed = Date.now() - orbitStartRef.current;
      const phase = elapsed % CYCLE_MS;
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      TRIGGER_OFFSETS.forEach(offset => {
        let delay = offset - phase;
        if (delay <= 0) delay += CYCLE_MS;
        timeouts.push(setTimeout(() => {
          triggerConjunction();
        }, delay));
      });

      // Re-schedule after one full cycle
      const reschedule = setTimeout(scheduleAll, CYCLE_MS);
      timeouts.push(reschedule);

      return timeouts;
    };

    const timeouts = scheduleAll();
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [mounted, theme, triggerConjunction]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative transition-colors duration-500">
      
      {/* Nuestro interactivo fondo del espacio o cielo */}
      {mounted && theme === "light" ? <SunnySkyBackground /> : <SpaceBackground />}

      {/* Satélite orbitando aleatoriamente */}
      {mounted && theme !== "light" && <SatelliteOrbit onClick={handleSatelliteClick} />}

      {/* Flash destello verde petróleo al hacer clic en el satélite */}
      <AnimatePresence>
        {satelliteFlash && (
          <motion.div
            key="satellite-flash"
            className="fixed inset-0 pointer-events-none z-[99]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: satelliteFlash ? 0.2 : 0.9,
                ease: satelliteFlash ? 'easeIn' : 'easeOut'
              }
            }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,140,100,0.95) 0%, rgba(0,110,80,0.7) 28%, rgba(0,70,50,0.4) 55%, transparent 85%)',
              mixBlendMode: 'screen'
            }}
          />
        )}
      </AnimatePresence>

      {/* Tierra - Vista desde el espacio, aparece lentamente con el tiempo */}
      {mounted && theme !== "light" && (
        <>
          <motion.div
            className="fixed top-[-16vw] right-[-16vw] z-[1] pointer-events-none"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 0.6, rotate: 360 }}
            transition={{
              opacity: { duration: 90, ease: [0.04, 0, 0.16, 1] },
              rotate: { duration: 600, ease: "linear", repeat: Infinity },
            }}
            style={{ width: '52vw', maxWidth: '660px' }}
          >
            <img
              src="/tierra.png"
              alt=""
              className="w-full h-full object-contain"
              style={{
                mixBlendMode: 'screen',
                filter: 'brightness(0.7) saturate(1.3) contrast(1.0)',
                WebkitMaskImage: 'radial-gradient(circle 48% at 50% 50%, black 30%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 68%, transparent 82%)',
                maskImage: 'radial-gradient(circle 48% at 50% 50%, black 30%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 68%, transparent 82%)',
              }}
            />
          </motion.div>
          {/* Hit area independiente para el clic en la Tierra */}
          <div
            className="fixed z-[10]"
            style={{
              top: '-16vw',
              right: '-16vw',
              width: '52vw',
              maxWidth: '660px',
              aspectRatio: '1',
              cursor: 'crosshair',
              borderRadius: '50%',
            }}
            onClick={handleEarthClick}
          />
        </>
      )}

      {/* Destello Solar — cuando el satélite cruza la Tierra */}
      <AnimatePresence>
        {earthFlash && (
          <motion.div
            key="earth-flash"
            className="fixed inset-0 pointer-events-none z-[98]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 2, times: [0, 0.08, 0.5, 0.78, 1], ease: 'easeInOut' }}
          >
            {/* Capa 1: Marea de calor dorado inunda TODA la pantalla */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 200% 200% at 95% -5%, rgba(255,210,30,0.75) 0%, rgba(255,160,10,0.5) 25%, rgba(220,110,0,0.28) 50%, rgba(180,70,0,0.12) 72%, transparent 90%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 2: Rayo solar largo diagonal que barre toda la pantalla */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(215deg, rgba(255,240,80,0.65) 0%, rgba(255,200,30,0.45) 20%, rgba(255,150,10,0.22) 45%, rgba(200,90,0,0.08) 68%, transparent 85%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 3: Segundo rayo con ángulo diferente */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(195deg, rgba(255,250,120,0.5) 0%, rgba(255,210,60,0.3) 28%, rgba(255,150,10,0.12) 55%, transparent 78%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 4: Tercer rayo ancho y suave */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(230deg, rgba(255,220,50,0.4) 0%, rgba(255,180,20,0.2) 35%, transparent 65%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 5: Calor ambiental suave que llega hasta los rincones */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 160% 120% at 85% 5%, rgba(255,180,20,0.22) 0%, rgba(220,120,0,0.1) 45%, transparent 75%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 6: Núcleo solar — punto de origen ultra caliente */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle 14% at 97% -2%, rgba(255,255,255,1) 0%, rgba(255,255,180,0.9) 15%, rgba(255,240,60,0.6) 40%, transparent 70%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 7: Corona solar alrededor del núcleo */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle 28% at 97% -2%, rgba(255,220,50,0.55) 0%, rgba(255,170,20,0.3) 40%, transparent 75%)',
              mixBlendMode: 'screen'
            }} />
            {/* Capa 8: Halo de la Tierra iluminado — corona dorada brillante */}
            <div style={{
              position: 'absolute',
              top: '-16vw',
              right: '-16vw',
              width: '52vw',
              maxWidth: '660px',
              aspectRatio: '1',
              borderRadius: '50%',
              background: 'transparent',
              boxShadow: '0 0 25px 10px rgba(255,230,70,0.9), 0 0 70px 30px rgba(255,180,20,0.7), 0 0 140px 65px rgba(255,130,10,0.4), 0 0 260px 110px rgba(200,80,0,0.18)',
              mixBlendMode: 'screen'
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sello de Agua Eliminado */}

      {/* Halo de luz adicional sobre el fondo, no invasivo */}
      <div className="fixed top-[-20%] left-[-10%] w-[40vw] max-w-[800px] h-[30vw] max-h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] max-w-[600px] h-[40vw] max-h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

            {/* Navigation (Sticky Header) */}
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

      <LeadFormModal 
         isOpen={isLeadModalOpen} 
         onClose={() => setIsLeadModalOpen(false)} 
         planInfo={selectedPlan} 
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-16 md:pt-10 md:pb-32 px-3 sm:px-6 flex flex-col items-center text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Centered Navigation Links & Portals */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12 mt-16 sm:mt-24 mb-12 sm:mb-24 px-2 sm:px-4 w-full max-w-6xl">
            {/* Nav Links */}
            {["antenas", "planes", "consultoria"].map((id, index) => (
              <motion.a 
                key={id}
                href={`#${id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ 
                  scale: 0.94,
                  y: 1,
                  filter: `drop-shadow(0 0 15px ${id === 'antenas' ? '#3b82f6' : id === 'planes' ? '#14b8a6' : '#a855f7'}) brightness(1.2)`
                }}
                className="group flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-85 transition-opacity duration-300" style={{ backgroundColor: id === 'antenas' ? '#3b82f6' : id === 'planes' ? '#14b8a6' : '#a855f7' }} />
                  <img src={id === 'antenas' ? '/equipos.png' : `/nav_${id === 'planes' ? 'planes' : 'servicios'}.png`} alt={id} className="w-auto h-16 sm:h-24 md:h-28 object-contain relative z-10 transition-all duration-500 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)]" />
                </div>
                <span className={`text-[10px] sm:text-sm md:text-base font-black uppercase tracking-widest ${id === 'antenas' ? 'text-blue-400' : id === 'planes' ? 'text-teal-400' : 'text-purple-400'} drop-shadow-md`}>
                  {id === 'antenas' ? 'Equipos' : id === 'planes' ? 'Planes' : 'Servicios IT'}
                </span>
              </motion.a>
            ))}

            <div className="w-px h-24 bg-white/10 hidden md:block mx-4" /> {/* Separator */}

            {/* Portal Clientes */}
            <motion.a 
                href="https://clientes.mrtechnology.it.com" 
                className="group flex flex-col items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.94, y: 1, filter: "drop-shadow(0 0 15px #3b82f6) brightness(1.2)" }}
            >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-85 transition-opacity duration-300 bg-blue-500" />
                  <img src="/card_portal.png" alt="Portal" className="w-auto h-14 sm:h-20 md:h-24 object-contain relative z-10 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)] transition-all duration-500" />
                </div>
                <span className="text-[10px] sm:text-sm md:text-base font-black uppercase tracking-widest text-blue-400 drop-shadow-md">Portal Clientes</span>
            </motion.a>

            {/* Portal Admin */}
            <motion.a 
                href="https://admin.mrtechnology.it.com" 
                className="group flex flex-col items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.94, y: 1, filter: "drop-shadow(0 0 15px #6366f1) brightness(1.2)" }}
            >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-85 transition-opacity duration-300 bg-indigo-500" />
                  <img src="/card_noc.png" alt="Soporte" className="w-auto h-14 sm:h-20 md:h-24 object-contain relative z-10 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)] transition-all duration-500" />
                </div>
                <span className="text-[10px] sm:text-sm md:text-base font-black uppercase tracking-widest text-indigo-400 drop-shadow-md">Portal Admin</span>
            </motion.a>
          </div>

          <h1 id="conectividad-sin-fronteras" className="scroll-mt-32 text-xl sm:text-2xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-8 max-w-6xl leading-[1.2] md:leading-[1.1] text-white drop-shadow-lg px-2">
            <span className="text-[#33E8FF]">Conectividad</span> sin fronteras con <span className="text-[#33E8FF]">Starlink</span> para tu empresa
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-3xl mb-6 md:mb-12 leading-relaxed font-bold px-4 md:px-0">
            Internet satelital de alta velocidad y máxima estabilidad. <span className="text-[#33E8FF]">Equipamiento</span> desde <span className="text-[#33E8FF]">$300.000</span> y <span className="text-[#33E8FF]">abonos</span> desde <span className="text-[#33E8FF]">$90.000</span> <span className="text-[#33E8FF]">FINANCIACION PROPIA</span>. Respaldado por soporte técnico presencial en toda Mendoza.
          </p>

          <CoverageSearch onCoverageConfirmed={(address) => openLeadModal("INFO", "Consulta por Cobertura", `Solicito información para instalación satelital en la dirección validada: ${address}`)} />

        </motion.div>


      </section>

      

      {/* Hardware Section */}
      <section id="antenas" className="relative z-10 py-10 bg-white/40 dark:bg-[#020617]/40 backdrop-blur-xl border-y border-slate-300/80 dark:border-slate-800/80 px-3 sm:px-6 -mt-28">
         <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
         <div className="max-w-7xl mx-auto">
            <h2 className="text-lg md:text-xl font-extrabold mb-10 text-center text-slate-900 dark:text-white drop-shadow-xl">
              Que tipo de proyecto queres realizar ? <span className="text-pink-500">HOGAREÑO, RESIDENCIAL, EMPRESA, MOVILIDAD</span> y en base al mismo podes elegir tu <span className="text-blue-500">ANTENA A MEDIDA</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" onMouseLeave={() => setHoveredAntenna(null)}>
               <AnimatePresence mode="popLayout">
               {/* Mini X */}
               {(!hoveredAntenna || hoveredAntenna === 'mini-x') && (
                  <motion.div key="mini-x-card" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, display: "none" }} transition={{ duration: 0.3 }} className="md:col-span-1 h-full">
                  <Card variant="glass" className="p-8 flex flex-col relative overflow-hidden group bg-[#005f6a]/10 hover:bg-[#005f6a]/60 hover:border-[#005f6a] hover:shadow-[0_0_40px_rgba(0,95,106,0.8)] transition-all duration-500 h-full">
                  <div className="relative z-10 flex-grow">
                     <div className="flex items-center gap-6 mb-10 cursor-pointer group/header relative" onClick={() => setHoveredAntenna(hoveredAntenna === 'mini-x' ? null : 'mini-x')}>
                        {/* Label Futurista */}
                        <div className="absolute right-0 -top-4 opacity-0 group-hover/header:opacity-100 transition-all duration-500 translate-y-2 group-hover/header:translate-y-0 flex items-center gap-2 bg-slate-900/80 dark:bg-black/60 border border-[#005f6a]/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,95,106,0.4)] z-20">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#00a2b8] shadow-[0_0_8px_#00a2b8] animate-pulse" />
                           <span className="text-[10px] font-bold text-[#00a2b8] uppercase tracking-widest whitespace-nowrap">Un clic para ver en detalle</span>
                        </div>
                        <div className="w-20 h-20 rounded-[1.5rem] bg-blue-600/5 flex items-center justify-center border-2 border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover/header:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all shrink-0">
                           <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-bold text-slate-900 dark:text-white group-hover/header:text-[#00a2b8] transition-colors duration-300 tracking-tight">Antena Mini X</h3>
                           <span className="text-white text-base mt-2 font-bold tracking-wide">HOGAR y MOVILIDAD</span>
                           <span className="text-white text-sm mt-1 font-bold opacity-90">Compacta · Potente · Portátil - Liviana ideal para tu HOGAR</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 mb-10">
                        <div className="h-[3px] flex-grow bg-slate-900 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "25%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]" 
                           />
                        </div>
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                     </div>

                     <p className="text-slate-800 dark:text-white mb-10 leading-relaxed text-base md:text-lg font-medium drop-shadow-md">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Diseño y dinámica.
                     </p>
                     
                     <div className="bg-black/40 rounded-[2rem] p-6 border border-slate-800/50 mb-2 flex flex-col items-center text-center">
                        <div className="w-full border-b border-slate-300/80 dark:border-slate-800/80 pb-4 mb-4">
                           <p className="text-[11px] text-white font-bold uppercase tracking-[0.2em] mb-1">Importe</p>
                           <div className="flex items-baseline justify-center gap-1">
                              <span className="text-4xl font-black text-[#005f6a] drop-shadow-sm">$300.000</span>
                           </div>
                           <p className="text-[10px] text-slate-300 uppercase mt-1 tracking-wider">+ IVA (Efectivo)</p>
                        </div>
                        <div className="w-full mb-6">
                           <p className="text-[11px] text-white font-bold uppercase tracking-[0.1em] mb-1">3 Cuotas Sin Interés</p>
                           <div className="flex items-baseline justify-center gap-1">
                              <span className="text-2xl font-black text-[#005f6a] drop-shadow-sm">$100.000</span>
                           </div>
                           <p className="text-[10px] text-slate-300 uppercase mt-1 tracking-wider">+ IVA</p>
                        </div>
                        <Button 
                          variant="premium"
                          onClick={() => openLeadModal("HARDWARE", "Antena Mini X", "Adquisición de equipamiento Starlink Mini con soporte de activación.")}
                          className="w-full"
                        >
                          Comprar Equipamiento
                        </Button>
                     </div>
                  </div>
                  </Card>
               </motion.div>
               )}

                  {hoveredAntenna === 'mini-x' && (
                     <motion.div 
                        key="mini-x-install"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, display: "none" }}
                        transition={{ duration: 0.4 }}
                        className="md:col-span-2 flex flex-col justify-center h-full"
                     >
                        <div className="bg-gradient-to-br from-[#005f6a]/20 to-[#020617]/90 border-2 border-[#005f6a] rounded-3xl p-8 backdrop-blur-md shadow-[0_0_60px_rgba(0,95,106,0.3)] h-full flex flex-col justify-between">
                           <div>
                              <div className="flex items-center gap-4 mb-4">
                                 <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/50 text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                 </div>
                                 <h3 className="text-3xl font-black text-pink-500 drop-shadow-md tracking-tight">INSTALACIÓN MINI X</h3>
                              </div>
                              <p className="text-lg text-white font-bold mb-4 text-justify leading-snug">
                                 El importe incluye instalación de hardware + configuración completa de Software Satelital por personal calificado.
                              </p>
                           </div>

                           <div className="flex flex-col gap-4 mt-2">
                              {/* IMPORTE INSTALACION BOX (FUXIA) */}
                              <div className="bg-pink-900/20 rounded-2xl p-6 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:border-pink-500/60 transition-colors">
                                 <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-baseline border-b border-pink-500/40 pb-4">
                                       <span className="text-xs text-pink-400 font-bold tracking-widest uppercase">IMPORTE INSTALACIÓN</span>
                                       <div className="text-right">
                                          <span className="text-3xl font-black text-pink-500">$150.000</span>
                                          <span className="block text-[10px] text-pink-400 mt-1 font-normal uppercase">+ IVA (Efectivo)</span>
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-1">
                                       <span className="text-xs text-pink-400 font-bold tracking-widest uppercase">O 3 CUOTAS SIN INTERÉS</span>
                                       <div className="text-right">
                                          <span className="text-3xl font-black text-pink-500">$60.000</span>
                                          <span className="block text-[10px] text-pink-400 mt-0.5 font-normal uppercase">+ IVA</span>
                                       </div>
                                    </div>
                                    <div className="text-center mt-2">
                                       <span className="text-white font-bold text-sm uppercase tracking-wide">Llave en mano. MR Tech.</span>
                                    </div>
                                 </div>
                              </div>

                              {/* PLAN BASICO MINI BOX (VERDE PETROLEO) */}
                              <div className="bg-[#005f6a]/20 rounded-2xl p-6 border border-[#005f6a]/40 shadow-[0_0_20px_rgba(0,95,106,0.15)] hover:border-[#005f6a]/60 transition-colors">
                                 <div className="flex flex-col mb-1">
                                    <h3 className="text-3xl font-black text-blue-500 drop-shadow-md tracking-tight mb-2">PLAN BÁSICO MINI</h3>
                                 </div>
                                 <div className="flex justify-between items-baseline border-b border-[#005f6a]/40 pb-4 mb-4">
                                    <span className="text-xs text-white font-bold tracking-widest uppercase">ABONO MENSUAL</span>
                                    <div className="text-right">
                                       <span className="text-3xl font-black text-blue-500">$90.000</span>
                                       <span className="block text-[10px] text-blue-400 mt-0.5 font-normal uppercase">+ IVA</span>
                                    </div>
                                 </div>
                                 <p className="text-sm text-white font-bold mb-4 leading-snug">
                                    Internet diseñado para cada necesidad y rubro. Respaldado con consultoría especializada en IT, mantención y monitoreo contínuo de su red.
                                 </p>
                                 <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                                       <span className="text-sm text-white font-bold">Servicio Mensual</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                                       <span className="text-sm text-white font-bold">Soporte remoto ilimitado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                                       <span className="text-sm text-white font-bold">Consultoría y Asesoramiento MR</span>
                                    </div>
                                 </div>
                                 <Button 
                                    variant="premium"
                                    onClick={() => openLeadModal("PLAN", "Plan Básico Mini", "Contratación del abono mensual para Antena Mini X.")}
                                    className="w-full text-base"
                                 >
                                    Seleccionar Plan
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
                  
                  {(!hoveredAntenna || hoveredAntenna === 'v4') && (
                     <motion.div key="v4-card" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, display: "none" }} transition={{ duration: 0.3 }} className="md:col-span-1 h-full">
                        <Card variant="glass" className="p-8 flex flex-col relative overflow-hidden group bg-blue-500/10 hover:bg-blue-500/60 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] transition-all duration-500 h-full">
                  <div className="relative z-10 flex-grow mt-4">
                     <div className="flex items-center gap-6 mb-10 cursor-pointer group/header relative" onClick={() => setHoveredAntenna(hoveredAntenna === 'v4' ? null : 'v4')}>
                        {/* Label Futurista */}
                        <div className="absolute right-0 -top-4 opacity-0 group-hover/header:opacity-100 transition-all duration-500 translate-y-2 group-hover/header:translate-y-0 flex items-center gap-2 bg-slate-900/80 dark:bg-black/60 border border-blue-500/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.4)] z-20">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" />
                           <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest whitespace-nowrap">Un clic para ver en detalle</span>
                        </div>
                        <div className="w-24 h-24 rounded-[1.8rem] bg-cyan-500/5 flex items-center justify-center border-2 border-cyan-500 text-cyan-700 dark:text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] group-hover/header:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all shrink-0">
                           <svg className="w-12 h-12 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="4" y="6" width="16" height="5" rx="1" />
                              <rect x="4" y="14" width="16" height="5" rx="1" />
                              <circle cx="7" cy="8.5" r="0.5" fill="currentColor" />
                              <circle cx="7" cy="16.5" r="0.5" fill="currentColor" />
                           </svg>
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-bold text-slate-900 dark:text-white group-hover/header:text-blue-400 transition-colors duration-300 tracking-tight">Antena Estándar V4</h3>
                           <span className="text-white text-base mt-2 font-bold tracking-wide">Residencial y Empresas (según infraestructura)</span>
                           <span className="text-white text-sm mt-1 font-bold opacity-90">Robusta. La más Potente</span>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-3 mb-10">
                        {["WiFi 6", "Alta Potencia", "Estable"].map((tag, i) => (
                           <div key={i} className="bg-black/60 border border-cyan-900/50 px-4 py-2 rounded-xl flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{tag}</span>
                           </div>
                        ))}
                     </div>

                     <div className="flex items-center gap-4 mb-10">
                        <div className="h-[4px] flex-grow bg-slate-950 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.8)]" 
                           />
                        </div>
                        <svg className="w-7 h-7 text-cyan-700 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                     </div>

                     <p className="text-slate-800 dark:text-white mb-10 leading-relaxed text-base md:text-lg font-medium drop-shadow-md">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Prioridad Satelital, diseño y robustez.
                     </p>
                     
                     <div className="bg-cyan-500/10 rounded-[2rem] p-6 border border-cyan-500/20 mb-2 flex flex-col items-center text-center">
                        <div className="w-full border-b border-cyan-900/40 pb-4 mb-4">
                           <p className="text-[11px] text-white font-bold uppercase tracking-[0.2em] mb-1">Importe</p>
                           <div className="flex items-baseline justify-center gap-1">
                              <span className="text-4xl font-black text-blue-500 drop-shadow-sm">$500.000</span>
                           </div>
                           <p className="text-[10px] text-cyan-100 uppercase mt-1 tracking-wider">+ IVA (Efectivo)</p>
                        </div>
                        <div className="w-full mb-6">
                           <p className="text-[11px] text-white font-bold uppercase tracking-[0.1em] mb-1">3 Cuotas Sin Interés</p>
                           <div className="flex items-baseline justify-center gap-1">
                              <span className="text-2xl font-black text-blue-500 drop-shadow-sm">$166.666</span>
                           </div>
                           <p className="text-[10px] text-cyan-100 uppercase mt-1 tracking-wider">+ IVA</p>
                        </div>
                        <Button 
                          variant="glow"
                          onClick={() => openLeadModal("HARDWARE", "Antena Estándar V4", "Equipamiento de alto rendimiento con router WiFi 6 integrado.")}
                          className="w-full text-lg"
                        >
                          Comprar Equipamiento
                        </Button>
                     </div>
                  </div>
                        </Card>
                     </motion.div>
                  )}

                  {hoveredAntenna === 'v4' && (
                     <motion.div 
                        key="v4-install"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, display: "none" }}
                        transition={{ duration: 0.4 }}
                        className="md:col-span-2 flex flex-col justify-center h-full"
                     >
                        <div className="bg-gradient-to-br from-blue-500/20 to-[#020617]/90 border-2 border-blue-500 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_60px_rgba(59,130,246,0.3)] h-full flex flex-col justify-between">
                           <div>
                              <div className="flex items-center gap-4 mb-4">
                                 <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                 </div>
                                 <h3 className="text-3xl font-black text-cyan-400 drop-shadow-md tracking-tight">INSTALACIÓN ESTÁNDAR V4</h3>
                              </div>
                              <p className="text-lg text-white font-bold mb-4 text-justify leading-snug">
                                 El importe incluye instalación de hardware + configuración completa de Software Satelital por personal calificado.
                              </p>
                           </div>

                           <div className="flex flex-col gap-4 mt-2">
                              {/* IMPORTE INSTALACION BOX (CYAN) */}
                              <div className="bg-cyan-900/20 rounded-2xl p-6 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-500/60 transition-colors">
                                 <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-baseline border-b border-cyan-500/40 pb-4">
                                       <span className="text-xs text-cyan-400 font-bold tracking-widest uppercase">IMPORTE INSTALACIÓN</span>
                                       <div className="text-right">
                                          <span className="text-3xl font-black text-cyan-400">$200.000</span>
                                          <span className="block text-[10px] text-cyan-300 mt-1 font-normal uppercase">+ IVA (Efectivo)</span>
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-1">
                                       <span className="text-xs text-cyan-400 font-bold tracking-widest uppercase">O 3 CUOTAS SIN INTERÉS</span>
                                       <div className="text-right">
                                          <span className="text-3xl font-black text-cyan-400">$80.000</span>
                                          <span className="block text-[10px] text-cyan-300 mt-0.5 font-normal uppercase">+ IVA</span>
                                       </div>
                                    </div>
                                    <div className="text-center mt-2">
                                       <span className="text-white font-bold text-sm uppercase tracking-wide">Llave en mano. MR Tech.</span>
                                    </div>
                                 </div>
                              </div>

                              {/* PLAN ESTANDAR V4 BOX (BLUE) */}
                              <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/60 transition-colors">
                                 <div className="flex flex-col mb-1">
                                    <h3 className="text-3xl font-black text-blue-400 drop-shadow-md tracking-tight mb-2">PLAN ESTÁNDAR V4</h3>
                                 </div>
                                 <div className="flex justify-between items-baseline border-b border-blue-500/40 pb-4 mb-4">
                                    <span className="text-xs text-white font-bold tracking-widest uppercase">ABONO MENSUAL</span>
                                    <div className="text-right">
                                       <span className="text-3xl font-black text-blue-400">$120.000</span>
                                       <span className="block text-[10px] text-blue-300 mt-0.5 font-normal uppercase">+ IVA</span>
                                    </div>
                                 </div>
                                 <p className="text-sm text-white font-bold mb-4 leading-snug">
                                    Internet diseñado para cada necesidad y rubro. Respaldado con consultoría especializada en IT, mantención y monitoreo contínuo de su red.
                                 </p>
                                 <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                                       <span className="text-sm text-white font-bold">Servicio Mensual</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                                       <span className="text-sm text-white font-bold">Soporte remoto ilimitado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]" />
                                       <span className="text-sm text-white font-bold">Consultoría y Asesoramiento MR</span>
                                    </div>
                                 </div>
                                 <Button 
                                    variant="premium"
                                    onClick={() => openLeadModal("PLAN", "Plan Estándar V4", "Contratación del abono mensual para Antena Estándar V4.")}
                                    className="w-full text-base bg-blue-600 hover:bg-blue-500"
                                 >
                                    Seleccionar Plan
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* Itinerante */}
                  {(!hoveredAntenna || hoveredAntenna === 'itinerante') && (
                     <motion.div key="itinerante-card" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, display: "none" }} transition={{ duration: 0.3 }} className="md:col-span-1 h-full">
                        <Card variant="glass" className="p-8 group shadow-2xl flex flex-col relative overflow-hidden bg-pink-500/10 hover:bg-pink-500/60 hover:border-pink-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] transition-all duration-500 h-full">
                  <div className="relative z-10 flex-grow">
                     <div className="flex items-center gap-6 mb-10 cursor-pointer group/header relative" onClick={() => setHoveredAntenna(hoveredAntenna === 'itinerante' ? null : 'itinerante')}>
                        {/* Label Futurista */}
                        <div className="absolute right-0 -top-4 opacity-0 group-hover/header:opacity-100 transition-all duration-500 translate-y-2 group-hover/header:translate-y-0 flex items-center gap-2 bg-slate-900/80 dark:bg-black/60 border border-pink-500/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.4)] z-20">
                           <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6] animate-pulse" />
                           <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest whitespace-nowrap">Un clic para ver en detalle</span>
                        </div>
                        <div className="w-20 h-20 rounded-[1.5rem] bg-green-600/5 flex items-center justify-center border-2 border-green-500/30 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)] group-hover/header:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all shrink-0">
                           <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-bold text-slate-900 dark:text-white group-hover/header:text-pink-400 transition-colors duration-300 tracking-tight">Antena Itinerante</h3>
                           <span className="text-white text-base mt-2 font-bold tracking-wide">Conexión en movimiento sin limites.</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 mb-10">
                        <div className="h-[3px] flex-grow bg-slate-900 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "66%" }}
                            transition={{ duration: 1.2, delay: 0.5 }}
                            className="h-full bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.8)]" 
                           />
                        </div>
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                     </div>

                     <p className="text-slate-800 dark:text-white mb-10 leading-relaxed text-base md:text-lg font-medium drop-shadow-md">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Diseño portátil, ideal para sectores rurales.
                     </p>
                     
                     <div className="bg-black/40 rounded-[2rem] p-6 border border-slate-800/50 mb-2 mt-auto flex flex-col items-center text-center">
                        <div className="w-full border-b border-slate-300/80 dark:border-slate-800/80 pb-4 mb-4">
                           <p className="text-[11px] text-white font-bold uppercase tracking-[0.2em] mb-1">Importe</p>
                           <div className="flex items-baseline justify-center gap-1">
                              <span className="text-4xl font-black text-pink-500 drop-shadow-sm">$300.000</span>
                           </div>
                           <p className="text-[10px] text-slate-300 uppercase mt-1 tracking-wider">+ IVA (Efectivo)</p>
                        </div>
                        <div className="w-full mb-6">
                           <p className="text-[11px] text-white font-bold uppercase tracking-[0.1em] mb-1">3 Cuotas Sin Interés</p>
                           <div className="flex items-baseline justify-center gap-1">
                              <span className="text-2xl font-black text-pink-500 drop-shadow-sm">$100.000</span>
                           </div>
                           <p className="text-[10px] text-slate-300 uppercase mt-1 tracking-wider">+ IVA</p>
                        </div>
                        <Button 
                          variant="premium"
                          onClick={() => openLeadModal("HARDWARE", "Antena Itinerante", "Antena portátil Starlink diseñada para movilidad extrema.")}
                          className="w-full"
                        >
                          Comprar Equipamiento
                        </Button>
                     </div>
                  </div>
                        </Card>
                     </motion.div>
                  )}

                  {hoveredAntenna === 'itinerante' && (
                     <motion.div 
                        key="itinerante-install"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, display: "none" }}
                        transition={{ duration: 0.4 }}
                        className="md:col-span-2 flex flex-col justify-center h-full"
                     >
                        <div className="bg-gradient-to-br from-pink-500/20 to-[#020617]/90 border-2 border-pink-500 rounded-3xl p-8 backdrop-blur-md shadow-[0_0_60px_rgba(236,72,153,0.3)] h-full flex flex-col justify-between">
                           <div>
                              <div className="flex items-center gap-4 mb-4">
                                 <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                 </div>
                                 <h3 className="text-3xl font-black text-green-400 drop-shadow-md tracking-tight">INSTALACIÓN ITINERANTE</h3>
                              </div>
                              <p className="text-lg text-white font-bold mb-4 text-justify leading-snug">
                                 El importe incluye instalación de hardware + configuración completa de Software Satelital por personal calificado.
                              </p>
                           </div>

                           <div className="flex flex-col gap-4 mt-2">
                              {/* IMPORTE INSTALACION BOX (GREEN) */}
                              <div className="bg-green-900/20 rounded-2xl p-6 border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:border-green-500/60 transition-colors">
                                 <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-baseline border-b border-green-500/40 pb-4">
                                       <span className="text-xs text-green-400 font-bold tracking-widest uppercase">IMPORTE INSTALACIÓN</span>
                                       <div className="text-right">
                                          <span className="text-3xl font-black text-green-400">$150.000</span>
                                          <span className="block text-[10px] text-green-300 mt-1 font-normal uppercase">+ IVA (Efectivo)</span>
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-1">
                                       <span className="text-xs text-green-400 font-bold tracking-widest uppercase">O 3 CUOTAS SIN INTERÉS</span>
                                       <div className="text-right">
                                          <span className="text-3xl font-black text-green-400">$60.000</span>
                                          <span className="block text-[10px] text-green-300 mt-0.5 font-normal uppercase">+ IVA</span>
                                       </div>
                                    </div>
                                    <div className="text-center mt-2">
                                       <span className="text-white font-bold text-sm uppercase tracking-wide">Llave en mano. MR Tech.</span>
                                    </div>
                                 </div>
                              </div>

                              {/* PLAN MÓVIL ITINERANTE BOX (PINK) */}
                              <div className="bg-pink-900/20 rounded-2xl p-6 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:border-pink-500/60 transition-colors">
                                 <div className="flex flex-col mb-1">
                                    <h3 className="text-3xl font-black text-pink-400 drop-shadow-md tracking-tight mb-2">PLAN MÓVIL ITINERANTE</h3>
                                 </div>
                                 <div className="flex justify-between items-baseline border-b border-pink-500/40 pb-4 mb-4">
                                    <span className="text-xs text-white font-bold tracking-widest uppercase">ABONO MENSUAL</span>
                                    <div className="text-right">
                                       <span className="text-3xl font-black text-pink-400">$140.000</span>
                                       <span className="block text-[10px] text-pink-300 mt-0.5 font-normal uppercase">+ IVA</span>
                                    </div>
                                 </div>
                                 <p className="text-sm text-white font-bold mb-4 leading-snug">
                                    Internet diseñado para cada necesidad y rubro. Respaldado con consultoría especializada en IT, mantención y monitoreo contínuo de su red.
                                 </p>
                                 <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_pink]" />
                                       <span className="text-sm text-white font-bold">Servicio Mensual</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_pink]" />
                                       <span className="text-sm text-white font-bold">Soporte remoto ilimitado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_pink]" />
                                       <span className="text-sm text-white font-bold">Consultoría y Asesoramiento MR</span>
                                    </div>
                                 </div>
                                 <Button 
                                    variant="premium"
                                    onClick={() => openLeadModal("PLAN", "Plan Móvil Itinerante", "Contratación del abono mensual para Antena Itinerante.")}
                                    className="w-full text-base bg-pink-600 hover:bg-pink-500 border-none"
                                 >
                                    Seleccionar Plan
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* Planes Section */}
      <section id="planes" className="relative z-10 pt-4 pb-16 md:pb-32 px-3 sm:px-6 max-w-7xl mx-auto w-full">

         {/* Ideal Para Section */}
         <div className="w-full relative z-10 pt-4 pb-8 flex flex-col items-center border-t border-slate-300/80 dark:border-slate-800/80 mt-2 md:mt-4 max-w-[90rem] mx-auto overflow-hidden">
             <img src="/ideal.png" alt="Ideal Para" className="w-full max-w-lg md:max-w-xl mx-auto h-auto object-contain mb-4 border-none bg-transparent drop-shadow-2xl" style={{ maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 50%, transparent 100%)' }} />
             
             {/* Slider container for continuous movement on mobile, flex on desktop */}
             <div className="w-full relative flex justify-center mt-6">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 lg:gap-12 px-2 sm:px-4 max-w-full">
                    <div className="relative group cursor-pointer flex justify-center items-center">
                       <div className="absolute inset-0 bg-yellow-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150 z-0 pointer-events-none" />
                    <img src="/ideal bodegas.png" alt="Bodegas" className="w-14 sm:w-20 md:w-28 lg:w-36 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                    </div>
                    <div className="relative group cursor-pointer flex justify-center items-center">
                       <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150 z-0 pointer-events-none" />
                    <img src="/ideal hoteles.png" alt="Hoteles" className="w-14 sm:w-20 md:w-28 lg:w-36 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                    </div>
                    <div className="relative group cursor-pointer flex justify-center items-center">
                       <div className="absolute inset-0 bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150 z-0 pointer-events-none" />
                    <img src="/ideal empresariales.png" alt="Empresariales" className="w-14 sm:w-20 md:w-28 lg:w-36 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                    </div>
                    <div className="relative group cursor-pointer flex justify-center items-center">
                       <div className="absolute inset-0 bg-pink-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150 z-0 pointer-events-none" />
                    <img src="/ideal gastronomia.png" alt="Polos Gastronómicos" className="w-14 sm:w-20 md:w-28 lg:w-36 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                    </div>
                    <div className="relative group cursor-pointer flex justify-center items-center">
                       <div className="absolute inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150 z-0 pointer-events-none" />
                    <img src="/ideal rurales.png" alt="Proyectos Rurales" className="w-14 sm:w-20 md:w-28 lg:w-36 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                    </div>
                 </div>
             </div>
         </div>
 
         <div className="mt-8 md:mt-16 bg-gradient-to-br from-blue-100 via-slate-100 to-slate-200 dark:from-blue-900/60 dark:via-slate-900/80 dark:to-slate-950/90 backdrop-blur-xl border border-blue-500/40 rounded-3xl p-6 sm:p-10 md:p-16 flex flex-col items-center justify-center gap-6 md:gap-10 shadow-[0_0_60px_rgba(37,99,235,0.15)] relative overflow-hidden group w-full text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 dark:opacity-20 mix-blend-overlay" />
            <div className="relative z-10 w-full drop-shadow-md flex flex-col items-center">
               <h3 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] uppercase tracking-[0.1em] mb-6 w-full text-center" style={{ fontFamily: "'Orbitron', 'Syncopate', sans-serif" }}>PROYECTOS / SOLUCIONES EMPRESARIALES A MEDIDA</h3>
               <div className="text-white w-full max-w-5xl mx-auto leading-relaxed text-lg font-bold space-y-0 text-justify">
                  <p>En MR Technology desarrollamos soluciones tecnológicas personalizadas, diseñadas según la operación y objetivos de cada empresa. Analizamos su infraestructura para crear una arquitectura que optimiza la conectividad, el rendimiento y la transformación digital. Diagnostico, puntos de dolor y soluciones, trazabilidad directa.</p>
               </div>
            </div>
            <div className="relative z-10 shrink-0 w-full flex justify-center mt-4">

               <Button 
                 size="lg" 
                 onClick={() => openLeadModal("QUOTE", "Relevamiento IT - Proyectos Empresariales", "Solicitud de relevamiento técnico exhaustivo y cotización a medida para corporaciones por parte de MR Tech.")}
                 className="w-full md:w-auto px-10 py-7 text-lg font-black rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)] bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:scale-105 border border-blue-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
               >
                 Solicitar Relevamiento IT
               </Button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-100/90 dark:bg-[#000205]/90 backdrop-blur-3xl py-10 md:py-20 px-4 sm:px-6 border-t border-slate-300 dark:border-white/5 text-center text-slate-500">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
         
         <p className="mb-12 mt-8 max-w-xl mx-auto font-light text-slate-600 dark:text-slate-400">Consulte disponibilidad y velocidades en su Zona. Implementación física, administrativa e IT especializada nivel 3.</p>
         <div className="flex justify-center gap-10 text-sm mb-10 font-semibold">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Términos B2B</a>
            <a href="#" className="hover:text-blue-400 transition-colors">SLA de Servicios Técnicos</a>
         </div>
         <p className="text-xs uppercase tracking-widest text-slate-600 font-bold mb-4">https://github.com/dagamoner/satellite-b2b.git</p>
         <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">© 2026 MR Technology. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
