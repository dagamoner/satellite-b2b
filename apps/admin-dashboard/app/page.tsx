"use client";
import { useState, useEffect, useRef } from "react";
import { useRealtimeTickets, Ticket, TicketStatus, TicketPriority } from "../hooks/useRealtimeTickets";
import { useRealtimeMessages, Message } from "../hooks/useRealtimeMessages";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

// interface Message {
//   id: string;
//   content: string;
//   authorId: string | null;
//   createdAt: string;
//   author?: { name: string; role: string };
// }

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // Filtros
  const [filterPriority, setFilterPriority] = useState<TicketPriority | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "ALL">("OPEN");

  // --- Realtime Hooks ---
  const { tickets, loading: loadingTickets } = useRealtimeTickets();
  const { messages, setMessages } = useRealtimeMessages(selectedTicket?.id);
  // ----------------------


  const scrollRef = useRef<HTMLDivElement>(null);

  // Referencia para evitar cierres de estado obsoletos en intervalos
  const selectedTicketRef = useRef<Ticket | null>(null);
  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

  const isAuthenticated = status === "authenticated";

  // Sincronizar el ticket seleccionado con la data fresca de los tickets
  useEffect(() => {
    if (selectedTicket?.id) {
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedTicket)) {
        setSelectedTicket(updated);
      }
    }
  }, [tickets, selectedTicket]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Ya no necesitamos fetchTickets ni fetchMessages locales, los hooks se encargan


  const handleSendReply = async () => {
    if (!reply.trim() || !selectedTicket || sending) return;

    setSending(true);
    try {
      const currentUserId = (session?.user as { id?: string })?.id;
      console.log("[CHAT] Sending message for ticket:", selectedTicket.id, "as user:", currentUserId);

      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: reply,
          authorId: currentUserId || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setReply("");
      } else {
        const errorData = await res.json();
        console.error("[CHAT] Error response:", errorData);
        alert(`Error: ${errorData.error || "No se pudo enviar el mensaje"}`);
      }
    } catch (err) {
      console.error("[CHAT] Fetch error:", err);
      alert("Error de conexión al enviar respuesta");
    } finally {
      setSending(false);
    }
  };

  const updateTicketStatus = async (status?: TicketStatus, priority?: TicketPriority) => {
    const ticket = selectedTicket;
    if (!ticket) return;

    // Actualización optimista para mejorar UX
    const oldStatus = ticket.status;
    const oldPriority = ticket.priority;

    setSelectedTicket(prev => prev ? { 
      ...prev, 
      status: status || prev.status, 
      priority: priority || prev.priority 
    } : null);

    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority }),
      });
      
      if (!res.ok) throw new Error("Error en servidor");
      
      // La actualización en Realtime refrescará el ticket automáticamente

    } catch (_error) {
      alert("Error actualizando ticket");
      // Revertir si falla
      setSelectedTicket(prev => prev ? { ...prev, status: oldStatus, priority: oldPriority } : null);
    }
  };

  const priorityStyles: Record<TicketPriority, string> = {
    CRITICAL: "bg-red-500/20 text-red-500 border-red-500/50",
    HIGH: "bg-orange-500/20 text-orange-500 border-orange-500/50",
    MEDIUM: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    LOW: "bg-slate-500/20 text-slate-500 border-slate-500/50",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError("Credenciales inválidas o acceso denegado");
    }
  };

  const handleLogout = () => {
    signOut();
  };

  if (status === "loading") return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-bold">Autenticando...</div>;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30">
        <div className="w-full max-w-md relative z-10 bg-slate-900/40 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl shadow-cyan-500/20 text-2xl mb-6">MR</div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-2">
              Gestión Administrativa
            </h1>
            <p className="text-slate-400 font-medium text-sm">
              Acceso Restringido
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                required
              />
            </div>

            {authError && (
              <div className="text-red-400 text-xs text-center font-bold bg-red-500/10 py-3 rounded-xl">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20 tracking-widest uppercase text-sm"
            >
              Ingresar al Sistema
            </button>
          </form>
          
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "#"} className="text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Regresar a la Página Principal
            </Link>
            <div className="text-cyan-500/20 text-[10px] font-bold uppercase tracking-widest">Acceso Restringido - Personal Autorizado</div>
          </div>
        </div>
      </main>
    );
  }

  if (loadingTickets) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-bold">Iniciando Consola de Operaciones...</div>;


  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Sidebar - Gestión de Entrada */}
      <aside className="w-[28rem] border-r border-white/5 bg-slate-950/40 backdrop-blur-3xl flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-2xl shadow-cyan-500/20">MR</div>
              <div>
                <h1 className="text-white font-black text-lg tracking-tight uppercase">Panel de Operaciones</h1>
                <span className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">MR Technology</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 bg-red-500/10 px-4 py-2 rounded-xl uppercase font-black transition-all">
              Salir
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setFilterStatus(filterStatus === "OPEN" ? "ALL" : "OPEN")}
              className={`col-span-2 text-[10px] font-black uppercase tracking-widest px-4 py-4 rounded-[1.5rem] border transition-all flex items-center justify-between ${filterStatus === "OPEN" ? "bg-cyan-500 text-white border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02]" : "bg-slate-900/40 text-slate-500 border-white/5 hover:border-white/10"}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-current ${filterStatus === 'OPEN' ? 'animate-pulse' : ''}`} />
                Tickets Abiertos
              </div>
              <span className="bg-black/20 px-2 py-1 rounded-lg text-[10px]">{tickets.filter(t => t.status === 'OPEN').length}</span>
            </button>
            
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => {
              const count = tickets.filter(t => t.priority === p).length;
              const isActive = filterPriority === p;
              const styles = priorityStyles[p as TicketPriority];
              
              return (
                <button
                  key={p}
                  onClick={() => setFilterPriority(isActive ? "ALL" : p as TicketPriority)}
                  className={`text-[9px] font-black uppercase tracking-widest p-4 rounded-[1.5rem] border transition-all flex flex-col gap-2 items-start ${
                    isActive 
                      ? `${styles.replace('/20', '')} border-current shadow-lg scale-[1.05]` 
                      : "bg-slate-900/40 text-slate-500 border-white/5 hover:border-white/10"
                  } ${p === 'CRITICAL' && !isActive && count > 0 ? 'animate-pulse border-red-500/30' : ''}`}
                >
                  <span className="opacity-60">{p}</span>
                  <span className="text-xl font-black">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navegación Principal */}
        <div className="px-6 py-4 space-y-4 border-b border-white/10 bg-cyan-500/5">
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">SISTEMA ACTUALIZADO v2</div>
          
          <Link href="/contratos" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Auditoría
          </Link>

          {(session?.user as { role?: string })?.role === "ADMIN" && (
            <>
              <Link href="/usuarios" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Equipo
              </Link>
              <Link href="/reportes" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reportes
              </Link>
            </>
          )}

        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {(() => {
            const filtered = tickets.filter(t => {
              if (filterPriority !== "ALL" && t.priority !== filterPriority) return false;
              if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
              return true;
            });

            if (filtered.length === 0) {
              return <div className="p-8 text-center text-slate-600 font-bold uppercase text-[10px] tracking-widest py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">No hay tickets con este filtro</div>;
            }

            return filtered.map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-6 rounded-[2rem] border transition-all duration-300 group cursor-pointer ${
                  selectedTicket?.id === t.id 
                    ? "bg-slate-900/80 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.1)]" 
                    : "bg-slate-900/20 border-white/5 hover:border-white/10 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-black text-cyan-500 tracking-tighter">{t.ticketNumber}</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full border tracking-widest ${priorityStyles[t.priority]}`}>
                    {t.priority}
                  </span>
                </div>
                <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">{t.title}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide truncate">{t.contract.clientName}</p>
                
                <div className="mt-5 flex justify-between items-center border-t border-white/5 pt-4 text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-600">{new Date(t.createdAt).toLocaleDateString()}</span>
                  <span className={`flex items-center gap-2 ${t.status === 'OPEN' ? 'text-amber-500' : 'text-cyan-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-current ${t.status === 'OPEN' ? 'animate-pulse' : ''}`} />
                    {t.status}
                  </span>
                </div>
              </div>
            ));
          })()}
        </div>
      </aside>

      {/* Consola de Comando */}
      <main className="flex-1 flex flex-col relative bg-slate-950/20">
        {selectedTicket ? (
          <>
            <header className="p-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{selectedTicket.title}</h2>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-1 rounded font-mono font-bold tracking-tighter border border-cyan-500/30">{selectedTicket.ticketNumber}</span>
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                  <p className="text-sm text-slate-400 font-medium">
                    Cliente: <span className="text-white font-bold">{selectedTicket.contract.clientName}</span> 
                    <span className="mx-3 text-slate-700">|</span> 
                    Contrato: <span className="text-cyan-400 font-mono text-sm">{selectedTicket.contract.contractNumber}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-950 rounded-2xl p-1.5 border border-white/10 flex gap-1 shadow-inner">
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateTicketStatus(undefined, p as TicketPriority)}
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${
                        selectedTicket.priority === p 
                          ? "bg-slate-800 text-white shadow-lg border border-white/5" 
                          : "text-slate-600 hover:text-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => updateTicketStatus(selectedTicket.status === 'CLOSED' ? 'OPEN' : 'CLOSED')}
                  className={`text-sm font-black px-8 py-4 rounded-2xl transition-all shadow-2xl tracking-widest uppercase ${
                    selectedTicket.status === 'CLOSED' 
                      ? "bg-slate-800 text-slate-400 border border-white/5" 
                      : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/30 active:scale-95"
                  }`}
                >
                  {selectedTicket.status === 'CLOSED' ? "Re-activar Canal" : "Finalizar & Cerrar"}
                </button>
              </div>
            </header>

            {/* Area de Intercambio Técnico */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-10 flex flex-col gap-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
            >
               {/* Contexto Inicial */}
               <div className="bg-slate-900/60 border border-white/10 p-10 rounded-[3rem] self-center max-w-3xl w-full relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </div>
                  <h4 className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em] mb-6 text-center">Incidente Inicial Reportado</h4>
                  <p className="text-slate-200 text-lg italic text-center leading-relaxed font-medium">&quot;{selectedTicket.description}&quot;</p>
               </div>

               {/* Hilo de Mensajes */}
               <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
                  {messages.map((msg) => {
                    const isSystem = msg.content.includes("SISTEMA HA CAMBIADO") || msg.content.includes("ESTADO ACTUALIZADO");
                    const isStaff = msg.authorId !== null && !isSystem;
                    
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-6 animate-in fade-in zoom-in duration-500">
                          <span className="bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-400 font-black px-8 py-3 rounded-full uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex ${isStaff ? "justify-end" : "justify-start"} items-end gap-4 group animate-in slide-in-from-bottom-4 duration-300`}>
                        {!isStaff && (
                          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 font-bold border border-white/10 shadow-lg">C</div>
                        )}
                        <div className={`max-w-[75%] flex flex-col ${isStaff ? "items-end" : "items-start"}`}>
                          <div className={`px-8 py-5 rounded-[2rem] text-sm font-medium shadow-xl leading-relaxed transition-all hover:shadow-2xl ${
                            isStaff 
                              ? "bg-cyan-600 text-white rounded-br-none" 
                              : "bg-slate-800/90 text-slate-100 rounded-bl-none border border-white/10"
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-xs text-slate-500 font-black mt-3 uppercase tracking-widest px-2">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isStaff && ` · SOPORTE TÉCNICO`}
                          </span>
                        </div>
                        {isStaff && (
                          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center flex-shrink-0 text-white font-black shadow-lg shadow-cyan-500/30 text-sm">MRT</div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Input de Operador */}
            <footer className="p-10 border-t border-white/5 bg-slate-900/60 backdrop-blur-3xl z-10">
               <div className="max-w-4xl mx-auto flex gap-6 bg-slate-950 p-3 rounded-[3rem] border border-white/10 shadow-2xl group transition-all focus-within:border-cyan-500/40">
                  <textarea 
                    className="flex-1 bg-transparent border-none rounded-2xl px-6 py-5 text-md text-white focus:ring-0 outline-none resize-none placeholder:text-slate-700 font-medium custom-scrollbar"
                    placeholder="Escriba respuesta operativa detallada..."
                    rows={1}
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={!reply.trim() || sending}
                    className="w-16 h-16 bg-white hover:bg-cyan-500 text-slate-950 hover:text-white rounded-full shadow-2xl transition-all flex flex-col items-center justify-center active:scale-95 disabled:grayscale disabled:opacity-30"
                  >
                    {sending ? (
                      <div className="w-7 h-7 border-3 border-current border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
               </div>
               <p className="text-xs font-black text-center text-slate-600 mt-6 uppercase tracking-[0.4em]">Canal de Comunicación Crítica · MR Technology</p>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full" />
                <div className="w-48 h-48 rounded-[4rem] bg-slate-900 border border-white/10 flex items-center justify-center relative shadow-2xl">
                    <svg className="w-20 h-20 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
             </div>
             <div className="text-center">
               <p className="font-black text-sm uppercase tracking-[0.6em] text-slate-700 mb-4">Centro de Operaciones MRT</p>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter opacity-30">Seleccione un Ticket para operar</h3>
             </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.3); }
      `}</style>
    </div>
  );
}
