"use client";

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col text-slate-100 selection:bg-[#33E8FF]/30 selection:text-[#33E8FF]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1600px] right-[-200px] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Navigation (Sticky Header) ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700">
        <div className="max-w-[90rem] mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">

          {/* Left – MR Tech Logo */}
          <div className="flex-1 flex items-center justify-start hidden md:flex opacity-100">
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

          {/* Center – Transformación Digital */}
          <div className="flex-1 md:flex-none flex items-center justify-center relative shrink-0">
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

          {/* Right – Ecosistema + Hablamos */}
          <div className="flex-1 flex justify-end items-center hidden md:flex gap-4 opacity-100">
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
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-40 md:pt-48 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          


          {/* Logo IA */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-cyan-500/30 to-blue-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <img
              src="/4. Logo Mini Inteligencia Artificial.png"
              alt="Inteligencia Artificial (IA)"
              className="w-52 md:w-72 object-contain relative z-10 drop-shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-105 transition-transform duration-300"
              style={{ mixBlendMode: "screen" }}
            />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-blue-400 tracking-tight uppercase mb-6 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
            Inteligencia Artificial (IA)
          </h1>

          {/* Subtitle / Bold Hero Pitch */}
          <p className="text-xl md:text-2xl text-white font-extrabold max-w-3xl leading-snug text-center mb-6 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
            Soluciones inteligentes para la transformación digital de empresas.
          </p>

          {/* Extended Intro Text */}
          <div className="max-w-3xl bg-slate-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <p className="text-base md:text-lg text-slate-200 font-bold leading-relaxed text-center">
              Brindamos servicios profesionales de consultoría, implementación y acompañamiento integral en proyectos de software de gestión empresarial, combinando nuestra experiencia técnica con herramientas de <span className="text-[#33E8FF] drop-shadow-[0_0_8px_rgba(51,232,255,0.6)]">Inteligencia Artificial</span> para maximizar resultados.
            </p>
          </div>

          <div className="mt-12 w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-[#33E8FF] to-transparent" />
        </div>
      </section>

      {/* ── ⚡ NUESTROS SERVICIOS ── */}
      <section className="relative z-10 py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl">⚡</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#33E8FF] drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] uppercase tracking-wider text-center">
              NUESTROS SERVICIOS
            </h2>
          </div>
          <div className="mt-3 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#33E8FF] to-violet-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Servicio 1 */}
          <div className="relative group bg-gradient-to-br from-violet-950/50 via-slate-900/80 to-blue-950/50 border border-violet-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-violet-400/60 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(139,92,246,0.25)] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl">💡</span>
                <span className="text-xs font-black tracking-[0.3em] uppercase text-[#33E8FF] bg-[#33E8FF]/10 px-3 py-1 rounded-full border border-[#33E8FF]/20">
                  SERVICIO 01
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-6 text-left drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                1. Consultoría y Asesoramiento Especializado
              </h3>
              <ul className="space-y-4 text-left">
                {[
                  { bold: "Relevamiento y análisis", rest: "de necesidades tecnológicas y operativas" },
                  { bold: "Documentación", rest: "funcional y técnica exhaustiva" },
                  { bold: "Definición de procesos", rest: "y objetivos estratégicos de negocio" },
                  { bold: "Gestión integral", rest: "de proyectos tecnológicos de alto impacto" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-200 font-bold text-base md:text-lg leading-relaxed">
                    <span className="text-[#33E8FF] font-black text-xl shrink-0 mt-0.5 drop-shadow-[0_0_6px_#33E8FF]">✔</span>
                    <span>
                      <strong className="text-white font-extrabold">{item.bold}</strong> {item.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-widest">
              <span>Optimización &amp; Planificación</span>
            </div>
          </div>

          {/* Servicio 2 */}
          <div className="relative group bg-gradient-to-br from-cyan-950/50 via-slate-900/80 to-blue-950/50 border border-cyan-500/30 rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-cyan-400/60 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(51,232,255,0.25)] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl">⚙️</span>
                <span className="text-xs font-black tracking-[0.3em] uppercase text-[#33E8FF] bg-[#33E8FF]/10 px-3 py-1 rounded-full border border-[#33E8FF]/20">
                  SERVICIO 02
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 text-left drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                2. Implementación de Software de Gestión
              </h3>
              <p className="text-slate-200 font-bold text-base leading-relaxed mb-6 text-left">
                Realizamos la instalación, configuración, parametrización, puesta en marcha y capacitación en las principales plataformas ERP del mercado:
              </p>

              {/* Plataformas Soportadas Grid */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <div className="text-xs font-black tracking-[0.2em] text-[#33E8FF] uppercase mb-4 text-left">
                  Plataformas de Gestión Soportadas
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "TANGO GESTIÓN", tag: "ERP Líder" },
                    { name: "BEJERMAN", tag: "Gestión Corporativa" },
                    { name: "KUMBRE GESTIÓN", tag: "Administración Integral" },
                    { name: "RED LINE", tag: "Control Operativo" },
                    { name: "FLEXXUS", tag: "Solución Integral" },
                  ].map((plat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#33E8FF]/40 hover:bg-white/10 transition-all duration-200"
                    >
                      <span className="text-white font-extrabold text-sm md:text-base tracking-wide flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#33E8FF] shadow-[0_0_6px_#33E8FF]" />
                        {plat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
                        {plat.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              <span>Parametrización &amp; Puesta en Marcha</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 🔄 METODOLOGÍA DE TRABAJO ── */}
      <section className="relative z-10 py-20 px-4 bg-[#050d1f]/70 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl">🔄</span>
              <h2 className="text-2xl md:text-4xl font-black text-[#33E8FF] drop-shadow-[0_0_20px_rgba(51,232,255,0.4)] tracking-wide uppercase text-center">
                METODOLOGÍA DE TRABAJO
              </h2>
            </div>
            <p className="text-white font-bold text-base md:text-lg max-w-3xl mx-auto mt-4 leading-relaxed text-center">
              Aplicamos metodologías modernas de gestión de proyectos, integrando herramientas de <span className="text-[#33E8FF]">Inteligencia Artificial</span> para optimizar cada etapa del ciclo de vida del proyecto:
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-violet-500 to-[#33E8FF]" />
          </div>

          {/* 5 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Análisis y Planificación", icon: "📊", color: "from-blue-600/20 to-violet-900/20", border: "border-blue-500/30" },
              { step: "02", title: "Implementación y Configuración", icon: "⚙️", color: "from-violet-600/20 to-purple-900/20", border: "border-violet-500/30" },
              { step: "03", title: "Capacitación de Usuarios", icon: "👥", color: "from-purple-600/20 to-pink-900/20", border: "border-purple-500/30" },
              { step: "04", title: "Soporte y Seguimiento", icon: "🛡️", color: "from-cyan-600/20 to-blue-900/20", border: "border-cyan-500/30" },
              { step: "05", title: "Mejora Continua de Procesos", icon: "🚀", color: "from-emerald-600/20 to-cyan-900/20", border: "border-emerald-500/30" },
            ].map((m, idx) => (
              <div
                key={idx}
                className={`relative group bg-gradient-to-b ${m.color} border ${m.border} rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(51,232,255,0.15)] flex flex-col items-center justify-between`}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{m.icon}</div>
                <div className="text-xs font-black text-[#33E8FF] tracking-[0.25em] mb-2">{m.step}</div>
                <h4 className="text-white font-black text-sm md:text-base leading-snug">{m.title}</h4>
                <div className="mt-4 w-8 h-0.5 bg-white/20 group-hover:w-16 group-hover:bg-[#33E8FF] transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 📈 NUESTRA EXPERIENCIA & BENEFICIOS IA ── */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="bg-gradient-to-br from-violet-950/60 via-slate-900/90 to-cyan-950/60 border border-violet-500/30 rounded-3xl p-8 md:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl">📈</span>
              <h2 className="text-2xl md:text-4xl font-black text-[#33E8FF] uppercase tracking-wider text-center drop-shadow-[0_0_15px_rgba(51,232,255,0.4)]">
                NUESTRA EXPERIENCIA
              </h2>
            </div>
            
            <p className="text-white font-bold text-base md:text-xl max-w-3xl leading-relaxed text-center mb-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              Contamos con una sólida trayectoria como especialistas en software de gestión empresarial, lo que nos permite liderar proyectos tecnológicos de manera eficiente, asegurando resultados concretos y adaptados a las necesidades de cada cliente.
            </p>

            {/* Blockquote / AI Value Proposition Box */}
            <div className="w-full max-w-4xl bg-black/50 border border-[#33E8FF]/30 rounded-2xl p-6 md:p-8 text-left shadow-[0_0_30px_rgba(51,232,255,0.1)]">
              <h3 className="text-lg md:text-xl font-black text-white mb-6 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                <span className="text-[#33E8FF]">✦</span>
                La combinación entre experiencia profesional y tecnología basada en IA nos permite:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { action: "Reducir tiempos", desc: "de implementación y puesta en marcha." },
                  { action: "Optimizar procesos", desc: "internos y flujos operativos de trabajo." },
                  { action: "Mejorar la toma", desc: "de decisiones basada en datos inteligentes." },
                  { action: "Aumentar la productividad", desc: "empresarial y rendimiento del equipo." },
                ].map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-4 hover:border-[#33E8FF]/30 transition-colors">
                    <span className="text-[#33E8FF] font-black text-xl shrink-0 drop-shadow-[0_0_6px_#33E8FF]">✔</span>
                    <p className="text-slate-200 font-bold text-sm md:text-base leading-snug">
                      <strong className="text-white font-extrabold">{b.action}</strong> {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 🎯 VIRTUD & MISIÓN ── */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* NUESTRA VIRTUD */}
          <div className="relative bg-gradient-to-br from-violet-950/60 to-slate-950/80 border border-violet-500/25 rounded-3xl p-10 overflow-hidden flex flex-col items-center text-center hover:border-violet-400/50 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(139,92,246,0.2)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />
            <img
              src="/VIRTUD.png"
              alt="Nuestra Virtud"
              className="h-40 md:h-48 w-auto object-contain mb-6 drop-shadow-[0_0_25px_rgba(139,92,246,0.5)]"
            />
            <p className="text-white font-bold leading-relaxed text-center text-base md:text-lg">
              Nuestra meta es brindar a cada cliente una <span className="text-[#33E8FF]">implementación exitosa</span> del software que mejor se adapte a su empresa, acompañándolo en todo el proceso mediante soluciones inteligentes, capacitación continua y seguimiento permanente. Trabajamos para transformar desafíos tecnológicos en <span className="text-[#33E8FF]">oportunidades de crecimiento</span>.
            </p>
          </div>

          {/* NUESTRA MISIÓN */}
          <div className="relative bg-gradient-to-br from-cyan-950/60 to-slate-950/80 border border-cyan-500/25 rounded-3xl p-10 overflow-hidden flex flex-col items-center text-center hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(51,232,255,0.2)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            <img
              src="/MISION.png"
              alt="Nuestra Misión"
              className="h-40 md:h-48 w-auto object-contain mb-6 drop-shadow-[0_0_25px_rgba(51,232,255,0.5)]"
            />
            <p className="text-white font-bold leading-relaxed text-center text-base md:text-lg">
              Implementar una <span className="text-[#33E8FF]">Arquitectura IA</span> para la transformación y crecimiento <span className="text-[#33E8FF]">DIGITAL de la EMPRESA</span>.
            </p>
          </div>

        </div>
      </section>

      {/* ── FOOTER UNIFICADO ── */}
      <footer className="relative z-10 w-full py-12 px-4 border-t border-white/5 text-center flex flex-col items-center justify-center mt-12 bg-black/40 backdrop-blur-md">
        <img
          src="/Logo WEB MR Tech.png"
          alt="MR Technology"
          className="h-10 object-contain mx-auto mb-4 opacity-80 cursor-pointer hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          style={{ mixBlendMode: "screen" }}
          onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
        />

        <p className="text-white font-bold text-sm">
          © {new Date().getFullYear()} MR Technology — Inteligencia Artificial (IA)
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