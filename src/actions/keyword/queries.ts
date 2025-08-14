import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";

import KeywordTracking from "@/lib/models/keywordTracking.model";

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;
interface compaigntype {
  _id: string;
}
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


export const getVolumnRank = async (KeywordData: any) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const volumnPayload = KeywordData.map((keywordObj: any) => ({
      keywords: [keywordObj.keywords],
      location_code: Number(keywordObj.volumeLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));

    const volumnResponses: KeywordResponse[] = [];

    for (const item of volumnPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/liveee"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify([item]),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
        );
        volumnResponses.push({ keyword: item.keywords, response: null });
      } else {
        const result = await res.json();

        volumnResponses.push({ keyword: item.keywords, response: result });
      }
    }

    console.log(volumnResponses, "volumn response");


    if (!KeywordData) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "volumn data  Successfully",
      volumnResponses,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const getRankIntent = async (KeywordData: any) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }


    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const intentPayload = KeywordData.map((keywordObj: any) => ({
      keywords: [keywordObj.keywords],
      location_code: Number(keywordObj.searchLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));

    console.log(intentPayload, "intent payload compaign");

    const intentResponses: KeywordResponse[] = [];

    for (const item of intentPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"dataforseo_labs/google/search_intent/liveee"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify([item]),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
        );
        intentResponses.push({ keyword: item.keywords, response: null });
      } else {
        const result = await res.json();

        intentResponses.push({ keyword: item.keywords, response: result });
      }
    }

    console.log(intentResponses, "intent response");


    if (!KeywordData) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "intent Responses Successfully",
      intentResponses,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const getKewordRank = async (KeywordData: any) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }


    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const rankPayload: KeywordPayload[] = KeywordData.map(
      (keywordObj: any) => ({
        keyword: keywordObj.keywords,
        location_code: Number(keywordObj.searchLocationCode),
        language_name: keywordObj.language,
        target: `*${keywordObj.url}*`,
        device: keywordObj.deviceType,
        se_domain: keywordObj.SearchEngine,
      })
    );

    console.log(rankPayload, "rank payload compaign");

    const rankResponses: KeywordResponse[] = [];

    for (const item of rankPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify([item]),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          `Request failed for ${item.keyword}: ${res.status} - ${errorBody}`
        );
        rankResponses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        rankResponses.push({ keyword: item.keyword, response: result });
      }
    }

    console.log(rankResponses, "rank response");

    if (!KeywordData) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "rank Data Successfully",
      rankResponses,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

type KeywordUpdateData = {
  keywords?: string; // NOTE: your DB expects this as string (not array)
  SearchEngine?: string;
  deviceType?: string;
  keywordTag?: string;
  language?: string;
  searchLocation?: string;
  serpType?: string;
  url?: string;
  volumeLocation?: string;
  campaignId?: string;
  keywordId: string;
};
export const deleteKeywordById = async (deletedData: { keywordId: string }) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { keywordId } = deletedData;
    console.log(keywordId, "delet id");

    // ✅ Update keyword document status to 2 (soft delete)
    const modifiedStatusKeyword = await KeywordTracking.findOneAndUpdate(
      { keywordId },
      { $set: { status: 2 } },
      { new: true }
    );

    console.log(modifiedStatusKeyword, "status del");

    if (!modifiedStatusKeyword) {
      return { error: "Keyword delete failed" };
    }

    return {
      success: true,
      message: "Keyword deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete failed:", error);
    return {
      error: "Internal Server Error",
    };
  }
};
export const updateKeywordById = async (updatedData: KeywordUpdateData) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { keywordId, campaignId } = updatedData;
   

    const updatedKeyword = await Keyword.findByIdAndUpdate(
      { _id: keywordId },
      { $set: updatedData },
      { new: true }
    );

    console.log(updatedKeyword, "updated keywoerds");
    if (!updatedKeyword) {
      return { error: "Keyword not found" };
    }
    console.log(updatedKeyword, ";updated keywoerds");

    const rankdata = await getKewordRank([updatedKeyword]);
   
    const intentData = await getRankIntent([updatedKeyword]);

    console.log(rankdata?.rankResponses , "rankdata");
    console.log(intentData?.intentResponses, "intent data");

   


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

        const matchedKeyword = [updatedKeyword].find(
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
          intent: "", 
          competition: 0,
          campaignId: campaignId,
          keywordId: matchedKeyword?._id,
          start: rankGroup,

         //rank top
          ...totalTopRanks,
        };
      })
    : [];



    const data = finalData?.[0];
    const addedTracking = await KeywordTracking.findOneAndUpdate(
      { keywordId: keywordId },
      { $set: data },
      { new: true }
    );
    console.log(finalData, "final data");

    return {
      success: true,
      message: "Keyword updated ",
      editedKeyword: [updatedKeyword],
      tracking: addedTracking,
    };
  } catch (error: any) {
    console.error("Update failed:", error);
    return {
      error: "Internal Server Error",
    };
  }
};

export const saveMultipleKeyword = async (
  formData: any,
  campaign: compaigntype
) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const addKeyword = await Promise.all(
      formData?.keyword?.map(async (singleKeyword: string) => {
        const { keywords, ...rest } = formData;
        return await Keyword.create({
          ...rest,
          keywords: singleKeyword,
          userId: user?.id,
          CampaignId: campaign?._id,
        });
      })
    );

    console.log(addKeyword, "campgin kewywords");

    const rankdata = await getKewordRank(addKeyword);
    const intentData = await getRankIntent(addKeyword);

    console.log(rankdata?.rankResponses, "rankdata");
    console.log(intentData?.intentResponses, "intent data");

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

        const matchedKeyword = addKeyword.find(
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
          intent: "", // Skipped intent match to save time
          competition: 0,
          campaignId: campaign?._id,
            checkUrl : data?.check_url || "no url",
          keywordId: matchedKeyword?._id,
          start: rankGroup,

          // ✅ Use shared total top rank values
          ...totalTopRanks,
        };
      })
    : [];

      console.log(finalData, "finalDatawithrank");







    console.log(finalData, "data records ✅");

    const addedKeywords = await KeywordTracking.insertMany(finalData);
    console.log(addedKeywords, "campagign return keywrods");

    if (!addKeyword) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "Keyword & compaign Added Successfully",
      addedKeywords,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
