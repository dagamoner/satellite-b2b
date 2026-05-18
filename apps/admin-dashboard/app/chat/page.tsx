"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

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

interface Room {
  id: string;
  name: string;
  type: "GENERAL" | "DIRECT" | "GROUP";
  members: User[];
  lastMessage?: {
    content: string;
    senderName: string;
    createdAt: string;
  } | null;
}

export default function ChatStaffPage() {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Group creation modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const isAuthenticated = status === "authenticated";
  const currentUser = session?.user as { name?: string; role?: string; id?: string } | undefined;

  // Fetch all staff users for direct chats / group creation
  const fetchStaffUsers = async () => {
    try {
      const res = await fetch("/api/internal/staff-users");
      if (res.ok) {
        const data = await res.json();
        // Exclude current user from contact list
        const list = data.users.filter((u: User) => u.id !== currentUser?.id);
        setStaffUsers(list);
      }
    } catch (err) {
      console.error("Error fetching staff users:", err);
    }
  };

  // Fetch rooms list
  const fetchRooms = async (silent = false) => {
    if (!silent) setLoadingRooms(true);
    try {
      const res = await fetch("/api/internal/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      if (!silent) setLoadingRooms(false);
    }
  };

  // Fetch messages for active room
  const fetchMessages = async (silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/internal/rooms/${activeRoomId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setError("");
      } else {
        setError("Error al actualizar los mensajes.");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Initial loads and periodic polling
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchStaffUsers();
      fetchRooms();
    }
  }, [isAuthenticated, currentUser?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsInitialLoad(true);
      fetchMessages();
    }
  }, [activeRoomId, isAuthenticated]);

  // Periodic polling for rooms and messages
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        fetchRooms(true);
        fetchMessages(true);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeRoomId]);

  // Scroll to bottom dynamics
  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 250;
      
      if (isAtBottom || isInitialLoad) {
        containerRef.current.scrollTo({
          top: scrollHeight,
          behavior: isInitialLoad ? "auto" : "smooth",
        });
        
        if (isInitialLoad && messages.length > 0) {
          setIsInitialLoad(false);
        }
      }
    }
  }, [messages, isInitialLoad]);

  // Start or open Direct Message room
  const handleStartDM = async (otherUserId: string) => {
    setError("");
    try {
      const res = await fetch("/api/internal/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "DIRECT",
          memberIds: [otherUserId],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Add to rooms if not already there
        if (!rooms.some((r) => r.id === data.room.id)) {
          setRooms((prev) => [...prev, data.room]);
        }
        setActiveRoomId(data.room.id);
      } else {
        setError("Error al iniciar chat privado.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al iniciar DM.");
    }
  };

  // Create custom group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUserIds.length === 0 || creatingGroup) return;

    setCreatingGroup(true);
    setError("");
    try {
      const res = await fetch("/api/internal/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "GROUP",
          memberIds: selectedUserIds,
          name: groupName.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRooms((prev) => [...prev, data.room]);
        setActiveRoomId(data.room.id);
        setIsGroupModalOpen(false);
        setGroupName("");
        setSelectedUserIds([]);
      } else {
        setError("Error al crear el grupo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al crear grupo.");
    } finally {
      setCreatingGroup(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    setError("");
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(`/api/internal/rooms/${activeRoomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: "smooth"
            });
          }
        }, 50);
      } else {
        setError("Error al enviar el mensaje.");
        setNewMessage(content);
      }
    } catch (err) {
      setError("Error de conexión.");
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  // Toggle user selection for group
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

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
    <div className="min-h-screen bg-[#020617] text-slate-300 overflow-x-hidden font-sans selection:bg-cyan-500/30 relative flex flex-col h-screen">
      {/* Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl sticky top-0 z-50 shrink-0">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
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

      {/* Main Grid Workspace */}
      <div className="flex flex-grow overflow-hidden relative z-10 h-[calc(100vh-5rem)]">
        
        {/* Left Sidepanel (Rooms, Groups, and Contacts) */}
        <aside className="w-80 border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col shrink-0">
          {/* Active User Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm uppercase">
                {currentUser?.name?.slice(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-xs truncate">{currentUser?.name}</p>
                <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Rooms and Contacts lists (Scrollable container) */}
          <div className="flex-grow overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin">
            
            {/* 1. Chats & Groups Section */}
            <div>
              <div className="flex justify-between items-center px-2 mb-3">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Canales y Grupos</span>
                <button 
                  onClick={() => setIsGroupModalOpen(true)}
                  className="text-[9px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1"
                >
                  ➕ Grupo
                </button>
              </div>

              <div className="space-y-1">
                {loadingRooms ? (
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider py-2 text-center">
                    Cargando canales...
                  </div>
                ) : (
                  rooms.map((room) => {
                    const isActive = room.id === activeRoomId;
                    const isDM = room.type === "DIRECT";
                    const isGeneral = room.type === "GENERAL";

                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoomId(room.id)}
                        className={`w-full text-left px-3 py-3 rounded-xl transition-all flex flex-col gap-1 ${
                          isActive 
                            ? "bg-slate-900 border border-white/10 shadow-lg text-white" 
                            : "hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs">
                            {isGeneral ? "🌐" : isDM ? "👤" : "👥"}
                          </span>
                          <span className="text-xs font-black truncate">{room.name}</span>
                        </div>
                        {room.lastMessage && (
                          <p className="text-[9px] text-slate-500 truncate pl-5">
                            <span className="font-bold">{room.lastMessage.senderName}:</span> {room.lastMessage.content}
                          </p>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Direct Contacts (All Staff Users) */}
            <div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 block mb-3">
                Contactos Staff
              </span>
              
              <div className="space-y-1">
                {staffUsers.length === 0 ? (
                  <p className="text-[8px] font-bold text-slate-600 uppercase tracking-wider text-center py-2">
                    Sin otros miembros
                  </p>
                ) : (
                  staffUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartDM(user.id)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-900/40 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-[9px] font-black text-slate-400 group-hover:border-cyan-500/30 transition-all uppercase">
                          {user.name.slice(0, 2)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold truncate">{user.name}</p>
                          <span className="text-[7px] text-slate-500 block uppercase tracking-wider">
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] font-black text-cyan-400/0 group-hover:text-cyan-400 transition-all uppercase tracking-widest">
                        Escribir
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Active Room Chat Window */}
        <main className="flex-grow flex flex-col bg-slate-950/20">
          {/* Active room header details */}
          <header className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
            <div>
              <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">
                {activeRoom?.type === "GENERAL" ? "Canal Global Operativo" : activeRoom?.type === "GROUP" ? "Conversación de Grupo" : "Mensajería Directa"}
              </p>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                {activeRoom?.name || "Cargando..."}
              </h1>
            </div>
            
            {activeRoom?.members && activeRoom.members.length > 0 && (
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/40 border border-white/5 px-3 py-2 rounded-xl">
                Miembros: <span className="text-white">{activeRoom.members.map(m => m.name).join(", ")}</span>
              </div>
            )}
          </header>

          {/* Message scroll log container */}
          <div 
            ref={containerRef}
            className="flex-grow overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin relative"
          >
            {loadingMessages && messages.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col gap-4 text-cyan-500 font-bold uppercase tracking-widest text-[10px]">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                Sincronizando mensajes...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] py-20 text-center">
                <span>📭 Sin mensajes aquí</span>
                <span className="text-[8px] text-slate-600 tracking-wider">Envía el primer mensaje de la conversación.</span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isOwnMessage = msg.senderId === currentUser?.id;
                  const isSenderAdmin = msg.sender?.role === "ADMIN";
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
                        {/* Sender info */}
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${isSenderAdmin ? "text-cyan-400" : "text-purple-400"}`}>
                            {msg.sender?.name || "Desconocido"}
                          </span>
                          <span className="text-[7px] text-slate-600 font-black">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
 
                        {/* Message box bubble */}
                        <div className={`px-5 py-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                          isOwnMessage
                            ? isSenderAdmin
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-cyan-400/20"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(168,85,247,0.15)] border border-purple-400/20"
                            : "bg-slate-900 text-white rounded-tl-none border border-white/5 hover:border-white/10 transition-all"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Form write panel footer */}
          <footer className="p-6 bg-slate-950/70 border-t border-white/5 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje al canal del staff..."
                disabled={sending}
                className="flex-grow bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/40 text-xs font-semibold transition-all placeholder:text-slate-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className={`px-8 py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all ${
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
          </footer>
        </main>
      </div>

      {/* Modern custom group creation modal */}
      <AnimatePresence>
        {isGroupModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden relative shadow-2xl"
            >
              <div className="p-8 border-b border-white/5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Crear Grupo de Chat</h3>
                  <button 
                    onClick={() => setIsGroupModalOpen(false)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateGroup} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Ej. NOC Team"
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Seleccionar Miembros
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                    {staffUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-white/5 cursor-pointer hover:border-cyan-500/30 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-950"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <span className="text-[8px] text-slate-500 block uppercase tracking-wider">
                            {user.role}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsGroupModalOpen(false)}
                    className="flex-1 bg-slate-950 border border-white/5 text-white font-black py-4 rounded-2xl hover:bg-slate-900 transition-all uppercase text-[9px] tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creatingGroup || !groupName.trim() || selectedUserIds.length === 0}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl disabled:opacity-50 transition-all uppercase text-[9px] tracking-widest"
                  >
                    {creatingGroup ? "Creando..." : "Crear"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global CSS scrollbar styling override */}
      <style jsx global>{`
        body { background: #020617; }
        
        .scrollbar-thin {
          overflow-y: scroll !important;
          scrollbar-width: auto !important;
          scrollbar-color: #06b6d4 rgba(15, 23, 42, 0.8) !important;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 8px !important;
          display: block !important;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.8) !important;
          border-radius: 8px !important;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.4) !important;
          border-radius: 8px !important;
          border: 2px solid rgba(15, 23, 42, 0.8) !important;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.8) !important;
        }
      `}</style>
    </div>
  );
}
