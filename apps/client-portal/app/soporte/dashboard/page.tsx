"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@repo/ui/button";
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-cyan-500 font-mono text-xs animate-pulse uppercase tracking-widest">Sincronizando con el centro de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-white/5 bg-slate-900/20 backdrop-blur-2xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20 text-xl">MR</div>
            <div>
              <h2 className="text-white font-black text-xl tracking-tight leading-none uppercase">Portal Corporativo</h2>
              <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.3em] mt-1.5 opacity-80">Centro de Operaciones de Red</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Identidad Validada</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-sm font-black text-white uppercase">{session?.user?.name}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="px-4 py-2 bg-slate-800/50 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Telemetry Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Latencia Satelital', value: '620ms', sub: 'Orbita Geoestacionaria', color: 'text-cyan-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { label: 'Calidad de Señal', value: '-84 dBm', sub: 'Excelente / Sin nubes', color: 'text-emerald-500', icon: 'M5.05 9.05a7 7 0 019.9 0M1.5 5.5a11 11 0 0115 0m-13.5 10.5h12' },
            { label: 'Disponibilidad Anual', value: '99.8%', sub: 'SLA Corporativo', color: 'text-blue-500', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-white/10 transition-colors">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className={`text-3xl font-black ${stat.color} tracking-tighter mb-1`}>{stat.value}</h4>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <aside className="lg:col-span-1 space-y-8">
            {/* Contract Info Card */}
            <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-24 h-24 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Detalles del Contrato</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-1">Número Maestro</p>
                  <p className="text-xl font-mono font-black text-white">{(session?.user as { contractNumber?: string })?.contractNumber || 'SAT-B2B-88392'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Estado del Servicio</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    currentContract?.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    currentContract?.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  }`}>
                    {currentContract?.status || "En Línea / Operativo"}
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                {currentContract?.status === 'LEAD' ? (
                  <div className="group/copy relative">
                    <button 
                      disabled
                      className="w-full py-4 bg-slate-800/30 border border-slate-800/50 text-slate-500 font-bold rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Contrato en Preparación
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-[9px] text-white rounded-lg opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-tighter">
                      Complete el formulario para activar
                    </div>
                  </div>
                ) : (
                  <button className="w-full py-4 bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-black/20 active:scale-95">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Copia de Contrato
                  </button>
                )}
              </div>
            </div>

            {/* Mission Expansion Card */}
            <div className="bg-slate-900/30 border border-cyan-500/10 rounded-[2rem] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
              <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] mb-6">Misiones de Expansión</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.open('/?request=survey', '_blank')}
                  className="w-full py-5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white font-black rounded-2xl transition-all border border-cyan-500/20 text-[10px] uppercase tracking-widest flex flex-col items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  Solicitar Relevamiento
                </button>
                <button 
                  onClick={() => window.open('/#hardware', '_blank')}
                  className="w-full py-5 bg-white/5 hover:bg-white text-slate-400 hover:text-slate-950 font-black rounded-2xl transition-all border border-white/5 text-[10px] uppercase tracking-widest flex flex-col items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Adquirir Hardware
                </button>
              </div>
              <p className="mt-6 text-[9px] text-slate-600 uppercase font-bold tracking-widest leading-relaxed">Añadir puntos de conexión mejora la resiliencia de su red.</p>
            </div>
          </aside>

          <section className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Registro de Incidentes</h1>
                <p className="text-slate-500 text-sm mt-1">Logs técnicos y asistencia en vivo desde el centro de soporte</p>
              </div>
              <div className="flex items-center gap-4">
                {currentContract?.status === 'LEAD' && (
                  <button 
                    onClick={async () => {
                      let newTicketId = "";
                      // 1. Crear el ticket de inicio de contrato
                      try {
                        const response = await fetch("/api/support/tickets", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: "Llenado de Contrato de Instalación en Curso",
                            description: `El cliente ha iniciado el proceso de llenado y edición del contrato para la solicitud ${currentContract.contractNumber}.`,
                            category: "Contrato",
                            contractId: (session?.user as { contractId: string }).contractId
                          }),
                        });
                        const data = await response.json();
                        if (data.id) newTicketId = data.id;
                      } catch (err) {
                        console.error("No se pudo crear el log del ticket, continuando...");
                      }

                      // 2. Redirigir al formulario con el ticketId
                      const params = new URLSearchParams({
                        p_contract: currentContract.contractNumber,
                        p_name: currentContract.clientName,
                        p_dni: currentContract.clientDni,
                        p_email: currentContract.clientEmail,
                        p_phone: currentContract.clientPhone,
                        p_plan: currentContract.planType,
                        p_ticket: newTicketId // Pasar el ID del ticket creado
                      });
                      router.push(`/contrato?${params.toString()}`);
                    }}
                    className="group relative px-8 py-5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-cyan-500/30 flex items-center gap-3 overflow-hidden text-xs uppercase tracking-widest hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Llenar Contrato
                  </button>
                )}
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="group relative px-8 py-5 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-white/10 flex items-center gap-3 overflow-hidden text-xs uppercase tracking-widest border border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  Reportar Anomalía
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
                  <div className="w-20 h-20 bg-slate-900 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tighter">Sistemas Nominales</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No se detectan fallas de red activas</p>
                </div>
              ) : (
                tickets.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => router.push(`/soporte/${t.id}`)}
                    className="group relative p-8 bg-slate-900/20 border border-white/5 rounded-3xl hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-cyan-500 transition-all" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20 uppercase tracking-widest font-mono">
                            {t.ticketNumber}
                          </span>
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-none mb-2">{t.title}</h4>
                           <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-500 animate-pulse" />
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{t.category}</p>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-left md:text-right space-y-2">
                          <div className={`inline-flex items-center gap-3 text-[9px] font-black px-5 py-2 rounded-full border uppercase tracking-[0.2em] ${
                            t.status === 'OPEN' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 
                            t.status === 'IN_PROGRESS' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500' :
                            'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                          }`}>
                            {t.status}
                          </div>
                          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.3em]">PRIORIDAD: {t.priority}</p>
                        </div>
                        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                           <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Nuevo Reporte</h2>
                <p className="text-slate-500 text-sm mt-1">Suministre detalles precisos para el equipo técnico</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Título de la incidencia</label>
                <input 
                  type="text" 
                  value={newTicket.title}
                  onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                  placeholder="Ej: Bajada de velocidad o pérdida de paquetes"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-slate-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría técnica</label>
                <select 
                  value={newTicket.category}
                  onChange={e => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>Conectividad</option>
                  <option>Hardware (Equipo)</option>
                  <option>Lentitud / Inestabilidad</option>
                  <option>Administrativo</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción detallada</label>
                <textarea 
                  rows={4}
                  value={newTicket.description}
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 focus:outline-none transition-all resize-none placeholder:text-slate-700"
                  placeholder="Describa el comportamiento de sus equipos y el tiempo transcurrido..."
                  required
                />
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all border border-slate-700 text-xs uppercase tracking-widest"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 text-xs uppercase tracking-widest"
                >
                  {creating ? "Enviando reporte..." : "Enviar Reporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
