"use client";
import React from "react";

export default function CyberPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-[#33E8FF] selection:text-black font-sans relative overflow-x-hidden">
      {/* ── BACKGROUND AMBIENCE & GRID ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#33E8FF 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── STICKY HEADER / NAVIGATION ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700">
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
          
          {/* Left: MR Technology Logo */}
          <div className="flex-1 flex items-center justify-start hidden md:flex">
            <div
              className="relative shrink-0 flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/Logo WEB MR Tech.png"
                alt="MR Technology"
                className="w-24 md:w-32 object-contain hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.1)" }}
              />
            </div>
          </div>

          {/* Center: Transformación Digital */}
          <div className="flex-1 md:flex-none flex items-center justify-center relative shrink-0">
            <div className="relative flex items-center justify-center">
              <img
                src="/Transformacion.png"
                alt="Transformación Digital Empresarial"
                className="h-14 md:h-[4.5rem] w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] relative z-10"
                style={{
                  mixBlendMode: "screen",
                  WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
                  maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Right: Ecosistema + Hablamos */}
          <div className="flex-1 flex justify-end items-center hidden md:flex gap-4">
            {/* Ecosistema */}
            <button
              onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
              className="relative group/eco shrink-0 flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 mr-2 cursor-pointer"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[#33E8FF] rounded-full blur-[15px] opacity-30 group-hover/eco:opacity-70 transition-opacity duration-300 pointer-events-none" />
                <img
                  src="/ecosistema.jpg"
                  alt="Ecosistema"
                  className="w-full h-full object-cover rounded-full relative z-10"
                  style={{
                    mixBlendMode: "screen",
                    WebkitMaskImage: "radial-gradient(circle at center, black 55%, transparent 70%)",
                    maskImage: "radial-gradient(circle at center, black 55%, transparent 70%)",
                    filter: "drop-shadow(0 0 8px rgba(51,232,255,0.7)) brightness(1.2)",
                  }}
                />
              </div>
              <span className="text-[#33E8FF] font-black text-[10px] tracking-[0.15em] uppercase drop-shadow-[0_0_8px_rgba(51,232,255,0.8)]">
                ECOSISTEMA
              </span>
            </button>

            {/* Hablamos */}
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
                  mixBlendMode: "screen",
                  WebkitMaskImage: "radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)",
                  maskImage: "radial-gradient(circle 40% at 50% 50%, black 60%, transparent 100%)",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-36 md:pt-44 pb-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center">

          {/* Logo Ciberseguridad */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-[#33E8FF]/30 to-emerald-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <img
              src="/5. Logo Mini CIberseguridad.png"
              alt="Ciberseguridad (CIA)"
              className="w-56 md:w-80 object-contain relative z-10 drop-shadow-[0_0_35px_rgba(51,232,255,0.6)] hover:scale-105 transition-transform duration-300"
              style={{ mixBlendMode: "screen" }}
            />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#33E8FF] to-emerald-400 tracking-tight uppercase mb-6 drop-shadow-[0_0_25px_rgba(51,232,255,0.5)]">
            Ciberseguridad (CIA)
          </h1>

          {/* Subtitle / Pitch */}
          <p className="text-xl md:text-2xl text-white font-extrabold max-w-3xl leading-snug text-center mb-6 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
            Protección avanzada de infraestructura y activos de información con estándares internacionales.
          </p>

          <div className="mt-4 w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-[#33E8FF] to-transparent" />
        </div>
      </section>

      {/* ── 🛡 TRÍADA CIA ── */}
      <section className="relative z-10 py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🛡</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#33E8FF] drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] uppercase tracking-wider text-center">
              Ciberseguridad basada en la TRÍADA CIA
            </h2>
          </div>
          <p className="text-white font-bold text-base md:text-lg max-w-3xl mx-auto italic mt-2 text-center">
            Modelo fundamental y marco a nivel mundial para guiar las políticas de seguridad de la información.
          </p>
          <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#33E8FF] via-emerald-500 to-blue-500" />
        </div>

        {/* 3 Pillars of CIA Triad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* [C] CONFIDENCIALIDAD */}
          <div className="relative group bg-gradient-to-br from-cyan-950/50 via-slate-900/80 to-blue-950/50 border border-cyan-500/40 rounded-3xl p-8 transition-all duration-300 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(51,232,255,0.3)] flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(51,232,255,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-black text-[#33E8FF] drop-shadow-[0_0_20px_rgba(51,232,255,0.9)] tracking-tight">
                C
              </span>
            </div>

            <span className="text-xs font-black tracking-[0.25em] text-[#33E8FF] uppercase bg-[#33E8FF]/10 px-4 py-1.5 rounded-full border border-[#33E8FF]/30 mb-3 shadow-[0_0_10px_rgba(51,232,255,0.2)]">
              PILAR C
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              CONFIDENCIALIDAD
            </h3>
            <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed text-center">
              Solo usuarios autorizados acceden a la información protegida, evitando accesos indebidos y filtraciones de datos sensibles.
            </p>
          </div>

          {/* [I] INTEGRIDAD */}
          <div className="relative group bg-gradient-to-br from-rose-950/50 via-slate-900/80 to-red-950/50 border border-rose-500/40 rounded-3xl p-8 transition-all duration-300 hover:border-rose-400 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(244,63,94,0.3)] flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border-2 border-rose-400/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-black text-[#FF3366] drop-shadow-[0_0_20px_rgba(255,51,102,0.9)] tracking-tight">
                I
              </span>
            </div>

            <span className="text-xs font-black tracking-[0.25em] text-rose-400 uppercase bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/30 mb-3 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
              PILAR I
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              INTEGRIDAD
            </h3>
            <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed text-center">
              La información es exacta, completa y no ha sido alterada, garantizando la fiabilidad total de los registros y sistemas críticos.
            </p>
          </div>

          {/* [A] DISPONIBILIDAD */}
          <div className="relative group bg-gradient-to-br from-emerald-950/50 via-slate-900/80 to-teal-950/50 border border-emerald-500/40 rounded-3xl p-8 transition-all duration-300 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border-2 border-emerald-400/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl md:text-7xl font-black text-[#00E676] drop-shadow-[0_0_20px_rgba(0,230,118,0.9)] tracking-tight">
                A
              </span>
            </div>

            <span className="text-xs font-black tracking-[0.25em] text-emerald-400 uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30 mb-3 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              PILAR A
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              DISPONIBILIDAD
            </h3>
            <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed text-center">
              Los sistemas y datos están accesibles cuando se necesitan, asegurando continuidad operativa ininterrumpida y resiliencia empresarial.
            </p>
          </div>

        </div>
      </section>

      {/* ── 🛡️ SECURETIA & VULSEEK - ALIANZA Y SERVICIOS AVANZADOS ── */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto w-full">
        {/* Banner de Alianza: SECURETIA (Izquierda), EXPERTOS EN CIBERSEGURIDAD + PARTNERS (Centro), VULSEEK (Derecha) */}
        <div className="relative bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-red-950/80 border border-cyan-500/30 rounded-3xl p-8 md:p-12 mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* LADO IZQUIERDO: LOGO SECURETIA EN FONDO BLANCO DESTACADO */}
            <div className="flex items-center justify-center shrink-0 bg-white/95 rounded-2xl p-4 md:p-5 border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105 transition-transform duration-300">
              <img
                src="/SECURETIA_clean.png"
                alt="SECURETIA"
                className="h-16 md:h-22 w-auto object-contain"
              />
            </div>

            {/* AL MEDIO: EXPERTOS EN CIBERSEGURIDAD + PARTNERS + LEYENDA */}
            <div className="flex flex-col items-center text-center max-w-2xl px-4 space-y-3">
              <h3 className="text-2xl md:text-3xl font-black tracking-wider text-[#33E8FF] uppercase drop-shadow-[0_0_15px_rgba(51,232,255,0.8)]">
                EXPERTOS EN CIBERSEGURIDAD
              </h3>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#33E8FF]/10 border border-[#33E8FF]/30 text-[#33E8FF] font-black text-sm md:text-base uppercase tracking-widest drop-shadow-[0_0_10px_rgba(51,232,255,0.6)] mb-1">
                Partners SECURETIA &amp; VULSEEK
              </div>
              <p className="text-white font-bold text-base md:text-lg leading-relaxed text-center pt-1">
                Desde hace más de 10 años nos comprometimos a ofrecer soluciones simples que ayuden a las organizaciones a mejorar sus capacidades de prevención, detección y respuesta contra ciberamenazas.
              </p>
            </div>

            {/* LADO DERECHO: LOGO VULSEEK (DUPLICADO EN TAMAÑO) */}
            <div className="flex items-center justify-center shrink-0">
              <img
                src="/VULSEEK_clean.png"
                alt="VULSEEK"
                className="h-40 md:h-56 w-auto object-contain drop-shadow-[0_0_35px_rgba(239,68,68,0.7)]"
              />
            </div>

          </div>
        </div>

        {/* ── GRIDA DE CUADROS DE SEGURIDAD (LOGOS DUPLICADOS EN TAMAÑO) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cuadro 1: Análisis de Vulnerabilidades */}
          <div className="relative group bg-[#07111f] border border-cyan-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(51,232,255,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(51,232,255,0.35)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/icon_vulnerabilidades.png"
                    alt="Análisis de Vulnerabilidades"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_#33E8FF]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Análisis de Vulnerabilidades
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed mb-6 text-left">
                Identificación, clasificación y priorización proactiva de debilidades en la infraestructura y aplicaciones antes de que puedan ser explotadas.
              </p>

              <ul className="space-y-3 text-left">
                {[
                  "Escaneo automatizado y continuo de activos críticos",
                  "Evaluación de riesgos basada en impacto de negocio",
                  "Informes detallados con recomendaciones de remediación",
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                    <span className="text-[#33E8FF] font-black shrink-0 mt-0.5">■</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-cyan-300 uppercase tracking-wider text-left">
              Diagnóstico Proactivo de Riesgos
            </div>
          </div>

          {/* Cuadro 2: Penetration Testing */}
          <div className="relative group bg-[#07111f] border border-red-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-red-400 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(239,68,68,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(239,68,68,0.35)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/icon_pentesting.png"
                    alt="Penetration Testing"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_#ef4444]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Penetration Testing
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed mb-6 text-left">
                Simulación controlada de ciberataques reales para evaluar la efectividad defensiva e identificar brechas de seguridad explotables.
              </p>

              <ul className="space-y-3 text-left">
                {[
                  "Pruebas éticas ofensivas en redes, servidores y perímetro",
                  "Explotación controlada para medir alcance real de intrusión",
                  "Reporte ejecutivo y técnico de mitigación inmediata",
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                    <span className="text-red-400 font-black shrink-0 mt-0.5">■</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-red-300 uppercase tracking-wider text-left">
              Simulación de Ataque Ofensivo
            </div>
          </div>

          {/* Cuadro 3: Seguridad mobile */}
          <div className="relative group bg-[#07111f] border border-blue-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-blue-400 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(59,130,246,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/icon_mobile.png"
                    alt="Seguridad mobile"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_#3b82f6]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Seguridad mobile
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed mb-6 text-left">
                Identificamos los vectores de ataque que un cibercriminal podría utilizar para vulnerar tus aplicaciones móbiles simulando situaciones de la vida real.
              </p>

              <ul className="space-y-3 text-left">
                {[
                  "Servicio adaptable a tus necesidades",
                  "Implementamos metodologías y herramientas de atacantes reales",
                  "Realizamos pruebas personalizadas para distintos tipos de ataque",
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                    <span className="text-blue-400 font-black shrink-0 mt-0.5">■</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-blue-300 uppercase tracking-wider text-left">
              Protección de Aplicaciones Móviles
            </div>
          </div>

          {/* Cuadro 4: SecDevOps */}
          <div className="relative group bg-[#07111f] border border-emerald-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(16,185,129,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/icon_secdevops.png"
                    alt="SecDevOps"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_#10b981]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    SecDevOps
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed mb-6 text-left">
                Te ayudamos a incorporar los conocimientos y procesos necesarios para transformar tu metodología de trabajo y así incorporar buenas prácticas de seguridad al mismo.
              </p>

              <ul className="space-y-3 text-left">
                {[
                  "Utilizamos las mejores prácticas",
                  "Equipo experimentado en esta disciplina",
                  "Reducimos tus tiempos y costos de implementación",
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                    <span className="text-emerald-400 font-black shrink-0 mt-0.5">■</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-emerald-300 uppercase tracking-wider text-left">
              Integración Continua Segura
            </div>
          </div>

          {/* Cuadro 5: Respuesta ante incidentes */}
          <div className="relative group bg-[#07111f] border border-orange-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-orange-400 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(249,115,22,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(249,115,22,0.35)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/icon_incidentes.png"
                    alt="Respuesta ante incidentes"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_#f97316]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Respuesta ante incidentes
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed mb-6 text-left">
                Ayudamos a tu organización a recuperarse rápidamente después de un ciberataque, minimizando el impacto y restaurando las operaciones.
              </p>

              <ul className="space-y-3 text-left">
                {[
                  "Restauramos tus operaciones rápidamente",
                  "Brindamos un análisis detallado del ataque y evaluación de daños",
                  "Intervenimos de manera rápida y efectiva para contener el incidente",
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                    <span className="text-orange-400 font-black shrink-0 mt-0.5">■</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-orange-300 uppercase tracking-wider text-left">
              Gestión &amp; Contención de Crisis
            </div>
          </div>

          {/* Cuadro 6: Consultoría & Soporte Especializado */}
          <div className="relative group bg-[#07111f] border border-purple-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-purple-400 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/icon_consultoria.png"
                    alt="Consultoría & Soporte Especializado"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_15px_#a855f7]"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Consultoría &amp; Soporte Especializado
                  </h3>
                </div>
              </div>
              
              <p className="text-slate-200 font-bold text-base md:text-lg leading-relaxed mb-6 text-left">
                Ofrecemos servicios de alto nivel con nuestro equipo de consultores expertos, otorgando soluciones puntuales para tu negocio en múltiples ámbitos de la ciberseguridad.
              </p>

              <ul className="space-y-3 text-left">
                {[
                  "Brindamos soporte de ciberseguridad",
                  "Ofrecemos consultorías en infraestructuras de seguridad",
                  "Desarrollamos políticas de seguridad y normativas",
                ].map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                    <span className="text-purple-400 font-black shrink-0 mt-0.5">■</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-purple-300 uppercase tracking-wider text-left">
              Asesoramiento &amp; Normativas de Seguridad
            </div>
          </div>

        </div>

        {/* ── DETALLE PLATAFORMA VULSEEK ── */}
        <div className="mt-20 pt-16 border-t border-white/10 flex flex-col items-center">
          
          {/* Logo VULSEEK Centralizado (DUPLICADO EN TAMAÑO) */}
          <div className="mb-12 flex flex-col items-center text-center">
            <img
              src="/VULSEEK_clean.png"
              alt="VULSEEK"
              className="h-48 md:h-64 w-auto object-contain drop-shadow-[0_0_45px_rgba(239,68,68,0.7)] hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xs md:text-sm font-black tracking-[0.25em] text-[#33E8FF] uppercase mt-4 drop-shadow-[0_0_10px_rgba(51,232,255,0.8)]">
              PLATAFORMA INTEGRAL DE CIBERSEGURIDAD
            </span>
          </div>

          {/* 2 Cuadros: IMPLEMENTA (Izquierda) & Funcionalidades (Derecha) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            
            {/* Cuadro Izquierdo: IMPLEMENTA */}
            <div className="relative group bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-blue-950/40 border border-cyan-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_10px_35px_rgba(51,232,255,0.25)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🚀</span>
                  <h3 className="text-2xl md:text-3xl font-black text-[#33E8FF] uppercase tracking-wider drop-shadow-[0_0_15px_rgba(51,232,255,0.7)]">
                    IMPLEMENTA:
                  </h3>
                </div>
                
                <p className="text-white font-bold text-base md:text-lg leading-relaxed text-left">
                  Vulseek es una plataforma simple, moderna y multidioma (inglés / español), pensada para que cualquier empresa de IT, ciberseguridad o servicios gestionados pueda integrarla a su portfolio y ofrecerla a sus clientes como parte de su stack habitual.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-cyan-300 uppercase tracking-wider text-left">
                Integración Multidioma IT &amp; MSP
              </div>
            </div>

            {/* Cuadro Derecho: Funcionalidades */}
            <div className="relative group bg-gradient-to-br from-red-950/40 via-slate-900/80 to-slate-950/90 border border-red-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-red-400 hover:shadow-[0_10px_35px_rgba(239,68,68,0.25)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚡</span>
                  <h3 className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-wider drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]">
                    Funcionalidades:
                  </h3>
                </div>

                <p className="text-white font-black text-base md:text-lg mb-6 text-left drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  Descubrimiento automático de superficie de ataque
                </p>

                <ul className="space-y-3 text-left">
                  {[
                    "Escaneo continuo de vulnerabilidades",
                    "Monitoreo de IPs públicas",
                    "Integraciones con agentes para endpoints",
                    "Informes dinámicos",
                    "Todo en una interfaz simple para empresas de cualquier tamaño",
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-200 font-bold text-sm md:text-base leading-relaxed">
                      <span className="text-red-400 font-black shrink-0 mt-0.5">■</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-red-300 uppercase tracking-wider text-left">
                Superficie de Ataque &amp; Monitoreo
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 🛠 SERVICIOS EMPRESARIALES ESPECIALIZADOS ── */}
      <section className="relative z-10 py-20 px-4 bg-[#050d1f]/70 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl">🛠</span>
              <h2 className="text-2xl md:text-4xl font-black text-[#33E8FF] drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] uppercase tracking-wider text-center">
                SERVICIOS EMPRESARIALES ESPECIALIZADOS
              </h2>
            </div>
            <div className="mt-3 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#33E8FF] to-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* INSTANCIA A */}
            <div className="relative group bg-[#07111f] border border-cyan-500/25 rounded-3xl p-8 transition-all duration-300 hover:border-cyan-400/60 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(51,232,255,0.2)] flex flex-col justify-between text-center">
              <div>
                <div className="mb-6 flex items-center justify-center">
                  <img
                    src="/isologo_consultoria.png"
                    alt="Consultoría & Asesoramiento"
                    className="h-32 md:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(51,232,255,0.6)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-black tracking-[0.25em] text-[#33E8FF] uppercase bg-[#33E8FF]/10 px-3 py-1 rounded-full border border-[#33E8FF]/20">
                  INSTANCIA A
                </span>
                <h3 className="text-xl font-black text-white mt-4 mb-4 text-center">
                  1. Consultoría &amp; Asesoramiento
                </h3>
                <p className="text-slate-200 font-bold text-base leading-relaxed text-center">
                  Evaluación y desarrollo de estrategias de seguridad informática adaptadas a cada entorno empresarial y necesidades operativas.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Estrategia &amp; Diagnóstico
              </div>
            </div>

            {/* INSTANCIA B */}
            <div className="relative group bg-[#07111f] border border-blue-500/25 rounded-3xl p-8 transition-all duration-300 hover:border-blue-400/60 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(59,130,246,0.2)] flex flex-col justify-between text-center">
              <div>
                <div className="mb-6 flex items-center justify-center">
                  <img
                    src="/isologo_documentacion.png"
                    alt="Documentación Objetiva"
                    className="h-32 md:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-black tracking-[0.25em] text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  INSTANCIA B
                </span>
                <h3 className="text-xl font-black text-white mt-4 mb-4 text-center">
                  2. Documentación Objetiva
                </h3>
                <p className="text-slate-200 font-bold text-base leading-relaxed text-center">
                  Desarrollo de documentación técnica, análisis de riesgos, políticas de seguridad y procedimientos operativos estandarizados.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-blue-300 uppercase tracking-wider">
                Políticas &amp; Cumplimiento
              </div>
            </div>

            {/* INSTANCIA C */}
            <div className="relative group bg-[#07111f] border border-emerald-500/25 rounded-3xl p-8 transition-all duration-300 hover:border-emerald-400/60 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(16,185,129,0.2)] flex flex-col justify-between text-center">
              <div>
                <div className="mb-6 flex items-center justify-center">
                  <img
                    src="/isologo_marcos_iso_nist.png"
                    alt="Proyectos bajo Marcos ISO & NIST"
                    className="h-32 md:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-black tracking-[0.25em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  INSTANCIA C
                </span>
                <h3 className="text-xl font-black text-white mt-4 mb-4 text-center">
                  3. Proyectos bajo Marcos ISO &amp; NIST
                </h3>
                <p className="text-slate-200 font-bold text-base leading-relaxed text-center">
                  Implementación de soluciones de ciberseguridad de vanguardia alineadas a estándares internacionales y mejores prácticas de la industria.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Marcos ISO 27001 &amp; NIST
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 🎓 FORMACIÓN & CAPACITACIÓN ESTRATÉGICA ── */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🎓</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#33E8FF] drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] uppercase tracking-wider text-center">
              FORMACIÓN &amp; CAPACITACIÓN ESTRATÉGICA
            </h2>
          </div>
          <div className="mt-3 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-red-500 via-[#33E8FF] to-blue-500" />
        </div>

        {/* Strategic Partnerships (ADISTEC & FORTINET - SIN HIPERVÍNCULOS) */}
        <div className="mb-16">
          <p className="text-center text-sm font-black text-slate-300 tracking-[0.2em] uppercase mb-8">
            En conjunto con líderes globales en ciberseguridad:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* ADISTEC Card (Estática sin Hipervínculo) */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-[#07152b] border border-cyan-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_10px_40px_rgba(51,232,255,0.25)]">
              <div className="w-full flex items-center justify-center py-6 px-8 bg-blue-950/80 rounded-2xl border border-blue-500/40 mb-4 group-hover:bg-blue-900/80 transition-colors shadow-[0_0_20px_rgba(51,232,255,0.3)]">
                <img
                  src="/logo_adistec_official.png"
                  alt="ADISTEC"
                  className="h-14 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(51,232,255,0.6)]"
                />
              </div>
              <span className="text-xs font-black tracking-widest text-cyan-300 uppercase">
                Partner Global de Distribución
              </span>
            </div>

            {/* FORTINET Card (Estática sin Hipervínculo) */}
            <div className="group relative bg-gradient-to-br from-slate-900/90 to-[#1f0a0e] border border-red-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-red-400 hover:shadow-[0_10px_40px_rgba(239,68,68,0.25)]">
              <div className="w-full flex items-center justify-center py-6 px-8 bg-white/95 rounded-2xl border border-white/40 mb-4 group-hover:bg-white transition-colors shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                <img
                  src="/logo_fortinet_raw.png"
                  alt="FORTINET"
                  className="h-14 md:h-20 w-auto object-contain"
                />
              </div>
              <span className="text-xs font-black tracking-widest text-red-300 uppercase">
                Líder Mundial en Seguridad de Red
              </span>
            </div>
          </div>
        </div>

        {/* ── MÓDULOS Y CERTIFICACIONES ── */}
        <div className="bg-[#050e1f]/80 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider">
              Módulos y Certificaciones
            </h3>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-[#33E8FF]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Introduction to the Threat Landscape 3.0 + NSE 1 Insignia */}
            <div className="bg-[#030914] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[#33E8FF]/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black tracking-[0.2em] text-[#33E8FF] uppercase bg-[#33E8FF]/10 px-3 py-1 rounded-full border border-[#33E8FF]/20">
                    MÓDULO 01
                  </span>
                  <span className="text-xs font-bold text-slate-400">Certificación Oficial</span>
                </div>
                <h4 className="text-lg md:text-xl font-black text-white mb-3 text-left">
                  1. Introduction to the Threat Landscape 3.0
                </h4>
                <p className="text-slate-300 font-bold text-sm md:text-base leading-relaxed text-left mb-6">
                  Certificación fundamental sobre el panorama actual y evolución de las amenazas cibernéticas globales.
                </p>
              </div>

              {/* NSE 1 Badge Card con Imagen Oficial */}
              <div className="mt-2 bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-4 flex items-center gap-5 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                <div className="w-16 h-16 rounded-xl bg-white/95 border border-white/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  <img
                    src="/nse1_clean.png"
                    alt="NSE 1 Network Security Associate"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-white font-black text-base tracking-wide">
                    NSE 1 Network Security Associate
                  </div>
                  <div className="text-xs text-red-300 font-bold mt-0.5">
                    Fortinet Training Institute Certification
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Getting Started in Cybersecurity 3.0 – Self-Paced */}
            <div className="bg-[#030914] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[#33E8FF]/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    MÓDULO 02
                  </span>
                  <span className="text-xs font-bold text-slate-400">Auto-Administrado</span>
                </div>
                <h4 className="text-lg md:text-xl font-black text-white mb-3 text-left">
                  2. Getting Started in Cybersecurity 3.0 – Self-Paced
                </h4>
                <p className="text-slate-300 font-bold text-sm md:text-base leading-relaxed text-left mb-6">
                  Capacitación orientada a fortalecer conocimientos, prevención y respuesta estratégica frente a amenazas digitales modernas.
                </p>
              </div>

              {/* 4 Focus Areas */}
              <div>
                <div className="text-xs font-black text-[#33E8FF] uppercase tracking-wider mb-3 text-left">
                  Áreas de Enfoque:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Amenazas Internas", icon: "🏢", color: "border-orange-500/30 text-orange-300" },
                    { label: "Amenazas Externas", icon: "🌐", color: "border-red-500/30 text-red-300" },
                    { label: "Cloud Security", icon: "☁️", color: "border-cyan-500/30 text-cyan-300" },
                    { label: "IoT Security", icon: "📡", color: "border-emerald-500/30 text-emerald-300" },
                  ].map((area, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border ${area.color} text-xs font-extrabold`}
                    >
                      <span>{area.icon}</span>
                      <span>{area.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Fundamentos de Ciberseguridad */}
            <div className="bg-[#030914] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[#33E8FF]/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black tracking-[0.2em] text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    MÓDULO 03
                  </span>
                  <span className="text-xs font-bold text-slate-400">Conceptual &amp; Práctico</span>
                </div>
                <h4 className="text-lg md:text-xl font-black text-white mb-3 text-left">
                  3. Fundamentos de Ciberseguridad
                </h4>
                <p className="text-slate-300 font-bold text-sm md:text-base leading-relaxed text-left">
                  Bases conceptuales sólidas y prácticas esenciales para la protección, hardening y custodia de activos digitales corporativos.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-xs font-bold text-blue-300 uppercase tracking-wider text-left">
                Defensa de Activos Críticos
              </div>
            </div>

            {/* 4. Panorámica de Amenazas a la Ciberseguridad */}
            <div className="bg-[#030914] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[#33E8FF]/40 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black tracking-[0.2em] text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    MÓDULO 04
                  </span>
                  <span className="text-xs font-bold text-slate-400">Análisis Global</span>
                </div>
                <h4 className="text-lg md:text-xl font-black text-white mb-3 text-left">
                  4. Panorámica de Amenazas a la Ciberseguridad
                </h4>
                <p className="text-slate-300 font-bold text-sm md:text-base leading-relaxed text-left">
                  Análisis global y prospectivo de los vectores de ataque emergentes, malware avanzado y prevención proactiva de incidentes críticos.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-xs font-bold text-purple-300 uppercase tracking-wider text-left">
                Inteligencia de Amenazas
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 🎯 VIRTUD & MISIÓN ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* NUESTRA VIRTUD */}
          <div className="relative bg-gradient-to-br from-blue-950/70 to-slate-950/90 border border-blue-500/30 rounded-3xl p-8 md:p-10 overflow-hidden flex flex-col items-center text-center hover:border-blue-400/60 transition-all duration-300 shadow-[0_10px_35px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            <img
              src="/VIRTUD.png"
              alt="Nuestra Virtud"
              className="h-36 md:h-44 w-auto object-contain mb-6 drop-shadow-[0_0_25px_rgba(51,232,255,0.4)]"
            />
            <p className="text-white font-bold text-base md:text-lg leading-relaxed text-center">
              Brindar a todos nuestros clientes Marcos <span className="text-[#33E8FF]">NIST, ISO</span> y defensas en Ciberseguridad del <span className="text-[#33E8FF]">más alto nivel</span> contra todo tipo de ciberamenazas internas, externas, cloud e IoT.
            </p>
          </div>

          {/* NUESTRA MISIÓN */}
          <div className="relative bg-gradient-to-br from-cyan-950/70 to-slate-950/90 border border-cyan-500/30 rounded-3xl p-8 md:p-10 overflow-hidden flex flex-col items-center text-center hover:border-cyan-400/60 transition-all duration-300 shadow-[0_10px_35px_rgba(51,232,255,0.2)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            <img
              src="/MISION.png"
              alt="Nuestra Misión"
              className="h-36 md:h-44 w-auto object-contain mb-6 drop-shadow-[0_0_25px_rgba(51,232,255,0.4)]"
            />
            <p className="text-white font-bold text-base md:text-lg leading-relaxed text-center">
              Implementar en la <span className="text-[#33E8FF]">EMPRESA</span> basado en los fundamentos y marco de la <span className="text-[#33E8FF]">TRÍADA CIA</span> — <em>Confidencialidad, Integridad y Disponibilidad</em> — como pilar estratégico de toda política de seguridad de la información.
            </p>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/5 text-center flex flex-col items-center justify-center">
        <img
          src="/Logo WEB MR Tech.png"
          alt="MR Technology"
          className="h-10 object-contain mx-auto mb-4 opacity-80 cursor-pointer hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          style={{ mixBlendMode: "screen" }}
          onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
        />

        <p className="text-white font-bold text-sm">
          © {new Date().getFullYear()} MR Technology — Ciberseguridad (CIA)
        </p>
        
        <button
          onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
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
    </div>
  );
}