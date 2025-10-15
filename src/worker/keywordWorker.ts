

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Worker } from "bullmq";
import { getRedis } from "../lib/redis";
import { connectToDB } from "../lib/db";
import KeywordTracking from "../lib/models/keywordTracking.model";
import Campaign from "../lib/models/campaign.model";

const connection = getRedis();
const LOGIN = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const PASSWORD = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;
const BASE = process.env.DATAFORSEO_BASE;

if (!LOGIN || !PASSWORD) {
  console.error("❌ DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing");
  process.exit(1);
}

(async () => {
  await connectToDB().catch((e) => {
    console.error("❌ Mongo connect error:", e);
    process.exit(1);
  });
})();
// const endpoint = `${BASE}serp/google/organic/live/advanced`;

const rankEndpoint = `${BASE}serp/google/organic/live/advanced`;
const intentEndpoint = `${BASE}dataforseo_labs/google/search_intent/live`;

// function getLast6Months(currentRank: number | string = "-") {
//   const now = new Date();
//   const months: { month: string; rank: number | string }[] = [];
//   for (let i = 0; i < 6; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     const monthName = d.toLocaleString("default", { month: "short" });
//     months.push({ month: monthName, rank: currentRank || "-" });
//   }
//   return months.reverse();
// }

// ✅ helper: update pastData
// function updatePastData(
//   pastData: { month: string; rank: number | string }[] = [],
//   newRank: number | string = "-"
// ) {
//   const now = new Date();
//   const currentMonth = now.toLocaleString("default", { month: "short" });

//   if (!pastData.length) return getLast6Months(newRank);

//   const lastEntry = pastData[pastData.length - 1];

//   if (lastEntry.month === currentMonth) {
//     lastEntry.rank = newRank;
//     return [...pastData];
//   } else {
//     const updated = [...pastData.slice(1)];
//     updated.push({ month: currentMonth, rank: newRank });
//     return updated;
//   }
// }


// function getLast6Months(pastData: { month: string; rank: number | string }[] = []) {
//   const now = new Date();
//   const months: { month: string; rank: number | string }[] = [];

//   for (let i = 5; i >= 0; i--) {
//     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     const monthName = d.toLocaleString("default", { month: "short" });

//     // check if pastData has a rank for this month
//     const existing = pastData.find((p) => p.month === monthName);

//     months.push({ month: monthName, rank: existing ? existing.rank : "-" });
//   }

//   return months;
// }

// ✅ Generate last 6 months aligned with pastData



function getLast6MonthsForDisplay(pastData: { month: string; rank: number | string }[] = []) {
  const now = new Date();
  const months: { month: string; rank: number | string }[] = [];

  // last 6 months, oldest first
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString("default", { month: "short" });

    // find rank for this month if exists
    const existing = pastData.find((p) => p.month === monthName);
    months.push({ month: monthName, rank: existing ? existing.rank : "-" });
  }

  return months;
}

// ✅ Update pastData for current month only
function updatePastData(
  pastData: { month: string; rank: number | string }[] = [],
  newRank: number | string = "-"
) {
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "short" });

  const updatedData = [...pastData];
  const existingIndex = updatedData.findIndex((p) => p.month === currentMonth);

  if (existingIndex !== -1) {
    updatedData[existingIndex].rank = newRank;
  } else {
    updatedData.push({ month: currentMonth, rank: newRank });
  }

  return updatedData;
}



