"use client";
import { useState } from "react";

interface PasswordModalProps {
  user: { id: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordModal({ user, onClose, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar contraseña");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
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
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Gestionar Clave</h2>
              <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1">Usuario: {user.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2 px-1">Nueva Contraseña</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
                />
                <p className="text-[8px] text-slate-600 mt-2 px-1 uppercase tracking-wider">El usuario deberá usar esta nueva clave en su próximo inicio de sesión.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-cyan-500/20 active:scale-95 uppercase tracking-[0.2em] text-xs mt-4"
              >
                {loading ? "Actualizando..." : "Confirmar Nueva Clave"}
              </button>
            </form>
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">¡Clave Actualizada!</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">La base de datos se ha actualizado correctamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
