import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { getDbLiveKeywordData } from "../keywordTracking";
// import { getLocation_languageData } from "../locations_Language";
import { getKewordRank, getRankIntent, getVolumnRank } from "../keyword/queries";
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
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    console.log(formData, "formdata addd");
    const campaignId = formData?.campaignId; // ✅ FIXED
    // console.log(campaignId, "formdat id");
    const { keywords, ...rest } = formData;

    const newAddKeyword = await Promise.all(
      keywords.map(async (singleKeyword: string) => {
        return await Keyword.create({
          ...rest,
          keywords: singleKeyword,
          userId: user.id,
          CampaignId: campaignId, // ✅ FIXED
        });
      })
    );

    console.log(newAddKeyword,"newAddKeyword in add")

const rankdata = await getKewordRank(newAddKeyword)
    // const VolumnData = await getVolumnRank(newAddKeyword)
    const intentData = await getRankIntent(newAddKeyword)

    console.log(rankdata?.rankResponses,"rankdata add")
    // console.log(VolumnData?.volumnResponses,"volumn data add")
    console.log(intentData?.intentResponses,"intent data add")





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

        const matchedKeyword = newAddKeyword.find(
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
          intent: "", // Skipped intent match to save time
          competition: 0,
          campaignId: campaignId,
          keywordId: matchedKeyword?._id,
          start: rankGroup,

          // ✅ Use shared total top rank values
          ...totalTopRanks,
        };
      })
    : [];



    const addedKeywords = await KeywordTracking.insertMany(finalData);
    console.log(addedKeywords,"return keywrods add")

    return {
      success: true,
      message: "New keywords successfully added",
    
      addedKeywords,
    };
  } catch (error) {
    console.log(error);
    return { error: "Internal Server Error." };
  }
};