export const keywordWorker = new Worker(
  "keywordQueue",
  async (job) => {
    const {
      campaignId,
      keywordId,
      userId,
      keyword,
      location_code,
      language_code,
      device,
      se_domain,
      target,
    } = job.data as {
      campaignId: string;
      keywordId: string;
      userId?: string | null;
      keyword: string;
      location_code: number;
      language_code: string;
      device: "desktop" | "mobile";
      se_domain: string;
      target: string;
    };

    const redis = getRedis();
    const progressKey = `campaign:${campaignId}:progress`;

    const basicAuth = Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");
      const rankPayload = [
      {
        keyword,
        location_code,
        language_name: language_code,
        device,
        se_domain,
        target: `*${target}*`,
      },
    ];
    const intentPayload = [
      {
        keywords: [keyword],
        location_code,
        language_name: language_code,
        device,
        se_domain,
        target: `*${target}*`,
      },
    ];

    try {
      const [rankResponse, intentRankResponse] = await Promise.all([
        fetch(rankEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rankPayload),
        }),
        fetch(intentEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(intentPayload),
        }),
      ]);

      if (!rankResponse.ok) {
        const errorBody = await rankResponse.text();
        throw new Error(
          `❌ DataForSEO failed: ${rankResponse.status} - ${errorBody}`
        );
      }

      const [json, intentJson] = await Promise.all([
        rankResponse.json(),
        intentRankResponse.json(),
      ]);


      const item = json?.tasks?.[0]?.result?.[0]?.items?.[0];
      const data = json?.tasks?.[0]?.data;
      const meta = json?.tasks?.[0]?.result?.[0];

      
      const intentTask = intentJson?.tasks?.[0];
      const intentResult = intentTask?.result?.[0];
      const intentItem = intentResult?.items?.[0];
      const intent = intentItem?.keyword_intent?.label ?? "";

      // 🔄 Fetch previous record
      const prevKeywordTracking: any = await KeywordTracking.findOne({
        keywordId,
        campaignId,
      });
      const now = new Date();

      // 🔄 Update pastData (6-month history)
      // const pastData = updatePastData(
      //   prevKeywordTracking?.pastData || [],
      //   item?.rank_group ?? 0
      // );

let pastData:any = [];
pastData = updatePastData(prevKeywordTracking?.pastData || pastData, 5); // Oct rank = 5
console.log(getLast6MonthsForDisplay(pastData),"pastData");


      // 🔄 7-day rule
      let rankChange = 0;
      let changeDirection: "up" | "down" | "" = "";

      const oldRank = prevKeywordTracking?.rank_group ?? 0;
      const newRank = item?.rank_group ?? 0;

      const lastUpdate = prevKeywordTracking?.lastUpdatedAt;
      const daysSinceUpdate = lastUpdate
        ? (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
        : 999; // if no previous update → force

      if (daysSinceUpdate >= 7) {
        // ✅ Only update after 7+ days
        const diff = oldRank - newRank;
        if (oldRank > 0 && newRank > 0 && oldRank !== newRank) {
          if (diff > 0) {
            rankChange = diff;
            changeDirection = "up";
          } else {
            rankChange = Math.abs(diff);
            changeDirection = "down";
          }
        }
      } else {
        //  Less than 7 days → keep old values
        rankChange = prevKeywordTracking?.rankChange ?? 0;
        changeDirection = prevKeywordTracking?.changeDirection ?? "";
      }

      const lastUpdatedAt =
        daysSinceUpdate >= 7
          ? now
          : (prevKeywordTracking?.lastUpdatedAt);


      await KeywordTracking.findOneAndUpdate(
        { keywordId, campaignId }, 
        {
          $set: {
            rank_group: item?.rank_group ?? 0,
            rank_absolute: item?.rank_absolute ?? 0,
            updatedAt: new Date(),
             rankChange,
            changeDirection,
            lastUpdatedAt,
            // pastData,
            
          },
          $setOnInsert: {
            keywordId,
            campaignId,
            keyword: data?.keyword ?? keyword,
            url: target,
            type: data?.se_type,
            location_code: meta?.location_code,
            language_code: meta?.language_code,
            checkUrl: meta?.check_url ?? "no url",
            searchVolumn: 0,
            intent,
            competition: 0,
            start: item?.rank_group ?? 0,
            userId: userId ?? null,
          },
        },
        { upsert: true, returnDocument: "after" }
      );

      // Update progress
      await redis.hincrby(progressKey, "processed", 1);
      await redis.hset(progressKey, "lastUpdated", String(Date.now()));

      const total = Number((await redis.hget(progressKey, "total")) || 0);
      const processed = Number(
        (await redis.hget(progressKey, "processed")) || 0
      );
      if (processed >= total) {
        await redis.del(progressKey);
      }
      await Campaign.updateOne(
        { _id: campaignId },
        {
          total,
          processed,
          done: processed >= total && total > 0,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );

      console.log(
        `✅ [${campaignId}] ${processed}/${total} processed — "${keyword}"`
      );
    } catch (err) {
      console.error(
        `💥 Error processing campaign ${campaignId}, keyword "${keyword}"`,
        err
      );
      await redis.del(progressKey);
      throw err;
    }
  },
  {
    connection,
    concurrency: 3,
    limiter: { max: 5, duration: 1000 },
  }
);

keywordWorker.on("active", (job) => {
  console.log(`🚀 Job active: ${job.id}`);
});
keywordWorker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});
keywordWorker.on("failed", (job, err) => {
  console.error(`💥 Job failed: ${job?.id}`, err);
});
