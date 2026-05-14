"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";
import { useRealtimeMessages } from "../../../hooks/useRealtimeMessages";
import AntennaContractForm from "../../../components/AntennaContractForm";

interface Message {
  id: string;
  content: string;
  authorId: string | null;
  createdAt: string;
  attachments: string | null;
  author?: { name: string; role: string };
}

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  contract?: any;
}

export default function TicketChatPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const pDni = searchParams.get("p_dni");
  
  // --- Realtime Hook ---
  const { messages, setMessages } = useRealtimeMessages(ticketId);
  // ---------------------

  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastMessageCount = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
  }, []);

  useEffect(() => {
    if ((status === "authenticated" && session?.user) || pDni) {
      fetchInitialData();
    } else if (status === "unauthenticated" && !pDni) {
      router.push("/auth/signin");
    }
  }, [status, session, router, ticketId, pDni]);

  const fetchInitialData = async () => {
    try {
      const url = new URL(`/api/support/tickets/${ticketId}/messages`, window.location.origin);
      if (pDni) url.searchParams.set("p_dni", pDni);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Error fetching ticket data");
      
      const data = await res.json();
      setMessages(data.messages);
      lastMessageCount.current = data.messages.length;
      setTicket(data.ticket);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      const lastMsg = messages[messages.length - 1];
      // Si el mensaje es del operador (authorId !== null)
      if (lastMsg && lastMsg.authorId !== null) {
        audioRef.current?.play().catch(() => {});
      }
      lastMessageCount.current = messages.length;
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      const url = new URL(`/api/support/tickets/${ticketId}/messages`, window.location.origin);
      if (pDni) url.searchParams.set("p_dni", pDni);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          authorId: session?.user?.id || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        lastMessageCount.current += 1;
        setContent("");
      }
    } catch (err) {
      console.error("[CHAT] Fetch error:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin relative z-10" />
        <div className="text-cyan-500 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse relative z-10">Sincronizando con el Centro de Control</div>
      </div>
    );
  }

  const showContractForm = ticket?.status === "CONTRACT_INITIATED" || 
                         ticket?.status === "TECH_IN_PROGRESS" || 
                         ticket?.status === "SIGNATURE_PENDING" ||
                         ticket?.status === "COMPLETED";

  if (showContractForm && ticket) {
    return (
      <div className="min-h-screen bg-slate-950 overflow-y-auto">
        <AntennaContractForm 
          nextInstallId={ticket.contract?.contractNumber || ticket.ticketNumber}
          initialData={{
            clientName: ticket.contract?.clientName || "",
            clientEmail: ticket.contract?.clientEmail || "",
            clientDni: ticket.contract?.clientDni || "",
            clientPhone: ticket.contract?.clientPhone || "",
            planType: ticket.contract?.planType || "",
          }}
          ticketStatus={ticket.status}
          ticketId={ticketId}
          onBack={() => fetchInitialData()}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

      <aside className="hidden lg:flex w-96 border-r border-white/5 bg-slate-900/40 backdrop-blur-3xl flex-col relative z-10">
        <div className="p-10 border-b border-white/5">
           <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10">Inteligencia de Enlace</h3>
           <div className="space-y-6">
              <Card variant="glass" className="p-6 border-white/5 bg-white/5">
                 <span className="text-[9px] font-mono font-black text-cyan-500 uppercase tracking-widest">Procedencia de Nodo</span>
                 <p className="text-sm text-white font-black mt-2 uppercase tracking-tight">MR Technology - Central NOC</p>
                 <div className="mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">Enlace Seguro AES-256</span>
                 </div>
              </Card>
              <div className="p-8 rounded-[2rem] border border-cyan-500/10 bg-cyan-500/5">
                 <p className="text-[10px] text-cyan-200/60 font-black uppercase tracking-[0.2em] leading-relaxed">Este canal está reservado para comunicaciones técnicas críticas y gestiones de contrato.</p>
              </div>
           </div>
        </div>
        <div className="mt-auto p-10">
           <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-[2.5rem] shadow-2xl shadow-cyan-500/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3">Soporte Corporativo</p>
              <p className="text-sm font-black text-white leading-tight uppercase tracking-tight">Monitoreo activo de terminal: {(ticket?.ticketNumber || 'NOC-LOG')}</p>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10">
        <header className="p-8 md:p-10 border-b border-white/5 bg-slate-900/60 backdrop-blur-3xl flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.push("/soporte/dashboard")} 
              className="w-14 h-14 bg-slate-950/50 hover:bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center transition-all active:scale-90 group"
            >
              <svg className="w-6 h-6 text-slate-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-5">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">{ticket?.title}</h2>
                <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest font-mono shadow-inner">
                  {ticket?.priority}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Nodo de Comunicación B2B Operativo</span>
              </div>
            </div>
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 md:p-16 space-y-12 custom-scrollbar scroll-smooth"
        >
          <div className="flex flex-col items-center mb-16">
             <div className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent mb-6" />
             <span className="bg-slate-900/60 backdrop-blur-xl border border-white/10 text-[9px] text-slate-500 font-black px-8 py-3 rounded-full uppercase tracking-[0.4em] shadow-2xl">
               Sesión Técnica Iniciada · {new Date().toLocaleDateString()}
             </span>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => {
              const isMe = msg.authorId === null;
              const isSystem = msg.content.includes("EL SISTEMA HA CAMBIADO") || msg.content.includes("ESTADO ACTUALIZADO");
              
              if (isSystem) {
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center my-6"
                  >
                    <span className="bg-slate-900/80 border border-cyan-500/20 text-[8px] text-cyan-400 font-black px-8 py-3 rounded-full uppercase tracking-[0.3em] shadow-2xl backdrop-blur-xl">
                       {msg.content}
                    </span>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  key={msg.id}
                  initial={{ x: isMe ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-4`}
                >
                  {!isMe && (
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-2xl">
                       <span className="text-[9px] font-black text-cyan-500">MRT</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <Card 
                      variant={isMe ? "glass" : "accent"}
                      hover={false}
                      className={`px-6 py-4 rounded-[1.8rem] text-sm md:text-base leading-relaxed ${
                        isMe 
                          ? "rounded-br-none bg-white text-slate-950" 
                          : "rounded-bl-none border-cyan-500/20 text-slate-100"
                      }`}
                    >
                      {msg.content}
                      
                      {msg.attachments && (
                         <div className="mt-4 p-3 bg-black/10 rounded-xl flex items-center gap-3 border border-white/5 hover:bg-black/20 transition-colors cursor-pointer group/file">
                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                               <svg className="w-4 h-4 text-cyan-500 group-hover/file:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            </div>
                            <div>
                               <p className="text-[9px] font-black uppercase truncate max-w-[120px]">Adjunto_Tecnico.bin</p>
                            </div>
                         </div>
                      )}
                    </Card>
                    <div className="flex items-center gap-3 mt-3 px-2">
                      <span className="text-[8px] text-slate-700 font-black uppercase tracking-[0.2em]">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!isMe && (
                         <>
                           <div className="w-1 h-1 bg-slate-800 rounded-full" />
                           <span className="text-[8px] text-cyan-700 font-black uppercase tracking-[0.3em]">
                             {msg.author?.name || 'Central NOC'}
                           </span>
                         </>
                      )}
                    </div>
                  </div>
                  {isMe && (
                     <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 text-slate-700 font-black text-[9px] shadow-2xl">
                        USER
                     </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <footer className="p-10 md:p-16 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent border-t border-white/5 relative">
           <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-4 rounded-[3rem] shadow-2xl flex items-end gap-4 transition-all focus-within:border-cyan-500/40 focus-within:bg-slate-900/80 group">
                <label className="p-6 text-slate-600 hover:text-cyan-400 transition-all cursor-pointer hover:bg-white/5 rounded-full active:scale-90">
                  <input type="file" className="hidden" multiple />
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>
                
                <textarea 
                  className="flex-1 bg-transparent border-none text-white text-lg px-2 py-5 focus:ring-0 outline-none resize-none max-h-48 placeholder:text-slate-800 font-bold"
                  rows={1}
                  placeholder="Transmitir reporte o consulta técnica..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!content.trim() || sending}
                  className="w-20 h-20 bg-white hover:bg-cyan-500 text-slate-950 hover:text-white rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-90 disabled:grayscale disabled:opacity-10 group-hover:rotate-6"
                >
                  {sending ? (
                    <div className="w-8 h-8 border-4 border-current border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-center gap-10 mt-10">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                   <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">AES-256 E2EE</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                   <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">Direct Access</span>
                </div>
              </div>
           </div>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.2); }
      `}</style>
    </div>
  );
}
