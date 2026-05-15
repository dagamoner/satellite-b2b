"use client";
import { useState, useEffect, useRef } from "react";
import { useRealtimeTickets, Ticket, TicketStatus, TicketPriority } from "../../hooks/useRealtimeTickets";
import { useRealtimeMessages, Message } from "../../hooks/useRealtimeMessages";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@repo/ui/card";

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

// QuickMetrics removed (unused in this page)

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMessageCount = useRef<number>(0);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
  }, []);

  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      const lastMsg = messages[messages.length - 1];
      // Si el mensaje es del cliente (authorId === null o no es el usuario actual)
      if (lastMsg && lastMsg.authorId === null) {
        audioRef.current?.play().catch(() => {});
      }
      lastMessageCount.current = messages.length;
    }
  }, [messages]);

  const isAuthenticated = status === "authenticated";

  // Referencia para evitar cierres de estado obsoletos en intervalos
  const selectedTicketRef = useRef<Ticket | null>(null);
  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

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

    const tempId = `temp-${Date.now()}`;
    const newMsgContent = reply.trim();
    
    // Optimistic Update
    setMessages(prev => [...prev, {
      id: tempId,
      content: newMsgContent,
      authorId: (session?.user as any)?.id || "STAFF",
      createdAt: new Date().toISOString(),
      author: { name: "Tú", role: "TECH" }
    }]);

    setReply("");
    setSending(true);

    try {
      const response = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: newMsgContent,
          authorId: (session?.user as any)?.id || "1" // Usar ID real si existe
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo enviar el mensaje");
      }
      
      // El hook useRealtimeMessages recibirá el mensaje real via Supabase
      // y filtrará duplicados si manejamos bien el ID temporal vs Real.
      // Pero como el ID real será diferente, limpiaremos el temporal después de un momento
      // o el hook puede manejarlo.
      
    } catch (err: any) {
      console.error("[CHAT] Error:", err);
      // Revertir cambio optimístico si falla
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert(`Error: ${err.message}`);
    } finally {
      setSending(false);
      setTimeout(() => scrollToBottom(), 100);
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
      
      // Enviar mensaje de sistema al chat
      let systemMsg = "";
      if (status && status !== oldStatus) systemMsg = `[SISTEMA] ESTADO ACTUALIZADO A: ${status}`;
      if (priority && priority !== oldPriority) systemMsg = `[SISTEMA] PRIORIDAD CAMBIADA A: ${priority}`;

      if (systemMsg) {
        await fetch(`/api/support/tickets/${ticket.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            content: systemMsg,
            authorId: null // Los mensajes de sistema no tienen autor físico o son null
          }),
        });
      }

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
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30 overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 blur-[150px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md relative z-10"
        >
          <Card variant="glass" className="p-10" hover={false}>
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl shadow-cyan-500/20 text-2xl mb-6 relative group">
                <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-110 transition-transform duration-500" />
                MR
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-2">
                Gestión Administrativa
              </h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">
                Centro de Operaciones NOC
              </p>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-slate-800 font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-slate-800 font-bold"
                  required
                />
              </div>

              {authError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-400 text-[10px] text-center font-black bg-red-500/10 py-3 rounded-xl border border-red-500/20 uppercase tracking-widest"
                >
                  {authError}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20 tracking-widest uppercase text-xs"
              >
                Ingresar al Sistema
              </button>
            </motion.form>
            
            <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center gap-6">
              <Link href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "#"} className="text-[10px] font-black text-slate-600 hover:text-cyan-400 transition-colors flex items-center gap-2 uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Regresar a la Página Principal
              </Link>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="text-cyan-500/20 text-[9px] font-black uppercase tracking-[0.4em] text-center">Acceso Restringido - Personal Autorizado</div>
            </motion.div>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (loadingTickets) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-bold">Iniciando Consola de Operaciones...</div>;


  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar - Gestión de Entrada */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-80 border-r border-white/5 bg-slate-950/40 backdrop-blur-3xl flex flex-col shadow-2xl z-20"
      >
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-3 mb-6 justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="w-8 h-8 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:border-cyan-500/50 transition-all active:scale-90"
                title="Volver al Dashboard"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <a 
                href="https://satellite-b2b.vercel.app/" 
                className="w-8 h-8 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all active:scale-90"
                title="Web Principal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </a>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[1rem] flex items-center justify-center text-white font-black shadow-2xl shadow-cyan-500/20 relative group text-sm">
                <div className="absolute inset-0 bg-white/20 rounded-[1rem] scale-0 group-hover:scale-110 transition-transform duration-500" />
                MR
              </div>
              <div>
                <h1 className="text-white font-black text-base tracking-tight uppercase leading-none">Console</h1>
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 block">NOC Central</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-[8px] text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 bg-red-500/5 px-3 py-1.5 rounded-lg uppercase font-black transition-all hover:bg-red-500/10">
              Out
            </button>
          </div>

          <div className="text-[9px] font-black text-cyan-500/50 uppercase tracking-[0.4em] mb-4 text-center">Filtros de Red</div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-2"
          >
            <motion.button 
              variants={itemVariants}
              onClick={() => setFilterStatus(filterStatus === "OPEN" ? "ALL" : "OPEN")}
              className={`col-span-2 text-[9px] font-black uppercase tracking-widest px-4 py-3 rounded-[1rem] border transition-all flex items-center justify-between group ${filterStatus === "OPEN" ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "bg-slate-900/40 text-slate-500 border-white/5 hover:border-white/10"}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${filterStatus === 'OPEN' ? 'animate-pulse' : ''}`} />
                Canales Abiertos
              </div>
              <span className="bg-black/20 px-2 py-0.5 rounded text-[8px] font-black">{tickets.filter(t => t.status === 'OPEN').length}</span>
            </motion.button>
            
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => {
              const count = tickets.filter(t => t.priority === p).length;
              const isActive = filterPriority === p;
              const styles = priorityStyles[p as TicketPriority];
              
              return (
                <motion.button
                  variants={itemVariants}
                  key={p}
                  onClick={() => setFilterPriority(isActive ? "ALL" : p as TicketPriority)}
                  className={`text-[8px] font-black uppercase tracking-widest p-3 rounded-[1rem] border transition-all flex flex-col gap-0.5 items-start group ${
                    isActive 
                      ? `${styles.replace('/20', '')} border-current shadow-md` 
                      : "bg-slate-900/40 text-slate-500 border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="opacity-60">{p}</span>
                  <span className="text-lg font-black">{count}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-950/20">
          <AnimatePresence mode="popLayout">
            {(() => {
              const filtered = tickets.filter(t => {
                if (filterPriority !== "ALL" && t.priority !== filterPriority) return false;
                if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center text-slate-700 font-black uppercase text-[8px] tracking-[0.3em] py-16 bg-slate-900/10 rounded-[2rem] border border-dashed border-white/5"
                  >
                    Cero incidencias
                  </motion.div>
                );
              }

              return filtered.map((t, idx) => (
                <motion.div
                  layout
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-[1.5rem] border transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                    selectedTicket?.id === t.id 
                      ? "bg-slate-900/80 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20" 
                      : "bg-slate-900/20 border-white/5 hover:border-white/10 hover:bg-slate-900/40"
                  }`}
                >
                  {selectedTicket?.id === t.id && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    />
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-mono font-black text-cyan-500/60 tracking-tighter uppercase">{t.ticketNumber}</span>
                    <span className={`text-[7px] font-black px-2 py-0.5 rounded-full border tracking-[0.1em] uppercase ${priorityStyles[t.priority]}`}>
                      {t.priority}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-xs mb-1 uppercase tracking-tight line-clamp-1 leading-tight group-hover:text-cyan-400 transition-colors">{t.title}</h3>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest truncate max-w-[90%]">{t.contract.clientName}</p>
                  
                  <div className="mt-3 flex justify-between items-center border-t border-white/5 pt-2 text-[8px] font-black uppercase tracking-widest">
                    <span className="text-slate-700">{new Date(t.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}</span>
                    <span className={`flex items-center gap-1.5 ${t.status === 'OPEN' ? 'text-amber-500' : 'text-cyan-500'}`}>
                      <span className={`w-1 h-1 rounded-full bg-current ${t.status === 'OPEN' ? 'animate-pulse' : ''}`} />
                      {t.status}
                    </span>
                  </div>
                </motion.div>
              ));
            })()}
          </AnimatePresence>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative bg-slate-950/20 z-10">
        {selectedTicket ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={selectedTicket.id}
            className="flex-1 flex flex-col h-full"
          >
            <header className="p-10 border-b border-white/5 bg-slate-900/40 backdrop-blur-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-6"
                >
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="w-12 h-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:border-cyan-500/40 transition-all active:scale-90 shadow-2xl"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{selectedTicket.title}</h2>
                </motion.div>
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 mt-5"
                >
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-lg font-black tracking-widest border border-cyan-500/20 uppercase">{selectedTicket.ticketNumber}</span>
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                    Operador: <span className="text-white font-black">{selectedTicket.contract.clientName}</span> 
                    <span className="mx-4 opacity-20">|</span> 
                    Canal: <span className="text-cyan-400 font-mono">{selectedTicket.contract.contractNumber}</span>
                  </p>
                </motion.div>
              </div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-5 relative z-10"
              >
                <div className="bg-slate-950/80 rounded-[1.8rem] p-2 border border-white/10 flex gap-1 shadow-2xl backdrop-blur-xl">
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateTicketStatus(undefined, p as TicketPriority)}
                      className={`px-5 py-2.5 rounded-[1.2rem] text-[9px] font-black tracking-[0.2em] transition-all uppercase ${
                        selectedTicket.priority === p 
                          ? "bg-slate-800 text-white shadow-xl border border-white/10 ring-1 ring-white/5" 
                          : "text-slate-600 hover:text-slate-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => updateTicketStatus(selectedTicket.status === 'CLOSED' ? 'OPEN' : 'CLOSED')}
                  className={`text-[10px] font-black px-10 py-4 rounded-[1.8rem] transition-all shadow-2xl tracking-[0.3em] uppercase border relative overflow-hidden group ${
                    selectedTicket.status === 'CLOSED' 
                      ? "bg-slate-900 text-slate-500 border-white/10" 
                      : "bg-emerald-600 text-white border-emerald-400/50 hover:bg-emerald-500 shadow-emerald-500/20"
                  }`}
                >
                  <span className="relative z-10">{selectedTicket.status === 'CLOSED' ? "Abrir Canal" : "Cerrar Canal"}</span>
                  <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              </motion.div>
            </header>

            {/* Area de Intercambio Técnico */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col gap-10 custom-scrollbar relative"
            >
               {/* Contexto Inicial */}
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="relative self-center max-w-2xl w-full"
               >
                 <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full" />
                 <Card variant="glass" className="p-8 border-cyan-500/10" hover={false}>
                    <h4 className="text-[8px] font-black text-cyan-500/50 uppercase tracking-[0.5em] mb-4 text-center">Incidente Inicial</h4>
                    <p className="text-slate-300 text-lg font-medium text-center leading-relaxed italic tracking-tight opacity-80">&quot;{selectedTicket.description}&quot;</p>
                 </Card>
               </motion.div>

               {/* Hilo de Mensajes */}
               <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full mb-10">
                    <AnimatePresence mode="popLayout">
                    {messages.map((msg, idx) => {
                      const isSystem = msg.content.startsWith("[SISTEMA]");
                      const isStaff = msg.authorId !== null && !isSystem;
                      
                      if (isSystem) {
                        return (
                          <motion.div 
                            key={msg.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center my-4"
                          >
                            <span className="bg-slate-900/60 border border-cyan-500/20 text-[8px] text-cyan-500/70 font-black px-8 py-2.5 rounded-full uppercase tracking-[0.3em] backdrop-blur-md shadow-xl flex items-center gap-3">
                              <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                              {msg.content.replace("[SISTEMA]", "").trim()}
                            </span>
                          </motion.div>
                        );
                      }

                      return (
                        <motion.div 
                          key={msg.id} 
                          initial={{ opacity: 0, x: isStaff ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex ${isStaff ? "justify-end" : "justify-start"} items-end gap-4 group`}
                        >
                          {!isStaff && (
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 text-[9px] font-black text-slate-700 shadow-xl">CLI</div>
                          )}
                          <div className={`max-w-[75%] flex flex-col ${isStaff ? "items-end" : "items-start"}`}>
                            <Card 
                              variant={isStaff ? "accent" : "glass"} 
                              hover={false}
                              className={`px-6 py-4 rounded-[1.8rem] text-sm leading-relaxed ${
                                isStaff 
                                  ? "rounded-br-none border-cyan-500/20 text-white" 
                                  : "rounded-bl-none border-white/5 text-slate-200"
                              }`}
                            >
                              {msg.content}
                            </Card>
                            <span className="text-[7px] text-slate-600 font-black mt-2 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              <span className="w-1 h-1 bg-slate-800 rounded-full" />
                              {isStaff ? "NOC OPERATOR" : "CLIENT TERMINAL"}
                            </span>
                          </div>
                          {isStaff && (
                            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center flex-shrink-0 text-white font-black shadow-lg shadow-cyan-500/20 text-[8px] relative overflow-hidden">
                              <div className="absolute inset-0 bg-white/10 animate-pulse" />
                              <span className="relative z-10">NOC</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                    </AnimatePresence>
               </div>
            </div>

            {/* Input de Operador */}
            <footer className="p-8 lg:p-10 border-t border-white/5 bg-slate-950/60 backdrop-blur-3xl relative z-20">
               <div className="max-w-4xl mx-auto space-y-6">
                  {/* Quick Responses */}
                  <div className="flex flex-wrap gap-2 justify-center pb-2">
                    {[
                      { label: "Diagnóstico", text: "Recibido. Iniciando diagnóstico remoto de enlace." },
                      { label: "Visita", text: "Se requiere visita técnica presencial. Coordinando agenda." },
                      { label: "Restablecido", text: "Parámetros de señal optimizados. Por favor verifique conexión." },
                      { label: "Contrato", text: "Gestión de contrato en curso. Procediendo con la activación." }
                    ].map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => setReply(q.text)}
                        className="text-[8px] font-black uppercase tracking-widest px-4 py-2 bg-slate-900/50 border border-white/5 rounded-full text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all hover:scale-105 active:scale-95"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 bg-slate-950/80 p-3 rounded-[2.5rem] border border-white/10 shadow-2xl focus-within:border-cyan-500/40 transition-all duration-500">
                    <textarea 
                      className="flex-1 bg-transparent border-none rounded-2xl px-5 py-3 text-sm text-white focus:ring-0 outline-none resize-none placeholder:text-slate-800 font-bold custom-scrollbar"
                      placeholder="Escriba respuesta operativa..."
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
                      className="w-12 h-12 bg-white hover:bg-cyan-500 text-slate-950 hover:text-white rounded-full shadow-2xl transition-all flex items-center justify-center active:scale-90 disabled:grayscale disabled:opacity-20"
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-[7px] font-black text-center text-slate-800 uppercase tracking-[0.6em]">Comunicaciones Encriptadas · NOC Protocol v4.2</p>
               </div>
            </footer>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">
             <motion.div 
               animate={{ 
                 scale: [1, 1.05, 1],
                 opacity: [0.3, 0.5, 0.3]
               }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" 
             />
             
             <div className="w-full max-w-6xl z-20">
               {/* No metrics here, keep it minimal */}
             </div>

             <div className="relative mt-12">
                <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, type: "spring" }}
                  className="w-56 h-56 rounded-[5rem] bg-slate-900/50 border border-white/5 flex items-center justify-center relative shadow-inner backdrop-blur-3xl group"
                >
                    <svg className="w-24 h-24 text-slate-800 group-hover:text-cyan-500/20 transition-colors duration-1000" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </motion.div>
             </div>
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="text-center relative z-10 mt-12"
             >
               <p className="font-black text-[10px] uppercase tracking-[0.8em] text-slate-700 mb-6">Network Operations Center</p>
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter opacity-10">Esperando Selección</h3>
             </motion.div>
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
