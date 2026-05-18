"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    name: string;
    role: string;
  };
}

export default function ChatStaffPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isAuthenticated = status === "authenticated";
  const currentUser = session?.user as { name?: string; role?: string; id?: string } | undefined;

  // Fetch messages from API
  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/internal/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setError("");
      } else {
        setError("Error de red al actualizar los mensajes.");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages(true);
      const interval = setInterval(() => {
        fetchMessages(false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    setError("");
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch("/api/internal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      } else {
        setError("Error al enviar el mensaje. Inténtalo de nuevo.");
        setNewMessage(content); // Restore message
      }
    } catch (err) {
      setError("Error de conexión al enviar.");
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-black tracking-[0.4em] uppercase text-xs">
        Iniciando Módulo de Comunicación...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
        <Card variant="glass" className="p-10 max-w-md w-full text-center border-red-500/20">
          <div className="w-16 h-16 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-center font-black text-red-500 text-2xl mx-auto mb-6">🔒</div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Acceso Restringido</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-6">Solo para personal del staff</p>
          <Link href="/">
            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase text-xs tracking-widest">
              Iniciar Sesión en NOC
            </button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 overflow-x-hidden font-sans selection:bg-cyan-500/30 relative flex flex-col">
      {/* Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black hover:scale-105 transition-all">MR</Link>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tighter">Command Center</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Staff Communications</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
              <Link href="/" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Volver a NOC</Link>
              <Link href="/tickets" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Soporte</Link>
              <Link href="/chat" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white bg-slate-800/80 rounded-lg border border-white/5">Chat Staff</Link>
              {currentUser?.role === "ADMIN" && (
                <>
                  <Link href="/reportes" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Intelligence</Link>
                  <Link href="/usuarios" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Equipo</Link>
                </>
              )}
            </div>
            <button onClick={() => signOut()} className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest border border-red-500/10 px-4 py-2 rounded-xl transition-all">Desconectar</button>
          </div>
        </div>
      </nav>

      {/* Main Chat Layout */}
      <main className="max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col flex-grow relative z-10 h-[calc(100vh-6rem)]">
        <header className="mb-6 flex justify-between items-center shrink-0">
          <div>
            <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.5em] mb-2">Canal Operativo General</p>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">CHAT STAFF</h1>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 border border-white/5 px-4 py-3 rounded-2xl">
            <div className={`w-2 h-2 rounded-full ${currentUser?.role === "ADMIN" ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Sesión: <span className="text-white">{currentUser?.name}</span> ({currentUser?.role})
            </span>
          </div>
        </header>

        {/* Chat Panel Box */}
        <Card variant="glass" className="flex flex-col flex-grow border-white/5 overflow-hidden p-0 relative min-h-[400px]">
          {/* Scrollable Message Box */}
          <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin scrollbar-track-slate-950/20 scrollbar-thumb-slate-800">
            {loading ? (
              <div className="h-full flex items-center justify-center flex-col gap-4 text-cyan-500 font-bold uppercase tracking-widest text-[10px] py-20">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                Cargando historial de chat...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] py-20">
                <span>📭 Sin mensajes recientes</span>
                <span className="text-[8px] text-slate-600 tracking-wider">Sé el primero en enviar un mensaje en el chat del staff.</span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isOwnMessage = msg.senderId === currentUser?.id;
                  const isSenderAdmin = msg.sender.role === "ADMIN";
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
                        {/* Sender Info tag */}
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${isSenderAdmin ? "text-cyan-400" : "text-purple-400"}`}>
                            {msg.sender.name}
                          </span>
                          <span className={`text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                            isSenderAdmin 
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                              : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}>
                            {msg.sender.role}
                          </span>
                          <span className="text-[7px] text-slate-600 font-black">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Content bubble */}
                        <div className={`px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed ${
                          isOwnMessage
                            ? isSenderAdmin
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-cyan-400/20"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(168,85,247,0.15)] border border-purple-400/20"
                            : isSenderAdmin
                              ? "bg-slate-900/90 text-white rounded-tl-none border border-cyan-500/10 hover:border-cyan-500/25 transition-all"
                              : "bg-slate-900/90 text-white rounded-tl-none border border-purple-500/10 hover:border-purple-500/25 transition-all"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer input form */}
          <div className="p-6 bg-slate-950/70 border-t border-white/5 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje interno para el staff..."
                disabled={sending}
                className="flex-grow bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/40 text-sm font-semibold transition-all placeholder:text-slate-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  !newMessage.trim() || sending
                    ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                    : currentUser?.role === "ADMIN"
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-102"
                      : "bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-102"
                }`}
              >
                {sending ? "Enviando..." : "Enviar"}
              </button>
            </form>

            {error && (
              <div className="mt-3 text-red-500 font-bold uppercase tracking-widest text-[8px] text-center">
                ⚠️ {error}
              </div>
            )}
          </div>
        </Card>
      </main>

      {/* Global CSS scrollbar styling override */}
      <style jsx global>{`
        body { background: #020617; }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.2);
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.4);
        }
      `}</style>
    </div>
  );
}
