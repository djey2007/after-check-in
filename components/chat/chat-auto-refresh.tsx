"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ChatAutoRefreshProps = {
  intervalMs?: number;
};

export function ChatAutoRefresh({ intervalMs = 3000 }: ChatAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, router]);

  useEffect(() => {
    document.getElementById("chat-bottom")?.scrollIntoView({ block: "end" });
  });

  return null;
}
