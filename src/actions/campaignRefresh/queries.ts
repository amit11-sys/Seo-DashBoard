"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import {
  getKewordRank,

} from "../keyword/queries";
import { getRedis } from "@/lib/redis";
import { keywordQueue } from "@/lib/queue/keywordQueue";
import Campaign from "@/lib/models/campaign.model";

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

interface campaignId {
  campaignId: string;
}
interface compaigntype {
  _id: string;
}
interface KeywordPayload {
  keyword: string;
  location_code: number;
  language_name: string;
  target: string;
}

interface KeywordResponse {
  keyword: any;
  response: any;
}

interface ErrorResponse {
  error: string;
}




export const RefreshSingleKeyword = async (keywordId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(keywordId, "refresh id");

    const singleKeywordForUpdate = await Keyword.findById({ _id: keywordId });
    // console.log(singleKeywordForUpdate, "SingleKeywordForUpdate");

    const rankdata = await getKewordRank(singleKeywordForUpdate);
    // const intentData = await getRankIntent([singleKeywordForUpdate]);

    // 
    // console.log(intentData?.intentResponses, "intent data add");

    // build finalData (unchanged)
    // const allRankGroups =
    //   rankdata?.rankResponses?.flatMap((rankItem: any) => {
    //     const task = rankItem?.response?.tasks?.[0];
    //     const data = task?.result?.[0];
    //     const rankGroup = data?.items?.[0]?.rank_group;
    //     return rankGroup !== undefined ? [rankGroup] : [];
    //   }) || [];

    // const totalTopRanks = {
    //   keywordsUp: allRankGroups.filter((r) => r > 0).length,
    //   top3: allRankGroups.filter((r) => r > 0 && r <= 3).length,
    //   top10: allRankGroups.filter((r) => r > 0 && r <= 10).length,
    //   top20: allRankGroups.filter((r) => r > 0 && r <= 20).length,
    //   top30: allRankGroups.filter((r) => r > 0 && r <= 30).length,
    //   top100: allRankGroups.filter((r) => r > 0 && r <= 100).length,
    // };

    // const finalData: any =
    //   rankdata && "rankResponses" in rankdata
    //     ? rankdata?.rankResponses?.map((rankItem: any) => {
    //         const task = rankItem?.response?.tasks?.[0];
    //         const data = task?.result?.[0];
    //         // const newKeyword = rankItem?.keyword;

    //         // const matchedKeyword = [singleKeywordForUpdate].find(
    //         //   (k: any) =>
    //         //     k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
    //         // );

    //         const rankGroup = data?.items?.[0]?.rank_group || 0;

    //         return {
    //           // type: task?.data?.se_type || "organic",
    //           // location_code: matchedKeyword?.searchLocationCode || 2124,
    //           // language_code: data?.language_code || "en",
    //           // url: data?.items?.[0]?.url?.trim() || "no ranking",
    //           rank_group: rankGroup,
    //           rank_absolute: data?.items?.[0]?.rank_absolute || 0,
    //           // keyword: newKeyword || "",
    //           // searchVolumn: 0,
    //           // checkUrl: data?.check_url || "no url",
    //           // intent: "",
    //           // competition: 0,
    //           // campaignId: singleKeywordForUpdate?.CampaignId || "",
    //           // keywordId: matchedKeyword?._id,
    //           // start: rankGroup,

    //           // shared top rank values
    //           // ...totalTopRanks,

    //           updatedAt: new Date(),
    //         };
    //       })
    //     : [];

    // // ✅ pick the first object
    // const keywordUpdate = finalData[0] || null;
    // const json: any = await rankdata.json();
    // console.log(rankdata, "rankdata single");
    // console.log(rankdata?.result?.tasks?.[0], "coming undefined");
    
    const item = rankdata?.result?.tasks?.[0]?.result?.[0]?.items?.[0];
    const SingleKeywordUpdated = await KeywordTracking.findOneAndUpdate(
      { keywordId },
      {
        $set: {
          rank_group: item?.rank_group ?? 0,
          rank_absolute: item?.rank_absolute ?? 0,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    // console.log(item, "item single");

    // // if (!keywordUpdate) {
    // //   return { error: "No keyword data to update" };
    // // }

    // const SingleKeywordUpdated = await KeywordTracking.findOneAndUpdate(
    //   { keywordId: keywordId },
    //   { $set: keywordUpdate, $setOnInsert: { createdAt: new Date() } },
    //   { upsert: true, new: true }
    // );

    // console.log("refresh All records updated:", SingleKeywordUpdated);

    // if (!SingleKeywordUpdated) {
    //   return { error: "Error while refreshing keyword" };
    // }
    return {
      success: true,
      message: "Keyword Refresh Successfully",
      SingleKeywordUpdated,
    };
  } catch (error) {
    console.log(error);
    return { error: "Internal Server Error." };
  }
};


export async function refreshAddedKeywords(campaignId: string) {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) return { error: "Unauthorized please login" };

    const refreshCampaign = await Keyword.find({
      CampaignId: campaignId,
      status: 1,
    });
    if (!refreshCampaign.length) {
      return { error: "No active keywords to refresh" };
    }

    const redis = getRedis();
    const progressKey = `campaign:${campaignId}:progress`;
    await redis.hset(progressKey, {
      total: refreshCampaign.length,
      processed: 0,
      lastUpdated: String(Date.now()),
    });

    await Campaign.updateOne(
      { _id: campaignId },
      {
        total: refreshCampaign.length,
        processed: 0,
        done: false,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    await Promise.all(
      refreshCampaign.map((kw) =>
        keywordQueue.add("fetchKeywordRanking", {
          keywordId: kw._id.toString(),
          keyword: kw.keywords,
          location_code: kw.searchLocationCode,
          language_code: kw.language,
          target: kw.url,

          device: kw.deviceType,
          se_domain: kw.SearchEngine,
          campaignId: campaignId,
          userId: user.id.toString(),
        })
      )
    );

    const counts = await keywordQueue.getJobCounts();

    return {
      success: true,
      message: "Keywords queued for live ranking",
      queued: refreshCampaign.length,
      counts,
    };
  } catch (err) {
    console.error("refreshAddedKeywords failed:", err);
    return { error: "Internal Server Error." };
  }
}
