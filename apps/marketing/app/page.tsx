"use client";
import { Button } from "@repo/ui/button";
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
      ctx.beginPath();
      ctx.moveTo(trainX + trainNodes[0].offsetX, trainY + trainNodes[0].offsetY);
      ctx.lineTo(
         trainX + trainNodes[trainNodes.length-1].offsetX, 
         trainY + trainNodes[trainNodes.length-1].offsetY
      );
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

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
    <main className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* Nuestro interactivo fondo del espacio */}
      <SpaceBackground />

      {/* Halo de luz adicional sobre el fondo, no invasivo */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#020617]/70 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/50 py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer mt-2 md:mt-0">
             <div className="relative shrink-0">
               <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
               <img src="/logo.jpg" alt="MR Technology" className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-slate-700 relative z-10 shadow-lg" />
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-lg md:text-xl tracking-wider text-white leading-tight">MR Technology</span>
               <div className="flex gap-3 mt-1.5 text-slate-500">
                 {/* Website Icon */}
                 <a href="http://www.mrestudioinformatico.com/" target="_blank" rel="noreferrer" title="Website de MR Technology" className="hover:text-blue-400 transition-colors">
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.152c-1.129.566-2.38.971-3.693 1.155v-3.238c1.385.034 2.709.288 3.693 2.083zm-4.957 1.155c-1.313-.184-2.564-.589-3.693-1.155.984-1.795 2.308-2.049 3.693-2.083v3.238zm-1-5.185c-.864.034-1.715.102-2.538.222-.244-1.039-.397-2.136-.456-3.279h2.994v3.057zm-3.042-4.057h-3.05c.088-1.042.273-2.039.544-2.973 1.077.298 2.3.518 3.674.654v2.319zm1.042-4.228c-1.161-.264-2.383-.699-3.535-1.286 1.139-1.424 2.656-2.53 4.417-3.111.455 1.579.803 3.328.984 5.215-.658-.33-1.281-.611-1.866-.818zm1 1.909v-2.146c1.23-.274 2.502-.505 3.864-.67.433 1.116.786 2.327 1.05 3.606h-4.914zm3.042 2.319v3.057h3.051c-.059-1.143-.212-2.24-.456-3.279-.824-.12-1.674-.188-2.539-.222l-.056.444zm-5.042 1.738h-2.994c.059-1.143.212-2.24.456-3.279.824.12 1.674.188 2.538.222v3.057zm4.944-1.738h2.994c-.059-1.143-.212-2.24-.456-3.279-.824.12-1.674.188-2.538.222v3.057zm-1.888-2.147h-4.914c.264-1.279.617-2.49 1.05-3.606 1.362.165 2.634.396 3.864.67v2.936z"/></svg>
                 </a>
                 {/* LinkedIn Icon */}
                 <a href="https://www.linkedin.com/in/mrtech2026/" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-blue-500 transition-colors">
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 </a>
                 {/* Instagram Icon */}
                 <a href="https://www.instagram.com/mrtechnologymza?igsh=MTJ1MmNucWk2dTVrbQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" title="Instagram" className="hover:text-pink-500 transition-colors">
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                 </a>
                 {/* Email Icon */}
                 <a href="mailto:mr@mrestudioinformatico.com" target="_blank" rel="noreferrer" title="mr@mrestudioinformatico.com" className="hover:text-red-500 transition-colors">
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.866l5.6-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/></svg>
                 </a>
                 {/* WhatsApp Icon */}
                 <a href="https://wa.me/5492616518318" target="_blank" rel="noreferrer" title="WhatsApp" className="hover:text-green-500 transition-colors">
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 </a>
               </div>
             </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-300 tracking-wide">
            <a href="#antenas" className="hover:text-blue-400 transition-colors">Equipos Starlink</a>
            <a href="#planes" className="hover:text-blue-400 transition-colors">Planes & Abonos</a>
            <a href="#consultoria" className="hover:text-blue-400 transition-colors">Servicios IT</a>
          </div>
          <div className="flex gap-4">
             <Link href="https://satellite-b2b-client-portal.vercel.app">
                <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 shadow-md rounded-full px-5 transition-all hover:scale-105 active:scale-95 bg-slate-900/50 backdrop-blur-md text-sm">
                  Portal de Clientes
                </Button>
             </Link>
             <Link href="https://satellite-b2b-admin-dashboard.vercel.app">
                <Button variant="default" className="hidden sm:flex text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] rounded-full px-5 transition-all hover:scale-105 active:scale-95 border border-blue-500 text-sm">
                  NOC / Admin
                </Button>
             </Link>
          </div>
        </div>
      </nav>

      <LeadFormModal 
         isOpen={isLeadModalOpen} 
         onClose={() => setIsLeadModalOpen(false)} 
         planInfo={selectedPlan} 
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-24 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
        <div className="inline-flex gap-3 items-center px-5 py-2.5 rounded-full bg-slate-900/60 border border-slate-700/80 mb-10 shadow-2xl backdrop-blur-xl hover:border-cyan-500/50 transition-colors cursor-default">
          <span className="flex h-2.5 w-2.5 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-200">Terminales online globales · Nodo Mendoza</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.1] text-white">
          Internet Rápido y Estable<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 animate-gradient drop-shadow-2xl">
            donde sea que su empresa opere.
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed font-light">
          Alta velocidad estable. Hardware revolucionario desde <strong className="text-white font-bold">$300.000</strong> con abonos desde <strong className="text-white font-bold">$90.000</strong>. Respaldado por el mejor servicio técnico presencial en Mendoza.
        </p>

        <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-5 w-full max-w-5xl mx-auto">
          <Link href="https://satellite-b2b-client-portal.vercel.app">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 border border-blue-500 flex gap-3 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Portal B2B Clientes
            </Button>
          </Link>

          <a href="#antenas">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:scale-105 active:scale-95 border border-cyan-500 flex gap-3 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              Comprar Hardware
            </Button>
          </a>

          <Link href="https://satellite-b2b-admin-dashboard.vercel.app">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 border border-slate-700 flex gap-3 group">
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Soporte / Hub NOC
            </Button>
          </Link>
        </div>

        <div className="mt-28 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center w-full max-w-6xl relative z-10 border-t border-slate-800/50 pt-16">
           <div className="flex flex-col items-center">
             <div className="w-14 h-14 rounded-2xl bg-slate-900/50 backdrop-blur-md flex items-center justify-center mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <svg className="w-7 h-7 text-blue-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <h4 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">+99.9%</h4>
             <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">Tiempo de Actividad</p>
           </div>
           <div className="flex flex-col items-center">
             <div className="w-14 h-14 rounded-2xl bg-slate-900/50 backdrop-blur-md flex items-center justify-center mb-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                <svg className="w-7 h-7 text-cyan-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             </div>
             <h4 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">Plug & Play</h4>
             <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">Instalación Sencilla</p>
           </div>
           <div className="flex flex-col items-center">
             <div className="w-14 h-14 rounded-2xl bg-slate-900/50 backdrop-blur-md flex items-center justify-center mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <svg className="w-7 h-7 text-indigo-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9zM12 2.252A8.014 8.014 0 0117.748 8H12V2.252zM12 21.748V16h5.748A8.014 8.014 0 0112 21.748zM3.512 15H9v5.488A9.025 9.025 0 013.512 15z" /></svg>
             </div>
             <h4 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">Extremo</h4>
             <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">Resiste Incidencias</p>
           </div>
           <div className="flex flex-col items-center">
             <div className="w-14 h-14 rounded-2xl bg-slate-900/50 backdrop-blur-md flex items-center justify-center mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <svg className="w-7 h-7 text-emerald-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             </div>
             <h4 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">Ilimitados</h4>
             <p className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">Datos Alta Velocidad</p>
           </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section id="antenas" className="relative z-10 py-24 bg-[#020617]/40 backdrop-blur-xl border-y border-slate-800/80 px-6">
         <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
         <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-white drop-shadow-xl">Ingeniería en Hardware Satelital</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {/* Mini X */}
               <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/60 rounded-[2.5rem] p-8 hover:border-blue-500/60 hover:bg-slate-900/90 transition-all duration-500 group shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
                  <div className="relative z-10 flex-grow">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 text-blue-400 shadow-inner shrink-0">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                           </div>
                           <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors drop-shadow-sm leading-tight">Antena Mini X</h3>
                        </div>
                     </div>
                     <p className="text-slate-300 mb-6 leading-relaxed text-sm font-light">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Diseño y dinámica.
                     </p>
                     
                     <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800 mb-6">
                        <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-4">
                           <div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Importe</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-3xl font-black text-white">$300.000</span>
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase">+ IVA (Efectivo)</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">O 3 Cuotas</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-2xl font-bold text-blue-400">$120.000</span>
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase">+ IVA</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => openLeadModal("HARDWARE", "Antena Mini X", "Adquisición de equipamiento Starlink Mini con soporte de activación.")}
                          className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold py-4 rounded-xl border border-blue-500/50 transition-colors"
                        >
                          Comprar Equipamiento
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Estándar V4 */}
               <div className="bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/40 rounded-[2.5rem] p-8 hover:border-cyan-400/70 shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-500 relative group overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
                  <div className="relative z-10 flex-grow">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform shrink-0">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 012 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                           </div>
                           <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors drop-shadow-sm leading-tight">Antena Estándar V4 <span className="block text-sm font-normal text-cyan-200">+ Router WiFi 6</span></h3>
                        </div>
                     </div>
                     <p className="text-slate-200 mb-6 leading-relaxed text-sm font-light">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Prioridad Satelital, diseño y robustez.
                     </p>
                     
                     <div className="bg-slate-950/50 rounded-2xl p-5 border border-cyan-500/20 mb-6">
                        <div className="flex justify-between items-end mb-4 border-b border-cyan-900/50 pb-4">
                           <div>
                              <p className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">Importe</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-3xl font-black text-white">$500.000</span>
                              </div>
                              <p className="text-[10px] text-cyan-400/70 uppercase">+ IVA (Efectivo)</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs text-cyan-500 font-bold uppercase tracking-wider mb-1">O 3 Cuotas</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-2xl font-bold text-cyan-400">$200.000</span>
                              </div>
                              <p className="text-[10px] text-cyan-400/70 uppercase">+ IVA</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => openLeadModal("HARDWARE", "Antena Estándar V4", "Equipamiento de alto rendimiento con router WiFi 6 integrado.")}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
                        >
                          Comprar Equipamiento
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Itinerante */}
               <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/60 rounded-[2.5rem] p-8 hover:border-green-500/60 hover:bg-slate-900/90 transition-all duration-500 group shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
                  <div className="relative z-10 flex-grow">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/30 text-green-400 shadow-inner shrink-0">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors drop-shadow-sm leading-tight">Antena Itinerante</h3>
                        </div>
                     </div>
                     <p className="text-slate-300 mb-6 leading-relaxed text-sm font-light">
                        Servicio asincrónico hasta 300M Reales SATELITALES. Diseño portátil, ideal para sectores rurales y alejados de difícil acceso.
                     </p>
                     
                     <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800 mb-6 mt-auto">
                        <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-4">
                           <div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Importe</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-3xl font-black text-white">$300.000</span>
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase">+ IVA (Efectivo)</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">O 3 Cuotas</p>
                              <div className="flex items-baseline gap-1 justify-end">
                                 <span className="text-2xl font-bold text-green-400">$120.000</span>
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase">+ IVA</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => openLeadModal("HARDWARE", "Antena Itinerante", "Antena portátil Starlink diseñada para movilidad extrema y lugares remotos.")}
                          className="w-full bg-green-600/20 hover:bg-green-600 text-green-300 hover:text-white font-bold py-4 rounded-xl border border-green-500/50 transition-colors"
                        >
                          Comprar Equipamiento
                        </Button>
                     </div>
                  </div>
               </div>

            </div>
         </div>

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
      </section>

      {/* Pricing / Planes Section */}
      <section id="planes" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-20 drop-shadow-lg">
            <h2 className="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase">Planes de Servicio Mensual</h2>
            <h3 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">Planes MR Technology</h3>
            <p className="text-slate-300 max-w-2xl mx-auto text-xl font-light">Internet diseñado para cada necesidad y rubro. Respaldado con consultoría especializada en IT, mantención y monitoreo contínuo de su red.</p>
         </div>

         <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Plan Básico Mini */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 flex flex-col hover:border-blue-500 shadow-xl shadow-blue-900/10 transition-all group">
               <h4 className="text-2xl font-bold text-blue-300 mb-2">Plan Básico Mini</h4>
               <div className="mb-6 h-1 w-10 bg-blue-900 rounded-full group-hover:w-16 transition-all group-hover:bg-blue-500" />
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">IMPORTE Mensual</p>
               <p className="text-5xl font-black text-white mb-2 tracking-tight">$90.000</p>
               <p className="text-xs text-slate-400 mb-8">+ IVA</p>
               <ul className="text-sm text-slate-300 space-y-4 mb-10 flex-grow font-medium">
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Servicio Mensual</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Soporte remoto ilimitado</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Consultoría y Asesoramiento MR</li>
               </ul>
                <Button 
                  onClick={() => openLeadModal("PLAN", "Plan Básico Mini", "Adquisición del plan mensual básico mini.")}
                  className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-6 rounded-xl border border-slate-600 hover:border-blue-500 transition-colors shadow-lg"
                >
                  Seleccionar Plan
                </Button>
            </div>

            {/* Plan Básico Estándar V4 */}
            <div className="bg-[#0f172a]/95 backdrop-blur-xl border-2 border-blue-500 rounded-3xl p-8 flex flex-col shadow-[0_0_40px_rgba(37,99,235,0.25)] relative transform lg:-translate-y-4 hover:-translate-y-6 transition-transform">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 text-xs font-black rounded-full tracking-widest uppercase shadow-[0_0_15px_rgba(37,99,235,0.8)]">RECOMENDADO</div>
               <h4 className="text-2xl font-bold text-blue-400 mb-2 mt-2">Plan Básico Estándar V4</h4>
               <div className="mb-6 h-1 w-12 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
               <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">IMPORTE Mensual</p>
               <p className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">$120.000</p>
               <p className="text-xs text-blue-200/50 mb-8">+ IVA</p>
               <ul className="text-sm text-slate-200 space-y-4 mb-10 flex-grow font-medium">
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Servicio Mensual</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Soporte remoto ilimitado</li>
                  <li className="flex items-start gap-3"><svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Consultoría y Asesoramiento MR</li>
               </ul>
                <Button 
                  onClick={() => openLeadModal("PLAN", "Plan Básico Estándar V4", "Suscripción mensual Básico Estándar V4.")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all text-lg"
                >
                  Seleccionar Plan
                </Button>
            </div>

            {/* Plan Full Estándar V4 */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/50 rounded-3xl p-8 flex flex-col hover:border-cyan-400 shadow-xl shadow-cyan-900/10 transition-colors group">
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
                  variant="outline" 
                  onClick={() => openLeadModal("PLAN", "Plan Full Estándar V4", "Suscripción Premium V4 con visita presencial mensual.")}
                  className="w-full border-cyan-500 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-100 font-bold py-6 rounded-xl transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)] bg-cyan-950/30"
                >
                  Cotizar Solución
                </Button>
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Column 1 */}
               <div className="group bg-slate-900/60 backdrop-blur-lg p-10 rounded-[2.5rem] border border-slate-700/80 hover:border-blue-500/60 hover:bg-slate-900/90 shadow-2xl transition-all duration-300">
                  <div className="h-16 w-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-8 border border-blue-500/40 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                     <svg className="w-8 h-8 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-6 drop-shadow-sm">Arquitectura & Relevamiento</h4>
                  <ul className="text-slate-300 text-sm space-y-4 font-medium">
                     <li className="flex items-start gap-3"><span className="text-blue-400 block shrink-0 drop-shadow-sm">•</span> Relevamiento inicial del parque informático.</li>
                     <li className="flex items-start gap-3"><span className="text-blue-400 block shrink-0 drop-shadow-sm">•</span> Análisis de Topología y Tipología de la RED interna.</li>
                     <li className="flex items-start gap-3"><span className="text-blue-400 block shrink-0 drop-shadow-sm">•</span> Plano Físico y Digital del Armado Estructural.</li>
                     <li className="flex items-start gap-3"><span className="text-blue-400 block shrink-0 drop-shadow-sm">•</span> Documentación objetiva de la red.</li>
                  </ul>
               </div>
               
               {/* Column 2 */}
               <div className="group bg-slate-900/60 backdrop-blur-lg p-10 rounded-[2.5rem] border border-slate-700/80 hover:border-indigo-500/60 hover:bg-slate-900/90 shadow-2xl transition-all duration-300">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/40 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                     <svg className="w-8 h-8 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-6 drop-shadow-sm">Centro Operativo (NOC)</h4>
                  <ul className="text-slate-300 text-sm space-y-4 font-medium">
                     <li className="flex items-start gap-3"><span className="text-indigo-400 block shrink-0 drop-shadow-sm">•</span> Operador NOC / NOC Technician.</li>
                     <li className="flex items-start gap-3"><span className="text-indigo-400 block shrink-0 drop-shadow-sm">•</span> Analista SOC (con foco estricto en redes).</li>
                     <li className="flex items-start gap-3"><span className="text-indigo-400 block shrink-0 drop-shadow-sm">•</span> Especialista en monitorización constante.</li>
                     <li className="flex items-start gap-3"><span className="text-indigo-400 block shrink-0 drop-shadow-sm">•</span> Resolución y mitigación de incidentes.</li>
                  </ul>
               </div>
               
               {/* Column 3 */}
               <div className="group bg-slate-900/60 backdrop-blur-lg p-10 rounded-[2.5rem] border border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-900/90 shadow-2xl transition-all duration-300">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/40 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                     <svg className="w-8 h-8 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-6 drop-shadow-sm">Ingeniería & Soporte</h4>
                  <ul className="text-slate-300 text-sm space-y-4 font-medium">
                     <li className="flex items-start gap-3"><span className="text-emerald-400 block shrink-0 drop-shadow-sm">•</span> Técnico de soporte y Field Network Engineer.</li>
                     <li className="flex items-start gap-3"><span className="text-emerald-400 block shrink-0 drop-shadow-sm">•</span> Instalador de Fibra Óptica certificado.</li>
                     <li className="flex items-start gap-3"><span className="text-emerald-400 block shrink-0 drop-shadow-sm">•</span> Técnico de cableado estructurado IT.</li>
                     <li className="flex items-start gap-3"><span className="text-emerald-400 block shrink-0 drop-shadow-sm">•</span> Protocolos de mitigación in-situ.</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#000205]/90 backdrop-blur-3xl py-20 px-6 border-t border-white/5 text-center text-slate-500">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
         <img src="/logo.jpg" className="w-20 h-20 rounded-full mx-auto mb-8 opacity-80 hover:opacity-100 transition-opacity border-2 border-slate-700 hover:border-blue-500 shadow-xl" alt="MR Technology" />
         <p className="tracking-[0.4em] mb-4 text-white font-black text-2xl drop-shadow-lg">M A I P Ú - M E N D O Z A</p>
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
