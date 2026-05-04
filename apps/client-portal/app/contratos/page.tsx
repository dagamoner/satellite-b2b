"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { contractSchema } from "@repo/validation";
import { z } from "zod";


const DownloadContractPDF = dynamic(() => import("../../components/DownloadContractPDF"), { ssr: false });


// ── Tipos ──────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientDni: string;
  companyName: string;
  address: string;
  city: string;
  province: string;
  equipmentType: string;
  planType: string;
  monthlyFee: string;
  installationNotes: string;
}

const INITIAL_DATA: FormData = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  clientDni: "",
  companyName: "",
  address: "",
  city: "Mendoza",
  province: "Mendoza",
  equipmentType: "",
  planType: "",
  monthlyFee: "",
  installationNotes: "",
};

const PLAN_FEES: Record<string, string> = {
  BASICO_MINI: "90000",
  BASICO_V4: "120000",
  FULL_V4: "200000",
  ENTERPRISE_ROAM: "400000",
  ENTERPRISE_PRO: "800000",
};

const PLAN_LABELS: Record<string, string> = {
  BASICO_MINI: "Básico Mini X — $90.000/mes",
  BASICO_V4: "Básico Estándar V4 — $120.000/mes",
  FULL_V4: "Full Estándar V4 — $200.000/mes",
  ENTERPRISE_ROAM: "Enterprise Itinerante — $400.000/mes",
  ENTERPRISE_PRO: "Enterprise Pro — $800.000/mes",
};


const EQUIPMENT_LABELS: Record<string, string> = {
  MINI_X: "Starlink Mini X (Hogar & Viajes)",
  STANDARD_V4: "Estándar V4 (PyMEs & Bodegas)",
};

// Mapeo de nombres comerciales de la landing a IDs internos
const PLAN_MAPPING: Record<string, { equipment: "MINI_X" | "STANDARD_V4"; plan: string }> = {
  "Plan Básico Mini": { equipment: "MINI_X", plan: "BASICO_MINI" },
  "Plan Básico Estándar V4": { equipment: "STANDARD_V4", plan: "BASICO_V4" },
  "Plan Full Estándar V4": { equipment: "STANDARD_V4", plan: "FULL_V4" },
  "Starlink Mini": { equipment: "MINI_X", plan: "BASICO_MINI" },
  "Standard Estándar": { equipment: "STANDARD_V4", plan: "BASICO_V4" },
  "Standard Full": { equipment: "STANDARD_V4", plan: "FULL_V4" },
};

// ── Componentes auxiliares ─────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Datos del Cliente" },
    { n: 2, label: "Instalación" },
    { n: 3, label: "Confirmación" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                current === s.n
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : current > s.n
                  ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                  : "bg-slate-800 border-slate-700 text-slate-500"
              }`}
            >
              {current > s.n ? "✓" : s.n}
            </div>
            <span
              className={`text-xs mt-2 font-medium hidden sm:block ${
                current >= s.n ? "text-blue-400" : "text-slate-600"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-all duration-300 ${
                current > s.n ? "bg-blue-500/50" : "bg-slate-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  id,
  children,
  required,
  error,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
}) {

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-300">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>

  );
}

const inputClass =
  "bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200 text-sm";

