"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import LeadFormModal from "../components/LeadFormModal";
import CoverageSearch from "../components/CoverageSearch";
import { ThemeToggle } from "../components/ThemeToggle";
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
  const [selectedEcosistema, setSelectedEcosistema] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className={`max-w-[90rem] mx-auto px-4 md:px-6 transition-all duration-500 flex items-center justify-between h-16 md:h-20`}>
          
          {/* Left Block - Small Logo */}
          <div className="flex-1 flex items-center justify-start hidden md:flex">
             <div className="relative shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                 <img 
                    src="/Logo WEB MR Tech.png" 
                    alt="MR Technology" 
                    className="w-24 md:w-32 object-contain hover:scale-105 transition-transform duration-300"
                    style={{ 
                      mixBlendMode: 'screen',
                      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)', 
                      maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)' 
                    }}
                 />
             </div>
          </div>
          
          {/* Center Block - Legend Image & Hablamos Button */}
          <div className="flex-1 md:flex-none flex flex-row items-center justify-center gap-4 relative shrink-0">
             <img 
               src="/Transformacion.png" 
               alt="Transformación Digital Empresarial" 
               className="h-14 md:h-[4.5rem] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
               style={{ mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)' }}
             />
             <a 
               href="#hablamos"
               className="relative group/hablamos shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
             >
               {/* Hover Glow halo */}
               <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-md opacity-0 group-hover/hablamos:opacity-100 transition-opacity duration-300 pointer-events-none" />
               <img 
                 src="/Hablamos.png" 
                 alt="Hablamos" 
                 className="h-16 md:h-24 w-auto object-contain"
                 style={{ 
                   mixBlendMode: 'screen',
                   WebkitMaskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)', 
                   maskImage: 'radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)' 
                 }}
               />
             </a>
          </div>

          {/* Right Block - Theme Toggle */}
          <div className="flex-1 flex justify-end items-center hidden md:flex">
             <div className="pl-4">
               <ThemeToggle />
             </div>
          </div>
        </div>
      </nav>

      <LeadFormModal 
         isOpen={isLeadModalOpen} 
         onClose={() => setIsLeadModalOpen(false)} 
         planInfo={selectedPlan} 
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 md:pt-20 md:pb-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          
          {/* Main Logo */}
          <div className="relative shrink-0 flex items-center justify-center group/logo cursor-pointer mb-6">
              <div className="absolute inset-0 rounded-full bg-[#005f6a] blur-[50px] opacity-0 group-hover/logo:opacity-80 transition-all duration-700 pointer-events-none mix-blend-screen scale-[1.1] group-hover/logo:scale-[1.4]" />
              
              <motion.div className="absolute top-6 right-12 w-4 h-4 text-cyan-200 z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 180, 360], scale: [0.5, 1.4, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_12px_rgba(165,243,252,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
              
              <motion.div className="absolute bottom-8 left-12 w-5 h-5 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [360, 180, 0], scale: [0.6, 1.5, 0.6], opacity: [0.2, 1, 0.2] }} transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>

              <motion.img 
                 src="/Logo WEB MR Tech.png" 
                 alt="MR Technology" 
                 animate={{ scale: [1, 1.025, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="object-contain transition-all duration-700 relative z-10 w-[320px] md:w-[420px]"
                 style={{ 
                   mixBlendMode: 'screen',
                   WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)', 
                   maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)' 
                 }}
              />
          </div>

          {/* Legend - Leyenda ecosistema blended into the page */}
          <div className="relative mb-12 flex justify-center w-full">
             <img
               src="/Leyenda ecosistema.png"
               alt="Ecosistema by MR Tech"
               className="h-14 md:h-[4.5rem] w-auto object-contain relative z-10 pointer-events-none select-none"
               style={{
                 mixBlendMode: 'screen',
                 WebkitMaskImage: 'radial-gradient(ellipse 88% 82% at 50% 50%, black 60%, transparent 100%)',
                 maskImage: 'radial-gradient(ellipse 88% 82% at 50% 50%, black 60%, transparent 100%)',
               }}
             />
             {/* Sparkle constellation around the legend - white & teal */}
             <motion.div className="absolute -top-5 right-[30%] w-5 h-5 text-white z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 180, 360], scale: [0.4, 1.6, 0.4], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_18px_rgba(255,255,255,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute -top-3 left-[28%] w-4 h-4 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [180, 360, 540], scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3.1, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_14px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute -bottom-3 right-[25%] w-6 h-6 text-white z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 90, 180], scale: [0.5, 1.8, 0.5], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.7, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_22px_rgba(255,255,255,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute -bottom-4 left-[22%] w-3 h-3 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [360, 180, 0], scale: [0.5, 1.4, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute top-1 -left-4 w-3 h-3 text-white z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [90, 270, 450], scale: [0.4, 1.2, 0.4], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
             <motion.div className="absolute top-1 -right-4 w-4 h-4 text-[#00a2b8] z-20 pointer-events-none mix-blend-screen" animate={{ rotate: [0, 120, 240], scale: [0.5, 1.6, 0.5], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.9, repeat: Infinity, ease: "linear" }}><svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_16px_rgba(0,162,184,1)]"><path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" /></svg></motion.div>
          </div>
          {/* Subtitle below Ecosistema legend */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-center text-white text-xs md:text-base font-bold tracking-[0.2em] mb-10 max-w-3xl mx-auto px-4 leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            A disposición todas nuestras <span className="text-[#00ffd0]">SOLUCIONES</span> para enfrentar los desafíos de tu <span className="text-[#00ffd0]">EMPRESA</span> con <span className="text-[#00ffd0]">ESTRATEGIA</span>, <span className="text-[#00ffd0]">INNOVACIÓN</span> y <span className="text-[#00ffd0]">COMPROMISO</span>. Porque tu <span className="text-[#00ffd0]">DESAFÍO</span> es el motor de nuestro <span className="text-[#00ffd0]">TRABAJO</span>.
          </motion.p>
          {/* Click-outside wrapper: clicking the background area deselects */}
          <div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-14 px-4 mb-20 w-full min-h-[12rem] md:min-h-[16rem] relative"
            onClick={() => setSelectedEcosistema(null)}
          >
            {[
              { src: "1. Logo Mini Tecnologia Informatica (IT).png", alt: "Tecnología Informática (IT)", label: "TECNOLOGÍA\nINFORMÁTICA (IT)" },
              { src: "2. Logo Mini Alianzas Software ERP.png", alt: "Software ERP / SAAS Empresarial", label: "SOFTWARE ERP /\nSAAS EMPRESARIAL" },
              { src: "3. Logo Mini Conectividad Satelital.png", alt: "Conectividad Satelital", label: "CONECTIVIDAD\nSATELITAL" },
              { src: "4. Logo Mini Inteligencia Artificial.png", alt: "Inteligencia Artificial", label: "INTELIGENCIA\nARTIFICIAL" },
              { src: "5. Logo Mini CIberseguridad.png", alt: "Ciberseguridad", label: "CIBER\nSEGURIDAD" }
            ].map((logo, i) => {
              const isSelected = selectedEcosistema === i;
              const isOther = selectedEcosistema !== null && !isSelected;
              return (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    opacity: isOther ? 0 : 1,
                    scale: isSelected ? 1.5 : 1,
                    zIndex: isSelected ? 30 : 10,
                  }}
                  transition={{
                    y: { duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4, ease: "easeInOut" },
                    scale: { duration: 0.45, ease: "easeOut" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEcosistema(isSelected ? null : i);
                  }}
                  className="flex flex-col items-center justify-center cursor-pointer relative"
                  style={{ pointerEvents: isOther ? 'none' : 'auto' }}
                >
                  {/* Glow halo behind the logo when selected */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,162,184,0.45) 0%, rgba(0,162,184,0.15) 50%, transparent 80%)',
                        filter: 'blur(18px)',
                        transform: 'scale(1.6)',
                      }}
                    />
                  )}
                  <img
                    src={`/${logo.src}`}
                    alt={logo.alt}
                    className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10"
                    style={{
                      mixBlendMode: 'screen',
                      filter: isSelected
                        ? 'drop-shadow(0 0 50px rgba(0,162,184,1)) brightness(1.2)'
                        : 'drop-shadow(0 15px 25px rgba(0,0,0,0.7))',
                      WebkitMaskImage: isSelected
                        ? 'radial-gradient(ellipse 75% 75% at 50% 50%, black 35%, rgba(0,0,0,0.5) 60%, transparent 85%)'
                        : 'none',
                      maskImage: isSelected
                        ? 'radial-gradient(ellipse 75% 75% at 50% 50%, black 35%, rgba(0,0,0,0.5) 60%, transparent 85%)'
                        : 'none',
                    }}
                  />
                  {/* Logo label */}
                  <div className="relative z-10 mt-2 text-center pointer-events-none">
                    {logo.label.split('\n').map((line, li) => (
                      <div
                        key={li}
                        className={`text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${
                          li === 0 ? 'text-[#00a2b8]' : 'text-white/70'
                        }`}
                        style={{ fontFamily: "'Orbitron', monospace", textShadow: isSelected ? '0 0 10px rgba(0,162,184,0.8)' : 'none' }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Centered Navigation Links & Portals */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-24 px-4 w-full max-w-6xl">
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
                  <img src={`/nav_${id === 'antenas' ? 'equipos' : id === 'planes' ? 'planes' : 'servicios'}.png`} alt={id} className="w-auto h-24 md:h-28 object-contain relative z-10 transition-all duration-500 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)]" />
                </div>
                <span className={`text-sm md:text-base font-black uppercase tracking-widest ${id === 'antenas' ? 'text-blue-400' : id === 'planes' ? 'text-teal-400' : 'text-purple-400'} drop-shadow-md`}>
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
                  <img src="/card_portal.png" alt="Portal" className="w-auto h-20 md:h-24 object-contain relative z-10 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)] transition-all duration-500" />
                </div>
                <span className="text-sm md:text-base font-black uppercase tracking-widest text-blue-400 drop-shadow-md">Portal Clientes</span>
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
                  <img src="/card_noc.png" alt="Soporte" className="w-auto h-20 md:h-24 object-contain relative z-10 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)] transition-all duration-500" />
                </div>
                <span className="text-sm md:text-base font-black uppercase tracking-widest text-indigo-400 drop-shadow-md">Portal Admin</span>
            </motion.a>
          </div>

          <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 max-w-6xl leading-[1.2] md:leading-[1.1] text-white drop-shadow-lg">
            Conectividad sin fronteras con Starlink para tu empresa
          </h1>
          <p className="text-base md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mb-8 md:mb-12 leading-relaxed font-bold px-4 md:px-0">
            Internet satelital de alta velocidad y máxima estabilidad. Equipamiento desde <strong className="text-blue-600 font-bold">$300.000</strong> y abonos desde <strong className="text-blue-600 font-bold">$90.000</strong> CON FINANCIACION PROPIA. Respaldado por soporte técnico presencial en toda Mendoza.
          </p>

          <CoverageSearch onCoverageConfirmed={(address) => openLeadModal("INFO", "Consulta por Cobertura", `Solicito información para instalación satelital en la dirección validada: ${address}`)} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto px-4 md:px-0 mt-8 relative z-10 justify-center">
            {/* Card 1: Portal B2B Clientes */}
            <motion.a
              href="https://clientes.mrtechnology.it.com"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#020617] hover:border-cyan-500/60 shadow-lg hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] dark:hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-300 flex flex-col justify-center items-center cursor-pointer w-full max-w-xs mx-auto aspect-[1.5]"
            >
              <img
                src="/logo_portal_b2b.png"
                alt="Logo Portal B2B"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Glossy sheen reflection */}
              <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-1000 ease-out group-hover:translate-x-[120%]" />
              {/* Color overlay hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.a>

            {/* Card 2: Comprar Hardware */}
            <motion.a
              href="#antenas"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#020617] hover:border-blue-500/60 shadow-lg hover:shadow-[0_0_35px_rgba(37,99,235,0.45)] dark:hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transition-all duration-300 flex flex-col justify-center items-center cursor-pointer w-full max-w-xs mx-auto aspect-[1.5]"
            >
              <img
                src="/comprar_hardware.png"
                alt="Comprar Hardware"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Glossy sheen reflection */}
              <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-1000 ease-out group-hover:translate-x-[120%]" />
              {/* Color overlay hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.a>

            {/* Card 3: Soporte Técnico */}
            <motion.a
              href="https://admin.mrtechnology.it.com"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#020617] hover:border-pink-500/60 shadow-lg hover:shadow-[0_0_35px_rgba(236,72,153,0.45)] dark:hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all duration-300 flex flex-col justify-center items-center cursor-pointer w-full max-w-xs mx-auto aspect-[1.5]"
            >
              <img
                src="/soporte_tecnico.png"
                alt="Soporte Técnico"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Glossy sheen reflection */}
              <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-1000 ease-out group-hover:translate-x-[120%]" />
              {/* Color overlay hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.a>
          </div>
        </motion.div>


      </section>

      {/* Hardware Section */}
      <section id="antenas" className="relative z-10 py-10 bg-white/40 dark:bg-[#020617]/40 backdrop-blur-xl border-y border-slate-300/80 dark:border-slate-800/80 px-6 -mt-16">
         <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-slate-900 dark:text-white drop-shadow-xl">
              Que tipo de proyecto queres realizar ? <span className="text-pink-500">HOGAREÑO, RESIDENCIAL, EMPRESA, MOVILIDAD</span> y en base al mismo podes elegir tu <span className="text-blue-500">antena a medida</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8" onMouseLeave={() => setHoveredAntenna(null)}>
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
      <section id="planes" className="relative z-10 pt-4 pb-32 px-6 max-w-7xl mx-auto">

         {/* Ideal Para Section */}
         <div className="mt-0 pt-2 text-center max-w-6xl mx-auto">
             <img src="/ideal.png" alt="Ideal Para" className="w-full max-w-2xl mx-auto h-auto object-contain mb-4 border-none bg-transparent drop-shadow-2xl" style={{ maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 50%, transparent 100%)' }} />
             <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-3 md:gap-6">
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0 }} className="flex flex-col items-center group relative cursor-pointer">
                    <div className="absolute inset-2 bg-[#fbbf24]/0 group-hover:bg-[#fbbf24]/50 blur-2xl rounded-full transition-all duration-700 pointer-events-none z-0" />
                    <img src="/ideal bodegas.png" alt="Bodegas" className="w-24 md:w-36 lg:w-44 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                 </motion.div>
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }} className="flex flex-col items-center group relative cursor-pointer">
                    <div className="absolute inset-2 bg-[#fbbf24]/0 group-hover:bg-[#fbbf24]/50 blur-2xl rounded-full transition-all duration-700 pointer-events-none z-0" />
                    <img src="/ideal hoteles.png" alt="Hoteles" className="w-24 md:w-36 lg:w-44 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                 </motion.div>
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.4 }} className="flex flex-col items-center group relative cursor-pointer">
                    <div className="absolute inset-2 bg-[#fbbf24]/0 group-hover:bg-[#fbbf24]/50 blur-2xl rounded-full transition-all duration-700 pointer-events-none z-0" />
                    <img src="/ideal empresariales.png" alt="Empresariales" className="w-24 md:w-36 lg:w-44 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                 </motion.div>
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.1 }} className="flex flex-col items-center group relative cursor-pointer">
                    <div className="absolute inset-2 bg-[#fbbf24]/0 group-hover:bg-[#fbbf24]/50 blur-2xl rounded-full transition-all duration-700 pointer-events-none z-0" />
                    <img src="/ideal gastronomia.png" alt="Polos Gastronómicos" className="w-24 md:w-36 lg:w-44 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                 </motion.div>
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }} className="flex flex-col items-center group relative cursor-pointer">
                    <div className="absolute inset-2 bg-[#fbbf24]/0 group-hover:bg-[#fbbf24]/50 blur-2xl rounded-full transition-all duration-700 pointer-events-none z-0" />
                    <img src="/ideal rurales.png" alt="Proyectos Rurales" className="w-24 md:w-36 lg:w-44 h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 border-none bg-transparent drop-shadow-xl" style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)' }} />
                 </motion.div>
             </div>
         </div>
 
         <div className="mt-16 bg-gradient-to-br from-blue-100 via-slate-100 to-slate-200 dark:from-blue-900/60 dark:via-slate-900/80 dark:to-slate-950/90 backdrop-blur-xl border border-blue-500/40 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_0_60px_rgba(37,99,235,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 dark:opacity-20 mix-blend-overlay" />
            <div className="relative z-10 flex-1 drop-shadow-md">
               <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] uppercase tracking-[0.1em] mb-4" style={{ fontFamily: "'Orbitron', 'Syncopate', sans-serif" }}>Proyectos Empresariales a Medida</h3>
               <div className="text-slate-800 dark:text-slate-200 max-w-4xl leading-relaxed text-lg font-light space-y-4">
                  <p>Diseñado para organizaciones de gran escala y entornos corporativos de alta complejidad.</p>
                  <p>Para este tipo de implementaciones, realizamos un relevamiento inicial exhaustivo que nos permite comprender en profundidad la estructura, los procesos y los requerimientos específicos de cada empresa. A partir de este análisis, diseñamos un mapa topológico personalizado que define con precisión la arquitectura necesaria, optimizando recursos, rendimiento y escalabilidad.</p>
                  <p>De esta manera, determinamos exactamente la infraestructura, capacidad de almacenamiento (GB) y recursos tecnológicos que demanda cada proyecto, garantizando una solución exclusiva, alineada con los objetivos estratégicos y operativos de la organización.</p>
               </div>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col items-center gap-5 mt-8 md:mt-0">

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

      {/* IT Consulting Services */}
      <section id="consultoria" className="relative z-10 py-32 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-xl border-t border-slate-300 dark:border-slate-800 px-6 scroll-mt-20">
         <div id="hablamos" className="absolute -top-20" />
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 drop-shadow-lg">
               <h2 className="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase">El Diferencial MR</h2>
               <h3 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">Consultoría y Actividades IT Hard & Soft</h3>
               <p className="text-slate-800 dark:text-slate-200 max-w-2xl mx-auto text-xl font-light mb-10">Ofrecemos soporte integral y mantenimiento preventivo/activo de nivel gerencial. Su proveedor no es solo un distribuidor, es todo su equipo de Infraestructura y Redes.</p>

               <div className="flex flex-col items-center gap-6 mt-12 mb-8">
                 <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-sm uppercase tracking-widest">HABLAMOS !!!</h4>
                 <div className="flex gap-6 justify-center">
                   {/* LinkedIn */}
                   <a 
                      href="https://www.linkedin.com/in/mrtech2026" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="relative w-16 h-16 rounded-full border-2 border-[#0189dd] bg-gradient-to-b from-[#009bf2] to-[#006ca8] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(1,137,221,0.9)] hover:scale-110 active:scale-95 group shrink-0 overflow-hidden"
                    >
                      <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#0189dd] opacity-40 animate-pulse pointer-events-none" />
                      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                      <img src="/social_linkedin_v3.png" alt="LinkedIn" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </a>
                   {/* Instagram */}
                   <a 
                      href="https://www.instagram.com/mrtechnologymza/?hl=es" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="relative w-16 h-16 rounded-full border-2 border-[#d631b9] bg-gradient-to-b from-[#e53fa3] to-[#b6248d] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(214,49,185,0.9)] hover:scale-110 active:scale-95 group shrink-0 overflow-hidden"
                    >
                      <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#d631b9] opacity-40 animate-pulse pointer-events-none" />
                      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                      <img src="/social_instagram_fixed_v1.png" alt="Instagram" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </a>
                   {/* WhatsApp */}
                   <a 
                      href="https://wa.me/5492616518318" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="relative w-16 h-16 rounded-full border-2 border-[#01c164] bg-gradient-to-b from-[#02e779] to-[#019c50] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(1,193,100,0.9)] hover:scale-110 active:scale-95 group shrink-0 overflow-hidden"
                    >
                      <span className="absolute inset-0 rounded-full shadow-[0_0_15px_#01c164] opacity-40 animate-pulse pointer-events-none" />
                      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-20 -translate-x-[120%] transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                      <img src="/social_whatsapp_fixed_v1.png" alt="WhatsApp" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </a>
                 </div>
               </div>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
                hidden: {}
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
               {[
                 { 
                   title: "Arquitectura & Relevamiento", 
                   icon: "architecture", 
                   color: "blue",
                   items: [
                     "Relevamiento inicial del parque informático.",
                     "Análisis de Topología y Tipología de la RED interna.",
                     "Plano Físico y Digital del Armado Estructural.",
                     "Documentación objetiva de la red."
                   ]
                 },
                 { 
                   title: "Centro de Operaciones", 
                   icon: "noc_center", 
                   color: "indigo",
                   items: [
                     "Operador Técnico / Soporte Especializado.",
                     "Analista SOC (con foco estricto en redes).",
                     "Especialista en monitorización constante.",
                     "Resolución y mitigación de incidentes."
                   ]
                 },
                 { 
                   title: "Ingeniería & Soporte", 
                   icon: "engineering", 
                   color: "emerald",
                   items: [
                     "Técnico de soporte y Field Network Engineer.",
                     "Instalador de Fibra Óptica certificado.",
                     "Técnico de cableado estructurado IT.",
                     "Protocolos de mitigación in-situ."
                   ]
                 }
               ].map((service, i) => (
                 <Card key={i} variant="glass" className="p-10 group">
                    <div className="h-24 w-24 mb-8 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                       <img src={`/icon_${service.icon}.png`} alt={service.title} className={`w-full h-full object-contain drop-shadow-[0_0_15px_rgba(var(--${service.color}-shadow),0.4)]`} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 drop-shadow-sm">{service.title}</h4>
                    <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-4 font-medium">
                       {service.items.map((item, j) => (
                         <li key={j} className="flex items-start gap-3">
                           <span className={`text-${service.color}-400 block shrink-0 drop-shadow-sm`}>•</span> 
                           {item}
                         </li>
                       ))}
                    </ul>
                 </Card>
               ))}
            </motion.div>
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-100/90 dark:bg-[#000205]/90 backdrop-blur-3xl py-20 px-6 border-t border-slate-300 dark:border-white/5 text-center text-slate-500">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
         <div className="flex flex-wrap justify-center items-center gap-y-10 gap-x-8 md:gap-x-12 mb-16 relative z-10">
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/logo.jpg" className="h-14 md:h-16 w-auto rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border-2 border-slate-700 group-hover:border-blue-500 shadow-xl object-contain" alt="MR Technology" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-400 transition-colors font-medium">MR Technology</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/footer_ciberseguridad.png" className="h-14 md:h-16 w-auto rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-slate-800 group-hover:border-blue-500/50 shadow-lg object-contain" alt="Ciberseguridad" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-400 transition-colors font-medium">Ciberseguridad</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/footer_ia.png" className="h-14 md:h-16 w-auto rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-slate-800 group-hover:border-cyan-500/50 shadow-lg object-contain" alt="Inteligencia Artificial" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-cyan-700 dark:text-cyan-400 transition-colors font-medium">Inteligencia Artificial</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/footer_informatica.png" className="h-14 md:h-16 w-auto rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-slate-800 group-hover:border-indigo-500/50 shadow-lg object-contain" alt="Informática" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-400 transition-colors font-medium">Tecnología Informática</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/footer_tech_master.png" className="h-14 md:h-16 w-auto rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-slate-800 group-hover:border-orange-500/50 shadow-lg object-contain" alt="Tech Master" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-orange-400 transition-colors font-medium">Tech Master</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/footer_academia.png" className="h-14 md:h-16 w-auto rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-slate-800 group-hover:border-red-500/50 shadow-lg object-contain" alt="Academia" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-red-400 transition-colors font-medium">Academia y Formación</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <img src="/footer_alianzas.png" className="h-14 md:h-16 w-auto rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 border border-slate-800 group-hover:border-emerald-500/50 shadow-lg object-contain" alt="Alianzas Estratégicas" />
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-400 transition-colors font-medium">Alianzas Estratégicas</span>
            </div>
         </div>
         <p className="tracking-[0.3em] mb-4 text-slate-900 dark:text-white font-black text-2xl drop-shadow-lg uppercase">Ciudad de Mendoza - Zona Cuyo</p>
         <p className="tracking-[0.2em] mb-8 text-blue-400 font-bold text-sm uppercase drop-shadow-sm">Partner Tecnológico Starlink B2B</p>
         <p className="mb-12 max-w-xl mx-auto font-light text-slate-600 dark:text-slate-400">Consulte disponibilidad y velocidades en su Zona. Implementación física, administrativa e IT especializada nivel 3.</p>
         <div className="flex justify-center gap-10 text-sm mb-16 font-semibold">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Términos B2B</a>
            <a href="#" className="hover:text-blue-400 transition-colors">SLA de Servicios Técnicos</a>
         </div>
         <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">© 2026 MR Technology. Todos los derechos reservados.</p>
      </footer>
      </main>
  );
}
