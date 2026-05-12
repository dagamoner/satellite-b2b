import { useSearchParams } from "next/navigation";
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
    // Inicializar audio de notificación (Premium Beep)
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
  }, []);

  useEffect(() => {
    // Permitir acceso si está autenticado O si tiene p_dni (Lead)
    if ((status === "authenticated" && session?.user) || pDni) {
      fetchInitialData();
    } else if (status === "unauthenticated" && !pDni) {
      // Redirigir a login si no hay DNI y no está autenticado
      router.push("/auth/signin");
    }
  }, [status, session, router, ticketId, pDni]);

  const fetchInitialData = async () => {
    try {
      const url = new URL(`/api/support/tickets/${ticketId}/messages`, window.location.origin);
      if (pDni) url.searchParams.set("p_dni", pDni);

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error("Error fetching ticket data");
      }
      const data = await res.json();
      setMessages(data.messages);
      lastMessageCount.current = data.messages.length;
      setTicket(data.ticket);
    } catch (err) {
      console.error(err);
      // alert("No se pudo cargar el ticket. Verifique su acceso.");
    } finally {
      setLoading(false);
    }
  };

  // Lógica de notificación sonora vinculada a cambios en mensajes
  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.authorId !== null) {
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
          authorId: session?.user?.id || null, // Autor nulo si es cliente/lead
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        lastMessageCount.current += 1;
        setContent("");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "No se pudo enviar el mensaje"}`);
      }
    } catch (err) {
      console.error("[CHAT] Fetch error:", err);
      alert("Error de conexión al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-black tracking-widest animate-pulse uppercase">Estableciendo enlace seguro...</div>;

  // Si el estado es CONTRACT_INITIATED, TECH_IN_PROGRESS o SIGNATURE_PENDING, mostramos el formulario
  const showContractForm = ticket?.status === "CONTRACT_INITIATED" || 
                         ticket?.status === "TECH_IN_PROGRESS" || 
                         ticket?.status === "SIGNATURE_PENDING" ||
                         ticket?.status === "COMPLETED";

  if (showContractForm && ticket) {
    return (
      <div className="min-h-screen bg-[#020617] overflow-y-auto">
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
          onBack={() => {
            // Permitir volver al chat si no está finalizado
            fetchInitialData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans">
      {/* Sidebar de Contexto (Linked Tickets) */}
      <aside className="hidden lg:flex w-80 border-r border-white/5 bg-slate-900/20 backdrop-blur-3xl flex-col">
        <div className="p-8 border-b border-white/5">
           <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6 bg-slate-800/50 px-4 py-2 rounded-lg inline-block">Historial Vinculado</h3>
           <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
                 <span className="text-[9px] font-mono text-cyan-500">TK-39210</span>
                 <p className="text-xs text-white font-bold mt-1 uppercase line-clamp-1">Fallo en Antena V4 - Sector A</p>
                 <span className="text-[8px] text-slate-500 uppercase mt-2 block">Cerrado: 12 Mayo</span>
              </div>
              <div className="p-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5">
                 <p className="text-xs text-cyan-200 font-medium leading-relaxed">No hay otros tickets abiertos vinculados a este contrato en este momento.</p>
              </div>
           </div>
        </div>
        <div className="mt-auto p-8">
           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] shadow-2xl shadow-blue-500/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Soporte VIP 24/7</p>
              <p className="text-sm font-bold text-white">Su conexión satelital está siendo monitoreada por nuestro centro de operaciones.</p>
           </div>
        </div>
      </aside>

      {/* Chat Central */}
      <main className="flex-1 flex flex-col relative bg-slate-950/40">
        <header className="p-6 md:p-8 border-b border-white/5 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push("/soporte/dashboard")} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 active:scale-95 group">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase leading-none">{ticket?.title}</h2>
                <span className="hidden sm:inline-block px-3 py-1 bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {ticket?.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Canal Directo con Soporte Técnico MR Technology</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
        >
          <div className="flex flex-col items-center mb-12">
             <div className="w-px h-12 bg-gradient-to-b from-transparent to-cyan-500/50 mb-4" />
             <span className="bg-slate-900/80 backdrop-blur-xl border border-white/5 text-[9px] text-slate-500 font-bold px-6 py-2 rounded-full uppercase tracking-[0.3em]">
               Comunicaciones Técnicas Iniciadas · {new Date().toLocaleDateString()}
             </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.authorId === null;
            const isSystem = msg.content.includes("EL SISTEMA HA CAMBIADO") || msg.content.includes("ESTADO ACTUALIZADO");
            
            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-6 animate-in zoom-in duration-500">
                   <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                      <span className="relative bg-slate-950 border border-white/10 text-[9px] text-orange-400 font-black px-8 py-3 rounded-full uppercase tracking-[0.2em] shadow-2xl">
                         {msg.content}
                      </span>
                   </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-start gap-4 animate-in slide-in-from-bottom-4 duration-500`}>
                {!isMe && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/10 border border-white/10">
                     <span className="text-[10px] font-black text-white">MRT</span>
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-6 py-4 rounded-[2rem] text-sm md:text-base font-medium shadow-2xl relative group transition-all hover:scale-[1.02] ${
                    isMe 
                      ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-none shadow-blue-500/10" 
                      : "bg-slate-900/60 backdrop-blur-3xl text-slate-200 rounded-tl-none border border-white/5"
                  }`}>
                    {msg.content}
                    
                    {/* Indicador de adjuntos (Visual Mock para request 4) */}
                    {msg.attachments && (
                       <div className="mt-4 p-3 bg-black/20 rounded-2xl flex items-center gap-3 border border-white/5 hover:bg-black/40 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                             <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-white uppercase truncate max-w-[120px]">Evidencia_Tecnica.log</p>
                             <p className="text-[8px] text-slate-500">1.2 MB · Haga clic para descargar</p>
                          </div>
                       </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3 px-2">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-none">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isMe && (
                       <>
                         <div className="w-1 h-1 bg-slate-800 rounded-full" />
                         <span className="text-[9px] text-cyan-600 font-black uppercase tracking-widest leading-none">
                           {msg.author?.name || 'Operador Central'}
                         </span>
                       </>
                    )}
                  </div>
                </div>
                {isMe && (
                   <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 text-slate-600 font-black text-[10px]">
                      TÚ
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Interface - Glassmorphism Flow */}
        <footer className="p-8 md:p-12 bg-gradient-to-t from-slate-950 to-transparent border-t border-white/5 relative z-10">
           <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-end gap-3 transition-all focus-within:border-cyan-500/40 focus-within:shadow-cyan-500/5 group">
                {/* Botón de Adjuntos (Request 4) */}
                <label className="p-5 text-slate-500 hover:text-cyan-400 transition-all cursor-pointer hover:bg-white/5 rounded-full active:scale-95 group">
                  <input type="file" className="hidden" multiple onChange={() => alert("Simulación de subida: Archivo listo para enviar.")} />
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>
                
                <textarea 
                  className="flex-1 bg-transparent border-none text-white text-base px-2 py-4 focus:ring-0 outline-none resize-none max-h-40 placeholder:text-slate-700 font-medium"
                  rows={1}
                  placeholder="Escriba su reporte detallado para el equipo técnico..."
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
                  className="w-16 h-16 bg-white hover:bg-cyan-500 text-slate-950 hover:text-white rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-90 disabled:grayscale disabled:opacity-20 group-hover:rotate-12"
                >
                  {sending ? (
                    <div className="w-6 h-6 border-3 border-current border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Cifrado de Punto a Punto</span>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Prioridad Elevada</span>
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
