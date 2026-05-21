"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";

interface ClientAccount {
  id: string;
  companyName: string;
  planName: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "UNPAID" | "OVERDUE";
  paymentDate?: string;
  accountId: string;
  account: ClientAccount;
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation calculator state
  const [selectedPlan, setSelectedPlan] = useState("STARLINK_PRO");
  const [monthlyCost, setMonthlyCost] = useState(150000);
  const [installationExpress, setInstallationExpress] = useState(false);
  const [additionalAntenna, setAdditionalAntenna] = useState(false);
  const [wifi6Router, setWifi6Router] = useState(false);
  const [dedicatedSupport, setDedicatedSupport] = useState(false);

  // Link Calculator output to a client to generate an invoice
  const [selectedAccountIdForInvoice, setSelectedAccountIdForInvoice] = useState("");
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const fetchInvoicesAndAccounts = async () => {
    try {
      const [invRes, accRes] = await Promise.all([
        fetch("/api/crm/invoices"),
        fetch("/api/crm/accounts")
      ]);
      if (invRes.ok) {
        const data = await invRes.json();
        setInvoices(data.invoices || []);
      }
      if (accRes.ok) {
        const data = await accRes.json();
        const accountsList = data.accounts || [];
        setAccounts(accountsList);
        if (accountsList.length > 0) {
          setSelectedAccountIdForInvoice(accountsList[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchInvoicesAndAccounts();
    }
  }, [status]);

  // Adjust monthly base cost when plan changes
  useEffect(() => {
    if (selectedPlan === "STARLINK_PRO") {
      setMonthlyCost(150000);
    } else if (selectedPlan === "STARLINK_CORP") {
      setMonthlyCost(280000);
    } else if (selectedPlan === "STARLINK_NOC") {
      setMonthlyCost(450000);
    }
  }, [selectedPlan]);

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

  // Pricing calculator totals
  const getTotals = () => {
    let baseMonthly = monthlyCost;
    if (dedicatedSupport) baseMonthly += 35000;

    let oneOff = 0;
    if (installationExpress) oneOff += 45000;
    if (additionalAntenna) oneOff += 200000;
    if (wifi6Router) oneOff += 85000;

    return {
      monthlyTotal: baseMonthly,
      oneOffTotal: oneOff,
      grandTotal: baseMonthly + oneOff
    };
  };

  const { monthlyTotal, oneOffTotal, grandTotal } = getTotals();

  // Create real invoice from calculator
  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountIdForInvoice) {
      alert("Seleccione un cliente para facturar");
      return;
    }
    setIsGeneratingInvoice(true);
    try {
      const res = await fetch("/api/crm/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccountIdForInvoice,
          amount: grandTotal,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
        }),
      });

