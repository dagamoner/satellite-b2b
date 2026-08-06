"use client";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617] pointer-events-none" />

      {/* ── Navigation (Sticky Header) ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 transition-all duration-700">
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

          {/* Center – Transformacion legend */}
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
              className="relative group/eco shrink-0 flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 mr-2"
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

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-40 pb-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.12),transparent)] pointer-events-none" />

        <img
          src="/1. Logo Mini Tecnologia Informatica (IT).png"
          alt="Tecnología Informática IT"
          className="w-48 md:w-64 object-contain mb-8 drop-shadow-[0_0_40px_rgba(59,130,246,0.5)]"
          style={{ mixBlendMode: "screen" }}
        />

        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 tracking-tight uppercase mb-4 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
          Tecnología Informática (IT)
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed">
          Soluciones tecnológicas innovadoras para la transformación digital de tu empresa.
        </p>

        <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </section>

      {/* ── SERVICIOS ── */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-3 block">Lo que ofrecemos</span>
          <h2 className="text-3xl md:text-4xl font-black text-white">🛠 Nuestros Servicios</h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Consultoría y Asesoramiento IT",
              desc: "Servicio remoto y presencial orientado a la planificación, optimización y resolución de necesidades tecnológicas.",
              icon: "💼",
              color: "from-blue-600/20 to-blue-900/10",
              border: "border-blue-500/20 hover:border-blue-400/50",
              glow: "rgba(59,130,246,0.15)",
            },
            {
              num: "02",
              title: "Mantenimiento Preventivo Activo",
              desc: "Gestión y monitoreo continuo de Hardware & Software para garantizar estabilidad, seguridad y rendimiento operativo.",
              icon: "🔧",
              color: "from-cyan-600/20 to-cyan-900/10",
              border: "border-cyan-500/20 hover:border-cyan-400/50",
              glow: "rgba(6,182,212,0.15)",
            },
            {
              num: "03",
              title: "MDM – Master Data Management",
              desc: "Desarrollo, implementación y capacitación en proyectos vinculados al área de Sistemas y administración de datos.",
              icon: "🗄️",
              color: "from-indigo-600/20 to-indigo-900/10",
              border: "border-indigo-500/20 hover:border-indigo-400/50",
              glow: "rgba(99,102,241,0.15)",
            },
            {
              num: "04",
              title: "Relevamiento e Inventario del Parque Informático",
              desc: "Auditoría técnica y documentación detallada de equipos, dispositivos y recursos tecnológicos.",
              icon: "📋",
              color: "from-sky-600/20 to-sky-900/10",
              border: "border-sky-500/20 hover:border-sky-400/50",
              glow: "rgba(14,165,233,0.15)",
            },
            {
              num: "05",
              title: "Infraestructura y Arquitectura de Red",
              desc: "Diseño y armado estructural de redes a nivel físico y lógico, incluyendo documentación técnica, planos digitales y físicos de la topología.",
              icon: "🌐",
              color: "from-violet-600/20 to-violet-900/10",
              border: "border-violet-500/20 hover:border-violet-400/50",
              glow: "rgba(139,92,246,0.15)",
            },
            {
              num: "06",
              title: "Sistemas de Videovigilancia y Seguridad",
              desc: "Desarrollo e implementación de soluciones basadas en cámaras de seguridad, con configuración, documentación técnica y puesta en marcha local y remota.",
              icon: "📷",
              color: "from-blue-700/20 to-slate-900/10",
              border: "border-blue-600/20 hover:border-blue-400/50",
              glow: "rgba(37,99,235,0.15)",
            },
          ].map((s) => (
            <div
              key={s.num}
              className={`group relative bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1`}
              style={{ boxShadow: `0 0 0 0 ${s.glow}` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px 0 ${s.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${s.glow}`;
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-0.5">{s.icon}</span>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 mb-1 block">{s.num}</span>
                  <h3 className="text-white font-bold text-base mb-2 leading-tight">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── META Y VISIÓN ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Meta */}
          <div className="relative bg-gradient-to-br from-blue-950/60 to-slate-950/80 border border-blue-500/25 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-black text-white mb-4">Nuestra Meta</h2>
            <p className="text-slate-300 leading-relaxed">
              Brindar, desarrollar, implementar y capacitar en soluciones tecnológicas innovadoras que permitan{" "}
              <strong className="text-blue-400">automatizar procesos</strong>, optimizar la gestión de la información
              digital y mejorar la eficiencia operativa en proyectos de sistemas, relevamientos y análisis técnicos.
            </p>
          </div>

          {/* Visión */}
          <div className="relative bg-gradient-to-br from-cyan-950/60 to-slate-950/80 border border-cyan-500/25 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="text-4xl mb-4">👁</div>
            <h2 className="text-2xl font-black text-white mb-4">Nuestra Visión</h2>
            <p className="text-slate-300 leading-relaxed">
              Convertir la tecnología en una herramienta{" "}
              <strong className="text-cyan-400">estratégica, ágil y eficiente</strong> para impulsar el crecimiento y la
              transformación digital de nuestros clientes.
            </p>
          </div>
        </div>
      </section>

      {/* ── MICROSOFT 365 ── */}
      <section className="relative z-10 py-20 px-4 bg-[#050d1f]/60 border-t border-white/5">
        <div className="max-w-6xl mx-auto">

          {/* Header M365 */}
          <div className="flex flex-col items-center text-center mb-14">
            <img
              src="/Micro 365.png"
              alt="Microsoft 365"
              className="h-20 md:h-28 object-contain mb-6 drop-shadow-[0_0_30px_rgba(0,120,215,0.5)]"
              style={{ mixBlendMode: "screen" }}
            />
            <span className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-3 block">☁ Microsoft 365</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ecosistema Completo de Productividad
            </h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Seguridad e infraestructura en base a{" "}
              <span className="text-blue-300 font-semibold">consultoría & productos</span>.
            </p>
            <div className="mt-6 w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>

          {/* Áreas Principales */}
          <h3 className="text-center text-lg font-bold text-slate-300 uppercase tracking-widest mb-8">
            Áreas Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              {
                img: "/Micro 365 online.png",
                label: "Online",
                items: ["Exchange Online", "SharePoint Online", "Microsoft Teams"],
                accent: "#0078d4",
                glow: "rgba(0,120,212,0.25)",
              },
              {
                img: "/Micro 365 seguridad.png",
                label: "Seguridad",
                items: ["Microsoft Defender", "Accesos Condicionales", "Suite de Seguridad Microsoft"],
                accent: "#00b4d8",
                glow: "rgba(0,180,216,0.25)",
              },
              {
                img: null,
                label: "Infraestructura",
                items: ["Active Directory", "Exchange Onprem 2016/2019", "File Servers", "Azure IaaS"],
                accent: "#5e60ce",
                glow: "rgba(94,96,206,0.25)",
                icon: "🏗️",
              },
            ].map((area) => (
              <div
                key={area.label}
                className="group relative bg-[#07111f] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  boxShadow: `0 0 0 1px ${area.accent}15`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${area.glow}, 0 0 0 1px ${area.accent}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${area.accent}15`;
                }}
              >
                {/* Image or icon */}
                <div className="flex items-center justify-center h-36 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                  {area.img ? (
                    <img
                      src={area.img}
                      alt={area.label}
                      className="h-24 object-contain drop-shadow-[0_0_20px_rgba(0,120,212,0.4)]"
                      style={{ mixBlendMode: "screen" }}
                    />
                  ) : (
                    <span className="text-6xl">{area.icon}</span>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-black text-white text-lg mb-4" style={{ color: area.accent }}>
                    {area.label}
                  </h4>
                  <ul className="space-y-2">
                    {area.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: area.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Ramas de Consultoría de Seguridad */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-3 block">
              🛡 Consultoría Especializada
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Ramas de Consultoría de Seguridad
            </h3>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "/MIcro 365 seg y cumplimiento.jpg",
                label: "Seguridad y Cumplimiento",
                items: ["Incidentes", "Alertas de Seguridad", "Inteligencia sobre amenazas"],
                accent: "#ef4444",
                glow: "rgba(239,68,68,0.2)",
              },
              {
                img: "/MIcro 365 seg e incidencias.jpg",
                label: "Seguridad e Incidencias",
                items: [
                  "Consultoría enfocada a la seguridad de las Identidades administradas",
                  "Grupos de seguridad",
                  "Licenciamiento",
                ],
                accent: "#f97316",
                glow: "rgba(249,115,22,0.2)",
              },
              {
                img: "/MIcro 365 purview.jpg",
                label: "Microsoft Purview",
                items: ["Directivas de retención y cumplimiento", "Alertas de seguridad"],
                accent: "#a855f7",
                glow: "rgba(168,85,247,0.2)",
              },
            ].map((rama) => (
              <div
                key={rama.label}
                className="group relative bg-[#07111f] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: `0 0 0 1px ${rama.accent}15` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${rama.glow}, 0 0 0 1px ${rama.accent}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${rama.accent}15`;
                }}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={rama.img}
                    alt={rama.label}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, #07111f 10%, transparent 60%)`,
                    }}
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-black text-lg mb-4" style={{ color: rama.accent }}>
                    {rama.label}
                  </h4>
                  <ul className="space-y-2">
                    {rama.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-300 text-sm leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: rama.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-4 border-t border-white/5 text-center">
        <img
          src="/Logo WEB MR Tech.png"
          alt="MR Technology"
          className="h-10 object-contain mx-auto mb-4 opacity-60"
          style={{ mixBlendMode: "screen" }}
        />
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} MR Technology — Tecnología Informática (IT)
        </p>
        <button
          onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}
          className="mt-4 inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-semibold transition-colors"
        >
          ← Volver al Ecosistema MR Technology
        </button>
      </footer>
    </div>
  );
}
