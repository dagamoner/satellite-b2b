"use client";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import Link from "next/link";
// import { supabase } from "../lib/supabase"; // <- Comentado para usar datos de simulacro

const MOCK_TICKETS = [
  { id: 't-1', title: 'Caída de Enlace Principal (Sede Mendoza Norte)', status: 'OPEN', created_at: new Date().toISOString() },
  { id: 't-3', title: 'Mantenimiento Preventivo Autorizado', status: 'CLOSED', created_at: new Date(Date.now() - 86400000).toISOString() }
];

const MOCK_ASSETS = [
  { id: 'a-1', name: 'Antena Primaria - Starlink Flat High Performance', ip: '100.95.x.x', status: 'OFFLINE', technology: 'STARLINK' },
  { id: 'a-2', name: 'Backhaul de Respaldo - Fibra Óptica 500Mbps', ip: '190.12.x.x', status: 'ONLINE', technology: 'FIBER' },
  { id: 'a-3', name: 'Router Administrable Cisco Meraki', ip: '192.168.1.1', status: 'ONLINE', technology: 'NETWORK' },
];

export default function ClientDashboard() {
  const [tickets] = useState<any[]>(MOCK_TICKETS);
  const [assets] = useState<any[]>(MOCK_ASSETS);

  // Lógica comentada para producción:
  // useEffect(() => { ... fetchTickets() ... }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/" className="mb-4 inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors">
          &larr; Volver al Gateway
        </Link>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-4">
             <img src="/logo.jpg" alt="MR Technology Logo" className="w-24 h-24 rounded-full shadow-xl border-2 border-slate-700 object-cover" />
             <div>
               <h1 className="text-3xl font-bold text-white">Mi Portal MR Technology</h1>
               <p className="text-slate-400">Resumen y Estado Operativo de su Empresa</p>
             </div>
          </div>
          <div className="flex gap-4">
             <Link href="/contrato">
               <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 Contrato de Instalación
               </Button>
             </Link>
              <Link href="http://localhost:3000/">
                <Button variant="default">Nuevo Ticket de Soporte</Button>
              </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de Activos / Antenas Instaladas */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
               Equipos Físicos en Terreno
            </h2>
            <div className="space-y-4">
              {assets.map(a => (
                <div key={a.id} className="p-4 bg-slate-800/50 rounded-lg shadow-sm border-l-4 border-l-slate-700 data-[status=ONLINE]:border-l-emerald-500 data-[status=OFFLINE]:border-l-red-500" data-status={a.status}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-200">{a.name}</h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">IP Pública: {a.ip}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${a.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tarjeta de Requerimientos de Soporte */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
               Mis Tickets de Soporte
            </h2>
            <div className="space-y-4">
              {tickets.map(t => (
                <Link key={t.id} href="http://localhost:3000/" className="flex justify-between p-4 bg-slate-800/50 rounded-lg shadow-sm border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-blue-400 group-hover:text-cyan-400 transition-colors">{t.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">Estado: <span className="uppercase text-xs font-bold text-cyan-400 ml-1">{t.status}</span></p>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
            
            <Link href="http://localhost:3000/" className="block w-full mt-6">
              <Button variant="outline" className="w-full text-slate-300 hover:text-white hover:border-cyan-500 border-slate-700 hover:bg-slate-800 transition-all">
                Ver Historial Completo
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
