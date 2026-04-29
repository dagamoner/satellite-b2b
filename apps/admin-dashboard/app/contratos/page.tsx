"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRealtimeContracts } from "../../hooks/useRealtimeContracts";


const AdminPdfButton = dynamic(() => import("../../components/AdminPdfButton"), { ssr: false });
const PhotoViewer = dynamic(() => import("./components/PhotoViewer"), { ssr: false });


// ── Tipos ──────────────────────────────────────────────────────────────────
type ContractStatus = "PENDING" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "CANCELLED";

interface Contract {
  id: string;
  contractNumber: string;
  status: ContractStatus;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientDni: string;
  companyName: string | null;
  address: string;
  city: string;
  province: string;
  equipmentType: string;
  planType: string;
  monthlyFee: number | null;
  installationNotes: string | null;
  techNotes: string | null;
  scheduledDate: string | null;
  installedAt: string | null;
  createdAt: string;
  // Nuevos campos técnicos
  kitSerialNumber?: string;
  hardwareVersion?: string;
  antennaLocation?: string;
  obstructions?: string;
  downloadSpeed?: number;
  uploadSpeed?: number;
  latency?: number;
  networkMode?: string;
  techSignature?: string;
  clientSignature?: string;
  photoCasa?: string;
  photoAntena?: string;
  photoRouter?: string;
  photoCable?: string;
  photoTest?: string;
  photoObstrucciones?: string;
  technician?: { name: string, email: string };
}

