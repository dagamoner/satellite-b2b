import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeMessages(ticketId: string | undefined) {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    if (!ticketId) return;
    const { data } = await supabase
      .from('support_messages')
      .select('*, author:users(name, role)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (data) {
      const mapped = data.map((m: any) => ({
        ...m,
        authorId: m.author_id,
        createdAt: m.created_at,
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
          table: 'support_messages',
          filter: `ticket_id=eq.${ticketId}`
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
