import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import "client-only";
import { IMessage } from "@/app/[locale]/(authenticated)/chats/types";
import { IGoal } from "@/app/[locale]/(authenticated)/games/types";

// Client Component client -
// To access Supabase from Client Components, which run in the browser.

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

const supabase = createClient();

export function useRealtimeMessages(onNewMessage: (msg: IMessage) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as IMessage;
          onNewMessage(newMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewMessage]);
}

export function useRealtimeGoals(
  onNewGoal: (msg: IGoal) => void,
  gameId: string
) {
  useEffect(() => {
    const channel = supabase
      .channel("goals-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "goals" },
        (payload) => {
          const newMessage = payload.new as IGoal;
          if (gameId === newMessage.game_id) onNewGoal(newMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewGoal]);
}
