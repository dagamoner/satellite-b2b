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
        (payload) => {
          const newMsg = payload.new as any;
          setMessages(prev => {
            // Evitar duplicados (por ejemplo, si ya se añadió optimísticamente)
            if (prev.find(m => m.id === newMsg.id)) return prev;
            
            return [...prev, {
              ...newMsg,
              authorId: newMsg.authorId,
              createdAt: newMsg.createdAt,
              // Nota: author info (users) no viene en el payload de Supabase Realtime directo
              // Pero podemos asumir que si es el usuario actual, ya lo sabemos, o refetch si es necesario.
              // Por simplicidad en este sistema, refetch es más seguro para traer los joins (users).
              // Pero intentemos optimizar: si no viene el join, al menos mostramos el contenido.
            }];
          });
          
          // Refetch opcional si queremos traer la info del usuario (author join)
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
