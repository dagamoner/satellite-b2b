"use client";
import { useState } from "react";
import Link from "next/link";
// import { supabase } from "../lib/supabase"; // <- Comentado para simulacro UI

const INITIAL_TICKETS = [
  { id: 't-1', title: 'Caída de Enlace Principal (Sede Mendoza Norte)', description: 'Antena primaria Starlink reporta pérdida de señal desde hace 15 mins. Ping timeout.', status: 'OPEN', priority: 'CRITICAL', created_at: new Date().toISOString() },
  { id: 't-2', title: 'Latencia alta en Fibra Backhaul', description: 'El enlace de respaldo reporta 150ms persistentes hacia el ISP. Investigar ruteo.', status: 'DIAGNOSING', priority: 'HIGH', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 't-3', title: 'Mantenimiento Preventivo Autorizado', description: 'Ajuste físico de conectores en mástil principal.', status: 'CLOSED', priority: 'LOW', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 't-4', title: 'Solicitud de IP Pública Extra', description: 'El cliente requiere una asignación nueva para sus cámaras de CCTV.', status: 'OPEN', priority: 'MEDIUM', created_at: new Date(Date.now() - 7200000).toISOString() }
];

export default function NOCDashboard() {
  const [tickets, setTickets] = useState<any[]>(INITIAL_TICKETS);

  const updateStatus = (id: string, newStatus: string) => {
    // Simulacro de mutación en UI instantánea
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }

  const priorityColors: Record<string, string> = {
    'CRITICAL': 'text-red-400 bg-red-400/10 border border-red-400/20',
    'HIGH': 'text-orange-400 bg-orange-400/10 border border-orange-400/20',
    'MEDIUM': 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20',
    'LOW': 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="mb-4 inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors">
          &larr; Volver al Gateway
        </Link>
        <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8 mt-2">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="MR Technology Logo" className="w-20 h-20 rounded-full shadow-xl border-2 border-slate-700 object-cover" />
            <h1 className="text-3xl font-bold text-white">
               NOC MR Technology <span className="text-xl font-normal text-slate-500 ml-2">| Kanban de Operaciones</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-400">Sistema en Línea (Mock)</span>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['OPEN', 'DIAGNOSING', 'CLOSED'].map(status => (
            <div key={status} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg shadow-black/50 flex flex-col h-full min-h-[60vh]">
              <h2 className="font-bold text-lg mb-6 text-slate-300 flex justify-between items-center border-b border-slate-800/50 pb-2">
                 {status === 'OPEN' ? '🟢 Abiertos (Inbox)' : status === 'DIAGNOSING' ? '⚙️ En Diagnóstico' : '✅ Resueltos'}
                 <span className="bg-slate-800 text-xs px-3 py-1 rounded-full">{tickets.filter(t => t.status === status).length}</span>
              </h2>
              
              <div className="space-y-4 flex-grow">
                {tickets.filter(t => t.status === status).map(ticket => (
                  <div key={ticket.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 shadow-md transition hover:border-blue-500/50 hover:shadow-blue-500/10 group cursor-pointer relative overflow-hidden">
                    
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-bold text-blue-400 leading-tight">{ticket.title}</p>
                    </div>
                    
                    <div className="mb-4 text-xs font-semibold px-2 py-1 rounded-md inline-block w-auto mt-2 mb-3 mr-2 bg-slate-900">
                       PRIORIDAD: <span className={`ml-1 px-1 py-0.5 rounded ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                    </div>

                    <p className="text-sm text-slate-400 mb-6">{ticket.description}</p>

                    {status !== 'CLOSED' && (
                      <button 
                        onClick={() => updateStatus(ticket.id, status === 'OPEN' ? 'DIAGNOSING' : 'CLOSED')}
                        className="text-xs font-bold bg-slate-700 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md shadow-md w-full transition-colors"
                      >
                        {status === 'OPEN' ? 'Tomar Tarea -> Diagnóstico' : 'Finalizar Soporte -> Cerrar'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {tickets.filter(t => t.status === status).length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 py-12 border-2 border-dashed border-slate-800/50 rounded-xl mt-4">
                   <span>Sin tickets</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
