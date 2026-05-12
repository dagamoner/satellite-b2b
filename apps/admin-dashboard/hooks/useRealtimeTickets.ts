import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      console.log("[useRealtimeTickets] Fetching tickets...");
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
        console.error("[useRealtimeTickets] Supabase error:", error);
        throw error;
      }
      
      console.log("[useRealtimeTickets] Success! Raw data received:", data?.length || 0);
      
      // Mapeo para mantener compatibilidad con el frontend actual
      const mapped = (data || []).map((t: any) => {
        // Supabase a veces devuelve las relaciones como un array
        const contractData = Array.isArray(t.contract) ? t.contract[0] : t.contract;
        
        return {
          ...t,
          ticketNumber: t.ticketNumber,
          createdAt: t.createdAt,
          contract: contractData || { clientName: 'Sin Nombre (Leads)', contractNumber: 'N/A' }
        };
      });
      
      console.log("[useRealtimeTickets] Mapped tickets:", mapped.length);
      setTickets(mapped);
    } catch (err) {
      console.error("[useRealtimeTickets] Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Suscripción en tiempo real
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
          fetchTickets(); // Refrescar cuando algo cambie
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { tickets, loading, refetch: fetchTickets };
}
