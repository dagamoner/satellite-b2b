import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface RealtimeContract {
  id: string;
  contractNumber: string;
  clientName: string;
  createdAt: string;
  status: string;
  [key: string]: any; // Para compatibilidad con otros campos dinámicos de Supabase
}

export function useRealtimeContracts() {
  const [contracts, setContracts] = useState<RealtimeContract[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const res = await fetch("/api/contracts");
      if (!res.ok) {
        throw new Error("HTTP status " + res.status);
      }
      const data = await res.json();
      if (data && data.contracts) {
        console.log("[useRealtimeContracts] Contracts fetched successfully:", data.contracts.length);
        setContracts(data.contracts);
      }
    } catch (err) {
      console.error("[useRealtimeContracts] Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();

    const channel = supabase
      .channel('contracts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'installation_contracts'
        },
        () => {
          fetchContracts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { contracts, loading, refetch: fetchContracts };
}
