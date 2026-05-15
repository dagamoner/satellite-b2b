"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import SignatureCanvas from "react-signature-canvas";
import { useRealtimeContracts } from "../../hooks/useRealtimeContracts";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const AdminPdfButton = dynamic(() => import("../../components/AdminPdfButton"), { 
  ssr: false,
  loading: () => <div className="h-9 w-24 bg-slate-800 animate-pulse rounded-xl" />
});
type ContractStatus = "LEAD" | "PENDING" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "CANCELLED";

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
  antennaModel?: string;
  antennaLocation?: string;
  obstructions?: string;
  obstructionObject?: string;
  downloadSpeed?: number;
  uploadSpeed?: number;
  latency?: number;
  networkMode?: string;
  perfObservations?: string;
  techSignature?: string;
  clientSignature?: string;
  photoAntena?: string;
  photoSoporte?: string;
  photoRouter?: string;
  photoTest?: string;
  photoApp?: string;
  photoRack?: string;
  technician?: { id: string, name: string, email: string };
}

// ── Config de estados ──────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; dot: string }> = {
  LEAD:        { label: "Lead (Web)",     color: "bg-purple-500/15 text-purple-400 border-purple-500/30",  dot: "bg-purple-400" },
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
  technicians,
}: {
  contract: Contract;
  onClose: () => void;
  onUpdated: () => void;
  technicians: { id: string, name: string }[];
}) {
  const [status, setStatus] = useState<ContractStatus>(contract.status);
  const [technicianId, setTechnicianId] = useState(contract.technician?.id || "NONE");
  const [techNotes, setTechNotes] = useState(contract.techNotes || "");
  const [scheduledDate, setScheduledDate] = useState(
    contract.scheduledDate ? contract.scheduledDate.substring(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "tecnico" | "evidencias">("general");

  // Estados técnicos editables
  const [kitSerialNumber, setKitSerialNumber] = useState(contract.kitSerialNumber || "");
  const [antennaModel, setAntennaModel] = useState(contract.antennaModel || "STANDAR V4");
  const [antennaLocation, setAntennaLocation] = useState(contract.antennaLocation || "");
  const [obstructions, setObstructions] = useState(contract.obstructions || "Ninguna 0%");
  const [obstructionObject, setObstructionObject] = useState(contract.obstructionObject || "");
  const [downloadSpeed, setDownloadSpeed] = useState(contract.downloadSpeed?.toString() || "");
  const [uploadSpeed, setUploadSpeed] = useState(contract.uploadSpeed?.toString() || "");
  const [latency, setLatency] = useState(contract.latency?.toString() || "");
  const [networkMode, setNetworkMode] = useState(contract.networkMode || "Router Starlink");
  const [perfObservations, setPerfObservations] = useState(contract.perfObservations || "");
  
  const [photos, setPhotos] = useState<Record<string, string>>({
    photoAntena: contract.photoAntena || "",
    photoSoporte: contract.photoSoporte || "",
    photoRouter: contract.photoRouter || "",
    photoTest: contract.photoTest || "",
    photoApp: contract.photoApp || "",
    photoRack: contract.photoRack || "",
  });

  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/contracts/${contract.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          technicianId,
          techNotes,
          scheduledDate: scheduledDate || undefined,
          kitSerialNumber,
          antennaModel,
          antennaLocation,
          obstructions,
          obstructionObject,
          downloadSpeed: parseFloat(downloadSpeed) || 0,
          uploadSpeed: parseFloat(uploadSpeed) || 0,
          latency: parseInt(latency) || 0,
          networkMode,
          perfObservations,
          ...photos,
          techSignature: sigCanvas.current?.isEmpty() ? (contract.techSignature || undefined) : sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png"),
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
        <div className="flex border-b border-slate-700 mb-6 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab("general")} className={`flex-1 min-w-[120px] px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "general" ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" : "text-slate-500 hover:text-slate-300"}`}>01. General</button>
          <button onClick={() => setActiveTab("tecnico")} className={`flex-1 min-w-[120px] px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "tecnico" ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" : "text-slate-500 hover:text-slate-300"}`}>02. Auditoría Técnica</button>
          <button onClick={() => setActiveTab("evidencias")} className={`flex-1 min-w-[120px] px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "evidencias" ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" : "text-slate-500 hover:text-slate-300"}`}>03. Evidencias</button>
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
                  <div className="grid sm:grid-cols-2 gap-4">
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
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-2">Técnico Asignado</label>
                      <select
                        value={technicianId}
                        onChange={(e) => setTechnicianId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="NONE">⚠️ Sin asignar</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            👤 {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-2">Notas Administrativas</label>
                    <textarea
                      value={techNotes}
                      onChange={(e) => setTechNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
                      placeholder="Notas para el equipo de administración..."
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      onClick={() => setActiveTab("tecnico")}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      Comenzar Auditoría Técnica 🛰️
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "tecnico" && (
            <div className="space-y-6">
              {/* Detalles Técnicos Starlink */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 flex justify-between items-center">
                  02. Detalles Técnicos Starlink
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px]">Técnico</span>
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Número de Serie Kit</label>
                    <input 
                      value={kitSerialNumber}
                      onChange={e => setKitSerialNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="KIT-000000"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tipo de Antena</label>
                    <select 
                      value={antennaModel}
                      onChange={e => setAntennaModel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="MINI X">MINI X</option>
                      <option value="STANDAR V4">STANDAR V4</option>
                      <option value="ITINERANTE">ITINERANTE</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ubicación de Antena</label>
                    <input 
                      value={antennaLocation}
                      onChange={e => setAntennaLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ej: Terraza, Mástil"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Obstrucciones</label>
                    <select 
                      value={obstructions}
                      onChange={e => setObstructions(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="Ninguna 0%">Ninguna 0%</option>
                      <option value="Minima <1%">Mínima &lt;1%</option>
                      <option value="Moderada 1-5%">Moderada 1-5%</option>
                      <option value="Crítica >5%">Crítica &gt;5%</option>
                      <option value="Objeto">Objeto</option>
                    </select>
                  </div>
                </div>

                {obstructions === "Objeto" && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Descripción del Objeto</label>
                    <input 
                      value={obstructionObject}
                      onChange={e => setObstructionObject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Describa el objeto que genera obstrucción..."
                    />
                  </div>
                )}
              </div>

              {/* Pruebas de Rendimiento */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-6">03. Pruebas de Rendimiento</h3>
                
                <div className="grid grid-cols-3 gap-6 mb-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block text-center">Bajada (Mbps)</label>
                      <input 
                        value={downloadSpeed}
                        onChange={e => setDownloadSpeed(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-3 text-emerald-400 text-center font-black outline-none focus:border-emerald-500"
                        placeholder="0.0"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block text-center">Subida (Mbps)</label>
                      <input 
                        value={uploadSpeed}
                        onChange={e => setUploadSpeed(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-3 text-blue-400 text-center font-black outline-none focus:border-blue-500"
                        placeholder="0.0"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block text-center">Latencia (ms)</label>
                      <input 
                        value={latency}
                        onChange={e => setLatency(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-3 text-indigo-400 text-center font-black outline-none focus:border-indigo-500"
                        placeholder="0"
                      />
                   </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Modo de Red</label>
                    <select 
                      value={networkMode}
                      onChange={e => setNetworkMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="Router Starlink">Router Starlink</option>
                      <option value="Switch Starlink">Switch Starlink</option>
                      <option value="Router + Switch Starlink">Router + Switch Starlink</option>
                      <option value="Router o Switch del Cliente">Router o Switch del Cliente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Observaciones de Rendimiento</label>
                    <textarea 
                      value={perfObservations}
                      onChange={e => setPerfObservations(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none focus:border-blue-500 resize-none"
                      placeholder="Notas sobre estabilidad, cobertura, etc..."
                    />
                  </div>
                </div>
              </div>

              {/* Firma del Técnico */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-6">04. Firma del Técnico</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-inner border border-slate-700">
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor="#0f172a"
                      canvasProps={{ width: 500, height: 200, className: "w-full cursor-crosshair" }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] text-slate-500 italic">Al firmar, usted confirma que la instalación cumple con los estándares de calidad de MR Technology.</p>
                    <button 
                      onClick={() => sigCanvas.current?.clear()}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest"
                    >
                      Limpiar Firma
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón de navegación */}
              <div className="pt-4">
                <button 
                  onClick={() => setActiveTab("evidencias")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Continuar a Evidencias Fotográficas 📸
                </button>
              </div>
            </div>
          )}

          {activeTab === "evidencias" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { id: 'photoAntena', label: 'Antena (Panorámica)' },
                  { id: 'photoSoporte', label: 'Montaje & Soporte' },
                  { id: 'photoRouter', label: 'Router/Switch Interior' },
                  { id: 'photoTest', label: 'Test Velocidad' },
                  { id: 'photoApp', label: 'Obstrucciones' },
                  { id: 'photoRack', label: 'Rack Empresarial' }
                ].map((item) => {
                  const photoUrl = photos[item.id];
                  return (
                    <div key={item.id} className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{item.label}</label>
                       <div className="relative group aspect-video bg-slate-950 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all shadow-inner">
                          {photoUrl ? (
                            <>
                              <Image 
                                src={photoUrl} 
                                alt={item.label}
                                fill
                                className="object-cover" 
                              />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                               <label className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20">
                                  Cambiar
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, item.id)} />
                               </label>
                            </div>
                          </>
                        ) : (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                             <svg className="w-6 h-6 mb-2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                             <span className="text-[9px] font-black text-slate-700 uppercase">Cargar Foto</span>
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, item.id)} />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
                
              {/* Botón Guardar Final */}
              <div className="mt-8 pt-8 border-t border-slate-800">
                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 text-lg tracking-widest uppercase"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando Auditoría...
                    </>
                  ) : savedOk ? (
                    "✅ ¡Guardado con Éxito!"
                  ) : (
                    "💾 Guardar y Finalizar Auditoría"
                  )}
                </button>
              </div>
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
          <div className="flex-none">
            <AdminPdfButton contract={contract} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Página Admin ───────────────────────────────────────────────────────────
export default function ContratosAdminPage() {
  const { data: session, status } = useSession();
  const [filterTechId, setFilterTechId] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selected, setSelected] = useState<Contract | null>(null);
  const [technicians, setTechnicians] = useState<{id: string, name: string}[]>([]);
  const [search, setSearch] = useState("");

  // --- Realtime Hook ---
  const { contracts, loading, refetch: fetchContracts } = useRealtimeContracts();
  // ---------------------

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      redirect("/");
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <div className="text-cyan-500 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Sincronizando Sistema de Contratos</div>
      </div>
    );
  }


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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* Unified Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">MR</div>
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-tighter uppercase leading-none">NOC Center</span>
                <span className="text-cyan-500 text-[8px] font-black tracking-[0.2em] mt-1 uppercase">Operations Command</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-10">
              <a href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://satellite-b2b.vercel.app/"} className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-[0.2em] transition-colors border-r border-white/5 pr-10">Web Principal</a>
              <Link href="/tickets" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Tickets</Link>
              <Link href="/contratos" className="text-[10px] font-black text-white uppercase tracking-[0.2em] transition-colors border-b-2 border-cyan-500 pb-1">Contratos</Link>
              <Link href="/reportes" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Inteligencia</Link>
              <Link href="/usuarios" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Equipo</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2">
              <input
                type="text"
                placeholder="Buscar contrato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[10px] font-black text-white placeholder-slate-600 focus:outline-none w-32 uppercase tracking-widest"
              />
              <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button
              onClick={fetchContracts}
              className="bg-slate-900/50 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white p-2.5 rounded-xl transition-all"
              title="Actualizar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.586m15.414 2A8 8 0 118 4.07M20 20v-5h-5.586" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Contratos de <span className="text-cyan-500">Instalación</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">{contracts.length} REGISTROS ACTIVOS EN SISTEMA</p>
          </div>
          <select 
            value={filterTechId}
            onChange={(e) => setFilterTechId(e.target.value)}
            className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">TODOS LOS TÉCNICOS</option>
            {technicians.map(t => <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>)}
          </select>
        </header>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {(Object.entries(STATUS_CONFIG) as [ContractStatus, typeof STATUS_CONFIG[ContractStatus]][]).map(([s]) => (
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
                                {c.technician?.name ? (
                                  <p className="text-slate-400 text-[10px] font-medium italic">{c.technician.name}</p>
                                ) : (
                                  <p className="text-amber-500/80 text-[9px] font-black uppercase tracking-widest animate-pulse">Asignar Técnico +</p>
                                )}
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
                        <div className="flex items-center gap-3">
                          <AdminPdfButton contract={c} />
                          <button
                            onClick={() => setSelected(c)}
                            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/10"
                          >
                            Gestionar →
                          </button>
                        </div>
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
          technicians={technicians}
        />
      )}
    </div>
  );
}
