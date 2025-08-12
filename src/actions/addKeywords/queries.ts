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



// const finalData =
//       rankdata && "rankResponses" in rankdata
//         ? rankdata?.rankResponses?.map((rankItem: any) => {
//             console.log(rankItem, "rankItem");
//             const task = rankItem?.response?.tasks?.[0];
//             const data = task?.result?.[0];
//             const newKeyword = rankItem?.keyword;
//             const keyword = data?.keyword;
//             console.log(keyword, "keyword");
//             const matchedKeyword = newAddKeyword.find(
//               (k) => k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
//             );
//             console.log(matchedKeyword, "matchedKeyword");
//             // Get corresponding volume data for this keyword
//             // const volumnResponse = VolumnData?.volumnResponses?.find(
//             //   (v) => v.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
//             // );
//             // const volumeItem =
//             //   volumnResponse?.response?.tasks?.[0]?.result?.find(
//             //     (v: any) => v.keyword?.toLowerCase() === keyword?.toLowerCase()
//             //   );
//             // const matchSearchVolumn = volumeItem?.search_volume ?? 0;
//             // const matchcompetition = volumeItem?.competition ?? 0;

//             // Get corresponding intent data for this keyword
//             const intentResponse = intentData?.intentResponses?.find(
//               (i) => i.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
//             );
//             const intentItem =
//               intentResponse?.response?.tasks?.[0]?.result?.[0]?.items?.find(
//                 (i: any) => {
//                   console.log(i, "inside intemt items");
//                   return i.keyword?.toLowerCase() === keyword?.toLowerCase();
//                 }
//               );
//             console.log(intentResponse, "intent itmes");
//             console.log(intentItem, "intent item itmes");
//             const matchIntent = intentItem?.keyword_intent?.label ?? "";

//             // const matchLangName = locationData?.find(loc => loc.location_code === data?.location_code);

//             return {
//               type: task?.data?.se_type,
//               location_code: matchedKeyword?.searchLocationCode || 2124,
//               language_code: data?.language_code || "en",
//               // location_name: matchLangName?.locationName || "",
//               url:data?.items?.[0]?.url.trim() || "no ranking",
//               rank_group: data?.items?.[0]?.rank_group || 0,
//               rank_absolute: data?.items?.[0]?.rank_absolute || 0,
//               keyword: newKeyword || "",
//               // searchVolumn: matchSearchVolumn,
//               searchVolumn: 0,
//               intent: matchIntent,
//               // competition: matchcompetition,
//               competition: 0,
//               campaignId: campaignId,
//               keywordId: matchedKeyword?._id,
//               start: data?.items?.[0]?.rank_group || 0,
//             };
//           })
//         : [];


// const finalData:any =
//   rankdata && "rankResponses" in rankdata
//     ? rankdata?.rankResponses?.map((rankItem: any) => {
//         const task = rankItem?.response?.tasks?.[0];
//         const data = task?.result?.[0];
//         const newKeyword = rankItem?.keyword;
//         const keyword = data?.keyword;

//         const matchedKeyword = newAddKeyword.find(
//           (k) => k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
//         );

//         const intentResponse = intentData?.intentResponses?.find(
//           (i) => i.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
//         );
//         const intentItem =
//           intentResponse?.response?.tasks?.[0]?.result?.[0]?.items?.find(
//             (i: any) => i.keyword?.toLowerCase() === keyword?.toLowerCase()
//           );
//         const matchIntent = intentItem?.keyword_intent?.label ?? "";

//         const rankGroup = data?.items?.[0]?.rank_group || 0;

//         return {
//           type: task?.data?.se_type,
//           location_code: matchedKeyword?.searchLocationCode || 2124,
//           language_code: data?.language_code || "en",
//           url: data?.items?.[0]?.url?.trim() || "no ranking",
//           rank_group: rankGroup,
//           rank_absolute: data?.items?.[0]?.rank_absolute || 0,
//           keyword: newKeyword || "",
//           searchVolumn: 0,
//           intent: matchIntent,
//           competition: 0,
//           campaignId:campaignId,
//           keywordId: matchedKeyword?._id,
//           start: rankGroup,

//           // ✅ Based on rank_group
//           keywordsUp: rankGroup > 0 ? 1 : 0,
//           top3: rankGroup <= 3 && rankGroup > 0 ? 1 : 0,
//           top10: rankGroup <= 10 && rankGroup > 0 ? 1 : 0,
//           top20: rankGroup <= 20 && rankGroup > 0 ? 1 : 0,
//           top30: rankGroup <= 30 && rankGroup > 0 ? 1 : 0,
//           top100: rankGroup <= 100 && rankGroup > 0 ? 1 : 0,
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
        console.log(data, "dataIn Loop");

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
             checkUrl : data?.check_url || "no url",
          searchVolumn: 0,
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
