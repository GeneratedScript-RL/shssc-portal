"use client";

import { useEffect } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";

interface UseRealtimeOptions {
  channel: string;
  schema?: string;
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onChange: (payload: any) => void;
}

export function useRealtime({
  channel,
  schema = "public",
  table,
  filter,
  event = "*",
  onChange,
}: UseRealtimeOptions) {
  useEffect(() => {
    const supabase = createBrowserClient();
    let realtimeChannel: RealtimeChannel | null = supabase.channel(channel);

    realtimeChannel = realtimeChannel.on(
      "postgres_changes",
      {
        event,
        schema,
        table,
        filter,
      },
      onChange,
    );

    realtimeChannel.subscribe();

    return () => {
      if (realtimeChannel) {
        void supabase.removeChannel(realtimeChannel);
      }
    };
  }, [channel, event, filter, onChange, schema, table]);
}
