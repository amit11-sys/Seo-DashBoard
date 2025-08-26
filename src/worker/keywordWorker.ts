import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Worker } from "bullmq";
import fetch from "node-fetch";
import { getRedis } from "../lib/redis";
import { connectToDB } from "../lib/db"; 
import KeywordTracking from "../lib/models/keywordTracking.model";

const connection = getRedis();
const LOGIN = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const PASSWORD = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;
const BASE = process.env.DATAFORSEO_BASE ?? "https://api.dataforseo.com/v3/";

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
const endpoint = `${BASE}serp/google/organic/live/advanced`;

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
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json: any = await res.json();

    const item = json?.tasks?.[0]?.result?.[0]?.items?.[0];
    const data = json?.tasks?.[0]?.data;
    const meta = json?.tasks?.[0]?.result?.[0];

    // Persist a row per keyword run (recommended)
    await KeywordTracking.create({
      type: data?.se_type,
      location_code: meta?.location_code,
      language_code: meta?.language_code,
      url: target,
      rank_group: item?.rank_group ?? 0,
      rank_absolute: item?.rank_absolute ?? 0,
      keyword: data?.keyword ?? keyword,
      checkUrl: meta?.check_url ?? "no url",
      searchVolumn: 0,
      intent: "",
      competition: 0,
      campaignId: campaignId,
          keywordId: keywordId,
      start: item?.rank_group ?? 0,
      userId: userId ?? null,
      // ...any other fields in your model
    });

    // Update progress
    await redis.hincrby(progressKey, "processed", 1);
    await redis.hset(progressKey, "lastUpdated", String(Date.now()));

    const total = Number((await redis.hget(progressKey, "total")) || 0);
    const processed = Number((await redis.hget(progressKey, "processed")) || 0);
    console.log(`✅ [${campaignId}] ${processed}/${total} processed — "${keyword}"`);
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
