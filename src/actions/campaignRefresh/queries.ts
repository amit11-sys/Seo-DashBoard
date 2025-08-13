"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { QRCode } from "antd";
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
    // console.log(user);
    console.log(campaignId, "refresh id");

    const refreshCampaign = await Keyword.find({ CampaignId: campaignId });

    const rankdata = await getKewordRank(refreshCampaign);
    // const VolumnData = await getVolumnRank(refreshCampaign);
    const intentData = await getRankIntent(refreshCampaign);

    console.log(rankdata?.rankResponses, "rankdata add");
    // console.log(VolumnData?.volumnResponses, "volumn data add");
    console.log(intentData?.intentResponses, "intent data add");




    // const finalData =
    //   rankdata && "rankResponses" in rankdata
    //     ? rankdata?.rankResponses?.map((rankItem: any) => {
    //         console.log(rankItem, "rankItem in add");
    //         const task = rankItem?.response?.tasks?.[0];
    //         const data = task?.result?.[0];
    //          const newKeyword = rankItem?.keyword
    //         const keyword = data?.keyword;

    //         const matchedKeyword = refreshCampaign.find(
    //           (k: any) => k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
    //         );
    //         console.log(matchedKeyword, "matchedKeyword in add");
    //         // Get corresponding volume data for this keyword
    //         // const volumnResponse = VolumnData?.volumnResponses?.find(
    //         //   (v) => v.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
    //         // );
    //         // const volumeItem =
    //         //   volumnResponse?.response?.tasks?.[0]?.result?.find(
    //         //     (v: any) => v.keyword?.toLowerCase() === keyword?.toLowerCase()
    //         //   );
    //         // const matchSearchVolumn = volumeItem?.search_volume ?? 0;
    //         // const matchcompetition = volumeItem?.competition ?? 0;

    //         // Get corresponding intent data for this keyword
    //         const intentResponse = intentData?.intentResponses?.find(
    //           (i) => i.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
    //         );
    //         const intentItem =
    //           intentResponse?.response?.tasks?.[0]?.result?.[0]?.items?.find(
    //             (i: any) => {
    //               console.log(i, "inside intemt items add");
    //               return i.keyword?.toLowerCase() === keyword?.toLowerCase();
    //             }
    //           );
    //         console.log(
    //           intentResponse?.response?.tasks[0].result[0],
    //           "intent itmes in add task"
    //         );
    //         console.log(intentItem, "intent item itmes add");
    //         const matchIntent = intentItem?.keyword_intent?.label ?? "";

    //         // const matchLangName = locationData?.find(loc => loc.location_code === data?.location_code);

    //         return {
    //           type: task?.data?.se_type,
    //           location_code: matchedKeyword?.searchLocationCode || 2124,
    //           language_code: data?.language_code || "en",
    //           // location_name: matchLangName?.locationName || "",
    //           url: task?.data?.target?.trim() || "no ranking",
    //           rank_group: data?.items?.[0]?.rank_group || 0,
    //           rank_absolute: data?.items?.[0]?.rank_absolute || 0,
    //           keyword: newKeyword || "",
    //           // searchVolumn: matchSearchVolumn,
    //           searchVolumn: 0,
    //           intent: matchIntent,
    //           // competition: matchcompetition,
    //           competition: 0,
    //           campaignId: campaignId,
    //           keywordId: matchedKeyword?._id,
    //         };
    //       })
    //     : [];



    


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
