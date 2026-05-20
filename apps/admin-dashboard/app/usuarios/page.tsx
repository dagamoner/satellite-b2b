"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserModal from "./components/UserModal";
import PasswordModal from "./components/PasswordModal";
import EmailModal from "./components/EmailModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  createdAt: string;
}

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session && (session.user as any).role !== "ADMIN") {
      router.push("/");
    } else if (session) {
      fetchUsers();
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (user: User) => { setSelectedUser(user); setIsPasswordModalOpen(true); };
  const handleEditEmail = (user: User) => { setSelectedUser(user); setIsEmailModalOpen(true); };

  const handleToggleStatus = async (user: User) => {
    setActionLoading(user.id + "_status");
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      if (res.ok) fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user: User) => {
    setActionLoading(user.id + "_delete");
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (res.ok) { setDeleteConfirm(null); fetchUsers(); }
    } finally {
      setActionLoading(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">MR</div>
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-tighter uppercase leading-none">NOC Center</span>
                <span className="text-cyan-500 text-[8px] font-black tracking-[0.2em] mt-1 uppercase">Operations Command</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-10">
              <a href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://satellite-b2b.vercel.app/"} className="text-[10px] font-black text-slate-500 hover:text-cyan-500 uppercase tracking-[0.2em] transition-colors border-r border-white/10 pr-6">Web Principal</a>
              <Link href="/tickets" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Tickets</Link>
              <Link href="/contratos" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Contratos</Link>
              <Link href="/reportes" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Inteligencia</Link>
              <Link href="/usuarios" className="text-[10px] font-black text-white uppercase tracking-[0.2em] transition-colors border-b-2 border-cyan-500 pb-1">Equipo</Link>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="group px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Nuevo Operador</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-10 py-16 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              Gestión de <span className="text-cyan-500">Equipo</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Administración de Equipo y Soporte Técnico · {users.length} operadores
            </p>
          </div>
        </header>

        <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operador</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Email</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rol</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registro</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => {
                  const isActive = user.active !== false;
                  return (
                    <tr key={user.id} className={`group transition-colors ${isActive ? "hover:bg-white/[0.02]" : "opacity-50 hover:opacity-70 bg-slate-950/30"}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                            user.role === "ADMIN" ? "bg-cyan-500/10 text-cyan-500" :
                            user.role === "TECH"  ? "bg-amber-500/10 text-amber-500" :
                            "bg-emerald-500/10 text-emerald-500"
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-white uppercase tracking-tight">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 group/mail">
                          <span className="text-xs font-medium text-slate-400">{user.email}</span>
                          <button onClick={() => navigator.clipboard.writeText(user.email)} className="opacity-0 group-hover/mail:opacity-100 p-1.5 hover:bg-white/5 rounded-lg text-slate-600 hover:text-cyan-400 transition-all" title="Copiar Email">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          user.role === "ADMIN" ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20" :
                          user.role === "TECH"  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-slate-500 italic">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-slate-600"}`} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-slate-500" : "text-slate-700"}`}>{isActive ? "Activo" : "Stand By"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Editar Email */}
                          <button
                            onClick={() => handleEditEmail(user)}
                            title="Editar Email"
                            className="p-2.5 bg-slate-900 hover:bg-blue-600/20 text-slate-500 hover:text-blue-400 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </button>
                          {/* Cambiar Clave */}
                          <button
                            onClick={() => handleResetPassword(user)}
                            title="Nueva Clave"
                            className="p-2.5 bg-slate-900 hover:bg-cyan-600/20 text-slate-500 hover:text-cyan-400 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                          </button>
                          {/* Stand By / Activar */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={actionLoading === user.id + "_status"}
                            title={isActive ? "Poner en Stand By" : "Activar"}
                            className={`p-2.5 bg-slate-900 rounded-xl border border-white/5 transition-all active:scale-95 ${
                              isActive
                                ? "hover:bg-amber-500/20 text-slate-500 hover:text-amber-400 hover:border-amber-500/30"
                                : "hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30"
                            }`}
                          >
                            {isActive
                              ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            }
                          </button>
                          {/* Eliminar */}
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            title="Eliminar Operador"
                            className="p-2.5 bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-xl border border-white/5 hover:border-red-500/30 transition-all active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />}
      {isPasswordModalOpen && selectedUser && <PasswordModal user={selectedUser} onClose={() => setIsPasswordModalOpen(false)} onSuccess={fetchUsers} />}
      {isEmailModalOpen && selectedUser && <EmailModal user={selectedUser} onClose={() => setIsEmailModalOpen(false)} onSuccess={fetchUsers} />}

      {/* Modal confirmación de eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-[#0f172a] border border-red-500/20 rounded-[2rem] w-full max-w-sm p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-white font-black text-lg uppercase tracking-tight text-center mb-2">¿Eliminar Operador?</h3>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider text-center mb-2">
              Esta acción es <span className="text-red-400 font-black">irreversible</span>.
            </p>
            <p className="text-slate-400 text-xs font-bold text-center mb-8">{deleteConfirm.name}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 text-[10px] font-black uppercase hover:bg-white/5 transition-all">Cancelar</button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm.id + "_delete"}
                className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black uppercase hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                {actionLoading === deleteConfirm.id + "_delete" ? "Eliminando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
