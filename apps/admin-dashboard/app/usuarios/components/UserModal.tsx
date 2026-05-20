"use client";
import { useState } from "react";

interface UserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Definición centralizada de roles
export const ROLES = [
  { value: "ADMIN",          label: "Administrador",    color: "bg-cyan-600 text-white shadow-cyan-500/20",      dot: "bg-cyan-400" },
  { value: "CEO",            label: "CEO",              color: "bg-violet-600 text-white shadow-violet-500/20",   dot: "bg-violet-400" },
  { value: "TECH",           label: "Especialista Téc.", color: "bg-amber-600/80 text-white shadow-amber-500/20", dot: "bg-amber-400" },
  { value: "SALES",          label: "Ventas",           color: "bg-emerald-600 text-white shadow-emerald-500/20", dot: "bg-emerald-400" },
  { value: "MARKETING",      label: "Marketing",        color: "bg-pink-600 text-white shadow-pink-500/20",      dot: "bg-pink-400" },
  { value: "AGENT",          label: "Agente Oficial",   color: "bg-orange-600 text-white shadow-orange-500/20",  dot: "bg-orange-400" },
];

export default function UserModal({ onClose, onSuccess }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TECH",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === formData.role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Nuevo Operador</h2>
              <p className="text-xs text-cyan-500 font-bold uppercase tracking-widest mt-1">Registrar Miembro del Equipo</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Nombre Completo</label>
              <input
                required
                type="text"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Correo Electrónico</label>
              <input
                required
                type="email"
                placeholder="juan@mrtechnology.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Contraseña Inicial</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
              />
            </div>

            {/* Selector de Rol */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3 px-1">
                Rol en el Sistema
                {selectedRole && (
                  <span className="ml-3 normal-case font-bold text-slate-300">— {selectedRole.label}</span>
                )}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`py-3 px-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                      formData.role === role.value
                        ? `${role.color} shadow-lg`
                        : "bg-slate-900 text-slate-600 hover:text-slate-300 border border-white/5"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${formData.role === role.value ? "bg-white" : role.dot}`} />
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-cyan-500/20 active:scale-95 uppercase tracking-[0.2em] text-xs mt-4"
            >
              {loading ? "Procesando..." : "Dar de Alta Usuario"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
