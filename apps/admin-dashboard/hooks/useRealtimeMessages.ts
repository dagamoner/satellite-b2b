import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  content: string;
  authorId: string | null;
  createdAt: string;
  author?: { name: string; role: string };
}

export function useRealtimeMessages(ticketId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    if (!ticketId) return;
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*, users(name, role)')
      .eq('ticketId', ticketId)
      .order('createdAt', { ascending: true });
    
    if (error) {
      console.error("[useRealtimeMessages] Error fetching messages:", error);
    }

    if (data) {
      const mapped: Message[] = data.map((m: any) => ({
        ...m,
        authorId: m.authorId,
        createdAt: m.createdAt,
        author: m.users ? { name: m.users.name, role: m.users.role } : undefined
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
