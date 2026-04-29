"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SoporteLoginPage() {
  const [dni, setDni] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Si ya hay sesión, redirigir
  useEffect(() => {
    const session = localStorage.getItem("mr_support_session");
    if (session) {
      router.push("/soporte/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/support/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, contractNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error de validación");
      }

      // Guardar sesión rápida
      localStorage.setItem("mr_support_session", JSON.stringify(data.user));
      router.push("/soporte/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Centro de Soporte</h1>
          <p className="text-slate-400 text-center mt-2 text-sm">Validación de identidad para acceso técnico</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              DNI o CUIT del Titular
            </label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej: 35123456"
              className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Número de Contrato
            </label>
            <input
              type="text"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="Ej: MR-2026-0001"
              className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? "Verificando..." : "Acceder al Soporte"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-500 text-xs">
            ¿No conoce su número de contrato? Revise su email de bienvenida o el adhesivo en su router MR Technology.
          </p>
        </div>
      </div>
    </div>
  );
}
