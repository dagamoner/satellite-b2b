import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeContracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    const { data } = await supabase
      .from('installation_contracts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      // Mapeo para mantener compatibilidad con el frontend
      const mapped = data.map((c: any) => ({
        ...c,
        contractNumber: c.contract_number,
        clientName: c.client_name,
        createdAt: c.created_at
      }));
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