      if (res.ok) {
        alert("Factura comercial emitida exitosamente!");
        fetchInvoicesAndAccounts();
      } else {
        alert("Error al emitir factura");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  // Pay invoice simulation
  const handleSimulatePayment = async (invoiceId: string) => {
    try {
      const res = await fetch("/api/crm/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PAY_MANUAL",
          invoiceId,
          paymentMethod: "TRANSFER"
        }),
      });
      if (res.ok) {
        fetchInvoicesAndAccounts();
      } else {
        alert("Error al procesar el cobro informativo");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-bold uppercase tracking-widest">Sincronizando Módulos de Cobro...</div>;
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
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Facturación Comercial</h1>
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
                Acceder a Cobros
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
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
              className="w-8 h-8 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:border-cyan-500/50 transition-all active:scale-90 mr-2"
              title="Volver al Dashboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
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
              <Link href="/crm/accounts" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Clientes 360</Link>
              <Link href="/crm/invoices" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-white/5 rounded-lg border border-white/5 transition-colors">Cobros</Link>
            </div>
            <button onClick={() => signOut()} className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest border border-red-500/10 px-4 py-2 rounded-xl transition-all">Desconectar</button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1600px] mx-auto px-8 py-12 relative z-10 space-y-12">
        <header>
          <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Facturación & Calculador Comercial</p>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Emisión de Cobros & Presupuestos</h1>
        </header>

        {/* Pricing Calculator & Invoice Emision */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Plan builder */}
          <div className="lg:col-span-7">
            <Card variant="glass" className="p-8 border-white/5 space-y-8" hover={false}>
              <div>
                <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">Paso 1: Plan Base de Internet</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">Configuración del Plan de Conectividad</h3>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setSelectedPlan("STARLINK_PRO")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${selectedPlan === 'STARLINK_PRO' ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest">Starlink Pro</span>
                  <span className="text-lg font-black text-white mt-2">$150K<span className="text-[10px] text-slate-500 font-normal">/mes</span></span>
                </button>
                <button 
                  onClick={() => setSelectedPlan("STARLINK_CORP")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${selectedPlan === 'STARLINK_CORP' ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest">Corporate</span>
                  <span className="text-lg font-black text-white mt-2">$280K<span className="text-[10px] text-slate-500 font-normal">/mes</span></span>
                </button>
                <button 
                  onClick={() => setSelectedPlan("STARLINK_NOC")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${selectedPlan === 'STARLINK_NOC' ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest">NOC Dedicated</span>
                  <span className="text-lg font-black text-white mt-2">$450K<span className="text-[10px] text-slate-500 font-normal">/mes</span></span>
                </button>
              </div>

              <div>
                <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">Paso 2: Adicionales y Soporte Premium</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">Opciones y Hardware Extra</h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={additionalAntenna}
                      onChange={e => setAdditionalAntenna(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 rounded"
                    />
                    <div>
                      <p className="text-xs font-black text-white uppercase">Antena Adicional Terrestre</p>
                      <p className="text-[10px] text-slate-500 font-bold">Hardware premium de contingencia redundante</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-cyan-400">+$200.000</span>
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={wifi6Router}
                      onChange={e => setWifi6Router(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 rounded"
                    />
                    <div>
                      <p className="text-xs font-black text-white uppercase">Router WiFi 6 Corporativo</p>
                      <p className="text-[10px] text-slate-500 font-bold">Alta densidad de usuarios y largo alcance</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-cyan-400">+$85.000</span>
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={installationExpress}
                      onChange={e => setInstallationExpress(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 rounded"
                    />
                    <div>
                      <p className="text-xs font-black text-white uppercase">Instalación Express Certificada</p>
                      <p className="text-[10px] text-slate-500 font-bold">Despliegue de cuadrilla técnica dentro de 48 hs</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-cyan-400">+$45.000</span>
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-2xl cursor-pointer hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={dedicatedSupport}
                      onChange={e => setDedicatedSupport(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 rounded"
                    />
                    <div>
                      <p className="text-xs font-black text-white uppercase">Soporte 24/7 Crítico Dedicado</p>
                      <p className="text-[10px] text-slate-500 font-bold">Respuesta telefónica inmediata y repuestos onsite</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-cyan-400">+$35.000 / mes</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Right panel: Live Totalizer & Invoice emision form */}
          <div className="lg:col-span-5">
            <Card variant="glass" className="p-8 border-white/5 space-y-8 h-full flex flex-col justify-between" hover={false}>
              <div className="space-y-6">
                <div>
                  <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">Resumen de Cuenta de Simulación</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">Costos Totales en Tiempo Real</h3>
                </div>

                <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Abono Mensual Total:</span>
                    <span className="text-white">${monthlyTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Hardware y Despliegue (Un Pago):</span>
                    <span className="text-white">${oneOffTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Total Emisión:</span>
                    <span className="text-3xl font-black text-cyan-400">${grandTotal.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                <form onSubmit={handleGenerateInvoice} className="space-y-4 pt-6 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Vincular a Cuenta de Cliente</label>
                    <select
                      value={selectedAccountIdForInvoice}
                      onChange={e => setSelectedAccountIdForInvoice(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.companyName}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit"
                    disabled={isGeneratingInvoice}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all shadow-lg shadow-cyan-500/20"
                  >
                    {isGeneratingInvoice ? "Emitiendo Factura..." : "Emitir Factura Oficial"}
                  </button>
                </form>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-500/10 rounded-2xl text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider text-center">
                🛡️ La emisión de facturas actualiza automáticamente el balance de cuenta del cliente en el CRM.
              </div>
            </Card>
          </div>
        </section>

        {/* Live List of Invoices issued */}
        <section className="space-y-6">
          <div>
            <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">Registro Contable</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">Facturas Emitidas & Estado de Pago</h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-cyan-500 font-bold uppercase tracking-widest">Cargando Facturas...</div>
          ) : (
            <div className="bg-slate-950/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-400">
                  <thead className="border-b border-white/5 bg-slate-950 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-5">Factura ID</th>
                      <th className="px-6 py-5">Razón Social / Cliente</th>
                      <th className="px-6 py-5">Monto Emitido</th>
                      <th className="px-6 py-5">Vencimiento</th>
                      <th className="px-6 py-5">Estado</th>
                      <th className="px-6 py-5 text-right">Acción Comercial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 font-mono font-black text-white">{inv.invoiceNumber}</td>
                        <td className="px-6 py-5 font-bold text-white uppercase">{inv.account.companyName}</td>
                        <td className="px-6 py-5 font-black text-cyan-400">${inv.amount.toLocaleString('es-AR')}</td>
                        <td className="px-6 py-5 font-bold">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black border tracking-widest uppercase ${inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : inv.status === 'OVERDUE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {inv.status !== "PAID" && (
                            <button
                              onClick={() => handleSimulatePayment(inv.id)}
                              className="bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 font-black px-4 py-2 rounded-xl text-[9px] tracking-widest uppercase transition-all"
                            >
                              ✓ Procesar Cobro
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.3); }
      `}</style>
    </div>
  );
}
