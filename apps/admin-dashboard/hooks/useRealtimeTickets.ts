import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*, contract:installation_contracts(client_name, contract_number)')
      .order('created_at', { ascending: false });
    
    if (data) {
      // Mapeo para mantener compatibilidad con el frontend actual
      const mapped = data.map((t: any) => ({
        ...t,
        ticketNumber: t.ticket_number,
        createdAt: t.created_at,
        contract: {
          clientName: t.contract?.client_name,
          contractNumber: t.contract?.contract_number
        }
      }));
      setTickets(mapped);
    }
    setLoading(false);
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
