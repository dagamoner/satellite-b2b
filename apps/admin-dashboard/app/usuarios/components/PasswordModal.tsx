"use client";
import { useState, useMemo } from "react";

interface PasswordModalProps {
  user: { id: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}

// Reglas de validación de contraseña
const PASSWORD_RULES = [
  { id: "length",   label: "Mínimo 8 caracteres",     test: (p: string) => p.length >= 8 },
  { id: "upper",    label: "Al menos 2 mayúsculas",    test: (p: string) => (p.match(/[A-Z]/g) || []).length >= 2 },
  { id: "number",   label: "Al menos 2 números",       test: (p: string) => (p.match(/[0-9]/g) || []).length >= 2 },
  { id: "special",  label: "Al menos 1 carácter especial (!@#$%^&*)", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function PasswordModal({ user, onClose, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validations = useMemo(() => PASSWORD_RULES.map(r => ({ ...r, valid: r.test(password) })), [password]);
  const allValid = validations.every(v => v.valid);
  const strength = validations.filter(v => v.valid).length;

  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"][strength - 1] || "bg-slate-800";
  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][strength] || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar contraseña");

      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
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
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoFocus
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800 pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>

                {/* Barra de fuerza */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-slate-800"}`}
                        />
                      ))}
                      <span className={`text-[9px] font-black uppercase ml-2 ${strength === 4 ? "text-emerald-400" : "text-slate-500"}`}>{strengthLabel}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist de requisitos */}
              <div className="bg-slate-950/60 rounded-2xl p-4 space-y-2 border border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Requisitos de seguridad</p>
                {validations.map(v => (
                  <div key={v.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${v.valid ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-slate-800 border border-white/5"}`}>
                      {v.valid && (
                        <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${v.valid ? "text-emerald-400" : "text-slate-600"}`}>{v.label}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">{error}</div>
              )}

              <button
                disabled={loading || !allValid}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-cyan-500/20 active:scale-95 uppercase tracking-[0.2em] text-xs mt-4"
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
