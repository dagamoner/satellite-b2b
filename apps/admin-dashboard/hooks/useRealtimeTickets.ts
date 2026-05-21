import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
  createdAt: string;
  contract: {
    clientName: string;
    contractNumber: string;
  }
}

export function useRealtimeTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      console.log("[useRealtimeTickets] Fetching tickets from backend API...");
      const response = await fetch("/api/support/tickets/all");
      
      if (!response.ok) {
        throw new Error(`API error status: ${response.status}`);
      }
      
      const apiData = await response.json();
      console.log("[useRealtimeTickets] API success! Raw tickets received:", apiData?.tickets?.length || 0);
      
      if (apiData && apiData.tickets) {
        const mapped: Ticket[] = apiData.tickets.map((t: any) => {
          return {
            ...t,
            ticketNumber: t.ticketNumber,
            createdAt: t.createdAt || t.created_at,
            contract: t.contract || { clientName: 'Sin Nombre (Leads)', contractNumber: 'N/A' }
          };
        });
        
        console.log("[useRealtimeTickets] Mapped API tickets:", mapped.length);
        setTickets(mapped);
        return;
      }
      
      throw new Error("No tickets in API response");
    } catch (err) {
      console.warn("[useRealtimeTickets] API fetch failed, trying client-side Supabase fallback:", err);
      try {
        const { data, error } = await supabase
          .from("support_tickets")
          .select(`
            *,
            contract:installation_contracts (
              clientName,
              contractNumber
            )
          `)
          .order("createdAt", { ascending: false });

        if (error) {
          console.error("[useRealtimeTickets] Supabase fallback error:", error);
          throw error;
        }
        
        console.log("[useRealtimeTickets] Supabase fallback success! Raw data received:", data?.length || 0);
        
        const mapped: Ticket[] = (data || []).map((t: any) => {
          const contractData = Array.isArray(t.contract) ? t.contract[0] : t.contract;
          return {
            ...t,
            ticketNumber: t.ticketNumber,
            createdAt: t.createdAt,
            contract: contractData || { clientName: 'Sin Nombre (Leads)', contractNumber: 'N/A' }
          };
        });
        
        console.log("[useRealtimeTickets] Mapped fallback tickets:", mapped.length);
        setTickets(mapped);
      } catch (fallbackErr) {
        console.error("[useRealtimeTickets] Both API and Supabase queries failed:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Sondeo periódico cada 30 segundos como último recurso de fallback
    const intervalId = setInterval(() => {
      console.log("[useRealtimeTickets] Polling tickets...");
      fetchTickets();
    }, 30000);

    // Suscripción en tiempo real de Supabase como disparador de actualización
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets'
        },
        () => {
          console.log("[useRealtimeTickets] Realtime change detected! Refetching...");
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, []);

  return { tickets, loading, refetch: fetchTickets };
}
