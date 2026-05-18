"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@repo/ui/card";

interface Activity {
  id: string;
  type: string;
  notes?: string;
  description?: string;
  createdAt: string;
  user?: {
    name: string;
  };
  createdBy?: {
    name: string;
  };
}

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  coordinates: string;
  status: "NEW" | "CONTACTED" | "FEASIBILITY" | "WON" | "LOST";
  estimatedValue: number;
  planInterest: string;
  notes: string;
  createdAt: string;
  activities: Activity[];
}

const leadStatuses = [
  { key: "NEW", label: "Nuevo", color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30" },
  { key: "CONTACTED", label: "Contactado", color: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30" },
  { key: "FEASIBILITY", label: "Factibilidad", color: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30" },
  { key: "WON", label: "Ganado", color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30" },
  { key: "LOST", label: "Perdido", color: "from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30" },
];

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("Mendoza");
  const [newLat, setNewLat] = useState("-32.889");
  const [newLng, setNewLng] = useState("-68.845");
  const [newEstimatedValue, setNewEstimatedValue] = useState("150000");
  const [newPlanInterest, setNewPlanInterest] = useState("STARLINK_PRO");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feasibility simulation state
  const [feasibilityChecking, setFeasibilityChecking] = useState(false);
  const [feasibilityResult, setFeasibilityResult] = useState<{ viable: boolean; signal: number; beam: string } | null>(null);

  // Log activity state
  const [newActivityType, setNewActivityType] = useState("CALL");
  const [newActivityNotes, setNewActivityNotes] = useState("");
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/crm/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchLeads();
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

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const coordinates = `${newLat},${newLng}`;
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: newCompanyName,
          contactName: newContactName,
          email: newEmail,
          phone: newPhone,
          city: newCity,
          coordinates,
          estimatedValue: parseFloat(newEstimatedValue),
          planInterest: newPlanInterest,
          notes: newNotes,
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        // Reset form
        setNewCompanyName("");
        setNewContactName("");
        setNewEmail("");
        setNewPhone("");
        setNewNotes("");
        fetchLeads();
      } else {
        alert("Error al registrar lead");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        fetchLeads();
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: updated.lead.status } : null);
        }
      } else {
        alert("Error al actualizar estado del lead");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runFeasibilityCheck = () => {
    if (!selectedLead) return;
    setFeasibilityChecking(true);
    setFeasibilityResult(null);

    // Simulate satellite link diagnostics on Mendoza beam
    setTimeout(() => {
      const [lat, lng] = selectedLead.coordinates.split(",").map(Number);
      const isViable = lat && lng && lat < -30 && lat > -36 && lng < -65 && lng > -72;
      setFeasibilityResult({
        viable: isViable || true,
        signal: Math.floor(Math.random() * 15) + 85, // 85% to 99% SNR
        beam: `STARLINK-MENDOZA-${Math.floor(Math.random() * 800) + 100}`
      });
      setFeasibilityChecking(false);
    }, 2500);
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newActivityNotes.trim()) return;
    setIsLoggingActivity(true);
    try {
      const res = await fetch("/api/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          type: newActivityType,
          title: newActivityType === "CALL" ? "Llamada registrada" : newActivityType === "EMAIL" ? "Correo registrado" : newActivityType === "MEETING" ? "Reunión registrada" : "Nota comercial",
          description: newActivityNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newActObj = data.activity;
        setSelectedLead(prev => prev ? {
          ...prev,
          activities: [newActObj, ...(prev.activities || [])]
        } : null);
        setNewActivityNotes("");
        fetchLeads();
      } else {
        alert("Error al registrar actividad");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingActivity(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-bold uppercase tracking-widest">Autenticando Acceso CRM...</div>;
  }

  // NextAuth Role Check
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
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">CRM Comercial</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">MR Technology Satelital</p>
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
                Ingresar al CRM
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
            Este módulo CRM está reservado exclusivamente para la administración comercial y marketing corporativo.
          </p>
          <Link href="/">
            <button className="bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-white font-black px-8 py-3 rounded-xl uppercase text-[10px] tracking-widest transition-all">
              Volver al NOC Dashboard
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
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-600/5 blur-[120px] rounded-full" />
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
              <Link href="/crm/leads" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-white/5 rounded-lg border border-white/5 transition-colors">Leads Kanban</Link>
              <Link href="/crm/accounts" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Clientes 360</Link>
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
            <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Pipeline de Ventas</p>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Leads Kanban</h1>
          </div>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="bg-cyan-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/20 uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>+</span> Registrar Nuevo Lead
          </button>
        </header>

        {/* Board Columns */}
        {loadingLeads ? (
          <div className="py-24 text-center text-cyan-500 font-bold uppercase tracking-widest">Sincronizando Leads...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {leadStatuses.map(col => {
              const colLeads = leads.filter(l => l.status === col.key);
              const colValue = colLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

              return (
                <div key={col.key} className="flex flex-col min-h-[600px] bg-slate-950/20 p-4 rounded-3xl border border-white/5 relative">
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${col.key === 'WON' ? 'from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : col.key === 'LOST' ? 'from-rose-500 to-red-600' : 'from-slate-400 to-slate-500'}`} />
                        {col.label}
                      </h3>
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mt-0.5">${colValue.toLocaleString('es-AR')} ARS</span>
                    </div>
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-[8px] font-black text-slate-400">{colLeads.length}</span>
                  </div>

                  {/* Cards list */}
                  <div className="flex-1 flex flex-col gap-4">
                    {colLeads.map(lead => (
                      <motion.div
                        key={lead.id}
                        layoutId={`lead-${lead.id}`}
                        onClick={() => {
                          setSelectedLead(lead);
                          setFeasibilityResult(null);
                        }}
                        className="group p-5 bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{lead.city}</span>
                          <span className="text-[9px] font-black text-cyan-500">${(lead.estimatedValue || 0).toLocaleString('es-AR')}</span>
                        </div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tight group-hover:text-cyan-400 transition-colors leading-snug line-clamp-1">{lead.companyName}</h4>
                        <p className="text-[10px] text-slate-500 font-bold leading-normal truncate">{lead.contactName}</p>
                        
                        {/* Plan Badge */}
                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[70%]">{(lead.planInterest || "").replace("_", " ")}</span>
                          <svg className="w-3.5 h-3.5 text-slate-700 group-hover:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                    {colLeads.length === 0 && (
                      <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-2xl p-6 text-center text-[9px] font-black text-slate-700 uppercase tracking-widest">
                        Sin prospectos
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Drawer: Lead Details */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar drawer content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-xl bg-slate-950 border-l border-white/5 relative z-10 flex flex-col h-full shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/30">
                <div>
                  <span className="text-cyan-500 text-[9px] font-black uppercase tracking-widest">Detalle del Lead</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">{selectedLead.companyName}</h2>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)} 
                  className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center transition-all border border-white/5"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Status Switcher */}
                <div className="p-6 bg-slate-900/30 border border-white/5 rounded-3xl space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Comercial</h4>
                  <div className="flex flex-wrap gap-2">
                    {leadStatuses.map(statusObj => {
                      const isActive = selectedLead.status === statusObj.key;
                      return (
                        <button
                          key={statusObj.key}
                          onClick={() => updateLeadStatus(selectedLead.id, statusObj.key)}
                          className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${isActive ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg' : 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/10'}`}
                        >
                          {statusObj.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Automation trigger WON */}
                {selectedLead.status === "FEASIBILITY" && (
                  <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-3xl space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Comprobación de Factibilidad NOC</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Verifique la cobertura y simulación de haz satelital en las coordenadas de instalación para este prospecto.</p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={runFeasibilityCheck}
                        disabled={feasibilityChecking}
                        className="bg-cyan-500 text-slate-950 font-black px-6 py-3 rounded-2xl text-[9px] tracking-widest uppercase hover:bg-cyan-400 transition-all disabled:opacity-50"
                      >
                        {feasibilityChecking ? "Calculando Enlace..." : "Comprobar Cobertura Satelital"}
                      </button>
                    </div>

                    {/* Radar Check Simulation */}
                    {feasibilityChecking && (
                      <div className="py-6 flex flex-col items-center justify-center bg-slate-950/50 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 animate-ping absolute" />
                        <div className="w-10 h-10 rounded-full border border-cyan-500/40 animate-pulse bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-[8px]">NOC</div>
                        <span className="text-[8px] font-black text-cyan-500/50 uppercase tracking-[0.3em] mt-4">Analizando Coordenadas: {selectedLead.coordinates}</span>
                      </div>
                    )}

                    {feasibilityResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase text-slate-400">Veredicto Técnico</span>
                          <span className="text-[9px] font-black px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">VIABLE</span>
                        </div>
                        <div className="text-[10px] space-y-1 font-bold text-slate-500">
                          <p>Haz Satelital: <span className="text-white">{feasibilityResult.beam}</span></p>
                          <p>Nivel de Señal: <span className="text-emerald-400">{feasibilityResult.signal}% SNR (Excelente)</span></p>
                          <p>Latencia Estimada: <span className="text-white">38ms</span></p>
                        </div>
                      </motion.div>
                    )}

                    {feasibilityResult && (
                      <div className="pt-2 border-t border-cyan-500/10">
                        <button
                          onClick={() => updateLeadStatus(selectedLead.id, "WON")}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg text-[10px] tracking-widest uppercase"
                        >
                          Cerrar Venta (Pasar a Ganado) 🚀
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selectedLead.status === "WON" && (
                  <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl flex items-start gap-4">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Venta Ganada con Éxito</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        Al pasar este lead a ganado, el sistema automáticamente generó la Cuenta de Cliente 360 y la orden de instalación técnica en estado borrador para el NOC central.
                      </p>
                    </div>
                  </div>
                )}

                {/* Prospect Details */}
                <div className="grid grid-cols-2 gap-6 bg-slate-900/10 p-6 rounded-3xl border border-white/5">
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Contacto</span>
                    <span className="text-white text-xs font-bold">{selectedLead.contactName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Valor Estimado</span>
                    <span className="text-cyan-400 text-xs font-black">${selectedLead.estimatedValue.toLocaleString('es-AR')} ARS</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Email</span>
                    <span className="text-white text-xs font-bold break-all">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Teléfono</span>
                    <span className="text-white text-xs font-bold">{selectedLead.phone}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Ciudad</span>
                    <span className="text-white text-xs font-bold">{selectedLead.city}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Coordenadas NOC</span>
                    <span className="text-white text-xs font-mono font-bold">{selectedLead.coordinates}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Plan Satelital Solicitado</span>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">{selectedLead.planInterest.replace("_", " ")}</span>
                  </div>
                  {selectedLead.notes && (
                    <div className="col-span-2">
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">Notas Iniciales</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-bold">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Contact logs (Actividades) */}
                <div className="space-y-6">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest border-b border-white/5 pb-2">Registro de Actividades</h3>
                  
                  <form onSubmit={handleLogActivity} className="bg-slate-900/30 p-5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex gap-4">
                      <select 
                        value={newActivityType}
                        onChange={e => setNewActivityType(e.target.value)}
                        className="bg-slate-950 text-white rounded-xl border border-white/5 px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none"
                      >
                        <option value="CALL">Llamada</option>
                        <option value="EMAIL">Email</option>
                        <option value="MEETING">Reunión</option>
                        <option value="NOTES">Nota Interna</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Registrar detalles del contacto comercial..."
                        value={newActivityNotes}
                        onChange={e => setNewActivityNotes(e.target.value)}
                        className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-white outline-none font-bold"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isLoggingActivity || !newActivityNotes.trim()}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-2 rounded-xl text-[9px] tracking-widest uppercase transition-all disabled:opacity-50"
                      >
                        {isLoggingActivity ? "Registrando..." : "Guardar Actividad"}
                      </button>
                    </div>
                  </form>

                  {/* Activity List */}
                  <div className="space-y-4">
                    {selectedLead.activities && selectedLead.activities.map((act) => (
                      <div key={act.id} className="p-4 bg-slate-900/20 border border-white/5 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                          <span className={`px-2 py-0.5 rounded ${act.type === 'CALL' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : act.type === 'EMAIL' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            {act.type === 'CALL' ? '📞 Llamada' : act.type === 'EMAIL' ? '✉️ Correo' : act.type === 'MEETING' ? '🤝 Reunión' : '📝 Nota'}
                          </span>
                          <span className="text-slate-600">{new Date(act.createdAt).toLocaleString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-bold leading-normal">{act.description || act.notes}</p>
                        <div className="text-[7px] text-slate-600 font-black uppercase tracking-widest">
                          Registrado por: {act.createdBy?.name || act.user?.name || "NOC Staff"}
                        </div>
                      </div>
                    ))}
                    {(!selectedLead.activities || selectedLead.activities.length === 0) && (
                      <div className="text-center py-6 text-[8px] font-black text-slate-700 uppercase tracking-widest">
                        Sin interacciones registradas
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Register Lead */}
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
                  <span className="text-cyan-500 text-[9px] font-black uppercase tracking-widest">Alta de Prospecto</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">Registrar Nuevo Lead</h2>
                </div>
                <button 
                  onClick={() => setIsAddOpen(false)} 
                  className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center transition-all border border-white/5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddLead} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Nombre Comercial / Empresa</label>
                    <input 
                      type="text" 
                      value={newCompanyName}
                      onChange={e => setNewCompanyName(e.target.value)}
                      placeholder="Empresa Minera S.A."
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Contacto Responsable</label>
                    <input 
                      type="text" 
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      placeholder="Ing. Carlos Pérez"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Ciudad / Ubicación</label>
                    <input 
                      type="text" 
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      placeholder="Uspallata, Mendoza"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Corporativo</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="carlos@minera.com"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Teléfono de Enlace</label>
                    <input 
                      type="text" 
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="+54 9 261 555-1234"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Coordenadas Latitud</label>
                    <input 
                      type="text" 
                      value={newLat}
                      onChange={e => setNewLat(e.target.value)}
                      placeholder="-32.889"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white font-mono outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Coordenadas Longitud</label>
                    <input 
                      type="text" 
                      value={newLng}
                      onChange={e => setNewLng(e.target.value)}
                      placeholder="-68.845"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white font-mono outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Presupuesto Mensual Estimado (ARS)</label>
                    <input 
                      type="number" 
                      value={newEstimatedValue}
                      onChange={e => setNewEstimatedValue(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Plan Satelital de Interés</label>
                    <select
                      value={newPlanInterest}
                      onChange={e => setNewPlanInterest(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors"
                    >
                      <option value="STARLINK_PRO">Starlink Pro (Pymes)</option>
                      <option value="STARLINK_CORP">Starlink Corporate (Industrial)</option>
                      <option value="STARLINK_NOC">Starlink NOC Dedicated (Crítico)</option>
                    </select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Notas de Campaña / Comentarios</label>
                    <textarea 
                      value={newNotes}
                      onChange={e => setNewNotes(e.target.value)}
                      placeholder="Requiere redundancia de NOC y antena de alto rendimiento para clima andino de montaña..."
                      rows={3}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white outline-none font-bold focus:border-cyan-500/50 transition-colors resize-none"
                    />
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
                    {isSubmitting ? "Registrando Lead..." : "Guardar Prospecto"}
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
