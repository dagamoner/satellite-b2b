"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { loginSchema } from "@repo/validation";
import { z } from "zod";


export default function EntryPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-black animate-pulse">CARGANDO PORTAL...</div>}>
      <EntryPortalContent />
    </Suspense>
  );
}

function EntryPortalContent() {
  const [dni, setDni] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { status } = useSession();

  // Lógica de sesión existente y Auto-login desde Marketing
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/soporte/dashboard");
      return;
    }

    // Capture params for auto-login
    const pDni = searchParams.get("p_dni");
    const pContract = searchParams.get("p_contract");
    const pTicket = searchParams.get("p_ticket");

    if (pDni && pContract) {
      setDni(pDni);
      setContractNumber(pContract);
      // Auto-trigger login
      autoLogin(pDni, pContract, pTicket);
    }
  }, [searchParams, router]);

  const autoLogin = async (dniVal: string, contractVal: string, ticketId?: string | null) => {
    setLoading(true);
    try {
      const result = await signIn("client-credentials", {
        dni: dniVal,
        contractNumber: contractVal,
        redirect: false,
      });

      if (!result?.error) {
        if (ticketId) {
          router.push(`/soporte/${ticketId}`);
        } else {
          router.push("/soporte/dashboard");
        }
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validar con Zod
      loginSchema.parse({ dni, contractNumber });

      const result = await signIn("client-credentials", {
        dni,
        contractNumber,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Credenciales inválidas o contrato inexistente");
      }

      router.push("/soporte/dashboard");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message);
      }
    } finally {

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* Fondo Animado de Gradiente Cinético */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <a 
          href="http://localhost:3001" 
          className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-cyan-400 transition-colors tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Inicio
        </a>

        {/* Card con Glassmorphism */}
        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          {/* Brillo Superior */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse" />
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center relative shadow-inner">
                <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-2">
              Mi Portal B2B
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Centro de Operaciones y Soporte Satelital
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Identificación de Cliente
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="DNI o CUIT"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Número de Contrato
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  placeholder="MR-202X-XXXX"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-slate-700 font-mono"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-4 px-5 rounded-2xl animate-shake">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-white text-slate-950 font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 group-hover:text-white transition-colors">
                {loading ? "VALIDANDO..." : "ACCEDER A LA RED"}
              </span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <p className="text-[10px] text-slate-600 uppercase tracking-tight text-center leading-relaxed">
               Acceso exclusivo para clientes corporativos de MR Technology. <br/>
               Si no recuerda sus credenciales, contacte al NOC.<br/>
               <span className="text-cyan-500/70 font-bold mt-2 inline-block">Para probar use DNI: demo / Contrato: demo</span>
             </p>
             <div className="flex gap-4 opacity-50">
                <div className="w-8 h-[2px] bg-slate-800 rounded-full" />
                <div className="w-2 h-[2px] bg-slate-800 rounded-full" />
                <div className="w-8 h-[2px] bg-slate-800 rounded-full" />
             </div>
          </div>
        </div>

        {/* Footer simple */}
        <p className="text-center mt-8 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium font-mono">
          MR TECHNOLOGY SATELLITE B2B PORTAL v2026.04
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </main>
  );
}
