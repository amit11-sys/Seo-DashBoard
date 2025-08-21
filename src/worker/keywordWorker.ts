import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Worker, JobsOptions } from "bullmq";
import fetch from "node-fetch";
import { getRedis } from "../lib/redis";
import KeywordTracking from "../lib/models/keywordTracking.model"; // adjust path
import mongoose from "mongoose";
import { connectToDB } from "../lib/db"; // your existing db connector

const connection = getRedis();
const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;
console.log(username, password);

if (!username || !password) {
  console.error("❌ DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing in env");
  process.exit(1);
}

(async () => {
  await connectToDB().catch((e) => {
    console.error("❌ Mongo connect error:", e);
    process.exit(1);
  });
})();

export const keywordWorker = new Worker(
  "keywordQueue",
  async (job) => {
    console.log("🟢 Picked job:", job.id, job.name);

    const {
      keywordId,
      keyword,
      location_code,
      language_code,
      target,
      device,
      se_domain,
      campaignId,
      userId,
    } = job.data as {
      keywordId: string;
      keyword: string;
      location_code: number;
      language_code: string;
      target: string;
      device: "desktop" | "mobile";
      se_domain: string;
      campaignId: string;
      userId: string;
    };

    await job.updateProgress(5);

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    const payload = [
      {
        keyword,
        location_code,
        language_name: language_code,
        device,
        se_domain,
        target,
      },
    ];
    console.log(payload, 'sending PAYLOAD');

    try {
      // throttle progress
      await job.updateProgress(10);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result: any = await response.json();

      //   if (!response.ok || result.status_code >= 400) {
      //     console.error("❌ DataForSEO error:", result);
      //     throw new Error(
      //       `DataForSEO error: code=${result.status_code}, message=${result.status_message}`
      //     );
      //   }

      await job.updateProgress(60);

      // Extract first matched item (you can improve matching logic)
      const item = result?.tasks?.[0]?.result?.[0]?.items?.[0];
      const data = result?.tasks?.[0]?.data;
      const data1=result?.tasks?.[0]?.result?.[0]
    //   console.log(data, result?.tasks?.[0], item);
    //   console.log(data1);
      
      await KeywordTracking.create(
        {
          type: data?.se_type,
          location_code: data1?.location_code,
          language_code: data1?.language_code,
          url: target,
          rank_group: item?.rank_group || 0,
          rank_absolute: item?.rank_absolute || 0,
          keyword: data?.keyword || "",
          checkUrl: data1?.check_url || "no url",
          searchVolumn: 0,
          intent: "",
          competition: 0,
          campaignId: campaignId,
          keywordId: keywordId,
          start: item?.rank_group || 0,
        },
        { new: true }
      );

      await job.updateProgress(100);

      console.log(
        `✅ Processed "${keyword}" for target "${target}" — campaign ${campaignId}`
      );
      return { ok: true, keyword, rank_group: item?.rank_group ?? 0 };
    } catch (err) {
      console.error("❌ Worker job error:", err);
      throw err; // let BullMQ mark failed
    }
  },
  {
    connection,
    // Rate-limit to avoid hitting API limits, tune as needed
    limiter: { max: 5, duration: 1000 },
    // Autoscaling/stability options
    concurrency: 3,
  }
);

// Useful worker event logs
keywordWorker.on("active", (job) => {
  console.log(`🚀 Job active: ${job.id}`);
});
keywordWorker.on("completed", (job, res) => {
  console.log(`✅ Job completed: ${job.id}`, res);
});
keywordWorker.on("failed", (job, err) => {
  console.error(`💥 Job failed: ${job?.id}`, err);
});
