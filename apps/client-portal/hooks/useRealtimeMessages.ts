import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeMessages(ticketId: string | undefined) {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    if (!ticketId) return;
    const { data } = await supabase
      .from('ticket_messages')
      .select('*, author:users(name, role)')
      .eq('ticketId', ticketId)
      .order('createdAt', { ascending: true });
    
    if (data) {
      const mapped = data.map((m: any) => ({
        ...m,
        authorId: m.authorId,
        createdAt: m.createdAt,
        author: m.author ? { name: m.author.name, role: m.author.role } : undefined
      }));
      setMessages(mapped);
    }
  };

  useEffect(() => {
    if (!ticketId) return;
    fetchMessages();

    const channel = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticketId=eq.${ticketId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId]);

  return { messages, setMessages, refetch: fetchMessages };
}
