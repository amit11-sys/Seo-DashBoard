import { useEffect, useState } from "react";

export function useCampaignProgress(campaignId: string, interval = 3000) {
  const [progress, setProgress] = useState<{ total: number; processed: number }>({
    total: 0,
    processed: 0,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function fetchProgress() {
      try {
        const res = await fetch(`/api/keywords/progress/${campaignId}`);
        if (res.ok) {
          const data = await res.json();
          setProgress({ total: data.total, processed: data.processed });
        }
      } catch (e) {
        console.error("Progress fetch failed", e);
      }
    }

    fetchProgress();
    timer = setInterval(fetchProgress, interval);

    return () => clearInterval(timer);
  }, [campaignId, interval]);

  return progress;
}
