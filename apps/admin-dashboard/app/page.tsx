"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { getRoleConfig } from "../lib/roles";
import { Card } from "@repo/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const QuickMetrics = ({ role }: { role?: string }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    fetch("/api/reports/metrics")
      .then(r => r.json())
      .then(setMetrics)
      .catch(console.error);
  }, []);

  if (!metrics || metrics.error || !metrics.sales || !metrics.tickets || !metrics.technicians) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-slate-900/50 animate-pulse rounded-3xl" />
      ))}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-6 mb-10`}
    >
      {isAdmin && (
        <Link href="/reportes" className="group">
          <Card variant="glass" className="p-6 border-cyan-500/10 group-hover:border-cyan-500/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Conversión</span>
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            </div>
            <p className="text-2xl font-black text-white mt-4">{metrics.sales.conversionRate}%</p>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Leads a Contratos</p>
          </Card>
        </Link>
      )}

      <Link href="/tickets" className="group">
        <Card variant="glass" className="p-6 border-amber-500/10 group-hover:border-amber-500/30 transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Canales NOC</span>
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
          <p className="text-2xl font-black text-white mt-4">{(metrics.tickets.open || 0) + (metrics.tickets.inProgress || 0)}</p>
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Soporte Activo</p>
        </Card>
      </Link>

      {isAdmin && (
        <Link href="/reportes" className="group">
          <Card variant="glass" className="p-6 border-emerald-500/10 group-hover:border-emerald-500/30 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Revenue</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="text-2xl font-black text-white mt-4">${(metrics.sales.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Mensual estimado</p>
          </Card>
        </Link>
      )}

      <Link href={isAdmin ? "/usuarios" : "#"} className="group">
        <Card variant="glass" className="p-6 border-purple-500/10 group-hover:border-purple-500/30 transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Operaciones</span>
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>
          <p className="text-2xl font-black text-white mt-4">{metrics.technicians.length}</p>
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Staff Conectado</p>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function AdminOverview() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const isAuthenticated = status === "authenticated";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) setAuthError("Credenciales inválidas");
  };

  if (status === "loading") return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-black tracking-[0.4em] uppercase text-xs">Cargando Sistema...</div>;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 blur-[150px] rounded-full" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md relative z-10">
          <Card variant="glass" className="p-10" hover={false}>
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl shadow-cyan-500/20 text-2xl mb-6">MR</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Satellite NOC</h1>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">Centro de Operaciones</p>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Operador ID"
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Seguridad"
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
              />
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 uppercase text-xs tracking-widest">
                Iniciar Sesión
              </button>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-slate-800/50 flex justify-center">
              <a 
                href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://satellite-b2b.vercel.app/"} 
                className="text-[10px] font-black text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Sitio Principal
              </a>
            </motion.div>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 overflow-x-hidden font-sans selection:bg-cyan-500/30 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-blue-600/5 blur-[150px] rounded-full" />
      </div>

      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black">MR</div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tighter">Command Center</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Satellite Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                <a href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://satellite-b2b.vercel.app/"} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-500 transition-colors border-r border-white/5">Web Principal</a>
                <Link href="/tickets" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Soporte</Link>
                <Link href="/chat" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Chat Staff</Link>
                {["ADMIN", "TECH"].includes((session?.user as any)?.role) && (
                  <Link href="/contratos" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    {(session?.user as any)?.role === "TECH" ? "Mis Contratos" : "Contratos"}
                  </Link>
                )}
                {["ADMIN", "SALES"].includes((session?.user as any)?.role) && (
                  <>
                    <Link href="/crm/leads" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-500 transition-colors">Leads</Link>
                    <Link href="/crm/accounts" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-500 transition-colors">Clientes 360</Link>
                    <Link href="/crm/invoices" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-500 transition-colors">Cobros</Link>
                  </>
                )}
                {(session?.user as any)?.role === "ADMIN" && (
                  <>
                    <Link href="/reportes" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Intelligence</Link>
                    <Link href="/usuarios" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Equipo</Link>
                  </>
                )}
            </div>

            {/* Usuario activo + Rol */}
            <div className="flex flex-col items-end gap-1 border-l border-white/5 pl-6">
              <p className="text-[10px] font-black text-white truncate max-w-[140px]">
                {session?.user?.name || session?.user?.email || "Operador"}
              </p>
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getRoleConfig((session?.user as any)?.role).navBadgeClass}`}>
                {getRoleConfig((session?.user as any)?.role).label}
              </span>
            </div>

            <button onClick={() => signOut()} className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest border border-red-500/10 px-4 py-2 rounded-xl transition-all">Desconectar</button>
          </div>
        </div>
      </nav>
 
      <main className="max-w-[1600px] mx-auto px-8 py-12 relative z-10">
        <header className="mb-12 flex justify-between items-end">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Resumen de Operaciones</p>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">NOC Overview</h1>
          </motion.div>
          
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-4">
             {["ADMIN", "TECH"].includes((session?.user as any)?.role) && (
                <Link href="/contratos">
                   <button className="bg-slate-900/50 text-white border border-white/10 hover:border-cyan-500/30 font-black px-8 py-4 rounded-2xl shadow-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                     {(session?.user as any)?.role === "TECH" ? "Mis Contratos" : "Gestión de Contratos"}
                   </button>
                </Link>
             )}
             <Link href="/tickets">
                <button className="bg-cyan-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/20 uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Consola de Tickets</button>
             </Link>
          </motion.div>
        </header>
 
        <QuickMetrics role={(session?.user as any)?.role} />
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card variant="glass" className="lg:col-span-2 p-10 min-h-[400px] border-white/5">
              <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-white font-black text-lg uppercase tracking-tight">Estado de la Red Global</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Visualización en tiempo real de terminales</p>
                </div>
                <div className="flex gap-3">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase text-slate-600">Online</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase text-slate-600">Alertas</span>
                   </div>
                </div>
              </div>
              
              <div className="w-full h-64 bg-slate-900/50 rounded-3xl border border-dashed border-white/5 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
                 <svg className="w-32 h-32 text-cyan-500/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1a2.5 2.5 0 012.5 2.5v.5m-3 7h1.5a1.5 1.5 0 011.5 1.5v.5M15 3.935V5.5A2.5 2.5 0 0112.5 8h-.5a2 2 0 00-2 2 2 2 0 01-2 2h-1a2.5 2.5 0 00-2.5 2.5v.5m3-7h-1.5a1.5 1.5 0 00-1.5 1.5v.5" />
                 </svg>
                 <p className="absolute bottom-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Interconectividad Satelital Activa</p>
              </div>
 
              <div className="grid grid-cols-3 gap-6 mt-10">
                 <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Latencia Promedio</p>
                    <p className="text-xl font-black text-white">42ms</p>
                 </div>
                 <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Uptime Mensual</p>
                    <p className="text-xl font-black text-emerald-500">99.98%</p>
                 </div>
                 <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Tráfico (24h)</p>
                    <p className="text-xl font-black text-white">1.2 TB</p>
                 </div>
              </div>
           </Card>
 
           <div className="space-y-8">
              {["ADMIN", "SALES"].includes((session?.user as any)?.role) && (
                <Card variant="glass" className="p-10 border-cyan-500/10">
                  <h3 className="text-cyan-500 font-black text-xs uppercase tracking-widest mb-6">CRM Satelital</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: "Tablero de Leads", path: "/crm/leads", icon: "📋" },
                      { name: "Clientes 360°", path: "/crm/accounts", icon: "🤝" },
                      { name: "Facturas y Cobros", path: "/crm/invoices", icon: "💰" },
                    ].map(mod => (
                      <Link key={mod.path} href={mod.path} className="group p-5 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xl">{mod.icon}</span>
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">{mod.name}</span>
                          </div>
                          <svg className="w-4 h-4 text-slate-700 group-hover:text-cyan-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {(session?.user as any)?.role === "ADMIN" && (
                <Card variant="glass" className="p-10 border-white/5">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Módulos Críticos</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: "Gestión de Contratos", path: "/contratos", icon: "📄" },
                      { name: "Panel de Reportes", path: "/reportes", icon: "📊" },
                      { name: "Directorio de Staff", path: "/usuarios", icon: "👥" },
                    ].map(mod => (
                      <Link key={mod.path} href={mod.path} className="group p-5 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xl">{mod.icon}</span>
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">{mod.name}</span>
                          </div>
                          <svg className="w-4 h-4 text-slate-700 group-hover:text-cyan-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {(session?.user as any)?.role === "TECH" && (
                <Card variant="glass" className="p-10 border-white/5">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Módulos de Trabajo</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: "Mis Contratos Asignados", path: "/contratos", icon: "🛰️" },
                    ].map(mod => (
                      <Link key={mod.path} href={mod.path} className="group p-5 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xl">{mod.icon}</span>
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">{mod.name}</span>
                          </div>
                          <svg className="w-4 h-4 text-slate-700 group-hover:text-cyan-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
 
              <Card variant="glass" className="p-10 border-purple-500/10 relative overflow-hidden group cursor-pointer" onClick={() => { window.location.href='/chat' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                   <p className="text-purple-500 text-[8px] font-black uppercase tracking-[0.4em] mb-2">Canal Staff</p>
                   <h3 className="text-white font-black text-lg uppercase tracking-tight mb-4">Chat Staff Interno</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Comunicación interpersonal entre todos los colaboradores del Staff en todos sus roles.</p>
                </div>
              </Card>
            </div>
        </div>

        <footer className="mt-20 py-10 border-t border-white/5 flex justify-between items-center">
           <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">Satellite B2B NOC Platform · 2024</p>
           <div className="flex gap-8">
              <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 Sistemas Estables
              </span>
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">v4.0.2 Premium Edition</span>
           </div>
        </footer>
      </main>

      <style jsx global>{`
        body { background: #020617; }
        .selection:bg-cyan-500/30 ::selection { background: rgba(6,182,212,0.3); }
      `}</style>
    </div>
  );
}
