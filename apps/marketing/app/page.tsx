"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import LeadFormModal from "../components/LeadFormModal";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* Nuestro interactivo fondo del espacio */}
      <SpaceBackground />

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

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#020617]/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-1" : "bg-transparent py-6"}`}>
        <div className={`max-w-7xl mx-auto px-6 transition-all duration-500 flex items-center justify-between ${scrolled ? "h-20 md:h-24" : "h-32 md:h-44"}`}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 group cursor-pointer mt-2 md:mt-0"
          >
             <div className="relative shrink-0">
               <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
               <img src="/Logo_new.png" alt="MR Technology" className={`rounded-xl border-2 border-slate-700 relative z-10 shadow-lg object-contain transition-all duration-500 ${scrolled ? "w-16 h-16 md:w-20 md:h-20" : "w-24 h-24 md:w-[140px] md:h-[140px]"}`} />
             </div>
             <div className="flex flex-col gap-2">
               <div className={`flex gap-4 text-slate-400 transition-opacity duration-500 ${scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
                 {/* Social Icons */}
                 <a href="https://www.linkedin.com/in/mrtech2026" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 </a>
                 <a href="https://www.instagram.com/mrtechnologymza/?hl=es" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.805a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
                 </a>
                 <a href="https://wa.me/5492616518318" target="_blank" rel="noreferrer" className="hover:text-green-500 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 </a>
               </div>
             </div>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {["antenas", "planes", "consultoria"].map((id, index) => (
              <motion.a 
                key={id}
                href={`#${id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="group flex flex-col items-center gap-1 transition-all duration-500 hover:scale-110"
              >
                <img src={`/nav_${id === 'antenas' ? 'equipos' : id === 'planes' ? 'planes' : 'servicios'}.png`} alt={id} className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-10" : "h-16 md:h-20"}`} />
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${scrolled ? "opacity-0 h-0" : "opacity-100"} ${id === 'antenas' ? 'text-blue-400/80' : id === 'planes' ? 'text-teal-400/80' : 'text-purple-400/80'}`}>
                  {id === 'antenas' ? 'Equipos' : id === 'planes' ? 'Planes' : 'Servicios IT'}
                </span>
              </motion.a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 items-center"
          >
             <Link href={process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || "#"} className="group">
                <div className="flex flex-col items-center gap-1 transition-all duration-500 hover:scale-110">
                   <img src="/card_portal.png" alt="Portal" className={`w-auto object-contain drop-shadow-xl transition-all duration-500 ${scrolled ? "h-12" : "h-16 md:h-24"}`} />
                   <span className={`text-[9px] font-bold uppercase tracking-widest text-blue-400/80 transition-all duration-500 ${scrolled ? "opacity-0 h-0" : "opacity-100"}`}>Portal Clientes</span>
                </div>
             </Link>
             <Link href={process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "#"} className="group">
                <div className="flex-col items-center gap-1 transition-all duration-500 hover:scale-110 hidden sm:flex">
                   <img src="/card_noc.png" alt="Soporte" className={`w-auto object-contain drop-shadow-xl transition-all duration-500 ${scrolled ? "h-12" : "h-16 md:h-24"}`} />
                   <span className={`text-[9px] font-bold uppercase tracking-widest text-indigo-400/80 transition-all duration-500 ${scrolled ? "opacity-0 h-0" : "opacity-100"}`}>Portal Admin</span>
                </div>
             </Link>
          </motion.div>
        </div>
      </nav>

      <LeadFormModal 
         isOpen={isLeadModalOpen} 
         onClose={() => setIsLeadModalOpen(false)} 
         planInfo={selectedPlan} 
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-56 pb-24 md:pt-64 md:pb-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-6xl leading-[1.1] text-white">
            Internet SATÉLITAL Rapido & Confiable junto a Starlink<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 animate-gradient drop-shadow-2xl text-3xl md:text-5xl lg:text-6xl">
              y en el lugar que tu empresa se encuentre, sin limites geográficos.
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed font-light">
            Alta velocidad estable. Hardware revolucionario desde <strong className="text-white font-bold">$300.000</strong> con abonos desde <strong className="text-white font-bold">$90.000</strong>. Respaldado por el mejor servicio técnico presencial en Mendoza.
          </p>

          <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-5 w-full max-w-5xl mx-auto">
            <Link href={process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || "#"}>
              <Button size="lg" variant="premium" className="group flex gap-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Portal B2B Clientes
              </Button>
            </Link>

            <a href="#antenas">
              <Button size="lg" variant="glow" className="group flex gap-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                Comprar Hardware
              </Button>
            </a>

            <Link href={process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "#"}>
              <Button size="lg" variant="outline" className="group flex gap-3">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                 Soporte / Centro Técnico
              </Button>
            </Link>
          </div>
        </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="mt-28 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center w-full max-w-6xl relative z-10 border-t border-slate-800/50 pt-16"
          >
            {[
              { img: "uptime", val: "+99.9%", label: "Tiempo de Actividad", color: "blue-500" },
              { img: "plugplay", val: "Plug & Play", label: "Instalación Sencilla", color: "cyan-500" },
              { img: "extreme", val: "Extremo", label: "Resiste Incidencias", color: "indigo-500" },
              { img: "unlimited", val: "Ilimitados", label: "Datos Alta Velocidad", color: "teal-500" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex flex-col items-center group"
              >
                <div className="w-24 h-24 mb-6 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                   <img 
                    src={`/icon_${stat.img}.png`} 
                    alt={stat.label} 
                    className="w-full h-full object-contain" 
                   />
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">{stat.val}</h4>
                <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
      </section>

      {/* Hardware Section */}
      <section id="antenas" className="relative z-10 py-24 bg-[#020617]/40 backdrop-blur-xl border-y border-slate-800/80 px-6">
         <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
         <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-white drop-shadow-xl">Ingeniería en Hardware Satelital</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {/* Mini X */}
               <Card variant="glass" className="p-8 flex flex-col relative overflow-hidden">
                  <div className="relative z-10 flex-grow">
                     <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-blue-600/5 flex items-center justify-center border-2 border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all shrink-0">
                           <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-bold text-white tracking-tight">Antena Mini X</h3>
                           <span className="text-slate-500 text-base mt-1 font-medium">Compacta · Potente · Portátil</span>
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

                     <p className="text-white mb-10 leading-relaxed text-base md:text-lg font-medium drop-shadow-md">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Diseño y dinámica.
                     </p>
                     
                     <div className="bg-black/40 rounded-[2rem] p-6 border border-slate-800/50 mb-2">
                        <div className="flex justify-between items-end mb-6 border-b border-slate-800/80 pb-6">
                           <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Importe</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-4xl font-black text-white">$300.000</span>
                              </div>
                              <p className="text-[9px] text-slate-600 uppercase mt-1 tracking-wider">+ IVA (Efectivo)</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em] mb-2">3 Cuotas Sin Interés</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-2xl font-bold text-blue-500">$100.000</span>
                              </div>
                              <p className="text-[9px] text-slate-600 uppercase mt-1 tracking-wider">+ IVA</p>
                           </div>
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

               {/* Estándar V4 */}
               <Card variant="glass" className="p-8 flex flex-col relative overflow-hidden group">
                  <div className="relative z-10 flex-grow mt-4">
                     <div className="flex items-center gap-6 mb-10">
                        <div className="w-24 h-24 rounded-[1.8rem] bg-cyan-500/5 flex items-center justify-center border-2 border-cyan-500 text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)] shrink-0">
                           <svg className="w-12 h-12 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="4" y="6" width="16" height="5" rx="1" />
                              <rect x="4" y="14" width="16" height="5" rx="1" />
                              <circle cx="7" cy="8.5" r="0.5" fill="currentColor" />
                              <circle cx="7" cy="16.5" r="0.5" fill="currentColor" />
                           </svg>
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-bold text-white tracking-tight">Antena Estándar V4</h3>
                           <span className="text-cyan-400 text-lg mt-1 font-medium">+ Router WiFi 6</span>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-3 mb-10">
                        {["WiFi 6", "Alta Potencia", "Estable"].map((tag, i) => (
                           <div key={i} className="bg-black/60 border border-cyan-900/50 px-4 py-2 rounded-xl flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{tag}</span>
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
                        <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                     </div>

                     <p className="text-white mb-10 leading-relaxed text-base md:text-lg font-medium drop-shadow-md">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Prioridad Satelital, diseño y robustez.
                     </p>
                     
                     <div className="bg-cyan-500/10 rounded-[2rem] p-6 border border-cyan-500/20 mb-2">
                        <div className="flex justify-between items-end mb-6 border-b border-cyan-900/40 pb-6">
                           <div>
                              <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] mb-2">Importe</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-4xl font-black text-white">$500.000</span>
                              </div>
                              <p className="text-[9px] text-cyan-500/50 uppercase mt-1 tracking-wider">+ IVA (Efectivo)</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] text-cyan-500 font-bold uppercase tracking-[0.1em] mb-2">3 Cuotas Sin Interés</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-2xl font-bold text-cyan-400">$166.666</span>
                              </div>
                              <p className="text-[9px] text-cyan-500/50 uppercase mt-1 tracking-wider">+ IVA</p>
                           </div>
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

               {/* Itinerante */}
               <Card variant="glass" className="p-8 group shadow-2xl flex flex-col relative overflow-hidden">
                  <div className="relative z-10 flex-grow">
                     <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-green-600/5 flex items-center justify-center border-2 border-green-500/30 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all shrink-0">
                           <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex flex-col">
                           <h3 className="text-3xl font-bold text-white tracking-tight">Antena Itinerante</h3>
                           <span className="text-slate-500 text-base mt-1 font-medium">Conexión en movimiento</span>
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

                     <p className="text-white mb-10 leading-relaxed text-base md:text-lg font-medium drop-shadow-md">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Diseño portátil, ideal para sectores rurales.
                     </p>
                     
                     <div className="bg-black/40 rounded-[2rem] p-6 border border-slate-800/50 mb-2 mt-auto">
                        <div className="flex justify-between items-end mb-6 border-b border-slate-800/80 pb-6">
                           <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Importe</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-4xl font-black text-white">$300.000</span>
                              </div>
                              <p className="text-[9px] text-slate-600 uppercase mt-1 tracking-wider">+ IVA (Efectivo)</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em] mb-2">3 Cuotas Sin Interés</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-2xl font-bold text-green-500">$100.000</span>
                              </div>
                              <p className="text-[9px] text-slate-600 uppercase mt-1 tracking-wider">+ IVA</p>
                           </div>
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
            </div>
         </div>
      </section>

         {/* Instalación Section */}
         <div className="max-w-7xl mx-auto mt-20 bg-gradient-to-br from-[#1a1300]/80 to-[#0a0700]/90 border border-yellow-600/40 rounded-3xl p-10 backdrop-blur-md shadow-[0_0_50px_rgba(202,138,4,0.1)]">
            <div className="flex flex-col md:flex-row gap-10 items-center">
               <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50 text-yellow-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-yellow-500 tracking-tight">INSTALACIÓN</h3>
                  </div>
                  <p className="text-xl text-yellow-100/70 font-light max-w-lg leading-relaxed">
                     El importe incluye instalación de hardware + configuración completa de Software Satelital.
                  </p>
               </div>
               
               <div className="flex-1 w-full grid sm:grid-cols-2 gap-6">
                  <div className="bg-[#020617]/50 rounded-2xl p-6 border border-yellow-600/30 hover:border-yellow-500 transition-colors">
                     <p className="text-yellow-400 font-bold mb-1">Instalación Mini</p>
                     <p className="text-xs text-slate-400 mb-6">Personal calificado, certificado y profesional</p>
                     <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex justify-between items-baseline border-b border-yellow-900/50 pb-3">
                           <span className="text-xs text-yellow-600/80 font-bold">IMPORTE</span>
                           <span className="text-2xl font-black text-white">$150.000<span className="text-[10px] text-yellow-600/80 ml-1 font-normal uppercase">+ IVA<br/>(Efectivo)</span></span>
                        </div>
                        <div className="flex justify-between items-baseline">
                           <span className="text-xs text-yellow-600/80 font-bold">O 3 CUOTAS</span>
                           <span className="text-xl font-bold text-yellow-500">$60.000<span className="text-[10px] text-yellow-600/80 ml-1 font-normal uppercase">+ IVA</span></span>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#020617]/50 rounded-2xl p-6 border border-yellow-600/30 hover:border-yellow-500 transition-colors">
                     <p className="text-yellow-400 font-bold mb-1">Estándar V4 Premium</p>
                     <p className="text-xs text-slate-400 mb-6">Personal calificado, certificado y profesional</p>
                     <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex justify-between items-baseline border-b border-yellow-900/50 pb-3">
                           <span className="text-xs text-yellow-600/80 font-bold">IMPORTE</span>
                           <span className="text-2xl font-black text-white">$200.000<span className="text-[10px] text-yellow-600/80 ml-1 font-normal uppercase">+ IVA<br/>(Efectivo)</span></span>
                        </div>
                        <div className="flex justify-between items-baseline">
                           <span className="text-xs text-yellow-600/80 font-bold">O 3 CUOTAS</span>
                           <span className="text-xl font-bold text-yellow-500">$80.000<span className="text-[10px] text-yellow-600/80 ml-1 font-normal uppercase">+ IVA</span></span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>


      {/* Pricing / Planes Section */}
      <section id="planes" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-20 drop-shadow-lg">
            <h2 className="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase">Planes de Servicio Mensual</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">Planes MR Technology</h3>
            <p className="text-slate-300 max-w-2xl mx-auto text-xl font-light">Internet diseñado para cada necesidad y rubro. Respaldado con consultoría especializada en IT, mantención y monitoreo contínuo de su red.</p>
         </div>

         <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Plan Básico Mini */}
            <Card variant="glass" className="p-8 flex flex-col group">
               <h4 className="text-2xl font-bold text-blue-300 mb-2">Plan Básico Mini</h4>
               <div className="mb-6 h-1 w-10 bg-blue-900 rounded-full group-hover:w-16 transition-all group-hover:bg-blue-500" />
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">IMPORTE Mensual</p>
               <p className="text-5xl font-black text-white mb-2 tracking-tight">$90.000</p>
               <p className="text-xs text-slate-400 mb-8">+ IVA</p>
               <ul className="text-sm text-slate-300 space-y-4 mb-10 flex-grow font-medium">
                  {["Servicio Mensual", "Soporte remoto ilimitado", "Consultoría y Asesoramiento MR"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
               </ul>
                <Button 
                  variant="outline"
                  onClick={() => openLeadModal("PLAN", "Plan Básico Mini", "Adquisición del plan mensual básico mini.")}
                  className="w-full"
                >
                  Seleccionar Plan
                </Button>
            </Card>

            {/* Plan Básico Estándar V4 */}
            <Card variant="glass" className="p-8 flex flex-col shadow-[0_0_40px_rgba(37,99,235,0.25)] border-blue-500 transform lg:-translate-y-4 hover:-translate-y-6 transition-transform relative">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 text-xs font-black rounded-full tracking-widest uppercase shadow-[0_0_15px_rgba(37,99,235,0.8)]">RECOMENDADO</div>
               <h4 className="text-2xl font-bold text-blue-400 mb-2 mt-2">Plan Básico Estándar V4</h4>
               <div className="mb-6 h-1 w-12 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
               <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">IMPORTE Mensual</p>
               <p className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">$120.000</p>
               <p className="text-xs text-blue-200/50 mb-8">+ IVA</p>
               <ul className="text-sm text-slate-200 space-y-4 mb-10 flex-grow font-medium">
                  {["Servicio Mensual", "Soporte remoto ilimitado", "Consultoría y Asesoramiento MR"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
               </ul>
                <Button 
                  variant="premium"
                  onClick={() => openLeadModal("PLAN", "Plan Básico Estándar V4", "Suscripción mensual Básico Estándar V4.")}
                  className="w-full text-lg"
                >
                  Seleccionar Plan
                </Button>
            </Card>

            {/* Plan Full Estándar V4 */}
            <Card variant="glass" className="p-8 flex flex-col border-cyan-500 group">
               <h4 className="text-2xl font-bold text-cyan-400 mb-2">Plan Full Estándar V4</h4>
               <div className="mb-6 h-1 w-10 bg-cyan-900 rounded-full group-hover:w-16 transition-all group-hover:bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
               <p className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">IMPORTE Mensual</p>
               <p className="text-5xl font-black text-white mb-2 tracking-tight">$200.000</p>
               <p className="text-xs text-cyan-400/50 mb-8">+ IVA</p>
               <ul className="text-sm text-slate-300 space-y-4 mb-10 flex-grow font-medium">
                  <li className="flex items-start gap-3 text-white"><svg className="w-5 h-5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Servicio Mensual</li>
                  <li className="flex items-start gap-3 text-white"><svg className="w-5 h-5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Soporte remoto ilimitado</li>
                  <li className="flex items-start gap-3 text-white"><svg className="w-5 h-5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Consultoría y Asesoramiento MR</li>
                  <li className="flex items-start gap-3 text-cyan-300 font-bold"><svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>1 Visita Presencial Mensual</li>
                  <li className="flex items-start gap-3 text-cyan-300 font-bold"><svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Mantenimiento Preventivo y Activo</li>
               </ul>
                <Button 
                  variant="glow" 
                  onClick={() => openLeadModal("PLAN", "Plan Full Estándar V4", "Suscripción Premium V4 con visita presencial mensual.")}
                  className="w-full"
                >
                  Cotizar Solución
                </Button>
            </Card>
         </div>

         {/* Ideal Para Section */}
         <div className="mt-24 border-t border-slate-800/80 pt-16 text-center max-w-5xl mx-auto">
             <h3 className="text-2xl font-bold text-white mb-10 tracking-widest uppercase">Ideal Para</h3>
             <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                 <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-2xl">🍷</span></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Bodegas</span>
                 </div>
                 <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-2xl">🏨</span></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Hoteles</span>
                 </div>
                 <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-2xl">🏢</span></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Empresariales</span>
                 </div>
                 <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-2xl">🍽️</span></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center max-w-[120px]">Polos<br/>Gastronómicos</span>
                 </div>
                 <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-600/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-2xl">📡</span></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center max-w-[200px]">Proyectos<br/>Itinerantes Rurales</span>
                 </div>
             </div>
         </div>

         <div className="mt-16 bg-gradient-to-br from-blue-900/60 via-slate-900/80 to-slate-950/90 backdrop-blur-xl border border-blue-500/40 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_0_60px_rgba(37,99,235,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
            <div className="relative z-10 flex-1 drop-shadow-md">
               <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Planes Empresariales</h3>
               <p className="text-slate-200 max-w-4xl leading-relaxed text-lg font-light">Para proyectos a gran escala y corporaciones pesadas. Requerimos efectuar un relevamiento inicial exhaustivo para diseñar el mapa topológico que decanta exactamente en las directrices y cantidad de GB que demanda su exclusividad.</p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto">
               <Button 
                 size="lg" 
                 onClick={() => openLeadModal("QUOTE", "Relevamiento IT - Planes Empresariales", "Solicitud de relevamiento técnico exhaustivo y cotización a medida para corporaciones.")}
                 className="w-full md:w-auto px-10 py-8 text-lg font-black rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)] bg-blue-600 hover:bg-blue-500 transition-transform hover:scale-105 border border-blue-400"
               >
                 Solicitar Relevamiento IT
               </Button>
            </div>
         </div>
      </section>

      {/* IT Consulting Services */}
      <section id="consultoria" className="relative z-10 py-32 bg-[#020617]/50 backdrop-blur-xl border-t border-slate-800 px-6">
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 drop-shadow-lg">
               <h2 className="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase">El Diferencial MR</h2>
               <h3 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">Consultoría y Actividades IT Hard & Soft</h3>
               <p className="text-slate-200 max-w-2xl mx-auto text-xl font-light">Ofrecemos soporte integral y mantenimiento preventivo/activo de nivel gerencial. Su proveedor no es solo un distribuidor, es todo su equipo de Infraestructura y Redes.</p>
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
                    <h4 className="text-2xl font-bold text-white mb-6 drop-shadow-sm">{service.title}</h4>
                    <ul className="text-slate-300 text-sm space-y-4 font-medium">
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
      <footer className="relative z-10 bg-[#000205]/90 backdrop-blur-3xl py-20 px-6 border-t border-white/5 text-center text-slate-500">
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
               <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-cyan-400 transition-colors font-medium">Inteligencia Artificial</span>
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
         <p className="tracking-[0.3em] mb-4 text-white font-black text-2xl drop-shadow-lg uppercase">Ciudad de Mendoza - Zona Cuyo</p>
         <p className="tracking-[0.2em] mb-8 text-blue-400 font-bold text-sm uppercase drop-shadow-sm">Partner Tecnológico Starlink B2B</p>
         <p className="mb-12 max-w-xl mx-auto font-light text-slate-400">Consulte disponibilidad y velocidades en su Zona. Implementación física, administrativa e IT especializada nivel 3.</p>
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