// ── Config de estados ──────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; dot: string }> = {
  PENDING:     { label: "Pendiente",      color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",  dot: "bg-yellow-400" },
  APPROVED:    { label: "Aprobado",       color: "bg-blue-500/15 text-blue-400 border-blue-500/30",        dot: "bg-blue-400"   },
  IN_PROGRESS: { label: "En Proceso",     color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",  dot: "bg-indigo-400" },
  COMPLETED:   { label: "Completado",     color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  REJECTED:    { label: "Inspeccionado",  color: "bg-orange-500/15 text-orange-400 border-orange-500/30",  dot: "bg-orange-400"  },
  CANCELLED:   { label: "Cancelado",      color: "bg-red-500/15 text-red-400 border-red-500/30",            dot: "bg-red-400"    },
};

const EQUIPMENT_LABELS: Record<string, string> = {
  MINI_X: "Mini X",
  STANDARD_V4: "Estándar V4",
};

const PLAN_LABELS: Record<string, string> = {
  BASICO_MINI: "Básico Mini",
  BASICO_V4: "Básico V4",
  FULL_V4: "Full V4",
  ITINERANTE: "Itinerante",
  EMPRESARIAL: "Empresarial",
};

// ── Componente Badge ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ContractStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Modal de detalle ───────────────────────────────────────────────────────
function ContractModal({
  contract,
  onClose,
  onUpdated,
}: {
  contract: Contract;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState<ContractStatus>(contract.status);
  const [techNotes, setTechNotes] = useState(contract.techNotes || "");
  const [scheduledDate, setScheduledDate] = useState(
    contract.scheduledDate ? contract.scheduledDate.substring(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "tecnico" | "evidencias">("general");

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/contracts/${contract.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          techNotes,
          scheduledDate: scheduledDate || undefined,
          ...(status === "COMPLETED" ? { installedAt: new Date().toISOString() } : {}),
        }),
      });
      if (res.ok) {
        setSavedOk(true);
        setTimeout(() => {
          setSavedOk(false);
          onUpdated();
          onClose();
        }, 1000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex border-b border-slate-700 mb-6">
          <button onClick={() => setActiveTab("general")} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "general" ? "text-blue-400 border-b-2 border-blue-500" : "text-slate-500 hover:text-slate-300"}`}>General</button>
          <button onClick={() => setActiveTab("tecnico")} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "tecnico" ? "text-blue-400 border-b-2 border-blue-500" : "text-slate-500 hover:text-slate-300"}`}>Ficha Técnica</button>
          <button onClick={() => setActiveTab("evidencias")} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "evidencias" ? "text-blue-400 border-b-2 border-blue-500" : "text-slate-500 hover:text-slate-300"}`}>Evidencias</button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "general" && (
            <>
              {/* Datos del cliente */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Información del Cliente</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500 block mb-0.5">Nombre:</span> <span className="text-slate-200 font-semibold">{contract.clientName}</span></div>
                  <div><span className="text-slate-500 block mb-0.5">DNI/CUIT:</span> <span className="text-slate-200 font-medium">{contract.clientDni}</span></div>
                  <div><span className="text-slate-500 block mb-0.5">Email:</span> <span className="text-slate-200">{contract.clientEmail}</span></div>
                  <div><span className="text-slate-500 block mb-0.5">Teléfono:</span> <span className="text-slate-200">{contract.clientPhone}</span></div>
                </div>
              </div>

              {/* Gestión admin */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Gestión de la Instalación</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-2">Estado Actual</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ContractStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="PENDING">⏳ Pendiente de Revisión</option>
                      <option value="APPROVED">✅ Aprobado para Instalación</option>
                      <option value="IN_PROGRESS">🔧 Instalación en Curso</option>
                      <option value="COMPLETED">✅ Instalación Completada</option>
                      <option value="REJECTED">❌ Rechazado (Mala Instalación)</option>
                      <option value="CANCELLED">🚫 Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-2">Notas Técnicas / Observaciones</label>
                    <textarea
                      value={techNotes}
                      onChange={(e) => setTechNotes(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "tecnico" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Equipamiento</span>
                  <p className="text-sm text-cyan-400 font-bold">{EQUIPMENT_LABELS[contract.equipmentType]}</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Plan contratado</span>
                  <p className="text-sm text-cyan-400 font-bold">{PLAN_LABELS[contract.planType]}</p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Resultados de Instalación</h3>
                <div className="grid grid-cols-3 gap-6 mb-6">
                   <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-slate-500 text-[10px] block mb-1 font-bold">Bajada</span>
                      <span className="text-emerald-400 text-lg font-black">{contract.downloadSpeed || 0} <small className="text-[10px]">Mbps</small></span>
                   </div>
                   <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-slate-500 text-[10px] block mb-1 font-bold">Subida</span>
                      <span className="text-blue-400 text-lg font-black">{contract.uploadSpeed || 0} <small className="text-[10px]">Mbps</small></span>
                   </div>
                   <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-slate-500 text-[10px] block mb-1 font-bold">Latencia</span>
                      <span className="text-indigo-400 text-lg font-black">{contract.latency || 0} <small className="text-[10px]">ms</small></span>
                   </div>
                </div>
                <div className="grid gap-3 text-sm border-t border-slate-700 pt-5">
                   <div className="flex justify-between"><span className="text-slate-500">Nro Serie Kit:</span><span className="text-white font-mono">{contract.kitSerialNumber || "N/A"}</span></div>
                   <div className="flex justify-between"><span className="text-slate-500">Modo de Red:</span><span className="text-white">{contract.networkMode || "N/A"}</span></div>
                   <div className="flex justify-between"><span className="text-slate-500">Técnico encargado:</span><span className="text-blue-400 font-bold">{contract.technician?.name || "No asignado"}</span></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Firma del Cliente</span>
                    <div className="bg-white/5 border border-slate-800 rounded-xl p-2 aspect-[3/1] flex items-center justify-center overflow-hidden">
                       {contract.clientSignature ? <img src={contract.clientSignature} className="max-h-full invert" /> : <span className="text-slate-700 text-xs">Sin firma</span>}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Firma del Técnico</span>
                    <div className="bg-white/5 border border-slate-800 rounded-xl p-2 aspect-[3/1] flex items-center justify-center overflow-hidden">
                       {contract.techSignature ? <img src={contract.techSignature} className="max-h-full invert opacity-80" /> : <span className="text-slate-700 text-xs">Sin firma</span>}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "evidencias" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <PhotoViewer path={contract.photoAntena || null} label="Antena" />
              <PhotoViewer path={contract.photoCasa || null} label="Fachada" />
              <PhotoViewer path={contract.photoRouter || null} label="Router" />
              <PhotoViewer path={contract.photoCable || null} label="Cableado" />
              <PhotoViewer path={contract.photoTest || null} label="Speedtest" />
              <PhotoViewer path={contract.photoObstrucciones || null} label="Obstrucciones" />
            </div>
          )}
        </div>

        {/* Footer Modal Acciones */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex gap-4">
           {status !== "REJECTED" && (
              <button 
                onClick={() => setStatus("REJECTED")}
                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-6 py-4 rounded-2xl transition-all grow text-sm"
              >
                Rechazar por mala instalación
              </button>
           )}
           <button
            onClick={save}
            disabled={saving || savedOk}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-extrabold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 grow-0 min-w-44 shadow-lg shadow-blue-500/20"
          >
            {savedOk ? "✓ Guardado" : saving ? "Guardando..." : "Guardar Auditoría"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página Admin ───────────────────────────────────────────────────────────
export default function ContratosAdminPage() {
  const [filterTechId, setFilterTechId] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selected, setSelected] = useState<Contract | null>(null);
  const [technicians, setTechnicians] = useState<{id: string, name: string}[]>([]);
  const [search, setSearch] = useState("");

  // --- Realtime Hook ---
  const { contracts, loading, refetch: fetchContracts } = useRealtimeContracts();
  // ---------------------


  const fetchTechnicians = async () => {
    try {
      const res = await fetch("/api/technicians");
      const data = await res.json();
      setTechnicians(data.technicians || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTechnicians(); }, []);


  const filtered = (contracts as Contract[]).filter((c) => {
    const matchesSearch = search
      ? c.clientName.toLowerCase().includes(search.toLowerCase()) ||
        c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.clientEmail.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    const matchesTech = filterTechId === "ALL" || c.technician?.id === filterTechId;

    return matchesSearch && matchesStatus && matchesTech;
  });


  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = contracts.filter((c) => c.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Contratos de Instalación</h1>
            <p className="text-slate-500 text-sm mt-0.5">{contracts.length} registros totales</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={filterTechId}
              onChange={(e) => setFilterTechId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 w-48"
            >
              <option value="ALL">👤 Todos los Técnicos</option>
              {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="Buscar contrato, cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 w-56"
            />
            <button
              onClick={fetchContracts}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              ↻ Actualizar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {(Object.entries(STATUS_CONFIG) as [ContractStatus, typeof STATUS_CONFIG[ContractStatus]][]).map(([s, cfg]) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}
              className={`bg-slate-900 border rounded-2xl p-4 text-left transition-all duration-200 hover:border-slate-600 ${
                filterStatus === s ? "border-blue-500/50 shadow-lg shadow-blue-500/10" : "border-slate-800"
              }`}
            >
              <p className="text-2xl font-bold text-white mb-1">{counts[s] ?? 0}</p>
              <StatusBadge status={s} />
            </button>
          ))}
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold text-lg">No se encontraron contratos</p>
            <p className="text-sm mt-1">Ajustá los filtros o esperá nuevas solicitudes de clientes.</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Contrato</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Técnico / Cliente</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500 hidden md:table-cell">Equipo / Plan</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500 hidden lg:table-cell">Fecha</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Estado</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                        i === filtered.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-400 text-sm">{c.contractNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-blue-400">
                              {c.technician?.name?.charAt(0) || "T"}
                           </div>
                           <div>
                              <p className="font-semibold text-slate-200 text-sm leading-tight">{c.clientName}</p>
                              <p className="text-slate-500 text-[10px]">{c.technician?.name || "No asignado"}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-slate-300 text-sm">{EQUIPMENT_LABELS[c.equipmentType]}</p>
                        <p className="text-slate-500 text-xs">{PLAN_LABELS[c.planType]}</p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-slate-400 text-sm">
                          {new Date(c.createdAt).toLocaleDateString("es-AR")}
                        </p>
                        {c.scheduledDate && (
                          <p className="text-blue-400 text-xs">
                            📅 {new Date(c.scheduledDate).toLocaleDateString("es-AR")}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelected(c)}
                          className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/10"
                        >
                          Gestionar →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ContractModal
          contract={selected}
          onClose={() => setSelected(null)}
          onUpdated={fetchContracts}
        />
      )}
    </div>
  );
}
