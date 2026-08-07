"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import LeadFormModal from "../components/LeadFormModal";
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

const ecosystemLogos = [
  { src: "3. Logo Mini Conectividad Satelital.png", alt: "Conectividad Satelital", url: "https://satelital.mrtechnology.it.com", tip: "/Problemas de conectividad inicial.png", color: "#33E8FF" },
  { src: "1. Logo Mini Tecnologia Informatica (IT).png", alt: "Tecnología Informática (IT)", url: "https://informatica.mrtechnology.it.com", tip: "/Problemas con Tecnologia.png", color: "#60a5fa" },
  { src: "2. Logo Mini Alianzas Software ERP.png", alt: "Software ERP / SAAS Empresarial", url: "https://erp.mrtechnology.it.com", tip: "/Problemas Soft.png", color: "#f97316", hasMaxirest: true },
  { src: "4. Logo Mini Inteligencia Artificial.png", alt: "Inteligencia Artificial", url: "https://ia.mrtechnology.it.com", tip: "/Problemas IA.png", color: "#a78bfa" },
  { src: "5. Logo Mini CIberseguridad.png", alt: "Ciberseguridad", url: "https://cyber.mrtechnology.it.com", tip: "/Problemas seguros.png", color: "#22c55e" }
];

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
  const [clickedEcosistema, setClickedEcosistema] = useState<number | null>(null);
  const [satelliteFlash, setSatelliteFlash] = useState(false);
  const [earthFlash, setEarthFlash] = useState(false);
  const orbitStartRef = useRef<number>(0);
  const [isSatelital, setIsSatelital] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.includes("satelital")) {
      setIsSatelital(true);
    }
  }, []);

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

  // The action when logos are selected is now handled directly in the onClick/onTouchEnd handlers.
  useEffect(() => {
    if (clickedEcosistema !== null) {
      const timer = setTimeout(() => {
        const logo = ecosystemLogos[clickedEcosistema];
        if (logo) window.location.href = logo.url;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [clickedEcosistema]);

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

      {/* Sello de Agua - Logo MR Technology */}
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
            filter: 'grayscale(100%) brightness(3)',
            mixBlendMode: 'screen',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Halo de luz adicional sobre el fondo, no invasivo */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

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
      <section className="relative z-10 pt-8 pb-24 md:pt-10 md:pb-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          

          {/* Main Logo */}
          <div className="relative shrink-0 flex items-center justify-center group/logo cursor-pointer mb-0">
              <div className="absolute inset-0 rounded-full bg-[#005f6a] blur-[50px] opacity-0 group-hover/logo:opacity-80 transition-all duration-700 pointer-events-none mix-blend-screen scale-[1.1] group-hover/logo:scale-[1.4]" />
              
              <motion.div className="absolute top-6 right-12 w-4 h-4 text-cyan-200 z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 180, 360], scale: [0.5, 1.4, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_12px_rgba(165,243,252,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
              
              <motion.div className="absolute bottom-8 left-12 w-5 h-5 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [360, 180, 0], scale: [0.6, 1.5, 0.6], opacity: [0.2, 1, 0.2] }} transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>

              <motion.img 
                 src="/Logo WEB MR Tech.png" 
                 alt="MR Technology" 
                 animate={{ scale: [1, 1.025, 1], filter: ["brightness(1.1) contrast(1.1)", "brightness(1.25) contrast(1.15)", "brightness(1.1) contrast(1.1)"] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="object-contain transition-all duration-700 relative z-10 w-[380px] md:w-[500px]"
                 style={{ 
                   mixBlendMode: 'screen',
                   filter: 'brightness(1.1) contrast(1.1)'
                 }}
              />
          </div>

          {/* Tagline - Debajo del logo */}
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center text-[12px] text-white font-extrabold tracking-[0.15em] -mt-12 mb-2 max-w-3xl mx-auto px-4 uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            "Lo esencial de lo simple, el crecimiento tecnológico y digital de tu <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">EMPRESA</span> es nuestro gran <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">DESAFÍO</span>, <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">JUNTOS</span> podemos lograrlo."
          </motion.p>


          {/* Legend - Leyenda ecosistema - always visible above logos */}
          <div
            className="relative mb-0 flex justify-center w-full"
            style={{ marginTop: '-10rem' }}
          >
             <img
               src="/Leyenda ecosistema.png"
               alt="Ecosistema by MR Tech"
               className="h-[24rem] md:h-[30rem] w-auto object-contain relative z-10 pointer-events-none select-none mix-blend-screen"
             />

             {/* Sparkle constellation around the legend - white & teal */}
             <motion.div className="absolute -top-5 right-[30%] w-5 h-5 text-white z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 180, 360], scale: [0.4, 1.6, 0.4], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_18px_rgba(255,255,255,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute -top-3 left-[28%] w-4 h-4 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [180, 360, 540], scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3.1, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_14px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute -bottom-3 right-[25%] w-6 h-6 text-white z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 90, 180], scale: [0.5, 1.8, 0.5], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.7, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_22px_rgba(255,255,255,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute -bottom-4 left-[22%] w-3 h-3 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [360, 180, 0], scale: [0.5, 1.4, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute top-1 -left-4 w-3 h-3 text-white z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [90, 270, 450], scale: [0.4, 1.2, 0.4], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute top-1 -right-4 w-4 h-4 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 120, 240], scale: [0.5, 1.6, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.9, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_16px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
          </div>
          {/* Subtitle below Ecosistema legend - fades gracefully */}
          <AnimatePresence>
            {true && (
              <motion.p
                key="eco-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-justify text-white text-[12px] font-extrabold tracking-[0.1em] md:tracking-wide -mt-22 md:-mt-[12.5rem] mb-6 max-w-3xl mx-auto px-4 leading-relaxed drop-shadow-sm text-balance"
                style={{ fontFamily: "'Inter', sans-serif", textAlignLast: 'center' }}
              >
                A disposición todas nuestras <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">SOLUCIONES</span> para enfrentar los desafíos de tu <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">EMPRESA</span> con <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">ESTRATEGIA</span>, <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">INNOVACIÓN</span> y <span className="text-[#33E8FF] font-black drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">COMPROMISO</span>.
              </motion.p>
            )}
          </AnimatePresence>
          {/* Logos row — hover limpio, escala suave, tooltip a la derecha */}
          <div
            className="relative flex items-center justify-center gap-2 md:gap-4 w-full z-30 flex-wrap md:flex-nowrap"
            style={{ minHeight: '22rem', padding: '2.5rem 4rem', marginTop: '-3rem' }}
          >
            {ecosystemLogos.map((logo, i) => {
              const isSelected = clickedEcosistema === i;
              const anySelected = clickedEcosistema !== null;
              const isOther = anySelected && !isSelected;

              return (
                  <div
                  key={i}
                  className="relative flex-shrink-0 flex items-center justify-center"
                  onClick={(e) => {
                    if (clickedEcosistema !== i) {
                      e.preventDefault();
                      setClickedEcosistema(i);
                    }
                  }}
                  style={{ 
                    padding: '1rem',
                    opacity: isOther ? 0 : 1,
                    transition: 'opacity 0.4s ease-in-out',
                    cursor: 'pointer'
                  }}
                >
                  <a
                    href={logo.url}
                    rel="noopener noreferrer"
                    style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <img
                      src={`/${logo.src}`}
                      alt={logo.alt}
                      style={{
                        mixBlendMode: 'screen',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))',
                        width: 'clamp(140px, 16vw, 224px)',
                        height: 'clamp(140px, 16vw, 224px)',
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 10,
                        display: 'block',
                        transition: 'filter 0.5s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 20px rgba(51,232,255,0.3)) brightness(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))'}
                    />
                  </a>

                  {/* Tooltip / Cartel a la derecha o izquierda */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key={`tip-${i}`}
                        initial={{ opacity: 0, x: i >= 2 ? -20 : 20, y: "-50%" }}
                        animate={{ opacity: 1, x: 0, y: "-50%" }}
                        exit={{ opacity: 0, x: i >= 2 ? -20 : 20, y: "-50%" }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute z-50 flex items-center justify-center gap-4"
                        style={{
                          [i >= 2 ? 'right' : 'left']: 'calc(100% + 1rem)',
                          top: '50%',
                          height: 'clamp(140px, 16vw, 224px)', // Mismo tamaño exacto del logo
                          width: 'clamp(220px, 30vw, 450px)',
                          cursor: 'pointer',
                        }}
                      >
                         <a
                           href={logo.url}
                           rel="noopener noreferrer"
                           className="flex flex-col items-center justify-center gap-2 h-full w-full"
                         >

                           <img
                             src={logo.tip}
                             alt="Información del Ecosistema"
                             className="w-full h-auto object-contain rounded-xl"
                             style={{ filter: 'drop-shadow(0 0 20px rgba(51,232,255,0.25)) brightness(1.05)', maxHeight: 'calc(100% - 2rem)' }}
                           />
                         </a>
                      </motion.div>
                    )}

                    {isSelected && logo.hasMaxirest && (
                      <motion.div
                        key={`maxirest-${i}`}
                        initial={{ opacity: 0, x: 20, y: "-50%" }}
                        animate={{ opacity: 1, x: 0, y: "-50%" }}
                        exit={{ opacity: 0, x: 20, y: "-50%" }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute z-50 flex items-center justify-center"
                        style={{
                          left: 'calc(100% + 1rem)', // Siempre a la derecha del logo principal
                          top: '50%',
                          height: 'clamp(140px, 16vw, 224px)', 
                          width: 'clamp(240px, 30vw, 360px)', // Aumentado al doble de tamaño
                          cursor: 'pointer',
                        }}
                      >
                         <div className="h-full flex-shrink-0 flex flex-col items-center justify-center w-full">
                            <img src="/logo maxirest ONE.png" alt="Maxirest ONE" className="w-full h-auto object-contain drop-shadow-lg" />
                            <span className="text-white font-bold text-xs md:text-sm tracking-wide mt-1 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] text-center">
                              nueva generación
                            </span>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>


          {/* About MR Technology Section */}
          <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 mt-2 md:mt-4 mb-20 relative z-20">
            {/* Introducción */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 max-w-4xl"
            >
              <p className="text-white text-lg md:text-xl leading-relaxed mb-6 font-bold">
                En <span className="font-black text-[#33E8FF] drop-shadow-[0_0_8px_rgba(51,232,255,0.6)]">MR Technology</span> desarrollamos soluciones tecnológicas integrales orientadas a optimizar, proteger y potenciar la infraestructura informática de empresas, profesionales y organizaciones que buscan evolucionar hacia un entorno digital más eficiente, seguro e inteligente.
              </p>
              <p className="text-white text-lg md:text-xl leading-relaxed font-bold">
                Combinamos innovación, automatización, conectividad y ciberseguridad para transformar la tecnología en una herramienta estratégica de crecimiento, productividad y evolución empresarial.
              </p>
            </motion.div>

            {/* Tarjetas de Virtud y Misión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Card Nuestra Virtud */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-[#33E8FF]/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(51,232,255,0.15)] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#33E8FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-full max-w-[280px] md:max-w-[320px] mb-4 flex items-center justify-center">
                  <img 
                    src="/VIRTUD.png" 
                    alt="Nuestra Virtud" 
                    className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium">
                  Brindar soluciones tecnológicas de excelencia que permitan a nuestros clientes alcanzar nuevos niveles de productividad, conectividad, automatización y seguridad digital.
                </p>
              </motion.div>

              {/* Card Nuestra Misión */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-[#33E8FF]/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(51,232,255,0.15)] transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#33E8FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-full max-w-[280px] md:max-w-[320px] mb-4 flex items-center justify-center">
                  <img 
                    src="/MISION.png" 
                    alt="Nuestra Misión" 
                    className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium">
                  Convertirnos en un referente tecnológico nacional y LATAM, integrando innovación, inteligencia artificial y soluciones estratégicas para acompañar la evolución digital de empresas y organizaciones modernas. Basados en IA & Marcos de CiberSeguridad vitales para la innovación y seguridad de nuestros CLIENTES.
                </p>
              </motion.div>
            </div>
          </div>


          {/* Contacto / Hablamos Section - Moved to Hero to keep Space Background */}
          <div id="whatsapp-contact" className="flex flex-col items-center gap-6 -mt-2 md:-mt-6 mb-16 w-full relative z-20 scroll-mt-24">
             <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-sm uppercase tracking-widest">HABLAMOS !!!</h4>
             <div className="flex flex-col items-center gap-6">
               {/* WhatsApp (Top) */}
               <div className="relative group shrink-0 flex items-center">
                 <div className="absolute inset-0 rounded-full bg-[#01c164] blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none scale-[1.35] z-0" />
                 <a 
                    href="https://wa.me/5492616518318" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="relative z-10 w-16 h-16 rounded-full border-2 border-[#01c164] bg-gradient-to-b from-[#02e779] to-[#019c50] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(1,193,100,0.9)] hover:scale-110 active:scale-95 group/btn overflow-hidden block"
                  >
                    <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#01c164] opacity-40 animate-pulse pointer-events-none" />
                    <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover/btn:translate-x-[120%]" />
                    <img src="/social_whatsapp_fixed_v1.png" alt="WhatsApp" className="w-full h-full object-cover transition-transform duration-500 group-hover/btn:scale-110" />
                  </a>
                  <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:text-[#01c164] group-hover:drop-shadow-[0_0_12px_rgba(1,193,100,0.9)] font-bold whitespace-nowrap text-xl pointer-events-none z-10 drop-shadow-md">+5492616518318</span>
               </div>
               
               <div className="flex gap-40 justify-center w-full relative">
                 {/* LinkedIn (Left) */}
                 <div className="relative group shrink-0 flex items-center">
                   <div className="absolute inset-0 rounded-full bg-[#0189dd] blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none scale-[1.35] z-0" />
                   <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold whitespace-nowrap text-lg pointer-events-none z-10 drop-shadow-md">www.linkedin.com/in/mrtech2026</span>
                   <a 
                      href="https://www.linkedin.com/in/mrtech2026" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="relative z-10 w-16 h-16 rounded-full border-2 border-[#0189dd] bg-gradient-to-b from-[#009bf2] to-[#006ca8] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(1,137,221,0.9)] hover:scale-110 active:scale-95 group/btn overflow-hidden block"
                    >
                      <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#0189dd] opacity-40 animate-pulse pointer-events-none" />
                      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover/btn:translate-x-[120%]" />
                      <img src="/social_linkedin_v3.png" alt="LinkedIn" className="w-full h-full object-cover transition-transform duration-500 group-hover/btn:scale-110" />
                    </a>
                 </div>

                 {/* Instagram (Right) */}
                 <div className="relative group shrink-0 flex items-center">
                   <div className="absolute inset-0 rounded-full bg-[#d631b9] blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none scale-[1.35] z-0" />
                   <a 
                      href="https://www.instagram.com/mrtechnologymza/?hl=es" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="relative z-10 w-16 h-16 rounded-full border-2 border-[#d631b9] bg-gradient-to-b from-[#e53fa3] to-[#b6248d] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(214,49,185,0.9)] hover:scale-110 active:scale-95 group/btn overflow-hidden block"
                    >
                      <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#d631b9] opacity-40 animate-pulse pointer-events-none" />
                      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover/btn:translate-x-[120%]" />
                      <img src="/social_instagram_fixed_v1.png" alt="Instagram" className="w-full h-full object-cover transition-transform duration-500 group-hover/btn:scale-110" />
                    </a>
                    <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold whitespace-nowrap text-lg pointer-events-none z-10 drop-shadow-md">@mrtechnologymza</span>
                 </div>
               </div>
               
               {/* Email (Bottom) */}
               <div className="relative group shrink-0 flex items-center">
                 <div className="absolute inset-0 rounded-full bg-[#ef4444] blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none scale-[1.35] z-0" />
                 <a 
                    href="mailto:mr@mrestudioinformatico.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="relative z-10 w-16 h-16 rounded-full border-2 border-[#ef4444] bg-gradient-to-b from-[#f87171] to-[#dc2626] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.9)] hover:scale-110 active:scale-95 group/btn overflow-hidden block"
                  >
                    <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#ef4444] opacity-40 animate-pulse pointer-events-none" />
                    <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover/btn:translate-x-[120%]" />
                    <img src="/logo mail.png" alt="Email" className="w-full h-full object-cover transition-transform duration-500 group-hover/btn:scale-110 relative z-10" />
                  </a>
                  <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold whitespace-nowrap text-lg pointer-events-none z-10 drop-shadow-md">mr@mrestudioinformatico.com</span>
               </div>
             </div>
             
             <div className="mt-12 flex flex-col items-center gap-2">
                <p className="tracking-[0.3em] text-white font-black text-2xl drop-shadow-lg uppercase">ZONA CUYO - Provincia de Mendoza</p>
                <p className="tracking-[0.2em] font-black text-[18px] drop-shadow-lg uppercase mt-2" style={{ color: '#33E8FF' }}>TU EMPRESA NUESTRO DESAFÍO</p>
             </div>
          </div>


        </motion.div>

      </section>



      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/5 text-center flex flex-col items-center justify-center">
        <img
          src="/Logo WEB MR Tech.png"
          alt="MR Technology"
          className="h-10 object-contain mx-auto mb-4 opacity-80 cursor-pointer hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          style={{ mixBlendMode: "screen" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />

        <p className="text-white font-bold text-sm">
          © {new Date().getFullYear()} MR Technology — Transformación Digital Empresarial
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 inline-flex items-center gap-2 text-[#33E8FF] hover:text-[#33E8FF]/80 text-sm font-bold transition-all duration-300 cursor-pointer group hover:scale-105"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[#33E8FF]/40 shadow-[0_0_8px_rgba(51,232,255,0.4)]">
            <img
              src="/ecosistema.jpg"
              alt="Ecosistema"
              className="w-full h-full object-cover"
              style={{ mixBlendMode: "screen", filter: "brightness(1.2) contrast(1.1)" }}
            />
          </div>
          <span>Volver al Ecosistema MR Technology</span>
        </button>
      </footer>
      </main>
  );
}

