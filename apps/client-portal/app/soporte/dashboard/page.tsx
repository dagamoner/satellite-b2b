"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";
import { useRealtimeContracts } from "../../../hooks/useRealtimeContracts";

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  category: string;
}

export default function SupportDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newTicket, setNewTicket] = useState({ title: "", description: "", category: "Conectividad" });
  const [creating, setCreating] = useState(false);

  // --- Realtime Contracts Hook ---
  const { contracts } = useRealtimeContracts();
  const [currentContract, setCurrentContract] = useState<any>(null);

  useEffect(() => {
    if (session?.user && 'contractId' in session.user && contracts.length > 0) {
      const found = contracts.find(c => c.id === (session.user as { contractId: string }).contractId);
      if (found) setCurrentContract(found);
    }
  }, [contracts, session]);
  // -------------------------------

  const fetchTickets = useCallback(async (contractId: string) => {
    try {
      const res = await fetch(`/api/support/tickets?contractId=${contractId}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user && 'contractId' in session.user) {
      const contractId = (session.user as { contractId: string }).contractId;
      fetchTickets(contractId);
    }
  }, [status, session, fetchTickets]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !('contractId' in session.user)) return;

    setCreating(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTicket,
          contractId: (session.user as { contractId: string }).contractId
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setNewTicket({ title: "", description: "", category: "Conectividad" });
        fetchTickets((session.user as { contractId: string }).contractId);
      }
    } catch (err) {
      alert("Error al crear el incidente");
    } finally {
      setCreating(false);
    }
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin relative z-10" />
        <div className="text-cyan-500 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse relative z-10">Sincronizando con el Centro de Control</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Elementos Decorativos de Fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full -ml-80 -mb-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <header className="border-b border-white/5 bg-slate-900/40 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-10 h-28 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center font-black text-white relative shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent" />
                <span className="relative z-10 text-lg">MRT</span>
              </div>
            </div>
            <div>
              <h2 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">Portal <span className="text-cyan-500">B2B</span></h2>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2 opacity-80">Network Operations Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="text-right hidden lg:block">
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1.5">Sesión Segura</p>
              <div className="flex items-center gap-3 justify-end">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <p className="text-sm font-black text-white uppercase tracking-tight">{session?.user?.name}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="px-6 py-3 bg-slate-900/50 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-slate-500 hover:text-red-400 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
            >
              Cerrar Canal
            </button>
          </div>
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-10 py-16 relative z-10"
      >
        {/* Telemetry Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Latencia Operativa', value: '620ms', sub: 'GEO Satellite Orbit', color: 'text-cyan-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { label: 'Intensidad RX', value: '-84 dBm', sub: 'Nominal Stability', color: 'text-emerald-500', icon: 'M5.05 9.05a7 7 0 019.9 0M1.5 5.5a11 11 0 0115 0m-13.5 10.5h12' },
            { label: 'Uptime Red', value: '99.8%', sub: 'High Availability', color: 'text-blue-500', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card variant="glass" className="p-8 border-white/5 group hover:border-white/10" hover={true}>
                <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-cyan-500/10 transition-colors">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={stat.icon} /></svg>
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <h4 className={`text-4xl font-black ${stat.color} tracking-tighter mb-2`}>{stat.value}</h4>
                <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">{stat.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <motion.aside variants={itemVariants} className="lg:col-span-1 space-y-10">
            {/* Contract Info Card */}
            <Card variant="glass" className="p-10 border-white/5 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-28 h-28 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10">Identidad Digital</h3>
              <div className="space-y-10">
                <div>
                  <p className="text-[9px] text-cyan-500/60 font-black uppercase tracking-[0.3em] mb-3">ID Maestro</p>
                  <p className="text-2xl font-mono font-black text-white tracking-tight">{(session?.user as { contractNumber?: string })?.contractNumber || 'SAT-B2B-DEMO'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] mb-3">Status de Enlace</p>
                  <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl inline-block ${
                    currentContract?.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    currentContract?.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-cyan-500/10'
                  }`}>
                    {currentContract?.status === 'LEAD' ? "PENDIENTE ACTIVACIÓN" : (currentContract?.status || "RED ACTIVA / OPERATIVA")}
                  </span>
                </div>
              </div>
              <div className="mt-12 pt-10 border-t border-white/5">
                {currentContract?.status === 'LEAD' ? (
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                      Requiere completar formalización para acceso total a servicios.
                    </p>
                  </div>
                ) : (
                  <button className="w-full py-5 bg-slate-950/80 hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 group">
                    <svg className="w-5 h-5 group-hover:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Descargar Contrato
                  </button>
                )}
              </div>
            </Card>

            {/* Mission Expansion Card */}
            <div className="bg-slate-900/30 border border-cyan-500/10 rounded-[3rem] p-10 overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 blur-3xl rounded-full" />
              <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-10 text-center">Escalabilidad de Red</h3>
              <div className="space-y-5">
                <button 
                  onClick={() => window.open('/?request=survey', '_blank')}
                  className="w-full py-6 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white font-black rounded-[1.8rem] transition-all border border-cyan-500/20 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  Solicitar Relevamiento
                </button>
                <button 
                  onClick={() => window.open('/#hardware', '_blank')}
                  className="w-full py-6 bg-white/5 hover:bg-white text-slate-500 hover:text-slate-950 font-black rounded-[1.8rem] transition-all border border-white/5 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-3 group shadow-xl"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Adquirir Equipamiento
                </button>
              </div>
              <p className="mt-10 text-[9px] text-slate-700 uppercase font-black tracking-widest text-center leading-relaxed opacity-50 italic">La redundancia es clave para la continuidad corporativa.</p>
            </div>
          </motion.aside>

          <section className="lg:col-span-2 space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10">
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-cyan-500/50 rounded-full" />
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Command <span className="text-slate-800">Logs</span></h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Soporte Técnico en Tiempo Real</p>
              </div>
              <div className="flex items-center gap-6">
                {currentContract?.status === 'LEAD' && (
                  <button 
                    onClick={async () => {
                      let newTicketId = "";
                      try {
                        const response = await fetch("/api/support/tickets", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: "Formalización de Contrato B2B",
                            description: `Iniciado proceso de edición de contrato maestro para el ID ${currentContract.contractNumber}.`,
                            category: "Contrato",
                            contractId: (session?.user as { contractId: string }).contractId
                          }),
                        });
                        const data = await response.json();
                        if (data.id) newTicketId = data.id;
                      } catch (err) {
                        console.error("Log failed, continuing...");
                      }

                      const params = new URLSearchParams({
                        p_contract: currentContract.contractNumber,
                        p_name: currentContract.clientName,
                        p_dni: currentContract.clientDni,
                        p_email: currentContract.clientEmail,
                        p_phone: currentContract.clientPhone,
                        p_plan: currentContract.planType,
                        p_ticket: newTicketId
                      });
                      router.push(`/contrato?${params.toString()}`);
                    }}
                    className="group relative px-10 py-6 bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-cyan-500/20 flex items-center gap-4 overflow-hidden text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Firmar Contrato
                  </button>
                )}
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="group relative px-10 py-6 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-[2rem] transition-all shadow-2xl shadow-white/5 flex items-center gap-4 overflow-hidden text-[10px] uppercase tracking-[0.3em] border border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  Reportar Incidente
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {tickets.length === 0 ? (
                <Card variant="glass" className="py-24 text-center border-white/5 bg-slate-900/10">
                  <div className="w-24 h-24 bg-slate-950 border border-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-800 shadow-inner">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-white font-black text-2xl mb-2 uppercase tracking-tighter">Status: Nominal</h3>
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Sistemas operando dentro de los parámetros</p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {tickets.map(t => (
                    <motion.div 
                      key={t.id}
                      variants={itemVariants}
                      onClick={() => router.push(`/soporte/${t.id}`)}
                      className="group"
                    >
                      <Card variant="glass" className="p-8 border-white/5 group-hover:border-cyan-500/30 transition-all cursor-pointer overflow-hidden relative" hover={true}>
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-slate-900 group-hover:bg-cyan-500 transition-all" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pl-4">
                          <div className="space-y-5">
                            <div className="flex items-center gap-5">
                              <span className="text-[9px] font-black text-cyan-500 bg-cyan-500/10 px-4 py-1.5 rounded-lg border border-cyan-500/20 uppercase tracking-[0.2em] font-mono shadow-inner">
                                {t.ticketNumber}
                              </span>
                              <span className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em]">{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                               <h4 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-none mb-3">{t.title}</h4>
                               <div className="flex items-center gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-cyan-500 animate-pulse" />
                                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">{t.category}</p>
                               </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-10">
                            <div className="text-left md:text-right space-y-3">
                              <div className={`inline-flex items-center gap-3 text-[8px] font-black px-6 py-2.5 rounded-full border uppercase tracking-[0.3em] shadow-2xl ${
                                t.status === 'OPEN' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/5' : 
                                t.status === 'IN_PROGRESS' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              }`}>
                                {t.status === 'OPEN' ? "ABIERTO" : t.status === 'IN_PROGRESS' ? "EN PROCESO" : "COMPLETADO"}
                              </div>
                              <p className="text-[8px] text-slate-800 font-black uppercase tracking-[0.6em] pr-2">NIVEL: {t.priority}</p>
                            </div>
                            <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                               <svg className="w-8 h-8 text-cyan-500/30 group-hover:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-3xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Nuevo Reporte</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Diagnóstico de Terminal B2B</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-12 h-12 bg-slate-950 border border-white/5 rounded-full flex items-center justify-center text-slate-600 hover:text-white transition-colors shadow-inner"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateTicket} className="space-y-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Título de Incidencia</label>
                  <input 
                    type="text" 
                    value={newTicket.title}
                    onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                    placeholder="Resumen operativo del suceso..."
                    className="w-full bg-slate-950 border border-white/5 text-white rounded-2xl px-8 py-6 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-slate-800 font-bold shadow-inner"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Categoría</label>
                    <div className="relative">
                      <select 
                        value={newTicket.category}
                        onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 text-white rounded-2xl px-8 py-6 focus:border-cyan-500/50 focus:outline-none transition-all appearance-none cursor-pointer font-bold shadow-inner"
                      >
                        <option>Conectividad</option>
                        <option>Hardware (Equipo)</option>
                        <option>Inestabilidad</option>
                        <option>Administrativo</option>
                        <option>Otro</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Prioridad Esperada</label>
                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex items-center justify-center">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Calculada por Sistema</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Bitácora de Detalles</label>
                  <textarea 
                    rows={4}
                    value={newTicket.description}
                    onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 text-white rounded-3xl px-8 py-6 focus:border-cyan-500/50 focus:outline-none transition-all resize-none placeholder:text-slate-800 font-bold shadow-inner custom-scrollbar"
                    placeholder="Describa comportamiento técnico, anomalías observadas y frecuencia..."
                    required
                  />
                </div>
                <div className="pt-10 flex gap-6">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-950 border border-white/5 hover:bg-slate-900 text-slate-600 hover:text-slate-400 font-black py-6 rounded-2xl transition-all text-[10px] uppercase tracking-[0.3em] shadow-xl"
                  >
                    Anular
                  </button>
                  <button 
                    type="submit"
                    disabled={creating}
                    className="flex-2 bg-white hover:bg-cyan-500 text-slate-950 hover:text-white font-black py-6 px-12 rounded-2xl transition-all shadow-2xl text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
                  >
                    {creating ? "Transmitiendo..." : "Transmitir Reporte"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-10 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-black text-[10px]">MRT</div>
            <p className="text-[8px] font-black uppercase tracking-[0.6em]">MR Technology Corporative Systems</p>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.6em]">Encrypted Connection · NOC NODE: {session?.user?.id?.slice(0,8).toUpperCase()}</p>
      </footer>
    </div>
  );
}
    </div>
  );
}
