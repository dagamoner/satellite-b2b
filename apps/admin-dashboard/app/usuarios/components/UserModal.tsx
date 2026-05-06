"use client";
import { useState } from "react";

interface UserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

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

      if (!res.ok) {
        throw new Error(data.error || "Error al crear usuario");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
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

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Rol en el Sistema</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-2xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "TECH" })}
                  className={`py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                    formData.role === "TECH" ? "bg-slate-800 text-white shadow-lg border border-white/5" : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  Técnico NOC
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "ADMIN" })}
                  className={`py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                    formData.role === "ADMIN" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20" : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  Administrador
                </button>
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
