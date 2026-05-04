"use client";
import { useState, useEffect } from "react";
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
    if (session?.user?.contractId && contracts.length > 0) {
      const found = contracts.find(c => c.id === (session.user as any).contractId);
      if (found) setCurrentContract(found);
    }
  }, [contracts, session]);
  // -------------------------------

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const contractId = (session.user as any).contractId;
      fetchTickets(contractId);
    }
  }, [status, session]);

  const fetchTickets = async (contractId: string) => {
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
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTicket,
          contractId: (session?.user as any).contractId
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setNewTicket({ title: "", description: "", category: "Conectividad" });
        fetchTickets((session?.user as any).contractId);
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
          <p className="text-cyan-500 font-mono text-xs animate-pulse uppercase tracking-widest">Sincronizando con NOC...</p>
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
              <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.3em] mt-1.5 opacity-80">Network Operations Center</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-b from-slate-900/80 to-slate-950 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Detalles del Contrato</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-1">Número Maestro</p>
                  <p className="text-xl font-mono font-black text-white">{(session?.user as any)?.contractNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Estado del Servicio</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    currentContract?.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    currentContract?.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {currentContract?.status || "Activo / Alta Velocidad"}
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5">
                <button className="w-full py-4 bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Descargar Copia Contrato
                </button>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Incidentes</h1>
                <p className="text-slate-500 text-sm mt-1">Gestión técnica y reportes en tiempo real</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-3 overflow-hidden text-sm uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Reportar Falla
              </button>
            </div>

            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-slate-800/50 rounded-[2.5rem] bg-slate-900/10">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1 uppercase tracking-tight">Todo despejado</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">No hay incidentes técnicos activos para esta conexión en este momento.</p>
                </div>
              ) : (
                tickets.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => router.push(`/soporte/${t.id}`)}
                    className="group relative p-8 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer overflow-hidden shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                       <svg className="w-12 h-12 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 uppercase tracking-widest">
                            {t.ticketNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{t.title}</h4>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">{t.category}</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-left md:text-right">
                          <div className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full border mb-2 ${
                            t.status === 'OPEN' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 
                            t.status === 'IN_PROGRESS' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500' :
                            'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                          }`}>
                            <span className="w-1.5 h-1.5 bg-current rounded-full" />
                            {t.status}
                          </div>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Prioridad {t.priority}</p>
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
                  {creating ? "Enviando al NOC..." : "Enviar Reporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
