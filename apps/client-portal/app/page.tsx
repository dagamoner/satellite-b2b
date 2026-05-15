"use client";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { loginSchema } from "@repo/validation";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";

export default function EntryPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin relative z-10" />
        <div className="text-cyan-500 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse relative z-10">Iniciando Sistemas B2B</div>
      </div>
    }>
      <EntryPortalContent />
    </Suspense>
  );
}

function EntryPortalContent() {
  const [dni, setDni] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTechMode, setIsTechMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { status } = useSession();

  const autoLogin = useCallback(async (dniVal: string, contractVal: string, ticketId?: string | null) => {
    setLoading(true);
    setError("");
    try {
      const normalizedDni = dniVal.replace(/\D/g, "");
      const normalizedContract = contractVal.trim().replace(/\s+/g, "-");
      
      await signIn("client-credentials", {
        dni: normalizedDni,
        contractNumber: normalizedContract,
        callbackUrl: ticketId ? `/soporte/${ticketId}` : "/soporte/dashboard",
      });
    } catch (err) {
      setError("Error de red durante el acceso automático.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      const pDni = searchParams.get("p_dni");
      const pContract = searchParams.get("p_contract");
      const pTicket = searchParams.get("p_ticket");

      if (pDni && pContract) {
        setDni(pDni);
        setContractNumber(pContract);
        autoLogin(pDni, pContract, pTicket);
      }
    }
  }, [status, searchParams, autoLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isTechMode) {
        const result = await signIn("technician-credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Credenciales de técnico inválidas");
        } else {
          router.push("/soporte/dashboard");
        }
      } else {
        const normalizedDni = dni.replace(/\D/g, "");
        const normalizedContract = contractNumber.trim().replace(/\s+/g, "-");
        
        loginSchema.parse({ dni: normalizedDni, contractNumber: normalizedContract });

        const result = await signIn("client-credentials", {
          dni: normalizedDni,
          contractNumber: normalizedContract,
          redirect: false,
        });

        if (result?.error) {
          if (result.error === "Configuration") {
            setError("Error de configuración del servidor (verificar AUTH_SECRET)");
          } else {
            setError("DNI o Nº de Contrato no válidos");
          }
        } else {
          router.push("/soporte/dashboard");
        }
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Error de validación");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Elementos Decorativos de Fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full -ml-80 -mb-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-12">
          <a 
            href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "/"} 
            className="group flex items-center gap-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all tracking-[0.4em]"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Volver al Inicio
          </a>
        </motion.div>

        <Card variant="glass" className="p-12 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="flex flex-col items-center mb-12 text-center">
            <motion.div 
              variants={itemVariants}
              className="relative mb-8 group"
            >
              <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="w-24 h-24 bg-slate-900 border border-white/10 rounded-[2.5rem] flex items-center justify-center relative shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                <svg className="w-10 h-10 text-cyan-500 relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl font-black text-white tracking-tighter mb-4 uppercase leading-none"
            >
              Portal <span className="text-cyan-500">B2B</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em]"
            >
              Centro de Operaciones Corporativas
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <AnimatePresence mode="wait">
              {!isTechMode ? (
                <motion.div 
                  key="client-mode"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Identificación DNI</label>
                    <input
                      type="text"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      placeholder="Identidad del Titular"
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all placeholder:text-slate-800 shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">ID de Contrato</label>
                    <input
                      type="text"
                      value={contractNumber}
                      onChange={(e) => setContractNumber(e.target.value)}
                      placeholder="TK-202X-XXXX"
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all placeholder:text-slate-800 uppercase shadow-inner"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="tech-mode"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Terminal Operador</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@dominio.com"
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all placeholder:text-slate-800 shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Clave de Acceso</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-8 py-5 text-white font-bold outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all placeholder:text-slate-800 shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black py-4 px-6 rounded-2xl overflow-hidden uppercase tracking-widest"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-white text-slate-950 font-black py-5 rounded-[1.8rem] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:shadow-none disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 group-hover:text-white transition-colors uppercase tracking-[0.3em] text-[11px]">
                {loading ? "Sincronizando..." : (isTechMode ? "Acceder a Consola" : "Ingresar a la Red")}
              </span>
            </motion.button>

            <motion.div variants={itemVariants} className="text-center">
               <button 
                  type="button"
                  onClick={() => setIsTechMode(!isTechMode)}
                  className="text-[9px] font-black text-slate-600 hover:text-cyan-400 uppercase tracking-[0.3em] transition-all py-2"
               >
                  {isTechMode ? "← Volver a Terminal Cliente" : "Terminal Operativo Especializado →"}
               </button>
            </motion.div>
          </form>

          <motion.div 
            variants={itemVariants}
            className="mt-12 pt-10 border-t border-white/5 flex flex-col items-center gap-6"
          >
             <p className="text-[9px] text-slate-700 uppercase font-black tracking-widest text-center leading-loose opacity-60">
               Acceso Protegido por Encriptación de Grado Militar. <br/>
               <span className="text-cyan-500/50 mt-3 inline-block bg-cyan-500/5 px-4 py-1.5 rounded-full border border-cyan-500/10">DNI: <span className="text-cyan-400">demo</span> · Contrato: <span className="text-cyan-400">demo</span></span>
             </p>
          </motion.div>
        </Card>

        <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center gap-6">
          <div className="flex gap-4">
             <div className="w-12 h-[1px] bg-slate-900 rounded-full" />
             <div className="w-3 h-[1px] bg-cyan-500/20 rounded-full" />
             <div className="w-12 h-[1px] bg-slate-900 rounded-full" />
          </div>
          <p className="text-center text-slate-700 text-[9px] uppercase tracking-[0.8em] font-black">
            Satellite NOC Portal v2026.05
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
