"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const [realStatus, setRealStatus] = useState<string | null>(null);
  const [contractData, setContractData] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auto-fill effect from URL params
  useEffect(() => {
    const pName = searchParams.get("p_name");
    const pEmail = searchParams.get("p_email");
    const pDni = searchParams.get("p_dni");
    const pPlan = searchParams.get("p_plan");
    const pPhone = searchParams.get("p_phone");

    const pContract = searchParams.get("p_contract");

    if (pName || pEmail || pDni || pPlan || pPhone || pContract) {
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

  if (pTicket && !realStatus) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black animate-pulse">CARGANDO FORMULARIO...</div>;
  }

  return (
    <AntennaContractForm 
      agents={agents}
      nextInstallId={finalInstallId}
      ticketId={pTicket || ""} 
      ticketStatus={(contractData?.status === 'APPROVED' || contractData?.status === 'COMPLETED') ? contractData.status : (realStatus || (pTicket ? "CONTRACT_INITIATED" : "OPEN"))}
      onBack={() => router.push('/soporte/dashboard')}
      initialData={contractData ? {
        clientName: contractData.clientName,
        clientEmail: contractData.clientEmail,
        clientDni: contractData.clientDni,
        clientPhone: contractData.clientPhone,
        clientCategory: contractData.clientCategory,
        planType: contractData.planType,
        street: contractData.street,
        houseNumber: contractData.houseNumber,
        city: contractData.city,
        province: contractData.province,
        zipCode: contractData.zipCode,
        // Pre-fill tech data if exists
        serialKit: contractData.kitSerialNumber,
        terminalId: contractData.terminalId,
        antennaModel: contractData.antennaModel,
        antennaLocation: contractData.antennaLocation,
        obstructions: contractData.obstructions,
        obstructionObject: contractData.obstructionObject,
        downloadSpeed: contractData.downloadSpeed?.toString(),
        uploadSpeed: contractData.uploadSpeed?.toString(),
        latency: contractData.latency?.toString(),
        networkMode: contractData.networkMode,
        observations: contractData.techNotes,
        perfObservations: contractData.perfObservations,
        techName: contractData.techName,
        techDni: contractData.techDni,
        techSignedAt: contractData.techSignedAt,
        clientSignedAt: contractData.clientSignedAt,
        techSignature: contractData.techSignature,
        clientSignature: contractData.clientSignature,
        photoAntena: contractData.photoAntena,
        photoSoporte: contractData.photoSoporte,
        photoRouter: contractData.photoRouter,
        photoTest: contractData.photoTest,
        photoApp: contractData.photoApp,
        photoRack: contractData.photoRack,
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
