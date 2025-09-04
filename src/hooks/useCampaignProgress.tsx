'use client'
import { useEffect, useState } from "react";

export function useCampaignProgress(campaignId: string, interval = 3000, refreshKey = 0) {
  const [progress, setProgress] = useState<{
    total: number;
    processed: number;
    done: boolean;
  }>({
    total: 0,
    processed: 0,
    done: false,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function fetchProgress() {
      try {
        const res = await fetch(`/api/keywords/progress/${campaignId}`);
        if (res.ok) {
          const data = await res.json();
          setProgress({
            total: data.total,
            processed: data.processed,
            done: data.done,
          });


          if (data.done && timer) {
            clearInterval(timer);
          }
        }
      } catch (e) {
        console.error("Progress fetch failed", e);
      }
    }

    fetchProgress();
    timer = setInterval(fetchProgress, interval);

    return () => clearInterval(timer);
  }, [campaignId, interval, refreshKey]);

  return progress;
}
