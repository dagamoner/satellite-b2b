"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from "recharts";
import { Card } from "@repo/ui/card";

const COLORS = ["#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#ef4444"];

export default function ReportesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  
  const [installFilters, setInstallFilters] = useState({
    startDate: "",
    endDate: "",
    status: "ALL",
  });
  const [ticketFilters, setTicketFilters] = useState({
    startDate: "",
    endDate: "",
    status: "ALL",
    priority: "ALL",
  });

  const [downloadingInstall, setDownloadingInstall] = useState(false);
  const [downloadingTickets, setDownloadingTickets] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/reports/metrics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      <div className="text-cyan-500 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Sincronizando Inteligencia de Datos</div>
    </div>
  );

  const handleDownloadInstallations = async () => {
    setDownloadingInstall(true);
    try {
      const params = new URLSearchParams(installFilters);
      const response = await fetch(`/api/reports/installations?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-instalaciones-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingInstall(false);
    }
  };

  const handleDownloadTickets = async () => {
    setDownloadingTickets(true);
    try {
      const params = new URLSearchParams(ticketFilters);
      const response = await fetch(`/api/reports/tickets?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-tickets-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingTickets(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const ticketData = metrics ? [
    { name: 'Nuevos', value: metrics.tickets.open },
    { name: 'En Proceso', value: metrics.tickets.inProgress },
    { name: 'Cerrados', value: metrics.tickets.closed },
  ] : [];

  const planData = metrics?.plans || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* Unified Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-6">
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
                className="w-8 h-8 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:border-cyan-500/50 transition-all active:scale-90"
                title="Volver al Dashboard"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">MR</div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm tracking-tighter uppercase leading-none">NOC Center</span>
                  <span className="text-cyan-500 text-[8px] font-black tracking-[0.2em] mt-1 uppercase">Operations Command</span>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <a href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://satellite-b2b.vercel.app/"} className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-[0.2em] transition-colors border-r border-white/5 pr-10">Web Principal</a>
              <Link href="/tickets" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Tickets</Link>
              <Link href="/contratos" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Contratos</Link>
              <Link href="/reportes" className="text-[10px] font-black text-white uppercase tracking-[0.2em] transition-colors border-b-2 border-cyan-500 pb-1">Inteligencia</Link>
              <Link href="/usuarios" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Equipo</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">NOC Monitor</span>
              <span className="text-[10px] text-emerald-400 font-black flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </nav>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-10 py-16 relative z-10"
      >
        <section className="mb-24">
          <motion.div variants={itemVariants} className="flex items-center gap-5 mb-12">
            <div className="w-3 h-10 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Métricas de Rendimiento B2B</h2>
          </motion.div>

          {loadingMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-900/40 rounded-[3rem] animate-pulse border border-white/5"></div>)}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card variant="glass" className="p-10 border-cyan-500/10">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Conversión Leads</span>
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-white tracking-tighter">{metrics?.sales?.conversionRate}%</span>
                    <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest pb-2">Growth</span>
                  </div>
                  <div className="mt-8 w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics?.sales?.conversionRate}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full rounded-full" 
                    />
                  </div>
                </Card>

                <Card variant="glass" className="p-10 border-amber-500/10">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Tasa de Resolución</span>
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-white tracking-tighter">{metrics?.tickets?.completionRate}%</span>
                    <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest pb-2">SLA</span>
                  </div>
                  <div className="mt-8 w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics?.tickets?.completionRate}%` }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                      className="bg-gradient-to-r from-amber-600 to-orange-500 h-full rounded-full" 
                    />
                  </div>
                </Card>

                <Card variant="glass" className="p-10 border-emerald-500/10">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Ingresos Mensuales</span>
                  <div className="flex items-end gap-4">
                    <span className="text-4xl font-black text-white tracking-tighter">${metrics?.sales?.totalRevenue?.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest pb-2">MRR</span>
                  </div>
                  <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] mt-8">Basado en contratos activos</p>
                </Card>

                <Card variant="glass" className="p-10 border-purple-500/10">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Carga Técnica</span>
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-white tracking-tighter">{metrics?.sales?.inProgressCount}</span>
                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest pb-2">Sync</span>
                  </div>
                  <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] mt-8">Instalaciones en curso</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <Card variant="glass" className="lg:col-span-1 p-10">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-12">Desglose de Incidencias</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {ticketData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1.5rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}
                          itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-8">
                    {ticketData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: COLORS[index] }} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entry.name}</span>
                        </div>
                        <span className="text-sm font-black text-white">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="glass" className="lg:col-span-2 p-10">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-12">Dominio de Mercado por Plan</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={planData}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#475569" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                          tick={{ fontWeight: 'bold' }}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1.5rem', backdropFilter: 'blur(10px)' }}
                          itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                        />
                        <Bar dataKey="count" radius={[15, 15, 0, 0]} fill="url(#barGradient)" barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <motion.div variants={itemVariants} className="bg-slate-900/40 border border-white/5 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Monitoreo de Operadores & OKRs</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3">Evaluación de eficiencia técnica y calidad de enlace</p>
                  </div>
                  <div className="bg-slate-950/60 border border-white/10 rounded-2xl px-8 py-4 shadow-xl">
                    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Target: 10 Nodos / Mes</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 relative z-10">
                  {metrics?.technicians?.map((tech: any, idx: number) => (
                    <motion.div 
                      key={tech.id} 
                      variants={itemVariants}
                      className="bg-slate-950/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-12 group hover:border-cyan-500/30 transition-all hover:bg-slate-900/40"
                    >
                      <div className="flex items-center gap-6 min-w-[280px]">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-2xl relative group-hover:scale-110 transition-transform">
                          <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          {tech.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-black text-lg uppercase tracking-tight">{tech.name}</p>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mt-1">ID: {tech.id.split('-')[0]}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1">
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-2">Completados</p>
                          <p className="text-2xl font-black text-white">{tech.completedInstalls}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-2">En Proceso</p>
                          <p className="text-2xl font-black text-amber-500">{tech.inProgressInstalls}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-2">Calidad Avg</p>
                          <p className="text-2xl font-black text-cyan-400">{tech.avgDownload} <span className="text-[10px] text-slate-600">Mbps</span></p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-3">OKR Progress</p>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-black text-emerald-500">{tech.okrScore}%</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${tech.okrScore}%` }}
                                transition={{ duration: 2, ease: "circOut", delay: 1 + (idx * 0.1) }}
                                className="bg-gradient-to-r from-emerald-600 to-cyan-500 h-full" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </section>

        <motion.div variants={itemVariants} className="flex items-center gap-5 mb-16">
          <div className="w-3 h-10 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]"></div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Consola de Exportación</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Card variant="glass" className="p-12 relative overflow-hidden group border-cyan-500/10">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
              <svg className="w-48 h-48 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4h2v4zm4 0h-2V7h2v10zm-8 0H8v-7h2v7z"/></svg>
            </div>
            
            <div className="flex items-center gap-6 mb-10">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-2xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Reporte Operativo</h2>
            </div>

            <p className="text-slate-500 text-sm mb-12 font-bold uppercase tracking-widest leading-relaxed">Auditoría completa de contratos y terminales.</p>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Terminal Inicio</label>
                  <input 
                    type="date" 
                    value={installFilters.startDate}
                    onChange={(e) => setInstallFilters({...installFilters, startDate: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all font-black"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Terminal Fin</label>
                  <input 
                    type="date" 
                    value={installFilters.endDate}
                    onChange={(e) => setInstallFilters({...installFilters, endDate: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all font-black"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Protocolo de Estado</label>
                <select 
                  value={installFilters.status}
                  onChange={(e) => setInstallFilters({...installFilters, status: e.target.value})}
                  className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all appearance-none cursor-pointer font-black uppercase tracking-widest"
                >
                  <option value="ALL">TODOS LOS NODOS</option>
                  <option value="LEAD">LEAD (WEB)</option>
                  <option value="PENDING">PENDIENTE</option>
                  <option value="APPROVED">APROBADO</option>
                  <option value="IN_PROGRESS">EN PROCESO</option>
                  <option value="COMPLETED">COMPLETADO</option>
                </select>
              </div>

              <button 
                onClick={handleDownloadInstallations}
                disabled={downloadingInstall}
                className="w-full mt-6 bg-white hover:bg-cyan-500 text-slate-950 hover:text-white font-black py-6 rounded-3xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-[10px]"
              >
                {downloadingInstall ? (
                  <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Exportar DATA.CSV
                  </>
                )}
              </button>
            </div>
          </Card>

          <Card variant="glass" className="p-12 relative overflow-hidden group border-amber-500/10">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
              <svg className="w-48 h-48 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>
            </div>

            <div className="flex items-center gap-6 mb-10">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Reporte de Tickets</h2>
            </div>

            <p className="text-slate-500 text-sm mb-12 font-bold uppercase tracking-widest leading-relaxed">Histórico de soporte y eficiencia técnica.</p>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Desde</label>
                  <input 
                    type="date" 
                    value={ticketFilters.startDate}
                    onChange={(e) => setTicketFilters({...ticketFilters, startDate: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-amber-500/40 transition-all font-black"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Hasta</label>
                  <input 
                    type="date" 
                    value={ticketFilters.endDate}
                    onChange={(e) => setTicketFilters({...ticketFilters, endDate: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-amber-500/40 transition-all font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Filtro Estado</label>
                  <select 
                    value={ticketFilters.status}
                    onChange={(e) => setTicketFilters({...ticketFilters, status: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-amber-500/40 transition-all appearance-none cursor-pointer font-black uppercase tracking-widest"
                  >
                    <option value="ALL">TODOS</option>
                    <option value="OPEN">ABIERTOS</option>
                    <option value="CLOSED">CERRADOS</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Prioridad</label>
                  <select 
                    value={ticketFilters.priority}
                    onChange={(e) => setTicketFilters({...ticketFilters, priority: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-amber-500/40 transition-all appearance-none cursor-pointer font-black uppercase tracking-widest"
                  >
                    <option value="ALL">TODAS</option>
                    <option value="LOW">BAJA</option>
                    <option value="MEDIUM">MEDIA</option>
                    <option value="HIGH">ALTA</option>
                    <option value="CRITICAL">CRÍTICA</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleDownloadTickets}
                disabled={downloadingTickets}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-amber-500 font-black py-6 rounded-3xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-[10px] border border-amber-500/30"
              >
                {downloadingTickets ? (
                  <div className="w-5 h-5 border-3 border-amber-500 border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Exportar TICKETS.CSV
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>

        <footer className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">MR Technology - Intelligence Operations Unit</div>
          <div className="flex gap-16">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-cyan-600 uppercase tracking-[0.3em]">Precision Analysis</span>
              <span className="text-xs text-slate-600 font-black mt-1">REAL-TIME SYNC</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">Quantum Security</span>
              <span className="text-xs text-slate-600 font-black mt-1">E2EE DATA VAULT</span>
            </div>
          </div>
        </footer>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.2); }
      `}</style>
    </div>
  );
}
