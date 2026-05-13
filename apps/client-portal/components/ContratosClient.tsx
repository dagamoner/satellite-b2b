"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AntennaContractForm from "./AntennaContractForm";
import { getTicketInfo } from "../app/contrato/actions";

interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientDni: string;
}

const INITIAL_DATA: FormData = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  clientDni: "",
};

interface ContratosClientProps {
  agents: Array<{ id: string; name: string; role: string }>;
  nextInstallId: string;
}

export default function ContratosClient({ agents, nextInstallId }: ContratosClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black animate-pulse">CARGANDO FORMULARIO...</div>}>
      <ContratosPageContent agents={agents} nextInstallId={nextInstallId} />
    </Suspense>
  );
}

function ContratosPageContent({ agents, nextInstallId }: ContratosClientProps) {
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [isSpecialPlan, setIsSpecialPlan] = useState(false);
  const [realStatus, setRealStatus] = useState<string | null>(null);
  const [contractData, setContractData] = useState<any>(null);
  const searchParams = useSearchParams();

  // Auto-fill effect from URL params
  useEffect(() => {
    const pName = searchParams.get("p_name");
    const pEmail = searchParams.get("p_email");
    const pDni = searchParams.get("p_dni");
    const pPlan = searchParams.get("p_plan");
    const pPhone = searchParams.get("p_phone");

    const pContract = searchParams.get("p_contract");

    if (pName || pEmail || pDni || pPlan || pPhone || pContract) {
      // Detección de planes que no requieren formulario de antena
      const special = pPlan === "Plan Full Estándar V4" || pPlan === "Relevamiento IT - Planes Empresariales";
      setIsSpecialPlan(special);

      const normalizedDni = pDni ? pDni.replace(/\D/g, "") : "";

      setForm(prev => {
        const next = { ...prev };
        if (pName) next.clientName = pName;
        if (pEmail) next.clientEmail = pEmail;
        if (pDni) next.clientDni = normalizedDni;
        if (pPhone) next.clientPhone = pPhone;
        return next;
      });
    }
  }, [searchParams]);

  // Fetch real ticket status if pTicket is present
  useEffect(() => {
    const pTicket = searchParams.get("p_ticket");
    if (pTicket) {
      getTicketInfo(pTicket).then(ticket => {
        if (ticket) {
          setRealStatus(ticket.status);
          if (ticket.contract) {
            setContractData(ticket.contract);
          }
        }
      });
    }
  }, [searchParams]);

  const pContract = searchParams.get("p_contract");
  const pTicket = searchParams.get("p_ticket"); 
  const finalInstallId = pContract || nextInstallId;

  // ── Vista de planes especiales (Skip Form) ──────────────────────────────
  if (isSpecialPlan) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full">
           <div className="bg-slate-900/60 border border-blue-500/30 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-inner">
                <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                Solicitud en Gestión
              </h1>
              <p className="text-xl text-slate-400 font-light mb-10 leading-relaxed">
                Su requerimiento para <strong className="text-blue-400 font-bold">{searchParams.get("p_plan")}</strong> ha sido recibido exitosamente. 
                Nuestro equipo técnico está realizando el relevamiento inicial de su solicitud.
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Estado del Ticket</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-blue-400 font-black uppercase tracking-widest text-sm">PROCESANDO RELEVAMIENTO</span>
                  </div>
                </div>
                <div className="h-12 w-px bg-slate-800 hidden md:block" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">DNI del Titular</p>
                  <p className="text-white font-mono font-bold text-lg tracking-wider">{form.clientDni}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = `/?p_dni=${form.clientDni}&p_contract=${searchParams.get("p_contract")}`}
                  className="bg-white text-slate-950 font-black px-10 py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
                >
                  Acceder al Portal
                </button>
                <a 
                  href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "/"}
                  className="bg-slate-800 text-slate-400 font-bold px-10 py-5 rounded-2xl hover:bg-slate-700 hover:text-white transition-all text-sm uppercase tracking-widest"
                >
                  Volver a Inicio
                </a>
              </div>

              <p className="mt-12 text-[10px] text-slate-600 uppercase tracking-widest font-medium leading-relaxed">
                Recibirá una notificación en su correo corporativo <br/>
                una vez finalizado el estudio de factibilidad.
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <AntennaContractForm 
      agents={agents}
      nextInstallId={finalInstallId}
      ticketId={pTicket || ""} 
      ticketStatus={realStatus || (pTicket ? "CONTRACT_INITIATED" : "OPEN")}
      onBack={() => window.history.back()}
      initialData={contractData ? {
        clientName: contractData.clientName,
        clientEmail: contractData.clientEmail,
        clientDni: contractData.clientDni,
        clientPhone: contractData.clientPhone,
        planType: contractData.planType,
        // Pre-fill tech data if exists
        serialKit: contractData.kitSerialNumber,
        terminalId: contractData.terminalId,
        antennaModel: contractData.antennaModel,
        antennaLocation: contractData.antennaLocation,
        obstructions: contractData.obstructions,
        downloadSpeed: contractData.downloadSpeed?.toString(),
        uploadSpeed: contractData.uploadSpeed?.toString(),
        latency: contractData.latency?.toString(),
        networkMode: contractData.networkMode,
        observations: contractData.techNotes,
      } : {
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientDni: form.clientDni,
        clientPhone: form.clientPhone,
        planType: searchParams.get("p_plan") || ""
      }} 
    />
  );
}