// ── Página principal ───────────────────────────────────────────────────────
export default function ContratosPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ contractNumber: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Auto-fill effect from URL params
  useEffect(() => {
    const pName = searchParams.get("p_name");
    const pEmail = searchParams.get("p_email");
    const pDni = searchParams.get("p_dni");
    const pPlan = searchParams.get("p_plan");
    const pPhone = searchParams.get("p_phone");

    if (pName || pEmail || pDni || pPlan || pPhone) {
      setForm(prev => {
        const next = { ...prev };
        if (pName) next.clientName = pName;
        if (pEmail) next.clientEmail = pEmail;
        if (pDni) next.clientDni = pDni;
        if (pPhone) next.clientPhone = pPhone;
        
        if (pPlan && PLAN_MAPPING[pPlan]) {
          next.planType = PLAN_MAPPING[pPlan].plan;
          next.equipmentType = PLAN_MAPPING[pPlan].equipment;
          next.monthlyFee = PLAN_FEES[next.planType] || "";
        }
        return next;
      });
    }
  }, [searchParams]);


  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-rellenar fee al seleccionar plan
      if (field === "planType") {
        next.monthlyFee = PLAN_FEES[value] || "";
      }
      return next;
    });
  };

  const next = () => setStep((s) => Math.min(s + 1, 3) as Step);
  const prev = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const submit = async () => {
    setLoading(true);
    setFormErrors({});
    setError(null);
    
    try {
      // Validar con Zod
      contractSchema.parse(form);

      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setSuccess({ contractNumber: data.contractNumber });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) errors[e.path[0] as string] = e.message;
        });
        setFormErrors(errors);
        setError("Por favor, corrige los errores en el formulario.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };


  // ── Vista de éxito ─────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">¡Solicitud Enviada!</h1>
          <p className="text-slate-400 mb-6 text-lg">
            Tu solicitud de instalación ha sido registrada. El equipo de <strong>MR Technology</strong> se contactará a la brevedad.
          </p>
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <p className="text-slate-500 text-sm mb-2 uppercase tracking-widest font-semibold">Número de Solicitud</p>
            <p className="text-3xl font-extrabold text-blue-400 tracking-wider">{success.contractNumber}</p>
            <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-tighter">
              Guardá este número. Lo necesitarás junto a tu DNI para ingresar al portal y chatear con soporte.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <DownloadContractPDF form={form} contractNumber={success.contractNumber} />
            <Link 
              href={`/?p_dni=${form.clientDni}&p_contract=${success.contractNumber}`} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center"
            >
              Volver al Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-sm font-semibold mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Contrato de Instalación
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Solicitar Instalación Starlink</h1>
        <p className="text-slate-400">Completá el formulario y el equipo de <span className="text-blue-400 font-semibold">MR Technology</span> coordinará tu instalación en Mendoza.</p>
      </div>

      {/* Card del formulario */}
      <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
        <StepIndicator current={step} />

        {/* PASO 1 — Datos del Cliente */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white mb-6">Datos del Cliente</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nombre completo / Razón Social" id="clientName" required error={formErrors.clientName}>
                <input id="clientName" className={`${inputClass} ${formErrors.clientName ? 'border-red-500/50 bg-red-500/5' : ''}`} placeholder="Juan García / Bodega XYZ SA" value={form.clientName} onChange={update("clientName")} />
              </Field>
              <Field label="DNI / CUIT" id="clientDni" required error={formErrors.clientDni}>
                <input id="clientDni" className={`${inputClass} ${formErrors.clientDni ? 'border-red-500/50 bg-red-500/5' : ''}`} placeholder="20-12345678-5" value={form.clientDni} onChange={update("clientDni")} />
              </Field>
              <Field label="Email de contacto" id="clientEmail" required error={formErrors.clientEmail}>
                <input id="clientEmail" type="email" className={`${inputClass} ${formErrors.clientEmail ? 'border-red-500/50 bg-red-500/5' : ''}`} placeholder="empresa@ejemplo.com" value={form.clientEmail} onChange={update("clientEmail")} />
              </Field>
              <Field label="Teléfono / WhatsApp" id="clientPhone" required error={formErrors.clientPhone}>
                <input id="clientPhone" className={`${inputClass} ${formErrors.clientPhone ? 'border-red-500/50 bg-red-500/5' : ''}`} placeholder="+54 261 000-0000" value={form.clientPhone} onChange={update("clientPhone")} />
              </Field>
            </div>

            <Field label="Empresa (opcional)" id="companyName">
              <input id="companyName" className={inputClass} placeholder="Nombre de tu empresa o emprendimiento" value={form.companyName} onChange={update("companyName")} />
            </Field>
            <div className="flex justify-end pt-4">
              <button
                onClick={next}
                disabled={!form.clientName || !form.clientEmail || !form.clientPhone || !form.clientDni}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* PASO 2 — Datos de Instalación */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white mb-6">Datos de Instalación</h2>
            <Field label="Dirección de instalación" id="address" required error={formErrors.address}>
              <input id="address" className={`${inputClass} ${formErrors.address ? 'border-red-500/50 bg-red-500/5' : ''}`} placeholder="Av. San Martín 1234, Maipú" value={form.address} onChange={update("address")} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Ciudad" id="city" required error={formErrors.city}>
                <input id="city" className={`${inputClass} ${formErrors.city ? 'border-red-500/50 bg-red-500/5' : ''}`} value={form.city} onChange={update("city")} />
              </Field>
              <Field label="Provincia" id="province" required error={formErrors.province}>
                <input id="province" className={`${inputClass} ${formErrors.province ? 'border-red-500/50 bg-red-500/5' : ''}`} value={form.province} onChange={update("province")} />
              </Field>
            </div>
            <Field label="Equipo Starlink" id="equipmentType" required error={formErrors.equipmentType}>
              <select id="equipmentType" className={`${inputClass} ${formErrors.equipmentType ? 'border-red-500/50 bg-red-500/5' : ''}`} value={form.equipmentType} onChange={update("equipmentType")}>
                <option value="">Seleccioná el equipo...</option>
                <option value="MINI_X">Starlink Mini X — Hogar & Viajes</option>
                <option value="STANDARD_V4">Estándar V4 — PyMEs & Bodegas</option>
              </select>
            </Field>
            <Field label="Plan / Abono" id="planType" required error={formErrors.planType}>
              <select id="planType" className={`${inputClass} ${formErrors.planType ? 'border-red-500/50 bg-red-500/5' : ''}`} value={form.planType} onChange={update("planType")}>
                <option value="">Seleccioná un plan...</option>
                {Object.entries(PLAN_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </Field>
            <Field label="Observaciones / Notas (opcional)" id="installationNotes">
              <textarea
                id="installationNotes"
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Indicá condiciones especiales del lugar, acceso, etc."
                value={form.installationNotes}
                onChange={update("installationNotes")}
              />
            </Field>
            <div className="flex justify-between pt-4">
              <button onClick={prev} className="text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </button>
              <button
                onClick={next}
                disabled={!form.address || !form.equipmentType || !form.planType}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                Revisar
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 — Confirmación */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Confirmación</h2>

            {/* Resumen de datos */}
            <div className="space-y-4">
              {/* Bloque cliente */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Datos del Cliente</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">Nombre:</span> <span className="text-slate-200 font-medium">{form.clientName}</span></div>
                  <div><span className="text-slate-500">DNI/CUIT:</span> <span className="text-slate-200 font-medium">{form.clientDni}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className="text-slate-200 font-medium">{form.clientEmail}</span></div>
                  <div><span className="text-slate-500">Teléfono:</span> <span className="text-slate-200 font-medium">{form.clientPhone}</span></div>
                  {form.companyName && (
                    <div className="sm:col-span-2"><span className="text-slate-500">Empresa:</span> <span className="text-slate-200 font-medium">{form.companyName}</span></div>
                  )}
                </div>
              </div>

              {/* Bloque instalación */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">Instalación</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="sm:col-span-2"><span className="text-slate-500">Dirección:</span> <span className="text-slate-200 font-medium">{form.address}, {form.city}, {form.province}</span></div>
                  <div><span className="text-slate-500">Equipo:</span> <span className="text-blue-300 font-medium">{EQUIPMENT_LABELS[form.equipmentType]}</span></div>
                  <div><span className="text-slate-500">Plan:</span> <span className="text-blue-300 font-medium">{PLAN_LABELS[form.planType]}</span></div>
                </div>
                {form.installationNotes && (
                  <p className="text-slate-400 text-sm mt-3 border-t border-slate-700 pt-3">{form.installationNotes}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                ⚠ {error}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={prev} className="text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Editar
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-wait text-white font-bold px-10 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    ENVIAR SOLICITUD
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-slate-600 text-xs mt-8">
        MR Technology · Maipú, Mendoza · © {new Date().getFullYear()}
      </p>
    </div>
  );
}
