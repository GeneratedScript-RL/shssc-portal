"use client";

import { useEffect, useState } from "react";
import type { PollRecord } from "@/types";

interface PollState {
  poll: PollRecord | null;
  loading: boolean;
}

export function usePoll(id: string) {
  const [state, setState] = useState<PollState>({ poll: null, loading: true });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch(`/api/polls?id=${id}`, { cache: "no-store" });
        const data = await response.json();

        if (mounted) {
          setState({ poll: data.poll ?? null, loading: false });
        }
      } catch {
        if (mounted) {
          setState({ poll: null, loading: false });
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [id]);

  return state;
}
