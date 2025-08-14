"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
// import { QRCode } from "antd";
import {
  getKewordRank,
  getRankIntent,
  getVolumnRank,
} from "../keyword/queries";

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
export const refreshAddedKeywords = async (campaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    console.log(campaignId, "refresh id");

    const refreshCampaign = await Keyword.find({ CampaignId: campaignId });

    const rankdata = await getKewordRank(refreshCampaign);
    const intentData = await getRankIntent(refreshCampaign);

    console.log(rankdata?.rankResponses, "rankdata add");
    console.log(intentData?.intentResponses, "intent data add");



    


const allRankGroups =
  rankdata?.rankResponses?.flatMap((rankItem: any) => {
    const task = rankItem?.response?.tasks?.[0];
    const data = task?.result?.[0];
    const rankGroup = data?.items?.[0]?.rank_group;
    return rankGroup !== undefined ? [rankGroup] : [];
  }) || [];

const totalTopRanks = {
  keywordsUp: allRankGroups.filter((r) => r > 0).length,
  top3: allRankGroups.filter((r) => r > 0 && r <= 3).length,
  top10: allRankGroups.filter((r) => r > 0 && r <= 10).length,
  top20: allRankGroups.filter((r) => r > 0 && r <= 20).length,
  top30: allRankGroups.filter((r) => r > 0 && r <= 30).length,
  top100: allRankGroups.filter((r) => r > 0 && r <= 100).length,
};

const finalData: any =
  rankdata && "rankResponses" in rankdata
    ? rankdata?.rankResponses?.map((rankItem: any) => {
        const task = rankItem?.response?.tasks?.[0];
        const data = task?.result?.[0];
        const newKeyword = rankItem?.keyword;

        const matchedKeyword = refreshCampaign.find(
          (k) => k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
        );

        const rankGroup = data?.items?.[0]?.rank_group || 0;

        return {
          type: task?.data?.se_type,
          location_code: matchedKeyword?.searchLocationCode || 2124,
          language_code: data?.language_code || "en",
          url: data?.items?.[0]?.url?.trim() || "no ranking",
          rank_group: rankGroup,
          rank_absolute: data?.items?.[0]?.rank_absolute || 0,
          keyword: newKeyword || "",
          searchVolumn: 0,
            checkUrl : data?.check_url || "no url",
          intent: "", 
          competition: 0,
          campaignId: campaignId,
          keywordId: matchedKeyword?._id,
          start: rankGroup,

          // Use shared total top rank values
          ...totalTopRanks,
        };
      })
    : [];





    const updatedRecords = await KeywordTracking.insertMany(finalData);

    console.log("refresh All records updated:", updatedRecords);

    if (!refreshCampaign) {
      return { error: "Error while refreshing keyword" };
    }
    return {
      success: true,
      message: "Keyword Refresh Successfully",
      updatedRecords,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
