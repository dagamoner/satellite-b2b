"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";

interface ClientAccount {
  id: string;
  accountNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  status: "ACTIVE" | "SUSPENDED" | "PROVISIONING";
  planName: string;
  monthlyFee: number;
  activationDate: string;
}

export default function AccountsPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<ClientAccount | null>(null);

  // Add account modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("Mendoza");
  const [newPlanName, setNewPlanName] = useState("STARLINK_PRO");
  const [newMonthlyFee, setNewMonthlyFee] = useState("150000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live telemetry mock state
  const [telemetryAccount, setTelemetryAccount] = useState<ClientAccount | null>(null);
  const [telemetryMetrics, setTelemetryMetrics] = useState<{ lat: number; lng: number; latency: number; loss: number; download: number; upload: number } | null>(null);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/crm/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAccounts();
    }
  }, [status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setAuthError("Credenciales inválidas o acceso denegado");
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/crm/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: newCompanyName,
          contactName: newContactName,
          taxId: `DNI-${Date.now()}`, // placeholder si no se pide DNI
          email: newEmail,
          phone: newPhone,
          city: newCity,
          province: "Mendoza",
          address: newCity,
          planName: newPlanName,
          monthlyFee: parseFloat(newMonthlyFee),
          activationDate: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setNewCompanyName("");
        setNewContactName("");
        setNewEmail("");
        setNewPhone("");
        fetchAccounts();
      } else {
        const errData = await res.json();
        alert(errData.error || "Error al registrar cliente");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAccountStatus = async (account: ClientAccount) => {
    const nextStatus = account.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch("/api/crm/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: account.id, status: nextStatus }),
      });
      if (res.ok) {
        fetchAccounts();
        if (selectedAccount && selectedAccount.id === account.id) {
          setSelectedAccount(prev => prev ? { ...prev, status: nextStatus } : null);
        }
      } else {
        alert("Error al actualizar el estado del cliente");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runTelemetrySim = (acc: ClientAccount) => {
    setTelemetryAccount(acc);
    setIsTelemetryLoading(true);
    setTelemetryMetrics(null);

    setTimeout(() => {
      setTelemetryMetrics({
        lat: -32.889,
        lng: -68.845,
        latency: Math.floor(Math.random() * 12) + 32,
        loss: parseFloat((Math.random() * 0.2).toFixed(2)),
        download: Math.floor(Math.random() * 80) + 180,
        upload: Math.floor(Math.random() * 20) + 35
      });
      setIsTelemetryLoading(false);
    }, 1800);
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-bold uppercase tracking-widest">Sincronizando Directorio de Clientes...</div>;
  }

  const hasAccess = ["ADMIN", "SALES"].includes((session?.user as any)?.role);

  if (!session) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-cyan-500/30 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <Card variant="glass" className="p-10" hover={false}>
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl text-2xl mb-6">
                MR
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Clientes 360°</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Acceso Administrativo CRM</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mrtech.com"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-bold"
                  required
                />
              </div>

              {authError && (
                <div className="text-red-400 text-[10px] text-center font-black bg-red-500/10 py-3 rounded-xl border border-red-500/20 uppercase tracking-widest">
                  {authError}
                </div>
              )}

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg tracking-widest uppercase text-xs">
                Acceder al Directorio
              </button>
            </form>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <Card variant="glass" className="p-10 text-center max-w-md">
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Acceso Restringido</h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest leading-relaxed mb-6">
            Este directorio corporativo está reservado únicamente para gerencia de operaciones y ventas comerciales.
          </p>
          <Link href="/">
            <button className="bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-white font-black px-8 py-3 rounded-xl uppercase text-[10px] tracking-widest transition-all">
              Volver al NOC
            </button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black">
              MR
            </Link>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tighter">CRM Satelital Nativo</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Comercial & Marketing</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
              <Link href="/" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Volver al NOC</Link>
              <Link href="/crm/leads" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Leads Kanban</Link>
              <Link href="/crm/accounts" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-white/5 rounded-lg border border-white/5 transition-colors">Clientes 360</Link>
              <Link href="/crm/invoices" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cobros</Link>
            </div>
            <button onClick={() => signOut()} className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest border border-red-500/10 px-4 py-2 rounded-xl transition-all">Desconectar</button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1600px] mx-auto px-8 py-12 relative z-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Directorio Central</p>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Clientes 360°</h1>
          </div>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-cyan-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/20 uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>+</span> Registrar Nuevo Cliente
          </button>
        </header>

        {/* Telemetry Mock Overlay Section */}
        {telemetryAccount && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 bg-cyan-950/20 border border-cyan-500/20 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-cyan-400 text-[8px] font-black uppercase tracking-[0.5em]">Consola de Telemetría Satelital Activa</span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">{telemetryAccount.companyName}</h3>
                <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest mt-1 block">Nodo: {telemetryAccount.city} · {telemetryAccount.planName}</span>
              </div>
              <button 
                onClick={() => setTelemetryAccount(null)}
                className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest"
              >
                ✕ Cerrar Monitor
              </button>
            </div>

            {isTelemetryLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent animate-spin rounded-full" />
                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Estableciendo Enlace de Banda Ka con Satélite...</span>
              </div>
            ) : telemetryMetrics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Latencia del Enlace</p>
                  <p className="text-2xl font-black text-white">{telemetryMetrics.latency}ms</p>
                  <span className="text-[8px] text-emerald-500 font-bold block mt-1">Estable (Jitter 1.2ms)</span>
                </div>
                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Pérdida de Paquetes</p>
                  <p className="text-2xl font-black text-emerald-400">{telemetryMetrics.loss}%</p>
                  <span className="text-[8px] text-emerald-500 font-bold block mt-1">Óptimo (Enlace de Alta Calidad)</span>
                </div>
                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocidad Downlink</p>
                  <p className="text-2xl font-black text-cyan-400">{telemetryMetrics.download} Mbps</p>
                  <span className="text-[8px] text-slate-500 font-bold block mt-1">Canal Lleno (SNR 92%)</span>
                </div>
                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocidad Uplink</p>
                  <p className="text-2xl font-black text-white">{telemetryMetrics.upload} Mbps</p>
                  <span className="text-[8px] text-slate-500 font-bold block mt-1">Modulación 16-QAM</span>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Client directory list */}
        {loading ? (
          <div className="py-24 text-center text-cyan-500 font-bold uppercase tracking-widest">Cargando Directorio...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accounts.map(acc => (
              <Card 
                key={acc.id} 
                variant="glass" 
                className={`p-8 border-white/5 flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300`}
                hover={true}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono font-black text-cyan-500/60 tracking-widest uppercase">{acc.accountNumber}</span>
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full border tracking-widest uppercase ${acc.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {acc.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-white font-black text-lg uppercase tracking-tight line-clamp-1">{acc.companyName}</h3>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{acc.contactName}</p>
                  </div>

                  {/* Plan interest & Price */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 text-[9px] font-bold text-slate-500">
                    <div>
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest block mb-0.5">Plan Contratado</span>
                      <span className="text-white uppercase tracking-widest">{(acc.planName || "").replace("_", " ")}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest block mb-0.5">Abono Mensual</span>
                      <span className="text-cyan-400 font-black">${(acc.monthlyFee || 0).toLocaleString('es-AR')}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest block mb-0.5">Ubicación</span>
                      <span className="text-white">{acc.city}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest block mb-0.5">Alta</span>
                      <span className="text-white">{new Date(acc.activationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={() => runTelemetrySim(acc)}
                    className="flex-1 bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-white font-black py-3 rounded-xl text-[9px] tracking-widest uppercase transition-all"
                  >
                    🛰️ Telemetría
                  </button>
                  <button 
                    onClick={() => toggleAccountStatus(acc)}
                    className={`px-4 py-3 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all border ${acc.status === 'ACTIVE' ? 'bg-red-950/20 text-red-400 border-red-500/20 hover:bg-red-900/30' : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-900/30'}`}
                  >
                    {acc.status === 'ACTIVE' ? "Suspender" : "Activar"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Register Client */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <span className="text-cyan-500 text-[9px] font-black uppercase tracking-widest">Alta de Cliente Noc</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">Registrar Nuevo Cliente Físico</h2>
                </div>
                <button 
                  onClick={() => setIsAddOpen(false)} 
                  className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center transition-all border border-white/5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Razón Social / Empresa</label>
                    <input 
                      type="text" 
                      value={newCompanyName}
                      onChange={e => setNewCompanyName(e.target.value)}
                      placeholder="Empresa Agrícola Mendoza S.A."
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Representante Autorizado</label>
                    <input 
                      type="text" 
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      placeholder="Esteban Lamothe"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Ciudad</label>
                    <input 
                      type="text" 
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      placeholder="San Rafael, Mendoza"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Principal</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="contacto@agricolamendoza.com"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Teléfono Directo</label>
                    <input 
                      type="text" 
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="+54 9 261 444-5566"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Latitud Terminal</label>
                    <input 
                      type="text" 
                      value={newLat}
                      onChange={e => setNewLat(e.target.value)}
                      placeholder="-34.615"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white font-mono outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Longitud Terminal</label>
                    <input 
                      type="text" 
                      value={newLng}
                      onChange={e => setNewLng(e.target.value)}
                      placeholder="-68.324"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white font-mono outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Abono Mensual Pactado (ARS)</label>
                    <input 
                      type="number" 
                      value={newMonthlyFee}
                      onChange={e => setNewMonthlyFee(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Plan Satelital Contratado</label>
                    <select
                      value={newPlanName}
                      onChange={e => setNewPlanName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                    >
                      <option value="STARLINK_PRO">Starlink Pro (Pymes)</option>
                      <option value="STARLINK_CORP">Starlink Corporate (Industrial)</option>
                      <option value="STARLINK_NOC">Starlink NOC Dedicated (Crítico)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all shadow-lg shadow-cyan-500/20"
                  >
                    {isSubmitting ? "Registrando Cliente..." : "Crear Cuenta"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.3); }
      `}</style>
    </div>
  );
}
