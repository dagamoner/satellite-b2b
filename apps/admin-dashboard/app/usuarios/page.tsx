"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserModal from "./components/UserModal";
import PasswordModal from "./components/PasswordModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session && (session.user as any).role !== "ADMIN") {
      router.push("/dashboard"); // O a una página de acceso denegado
    } else if (session) {
      fetchUsers();
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
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
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* Unified Navbar */}
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
              <Link href="/tickets" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Tickets</Link>
              <Link href="/contratos" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Contratos</Link>
              <Link href="/reportes" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Inteligencia</Link>
              <Link href="/usuarios" className="text-[10px] font-black text-white uppercase tracking-[0.2em] transition-colors border-b-2 border-cyan-500 pb-1">Equipo</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Nuevo Operador</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-10 py-16 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              Gestión de <span className="text-cyan-500">Equipo</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Administración de Equipo y Soporte Técnico
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
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                          user.role === 'ADMIN' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-medium text-slate-400">{user.email}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.role === 'ADMIN' 
                          ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' 
                          : 'bg-slate-800 text-slate-400 border border-white/5'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-medium text-slate-500 italic">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Activo</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-3 bg-slate-800 hover:bg-cyan-600/20 text-slate-400 hover:text-cyan-400 rounded-xl border border-white/5 transition-all active:scale-90 group/btn"
                        title="Gestionar Clave"
                      >
                        <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UserModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchUsers} 
        />
      )}

      {isPasswordModalOpen && selectedUser && (
        <PasswordModal
          user={selectedUser}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
