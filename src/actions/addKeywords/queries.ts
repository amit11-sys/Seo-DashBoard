import mongoose from "mongoose";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";

import { getRedis } from "@/lib/redis";
import { keywordQueue } from "@/lib/queue/keywordQueue";
interface KeywordPayload {
  keyword: string;
  location_code: number;
  language_name: string;
}
interface KeywordResponse {
  keyword: any;
  response: any;
}

interface ErrorResponse {
  error: string;
}
const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

export const addkeywords = async (formData: any) => {
  await connectToDB();
  const user = await getUserFromToken();
  if (!user) return { error: "Unauthorized please login" };

  const campaignId = formData?.campaignId;
  // console.log(campaignId, "campaignId");
  // console.log(formData, "formData input");

  formData.keywords = Array.from(
    new Set(
      (formData?.keywords || []).map((k: string) => k.trim().toLowerCase())
    )
  );

  const userIdObj = new mongoose.Types.ObjectId(user.id);
  const campaignIdObj = new mongoose.Types.ObjectId(campaignId);

  const existingKeywordDocs = await Keyword.find({
    keywords: { $in: formData.keywords },
    userId: userIdObj,
    CampaignId: campaignIdObj,
    searchLocationCode: formData.searchLocationCode, // ✅ include location
  }).select("keywords searchLocationCode");

  const existingSet = new Set(
    existingKeywordDocs.map(
      (doc) => `${doc.keywords}|${doc.searchLocationCode}`
    )
  );

  formData.keywords = formData.keywords.filter(
    (kw: string) => !existingSet.has(`${kw}|${formData.searchLocationCode}`)
  );

  // console.log(formData.keywords, "keywords to insert");

  const createdKeywords =
    formData?.keywords?.length > 0
      ? await Keyword.insertMany(
          formData.keywords.map((kw: string) => ({
            ...formData,
            keywords: kw,
            userId: userIdObj,
            CampaignId: campaignIdObj,
          }))
        )
      : [];

  // console.log(createdKeywords, "created keywords");

  // Redis progress setup
  const redis = getRedis();
  const progressKey = `campaign:${campaignId}:progress`;
  await redis.hset(progressKey, {
    total: String(createdKeywords.length),
    processed: "0",
    lastUpdated: String(Date.now()),
  });
  await redis.expire(progressKey, 60 * 60);

  // Queue jobs
  await Promise.all(
    createdKeywords.map((kw) =>
      keywordQueue.add("fetchKeywordRanking", {
        keywordId: kw._id.toString(),
        keyword: kw.keywords,
        location_code: kw.searchLocationCode,
        language_code: kw.language,
        target: kw.url,
        device: kw.deviceType,
        se_domain: kw.SearchEngine,
        campaignId: campaignId.toString(),
        userId: user.id.toString(),
      })
    )
  );

  const counts = await keywordQueue.getJobCounts();

  return {
    success: true,
    message: "Keywords queued for live ranking",
    queued: createdKeywords.length,
    counts,
  };
};
