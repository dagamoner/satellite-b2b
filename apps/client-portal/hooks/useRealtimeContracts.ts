import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeContracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    const { data } = await supabase
      .from('installation_contracts')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (data) {
      const mapped = data.map((c: any) => ({
        ...c,
        contractNumber: c.contractNumber,
        clientName: c.clientName,
        createdAt: c.createdAt
      }));
      setContracts(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();

    const channel = supabase
      .channel('contracts-client-changes')
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
