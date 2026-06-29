"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    id: "satelital",
    title: "Conectividad Satelital",
    desc: "Internet de alta velocidad sin fronteras para empresas y el sector rural.",
    url: "https://satelital.mrtechnology.it.com",
    icon: "📡",
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
  },
  {
    id: "it",
    title: "Tecnología Informática",
    desc: "Soluciones de hardware, infraestructura y soporte técnico especializado.",
    url: "https://informatica.mrtechnology.it.com",
    icon: "💻",
    color: "from-teal-400 to-emerald-500",
    shadow: "shadow-[0_0_30px_rgba(20,184,166,0.3)]",
  },
  {
    id: "erp",
    title: "Software ERP Empresarial",
    desc: "Sistemas de gestión integral, facturación y automatización de procesos.",
    url: "https://erp.mrtechnology.it.com",
    icon: "📊",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
  },
  {
    id: "ia",
    title: "Inteligencia Artificial",
    desc: "Optimización de negocios con análisis de datos predictivo y machine learning.",
    url: "https://ia.mrtechnology.it.com",
    icon: "🧠",
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  {
    id: "cyber",
    title: "Ciberseguridad",
    desc: "Protección integral de datos, redes corporativas y prevención de amenazas.",
    url: "https://cyber.mrtechnology.it.com",
    icon: "🛡️",
    color: "from-red-500 to-rose-600",
    shadow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
  }
];

export default function CorporatePortal() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden relative font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16"
        >
          <img src="/Logo_new.png" alt="MR Technology" className="w-32 md:w-48 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] mb-8" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-4">
            Ecosistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">MR Technology</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl text-center max-w-2xl font-light">
            Seleccioná una de nuestras unidades de negocio para acceder a sus soluciones específicas.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
          {pillars.map((pillar, index) => (
            <motion.a
              href={pillar.url}
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative p-[1px] rounded-3xl overflow-hidden ${pillar.shadow} transition-shadow duration-500`}
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Card Content */}
              <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-8 rounded-[23px] border border-white/5 flex flex-col items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mt-2">{pillar.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
                <div className="mt-auto pt-6 flex items-center text-cyan-400 text-sm font-semibold group-hover:text-cyan-300 transition-colors">
                  Ingresar al portal <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Portales Accesorios */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 border-t border-white/10 pt-10 flex flex-col items-center w-full max-w-4xl"
        >
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold mb-6">Accesos Rápidos</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <a href="https://clientes.mrtechnology.it.com" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-sm font-medium flex items-center gap-2">
              👤 Portal de Clientes
            </a>
            <a href="https://admin.mrtechnology.it.com" className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-sm font-medium flex items-center gap-2">
              ⚙️ Portal de Administradores
            </a>
          </div>
        </motion.div>

      </div>
    </main>
  );
}