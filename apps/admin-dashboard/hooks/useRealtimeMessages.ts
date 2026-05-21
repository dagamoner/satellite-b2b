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
    
    try {
      console.log(`[useRealtimeMessages] Fetching messages for ticket ${ticketId} from backend API...`);
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`);
      
      if (!response.ok) {
        throw new Error(`API error status: ${response.status}`);
      }
      
      const apiData = await response.json();
      console.log("[useRealtimeMessages] API messages success! Messages count:", apiData?.messages?.length || 0);
      
      if (apiData && apiData.messages) {
        const mapped: Message[] = apiData.messages.map((m: any) => {
          const authorInfo = m.author || m.users;
          return {
            ...m,
            authorId: m.authorId,
            createdAt: m.createdAt || m.created_at,
            author: authorInfo ? { name: authorInfo.name, role: authorInfo.role } : undefined
          };
        });
        setMessages(mapped);
        return;
      }
      
      throw new Error("No messages in API response");
    } catch (err) {
      console.warn("[useRealtimeMessages] API fetch failed, trying client-side Supabase fallback:", err);
      try {
        const { data, error } = await supabase
          .from('ticket_messages')
          .select('*, users(name, role)')
          .eq('ticketId', ticketId)
          .order('createdAt', { ascending: true });
        
        if (error) {
          console.error("[useRealtimeMessages] Supabase fallback error:", error);
          throw error;
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
      } catch (fallbackErr) {
        console.error("[useRealtimeMessages] Both API and Supabase queries failed:", fallbackErr);
      }
    }
  };

  useEffect(() => {
    if (!ticketId) return;
    fetchMessages();

    // Polling fallback cada 15 segundos para el chat activo
    const intervalId = setInterval(() => {
      console.log(`[useRealtimeMessages] Polling messages for ticket ${ticketId}...`);
      fetchMessages();
    }, 15000);

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
          console.log("[useRealtimeMessages] Realtime new message event! Updating messages...");
          const newMsg = payload.new as any;
          setMessages(prev => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            
            const authorInfo = newMsg.author || newMsg.users;
            return [...prev, {
              ...newMsg,
              authorId: newMsg.authorId,
              createdAt: newMsg.createdAt || newMsg.created_at,
              author: authorInfo ? { name: authorInfo.name, role: authorInfo.role } : undefined
            }];
          });
          
          fetchMessages(); // Traer datos frescos (como la relación author/users)
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [ticketId]);

  return { messages, setMessages, refetch: fetchMessages };
}
