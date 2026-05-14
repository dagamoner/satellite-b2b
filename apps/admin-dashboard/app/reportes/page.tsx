"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ReportesPage() {
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

  // Fetch Metrics
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

  // Proteger la ruta - solo ADMIN
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      redirect("/");
    }
  }, [status, session]);

  if (status === "loading") return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-bold">Cargando...</div>;

  const handleDownloadInstallations = async () => {
    // ... (rest of the download functions)

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
      } else {
        alert("Error al generar el reporte de instalaciones");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
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
      } else {
        alert("Error al generar el reporte de tickets");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setDownloadingTickets(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <div className="bg-slate-900/60 border-b border-white/5 px-8 py-6 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="p-3 bg-slate-800/50 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800 transition-all active:scale-95 group shadow-xl"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Centro de Reportes</h1>
              <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Inteligencia de Datos MR Technology</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Dashboard de Métricas */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Dashboard de Rendimiento Operativo</h2>
          </div>

          {loadingMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-900/40 rounded-3xl animate-pulse border border-white/5"></div>)}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 shadow-xl hover:border-cyan-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conversión de Ventas</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-white leading-none">{metrics?.sales?.conversionRate}%</span>
                    <span className="text-xs text-cyan-400 font-bold pb-1">Leads a Contratos</span>
                  </div>
                  <div className="mt-6 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${metrics?.sales?.conversionRate}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 shadow-xl hover:border-amber-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tasa de Resolución</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-white leading-none">{metrics?.tickets?.completionRate}%</span>
                    <span className="text-xs text-amber-400 font-bold pb-1">Tickets Cerrados</span>
                  </div>
                  <div className="mt-6 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${metrics?.tickets?.completionRate}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 shadow-xl hover:border-emerald-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ingresos Proyectados</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-white leading-none">${metrics?.sales?.totalRevenue?.toLocaleString()}</span>
                    <span className="text-xs text-emerald-400 font-bold pb-1">Mensual</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">Basado en contratos activos</p>
                </div>

                <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] p-8 shadow-xl hover:border-purple-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Carga de Trabajo</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-white leading-none">{metrics?.sales?.inProgressCount}</span>
                    <span className="text-xs text-purple-400 font-bold pb-1">En Instalación</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-6">Equipos en campo actualmente</p>
                </div>
              </div>

              {/* Technician KPI & OKR Panel */}
              <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Performance y OKRs de Técnicos</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Métricas de calidad y cumplimiento por operador</p>
                  </div>
                  <div className="bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-3">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Target Mensual: 10 Instalaciones</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {metrics?.technicians?.map((tech: any) => (
                    <div key={tech.id} className="bg-slate-950/40 border border-white/5 rounded-3xl p-6 flex flex-col lg:flex-row items-center gap-8 group hover:border-cyan-500/20 transition-all">
                      <div className="flex items-center gap-4 min-w-[240px]">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white font-black shadow-lg">
                          {tech.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-black uppercase tracking-tight">{tech.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {tech.id.split('-')[0]}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Completados</p>
                          <p className="text-xl font-black text-white">{tech.completedInstalls}</p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Vel. Promedio</p>
                          <p className="text-xl font-black text-cyan-400">{tech.avgDownload} <span className="text-[10px]">Mbps</span></p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Latencia Avg</p>
                          <p className="text-xl font-black text-amber-400">{tech.avgLatency} <span className="text-[10px]">ms</span></p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">OKR Score</p>
                          <div className="flex items-center gap-3 justify-center md:justify-start">
                            <span className="text-xl font-black text-emerald-400">{tech.okrScore}%</span>
                            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${tech.okrScore}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Exportación de Datos</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          
          {/* Instalaciones Report Card */}
          <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4h2v4zm4 0h-2V7h2v10zm-8 0H8v-7h2v7z"/></svg>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Reporte de Instalaciones</h2>
            </div>

            <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed">Genera un informe detallado de todos los contratos, incluyendo datos técnicos, firmas y estados de implementación.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Desde</label>
                  <input 
                    type="date" 
                    value={installFilters.startDate}
                    onChange={(e) => setInstallFilters({...installFilters, startDate: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hasta</label>
                  <input 
                    type="date" 
                    value={installFilters.endDate}
                    onChange={(e) => setInstallFilters({...installFilters, endDate: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado de Contrato</label>
                <select 
                  value={installFilters.status}
                  onChange={(e) => setInstallFilters({...installFilters, status: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="LEAD">Lead (Web)</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="APPROVED">Aprobado</option>
                  <option value="IN_PROGRESS">En Proceso</option>
                  <option value="COMPLETED">Completado</option>
                  <option value="REJECTED">Rechazado</option>
                </select>
              </div>

              <button 
                onClick={handleDownloadInstallations}
                disabled={downloadingInstall}
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {downloadingInstall ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Procesando...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Descargar CSV de Instalaciones
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tickets Report Card */}
          <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Reporte de Tickets</h2>
            </div>

            <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed">Extrae métricas de soporte técnico, tiempos de respuesta y volumen de incidencias por prioridad y estado.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Desde</label>
                  <input 
                    type="date" 
                    value={ticketFilters.startDate}
                    onChange={(e) => setTicketFilters({...ticketFilters, startDate: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hasta</label>
                  <input 
                    type="date" 
                    value={ticketFilters.endDate}
                    onChange={(e) => setTicketFilters({...ticketFilters, endDate: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado</label>
                  <select 
                    value={ticketFilters.status}
                    onChange={(e) => setTicketFilters({...ticketFilters, status: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="ALL">Todos</option>
                    <option value="OPEN">Abierto</option>
                    <option value="CLOSED">Cerrado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prioridad</label>
                  <select 
                    value={ticketFilters.priority}
                    onChange={(e) => setTicketFilters({...ticketFilters, priority: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="ALL">Todas</option>
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleDownloadTickets}
                disabled={downloadingTickets}
                className="w-full mt-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {downloadingTickets ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Procesando...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Descargar CSV de Tickets
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Propiedad de MR Technology - Confidencial</div>
          <div className="flex gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Generación Dinámica</span>
              <span className="text-xs text-slate-500 font-bold">Data real del servidor</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Formato Estándar</span>
              <span className="text-xs text-slate-500 font-bold">Compatible con Excel/Google Sheets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
