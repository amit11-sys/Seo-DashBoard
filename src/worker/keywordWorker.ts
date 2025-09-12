// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });
// import { Worker } from "bullmq";
// import { getRedis } from "../lib/redis";
// import { connectToDB } from "../lib/db";
// import KeywordTracking from "../lib/models/keywordTracking.model";
// import Campaign from "../lib/models/campaign.model";

// const connection = getRedis();
// const LOGIN = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
// const PASSWORD = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;
// const BASE = process.env.DATAFORSEO_BASE ?? "https://api.dataforseo.com/v3/";

// if (!LOGIN || !PASSWORD) {
//   console.error("❌ DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing");
//   process.exit(1);
// }

// (async () => {
//   await connectToDB().catch((e) => {
//     console.error("❌ Mongo connect error:", e);
//     process.exit(1);
//   });
// })();
// const endpoint = `${BASE}serp/google/organic/live/advanced`;

// export const keywordWorker = new Worker(
//   "keywordQueue",
//   async (job) => {
//     const {
//       campaignId,
//       keywordId,
//       userId,
//       keyword,
//       location_code,
//       language_code,
//       device,
//       se_domain,
//       target,
//     } = job.data as {
//       campaignId: string;
//       keywordId: string;
//       userId?: string | null;
//       keyword: string;
//       location_code: number;
//       language_code: string;
//       device: "desktop" | "mobile";
//       se_domain: string;
//       target: string;
//     };

//     const redis = getRedis();
//     const progressKey = `campaign:${campaignId}:progress`;

//     const basicAuth = Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");
//       const payload = [
//         {
//           keyword,
//           location_code,
//           language_name: language_code,
//           device,
//           se_domain,
//           target: `*${target}*`,
//         },
//       ];
//         try {
//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Authorization: `Basic ${basicAuth}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//   if (!res.ok) {
//     const errorBody = await res.text();
//     throw new Error(
//       `❌ DataForSEO failed: ${res.status} - ${errorBody}`
//     );
//   }
//       const json: any = await res.json();

//       const item = json?.tasks?.[0]?.result?.[0]?.items?.[0];
//       const data = json?.tasks?.[0]?.data;
//       const meta = json?.tasks?.[0]?.result?.[0];

//       await KeywordTracking.findOneAndUpdate(
//         { keywordId, campaignId }, // filter
//         {
//           $set: {
//             rank_group: item?.rank_group ?? 0,
//             rank_absolute: item?.rank_absolute ?? 0,
//             updatedAt: new Date(),
//           },
//           $setOnInsert: {
//             keywordId,
//             campaignId,
//             keyword: data?.keyword ?? keyword,
//             url: target,
//             type: data?.se_type,
//             location_code: meta?.location_code,
//             language_code: meta?.language_code,
//             checkUrl: meta?.check_url ?? "no url",
//             searchVolumn: 0,
//             intent: "",
//             competition: 0,
//             start: item?.rank_group ?? 0,
//             userId: userId ?? null,
//           },
//         },
//         { upsert: true, returnDocument: "after" }
//       );

//       // Update progress
//       await redis.hincrby(progressKey, "processed", 1);
//       await redis.hset(progressKey, "lastUpdated", String(Date.now()));

//       const total = Number((await redis.hget(progressKey, "total")) || 0);
//       const processed = Number(
//         (await redis.hget(progressKey, "processed")) || 0
//       );
//       if (processed >= total) {
//         await redis.del(progressKey);
//       }
//       await Campaign.updateOne(
//         { _id: campaignId },
//         {
//           total,
//           processed,
//           done: processed >= total && total > 0,
//           lastUpdated: new Date(),
//         },
//         { upsert: true }
//       );

//       console.log(
//         `✅ [${campaignId}] ${processed}/${total} processed — "${keyword}"`
//       );
//     } catch (err) {
//       console.error(
//         `💥 Error processing campaign ${campaignId}, keyword "${keyword}"`,
//         err
//       );
//       await redis.del(progressKey);
//       throw err;
//     }
//   },
//   {
//     connection,
//     concurrency: 3,
//     limiter: { max: 5, duration: 1000 },
//   }
// );

