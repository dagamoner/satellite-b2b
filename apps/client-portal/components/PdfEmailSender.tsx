"use client";

import { useEffect, useRef } from "react";
import { generateContractPDF } from "../lib/pdf";
import { getTicketInfo } from "@/app/contrato/actions";

interface PdfEmailSenderProps {
  ticketId: string;
  shouldSend: boolean;
}

export default function PdfEmailSender({ ticketId, shouldSend }: PdfEmailSenderProps) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (shouldSend && !sentRef.current) {
      sentRef.current = true;
      const sendEmail = async () => {
        try {
          const ticket = await getTicketInfo(ticketId);
          if (!ticket || !ticket.contract) return;
          
          const contract = ticket.contract;
          const pdfBase64 = await generateContractPDF(contract as any, true);
          
          await fetch(`/api/support/tickets/${ticketId}/send-certificate`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                pdfBase64,
                fileName: `Contrato_Instalacion_${contract.contractNumber || contract.id.substring(0,6)}.pdf`,
                clientEmail: contract.clientEmail,
                clientName: contract.clientName
             })
          });
        } catch (e) {
          console.error("Error sending contract email in background:", e);
        }
      };
      
      sendEmail();
    }
  }, [shouldSend, ticketId]);

  return null;
}
