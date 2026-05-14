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
    const { data, error } = await supabase
      .from('installation_contracts')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error("[useRealtimeContracts] Error fetching contracts:", error);
    }

    if (data) {
      console.log("[useRealtimeContracts] Contracts fetched successfully:", data.length);
      // Mapeo para mantener compatibilidad con el frontend
      const mapped = data.map((c: any) => ({
        ...c,
        contractNumber: c.contractNumber,
        clientName: c.clientName,
        createdAt: c.createdAt
      })) as RealtimeContract[];
      setContracts(mapped);
    }
    setLoading(false);
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