// keywordWorker.on("active", (job) => {
//   console.log(`🚀 Job active: ${job.id}`);
// });
// keywordWorker.on("completed", (job) => {
//   console.log(`✅ Job completed: ${job.id}`);
// });
// keywordWorker.on("failed", (job, err) => {
//   console.error(`💥 Job failed: ${job?.id}`, err);
// });



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
const BASE = process.env.DATAFORSEO_BASE ?? "https://api.dataforseo.com/v3/";
const endpoint = `${BASE}serp/google/organic/live/advanced`;

// helper functions for 6-month history
function getLast6Months(currentRank: number | string = "-") {
  const now = new Date();
  const months: { month: string; rank: number | string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString("default", { month: "short" });
    months.push({ month: monthName, rank: currentRank || "-" });
  }
  return months.reverse();
}

function updatePastData(
  pastData: { month: string; rank: number | string }[] = [],
  newRank: number | string = "-"
) {
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "short" });

  if (!pastData.length) return getLast6Months(newRank);

  const lastEntry = pastData[pastData.length - 1];

  if (lastEntry.month === currentMonth) {
    lastEntry.rank = newRank;
    return [...pastData];
  } else {
    const updated = [...pastData.slice(1)];
    updated.push({ month: currentMonth, rank: newRank });
    return updated;
  }
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
    const payload = [
      {
        keyword,
        location_code,
        language_name: language_code,
        device,
        se_domain,
        target: `*${target}*`,
      },
    ];

    try {
      await connectToDB();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`❌ DataForSEO failed: ${res.status} - ${errorBody}`);
      }

      const json: any = await res.json();
      const item = json?.tasks?.[0]?.result?.[0]?.items?.[0];
      const data = json?.tasks?.[0]?.data;
      const meta = json?.tasks?.[0]?.result?.[0];

      // 🔄 Fetch previous record
      const prevKeywordTracking:any = await KeywordTracking.findOne({
        keywordId,
        campaignId,
      });
      const now = new Date();

      // 🔄 Update pastData (6-month history)
      const pastData = updatePastData(prevKeywordTracking?.pastData, item?.rank_group ?? 0);

      // 🔄 7-day rule for rankChange/changeDirection
      let rankChange = null;
      let changeDirection: "up" | "down" | null = null;

      const oldRank = prevKeywordTracking?.rank_group ?? 0;
      const newRank = item?.rank_group ?? 0;

      const forceRefresh =
        !prevKeywordTracking?.rankChange || prevKeywordTracking?.rankChange === 0;

      const sevenDaysPassed =
        prevKeywordTracking?.lastUpdatedAt &&
        (now.getTime() - prevKeywordTracking.lastUpdatedAt.getTime()) / (1000 * 60 * 60 * 24) >= 7;

      if ((forceRefresh || sevenDaysPassed) && oldRank !== newRank) {
        const diff = oldRank - newRank;
        if (diff > 0) {
          rankChange = diff;
          changeDirection = "up";
        } else {
          rankChange = Math.abs(diff);
          changeDirection = "down";
        }
      }

      // 🔄 Update or insert record
      await KeywordTracking.findOneAndUpdate(
        { keywordId, campaignId },
        {
          $set: {
            rank_group: newRank,
            rank_absolute: item?.rank_absolute ?? 0,
            updatedAt: now,
            rankChange,
            changeDirection,
            lastUpdatedAt: rankChange ? now : prevKeywordTracking?.lastUpdatedAt,
            pastData,
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
            intent: "",
            competition: 0,
            start: newRank,
            userId: userId ?? null,
          },
        },
        { upsert: true, returnDocument: "after" }
      );

      // Update progress
      await redis.hincrby(progressKey, "processed", 1);
      await redis.hset(progressKey, "lastUpdated", String(Date.now()));

      const total = Number((await redis.hget(progressKey, "total")) || 0);
      const processed = Number((await redis.hget(progressKey, "processed")) || 0);
      if (processed >= total) await redis.del(progressKey);

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

      console.log(`✅ [${campaignId}] ${processed}/${total} processed — "${keyword}"`);
    } catch (err) {
      console.error(`💥 Error processing campaign ${campaignId}, keyword "${keyword}"`, err);
      await redis.del(progressKey);
      throw err;
    }
  },
  { connection, concurrency: 3, limiter: { max: 5, duration: 1000 } }
);

keywordWorker.on("active", (job) => console.log(`🚀 Job active: ${job.id}`));
keywordWorker.on("completed", (job) => console.log(`✅ Job completed: ${job.id}`));
keywordWorker.on("failed", (job, err) => console.error(`💥 Job failed: ${job?.id}`, err));
